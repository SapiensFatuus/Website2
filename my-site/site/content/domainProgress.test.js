import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { getDomain } from '../taxonomy/contentTaxonomy.js'
import { classifyProgressSnapshot, createDomainProgressSummary } from './domainProgress.js'

test('progress classifications distinguish missing, early, developing, strong, and review evidence', () => {
  assert.equal(classifyProgressSnapshot(null).status, 'not-started')
  assert.equal(classifyProgressSnapshot({ attemptCount: 2, correctCount: 2, recentAccuracyPercent: 100 }).status, 'early-data')
  assert.equal(classifyProgressSnapshot({ attemptCount: 5, correctCount: 3, recentAccuracyPercent: 60 }).status, 'developing')
  assert.equal(classifyProgressSnapshot({ attemptCount: 5, correctCount: 5, recentAccuracyPercent: 100 }).status, 'strong')
  assert.equal(classifyProgressSnapshot({ attemptCount: 5, correctCount: 1, recentAccuracyPercent: 20 }).status, 'review')
})

test('domain progress uses canonical skill order and recommends the weakest practiced topic first', () => {
  const domain = getDomain('ap-chemistry', 'equilibrium')
  const first = domain.skills[0]
  const second = domain.skills[1]
  const summary = createDomainProgressSummary({
    domain,
    snapshotsBySkillId: {
      [first.id]: { attemptCount: 4, correctCount: 3, recentAccuracyPercent: 75 },
      [second.id]: { attemptCount: 4, correctCount: 1, recentAccuracyPercent: 25 },
    },
  })
  assert.equal(summary.skillCount, 12)
  assert.equal(summary.practicedSkillCount, 2)
  assert.equal(summary.coveragePercent, 17)
  assert.equal(summary.recommendedSkillId, second.id)
  assert.match(summary.recommendationReason, /reviewing/)
})

test('domain progress recommends the first canonical unpracticed topic when practiced evidence is not weak', () => {
  const domain = getDomain('ap-chemistry', 'equilibrium')
  const summary = createDomainProgressSummary({
    domain,
    snapshotsBySkillId: {
      [domain.skills[0].id]: { attemptCount: 4, correctCount: 4, recentAccuracyPercent: 100 },
    },
  })
  assert.equal(summary.recommendedSkillId, domain.skills[1].id)
  assert.match(summary.recommendationReason, /coverage/)
})

test('the progress route is wired to private records and keeps its score disclaimer', () => {
  const appSource = readFileSync(new URL('../App.jsx', import.meta.url), 'utf8')
  const pageSource = readFileSync(new URL('../learning/ProgressPage.jsx', import.meta.url), 'utf8')
  assert.match(appSource, /page-progress/)
  assert.match(appSource, /<ProgressPage/)
  assert.match(pageSource, /loadUserMasterySnapshot/)
  assert.match(pageSource, /not a predicted AP score or a validated mastery estimate/)
  assert.match(pageSource, /createReassessmentReadiness/)
  assert.match(pageSource, /useFirestoreEmulator/)
  assert.match(pageSource, /This preview reads only Firestore-emulator mastery timestamps/)
  assert.match(pageSource, /does not prove long-term retention/)
  assert.doesNotMatch(pageSource, /predicted AP score[^<]*(?:1|2|3|4|5)/i)
})
