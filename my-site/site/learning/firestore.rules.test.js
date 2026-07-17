import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import { persistLearningRecords } from './learningFirestore.js'
import { getQuestions } from '../questions/questionData.js'
import { completeSession, createSession } from '../questions/questionEngine.js'

const projectId = 'study-site-phase4-rules'
const rules = readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8')

const baseProfile = {
  schemaVersion: 1,
  uid: 'user-a',
  email: 'student@example.com',
  displayName: 'Student A',
  photoURL: null,
  authProviderIds: ['google.com'],
  createdAt: new Date('2026-07-17T00:00:00.000Z'),
  lastSeenAt: new Date('2026-07-17T00:10:00.000Z'),
}

const baseAttempt = {
  schemaVersion: 1,
  uid: 'user-a',
  attemptId: 'session-1__question-1',
  sessionId: 'session-1',
  examId: 'sat',
  subjectId: 'sat-math',
  domainId: 'algebra',
  skillId: 'linear-equations-one-variable',
  questionId: 'question-1',
  mode: 'practice',
  source: 'practice-session',
  isCorrect: true,
  answer: 'b',
  answeredAt: new Date('2026-07-17T00:10:00.000Z'),
  durationSeconds: 14,
}

const baseSession = {
  schemaVersion: 1,
  uid: 'user-a',
  sessionId: 'session-1',
  examId: 'sat',
  subjectId: 'sat-math',
  domainIds: ['algebra'],
  skillIds: ['linear-equations-one-variable'],
  mode: 'practice',
  questionCount: 5,
  attemptedCount: 1,
  correctCount: 1,
  accuracyPercent: 100,
  completionState: 'submitted',
  startedAt: new Date('2026-07-17T00:00:00.000Z'),
  completedAt: new Date('2026-07-17T00:10:00.000Z'),
  timerMinutes: null,
  filterDomainIds: ['algebra'],
  filterSkillIds: ['linear-equations-one-variable'],
}

const baseMastery = {
  schemaVersion: 1,
  uid: 'user-a',
  skillId: 'linear-equations-one-variable',
  attemptCount: 1,
  correctCount: 1,
  recentResults: [true],
  recentAccuracyPercent: 100,
  lastPracticedAt: new Date('2026-07-17T00:10:00.000Z'),
  updatedAt: new Date('2026-07-17T00:10:00.000Z'),
  metricSummary: 'Recent accuracy is the percent correct across the latest recorded attempts for this skill.',
}

let testEnv

test.before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules },
  })
})

test.after(async () => {
  await testEnv.cleanup()
})

function dbFor(uid = null) {
  return uid
    ? testEnv.authenticatedContext(uid).firestore()
    : testEnv.unauthenticatedContext().firestore()
}

test('unauthenticated users cannot read or write private learning records', async () => {
  const guestDb = dbFor()

  await assertFails(getDoc(doc(guestDb, 'users/user-a')))
  await assertFails(setDoc(doc(guestDb, 'users/user-a'), baseProfile))
  await assertFails(setDoc(doc(guestDb, 'users/user-a/attempts/session-1__question-1'), baseAttempt))
})

test('a user can read and write their own records', async () => {
  const userDb = dbFor('user-a')

  await assertSucceeds(setDoc(doc(userDb, 'users/user-a'), baseProfile))
  await assertSucceeds(getDoc(doc(userDb, 'users/user-a')))
  await assertSucceeds(setDoc(doc(userDb, 'users/user-a/attempts/session-1__question-1'), baseAttempt))
  await assertSucceeds(setDoc(doc(userDb, 'users/user-a/sessions/session-1'), baseSession))
  await assertSucceeds(setDoc(doc(userDb, 'users/user-a/mastery/linear-equations-one-variable'), baseMastery))
})

test('a user cannot read or write another users records', async () => {
  const ownerDb = dbFor('user-a')
  const otherUserDb = dbFor('user-b')

  await assertSucceeds(setDoc(doc(ownerDb, 'users/user-a'), baseProfile))
  await assertFails(getDoc(doc(otherUserDb, 'users/user-a')))
  await assertFails(setDoc(doc(otherUserDb, 'users/user-a'), { ...baseProfile, uid: 'user-b' }))
  await assertFails(setDoc(doc(otherUserDb, 'users/user-a/attempts/session-1__question-1'), { ...baseAttempt, uid: 'user-b' }))
})

