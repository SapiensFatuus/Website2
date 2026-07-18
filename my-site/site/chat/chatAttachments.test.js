import test from 'node:test'
import assert from 'node:assert/strict'
import { TUTOR_IMAGE_MAX_BYTES, validateTutorImage } from './chatAttachments.js'

test('homework photo validation allows supported image files only', () => {
  assert.equal(validateTutorImage({ type: 'image/jpeg', size: 1 }), '')
  assert.equal(validateTutorImage({ type: 'image/png', size: TUTOR_IMAGE_MAX_BYTES }), '')
  assert.match(validateTutorImage({ type: 'application/pdf', size: 1 }), /JPEG, PNG, or WebP/)
  assert.match(validateTutorImage({ type: 'image/webp', size: TUTOR_IMAGE_MAX_BYTES + 1 }), /5 MB/)
})
