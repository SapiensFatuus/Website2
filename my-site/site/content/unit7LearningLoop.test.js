import test from 'node:test'
import assert from 'node:assert/strict'
import { draftCanonicalPracticeQuestions } from '../questions/catalog/index.js'
import {
  createUnit7DiagnosticSummary,
  createUnit7ReassessmentSummary,
  createUnit7TimedCheckpointSummary,
  selectUnit7DiagnosticQuestions,
  selectUnit7ReassessmentQuestions,
  UNIT7_DIAGNOSTIC_QUESTION_IDS,
} from './unit7LearningLoop.js'

test('Unit 7 diagnostic selection is deterministic and contains six original discrete questions', () => {
  const selected = selectUnit7DiagnosticQuestions(draftCanonicalPracticeQuestions)
  assert.deepEqual(selected.map(({ id }) => id), UNIT7_DIAGNOSTIC_QUESTION_IDS)
  assert.ok(selected.every(({ renderer, content }) => renderer === 'multiple-choice' && content.status === 'draft'))
})

test('reassessment uses a separate parallel form and keeps recommendations non-predictive', () => {
  const questions = selectUnit7ReassessmentQuestions(draftCanonicalPracticeQuestions)
  assert.equal(questions.length, 6)
  assert.ok(questions.every(({ id }) => !UNIT7_DIAGNOSTIC_QUESTION_IDS.includes(id)))
  const grade = { details: questions.map((question, index) => ({ questionId: question.id, isCorrect: index > 0 })) }
  const summary = createUnit7ReassessmentSummary({ grade, questions })
  assert.match(summary.heading, /Reassessment/)
  assert.match(summary.message, /not an AP score prediction/)
  assert.equal(summary.recommendations.length, 1)
})

test('timed checkpoint summary separates automatic scoring from FRQ self-review', () => {
  const questions = draftCanonicalPracticeQuestions.filter(({ taxonomy }) => taxonomy.domainId === 'equilibrium')
  const grade = {
    correct: 10, total: 15, ungraded: 1, manualTotal: 2,
    details: questions.map((question) => ({ questionId: question.id, isCorrect: true, isManualReview: question.renderer === 'free-response' })),
  }
  const summary = createUnit7TimedCheckpointSummary({ grade, questions })
  assert.match(summary.message, /10 of 15 automatically scored/)
  assert.match(summary.message, /2 free responses are available/)
  assert.match(summary.message, /not an official AP section or AP score prediction/)
})

test('diagnostic summary recommends a canonical lesson and practice target without predicting an AP score', () => {
  const questions = selectUnit7DiagnosticQuestions(draftCanonicalPracticeQuestions)
  const grade = {
    details: questions.map((question, index) => ({ questionId: question.id, isCorrect: index !== 0 })),
  }
  const summary = createUnit7DiagnosticSummary({ grade, questions })
  assert.equal(summary.recommendations.length, 1)
  assert.equal(summary.recommendations[0].skillId, 'introduction-equilibrium')
  assert.match(summary.recommendations[0].lessonUrl, /^\/learn\.html\?/)
  assert.match(summary.recommendations[0].practiceUrl, /^\/questions\.html\?/)
  assert.match(summary.message, /not an AP score prediction/)
  assert.ok(summary.misconceptionIds.includes('equilibrium-means-stopped'))
  assert.deepEqual(summary.errorPatterns.map(({ id }) => id), ['equilibrium-means-stopped'])
  assert.match(summary.errorPatterns[0].correction, /equal rates/)
})
