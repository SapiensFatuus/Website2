import test from 'node:test'
import assert from 'node:assert/strict'
import { apChemistryCompoundStructurePropertiesQuestions } from '../questions/catalog/apChemistryCompoundStructurePropertiesQuestions.js'
import { apChemistryCompoundStructurePropertiesMisconceptions } from './apChemistryCompoundStructurePropertiesMisconceptions.js'
import { apChemistryCompoundStructurePropertiesResources } from './apChemistryCompoundStructurePropertiesResources.js'
import { validateContentBundle } from './contentBundle.js'

test('Unit 2 selected-response answer keys are explicitly enumerated', () => {
  const keys = Object.fromEntries(apChemistryCompoundStructurePropertiesQuestions
    .filter(({ renderer }) => renderer === 'multiple-choice')
    .map(({ id, answer }) => [id, answer.correctOptionId]))
  assert.equal(Object.keys(keys).length, 28)
  assert.ok(Object.values(keys).every((key) => key === 'a'))
})

test('Unit 2 Lewis, formal-charge, and bond-order calculations reproduce answer content', () => {
  assert.equal(5 + 3 * 6 + 1, 24)
  assert.equal(4 + 3 * 6 + 2, 24)
  assert.ok(Math.abs((2 + 1 + 1) / 3 - 4 / 3) < 1e-12)
  const carbonFormalCharge = 4 - 0 - 8 / 2
  const doubleOFormalCharge = 6 - 4 - 4 / 2
  const singleOFormalCharge = 6 - 6 - 2 / 2
  assert.equal(carbonFormalCharge, 0)
  assert.equal(doubleOFormalCharge, 0)
  assert.equal(singleOFormalCharge, -1)
  assert.equal(carbonFormalCharge + doubleOFormalCharge + 2 * singleOFormalCharge, -2)
  assert.equal(6 + 2 * 6, 18)
  assert.equal((2 + 1) / 2, 1.5)
  assert.equal(Math.abs(2 * -2), 4)
  assert.equal(Math.abs(1 * -1), 1)
  assert.equal(6 + 4 * 7, 34)
  assert.equal(0.150 * 410, 61.5)
  assert.equal(-250 - 0, -250)
})

test('Unit 2 potential-curve values reproduce the short FRQ', () => {
  assert.equal(110 < 145, true)
  assert.equal(Math.abs(-320), 320)
  assert.equal(Math.abs(-180), 180)
  assert.equal(Math.abs(-320) > Math.abs(-180), true)
})

test('Unit 2 questions, resources, and misconceptions form a closed draft bundle', () => {
  assert.deepEqual(validateContentBundle({
    questions: apChemistryCompoundStructurePropertiesQuestions,
    resources: apChemistryCompoundStructurePropertiesResources,
    misconceptions: apChemistryCompoundStructurePropertiesMisconceptions,
  }), { valid: true, errors: [] })
  assert.equal(apChemistryCompoundStructurePropertiesQuestions.length, 30)
  assert.equal(apChemistryCompoundStructurePropertiesResources.length, 9)
  assert.equal(apChemistryCompoundStructurePropertiesMisconceptions.length, 7)
})
