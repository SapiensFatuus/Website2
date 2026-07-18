import test from 'node:test'
import assert from 'node:assert/strict'
import {
  TUTOR_IMAGE_DAILY_LIMIT,
  TUTOR_IMAGE_MAX_BYTES,
  getUtcDay,
  isValidTutorImagePath,
  parseStudyTutorInput,
  reserveQuotaState,
  runStudyTutorRequest,
  validateTutorImageMetadata,
} from './studyTutor.js'

const chemistryTarget = { scope: 'subject', examId: 'ap', subjectId: 'ap-chemistry' }
const uid = 'student-123'
const storagePath = `tutor-uploads/${uid}/123e4567-e89b-12d3-a456-426614174000.jpg`

test('study tutor accepts AP Chemistry text requests and optional private attachment paths', () => {
  const textOnly = parseStudyTutorInput({ target: chemistryTarget, message: 'Explain Q and K.', history: [] })
  assert.equal(textOnly.attachment, undefined)

  const withImage = parseStudyTutorInput({
    target: chemistryTarget,
    message: 'Where is my ICE table wrong?',
    history: [],
    attachment: { storagePath },
  })
  assert.equal(withImage.attachment.storagePath, storagePath)
})

test('attachment ownership, type, and size checks reject unsafe files', () => {
  assert.equal(isValidTutorImagePath(uid, storagePath), true)
  assert.equal(isValidTutorImagePath('another-user', storagePath), false)
  assert.equal(isValidTutorImagePath(uid, `tutor-uploads/${uid}/not-a-uuid.jpg`), false)
  assert.equal(validateTutorImageMetadata({ contentType: 'image/jpeg', size: TUTOR_IMAGE_MAX_BYTES }), true)
  assert.equal(validateTutorImageMetadata({ contentType: 'application/pdf', size: 100 }), false)
  assert.equal(validateTutorImageMetadata({ contentType: 'image/png', size: TUTOR_IMAGE_MAX_BYTES + 1 }), false)
})

test('quota reservations cap concurrent photo analyses and only completed calls count', () => {
  const now = Date.UTC(2026, 6, 18)
  const nearlyFull = { successfulCount: TUTOR_IMAGE_DAILY_LIMIT - 1, reservations: {} }
  const first = reserveQuotaState(nearlyFull, 'request-1', now)
  assert.equal(first.allowed, true)
  const second = reserveQuotaState(first.state, 'request-2', now)
  assert.equal(second.allowed, false)
  const stale = reserveQuotaState({
    successfulCount: TUTOR_IMAGE_DAILY_LIMIT - 1,
    reservations: { old: now - 1 },
  }, 'request-3', now)
  assert.equal(stale.allowed, true)
  assert.equal(getUtcDay(new Date('2026-07-18T23:59:59Z')), '2026-07-18')
})

test('a successful image request uses the temporary gs reference, counts once, and deletes it', async () => {
  let usage = {}
  let deleted = false
  const db = {
    collection: () => ({
      doc: () => ({
        collection: () => ({ doc: () => usageDoc }),
      }),
    }),
    runTransaction: async (callback) => callback({
      get: async () => ({ exists: Object.keys(usage).length > 0, data: () => usage }),
      set: (_reference, next) => { usage = next },
    }),
  }
  const usageDoc = { firestore: db }
  const bucket = {
    name: 'private-tutor-bucket',
    file: () => ({
      exists: async () => [true],
      getMetadata: async () => [{ contentType: 'image/jpeg', size: '1234' }],
      delete: async () => { deleted = true },
    }),
  }

  const response = await runStudyTutorRequest({
    target: chemistryTarget,
    message: 'Can you check this ICE table?',
    history: [],
    attachment: { storagePath },
  }, {
    uid,
    db,
    bucket,
    now: new Date(Date.UTC(2026, 6, 18)),
    generate: async (_input, attachment) => {
      assert.deepEqual(attachment, { url: `gs://private-tutor-bucket/${storagePath}`, contentType: 'image/jpeg' })
      return { reply: 'Original explanation.', sourceIds: [], sources: [], suggestedFollowUp: null, effectiveTarget: chemistryTarget, classification: null }
    },
  })

  assert.equal(response.reply, 'Original explanation.')
  assert.equal(deleted, true)
  assert.equal(usage.successfulCount, 1)
  assert.deepEqual(usage.reservations, {})
})
