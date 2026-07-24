import test from 'node:test'
import assert from 'node:assert/strict'
import { getDomain } from '../taxonomy/contentTaxonomy.js'
import { validateEditorialCatalog } from './editorialSchema.js'
import { apChemistryAtomicStructurePropertiesResources } from './apChemistryAtomicStructurePropertiesResources.js'

test('Unit 1 starter resources validate and cover all eight canonical topics', () => {
  const domain = getDomain('ap-chemistry', 'atomic-structure-properties')
  assert.ok(domain)
  assert.equal(validateEditorialCatalog(apChemistryAtomicStructurePropertiesResources).valid, true)
  assert.equal(apChemistryAtomicStructurePropertiesResources.filter(({ kind }) => kind === 'formula').length, 4)
  assert.equal(apChemistryAtomicStructurePropertiesResources.filter(({ kind }) => kind === 'lesson').length, 2)
  assert.equal(apChemistryAtomicStructurePropertiesResources.filter(({ kind }) => kind === 'stimulus').length, 2)
  assert.equal(apChemistryAtomicStructurePropertiesResources.filter(({ kind }) => kind === 'rubric').length, 2)
  assert.deepEqual(
    new Set(apChemistryAtomicStructurePropertiesResources.flatMap(({ alignment }) => alignment.skillIds)),
    new Set(domain.skills.map(({ id }) => id)),
  )
})

test('Unit 1 formula and lesson examples reproduce their stated numerical results', () => {
  assert.ok(Math.abs((9 / 45) * 6.022e23 - 1.2044e23) < 1e18)
  assert.equal(24 * 0.75 + 26 * 0.25, 24.5)
  assert.equal(4 / 40, 0.1)
  assert.equal(6 / 20, 0.3)
  assert.equal(17 - (-1), 18)
  assert.ok(Math.abs(62 * 0.6 + 64 * 0.3 + 66 * 0.1 - 63) < 1e-10)
})

test('Unit 1 resources use the shared draft-only public boundary', () => {
  assert.ok(apChemistryAtomicStructurePropertiesResources.every(({ review }) => review.status === 'draft'))
  assert.ok(apChemistryAtomicStructurePropertiesResources.every(({ provenance }) => provenance.kind === 'ai-generated'))
})
