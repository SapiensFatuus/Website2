import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { apChemistryAcidsBasesQuestions } from '../questions/catalog/apChemistryAcidsBasesQuestions.js'
import { apChemistryEquilibriumQuestions } from '../questions/catalog/apChemistryEquilibriumQuestions.js'
import { apChemistryPropertiesMixturesQuestions } from '../questions/catalog/apChemistryPropertiesMixturesQuestions.js'
import { apChemistryChemicalReactionsQuestions } from '../questions/catalog/apChemistryChemicalReactionsQuestions.js'
import { apChemistryKineticsQuestions } from '../questions/catalog/apChemistryKineticsQuestions.js'
import { apChemistryThermochemistryQuestions } from '../questions/catalog/apChemistryThermochemistryQuestions.js'
import { apChemistryThermodynamicsElectrochemistryQuestions } from '../questions/catalog/apChemistryThermodynamicsElectrochemistryQuestions.js'
import { apChemistryAtomicStructurePropertiesQuestions } from '../questions/catalog/apChemistryAtomicStructurePropertiesQuestions.js'
import { apChemistryCompoundStructurePropertiesQuestions } from '../questions/catalog/apChemistryCompoundStructurePropertiesQuestions.js'
import { apChemistryAcidsBasesResources } from './apChemistryAcidsBasesResources.js'
import { apChemistryPropertiesMixturesResources } from './apChemistryPropertiesMixturesResources.js'
import { apChemistryChemicalReactionsResources } from './apChemistryChemicalReactionsResources.js'
import { apChemistryKineticsResources } from './apChemistryKineticsResources.js'
import { apChemistryThermochemistryResources } from './apChemistryThermochemistryResources.js'
import { apChemistryThermodynamicsElectrochemistryResources } from './apChemistryThermodynamicsElectrochemistryResources.js'
import { apChemistryAtomicStructurePropertiesResources } from './apChemistryAtomicStructurePropertiesResources.js'
import { apChemistryCompoundStructurePropertiesResources } from './apChemistryCompoundStructurePropertiesResources.js'
import {
  apChemistryAcidsBasesFrqExemplars,
  apChemistryEquilibriumFrqExemplars,
  apChemistryFrqExemplars,
  apChemistryPropertiesMixturesFrqExemplars,
  apChemistryChemicalReactionsFrqExemplars,
  apChemistryKineticsFrqExemplars,
  apChemistryThermochemistryFrqExemplars,
  apChemistryThermodynamicsElectrochemistryFrqExemplars,
  apChemistryAtomicStructurePropertiesFrqExemplars,
  apChemistryCompoundStructurePropertiesFrqExemplars,
  getFrqExemplars,
  validateFrqExemplarCatalog,
} from './apChemistryFrqExemplars.js'

test('every Unit 7 FRQ has three original draft exemplar levels tied to rubric points', () => {
  const freeResponses = apChemistryEquilibriumQuestions.filter((question) => question.renderer === 'free-response')
  assert.equal(apChemistryEquilibriumFrqExemplars.length, freeResponses.length)
  assert.equal(validateFrqExemplarCatalog(apChemistryEquilibriumFrqExemplars).valid, true)
  freeResponses.forEach((question) => {
    const exemplars = getFrqExemplars(question.id, { editorialPreview: true })
    assert.deepEqual(exemplars.map(({ level }) => level), ['beginning', 'developing', 'strong'])
    assert.ok(exemplars.every(({ response, feedback }) => response.length > 20 && feedback.length > 20))
  })
})

test('every Unit 8 FRQ has three original draft exemplar levels tied to its own rubric', () => {
  const freeResponses = apChemistryAcidsBasesQuestions.filter((question) => question.renderer === 'free-response')
  assert.equal(apChemistryAcidsBasesFrqExemplars.length, freeResponses.length)
  assert.equal(validateFrqExemplarCatalog(apChemistryAcidsBasesFrqExemplars, {
    questions: apChemistryAcidsBasesQuestions,
    resources: apChemistryAcidsBasesResources,
  }).valid, true)
  freeResponses.forEach((question) => {
    const exemplars = getFrqExemplars(question.id, { editorialPreview: true })
    assert.deepEqual(exemplars.map(({ level }) => level), ['beginning', 'developing', 'strong'])
    assert.ok(exemplars.every(({ response, feedback }) => response.length > 20 && feedback.length > 20))
  })
  assert.equal(apChemistryFrqExemplars.length, 45)
  assert.equal(new Set(apChemistryFrqExemplars.map(({ questionId }) => questionId)).size, 45)
})

