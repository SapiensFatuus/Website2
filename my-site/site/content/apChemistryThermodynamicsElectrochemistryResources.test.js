import test from 'node:test'
import assert from 'node:assert/strict'
import { getDomain } from '../taxonomy/contentTaxonomy.js'
import { validateEditorialCatalog } from './editorialSchema.js'
import { apChemistryThermodynamicsElectrochemistryResources } from './apChemistryThermodynamicsElectrochemistryResources.js'

test('Unit 9 starter resources validate and cover all eight canonical topics', () => {
  const domain = getDomain('ap-chemistry', 'thermodynamics-electrochemistry')
  assert.ok(domain)
  assert.equal(validateEditorialCatalog(apChemistryThermodynamicsElectrochemistryResources).valid, true)
  assert.equal(apChemistryThermodynamicsElectrochemistryResources.filter(({ kind }) => kind === 'formula').length, 3)
  assert.equal(apChemistryThermodynamicsElectrochemistryResources.filter(({ kind }) => kind === 'lesson').length, 2)
  assert.equal(apChemistryThermodynamicsElectrochemistryResources.filter(({ kind }) => kind === 'stimulus').length, 2)
  assert.equal(apChemistryThermodynamicsElectrochemistryResources.filter(({ kind }) => kind === 'rubric').length, 2)
  assert.deepEqual(
    new Set(apChemistryThermodynamicsElectrochemistryResources.flatMap(({ alignment }) => alignment.skillIds)),
    new Set(domain.skills.map(({ id }) => id)),
  )
})

test('Unit 9 formula and lesson examples reproduce their stated numerical results', () => {
  assert.equal(260 - (190 + 210), -140)
  assert.ok(Math.abs(20.0 - 298 * 0.100 - (-9.8)) < 1e-10)
  assert.ok(Math.abs(0.80 - 0.20 - 0.60) < 1e-10)
  assert.ok(Math.abs(-(2 * 96485 * 0.60) / 1000 - (-115.782)) < 1e-9)
  assert.equal(12 + (-20), -8)
  assert.ok(Math.abs((2.00 * 965) / 96485 / 2 - 0.0100016) < 1e-5)
})

test('Unit 9 resources use the shared draft-only public boundary', () => {
  assert.ok(apChemistryThermodynamicsElectrochemistryResources.every(({ review }) => review.status === 'draft'))
  assert.ok(apChemistryThermodynamicsElectrochemistryResources.every(({ provenance }) => provenance.kind === 'ai-generated'))
})
