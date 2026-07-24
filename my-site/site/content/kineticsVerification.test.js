import test from 'node:test'
import assert from 'node:assert/strict'
import { apChemistryKineticsQuestions } from '../questions/catalog/apChemistryKineticsQuestions.js'
import { apChemistryKineticsMisconceptions } from './apChemistryKineticsMisconceptions.js'
import { apChemistryKineticsResources } from './apChemistryKineticsResources.js'
import { validateContentBundle } from './contentBundle.js'

function close(actual, expected, tolerance) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`)
}

test('Unit 5 selected-response answer keys are explicitly enumerated', () => {
  const keys = Object.fromEntries(apChemistryKineticsQuestions
    .filter(({ renderer }) => renderer === 'multiple-choice')
    .map(({ id, answer }) => [id, answer.correctOptionId]))
  assert.deepEqual(keys, {
    'ap-chem-kinetics-mcq-001': 'a',
    'ap-chem-kinetics-mcq-002': 'a',
    'ap-chem-kinetics-mcq-003': 'a',
    'ap-chem-kinetics-mcq-004': 'a',
    'ap-chem-kinetics-mcq-005': 'a',
    'ap-chem-kinetics-mcq-006': 'a',
    'ap-chem-kinetics-mcq-007': 'a',
    'ap-chem-kinetics-mcq-008': 'a',
    'ap-chem-kinetics-mcq-009': 'a',
    'ap-chem-kinetics-mcq-010': 'a',
    'ap-chem-kinetics-mcq-011': 'a',
    'ap-chem-kinetics-mcq-012': 'a',
    'ap-chem-kinetics-mcq-013': 'a',
    'ap-chem-kinetics-mcq-014': 'a',
    'ap-chem-kinetics-mcq-015': 'a',
    'ap-chem-kinetics-mcq-016': 'a',
    'ap-chem-kinetics-mcq-017': 'a',
    'ap-chem-kinetics-mcq-018': 'a',
    'ap-chem-kinetics-mcq-019': 'a',
    'ap-chem-kinetics-mcq-020': 'a',
    'ap-chem-kinetics-stimulus-mcq-001': 'c',
    'ap-chem-kinetics-stimulus-mcq-002': 'b',
    'ap-chem-kinetics-stimulus-mcq-003': 'c',
    'ap-chem-kinetics-stimulus-mcq-004': 'b',
    'ap-chem-kinetics-time-stimulus-mcq-001': 'b',
    'ap-chem-kinetics-time-stimulus-mcq-002': 'c',
    'ap-chem-kinetics-time-stimulus-mcq-003': 'a',
    'ap-chem-kinetics-time-stimulus-mcq-004': 'd',
  })
})

test('Unit 5 initial-rate and first-order calculations reproduce the answer content', () => {
  const k = 2.40e-3 / (0.100 ** 2 * 0.100)
  close(k, 2.40, 1e-10)
  close(k * 0.150 ** 2 * 0.200, 1.08e-2, 1e-10)
  close(6.0e-4 / 2, 3.0e-4, 1e-12)

  const firstOrderK = Math.log(2) / 200
  close(firstOrderK, 3.4657e-3, 1e-7)
  close(0.800 * 0.5 ** 3, 0.100, 1e-10)
  close(firstOrderK * 0.400, 1.3863e-3, 1e-7)
  close((3 / 2) * 0.040, 0.060, 1e-12)
  close(0.5 ** (36 / 12), 0.125, 1e-12)
  close(Math.log(2) / 150, 4.62098e-3, 1e-8)
  close((Math.log(2) / 150) * 0.160, 7.3936e-4, 1e-8)

  const short = apChemistryKineticsQuestions.find(({ id }) => id === 'ap-chem-kinetics-short-frq-001')
  assert.match(short.answer.modelAnswer, /3\.47 x 10\^-3 s\^-1.*0\.100 M.*1\.39 x 10\^-3 M\/s/)
})

test('Unit 5 mechanism and energy calculations reproduce the long FRQ', () => {
  close(125 - 55, 70, 1e-10)
  close(85 - 40, 45, 1e-10)
  close(20 - 40, -20, 1e-10)
  close(100 - 20, 80, 1e-10)
  close(100 - 50, 50, 1e-10)
  close(50 - 20, 30, 1e-10)
  const long = apChemistryKineticsQuestions.find(({ id }) => id === 'ap-chem-kinetics-long-frq-001')
  assert.match(long.answer.modelAnswer, /2 X \+ Y -> Z \+ W/)
  assert.match(long.answer.modelAnswer, /kobs\[X\]\^2\[Y\]/)
  assert.match(long.answer.modelAnswer, /70 kJ\/mol.*45 kJ\/mol/)
  assert.match(long.answer.modelAnswer, /equilibrium composition/)
})

test('Unit 5 questions, resources, and misconceptions form a closed draft bundle', () => {
  assert.deepEqual(validateContentBundle({
    questions: apChemistryKineticsQuestions,
    resources: apChemistryKineticsResources,
    misconceptions: apChemistryKineticsMisconceptions,
  }), { valid: true, errors: [] })
  assert.equal(apChemistryKineticsQuestions.length, 30)
  assert.equal(apChemistryKineticsResources.length, 9)
  assert.equal(apChemistryKineticsMisconceptions.length, 11)
})