test('every Unit 3 starter FRQ has a complete three-level exemplar set', () => {
  const freeResponses = apChemistryPropertiesMixturesQuestions.filter(({ renderer }) => renderer === 'free-response')
  assert.equal(apChemistryPropertiesMixturesFrqExemplars.length, 11)
  assert.equal(validateFrqExemplarCatalog(apChemistryPropertiesMixturesFrqExemplars, {
    questions: apChemistryPropertiesMixturesQuestions,
    resources: apChemistryPropertiesMixturesResources,
  }).valid, true)
  freeResponses.forEach((question) => {
    const responses = getFrqExemplars(question.id, { editorialPreview: true })
    assert.deepEqual(responses.map(({ level }) => level), ['beginning', 'developing', 'strong'])
  })
})

test('every Unit 4 starter FRQ has a complete three-level exemplar set', () => {
  const freeResponses = apChemistryChemicalReactionsQuestions.filter(({ renderer }) => renderer === 'free-response')
  assert.equal(apChemistryChemicalReactionsFrqExemplars.length, 2)
  assert.equal(validateFrqExemplarCatalog(apChemistryChemicalReactionsFrqExemplars, {
    questions: apChemistryChemicalReactionsQuestions,
    resources: apChemistryChemicalReactionsResources,
  }).valid, true)
  freeResponses.forEach((question) => {
    const responses = getFrqExemplars(question.id, { editorialPreview: true })
    assert.deepEqual(responses.map(({ level }) => level), ['beginning', 'developing', 'strong'])
  })
})

test('every Unit 5 starter FRQ has a complete three-level exemplar set', () => {
  const freeResponses = apChemistryKineticsQuestions.filter(({ renderer }) => renderer === 'free-response')
  assert.equal(apChemistryKineticsFrqExemplars.length, 2)
  assert.equal(validateFrqExemplarCatalog(apChemistryKineticsFrqExemplars, {
    questions: apChemistryKineticsQuestions,
    resources: apChemistryKineticsResources,
  }).valid, true)
  freeResponses.forEach((question) => {
    assert.deepEqual(getFrqExemplars(question.id, { editorialPreview: true }).map(({ level }) => level), ['beginning', 'developing', 'strong'])
  })
})

test('every Unit 6 starter FRQ has a complete three-level exemplar set', () => {
  const freeResponses = apChemistryThermochemistryQuestions.filter(({ renderer }) => renderer === 'free-response')
  assert.equal(apChemistryThermochemistryFrqExemplars.length, 2)
  assert.equal(validateFrqExemplarCatalog(apChemistryThermochemistryFrqExemplars, {
    questions: apChemistryThermochemistryQuestions,
    resources: apChemistryThermochemistryResources,
  }).valid, true)
  assert.equal(freeResponses.length, 2)
  freeResponses.forEach((question) => {
    assert.deepEqual(getFrqExemplars(question.id, { editorialPreview: true }).map(({ level }) => level), ['beginning', 'developing', 'strong'])
  })
})

test('every Unit 9 starter FRQ has a complete three-level exemplar set', () => {
  const freeResponses = apChemistryThermodynamicsElectrochemistryQuestions.filter(({ renderer }) => renderer === 'free-response')
  assert.equal(apChemistryThermodynamicsElectrochemistryFrqExemplars.length, 2)
  assert.equal(validateFrqExemplarCatalog(apChemistryThermodynamicsElectrochemistryFrqExemplars, {
    questions: apChemistryThermodynamicsElectrochemistryQuestions,
    resources: apChemistryThermodynamicsElectrochemistryResources,
  }).valid, true)
  assert.equal(freeResponses.length, 2)
  freeResponses.forEach((question) => {
    assert.deepEqual(getFrqExemplars(question.id, { editorialPreview: true }).map(({ level }) => level), ['beginning', 'developing', 'strong'])
  })
})

