import { gradeSession, getQuestionTimeSeconds } from '../questions/questionEngine.js'
import {
  createAttemptId,
} from './learningIds.js'

export const LEARNING_RECORD_SCHEMA_VERSION = 1
export const MASTERY_RECENT_WINDOW = 10

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function validateIdentifier(name, value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${name} is required.`)
  }
}

function normalizeStoredAnswer(detail) {
  if (detail.selectedOptionId) {
    return detail.selectedOptionId
  }

  if (typeof detail.answer === 'string') {
    return detail.answer.trim()
  }

  return detail.answer ?? null
}

export function buildAttemptRecord({ uid, session, question, detail, completedAt }) {
  validateIdentifier('uid', uid)
  validateIdentifier('session.id', session?.id)
  validateIdentifier('question.id', question?.id)
  validateIdentifier('question.taxonomy.examId', question?.taxonomy?.examId)
  validateIdentifier('question.taxonomy.subjectId', question?.taxonomy?.subjectId)
  validateIdentifier('question.taxonomy.domainId', question?.taxonomy?.domainId)
  validateIdentifier('question.taxonomy.skillId', question?.taxonomy?.skillId)

  if (!detail || detail.isSkipped || detail.isUnanswered || detail.isUngraded || !detail.isSubmitted) {
    throw new Error('Only submitted, answered, automatically graded attempts can be recorded.')
  }

  return {
    schemaVersion: LEARNING_RECORD_SCHEMA_VERSION,
    uid,
    attemptId: createAttemptId(session.id, question.id),
    sessionId: session.id,
    examId: question.taxonomy.examId,
    subjectId: question.taxonomy.subjectId,
    domainId: question.taxonomy.domainId,
    skillId: question.taxonomy.skillId,
    questionId: question.id,
    mode: session.config.mode,
    source: 'practice-session',
    isCorrect: Boolean(detail.isCorrect),
    answer: normalizeStoredAnswer(detail),
    answeredAt: completedAt,
    durationSeconds: getQuestionTimeSeconds(session, question.id, completedAt.getTime()),
  }
}

export function calculateSessionSummary({ session, questions }) {
  if (!session?.id) {
    throw new Error('A completed session with a stable ID is required.')
  }

  const completedAt = new Date(session.completedAt || Date.now())
  const startedAt = new Date(session.startedAt || completedAt.getTime())
  const grade = gradeSession(session, questions)
  const questionsById = new Map(questions.map((question) => [question.id, question]))
  const attemptRecords = grade.details
    .map((detail) => {
      const question = questionsById.get(detail.questionId)
      if (!question || detail.isSkipped || detail.isUnanswered || detail.isUngraded || !detail.isSubmitted) {
        return null
      }

      return buildAttemptRecord({
        uid: 'placeholder',
        session,
        question,
        detail,
        completedAt,
      })
    })
    .filter(Boolean)
  const skillIds = [...new Set(attemptRecords.map((record) => record.skillId))].sort()
  const domainIds = [...new Set(attemptRecords.map((record) => record.domainId))].sort()
  const sessionExamId = attemptRecords[0]?.examId || questions[0]?.taxonomy?.examId || 'unknown'
  const sessionSubjectId = attemptRecords[0]?.subjectId || questions[0]?.taxonomy?.subjectId || session.config.topic

  return {
    grade,
    completedAt,
    startedAt,
    attemptRecords,
    sessionRecord: {
      schemaVersion: LEARNING_RECORD_SCHEMA_VERSION,
      sessionId: session.id,
      examId: sessionExamId,
      subjectId: sessionSubjectId,
      domainIds,
      skillIds,
      mode: session.config.mode,
      questionCount: session.questionIds.length,
      attemptedCount: attemptRecords.length,
      correctCount: grade.correct,
      accuracyPercent: attemptRecords.length ? Math.round((grade.correct / attemptRecords.length) * 100) : 0,
      completionState: session.completionReason || 'submitted',
      startedAt,
      completedAt,
      timerMinutes: session.config.timerMinutes ?? null,
      filterDomainIds: [...(session.config.filters?.domain || [])].sort(),
      filterSkillIds: [...(session.config.filters?.skill || [])].sort(),
    },
  }
}

export function buildLearningRecordPayload({ user, session, questions }) {
  validateIdentifier('user.uid', user?.uid)
  const { grade, completedAt, startedAt, attemptRecords, sessionRecord } = calculateSessionSummary({
    session,
    questions,
  })

  return {
    profile: {
      schemaVersion: LEARNING_RECORD_SCHEMA_VERSION,
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      authProviderIds: Array.isArray(user.providerData)
        ? [...new Set(user.providerData.map((provider) => provider.providerId).filter(Boolean))].sort()
        : [],
      createdAt: startedAt,
      lastSeenAt: completedAt,
    },
    sessionRecord: {
      ...sessionRecord,
      uid: user.uid,
    },
    attemptRecords: attemptRecords.map((record) => ({
      ...record,
      uid: user.uid,
    })),
    masterySnapshots: buildMasterySeeds({
      uid: user.uid,
      attemptRecords,
      completedAt,
    }),
    grade,
  }
}

export function buildMasterySeeds({ uid, attemptRecords, completedAt }) {
  const grouped = new Map()

  attemptRecords.forEach((record) => {
    const current = grouped.get(record.skillId) || []
    current.push(record)
    grouped.set(record.skillId, current)
  })

  return [...grouped.entries()].map(([skillId, records]) => ({
    schemaVersion: LEARNING_RECORD_SCHEMA_VERSION,
    uid,
    skillId,
    attemptCountDelta: records.length,
    correctCountDelta: records.filter((record) => record.isCorrect).length,
    recentResultsDelta: records.map((record) => record.isCorrect),
    lastPracticedAt: completedAt,
  }))
}

export function applyMasteryUpdate(previousSnapshot, seed) {
  validateIdentifier('seed.uid', seed?.uid)
  validateIdentifier('seed.skillId', seed?.skillId)

  const previousRecentResults = Array.isArray(previousSnapshot?.recentResults)
    ? previousSnapshot.recentResults.filter((value) => typeof value === 'boolean')
    : []
  const recentResults = [...previousRecentResults, ...seed.recentResultsDelta]
    .slice(-MASTERY_RECENT_WINDOW)
  const previousAttemptCount = Number.isInteger(previousSnapshot?.attemptCount) && previousSnapshot.attemptCount >= 0
    ? previousSnapshot.attemptCount
    : 0
  const previousCorrectCount = Number.isInteger(previousSnapshot?.correctCount)
    && previousSnapshot.correctCount >= 0
    && previousSnapshot.correctCount <= previousAttemptCount
    ? previousSnapshot.correctCount
    : 0
  const attemptCount = previousAttemptCount + seed.attemptCountDelta
  const correctCount = previousCorrectCount + seed.correctCountDelta
  const recentAccuracyPercent = recentResults.length
    ? Math.round((recentResults.filter(Boolean).length / recentResults.length) * 100)
    : 0

  return {
    schemaVersion: LEARNING_RECORD_SCHEMA_VERSION,
    uid: seed.uid,
    skillId: seed.skillId,
    attemptCount,
    correctCount,
    recentResults,
    recentAccuracyPercent,
    lastPracticedAt: seed.lastPracticedAt,
    updatedAt: seed.lastPracticedAt,
    metricSummary: 'Recent accuracy is the percent correct across the latest recorded attempts for this skill.',
  }
}

export function createSessionStorageLabel(session) {
  return `${session?.config?.topic || 'study'}-${slugify(session?.config?.mode || 'practice')}`
}
