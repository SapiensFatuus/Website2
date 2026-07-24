import test from 'node:test'
import assert from 'node:assert/strict'
import { TUTOR_IMAGE_MAX_BYTES, uploadTutorImage, validateTutorImage } from './chatAttachments.js'

test('homework photo validation allows supported image files only', () => {
  assert.equal(validateTutorImage({ type: 'image/jpeg', size: 1 }), '')
  assert.equal(validateTutorImage({ type: 'image/png', size: TUTOR_IMAGE_MAX_BYTES }), '')
  assert.match(validateTutorImage({ type: 'application/pdf', size: 1 }), /JPEG, PNG, or WebP/)
  assert.match(validateTutorImage({ type: 'image/webp', size: TUTOR_IMAGE_MAX_BYTES + 1 }), /5 MB/)
})

test('the upload helper can be verified without touching Firebase Storage', async () => {
  let uploadedPath = ''
  const path = await uploadTutorImage(
    { type: 'image/png', size: 100 },
    'student-1',
    async (reference) => { uploadedPath = reference.fullPath },
  )
  assert.equal(path, uploadedPath)
  assert.match(path, /^tutor-uploads\/student-1\/[0-9a-f-]{36}\.png$/)
})
