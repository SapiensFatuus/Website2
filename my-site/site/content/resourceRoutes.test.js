import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { getDomain } from '../taxonomy/contentTaxonomy.js'
import { getEditorialResource } from './resourceCatalog.js'
import {
  createResourceBrowserUrl,
  createResourceUrl,
  getResourceUnitLabel,
  resolveResourceRoute,
} from './resourceRoutes.js'

const lesson = getEditorialResource('equilibrium-q-versus-k-decision-tool', { includeDrafts: true })
const formula = getEditorialResource('equilibrium-reaction-quotient', { includeDrafts: true })

test('lesson and formula URLs are canonical and directly resolvable in preview', () => {
  assert.equal(
    createResourceUrl(lesson),
    '/learn.html?test=ap-chemistry&unit=equilibrium&lesson=equilibrium-q-versus-k-decision-tool',
  )
  assert.equal(
    createResourceUrl(formula),
    '/formulas.html?test=ap-chemistry&unit=equilibrium&formula=equilibrium-reaction-quotient',
  )
  assert.equal(resolveResourceRoute({ pathname: '/learn.html', search: createResourceUrl(lesson).split('?')[1] }, { includeDrafts: true }).resource.id, lesson.id)
})

test('drafts are hidden outside explicit preview and invalid IDs fail safely', () => {
  assert.equal(resolveResourceRoute({ pathname: '/learn.html', search: '?test=ap-chemistry&unit=equilibrium&lesson=equilibrium-q-versus-k-decision-tool' }).status, 'draft-hidden')
  assert.equal(resolveResourceRoute({ pathname: '/learn.html', search: '?test=ap-chemistry&unit=kinetics&lesson=equilibrium-q-versus-k-decision-tool' }, { includeDrafts: true }).status, 'invalid-target')
  assert.equal(resolveResourceRoute({ pathname: '/formulas.html', search: '?test=ap-chemistry&unit=equilibrium&formula=missing' }, { includeDrafts: true }).status, 'invalid-target')
})

test('formula center resolves a canonical unit index without inventing a formula target', () => {
  const result = resolveResourceRoute({ pathname: '/formulas.html', search: '?test=ap-chemistry&unit=equilibrium' }, { includeDrafts: true })
  assert.equal(result.status, 'index')
  assert.equal(result.domain.id, 'equilibrium')
  assert.equal(result.resource, null)
})

test('resource navigation labels and browser URLs derive from any canonical AP Chemistry unit', () => {
  const equilibrium = getDomain('ap-chemistry', 'equilibrium')
  const acidsBases = getDomain('ap-chemistry', 'acids-bases')
  const propertiesMixtures = getDomain('ap-chemistry', 'properties-substances-mixtures')
  assert.equal(getResourceUnitLabel(equilibrium), 'Unit 7: Equilibrium')
  assert.equal(getResourceUnitLabel(acidsBases), 'Unit 8: Acids and Bases')
  assert.equal(getResourceUnitLabel(propertiesMixtures), 'Unit 3: Properties of Substances and Mixtures')
  assert.equal(createResourceBrowserUrl('ap-chemistry', 'equilibrium'), '/topics.html?topic=ap-chemistry&domain=equilibrium')
  assert.equal(createResourceBrowserUrl('ap-chemistry', 'acids-bases'), '/topics.html?topic=ap-chemistry&domain=acids-bases')
  assert.equal(createResourceBrowserUrl('ap-chemistry', 'properties-substances-mixtures'), '/topics.html?topic=ap-chemistry&domain=properties-substances-mixtures')
  assert.equal(createResourceBrowserUrl('ap-chemistry', 'missing-unit'), null)
})

test('resource empty states derive their return label instead of naming Unit 7', () => {
  const page = readFileSync(new URL('./StudyResourcePage.jsx', import.meta.url), 'utf8')
  assert.match(page, /getResourceUnitLabel\(result\.domain\)/)
  assert.doesNotMatch(page, /Return to Unit 7/)
})

test('AP Chemistry unit browsing links formula and review tools from the selected canonical unit', () => {
  const components = readFileSync(new URL('../components.jsx', import.meta.url), 'utf8')
  assert.match(components, /selectedApDomain\.officialNumber/)
  assert.match(components, /unit=\$\{encodeURIComponent\(selectedApDomain\.id\)\}/)
  assert.match(components, /Open the Unit \{selectedApDomain\.officialNumber\} formula and reference center/)
  assert.match(components, /Open the Unit \{selectedApDomain\.officialNumber\} editorial review queue/)
  assert.doesNotMatch(components, /Open the Unit 7 formula and reference center/)
})
