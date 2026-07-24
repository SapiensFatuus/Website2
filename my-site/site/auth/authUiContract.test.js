import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getAuthErrorMessage } from './authErrors.js'

const componentsSource = readFileSync(
  fileURLToPath(new URL('../components.jsx', import.meta.url)),
  'utf8',
)

test('Google sign-in is always available to signed-out visitors', () => {
  assert.match(componentsSource, /authStatus === 'signed-out'/)
  assert.match(componentsSource, /Sign in with Google/)
  assert.doesNotMatch(componentsSource, /GOOGLE_SIGN_IN_UI_ENABLED/)
})

test('Firebase sign-in configuration failures have actionable messages', () => {
  assert.match(getAuthErrorMessage({ code: 'auth/unauthorized-domain' }), /authorized/i)
  assert.match(getAuthErrorMessage({ code: 'auth/operation-not-allowed' }), /not enabled/i)
  assert.match(getAuthErrorMessage({ code: 'auth/network-request-failed' }), /connection/i)
})
