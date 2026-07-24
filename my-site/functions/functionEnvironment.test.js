import test from 'node:test'
import assert from 'node:assert/strict'
import { DEPLOYED_STUDY_TUTOR_ORIGINS, getStudyTutorCors } from './functionEnvironment.js'

test('deployed study tutor CORS accepts only Firebase Hosting origins', () => {
  const cors = getStudyTutorCors({ functionsEmulator: false })
  assert.deepEqual(cors, DEPLOYED_STUDY_TUTOR_ORIGINS)
  assert.ok(cors.every((origin) => typeof origin === 'string' && origin.startsWith('https://')))
})

test('localhost tutor origins are available only in the Functions emulator', () => {
  const cors = getStudyTutorCors({ functionsEmulator: true })
  const localPatterns = cors.filter((origin) => origin instanceof RegExp)
  assert.equal(localPatterns.length, 2)
  assert.ok(localPatterns.some((pattern) => pattern.test('http://localhost:5173')))
  assert.ok(localPatterns.some((pattern) => pattern.test('http://127.0.0.1:4173')))
  assert.ok(localPatterns.every((pattern) => !pattern.test('https://untrusted.example')))
})
