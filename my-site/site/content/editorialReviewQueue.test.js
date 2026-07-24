import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { apChemistryEquilibriumResources } from './apChemistryEquilibriumResources.js'
import { apChemistryEquilibriumQuestions } from '../questions/catalog/apChemistryEquilibriumQuestions.js'
import { EDITORIAL_CHECKLIST } from './editorialPipeline.js'
import { apChemistryEquilibriumFrqExemplars } from './apChemistryFrqExemplars.js'
import { createEditorialReviewQueue } from './editorialReviewQueue.js'
import { apChemistryChemicalReactionsResources } from './apChemistryChemicalReactionsResources.js'
import { apChemistryChemicalReactionsQuestions } from '../questions/catalog/apChemistryChemicalReactionsQuestions.js'
import { apChemistryChemicalReactionsFrqExemplars } from './apChemistryFrqExemplars.js'
import { apChemistryKineticsResources } from './apChemistryKineticsResources.js'
import { apChemistryKineticsQuestions } from '../questions/catalog/apChemistryKineticsQuestions.js'
import { apChemistryKineticsFrqExemplars } from './apChemistryFrqExemplars.js'
import { apChemistryThermochemistryResources } from './apChemistryThermochemistryResources.js'
import { apChemistryThermochemistryQuestions } from '../questions/catalog/apChemistryThermochemistryQuestions.js'
import { apChemistryThermochemistryFrqExemplars } from './apChemistryFrqExemplars.js'
import { apChemistryThermodynamicsElectrochemistryResources } from './apChemistryThermodynamicsElectrochemistryResources.js'
import { apChemistryThermodynamicsElectrochemistryQuestions } from '../questions/catalog/apChemistryThermodynamicsElectrochemistryQuestions.js'
import { apChemistryThermodynamicsElectrochemistryFrqExemplars } from './apChemistryFrqExemplars.js'
import { apChemistryAtomicStructurePropertiesResources } from './apChemistryAtomicStructurePropertiesResources.js'
import { apChemistryAtomicStructurePropertiesQuestions } from '../questions/catalog/apChemistryAtomicStructurePropertiesQuestions.js'
import { apChemistryAtomicStructurePropertiesFrqExemplars } from './apChemistryFrqExemplars.js'
import { apChemistryCompoundStructurePropertiesResources } from './apChemistryCompoundStructurePropertiesResources.js'
import { apChemistryCompoundStructurePropertiesQuestions } from '../questions/catalog/apChemistryCompoundStructurePropertiesQuestions.js'
import { apChemistryCompoundStructurePropertiesFrqExemplars } from './apChemistryFrqExemplars.js'

test('Unit 7 editorial queue includes every draft without claiming review completion', () => {
  const queue = createEditorialReviewQueue({
    questions: apChemistryEquilibriumQuestions,
    resources: apChemistryEquilibriumResources,
    exemplars: apChemistryEquilibriumFrqExemplars,
  })
  assert.equal(queue.questionCount, 62)
  assert.equal(queue.resourceCount, 27)
  assert.equal(queue.exemplarCount, 11)
  assert.equal(queue.itemCount, 100)
  assert.equal(queue.pendingChecklistCount, 100 * EDITORIAL_CHECKLIST.length)
  assert.deepEqual(queue.statusCounts, [{ id: 'draft', count: 100 }])
  assert.ok(queue.items.every((item) => item.reviewerIds.length === 0))
  assert.ok(queue.items.every((item) => item.checklist.length === 8 && item.checklist.every(({ status }) => status === 'pending')))
})

test('review queue prioritizes free responses and produces deterministic internal-only similarity flags', () => {
  const input = {
    questions: apChemistryEquilibriumQuestions,
    resources: apChemistryEquilibriumResources,
    exemplars: apChemistryEquilibriumFrqExemplars,
  }
  const first = createEditorialReviewQueue(input)
  const second = createEditorialReviewQueue(input)
  assert.equal(first.items[0].format, 'free-response')
  assert.equal(first.items.filter(({ format }) => format === 'free-response').length, 11)
  assert.deepEqual(first.similarityFlags, second.similarityFlags)
  first.similarityFlags.forEach(({ leftId, rightId }) => {
    assert.ok(leftId.startsWith('ap-chem-equilibrium-'))
    assert.ok(rightId.startsWith('ap-chem-equilibrium-'))
  })
})

test('review queue rejects duplicate item identifiers across catalogs', () => {
  const duplicate = { ...apChemistryEquilibriumResources[0], id: apChemistryEquilibriumQuestions[0].id }
  assert.throws(() => createEditorialReviewQueue({ questions: apChemistryEquilibriumQuestions, resources: [duplicate] }), /Duplicate editorial review item/)
})

