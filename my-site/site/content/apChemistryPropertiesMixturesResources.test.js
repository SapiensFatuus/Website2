import test from 'node:test'
import assert from 'node:assert/strict'
import { getDomain } from '../taxonomy/contentTaxonomy.js'
import {
  getEditorialResource,
  getEditorialResourcesForDomain,
} from './resourceCatalog.js'
import { apChemistryPropertiesMixturesResources } from './apChemistryPropertiesMixturesResources.js'
import { validateEditorialCatalog } from './editorialSchema.js'

const DOMAIN_ID = 'properties-substances-mixtures'
const formulas = apChemistryPropertiesMixturesResources.filter(({ kind }) => kind === 'formula')
const lessons = apChemistryPropertiesMixturesResources.filter(({ kind }) => kind === 'lesson')

function close(actual, expected, tolerance = 0.005) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`)
}

test('Unit 3 starter resources validate and cover all thirteen canonical topics', () => {
  const domain = getDomain('ap-chemistry', DOMAIN_ID)
  assert.equal(validateEditorialCatalog(apChemistryPropertiesMixturesResources).valid, true)
  assert.equal(formulas.length, 6)
  assert.equal(lessons.length, 5)
  assert.deepEqual(
    new Set(apChemistryPropertiesMixturesResources.flatMap(({ alignment }) => alignment.skillIds)),
    new Set(domain.skills.map(({ id }) => id)),
  )
  assert.ok(apChemistryPropertiesMixturesResources.every((resource) => (
    resource.alignment.domainId === DOMAIN_ID
    && resource.review.status === 'draft'
    && resource.review.reviewers.length === 0
    && resource.provenance.kind === 'ai-generated'
    && resource.provenance.originalityNote.includes('no released-question wording')
  )))
})

test('Unit 3 formula examples independently reproduce their stated results', () => {
  close((0.825 * 0.08206 * 298) / 1.15, 17.5, 0.06)
  close(2.50 * (0.400 / (0.400 + 0.600)), 1.00, 0.001)
  close((0.742 * 0.08206 * 298) / (0.825 * 0.300), 73.3, 0.06)
  close(0.375 / 1.50, 0.250, 0.0001)
  close((6.626e-34 * 2.998e8) / 486e-9, 4.09e-19, 0.01e-19)
  close(0.624 / (1.30e4 * 1.00), 4.80e-5, 0.001e-5)

  const answers = formulas.map(({ workedExample }) => workedExample.answer).join(' ')
  assert.match(answers, /17\.5 L/)
  assert.match(answers, /1\.00 atm/)
  assert.match(answers, /73\.3 g\/mol/)
  assert.match(answers, /0\.250 mol\/L/)
  assert.match(answers, /4\.09 x 10\^-19 J/)
  assert.match(answers, /4\.80 x 10\^-5 mol\/L/)
})

test('Unit 3 lesson examples preserve conservation and calibration reasoning', () => {
  close((0.300 * 0.200) / 0.750, 0.0800, 0.0001)
  close((0.410 - 0.010) / 8.00e3, 5.00e-5, 0.001e-5)
  const lessonText = lessons.map(({ sections, misconceptions }) => [
    ...sections.map(({ body }) => body),
    ...misconceptions.map(({ correction }) => correction),
  ].join(' ')).join(' ')
  assert.match(lessonText, /does not change molecular identity/)
  assert.match(lessonText, /same average translational kinetic energy/)
  assert.match(lessonText, /conserves solute amount/)
  assert.match(lessonText, /rate of reaching equilibrium/)
  assert.match(lessonText, /Photon energy is set by frequency/)
})

test('Unit 3 resources use the shared public-status boundary and generic domain lookup', () => {
  assert.equal(getEditorialResourcesForDomain('ap-chemistry', DOMAIN_ID).length, 0)
  assert.equal(
    getEditorialResourcesForDomain('ap-chemistry', DOMAIN_ID, { includeDrafts: true }).length,
    apChemistryPropertiesMixturesResources.length,
  )
  assert.equal(getEditorialResource(formulas[0].id), null)
  assert.equal(getEditorialResource(formulas[0].id, { includeDrafts: true })?.id, formulas[0].id)
})
