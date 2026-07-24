import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveClientEnvironment } from './environment.js'

test('plain development defaults to an isolated mock tutor without emulators', () => {
  assert.deepEqual(resolveClientEnvironment({}), {
    chatMode: 'mock',
    trackerMode: 'mock',
    useAuthEmulator: false,
    useFirestoreEmulator: false,
    useFunctionsEmulator: false,
    useStorageEmulator: false,
    appCheckSiteKey: '',
    appCheckDebugToken: '',
    editorialPreview: false,
  })
})

test('the unified emulator flag connects every Firebase client and uses real callable protocol', () => {
  const result = resolveClientEnvironment({
    DEV: true,
    VITE_USE_FIREBASE_EMULATORS: 'true',
    VITE_APPCHECK_DEBUG_TOKEN: 'debug-token',
  })
  assert.equal(result.chatMode, 'firebase')
  assert.equal(result.trackerMode, 'firebase')
  assert.equal(result.useAuthEmulator, true)
  assert.equal(result.useFirestoreEmulator, true)
  assert.equal(result.useFunctionsEmulator, true)
  assert.equal(result.useStorageEmulator, true)
  assert.equal(result.appCheckDebugToken, 'debug-token')
})

test('App Check debug tokens are ignored outside Vite development', () => {
  assert.equal(resolveClientEnvironment({ VITE_APPCHECK_DEBUG_TOKEN: 'must-not-ship' }).appCheckDebugToken, '')
})

test('draft editorial preview requires both development mode and an explicit flag', () => {
  assert.equal(resolveClientEnvironment({ DEV: true, VITE_EDITORIAL_PREVIEW: 'true' }).editorialPreview, true)
  assert.equal(resolveClientEnvironment({ PROD: true, VITE_EDITORIAL_PREVIEW: 'true' }).editorialPreview, false)
  assert.equal(resolveClientEnvironment({ DEV: true }).editorialPreview, false)
})

test('production builds use Hosting API rewrites while development stays intentionally mocked', () => {
  assert.equal(resolveClientEnvironment({ PROD: true }).trackerMode, 'firebase')
  assert.equal(resolveClientEnvironment({ VITE_TRACKER_MODE: 'firebase' }).trackerMode, 'firebase')
})
