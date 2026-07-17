import test from 'node:test'
import assert from 'node:assert/strict'
import { getQuestions } from '../questions/questionData.js'
import { completeSession, createSession } from '../questions/questionEngine.js'
import {
  MASTERY_RECENT_WINDOW,
  applyMasteryUpdate,
  buildAttemptRecord,
  buildLearningRecordPayload,
  calculateSessionSummary,
} from './learningRecords.js'
import {
  createAttemptId,
  createPersistenceFingerprint,
  createStableSessionId,
} from './learningIds.js'

function createCompletedSessionFixture() {
  const questions = getQuestions({ topic: 'sat-math', filters: { skill: ['linear-equations-one-variable'] } })
  const baseSession = createSession({
    topic: 'sat-math',
    mode: 'testing',
    filters: { domain: ['algebra'], skill: ['linear-equations-one-variable'] },
    questionCount: 'all',
    timerMinutes: null,
  }, questions, () => 0, 1_000)

  const answeredSession = {
    ...baseSession,
    answers: {
      [questions[0].id]: questions[0].correctOptionId,
      [questions[1].id]: 'wrong-answer',
    },
  }

  return {
    questions,
    session: completeSession(answeredSession, 'submitted', 8_000),
  }
}

test('stable session and attempt IDs are deterministic when inputs match', () => {
  const seeded = createStableSessionId('session-123')
  assert.equal(seeded, 'session-123')
  assert.equal(createAttemptId('session-123', 'question-9'), 'session-123__question-9')
  assert.equal(createPersistenceFingerprint('user-1', 'session-123'), 'user-1:session-123')
})

test('attempt construction requires canonical identifiers and records safe answer data', () => {
  const { questions, session } = createCompletedSessionFixture()
  const summary = calculateSessionSummary({ session, questions })
  const attempt = buildAttemptRecord({
    uid: 'user-1',
    session,
    question: questions[0],
    detail: summary.grade.details[0],
    completedAt: summary.completedAt,
  })

  assert.equal(attempt.uid, 'user-1')
  assert.equal(attempt.questionId, questions[0].id)
  assert.equal(attempt.sessionId, session.id)
  assert.equal(typeof attempt.durationSeconds, 'number')
})

test('session summaries and learning payloads aggregate completed attempts only', () => {
  const { questions, session } = createCompletedSessionFixture()
  const user = {
    uid: 'user-1',
    email: 'student@example.com',
    displayName: 'Student',
    photoURL: null,
    providerData: [{ providerId: 'google.com' }],
  }
  const payload = buildLearningRecordPayload({ user, session, questions })

  assert.equal(payload.sessionRecord.uid, 'user-1')
  assert.equal(payload.sessionRecord.attemptedCount, 2)
  assert.equal(payload.sessionRecord.correctCount, 1)
  assert.equal(payload.sessionRecord.accuracyPercent, 50)
  assert.equal(payload.attemptRecords.length, 2)
  assert.deepEqual(payload.masterySnapshots.map((item) => item.skillId), ['linear-equations-one-variable'])
})

test('mastery updates maintain cumulative counts and a bounded recent window', () => {
  const base = {
    schemaVersion: 1,
    uid: 'user-1',
    skillId: 'linear-functions',
    attemptCount: 9,
    correctCount: 6,
    recentResults: [true, false, true, true, false, true, false, true, true],
  }
  const next = applyMasteryUpdate(base, {
    uid: 'user-1',
    skillId: 'linear-functions',
    attemptCountDelta: 3,
    correctCountDelta: 2,
    recentResultsDelta: [false, true, true],
    lastPracticedAt: new Date('2026-07-17T00:00:00.000Z'),
  })

  assert.equal(next.attemptCount, 12)
  assert.equal(next.correctCount, 8)
  assert.equal(next.recentResults.length, MASTERY_RECENT_WINDOW)
  assert.equal(next.recentAccuracyPercent, 70)
})

test('zero-attempt summaries retain canonical exam and subject context', () => {
  const { questions, session } = createCompletedSessionFixture()
  const emptySession = {
    ...session,
    answers: {},
  }
  const summary = calculateSessionSummary({ session: emptySession, questions })

  assert.equal(summary.attemptRecords.length, 0)
  assert.equal(summary.sessionRecord.examId, 'sat')
  assert.equal(summary.sessionRecord.subjectId, 'sat-math')
  assert.equal(summary.sessionRecord.accuracyPercent, 0)
})

test('mastery updates safely discard malformed prior counters and results', () => {
  const next = applyMasteryUpdate({
    attemptCount: 'many',
    correctCount: -2,
    recentResults: [true, 'wrong-shape', false],
  }, {
    uid: 'user-1',
    skillId: 'linear-functions',
    attemptCountDelta: 1,
    correctCountDelta: 1,
    recentResultsDelta: [true],
    lastPracticedAt: new Date('2026-07-17T00:00:00.000Z'),
  })

  assert.equal(next.attemptCount, 1)
  assert.equal(next.correctCount, 1)
  assert.deepEqual(next.recentResults, [true, false, true])
  assert.equal(next.recentAccuracyPercent, 67)
})

test('malformed identifiers fail loudly instead of creating ambiguous records', () => {
  const { questions, session } = createCompletedSessionFixture()
  const summary = calculateSessionSummary({ session, questions })

  assert.throws(
    () => buildAttemptRecord({
      uid: '',
      session,
      question: questions[0],
      detail: summary.grade.details[0],
      completedAt: summary.completedAt,
    }),
    /uid is required/i,
  )
})
