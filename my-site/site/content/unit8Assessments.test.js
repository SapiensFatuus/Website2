import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { draftCanonicalPracticeQuestions } from '../questions/catalog/index.js'
import { createSession } from '../questions/questionEngine.js'
import {
  apChemistryAssessmentBlueprints,
  createApChemistryAssessmentUrl,
  getApChemistryAssessmentBlueprint,
  getAssessmentBlueprintsForDomain,
  UNIT8_DIAGNOSTIC_ID,
  UNIT8_DIAGNOSTIC_QUESTION_IDS,
  UNIT8_REASSESSMENT_QUESTION_IDS,
  UNIT8_TIMED_CHECKPOINT_QUESTION_IDS,
  UNIT7_DIAGNOSTIC_ID,
  UNIT7_DIAGNOSTIC_QUESTION_IDS,
  unit8AssessmentBlueprints,
} from './apChemistryAssessmentsValidated.js'
import { createApChemistryAssessmentSummary } from './apChemistryLearningLoop.js'
import { createFixedAssessmentSessionConfig, validateFixedAssessmentCatalog } from './fixedAssessmentSchema.js'

const questionById = new Map(draftCanonicalPracticeQuestions.map((question) => [question.id, question]))

test('shared AP Chemistry registry validates Unit 7 and Unit 8 draft blueprints alongside other units', () => {
  assert.deepEqual(validateFixedAssessmentCatalog(apChemistryAssessmentBlueprints, draftCanonicalPracticeQuestions), { valid: true, errors: [] })
  assert.equal(apChemistryAssessmentBlueprints.length, 27)
  assert.equal(getAssessmentBlueprintsForDomain('properties-substances-mixtures').length, 3)
  assert.equal(getAssessmentBlueprintsForDomain('acids-bases').length, 3)
  assert.equal(getAssessmentBlueprintsForDomain('equilibrium').length, 3)
  assert.ok(unit8AssessmentBlueprints.every(({ review }) => review.status === 'draft' && review.reviewers.length === 0))
})

test('Unit 8 URLs resolve through the shared assessment registry and reject mismatches', () => {
  assert.equal(
    createApChemistryAssessmentUrl(UNIT8_DIAGNOSTIC_ID),
    `/questions.html?topic=ap-chemistry&domain=acids-bases&assessment=${UNIT8_DIAGNOSTIC_ID}`,
  )
  assert.equal(getApChemistryAssessmentBlueprint(UNIT8_DIAGNOSTIC_ID)?.domainId, 'acids-bases')
  assert.equal(createApChemistryAssessmentUrl('invented-assessment'), null)
})

test('Unit 8 diagnostic and reassessment are disjoint parallel forms over six skills', () => {
  assert.equal(UNIT8_DIAGNOSTIC_QUESTION_IDS.length, 6)
  assert.equal(UNIT8_REASSESSMENT_QUESTION_IDS.length, 6)
  assert.equal(UNIT8_DIAGNOSTIC_QUESTION_IDS.filter((id) => UNIT8_REASSESSMENT_QUESTION_IDS.includes(id)).length, 0)
  const skills = (ids) => ids.map((id) => questionById.get(id).taxonomy.skillId).sort()
  assert.deepEqual(skills(UNIT8_DIAGNOSTIC_QUESTION_IDS), skills(UNIT8_REASSESSMENT_QUESTION_IDS))
})

test('Unit 8 checkpoint is locked, timed, and spans all eleven topics with two manual FRQs', () => {
  const blueprint = unit8AssessmentBlueprints.find(({ kind }) => kind === 'unit-test')
  const selected = UNIT8_TIMED_CHECKPOINT_QUESTION_IDS.map((id) => questionById.get(id))
  assert.equal(selected.every(Boolean), true)
  assert.equal(selected.length, 22)
  assert.equal(selected.filter(({ renderer }) => renderer === 'multiple-choice').length, 20)
  assert.equal(selected.filter(({ renderer }) => renderer === 'free-response').length, 2)
  assert.equal(new Set(selected.map(({ taxonomy }) => taxonomy.skillId)).size, 11)

  const config = createFixedAssessmentSessionConfig(blueprint, {
    topic: 'ap-chemistry',
    filters: { domain: ['acids-bases'] },
    reportingGroupId: 'domain',
  })
  const session = createSession(config, selected, () => 0, 1_000)
  assert.equal(session.config.mode, 'testing')
  assert.equal(session.config.assessmentId, blueprint.id)
  assert.equal(session.questionIds.length, 22)
  assert.equal(session.deadline, 1_000 + 45 * 60_000)
})

test('generic Unit 8 result summary recommends canonical lessons and diagnoses misconceptions', () => {
  const blueprint = getApChemistryAssessmentBlueprint(UNIT8_DIAGNOSTIC_ID)
  const questions = UNIT8_DIAGNOSTIC_QUESTION_IDS.map((id) => questionById.get(id))
  const grade = {
    details: questions.map((question, index) => ({
      questionId: question.id,
      isCorrect: index !== 0,
      isManualReview: false,
    })),
  }
  const summary = createApChemistryAssessmentSummary({ blueprint, grade, questions })
  assert.equal(summary.id, UNIT8_DIAGNOSTIC_ID)
  assert.equal(summary.recommendations.length, 1)
  assert.equal(summary.recommendations[0].skillId, 'introduction-acids-bases')
  assert.match(summary.recommendations[0].lessonUrl, /^\/learn\.html\?/)
  assert.match(summary.recommendations[0].practiceUrl, /^\/questions\.html\?/)
  assert.ok(summary.misconceptionIds.includes('acid-means-negative-charge'))
  assert.match(summary.errorPatterns[0].correction, /proton donation or acceptance/)
  assert.match(summary.message, /not an AP score prediction/)
})

test('shared summary engine preserves Unit 7 recommendations and misconception corrections', () => {
  const blueprint = getApChemistryAssessmentBlueprint(UNIT7_DIAGNOSTIC_ID)
  const questions = UNIT7_DIAGNOSTIC_QUESTION_IDS.map((id) => questionById.get(id))
  const grade = {
    details: questions.map((question, index) => ({
      questionId: question.id,
      isCorrect: index !== 0,
      isManualReview: false,
    })),
  }
  const summary = createApChemistryAssessmentSummary({ blueprint, grade, questions })
  assert.equal(summary.id, UNIT7_DIAGNOSTIC_ID)
  assert.equal(summary.recommendations[0].skillId, 'introduction-equilibrium')
  assert.ok(summary.misconceptionIds.includes('equilibrium-means-stopped'))
  assert.match(summary.errorPatterns[0].correction, /equal rates/)
})

test('assessment navigation and delayed reassessment derive from the shared unit registry', () => {
  const appSource = readFileSync(new URL('../App.jsx', import.meta.url), 'utf8')
  const browserSource = readFileSync(new URL('../components.jsx', import.meta.url), 'utf8')
  const progressSource = readFileSync(new URL('../learning/ProgressPage.jsx', import.meta.url), 'utf8')
  const questionSource = readFileSync(new URL('../questions/QuestionPage.jsx', import.meta.url), 'utf8')

  assert.match(appSource, /getApChemistryAssessmentBlueprint/)
  assert.match(browserSource, /getAssessmentBlueprintsForDomain/)
  assert.match(browserSource, /assessmentBlueprints\.map/)
  assert.match(progressSource, /getAssessmentBlueprintsForDomain/)
  assert.doesNotMatch(progressSource, /domainId === 'equilibrium'/)
  assert.match(questionSource, /createApChemistryAssessmentSummary/)
  assert.doesNotMatch(questionSource, /unit7LearningLoop/)
})
