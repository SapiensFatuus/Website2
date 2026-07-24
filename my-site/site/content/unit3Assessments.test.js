import test from 'node:test'
import assert from 'node:assert/strict'
import { draftCanonicalPracticeQuestions } from '../questions/catalog/index.js'
import { createSession } from '../questions/questionEngine.js'
import {
  apChemistryAssessmentBlueprints,
  createApChemistryAssessmentUrl,
  getApChemistryAssessmentBlueprint,
  getAssessmentBlueprintsForDomain,
  UNIT3_DIAGNOSTIC_ID,
  UNIT3_DIAGNOSTIC_QUESTION_IDS,
  UNIT3_REASSESSMENT_QUESTION_IDS,
  UNIT3_TIMED_CHECKPOINT_QUESTION_IDS,
  unit3AssessmentBlueprints,
} from './apChemistryAssessmentsValidated.js'
import { createApChemistryAssessmentSummary } from './apChemistryLearningLoop.js'
import { createFixedAssessmentSessionConfig, validateFixedAssessmentCatalog } from './fixedAssessmentSchema.js'

const DOMAIN_ID = 'properties-substances-mixtures'
const questionById = new Map(draftCanonicalPracticeQuestions.map((question) => [question.id, question]))

test('shared AP Chemistry registry validates all three Unit 3 draft blueprints', () => {
  assert.deepEqual(validateFixedAssessmentCatalog(apChemistryAssessmentBlueprints, draftCanonicalPracticeQuestions), { valid: true, errors: [] })
  assert.equal(apChemistryAssessmentBlueprints.length, 27)
  assert.equal(getAssessmentBlueprintsForDomain(DOMAIN_ID).length, 3)
  assert.ok(unit3AssessmentBlueprints.every(({ review }) => review.status === 'draft' && review.reviewers.length === 0))
})

test('Unit 3 URLs resolve through the shared assessment registry and reject unknown IDs', () => {
  assert.equal(
    createApChemistryAssessmentUrl(UNIT3_DIAGNOSTIC_ID),
    `/questions.html?topic=ap-chemistry&domain=${DOMAIN_ID}&assessment=${UNIT3_DIAGNOSTIC_ID}`,
  )
  assert.equal(getApChemistryAssessmentBlueprint(UNIT3_DIAGNOSTIC_ID)?.domainId, DOMAIN_ID)
  assert.equal(createApChemistryAssessmentUrl('invented-unit-3-assessment'), null)
})

test('Unit 3 diagnostic and reassessment are disjoint parallel forms over six skills', () => {
  assert.equal(UNIT3_DIAGNOSTIC_QUESTION_IDS.length, 6)
  assert.equal(UNIT3_REASSESSMENT_QUESTION_IDS.length, 6)
  assert.equal(UNIT3_DIAGNOSTIC_QUESTION_IDS.filter((id) => UNIT3_REASSESSMENT_QUESTION_IDS.includes(id)).length, 0)
  const skills = (ids) => ids.map((id) => questionById.get(id).taxonomy.skillId).sort()
  assert.deepEqual(skills(UNIT3_DIAGNOSTIC_QUESTION_IDS), skills(UNIT3_REASSESSMENT_QUESTION_IDS))
})

test('Unit 3 checkpoint is locked, timed, and spans all thirteen topics with two manual FRQs', () => {
  const blueprint = unit3AssessmentBlueprints.find(({ kind }) => kind === 'unit-test')
  const selected = UNIT3_TIMED_CHECKPOINT_QUESTION_IDS.map((id) => questionById.get(id))
  assert.equal(selected.every(Boolean), true)
  assert.equal(selected.length, 22)
  assert.equal(selected.filter(({ renderer }) => renderer === 'multiple-choice').length, 20)
  assert.equal(selected.filter(({ renderer }) => renderer === 'free-response').length, 2)
  assert.equal(new Set(selected.map(({ taxonomy }) => taxonomy.skillId)).size, 13)

  const config = createFixedAssessmentSessionConfig(blueprint, {
    topic: 'ap-chemistry',
    filters: { domain: [DOMAIN_ID] },
    reportingGroupId: 'domain',
  })
  const session = createSession(config, selected, () => 0, 1_000)
  assert.equal(session.config.mode, 'testing')
  assert.equal(session.config.assessmentId, blueprint.id)
  assert.equal(session.questionIds.length, 22)
  assert.equal(session.deadline, 1_000 + 45 * 60_000)
})

test('generic Unit 3 result summary recommends canonical resources and diagnoses misconceptions', () => {
  const blueprint = getApChemistryAssessmentBlueprint(UNIT3_DIAGNOSTIC_ID)
  const questions = UNIT3_DIAGNOSTIC_QUESTION_IDS.map((id) => questionById.get(id))
  const grade = {
    details: questions.map((question, index) => ({
      questionId: question.id,
      isCorrect: index !== 0,
      isManualReview: false,
    })),
  }
  const summary = createApChemistryAssessmentSummary({ blueprint, grade, questions })
  assert.equal(summary.id, UNIT3_DIAGNOSTIC_ID)
  assert.equal(summary.recommendations.length, 1)
  assert.equal(summary.recommendations[0].skillId, 'intermolecular-interparticle-forces')
  assert.match(summary.recommendations[0].lessonUrl, /^\/learn\.html\?/)
  assert.match(summary.recommendations[0].practiceUrl, /^\/questions\.html\?/)
  assert.ok(summary.misconceptionIds.includes('surface-area-dispersion'))
  assert.match(summary.errorPatterns[0].correction, /extended shape/)
  assert.match(summary.message, /not an AP score prediction/)
})
