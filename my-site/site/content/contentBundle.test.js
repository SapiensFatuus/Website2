import test from 'node:test'
import assert from 'node:assert/strict'
import { apChemistryEquilibriumResources } from './apChemistryEquilibriumResources.js'
import { apChemistryEquilibriumQuestions } from '../questions/catalog/apChemistryEquilibriumQuestions.js'
import { validateContentBundle } from './contentBundle.js'
import { apChemistryEquilibriumMisconceptions } from './apChemistryEquilibriumMisconceptions.js'

function bundle(overrides = {}) {
  return {
    resources: structuredClone(apChemistryEquilibriumResources),
    questions: structuredClone(apChemistryEquilibriumQuestions),
    misconceptions: structuredClone(apChemistryEquilibriumMisconceptions),
    ...overrides,
  }
}

test('Unit 7 resources, stimuli, rubrics, and questions form a valid draft bundle', () => {
  assert.deepEqual(validateContentBundle(bundle()), { valid: true, errors: [] })
})

test('question and lesson misconception tags resolve through the reviewed schema', () => {
  const invalid = bundle()
  invalid.questions[0].misconceptionIds = ['invented-misconception']
  assert.match(validateContentBundle(invalid).errors.join('\n'), /unknown misconception/)
})

test('bundle validation rejects missing and one-way stimulus or rubric references', () => {
  const missingStimulus = bundle()
  missingStimulus.resources = missingStimulus.resources.filter(({ kind }) => kind !== 'stimulus')
  assert.match(validateContentBundle(missingStimulus).errors.join('\n'), /unknown stimulus/)

  const wrongRubric = bundle()
  wrongRubric.resources.find(({ kind }) => kind === 'rubric').questionId = 'unknown-question'
  assert.match(validateContentBundle(wrongRubric).errors.join('\n'), /references unknown question|rubric points to/)
})

test('published questions cannot depend on draft support material', () => {
  const mixed = bundle()
  const question = mixed.questions.find(({ stimulusId }) => stimulusId)
  question.content.status = 'published'
  question.content.reviewers = ['reviewer-one', 'reviewer-two']
  assert.match(validateContentBundle(mixed).errors.join('\n'), /published questions require a published stimulus/)
})

test('question formula references resolve and published questions cannot depend on draft formulas', () => {
  const missing = bundle()
  missing.questions[0].referenceRequirements.formulaIds = ['missing-formula']
  assert.match(validateContentBundle(missing).errors.join('\n'), /unknown formula/)

  const mixed = bundle()
  const question = mixed.questions.find(({ referenceRequirements }) => referenceRequirements.formulaIds.length)
  question.content.status = 'published'
  question.content.reviewers = ['reviewer-one', 'reviewer-two']
  assert.match(validateContentBundle(mixed).errors.join('\n'), /published questions require published formula references/)
})
