import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockTutorResponse } from './mockTutor.js'

const baseTarget = { examId: 'sat', subjectId: 'sat-math', domainId: 'algebra' }

test('client-safe mock supports both configured tutor skills', () => {
  const equation = createMockTutorResponse({
    target: { ...baseTarget, skillId: 'linear-equations-one-variable' },
    message: 'How do I solve this equation?',
    history: [],
  })
  const linearFunction = createMockTutorResponse({
    target: { ...baseTarget, skillId: 'linear-functions' },
    message: 'How do I find the slope?',
    history: [],
  })
  assert.equal(equation.insufficient, false)
  assert.deepEqual(equation.sourceIds, ['mock-linear-equations-example'])
  assert.equal(linearFunction.insufficient, false)
  assert.deepEqual(linearFunction.sourceIds, ['mock-linear-functions-example'])
})

test('mock rejects unsupported targets and reports unrelated questions as insufficient', () => {
  assert.throws(() => createMockTutorResponse({
    target: { ...baseTarget, skillId: 'circles' }, message: 'Help', history: [],
  }), /not supported/)
  const response = createMockTutorResponse({
    target: { ...baseTarget, skillId: 'linear-functions' }, message: 'Explain photosynthesis.', history: [],
  })
  assert.equal(response.insufficient, true)
  assert.deepEqual(response.sourceIds, [])
})

test('mock follow-ups require relevant history from the same skill', () => {
  const target = { ...baseTarget, skillId: 'linear-functions' }
  const relevant = createMockTutorResponse({
    target,
    message: 'Why is that?',
    history: [{ role: 'user', content: 'How do I find the slope?' }],
  })
  const unrelated = createMockTutorResponse({
    target,
    message: 'Why is that?',
    history: [{ role: 'user', content: 'How do I solve an equation?' }],
  })
  assert.equal(relevant.insufficient, false)
  assert.equal(unrelated.insufficient, true)
})
