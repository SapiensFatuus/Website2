import test from 'node:test'
import assert from 'node:assert/strict'
import { apChemistryChemicalReactionsQuestions } from '../questions/catalog/apChemistryChemicalReactionsQuestions.js'
import { apChemistryChemicalReactionsMisconceptions } from './apChemistryChemicalReactionsMisconceptions.js'
import { apChemistryChemicalReactionsResources } from './apChemistryChemicalReactionsResources.js'
import { validateContentBundle } from './contentBundle.js'

function close(actual, expected, tolerance) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`)
}

test('Unit 4 selected-response keys are explicit and complete', () => {
  const keys = Object.fromEntries(apChemistryChemicalReactionsQuestions
    .filter(({ renderer }) => renderer === 'multiple-choice')
    .map(({ id, answer }) => [id, answer.correctOptionId]))
  assert.deepEqual(keys, {
    'ap-chem-chemical-reactions-mcq-001': 'a',
    'ap-chem-chemical-reactions-mcq-002': 'a',
    'ap-chem-chemical-reactions-mcq-003': 'a',
    'ap-chem-chemical-reactions-mcq-004': 'a',
    'ap-chem-chemical-reactions-mcq-005': 'a',
    'ap-chem-chemical-reactions-mcq-006': 'a',
    'ap-chem-chemical-reactions-mcq-007': 'a',
    'ap-chem-chemical-reactions-mcq-008': 'a',
    'ap-chem-chemical-reactions-mcq-009': 'a',
    'ap-chem-chemical-reactions-mcq-010': 'a',
    'ap-chem-chemical-reactions-mcq-011': 'a',
    'ap-chem-chemical-reactions-mcq-012': 'a',
    'ap-chem-chemical-reactions-mcq-013': 'a',
    'ap-chem-chemical-reactions-mcq-014': 'a',
    'ap-chem-chemical-reactions-mcq-015': 'a',
    'ap-chem-chemical-reactions-mcq-016': 'a',
    'ap-chem-chemical-reactions-mcq-017': 'a',
    'ap-chem-chemical-reactions-mcq-018': 'a',
    'ap-chem-chemical-reactions-stimulus-mcq-001': 'a',
    'ap-chem-chemical-reactions-stimulus-mcq-002': 'b',
    'ap-chem-chemical-reactions-stimulus-mcq-003': 'a',
    'ap-chem-chemical-reactions-stimulus-mcq-004': 'a',
    'ap-chem-chemical-reactions-carbonate-stimulus-mcq-001': 'a',
    'ap-chem-chemical-reactions-carbonate-stimulus-mcq-002': 'a',
    'ap-chem-chemical-reactions-carbonate-stimulus-mcq-003': 'a',
    'ap-chem-chemical-reactions-carbonate-stimulus-mcq-004': 'a',
  })
})

test('Unit 4 titration, gas-evolution, and precipitation calculations reproduce the answer content', () => {
  const meanTitre = (18.38 + 18.40 + 18.39) / 3
  const baseAmount = 0.1250 * meanTitre / 1000
  const acidConcentration = baseAmount / 0.02000
  close(meanTitre, 18.39, 0.0001)
  close(baseAmount, 0.00229875, 1e-9)
  close(acidConcentration, 0.1149375, 1e-7)

  const precipitateAmount = Math.min(0.0200, 0.0150)
  close(precipitateAmount, 0.0150, 1e-10)
  close(precipitateAmount * 143.32, 2.1498, 1e-8)
  close(0.0200 - precipitateAmount, 0.0050, 1e-10)

  const trialTwoPredictedCarbonDioxide = Math.min(0.00400, 0.00600 / 2)
  const carbonateAcidRequirement = 0.00400 * 2
  close(trialTwoPredictedCarbonDioxide, 0.00300, 1e-10)
  close(carbonateAcidRequirement, 0.00800, 1e-10)
  close(1 / 2, 0.500, 1e-10)
  close(0.180 / 5 * 3, 0.108, 1e-10)
  close((0.1000 * 0.03000 / 2) / 0.02500, 0.06000, 1e-10)

  const short = apChemistryChemicalReactionsQuestions.find(({ id }) => id === 'ap-chem-chemical-reactions-short-frq-001')
  assert.match(short.answer.modelAnswer, /0\.0150 mol AgCl.*0\.0050 mol excess Ag\+/)
})

test('Unit 4 metal-displacement calculations and error direction reproduce the long FRQ', () => {
  const copperAmount = 0.762 / 63.55
  const metalAmount = copperAmount * 2 / 3
  const metalMolarMass = 0.540 / metalAmount
  const initialCopper = 0.05000 * 0.3000
  const copperConcentration = (initialCopper - copperAmount) / 0.05000
  const metalConcentration = metalAmount / 0.05000

  close(copperAmount, 0.0119906, 1e-7)
  close(metalAmount, 0.0079937, 1e-7)
  close(metalMolarMass, 67.55, 0.01)
  close(copperConcentration, 0.06019, 0.00001)
  close(metalConcentration, 0.15987, 0.00001)

  const long = apChemistryChemicalReactionsQuestions.find(({ id }) => id === 'ap-chem-chemical-reactions-long-frq-001')
  assert.match(long.answer.modelAnswer, /0\.01199 mol.*0\.007994 mol.*67\.6 g\/mol/)
  assert.match(long.answer.modelAnswer, /\[Cu2\+\] = 0\.0602 M.*\[M3\+\] = 0\.160 M/)
  assert.match(long.answer.modelAnswer, /calculated molar mass of M too low/)
})

test('Unit 4 questions, resources, and misconceptions form a closed draft bundle', () => {
  const validation = validateContentBundle({
    questions: apChemistryChemicalReactionsQuestions,
    resources: apChemistryChemicalReactionsResources,
    misconceptions: apChemistryChemicalReactionsMisconceptions,
  })
  assert.deepEqual(validation, { valid: true, errors: [] })
  assert.equal(apChemistryChemicalReactionsQuestions.length, 28)
  assert.equal(apChemistryChemicalReactionsResources.length, 9)
  assert.equal(apChemistryChemicalReactionsMisconceptions.length, 9)
  assert.ok(apChemistryChemicalReactionsQuestions.every((question) => (
    question.content.status === 'draft'
    && question.content.reviewers.length === 0
    && question.source.kind === 'ai-generated'
  )))
})
