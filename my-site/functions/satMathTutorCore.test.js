import test from 'node:test'
import assert from 'node:assert/strict'
import {
  SAT_MATH_TUTOR_CONTEXT,
  SUPPORTED_TUTOR_TARGET,
  buildTutorPrompt,
  createMockTutorResponse,
  selectRelevantMaterials,
  validateTutorRequest,
} from './satMathTutorCore.js'

const validRequest = {
  target: SUPPORTED_TUTOR_TARGET,
  message: 'How do I solve 3x + 5 = 20?',
  history: [],
}

test('selects only the configured context for the supported skill', () => {
  const materials = selectRelevantMaterials(validRequest.message)
  assert.equal(materials[0].id, 'original-sample-1')
  assert.ok(SAT_MATH_TUTOR_CONTEXT.materials.every((item) => item.label.startsWith('Original sample')))
  assert.match(SAT_MATH_TUTOR_CONTEXT.materialNotice, /not copied/i)
})

test('rejects invalid skill IDs and malformed requests', () => {
  assert.equal(validateTutorRequest(validRequest).valid, true)
  assert.equal(validateTutorRequest({
    ...validRequest,
    target: { ...SUPPORTED_TUTOR_TARGET, skillId: 'circles' },
  }).valid, false)
  assert.equal(validateTutorRequest({ ...validRequest, message: '' }).valid, false)
  assert.equal(validateTutorRequest({ ...validRequest, history: new Array(11).fill({ role: 'user', content: 'x' }) }).valid, false)
})

test('prompt requires grounding, source IDs, steps, alternatives, and honest limits', () => {
  const prompt = buildTutorPrompt({
    ...validRequest,
    materials: selectRelevantMaterials(validRequest.message),
  })
  assert.match(prompt, /step by step/i)
  assert.match(prompt, /alternative solving method/i)
  assert.match(prompt, /exact source ID/i)
  assert.match(prompt, /insufficient/i)
  assert.match(prompt, /Do not invent/i)
})

test('mock admits when supplied context is insufficient', () => {
  const response = createMockTutorResponse({
    ...validRequest,
    message: 'Can you explain photosynthesis?',
  })
  assert.equal(response.insufficient, true)
  assert.deepEqual(response.sourceIds, [])
  assert.match(response.answer, /not have enough supplied material/i)
})

test('unrelated new questions do not inherit relevance from chat history', () => {
  const response = createMockTutorResponse({
    ...validRequest,
    message: 'Tell me about photosynthesis.',
    history: [
      { role: 'user', content: validRequest.message },
      { role: 'assistant', content: 'Subtract 5, then divide by 3.' },
    ],
  })
  assert.equal(response.insufficient, true)
  assert.deepEqual(response.sourceIds, [])
})

test('short follow-ups can use relevant supplied history', () => {
  const materials = selectRelevantMaterials('Why did you subtract 5?', [
    { role: 'user', content: validRequest.message },
  ])
  assert.equal(materials[0].id, 'original-sample-1')
})

test('mock response names the original material it used', () => {
  const response = createMockTutorResponse(validRequest)
  assert.equal(response.insufficient, false)
  assert.deepEqual(response.sourceIds, ['original-sample-1'])
  assert.match(response.answer, /Alternative method:/)
})
