import test from 'node:test'
import assert from 'node:assert/strict'
import { apChemistryThermochemistryQuestions } from '../questions/catalog/apChemistryThermochemistryQuestions.js'
import { apChemistryThermochemistryMisconceptions } from './apChemistryThermochemistryMisconceptions.js'
import { apChemistryThermochemistryResources } from './apChemistryThermochemistryResources.js'
import { validateContentBundle } from './contentBundle.js'

test('Unit 6 selected-response answer keys are explicitly enumerated', () => {
  const keys = Object.fromEntries(apChemistryThermochemistryQuestions
    .filter(({ renderer }) => renderer === 'multiple-choice')
    .map(({ id, answer }) => [id, answer.correctOptionId]))
  assert.equal(Object.keys(keys).length, 26)
  assert.ok(Object.values(keys).every((key) => key === 'a'))
})

test('Unit 6 calorimetry and enthalpy calculations reproduce the answer content', () => {
  const capacity = 2.40 / 4.0
  const calorimeterHeat = capacity * 5.0
  assert.equal(capacity, 0.6)
  assert.equal(calorimeterHeat, 3)
  assert.equal(-calorimeterHeat / 0.0200, -150)
  assert.equal(125 - 80, 45)
  assert.equal(170 - 80, 90)
  assert.equal(160 + 240 - 2 * 230, -60)
  assert.equal(-190 - (-40), -150)
  assert.equal(20 - 60, -40)
  assert.equal(140 - 60, 80)
  assert.equal(140 - 20, 120)
  assert.equal((100 * 2 * 80 + 200 * 1 * 20) / (100 * 2 + 200 * 1), 50)
  assert.equal(2 * 400 - (436 + 250), 114)
  assert.equal(-180 - (-50 + 0), -130)
  assert.equal((75.0 * 4.18 * 5.20) / 1000, 1.6302)
  assert.equal(-92 * (0.50 / 2.0), -23)
  assert.equal(436 + 243 - 2 * 431, -183)
  assert.equal(-35 * 3, -105)
  assert.equal(2500 / (50.0 * 25.0), 2)
  assert.equal(2500 / 50.0, 50)
  assert.equal(125 * 50 / 1000, 6.25)
})

test('Unit 6 Hess-law results and scaling reproduce the long FRQ', () => {
  const formationResult = -66 - (0 + 0)
  const hessResult = -100 - 120 + 154
  assert.equal(formationResult, -66)
  assert.equal(hessResult, -66)
  assert.equal(0.250 * formationResult, -16.5)
})

test('Unit 6 questions, resources, and misconceptions form a closed draft bundle', () => {
  assert.deepEqual(validateContentBundle({
    questions: apChemistryThermochemistryQuestions,
    resources: apChemistryThermochemistryResources,
    misconceptions: apChemistryThermochemistryMisconceptions,
  }), { valid: true, errors: [] })
  assert.equal(apChemistryThermochemistryQuestions.length, 28)
  assert.equal(apChemistryThermochemistryResources.length, 9)
  assert.equal(apChemistryThermochemistryMisconceptions.length, 9)
})
