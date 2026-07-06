import test from 'node:test'
import assert from 'node:assert/strict'
import { demoQuestions, getAvailableMaterials, getQuestions } from './questionData.js'
import {
  advancePracticeSession,
  answeredCount,
  completeSession,
  commitQuestionTime,
  createSession,
  formatDuration,
  getMaterialPercent,
  getOrderedOptions,
  getQuestionTimeSeconds,
  getScoreBand,
  gradeSession,
  isRestorableSession,
  moveToQuestion,
  normalizeSession,
  progressPercent,
  setSessionVisibility,
  sortReviewQuestions,
} from './questionEngine.js'

test('question repository filters by topic, type, and material', () => {
  const geometry = getQuestions({
    topic: 'sat-math',
    type: 'multiple-choice',
    materials: ['Geometry'],
  })

  assert.equal(geometry.length, 3)
  assert.ok(geometry.every((question) => question.classifications.domain.includes('geometry-trigonometry')))
  assert.deepEqual(getAvailableMaterials('sat-math'), ['advanced-math', 'algebra', 'geometry-trigonometry', 'problem-solving-data-analysis'])
  assert.equal(getQuestions({ topic: 'sat-math', type: 'grid-in' }).length, 2)
  assert.equal(getQuestions({ topic: 'ap-chemistry', type: 'free-response' }).length, 3)
})

test('session creation caps count, preserves a stable set, and sets a deadline', () => {
  const session = createSession({
    topic: 'sat-math',
    mode: 'testing',
    type: 'multiple-choice',
    materials: [],
    questionCount: 20,
    timerMinutes: 10,
  }, getQuestions({ topic: 'sat-math', type: 'multiple-choice' }), () => 0.5, 1_000)

  assert.equal(session.questionIds.length, 9)
  assert.equal(new Set(session.questionIds).size, 9)
  assert.equal(session.deadline, 601_000)
  assert.equal(session.status, 'active')
  assert.ok(session.questionIds.every((id) => session.optionOrders[id].length === 4))
})

test('practice sessions always include every matching question once', () => {
  const session = createSession({
    topic: 'sat-math',
    mode: 'practice',
    type: 'multiple-choice',
    materials: [],
    questionCount: 1,
    timerMinutes: null,
  }, demoQuestions, () => 0.25, 1_000)

  assert.equal(session.questionIds.length, demoQuestions.length)
  assert.equal(new Set(session.questionIds).size, demoQuestions.length)
})

test('answer option order is randomized once and remains stable', () => {
  const question = demoQuestions[0]
  const session = createSession({ mode: 'practice', questionCount: 'all' }, [question], () => 0, 1_000)
  const firstRead = getOrderedOptions(question, session).map((option) => option.id)
  const secondRead = getOrderedOptions(question, session).map((option) => option.id)

  assert.deepEqual(firstRead, secondRead)
  assert.deepEqual(new Set(firstRead), new Set(question.options.map((option) => option.id)))
  assert.notDeepEqual(firstRead, question.options.map((option) => option.id))
})

test('older sessions gain stable option orders and timing fields on restore', () => {
  const question = demoQuestions[0]
  const oldSession = {
    version: 1,
    status: 'active',
    config: { topic: 'sat-math', mode: 'practice' },
    questionIds: [question.id],
    currentIndex: 0,
    startedAt: 100,
  }
  const normalized = normalizeSession(oldSession, [question], () => 0, 500)

  assert.equal(normalized.version, 3)
  assert.equal(normalized.optionOrders[question.id].length, 4)
  assert.deepEqual(normalized.timeSpentMs, {})
  assert.deepEqual(normalized.skipped, {})
  assert.equal(normalized.activeQuestionStartedAt, 500)
  assert.deepEqual(normalized.config.filters, {})
  assert.equal(normalized.config.reportingGroupId, 'material')
})

