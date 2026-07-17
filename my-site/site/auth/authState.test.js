import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canPersistLearningRecords,
  getAuthStatus,
  getProgressPersistenceLabel,
} from './authState.js'

test('auth status distinguishes loading, guest, and signed-in states', () => {
  assert.equal(getAuthStatus(null, false), 'loading')
  assert.equal(getAuthStatus(null, true), 'signed-out')
  assert.equal(getAuthStatus({ uid: 'user-1' }, true), 'signed-in')
})

test('persistence guard requires a signed-in user and a completed session', () => {
  assert.equal(canPersistLearningRecords(null, { status: 'complete' }), false)
  assert.equal(canPersistLearningRecords({ uid: 'user-1' }, { status: 'active' }), false)
  assert.equal(canPersistLearningRecords({ uid: 'user-1' }, { status: 'complete' }), true)
})

test('progress messaging stays honest for guest and signed-in states', () => {
  assert.match(getProgressPersistenceLabel(null, { status: 'active' }), /temporary/i)
  assert.match(getProgressPersistenceLabel({ uid: 'user-1' }, { status: 'active' }), /saved to your account when you finish/i)
  assert.match(getProgressPersistenceLabel(null, null), /temporary/i)
})
