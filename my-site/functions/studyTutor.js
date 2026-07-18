import { randomUUID } from 'node:crypto'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { z } from 'genkit'
import { TutorInputSchema, runTutorRequest } from './satMathTutor.js'

export const TUTOR_IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const TUTOR_IMAGE_DAILY_LIMIT = 10
export const TUTOR_IMAGE_RESERVATION_MS = 10 * 60 * 1000
export const TUTOR_IMAGE_TYPES = Object.freeze(['image/jpeg', 'image/png', 'image/webp'])

export const StudyTutorInputSchema = TutorInputSchema.extend({
  attachment: z.object({ storagePath: z.string().min(1).max(240) }).optional(),
})

export class StudyTutorError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

export function getUtcDay(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

export function isValidTutorImagePath(uid, storagePath) {
  if (!uid || typeof storagePath !== 'string') return false
  const escapedUid = uid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^tutor-uploads/${escapedUid}/[0-9a-f-]{36}\\.(?:jpg|jpeg|png|webp)$`, 'i').test(storagePath)
}

export function validateTutorImageMetadata(metadata = {}) {
  const size = Number(metadata.size)
  return TUTOR_IMAGE_TYPES.includes(metadata.contentType)
    && Number.isFinite(size)
    && size > 0
    && size <= TUTOR_IMAGE_MAX_BYTES
}

export function parseStudyTutorInput(data) {
  const parsed = StudyTutorInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new StudyTutorError('invalid-argument', 'That tutor request was not accepted. Check the message and try again.')
  }
  return parsed.data
}

export function reserveQuotaState(current = {}, reservationId, nowMs) {
  const reservations = Object.fromEntries(Object.entries(current.reservations || {}).filter(([, expiresAt]) => (
    Number.isFinite(expiresAt) && expiresAt > nowMs
  )))
  const successfulCount = Number.isInteger(current.successfulCount) ? current.successfulCount : 0
  if (successfulCount + Object.keys(reservations).length >= TUTOR_IMAGE_DAILY_LIMIT) {
    return { allowed: false, state: { successfulCount, reservations } }
  }
  reservations[reservationId] = nowMs + TUTOR_IMAGE_RESERVATION_MS
  return { allowed: true, state: { successfulCount, reservations } }
}

function releaseQuotaState(current = {}, reservationId, completed) {
  const reservations = { ...(current.reservations || {}) }
  delete reservations[reservationId]
  return {
    successfulCount: (Number.isInteger(current.successfulCount) ? current.successfulCount : 0) + (completed ? 1 : 0),
    reservations,
  }
}

function quotaDocument(db, uid, day) {
  return db.collection('tutorUsage').doc(uid).collection('days').doc(day)
}

async function reserveImageQuota(db, uid, now) {
  const reservationId = randomUUID()
  const docRef = quotaDocument(db, uid, getUtcDay(now))
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(docRef)
    const reservation = reserveQuotaState(snapshot.exists ? snapshot.data() : {}, reservationId, now.getTime())
    if (!reservation.allowed) {
      throw new StudyTutorError('resource-exhausted', "You have reached today's limit of 10 photo analyses. Please try again tomorrow.")
    }
    transaction.set(docRef, {
      schemaVersion: 1,
      uid,
      day: getUtcDay(now),
      ...reservation.state,
      updatedAt: now,
    })
  })
  return { docRef, reservationId }
}

async function finishImageQuota(reservation, completed, now) {
  if (!reservation) return
  await reservation.docRef.firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reservation.docRef)
    const next = releaseQuotaState(snapshot.exists ? snapshot.data() : {}, reservation.reservationId, completed)
    transaction.set(reservation.docRef, { ...next, updatedAt: now }, { merge: true })
  })
}

async function resolveTutorAttachment(storagePath, uid, bucket) {
  if (!isValidTutorImagePath(uid, storagePath)) {
    throw new StudyTutorError('permission-denied', 'That photo does not belong to this signed-in account.')
  }
  const file = bucket.file(storagePath)
  const [exists] = await file.exists()
  if (!exists) throw new StudyTutorError('not-found', 'That photo is no longer available. Attach it again and retry.')
  const [metadata] = await file.getMetadata()
  if (!validateTutorImageMetadata(metadata)) {
    throw new StudyTutorError('invalid-argument', 'Photos must be JPEG, PNG, or WebP files no larger than 5 MB.')
  }
  return {
    file,
    media: {
      url: `gs://${bucket.name}/${storagePath}`,
      contentType: metadata.contentType,
    },
  }
}

export async function runStudyTutorRequest(data, { uid = null, now = new Date(), db = getFirestore(), bucket = getStorage().bucket(), generate = runTutorRequest } = {}) {
  const input = parseStudyTutorInput(data)
  if (!input.attachment) return generate(input)
  if (!uid) throw new StudyTutorError('unauthenticated', 'Sign in with Google to attach a homework photo.')

  const attachment = await resolveTutorAttachment(input.attachment.storagePath, uid, bucket)
  let reservation = null
  let completed = false
  try {
    reservation = await reserveImageQuota(db, uid, now)
    const response = await generate(input, attachment.media)
    completed = true
    return response
  } finally {
    await Promise.allSettled([
      finishImageQuota(reservation, completed, now),
      attachment.file.delete({ ignoreNotFound: true }),
    ])
  }
}