test('mismatched ownership and invalid records are rejected', async () => {
  const userDb = dbFor('user-a')

  await assertFails(setDoc(doc(userDb, 'users/user-a'), { ...baseProfile, uid: 'user-b' }))
  await assertFails(setDoc(doc(userDb, 'users/user-a/attempts/session-1__question-1'), { ...baseAttempt, uid: 'user-b' }))
  await assertFails(setDoc(doc(userDb, 'users/user-a/attempts/session-1__question-1'), { ...baseAttempt, attemptId: 'different-id' }))
  await assertFails(setDoc(doc(userDb, 'users/user-a/sessions/session-1'), { ...baseSession, accuracyPercent: 101 }))
  await assertFails(setDoc(doc(userDb, 'users/user-a/mastery/linear-equations-one-variable'), { ...baseMastery, skillId: 'other-skill' }))
})

test('attempt and completed-session records cannot be rewritten', async () => {
  const userDb = dbFor('user-a')
  const attemptRef = doc(userDb, 'users/user-a/attempts/immutable-session__immutable-question')
  const sessionRef = doc(userDb, 'users/user-a/sessions/immutable-session')
  const attempt = {
    ...baseAttempt,
    attemptId: 'immutable-session__immutable-question',
    sessionId: 'immutable-session',
    questionId: 'immutable-question',
  }
  const session = { ...baseSession, sessionId: 'immutable-session' }

  await assertSucceeds(setDoc(attemptRef, attempt))
  await assertSucceeds(setDoc(sessionRef, session))
  await assertFails(setDoc(attemptRef, { ...attempt, isCorrect: false }))
  await assertFails(setDoc(sessionRef, { ...session, correctCount: 0 }))
})

test('non-user documents remain unavailable to clients', async () => {
  const userDb = dbFor('user-a')
  const guestDb = dbFor()

  await assertFails(getDoc(doc(guestDb, 'tracker/stats')))
  await assertFails(getDoc(doc(userDb, 'tracker/stats')))
  await assertFails(setDoc(doc(userDb, 'tracker/stats'), { totalUsers: 1 }))
})

test('completed learning records persist atomically and retries stay idempotent', async () => {
  const uid = 'persistence-user'
  const userDb = dbFor(uid)
  const questions = getQuestions({
    topic: 'sat-math',
    filters: { skill: ['linear-equations-one-variable'] },
  })
  const activeSession = createSession({
    topic: 'sat-math',
    mode: 'testing',
    filters: { domain: ['algebra'], skill: ['linear-equations-one-variable'] },
    questionCount: 'all',
    timerMinutes: null,
  }, questions, () => 0, 1_000)
  const session = completeSession({
    ...activeSession,
    answers: {
      [questions[0].id]: questions[0].correctOptionId,
      [questions[1].id]: 'incorrect-option',
    },
  }, 'submitted', 8_000)
  const user = {
    uid,
    email: 'persistence@example.com',
    displayName: 'Persistence Test',
    photoURL: null,
    providerData: [{ providerId: 'google.com' }],
  }

  const firstResult = await persistLearningRecords({
    user,
    session,
    questions,
    firestore: userDb,
  })
  const secondResult = await persistLearningRecords({
    user,
    session,
    questions,
    firestore: userDb,
  })
  const sessionSnapshot = await getDoc(doc(userDb, `users/${uid}/sessions/${session.id}`))
  const attemptSnapshot = await getDoc(doc(userDb, `users/${uid}/attempts/${session.id}__${questions[0].id}`))
  const masterySnapshot = await getDoc(doc(userDb, `users/${uid}/mastery/linear-equations-one-variable`))

  assert.equal(firstResult.status, 'saved')
  assert.equal(secondResult.status, 'duplicate')
  assert.equal(sessionSnapshot.data().attemptedCount, 2)
  assert.equal(attemptSnapshot.data().isCorrect, true)
  assert.equal(masterySnapshot.data().attemptCount, 2)
  assert.equal(masterySnapshot.data().correctCount, 1)
})
