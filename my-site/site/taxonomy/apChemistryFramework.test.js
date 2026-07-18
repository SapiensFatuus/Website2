import test from 'node:test'
import assert from 'node:assert/strict'
import {
  AP_CHEMISTRY_FRAMEWORK_ID,
  apChemistryFramework,
  validateApChemistryFramework,
} from './apChemistryFramework.js'
import { apChemistrySources, validateSourceRegistry } from './apChemistrySources.js'
import {
  getDomain,
  getPracticeFilters,
  getSciencePracticeSubskill,
  getSkill,
  getSubject,
  resolveDomainId,
  resolveSubjectLocation,
} from './contentTaxonomy.js'

test('official AP Chemistry sources have explicit rights and annual review metadata', () => {
  assert.equal(validateSourceRegistry().valid, true)
  assert.equal(apChemistrySources.length, 5)
  assert.ok(apChemistrySources.every((source) => source.frameworkId === AP_CHEMISTRY_FRAMEWORK_ID))
  assert.ok(apChemistrySources.every((source) => ['link-only', 'metadata-only'].includes(source.usageStatus)))
})

test('source validation rejects duplicate URLs, unsupported usage, and stale review windows', () => {
  const duplicate = structuredClone(apChemistrySources)
  duplicate[1].canonicalUrl = duplicate[0].canonicalUrl
  duplicate[2].usageStatus = 'public-domain'
  duplicate[3].annualReviewDate = '2028-07-18'
  const result = validateSourceRegistry(duplicate)
  assert.equal(result.valid, false)
  assert.match(result.errors.join('\n'), /duplicate canonicalUrl/)
  assert.match(result.errors.join('\n'), /unsupported usageStatus/)
  assert.match(result.errors.join('\n'), /within one year/)
})

test('framework contains nine ordered units, 88 topics, and all six science practices', () => {
  assert.equal(validateApChemistryFramework().valid, true)
  assert.equal(apChemistryFramework.units.length, 9)
  assert.equal(apChemistryFramework.units.flatMap((unit) => unit.topics).length, 88)
  assert.equal(apChemistryFramework.units.flatMap((unit) => unit.topics)
    .flatMap((topic) => topic.learningObjectives).length, 89)
  assert.deepEqual(apChemistryFramework.units.map((unit) => unit.weighting), [
    { section: 'multiple-choice', minPercent: 7, maxPercent: 9 },
    { section: 'multiple-choice', minPercent: 7, maxPercent: 9 },
    { section: 'multiple-choice', minPercent: 18, maxPercent: 22 },
    { section: 'multiple-choice', minPercent: 7, maxPercent: 9 },
    { section: 'multiple-choice', minPercent: 7, maxPercent: 9 },
    { section: 'multiple-choice', minPercent: 7, maxPercent: 9 },
    { section: 'multiple-choice', minPercent: 7, maxPercent: 9 },
    { section: 'multiple-choice', minPercent: 11, maxPercent: 15 },
    { section: 'multiple-choice', minPercent: 7, maxPercent: 9 },
  ])
  assert.equal(apChemistryFramework.sciencePractices.length, 6)
  assert.ok(getSciencePracticeSubskill('6.G'))
})

test('framework validation rejects unknown practices and incorrect topic ownership', () => {
  const invalid = structuredClone(apChemistryFramework)
  invalid.units[0].topics[0].practiceIds = ['9.Z']
  invalid.units[1].topics[0].officialNumber = '1.99'
  const result = validateApChemistryFramework(invalid)
  assert.equal(result.valid, false)
  assert.match(result.errors.join('\n'), /unknown practice subskill 9.Z/)
  assert.match(result.errors.join('\n'), /incorrectly owned official topic number/)
})

test('canonical taxonomy exposes AP Chemistry units and topics through shared helpers', () => {
  const subject = getSubject('ap-chemistry')
  assert.equal(subject.examId, 'ap')
  assert.equal(subject.frameworkId, AP_CHEMISTRY_FRAMEWORK_ID)
  assert.equal(subject.domains.length, 9)
  assert.equal(subject.domains.flatMap((unit) => unit.skills).length, 88)
  assert.equal(getDomain('ap-chemistry', 'equilibrium').officialNumber, '7')
  assert.equal(getSkill('ap-chemistry', 'introduction-equilibrium').officialNumber, '7.1')
  assert.deepEqual(getPracticeFilters('ap-chemistry', {
    domainId: 'equilibrium', skillId: 'introduction-equilibrium',
  }), { domain: ['equilibrium'], skill: ['introduction-equilibrium'] })
})

test('legacy AP Chemistry unit ids resolve canonically or fall back safely', () => {
  assert.deepEqual(resolveDomainId('ap-chemistry', 'atomic-structure'), {
    status: 'alias', domainId: 'atomic-structure-properties', legacyDomainId: 'atomic-structure',
  })
  assert.equal(resolveSubjectLocation('ap-chemistry', { domainId: 'bonding' }).domain.id, 'compound-structure-properties')
  assert.equal(resolveSubjectLocation('ap-chemistry', { domainId: 'reactions' }).domain.id, 'chemical-reactions')
  assert.equal(resolveSubjectLocation('ap-chemistry', { domainId: 'applications' }).domain.id, 'thermodynamics-electrochemistry')
  assert.equal(resolveSubjectLocation('ap-chemistry', { domainId: 'thermodynamics' }).legacyRedirect, 'subject')
  assert.equal(resolveSubjectLocation('ap-chemistry', { domainId: 'not-real' }).status, 'invalid-target')
})
