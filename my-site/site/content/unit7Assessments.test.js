import test from 'node:test'
import assert from 'node:assert/strict'
import { draftCanonicalPracticeQuestions } from '../questions/catalog/index.js'
import { validateFixedAssessmentCatalog } from './fixedAssessmentSchema.js'
import { createFixedAssessmentSessionConfig } from './fixedAssessmentSchema.js'
import { createSession } from '../questions/questionEngine.js'
import { readFileSync } from 'node:fs'
import {
  createUnit7AssessmentUrl,
  UNIT7_DIAGNOSTIC_ID,
  UNIT7_DIAGNOSTIC_QUESTION_IDS,
  UNIT7_REASSESSMENT_QUESTION_IDS,
  UNIT7_TIMED_CHECKPOINT_QUESTION_IDS,
  unit7AssessmentBlueprints,
} from './unit7Assessments.js'

const questionById = new Map(draftCanonicalPracticeQuestions.map((question) => [question.id, question]))

test('Unit 7 fixed assessment blueprints validate against canonical draft questions', () => {
  assert.deepEqual(validateFixedAssessmentCatalog(unit7AssessmentBlueprints, draftCanonicalPracticeQuestions), { valid: true, errors: [] })
  assert.equal(unit7AssessmentBlueprints.length, 3)
  assert.ok(unit7AssessmentBlueprints.every(({ review }) => review.status === 'draft' && review.reviewers.length === 0))
})

test('fixed assessment URLs resolve only registered Unit 7 blueprints', () => {
  assert.equal(createUnit7AssessmentUrl(UNIT7_DIAGNOSTIC_ID), `/questions.html?topic=ap-chemistry&domain=equilibrium&assessment=${UNIT7_DIAGNOSTIC_ID}`)
  assert.equal(createUnit7AssessmentUrl('invented-assessment'), null)
})

test('diagnostic and reassessment are disjoint parallel forms over the same six skills', () => {
  assert.equal(UNIT7_DIAGNOSTIC_QUESTION_IDS.length, 6)
  assert.equal(UNIT7_REASSESSMENT_QUESTION_IDS.length, 6)
  assert.equal(UNIT7_DIAGNOSTIC_QUESTION_IDS.filter((id) => UNIT7_REASSESSMENT_QUESTION_IDS.includes(id)).length, 0)
  const skills = (ids) => ids.map((id) => questionById.get(id).taxonomy.skillId).sort()
  assert.deepEqual(skills(UNIT7_DIAGNOSTIC_QUESTION_IDS), skills(UNIT7_REASSESSMENT_QUESTION_IDS))
})

test('timed checkpoint remains a stable curated form as the practice bank expands', () => {
  const selected = UNIT7_TIMED_CHECKPOINT_QUESTION_IDS.map((id) => questionById.get(id))
  assert.equal(selected.every(Boolean), true)
  assert.equal(selected.length, 22)
  assert.equal(selected.filter(({ renderer }) => renderer === 'multiple-choice').length, 20)
  assert.equal(selected.filter(({ renderer }) => renderer === 'free-response').length, 2)
  assert.equal(UNIT7_TIMED_CHECKPOINT_QUESTION_IDS.includes('ap-chem-equilibrium-stimulus-mcq-004'), false)
})

test('assessment validation rejects missing questions, duplicate IDs, and published claims over drafts', () => {
  const base = unit7AssessmentBlueprints[0]
  const bad = [
    { ...base, questionIds: [...base.questionIds, 'missing-question'] },
    { ...base },
    { ...base, id: 'claims-published', review: { ...base.review, status: 'published', reviewers: ['reviewer-a', 'reviewer-b'] } },
  ]
  const result = validateFixedAssessmentCatalog(bad, draftCanonicalPracticeQuestions)
  assert.equal(result.valid, false)
  assert.ok(result.errors.some((error) => /duplicate assessment id/.test(error)))
  assert.ok(result.errors.some((error) => /must resolve/.test(error)))
  assert.ok(result.errors.some((error) => /cannot contain unpublished/.test(error)))
})

test('fixed assessment session config locks testing mode, full blueprint, and timer', () => {
  const checkpoint = unit7AssessmentBlueprints.find(({ kind }) => kind === 'unit-test')
  const selected = checkpoint.questionIds.map((id) => questionById.get(id))
  const config = createFixedAssessmentSessionConfig(checkpoint, {
    topic: 'ap-chemistry', filters: { domain: ['equilibrium'] }, reportingGroupId: 'domain',
  })
  const session = createSession(config, selected, () => 0, 1_000)
  assert.equal(session.config.mode, 'testing')
  assert.equal(session.config.questionCount, 'all')
  assert.equal(session.config.assessmentId, checkpoint.id)
  assert.equal(session.questionIds.length, 22)
  assert.equal(session.deadline, 1_000 + 45 * 60_000)
})

test('question setup renders fixed blueprint disclosures and disables mutable controls', () => {
  const source = readFileSync(new URL('../questions/QuestionPage.jsx', import.meta.url), 'utf8')
  assert.match(source, /Fixed draft blueprint/)
  assert.match(source, /Feedback<\/dt><dd>After submission/)
  assert.match(source, /disabled=\{Boolean\(sessionPreset\)\}/)
  assert.match(source, /createFixedAssessmentSessionConfig/)
  assert.match(source, /function StimulusLineGraph/)
  assert.match(source, /View exact graph data/)
  assert.match(source, /svg viewBox=.*aria-hidden="true"/)
  const appSource = readFileSync(new URL('../App.jsx', import.meta.url), 'utf8')
  assert.match(appSource, /Assessment unavailable/)
  assert.match(appSource, /explicit development editorial preview/)
})