test('every Unit 1 starter FRQ has a complete three-level exemplar set', () => {
  const freeResponses = apChemistryAtomicStructurePropertiesQuestions.filter(({ renderer }) => renderer === 'free-response')
  assert.equal(apChemistryAtomicStructurePropertiesFrqExemplars.length, 2)
  assert.equal(validateFrqExemplarCatalog(apChemistryAtomicStructurePropertiesFrqExemplars, {
    questions: apChemistryAtomicStructurePropertiesQuestions,
    resources: apChemistryAtomicStructurePropertiesResources,
  }).valid, true)
  assert.equal(freeResponses.length, 2)
  freeResponses.forEach((question) => {
    assert.deepEqual(getFrqExemplars(question.id, { editorialPreview: true }).map(({ level }) => level), ['beginning', 'developing', 'strong'])
  })
})

test('every Unit 2 starter FRQ has a complete three-level exemplar set', () => {
  const freeResponses = apChemistryCompoundStructurePropertiesQuestions.filter(({ renderer }) => renderer === 'free-response')
  assert.equal(apChemistryCompoundStructurePropertiesFrqExemplars.length, 2)
  assert.equal(validateFrqExemplarCatalog(apChemistryCompoundStructurePropertiesFrqExemplars, {
    questions: apChemistryCompoundStructurePropertiesQuestions,
    resources: apChemistryCompoundStructurePropertiesResources,
  }).valid, true)
  assert.equal(freeResponses.length, 2)
  freeResponses.forEach((question) => {
    assert.deepEqual(getFrqExemplars(question.id, { editorialPreview: true }).map(({ level }) => level), ['beginning', 'developing', 'strong'])
  })
})

test('draft exemplar lookup is independently gated from future question publication', () => {
  const questionId = apChemistryAcidsBasesFrqExemplars[0].questionId
  assert.deepEqual(getFrqExemplars(questionId), [])
  assert.equal(getFrqExemplars(questionId, { editorialPreview: true }).length, 3)
  assert.deepEqual(getFrqExemplars('unknown-frq', { editorialPreview: true }), [])
})

test('the question UI loads exemplars lazily inside the post-submission draft rubric', () => {
  const page = readFileSync(new URL('../questions/QuestionPage.jsx', import.meta.url), 'utf8')
  assert.match(page, /import\('\.\.\/content\/apChemistryFrqExemplars\.js'\)/)
  assert.match(page, /editorialPreview: clientEnvironment\.editorialPreview/)
  assert.match(page, /Compare three original sample responses/)
  assert.match(page, /not official AP responses/)
  assert.match(page, /<DraftRubric question=\{currentQuestion\}/)
})

test('exemplar validation rejects unknown points, missing levels, and incomplete coverage', () => {
  const invalidPoint = structuredClone(apChemistryEquilibriumFrqExemplars)
  invalidPoint[0].responses[0].earnedPointIds = ['invented-point']
  assert.match(validateFrqExemplarCatalog(invalidPoint).errors.join('\n'), /unknown or duplicate earned point ids/)

  const missingLevel = structuredClone(apChemistryEquilibriumFrqExemplars)
  missingLevel[0].responses.pop()
  assert.match(validateFrqExemplarCatalog(missingLevel).errors.join('\n'), /responses must be ordered/)

  const misaligned = structuredClone(apChemistryEquilibriumFrqExemplars)
  misaligned[0].alignment.domainId = 'acids-bases'
  assert.match(validateFrqExemplarCatalog(misaligned).errors.join('\n'), /stable id and canonical question alignment/)

  const unversioned = structuredClone(apChemistryEquilibriumFrqExemplars)
  unversioned[0].review.revision = null
  assert.match(validateFrqExemplarCatalog(unversioned).errors.join('\n'), /draft review metadata/)

  assert.match(validateFrqExemplarCatalog(apChemistryEquilibriumFrqExemplars.slice(1)).errors.join('\n'), /missing exemplar record/)
})
