import test from 'node:test'
import assert from 'node:assert/strict'
import { getQuestionPersistencePolicy } from './questionPersistence.js'

test('published and legacy question sessions retain configured persistence behavior', () => {
  assert.equal(getQuestionPersistencePolicy([
    { id: 'published', content: { status: 'published' } },
    { id: 'legacy-without-editorial-status' },
  ]).allowed, true)
})

test('unpublished editorial questions cannot contaminate live account history', () => {
  const policy = getQuestionPersistencePolicy([
    { id: 'draft-question', content: { status: 'draft' } },
  ])
  assert.equal(policy.allowed, false)
  assert.equal(policy.destination, 'none')
  assert.deepEqual(policy.unpublishedQuestionIds, ['draft-question'])
  assert.match(policy.message, /not added to your live account history/)
})

test('draft persistence is allowed only when explicitly isolated in the Firestore emulator', () => {
  const policy = getQuestionPersistencePolicy([
    { id: 'in-review-question', content: { status: 'in-review' } },
  ], { useFirestoreEmulator: true })
  assert.equal(policy.allowed, true)
  assert.equal(policy.destination, 'firestore-emulator')
})
