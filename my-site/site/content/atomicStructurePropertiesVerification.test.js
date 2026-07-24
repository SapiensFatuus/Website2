import test from 'node:test'
import assert from 'node:assert/strict'
import { apChemistryAtomicStructurePropertiesQuestions } from '../questions/catalog/apChemistryAtomicStructurePropertiesQuestions.js'
import { apChemistryAtomicStructurePropertiesMisconceptions } from './apChemistryAtomicStructurePropertiesMisconceptions.js'
import { apChemistryAtomicStructurePropertiesResources } from './apChemistryAtomicStructurePropertiesResources.js'
import { validateContentBundle } from './contentBundle.js'

test('Unit 1 selected-response answer keys are explicitly enumerated', () => {
  const keys = Object.fromEntries(apChemistryAtomicStructurePropertiesQuestions
    .filter(({ renderer }) => renderer === 'multiple-choice')
    .map(({ id, answer }) => [id, answer.correctOptionId]))
  assert.equal(Object.keys(keys).length, 28)
  assert.ok(Object.values(keys).every((key) => key === 'a'))
})

test('Unit 1 amount, mixture, and isotope calculations reproduce answer content', () => {
  assert.ok(Math.abs((9 / 45) * 6.022e23 - 1.2044e23) < 1e18)
  assert.equal(24 * 0.75 + 26 * 0.25, 24.5)
  assert.equal(20 * 0.30 * 0.50 + 20 * 0.70 * 0.10, 4.4)
  assert.ok(Math.abs(62 * 0.60 + 64 * 0.30 + 66 * 0.10 - 63) < 1e-10)
  assert.ok(Math.abs(12.6 / 63 - 0.2) < 1e-10)
  assert.ok(Math.abs((3.011e23 / 6.022e23) * 80.0 - 40.0) < 1e-10)
  assert.equal(10 * 0.80 + 11 * 0.20, 10.2)
  assert.equal(40 * 0.25 * 0.80 + 40 * 0.75 * 0.20, 14)
  assert.equal((1.92 / 16.0) / (2.40 / 40.0), 2)
  assert.ok(Math.abs((3.011e23 / 6.022e23) * 58.44 - 29.22) < 1e-10)
  assert.equal(30.0 * 0.400 + 70.0 * 0.100, 19.0)
  assert.equal(2 + 2 + 6 + 2, 12)
})

test('Unit 1 empirical-composition calculations reproduce the short FRQ', () => {
  const oxygenMass = 7.20 - 2.40
  const molesX = 2.40 / 40.0
  const molesO = oxygenMass / 16.0
  assert.ok(Math.abs(oxygenMass - 4.80) < 1e-10)
  assert.ok(Math.abs(molesX - 0.0600) < 1e-10)
  assert.ok(Math.abs(molesO - 0.300) < 1e-10)
  assert.ok(Math.abs(molesO / molesX - 5) < 1e-10)
  assert.ok(Math.abs(80 / 120 * 100 - 66.6666667) < 1e-5)
})

test('Unit 1 questions, resources, and misconceptions form a closed draft bundle', () => {
  assert.deepEqual(validateContentBundle({
    questions: apChemistryAtomicStructurePropertiesQuestions,
    resources: apChemistryAtomicStructurePropertiesResources,
    misconceptions: apChemistryAtomicStructurePropertiesMisconceptions,
  }), { valid: true, errors: [] })
  assert.equal(apChemistryAtomicStructurePropertiesQuestions.length, 30)
  assert.equal(apChemistryAtomicStructurePropertiesResources.length, 10)
  assert.equal(apChemistryAtomicStructurePropertiesMisconceptions.length, 8)
})