test('answered progress counts selected answers independently of submission', () => {
  const session = {
    questionIds: ['one', 'two', 'three', 'four'],
    answers: { one: 'a', three: 'b' },
  }

  assert.equal(answeredCount(session), 2)
  assert.equal(progressPercent(session), 50)
})

test('practice grading excludes unsubmitted and unvisited questions', () => {
  const questions = demoQuestions.slice(0, 3)
  const session = {
    config: { mode: 'practice' },
    questionIds: questions.map((question) => question.id),
    answers: {
      [questions[0].id]: questions[0].correctOptionId,
      [questions[1].id]: questions[1].correctOptionId,
    },
    submitted: { [questions[0].id]: true },
  }
  const grade = gradeSession(session, questions)

  assert.equal(grade.correct, 1)
  assert.equal(grade.total, 1)
  assert.equal(grade.unanswered, 0)
  assert.equal(grade.incorrect, 0)
  assert.equal(grade.percent, 100)
  assert.equal(grade.details.length, 1)
})

test('skipped practice questions appear in review but never reduce scores or material totals', () => {
  const questions = demoQuestions.slice(0, 3)
  const session = {
    config: { mode: 'practice' },
    questionIds: questions.map((question) => question.id),
    answers: { [questions[0].id]: questions[0].correctOptionId },
    submitted: { [questions[0].id]: true },
    skipped: { [questions[1].id]: true },
  }
  const grade = gradeSession(session, questions)

  assert.equal(grade.correct, 1)
  assert.equal(grade.total, 1)
  assert.equal(grade.skipped, 1)
  assert.equal(grade.percent, 100)
  assert.equal(grade.details.length, 2)
  assert.equal(grade.details[1].isSkipped, true)
  assert.equal(grade.byMaterial['geometry-trigonometry'].total, 1)
})

test('practice advancement skips forward, clears temporary work, and detects pool exhaustion', () => {
  const session = {
    status: 'active',
    questionIds: ['one', 'two'],
    currentIndex: 0,
    answers: { one: 'a' },
    eliminated: { one: ['b'] },
    submitted: {},
    skipped: {},
    timeSpentMs: {},
    activeQuestionStartedAt: 1_000,
    practicePoolExhausted: false,
  }
  const skipped = advancePracticeSession(session, { skip: true }, 3_000, true)
  const exhausted = advancePracticeSession(skipped, { skip: true }, 5_000, true)

  assert.equal(skipped.currentIndex, 1)
  assert.equal(skipped.skipped.one, true)
  assert.equal(skipped.answers.one, undefined)
  assert.equal(skipped.eliminated.one, undefined)
  assert.equal(getQuestionTimeSeconds(skipped, 'one'), 2)
  assert.equal(exhausted.practicePoolExhausted, true)
  assert.equal(exhausted.activeQuestionStartedAt, null)
})

test('testing grading evaluates all selected answers at completion', () => {
  const questions = demoQuestions.slice(0, 3)
  const session = {
    config: { mode: 'testing' },
    questionIds: questions.map((question) => question.id),
    answers: {
      [questions[0].id]: questions[0].correctOptionId,
      [questions[1].id]: 'not-correct',
    },
    submitted: {},
  }
  const grade = gradeSession(session, questions)

  assert.equal(grade.correct, 1)
  assert.equal(grade.incorrect, 1)
  assert.equal(grade.unanswered, 1)
  assert.equal(grade.byMaterial['geometry-trigonometry'].total, 3)
})

test('grid-in grading trims surrounding whitespace and uses exact matching', () => {
  const questions = getQuestions({ topic: 'sat-math', type: 'grid-in' })
  const session = {
    config: { mode: 'testing' },
    questionIds: questions.map((question) => question.id),
    answers: {
      [questions[0].id]: `  ${questions[0].correctAnswer}  `,
      [questions[1].id]: `${questions[1].correctAnswer}.0`,
    },
    submitted: {},
  }
  const grade = gradeSession(session, questions)

  assert.equal(grade.correct, 1)
  assert.equal(grade.incorrect, 1)
  assert.equal(grade.unanswered, 0)
  assert.equal(grade.details[0].answer.trim(), questions[0].correctAnswer)
})

