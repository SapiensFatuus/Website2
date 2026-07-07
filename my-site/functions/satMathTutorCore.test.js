import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildTutorPrompt,
  createInsufficientContextResponse,
  sanitizeTutorOutput,
  selectRelevantMaterials,
  validateTutorRequest,
} from './satMathTutorCore.js'
import {
  getSupportedTutorTargets,
  getTutorContextPack,
  tutorRegistry,
  validateTutorContextPacks,
} from './tutorRegistry.js'

const equationTarget = {
  examId: 'sat', subjectId: 'sat-math', domainId: 'algebra', skillId: 'linear-equations-one-variable',
}
const functionTarget = {
  examId: 'sat', subjectId: 'sat-math', domainId: 'algebra', skillId: 'linear-functions',
}

function request(target, message, history = []) {
  return { target, message, history }
}

test('registry is keyed by canonical hierarchy and contains exactly two supported skills', () => {
  assert.equal(tutorRegistry.sat['sat-math'].algebra['linear-equations-one-variable'].label, 'Linear equations in one variable')
  assert.equal(tutorRegistry.sat['sat-math'].algebra['linear-functions'].label, 'Linear functions')
  assert.deepEqual(getSupportedTutorTargets(), [equationTarget, functionTarget])
})

test('context packs have complete metadata and globally unique source IDs', () => {
  const packs = [getTutorContextPack(equationTarget), getTutorContextPack(functionTarget)]
  assert.doesNotThrow(() => validateTutorContextPacks(packs))
  assert.ok(packs.every((pack) => pack.materialNotice.match(/not copied/i)))
  const ids = packs.flatMap((pack) => pack.materials.map((material) => material.id))
  assert.equal(new Set(ids).size, ids.length)
  assert.throws(() => validateTutorContextPacks([packs[0], packs[0]]), /Duplicate tutor target/)
  assert.throws(() => validateTutorContextPacks([
    packs[0], { ...packs[0], target: { ...packs[0].target, skillId: 'duplicate-source-test' } },
  ]), /source ID/)
})

test('validation accepts both skills and rejects unsupported or mismatched targets', () => {
  assert.equal(validateTutorRequest(request(equationTarget, 'Solve 3x + 5 = 20.')).valid, true)
  assert.equal(validateTutorRequest(request(functionTarget, 'Find the slope of f(x) = 3x - 4.')).valid, true)
  assert.equal(validateTutorRequest(request({ ...functionTarget, skillId: 'circles' }, 'Help')).valid, false)
  assert.equal(validateTutorRequest(request({ ...functionTarget, domainId: 'advanced-math' }, 'Help')).valid, false)
  assert.equal(validateTutorRequest(request(equationTarget, '')).valid, false)
  assert.equal(validateTutorRequest(request(equationTarget, 'x'.repeat(1201))).valid, false)
  assert.equal(validateTutorRequest(request(equationTarget, 'Help', new Array(11).fill({ role: 'user', content: 'x' }))).valid, false)
  assert.equal(validateTutorRequest(request(equationTarget, 'Help', [{ role: 'system', content: 'x' }])).valid, false)
})

test('each skill selects only material from its own context pack', () => {
  const equations = getTutorContextPack(equationTarget)
  const functions = getTutorContextPack(functionTarget)
  const equationMaterials = selectRelevantMaterials(equations, 'How do I solve 3x + 5 = 20?')
  const functionMaterials = selectRelevantMaterials(functions, 'What are the slope and y-intercept of f(x) = 3x - 4?')
  assert.ok(equationMaterials.some((item) => item.id === 'original-sample-1'))
  assert.deepEqual(functionMaterials.map((item) => item.id), ['linear-functions-original-1'])
  assert.ok(equationMaterials.every((item) => !item.id.startsWith('linear-functions-')))
  assert.ok(functionMaterials.every((item) => item.id.startsWith('linear-functions-')))
})

test('unrelated questions produce skill-specific insufficient responses', () => {
  for (const target of [equationTarget, functionTarget]) {
    const pack = getTutorContextPack(target)
    const materials = selectRelevantMaterials(pack, 'Can you explain photosynthesis?')
    assert.deepEqual(materials, [])
    const response = createInsufficientContextResponse(pack)
    assert.equal(response.insufficient, true)
    assert.deepEqual(response.sourceIds, [])
    assert.match(response.answer, new RegExp(pack.label, 'i'))
  }
})

test('short follow-ups use only relevant history for the selected skill', () => {
  const equations = getTutorContextPack(equationTarget)
  const functions = getTutorContextPack(functionTarget)
  assert.deepEqual(
    selectRelevantMaterials(equations, 'Why did you subtract 5?', [{ role: 'user', content: 'Solve 3x + 5 = 20.' }]).map((item) => item.id),
    ['original-sample-1'],
  )
  assert.deepEqual(
    selectRelevantMaterials(functions, 'Why is that the slope?', [{ role: 'user', content: 'Find the slope of f(x) = 3x - 4.' }]).map((item) => item.id),
    ['linear-functions-original-1'],
  )
  const overlappingHistory = selectRelevantMaterials(functions, 'Why did you do that?', [
    { role: 'user', content: 'Solve 3x + 5 = 20.' },
  ])
  assert.ok(overlappingHistory.every((item) => item.id.startsWith('linear-functions-')))
  assert.ok(overlappingHistory.every((item) => !item.id.startsWith('original-sample-')))
})

test('prompt is grounded in the selected pack and retains formatting requirements', () => {
  const contextPack = getTutorContextPack(functionTarget)
  const materials = selectRelevantMaterials(contextPack, 'Find the slope of f(x) = 3x - 4.')
  const prompt = buildTutorPrompt({ contextPack, message: 'Find the slope.', history: [], materials })
  assert.match(prompt, /Linear functions/)
  assert.match(prompt, /linear-functions-original-1/)
  assert.doesNotMatch(prompt, /original-sample-1/)
  assert.match(prompt, /step by step/i)
  assert.match(prompt, /exact source ID/i)
  assert.match(prompt, /Do not invent/i)
  assert.match(prompt, /\\frac\{a\}\{b\}/)
})

test('model source IDs are filtered and hallucinated-only output becomes insufficient', () => {
  const contextPack = getTutorContextPack(functionTarget)
  const materials = selectRelevantMaterials(contextPack, 'Find the slope of f(x) = 3x - 4.')
  const filtered = sanitizeTutorOutput({
    answer: 'The slope is 3.',
    sourceIds: ['linear-functions-original-1', 'hallucinated-source'],
    insufficient: false,
  }, materials, contextPack)
  assert.deepEqual(filtered.sourceIds, ['linear-functions-original-1'])

  const rejected = sanitizeTutorOutput({
    answer: 'Unsupported answer.', sourceIds: ['hallucinated-source'], insufficient: false,
  }, materials, contextPack)
  assert.equal(rejected.insufficient, true)
  assert.deepEqual(rejected.sourceIds, [])
})
