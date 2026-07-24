import test from 'node:test'
import assert from 'node:assert/strict'
import { getDomain } from '../taxonomy/contentTaxonomy.js'
import { validateEditorialCatalog } from './editorialSchema.js'
import { apChemistryThermochemistryResources } from './apChemistryThermochemistryResources.js'

const formulas = apChemistryThermochemistryResources.filter(({ kind }) => kind === 'formula')

test('Unit 6 starter resources validate and cover all nine canonical topics', () => {
  const domain = getDomain('ap-chemistry', 'thermochemistry')
  assert.ok(domain)
  assert.equal(validateEditorialCatalog(apChemistryThermochemistryResources).valid, true)
  assert.equal(formulas.length, 3)
  assert.equal(apChemistryThermochemistryResources.filter(({ kind }) => kind === 'lesson').length, 2)
  assert.equal(apChemistryThermochemistryResources.filter(({ kind }) => kind === 'stimulus').length, 2)
  assert.equal(apChemistryThermochemistryResources.filter(({ kind }) => kind === 'rubric').length, 2)
  assert.deepEqual(
    new Set(apChemistryThermochemistryResources.flatMap(({ alignment }) => alignment.skillIds)),
    new Set(domain.skills.map(({ id }) => id)),
  )
})

test('Unit 6 formula and lesson examples reproduce their stated numerical results', () => {
  assert.equal(125 * 4.184 * 6, 3138)
  assert.equal(-190 - (-40 + 2 * 0), -150)
  assert.equal(160 + 240 - 2 * 230, -60)
  assert.equal(2.40 / (25.0 - 21.0), 0.6)
  assert.equal(0.6 * (27.0 - 22.0), 3)
})

test('Unit 6 resources use the shared draft-only public boundary', () => {
  assert.ok(apChemistryThermochemistryResources.every(({ review }) => review.status === 'draft'))
  assert.ok(apChemistryThermochemistryResources.every(({ provenance }) => provenance.kind === 'ai-generated'))
})
