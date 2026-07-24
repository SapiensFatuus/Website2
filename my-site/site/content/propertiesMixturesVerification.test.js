import test from 'node:test'
import assert from 'node:assert/strict'
import { apChemistryPropertiesMixturesQuestions } from '../questions/catalog/apChemistryPropertiesMixturesQuestions.js'
import { apChemistryPropertiesMixturesMisconceptions } from './apChemistryPropertiesMixturesMisconceptions.js'
import { apChemistryPropertiesMixturesResources } from './apChemistryPropertiesMixturesResources.js'
import { validateContentBundle } from './contentBundle.js'

function close(actual, expected, tolerance) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`)
}

test('Unit 3 starter answer keys are explicitly enumerated and complete', () => {
  const keys = Object.fromEntries(apChemistryPropertiesMixturesQuestions
    .filter(({ renderer }) => renderer === 'multiple-choice')
    .map(({ id, answer }) => [id, answer.correctOptionId]))
  assert.deepEqual(keys, {
    'ap-chem-properties-mixtures-mcq-001': 'a',
    'ap-chem-properties-mixtures-mcq-002': 'b',
    'ap-chem-properties-mixtures-mcq-003': 'b',
    'ap-chem-properties-mixtures-mcq-004': 'a',
    'ap-chem-properties-mixtures-mcq-005': 'a',
    'ap-chem-properties-mixtures-mcq-006': 'c',
    'ap-chem-properties-mixtures-mcq-007': 'c',
    'ap-chem-properties-mixtures-mcq-008': 'b',
    'ap-chem-properties-mixtures-mcq-009': 'd',
    'ap-chem-properties-mixtures-mcq-010': 'b',
    'ap-chem-properties-mixtures-mcq-011': 'c',
    'ap-chem-properties-mixtures-mcq-012': 'a',
    'ap-chem-properties-mixtures-mcq-013': 'b',
    'ap-chem-properties-mixtures-mcq-014': 'd',
    'ap-chem-properties-mixtures-mcq-015': 'b',
    'ap-chem-properties-mixtures-mcq-016': 'c',
    'ap-chem-properties-mixtures-mcq-017': 'a',
    'ap-chem-properties-mixtures-mcq-018': 'b',
    'ap-chem-properties-mixtures-mcq-019': 'c',
    'ap-chem-properties-mixtures-mcq-020': 'b',
    'ap-chem-properties-mixtures-mcq-021': 'a',
    'ap-chem-properties-mixtures-mcq-022': 'd',
    'ap-chem-properties-mixtures-mcq-023': 'b',
    'ap-chem-properties-mixtures-mcq-024': 'a',
    'ap-chem-properties-mixtures-mcq-025': 'b',
    'ap-chem-properties-mixtures-mcq-026': 'c',
    'ap-chem-properties-mixtures-mcq-027': 'a',
    'ap-chem-properties-mixtures-mcq-028': 'b',
    'ap-chem-properties-mixtures-mcq-029': 'a',
    'ap-chem-properties-mixtures-mcq-030': 'b',
    'ap-chem-properties-mixtures-mcq-031': 'a',
    'ap-chem-properties-mixtures-mcq-032': 'b',
    'ap-chem-properties-mixtures-mcq-033': 'b',
    'ap-chem-properties-mixtures-mcq-034': 'c',
    'ap-chem-properties-mixtures-mcq-035': 'b',
    'ap-chem-properties-mixtures-gas-stimulus-mcq-001': 'b',
    'ap-chem-properties-mixtures-gas-stimulus-mcq-002': 'c',
    'ap-chem-properties-mixtures-gas-stimulus-mcq-003': 'a',
    'ap-chem-properties-mixtures-gas-stimulus-mcq-004': 'd',
    'ap-chem-properties-mixtures-separation-stimulus-mcq-001': 'c',
    'ap-chem-properties-mixtures-separation-stimulus-mcq-002': 'b',
    'ap-chem-properties-mixtures-separation-stimulus-mcq-003': 'd',
    'ap-chem-properties-mixtures-separation-stimulus-mcq-004': 'a',
    'ap-chem-properties-mixtures-spectrum-stimulus-mcq-001': 'c',
    'ap-chem-properties-mixtures-spectrum-stimulus-mcq-002': 'a',
    'ap-chem-properties-mixtures-spectrum-stimulus-mcq-003': 'd',
    'ap-chem-properties-mixtures-spectrum-stimulus-mcq-004': 'b',
    'ap-chem-properties-mixtures-liquids-stimulus-mcq-001': 'b',
    'ap-chem-properties-mixtures-liquids-stimulus-mcq-002': 'd',
    'ap-chem-properties-mixtures-liquids-stimulus-mcq-003': 'a',
    'ap-chem-properties-mixtures-liquids-stimulus-mcq-004': 'c',
    'ap-chem-properties-mixtures-stimulus-mcq-001': 'c',
    'ap-chem-properties-mixtures-stimulus-mcq-002': 'b',
    'ap-chem-properties-mixtures-stimulus-mcq-003': 'c',
    'ap-chem-properties-mixtures-stimulus-mcq-004': 'a',
  })
})

test('Unit 3 selected-response and stimulus calculations reproduce every numerical key', () => {
  close((0.250 * 0.08206 * 315) / 1.05, 6.15, 0.01)
  close(650 / 450, 1.44, 0.01)
  close((0.100 * 0.08206 * 400) / 1.00, 3.28, 0.01)
  close(1.84 * 0.08206 * 310 / 0.950, 49.3, 0.1)
  close(Math.sqrt(20.0 / 4.00), 2.24, 0.01)
  close(0.150 * 0.2000 * 101.1, 3.03, 0.01)
  close(3.00 / 12.0 * 100, 25.0, 0.01)
  close(2.998e8 / 7.50e14, 4.00e-7, 0.01e-7)
  close((0.390 - 0.015) / 2.50e3, 1.50e-4, 0.001e-4)
  const saltMoles = 12.80 / 58.44
  close(saltMoles / 0.2500, 0.876, 0.001)
  const scanPhotonEnergy = 6.626e-34 * 2.998e8 / 500e-9
  const scanFrequency = 2.998e8 / 500e-9
  close(scanPhotonEnergy, 3.97e-19, 0.01e-19)
  close(scanFrequency, 6.00e14, 0.01e14)
  const calibrationSlope = 0.120 / 1.00e-5
  close(calibrationSlope, 1.20e4, 1)
  const dilutedUnknown = 0.300 / calibrationSlope
  close(dilutedUnknown, 2.50e-5, 0.001e-5)
  close(dilutedUnknown * 25.00 / 10.00, 6.25e-5, 0.001e-5)
})

test('Unit 3 FRQ model answers and point rubrics reproduce the stated results', () => {
  const short = apChemistryPropertiesMixturesQuestions.find(({ id }) => id === 'ap-chem-properties-mixtures-short-frq-001')
  const dryPressure = 1.200 - 0.105
  const gasMoles = dryPressure * 0.250 / (0.08206 * 320)
  close(dryPressure, 1.095, 0.0001)
  close(gasMoles, 0.0104, 0.0001)
  close(0.500 / gasMoles, 48.0, 0.1)
  assert.match(short.answer.modelAnswer, /1\.095 atm.*0\.0104 mol.*48\.0 g\/mol/)

  const mixturePressure = 0.500 * 0.08206 * 300 / 10.0
  close(mixturePressure, 1.23, 0.01)
  close(0.400 * mixturePressure, 0.492, 0.001)
  close(0.600 * 0.08206 * 300 / 10.0, 1.48, 0.01)
  close((100 - 82) / 100, 0.18, 0.0001)
  close((200 - 190) / 200, 0.05, 0.0001)
  close(Math.sqrt(500 / 250), 1.41, 0.01)
  const calciumChlorideMoles = 0.200 * 0.2500
  close(calciumChlorideMoles, 0.0500, 0.0001)
  close(calciumChlorideMoles * 110.98, 5.55, 0.01)
  close(0.200 * 25.00 / 100.0, 0.0500, 0.0001)
  close(6.4 / 8.0, 0.80, 0.001)
  close(2.0 / 8.0, 0.25, 0.001)
  const dilutedDye = (0.380 - 0.020) / 6.00e3
  close(dilutedDye, 6.00e-5, 0.001e-5)
  close(dilutedDye * 20.00 / 5.00, 2.40e-4, 0.001e-4)

  const long = apChemistryPropertiesMixturesQuestions.find(({ id }) => id === 'ap-chem-properties-mixtures-long-frq-001')
  const standard = 1.00e-3 * 6.00 / 50.00
  const slope = 0.540 / standard
  const diluted = 0.450 / slope
  const original = diluted * 25.00 / 5.00
  const photonEnergy = 6.626e-34 * 2.998e8 / 525e-9
  close(standard, 1.20e-4, 0.001e-4)
  close(slope, 4.50e3, 1)
  close(diluted, 1.00e-4, 0.001e-4)
  close(original, 5.00e-4, 0.001e-4)
  close(photonEnergy, 3.78e-19, 0.01e-19)
  assert.match(long.answer.modelAnswer, /1\.20 x 10\^-4 M.*4\.50 x 10\^3 L\/mol.*1\.00 x 10\^-4 M.*5\.00 x 10\^-4 M.*3\.78 x 10\^-19 J/)

  const volatileMoles = 0.158 * 0.250 / (0.08206 * 375)
  close(volatileMoles, 1.28e-3, 0.01e-3)
  close(0.125 / volatileMoles, 97.4, 0.1)
  const dyeMass = 1.500 - 0.540
  close(dyeMass, 0.960, 0.001)
  close(dyeMass / 1.500 * 100, 64.0, 0.01)
  const finalDyeConcentration = 0.480 / 40.0
  const filtrateDyeConcentration = finalDyeConcentration * 50.00 / 10.00
  const dyeMoles = filtrateDyeConcentration * 0.1000
  close(finalDyeConcentration, 0.0120, 0.0001)
  close(filtrateDyeConcentration, 0.0600, 0.0001)
  close(dyeMoles, 0.00600, 0.00001)
  close(dyeMass / dyeMoles, 160, 0.1)
  close(6.626e-34 * 2.998e8 / 600e-9, 3.31e-19, 0.01e-19)

  const rubrics = apChemistryPropertiesMixturesResources.filter(({ kind }) => kind === 'rubric')
  assert.deepEqual(rubrics.map(({ maxPoints }) => maxPoints), [4, 4, 4, 4, 4, 4, 4, 4, 7, 7, 7])
  rubrics.forEach((rubric) => {
    assert.equal(rubric.parts.flatMap(({ points }) => points).length, rubric.maxPoints)
  })
})

test('Unit 3 questions, resources, and misconceptions form a closed draft bundle', () => {
  const validation = validateContentBundle({
    questions: apChemistryPropertiesMixturesQuestions,
    resources: apChemistryPropertiesMixturesResources,
    misconceptions: apChemistryPropertiesMixturesMisconceptions,
  })
  assert.deepEqual(validation, { valid: true, errors: [] })
  assert.equal(apChemistryPropertiesMixturesQuestions.length, 66)
  assert.equal(apChemistryPropertiesMixturesResources.length, 27)
  assert.equal(apChemistryPropertiesMixturesMisconceptions.length, 13)
  assert.ok(apChemistryPropertiesMixturesQuestions.every((question) => (
    question.content.status === 'draft'
    && question.content.reviewers.length === 0
    && question.source.kind === 'ai-generated'
    && question.referenceRequirements.formulaIds.length + question.referenceRequirements.priorKnowledge.length > 0
  )))
})
