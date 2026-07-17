import test from 'node:test'
import assert from 'node:assert/strict'
import { exams } from '../taxonomy/contentTaxonomy.js'
import {
  MAX_SKILL_SEARCH_LENGTH,
  createSkillSearchIndex,
  normalizeSearchText,
  sanitizeSkillSearchQuery,
  searchSkills,
  skillSearchIndex,
  withSkillSearchQuery,
} from './skillSearch.js'

test('search index contains all 20 SAT Math skills with canonical targets and URLs', () => {
  assert.equal(skillSearchIndex.length, 20)
  assert.ok(skillSearchIndex.every((entry) => (
    entry.examId === 'sat'
    && entry.subjectId === 'sat-math'
    && entry.domainId
    && entry.skillId
    && entry.browserUrl.includes(`skill=${entry.skillId}`)
    && entry.practiceUrl.includes(`skill=${entry.skillId}`)
  )))
})

test('exact labels and aliases outrank broader matches', () => {
  const exactLabel = searchSkills('circles')
  assert.deepEqual({ skillId: exactLabel[0].skillId, score: exactLabel[0].score }, { skillId: 'circles', score: 0 })
  assert.ok(exactLabel.slice(1).every((result) => result.score > exactLabel[0].score))
  const aliases = searchSkills('linear relationships')
  assert.equal(aliases[0].skillId, 'linear-functions')
  assert.equal(aliases[0].score, 1)
  const descriptionOnly = searchSkills('interpret their solutions in context')
  assert.equal(descriptionOnly[0].skillId, 'linear-equations-one-variable')
  assert.equal(descriptionOnly[0].score, 5)
})

test('search normalizes case, whitespace, punctuation, and partial terms', () => {
  assert.equal(normalizeSearchText('  SOH-CAH   TOA! '), 'soh cah toa')
  assert.equal(searchSkills('  SOH-CAH   TOA! ')[0].skillId, 'right-triangles-trigonometry')
  assert.equal(searchSkills('pythag')[0].skillId, 'right-triangles-trigonometry')
  assert.equal(searchSkills('Linear Func')[0].skillId, 'linear-functions')
})

test('domain IDs, tags, aliases, and exam or subject context are searchable', () => {
  assert.equal(searchSkills('geometry-trigonometry').length, 4)
  assert.equal(searchSkills('scatterplots')[0].skillId, 'two-variable-data')
  assert.equal(searchSkills('simultaneous equations')[0].skillId, 'systems-linear-equations')
  assert.equal(searchSkills('sat').length, 20)
  assert.equal(searchSkills('math').length, 20)
})

test('result ordering is deterministic and subject filtering is supported', () => {
  const first = searchSkills('algebra').map((entry) => entry.skillId)
  const second = searchSkills('algebra').map((entry) => entry.skillId)
  assert.deepEqual(first, second)
  assert.deepEqual(searchSkills('circles', { subjectId: 'unknown' }), [])
})

test('search does not mutate taxonomy or index records', () => {
  const before = JSON.stringify(exams)
  searchSkills('linear')
  assert.equal(JSON.stringify(exams), before)
  assert.equal(Object.isFrozen(createSkillSearchIndex()), true)
  assert.equal(Object.isFrozen(skillSearchIndex[0]), true)
})

test('practice and tutor availability derive from canonical catalog and capabilities', () => {
  const equations = skillSearchIndex.find((entry) => entry.skillId === 'linear-equations-one-variable')
  const functions = skillSearchIndex.find((entry) => entry.skillId === 'linear-functions')
  const lines = skillSearchIndex.find((entry) => entry.skillId === 'lines-angles-triangles')
  const circles = skillSearchIndex.find((entry) => entry.skillId === 'circles')
  assert.deepEqual(
    [equations.practiceQuestionCount, equations.practiceAvailable, equations.tutorAvailable],
    [3, true, true],
  )
  assert.deepEqual(
    [functions.practiceQuestionCount, functions.practiceAvailable, functions.tutorAvailable],
    [0, false, true],
  )
  assert.deepEqual([lines.practiceQuestionCount, lines.practiceAvailable], [3, true])
  assert.deepEqual([circles.practiceQuestionCount, circles.practiceAvailable, circles.tutorAvailable], [0, false, true])
  assert.equal(skillSearchIndex.every((entry) => entry.tutorAvailable && entry.tutorUrl), true)
})

test('search URLs preserve safe shareable queries and invalid input fails safely', () => {
  assert.equal(
    withSkillSearchQuery('/topics.html?topic=sat-math&domain=algebra&skill=linear-functions', ' slope & intercept '),
    '/topics.html?topic=sat-math&domain=algebra&skill=linear-functions&q=slope%20%26%20intercept',
  )
  assert.equal(searchSkills('!!!').length, 0)
  assert.equal(sanitizeSkillSearchQuery(null), '')
  assert.equal(sanitizeSkillSearchQuery(`ok\u0000${'x'.repeat(200)}`).length, MAX_SKILL_SEARCH_LENGTH)
})
