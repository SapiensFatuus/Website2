import test from 'node:test'
import assert from 'node:assert/strict'
import { apChemistryThermodynamicsElectrochemistryQuestions } from '../questions/catalog/apChemistryThermodynamicsElectrochemistryQuestions.js'
import { apChemistryThermodynamicsElectrochemistryMisconceptions } from './apChemistryThermodynamicsElectrochemistryMisconceptions.js'
import { apChemistryThermodynamicsElectrochemistryResources } from './apChemistryThermodynamicsElectrochemistryResources.js'
import { validateContentBundle } from './contentBundle.js'

test('Unit 9 selected-response answer keys are explicitly enumerated', () => {
  const keys = Object.fromEntries(apChemistryThermodynamicsElectrochemistryQuestions
    .filter(({ renderer }) => renderer === 'multiple-choice')
    .map(({ id, answer }) => [id, answer.correctOptionId]))
  assert.equal(Object.keys(keys).length, 28)
  assert.deepEqual(
    Object.fromEntries(Object.entries(keys).filter(([id]) => id.includes('temperature-stimulus'))),
    {
      'ap-chem-thermodynamics-temperature-stimulus-mcq-001': 'b',
      'ap-chem-thermodynamics-temperature-stimulus-mcq-002': 'c',
      'ap-chem-thermodynamics-temperature-stimulus-mcq-003': 'a',
      'ap-chem-thermodynamics-temperature-stimulus-mcq-004': 'd',
    },
  )
  assert.ok(Object.entries(keys)
    .filter(([id]) => !id.includes('temperature-stimulus'))
    .every(([, key]) => key === 'a'))
})

test('Unit 9 free-energy calculations reproduce the long FRQ', () => {
  const entropyJ = 260 - (190 + 210)
  const entropyKj = entropyJ / 1000
  const freeEnergy = -50.0 - 298 * entropyKj
  const boundary = -50.0 / entropyKj
  assert.equal(entropyJ, -140)
  assert.ok(Math.abs(freeEnergy - (-8.28)) < 1e-10)
  assert.ok(Math.abs(boundary - 357.142857) < 1e-5)
  assert.ok(Math.abs(freeEnergy + 12.0 - 3.72) < 1e-10)
  assert.equal((200 + 250) - 2 * 150, 150)
  assert.equal(-30.0 - 500 * (-0.0500), -5.0)
  assert.equal(15.0 - 300 * 0.0600, -3.0)
  assert.equal(240 - 2 * 175, -110)
  assert.equal(36.0 / 0.120, 300)
  assert.equal(25 + 2 * -18, -11)
  assert.equal(42.0 - 200 * 0.140, 14.0)
  assert.equal(42.0 / 0.140, 300)
  assert.equal(42.0 - 400 * 0.140, -14.0)
})

test('Unit 9 cell calculations reproduce the stimulus and short FRQ', () => {
  const cellPotential = 0.55 - (-0.25)
  const freeEnergy = -(2 * 96485 * cellPotential) / 1000
  assert.equal(cellPotential, 0.8)
  assert.ok(Math.abs(freeEnergy - (-154.376)) < 1e-9)
  assert.ok(Math.abs(0.80 - (-0.40) - 1.20) < 1e-12)
})

test('Unit 9 questions, resources, and misconceptions form a closed draft bundle', () => {
  assert.deepEqual(validateContentBundle({
    questions: apChemistryThermodynamicsElectrochemistryQuestions,
    resources: apChemistryThermodynamicsElectrochemistryResources,
    misconceptions: apChemistryThermodynamicsElectrochemistryMisconceptions,
  }), { valid: true, errors: [] })
  assert.equal(apChemistryThermodynamicsElectrochemistryQuestions.length, 30)
  assert.equal(apChemistryThermodynamicsElectrochemistryResources.length, 9)
  assert.equal(apChemistryThermodynamicsElectrochemistryMisconceptions.length, 8)
})