test('Unit 4 review queue includes the complete thin starter bundle', () => {
  const queue = createEditorialReviewQueue({
    questions: apChemistryChemicalReactionsQuestions,
    resources: apChemistryChemicalReactionsResources,
    exemplars: apChemistryChemicalReactionsFrqExemplars,
  })
  assert.equal(queue.questionCount, 28)
  assert.equal(queue.resourceCount, 9)
  assert.equal(queue.exemplarCount, 2)
  assert.equal(queue.itemCount, 39)
  assert.deepEqual(queue.statusCounts, [{ id: 'draft', count: 39 }])
})

test('Unit 5 review queue includes the complete thin starter bundle', () => {
  const queue = createEditorialReviewQueue({
    questions: apChemistryKineticsQuestions,
    resources: apChemistryKineticsResources,
    exemplars: apChemistryKineticsFrqExemplars,
  })
  assert.equal(queue.questionCount, 30)
  assert.equal(queue.resourceCount, 9)
  assert.equal(queue.exemplarCount, 2)
  assert.equal(queue.itemCount, 41)
  assert.deepEqual(queue.statusCounts, [{ id: 'draft', count: 41 }])
})

test('Unit 6 review queue includes the complete thin starter bundle', () => {
  const queue = createEditorialReviewQueue({
    questions: apChemistryThermochemistryQuestions,
    resources: apChemistryThermochemistryResources,
    exemplars: apChemistryThermochemistryFrqExemplars,
  })
  assert.equal(queue.questionCount, 28)
  assert.equal(queue.resourceCount, 9)
  assert.equal(queue.exemplarCount, 2)
  assert.equal(queue.itemCount, 39)
  assert.deepEqual(queue.statusCounts, [{ id: 'draft', count: 39 }])
})

test('Unit 9 review queue includes the complete thin starter bundle', () => {
  const queue = createEditorialReviewQueue({
    questions: apChemistryThermodynamicsElectrochemistryQuestions,
    resources: apChemistryThermodynamicsElectrochemistryResources,
    exemplars: apChemistryThermodynamicsElectrochemistryFrqExemplars,
  })
  assert.equal(queue.questionCount, 30)
  assert.equal(queue.resourceCount, 9)
  assert.equal(queue.exemplarCount, 2)
  assert.equal(queue.itemCount, 41)
  assert.deepEqual(queue.statusCounts, [{ id: 'draft', count: 41 }])
})

test('Unit 1 review queue includes the complete thin starter bundle', () => {
  const queue = createEditorialReviewQueue({
    questions: apChemistryAtomicStructurePropertiesQuestions,
    resources: apChemistryAtomicStructurePropertiesResources,
    exemplars: apChemistryAtomicStructurePropertiesFrqExemplars,
  })
  assert.equal(queue.questionCount, 30)
  assert.equal(queue.resourceCount, 10)
  assert.equal(queue.exemplarCount, 2)
  assert.equal(queue.itemCount, 42)
  assert.deepEqual(queue.statusCounts, [{ id: 'draft', count: 42 }])
})

test('Unit 2 review queue includes the complete thin starter bundle', () => {
  const queue = createEditorialReviewQueue({
    questions: apChemistryCompoundStructurePropertiesQuestions,
    resources: apChemistryCompoundStructurePropertiesResources,
    exemplars: apChemistryCompoundStructurePropertiesFrqExemplars,
  })
  assert.equal(queue.questionCount, 30)
  assert.equal(queue.resourceCount, 9)
  assert.equal(queue.exemplarCount, 2)
  assert.equal(queue.itemCount, 41)
  assert.deepEqual(queue.statusCounts, [{ id: 'draft', count: 41 }])
})

test('editorial dashboard is development-gated, read-only, and routed lazily', () => {
  const page = readFileSync(new URL('./EditorialReviewPage.jsx', import.meta.url), 'utf8')
  const app = readFileSync(new URL('../App.jsx', import.meta.url), 'utf8')
  assert.match(page, /clientEnvironment\.editorialPreview/)
  assert.match(page, /read-only queue/)
  assert.match(page, /all pending/)
  assert.match(page, /This compares first-party drafts only/)
  assert.doesNotMatch(page, /transitionReview|updateReview|persistReview|onApprove|onPublish/)
  assert.doesNotMatch(page, /<button[^>]*>[^<]*(?:Approve|Publish)/i)
  assert.match(app, /lazy\(\(\) => import\('\.\/content\/EditorialReviewPage'\)/)
  assert.match(app, /page-editorial/)
  assert.match(app, /<EditorialReviewPage[\s\S]*subjectId=[\s\S]*domainId=/)
  assert.match(page, /canonicalQuestions\.filter/)
  assert.match(page, /editorialResources\.filter/)
  assert.match(page, /apChemistryFrqExemplars\.filter/)
  assert.doesNotMatch(page, /apChemistryEquilibriumQuestions|apChemistryEquilibriumResources/)
})
