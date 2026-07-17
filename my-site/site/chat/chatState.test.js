import test from 'node:test'
import assert from 'node:assert/strict'
import { chatReducer, initialChatState } from './chatState.js'

const request = { message: 'Solve 3x + 5 = 20', target: {}, history: [] }

test('chat starts empty and transitions through loading and success', () => {
  assert.equal(initialChatState.status, 'empty')
  const loading = chatReducer(initialChatState, { type: 'send', request })
  assert.equal(loading.status, 'loading')
  assert.equal(loading.messages[0].content, request.message)
  const ready = chatReducer(loading, {
    type: 'success',
    response: {
      answer: 'Step 1', sourceIds: ['original-sample-1'], insufficient: false, mode: 'mock',
      effectiveTarget: { scope: 'skill', skillId: 'linear-equations-one-variable' },
      scopeNotice: 'Adjusted to equations.', classification: 'adjusted-within-subject',
    },
  })
  assert.equal(ready.status, 'ready')
  assert.equal(ready.messages[1].content, 'Step 1')
  assert.equal(ready.messages[1].effectiveTarget.skillId, 'linear-equations-one-variable')
  assert.equal('sourceIds' in ready.messages[1], false)
  assert.equal('scopeNotice' in ready.messages[1], false)
})

test('chat exposes error and retry states without duplicating the user message', () => {
  const loading = chatReducer(initialChatState, { type: 'send', request })
  const failed = chatReducer(loading, { type: 'error', error: 'Offline' })
  assert.equal(failed.status, 'error')
  assert.equal(failed.error, 'Offline')
  assert.equal(failed.retryRequest, request)
  const retried = chatReducer(failed, { type: 'retry' })
  assert.equal(retried.status, 'loading')
  assert.equal(retried.messages.length, 1)
  assert.equal(retried.error, null)
})