test('free-response submissions are temporarily incorrect and blank responses are unanswered', () => {
  const questions = getQuestions({
    topic: 'ap-chemistry',
    filters: { questionType: ['free-response'], responseFormat: ['essay'] },
  })
  const session = {
    config: { mode: 'testing' },
    questionIds: questions.map((question) => question.id),
    answers: {
      [questions[0].id]: 'More particles collide successfully per second.',
      [questions[1].id]: '   ',
    },
    submitted: {},
  }
  const grade = gradeSession(session, questions)

  assert.equal(grade.correct, 0)
  assert.equal(grade.incorrect, 1)
  assert.equal(grade.unanswered, 1)
})

test('completion, duration formatting, and restoration validation handle edge cases', () => {
  const active = {
    version: 1,
    status: 'active',
    config: { topic: 'sat-math' },
    questionIds: ['one'],
    startedAt: 100,
  }
  const completed = completeSession(active, 'time-expired', 2_000)

  assert.equal(completed.status, 'complete')
  assert.equal(completed.completionReason, 'time-expired')
  assert.equal(formatDuration(65), '1:05')
  assert.equal(isRestorableSession(active, 'sat-math'), true)
  assert.equal(isRestorableSession(active, 'ap-chemistry'), false)
  assert.equal(isRestorableSession(completed, 'sat-math'), false)
})

test('active question time accumulates across navigation and pauses while hidden', () => {
  const base = {
    status: 'active',
    questionIds: ['one', 'two'],
    currentIndex: 0,
    timeSpentMs: {},
    activeQuestionStartedAt: 1_000,
  }
  const moved = moveToQuestion(base, 1, 4_000, true)
  const hidden = setSessionVisibility(moved, false, 6_500)
  const resumed = setSessionVisibility(hidden, true, 10_000)
  const committed = commitQuestionTime(resumed, 12_000)

  assert.equal(getQuestionTimeSeconds(committed, 'one'), 3)
  assert.equal(getQuestionTimeSeconds(committed, 'two'), 4)
  assert.equal(hidden.activeQuestionStartedAt, null)
})

test('score bands and material percentages use the requested boundaries', () => {
  assert.equal(getScoreBand(24), 'red')
  assert.equal(getScoreBand(25), 'orange')
  assert.equal(getScoreBand(50), 'yellow')
  assert.equal(getScoreBand(75), 'green')
  assert.equal(getMaterialPercent({ correct: 1, total: 2 }), 50)
})

test('review sorting supports order, material, status, and active time', () => {
  const questions = [demoQuestions[0], demoQuestions[3], demoQuestions[6]]
  const session = {
    status: 'complete',
    questionIds: questions.map((question) => question.id),
    currentIndex: 0,
    timeSpentMs: {
      [questions[0].id]: 2_000,
      [questions[1].id]: 8_000,
      [questions[2].id]: 4_000,
    },
  }
  const details = [
    { questionId: questions[0].id, isCorrect: true, isUnanswered: false },
    { questionId: questions[1].id, isCorrect: false, isUnanswered: false },
    { questionId: questions[2].id, isCorrect: false, isUnanswered: true },
  ]

  assert.deepEqual(sortReviewQuestions(questions, session, details, 'order', 'desc').map((q) => q.id), [...session.questionIds].reverse())
  assert.deepEqual(sortReviewQuestions(questions, session, details, 'material', 'asc').map((q) => q.classifications.domain[0]), ['algebra', 'geometry-trigonometry', 'problem-solving-data-analysis'])
  assert.deepEqual(sortReviewQuestions(questions, session, details, 'status', 'asc').map((q) => q.id), [questions[1].id, questions[2].id, questions[0].id])
  assert.deepEqual(sortReviewQuestions(questions, session, details, 'time', 'desc').map((q) => q.id), [questions[1].id, questions[2].id, questions[0].id])
})
