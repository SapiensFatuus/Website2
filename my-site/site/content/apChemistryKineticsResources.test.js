import test from 'node:test'
import assert from 'node:assert/strict'
import { getDomain } from '../taxonomy/contentTaxonomy.js'
import { getEditorialResource, getEditorialResourcesForDomain } from './resourceCatalog.js'
import { apChemistryKineticsResources } from './apChemistryKineticsResources.js'
import { validateEditorialCatalog } from './editorialSchema.js'

const DOMAIN_ID = 'kinetics'
const formulas = apChemistryKineticsResources.filter(({ kind }) => kind === 'formula')

function close(actual, expected, tolerance = 0.005) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`)
}

test('Unit 5 starter resources validate and cover all eleven canonical topics', () => {
  const domain = getDomain('ap-chemistry', DOMAIN_ID)
  assert.equal(validateEditorialCatalog(apChemistryKineticsResources).valid, true)
  assert.equal(formulas.length, 3)
  assert.equal(apChemistryKineticsResources.filter(({ kind }) => kind === 'lesson').length, 2)
  assert.equal(apChemistryKineticsResources.filter(({ kind }) => kind === 'stimulus').length, 2)
  assert.equal(apChemistryKineticsResources.filter(({ kind }) => kind === 'rubric').length, 2)
  assert.deepEqual(
    new Set(apChemistryKineticsResources.flatMap(({ alignment }) => alignment.skillIds)),
    new Set(domain.skills.map(({ id }) => id)),
  )
  assert.ok(apChemistryKineticsResources.every((resource) => (
    resource.review.status === 'draft'
    && resource.review.reviewers.length === 0
    && resource.provenance.kind === 'ai-generated'
  )))
})

test('Unit 5 formula and lesson examples reproduce their stated numerical results', () => {
  close(0.0800 / 20.0 / 2, 0.00200, 1e-8)
  close(0.00200 * 3, 0.00600, 1e-8)
  close(4.80e-3 / (0.100 ** 2 * 0.200), 2.40, 1e-8)
  close(Math.log(2) / 200, 3.47e-3, 0.01e-3)
  close(125 - 55, 70, 1e-8)
  assert.match(formulas.map(({ workedExample }) => workedExample.answer).join(' '), /0\.00200 M\/s.*2\.40 M\^-2 s\^-1.*3\.47 x 10\^-3 s\^-1/)
})

test('Unit 5 resources use the shared draft-only public boundary', () => {
  assert.equal(getEditorialResourcesForDomain('ap-chemistry', DOMAIN_ID).length, 0)
  assert.equal(getEditorialResourcesForDomain('ap-chemistry', DOMAIN_ID, { includeDrafts: true }).length, 9)
  assert.equal(getEditorialResource(formulas[0].id), null)
  assert.equal(getEditorialResource(formulas[0].id, { includeDrafts: true })?.id, formulas[0].id)
})
