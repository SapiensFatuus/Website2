import test from 'node:test'
import assert from 'node:assert/strict'
import { getDomain } from '../taxonomy/contentTaxonomy.js'
import {
  getEditorialResource,
  getEditorialResourcesForDomain,
} from './resourceCatalog.js'
import { apChemistryChemicalReactionsResources } from './apChemistryChemicalReactionsResources.js'
import { validateEditorialCatalog } from './editorialSchema.js'

const DOMAIN_ID = 'chemical-reactions'
const formulas = apChemistryChemicalReactionsResources.filter(({ kind }) => kind === 'formula')
const lessons = apChemistryChemicalReactionsResources.filter(({ kind }) => kind === 'lesson')

function close(actual, expected, tolerance = 0.005) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`)
}

test('Unit 4 starter resources validate and cover all nine canonical topics', () => {
  const domain = getDomain('ap-chemistry', DOMAIN_ID)
  assert.equal(validateEditorialCatalog(apChemistryChemicalReactionsResources).valid, true)
  assert.equal(formulas.length, 3)
  assert.equal(lessons.length, 2)
  assert.equal(apChemistryChemicalReactionsResources.filter(({ kind }) => kind === 'stimulus').length, 2)
  assert.equal(apChemistryChemicalReactionsResources.filter(({ kind }) => kind === 'rubric').length, 2)
  assert.deepEqual(
    new Set(apChemistryChemicalReactionsResources.flatMap(({ alignment }) => alignment.skillIds)),
    new Set(domain.skills.map(({ id }) => id)),
  )
  assert.ok(apChemistryChemicalReactionsResources.every((resource) => (
    resource.alignment.domainId === DOMAIN_ID
    && resource.review.status === 'draft'
    && resource.review.reviewers.length === 0
    && resource.provenance.kind === 'ai-generated'
    && resource.provenance.originalityNote.includes('no released-question wording')
  )))
})

test('Unit 4 formula and lesson examples independently reproduce their stated results', () => {
  close(0.240 * 2 / 3, 0.160, 0.0001)
  close(0.1250 * 0.01840, 2.300e-3, 0.001e-3)
  close(0.1250 * 18.40 / 20.00, 0.1150, 0.0001)
  close((18.38 + 18.40 + 18.39) / 3, 18.39, 0.0001)
  close(0.1250 * 0.01839 / 0.02000, 0.1149, 0.0001)
  close(0.0150 * 143.32, 2.15, 0.01)
  close(0.00600 / 2, 0.00300, 0.000001)
  close(0.00400 * 2, 0.00800, 0.000001)

  const answers = formulas.map(({ workedExample }) => workedExample.answer).join(' ')
  assert.match(answers, /0\.160 mol AlCl3/)
  assert.match(answers, /2\.300 x 10\^-3 mol NaOH/)
  assert.match(answers, /0\.1150 M/)
})

test('Unit 4 resources stay behind the shared draft boundary', () => {
  assert.equal(getEditorialResourcesForDomain('ap-chemistry', DOMAIN_ID).length, 0)
  assert.equal(
    getEditorialResourcesForDomain('ap-chemistry', DOMAIN_ID, { includeDrafts: true }).length,
    apChemistryChemicalReactionsResources.length,
  )
  assert.equal(getEditorialResource(formulas[0].id), null)
  assert.equal(getEditorialResource(formulas[0].id, { includeDrafts: true })?.id, formulas[0].id)
})
