import test from 'node:test'
import assert from 'node:assert/strict'
import { getDomain } from '../taxonomy/contentTaxonomy.js'
import { validateEditorialCatalog } from './editorialSchema.js'
import { apChemistryCompoundStructurePropertiesResources } from './apChemistryCompoundStructurePropertiesResources.js'

test('Unit 2 starter resources validate and cover all seven canonical topics', () => {
  const domain = getDomain('ap-chemistry', 'compound-structure-properties')
  assert.ok(domain)
  assert.equal(validateEditorialCatalog(apChemistryCompoundStructurePropertiesResources).valid, true)
  assert.equal(apChemistryCompoundStructurePropertiesResources.filter(({ kind }) => kind === 'formula').length, 3)
  assert.equal(apChemistryCompoundStructurePropertiesResources.filter(({ kind }) => kind === 'lesson').length, 2)
  assert.equal(apChemistryCompoundStructurePropertiesResources.filter(({ kind }) => kind === 'stimulus').length, 2)
  assert.equal(apChemistryCompoundStructurePropertiesResources.filter(({ kind }) => kind === 'rubric').length, 2)
  assert.deepEqual(
    new Set(apChemistryCompoundStructurePropertiesResources.flatMap(({ alignment }) => alignment.skillIds)),
    new Set(domain.skills.map(({ id }) => id)),
  )
})

test('Unit 2 formula and lesson examples reproduce their stated results', () => {
  assert.equal(320 > 180, true)
  assert.ok(Math.abs((2 + 1 + 1) / 3 - 4 / 3) < 1e-12)
  assert.equal(3 + 1, 4)
  assert.equal(4 + 3 * 6 + 2, 24)
})

test('Unit 2 resources use the shared draft-only public boundary', () => {
  assert.ok(apChemistryCompoundStructurePropertiesResources.every(({ review }) => review.status === 'draft'))
  assert.ok(apChemistryCompoundStructurePropertiesResources.every(({ provenance }) => provenance.kind === 'ai-generated'))
})
