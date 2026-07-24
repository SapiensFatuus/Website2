import {
  doc,
  getDoc,
  runTransaction,
} from 'firebase/firestore'
import { db } from '../firebaseFirestore.js'
import {
  applyMasteryUpdate,
  buildLearningRecordPayload,
} from './learningRecords.js'
import { createPersistenceFingerprint } from './learningIds.js'

function getUserDocRef(firestore, uid) {
  return doc(firestore, 'users', uid)
}

function getSessionDocRef(firestore, uid, sessionId) {
  return doc(firestore, 'users', uid, 'sessions', sessionId)
}

function getAttemptDocRef(firestore, uid, attemptId) {
  return doc(firestore, 'users', uid, 'attempts', attemptId)
}

function getMasteryDocRef(firestore, uid, skillId) {
  return doc(firestore, 'users', uid, 'mastery', skillId)
}

export async function loadUserMasterySnapshot(uid, skillId, firestore = db) {
  const snapshot = await getDoc(getMasteryDocRef(firestore, uid, skillId))
  return snapshot.exists() ? snapshot.data() : null
}

export async function persistLearningRecords({ user, session, questions, firestore = db }) {
  const payload = buildLearningRecordPayload({ user, session, questions })
  const fingerprint = createPersistenceFingerprint(user.uid, session.id)

  return runTransaction(firestore, async (transaction) => {
    const userRef = getUserDocRef(firestore, user.uid)
    const sessionRef = getSessionDocRef(firestore, user.uid, session.id)
    const masteryRefs = payload.masterySnapshots.map((seed) => ({
      ref: getMasteryDocRef(firestore, user.uid, seed.skillId),
      seed,
    }))
    const [existingUser, existingSession, ...masterySnapshots] = await Promise.all([
      transaction.get(userRef),
      transaction.get(sessionRef),
      ...masteryRefs.map(({ ref }) => transaction.get(ref)),
    ])

    if (existingSession.exists()) {
      return {
        status: 'duplicate',
        fingerprint,
        payload,
      }
    }

    transaction.set(userRef, {
      ...payload.profile,
      createdAt: existingUser.exists() ? existingUser.data().createdAt || payload.profile.createdAt : payload.profile.createdAt,
    }, { merge: true })
    transaction.set(sessionRef, payload.sessionRecord)

    payload.attemptRecords.forEach((record) => {
      transaction.set(getAttemptDocRef(firestore, user.uid, record.attemptId), record)
    })

    masteryRefs.forEach(({ ref, seed }, index) => {
      const masterySnapshot = masterySnapshots[index]
      const nextMastery = applyMasteryUpdate(masterySnapshot.exists() ? masterySnapshot.data() : null, seed)
      transaction.set(ref, nextMastery)
    })

    return {
      status: 'saved',
      fingerprint,
      payload,
    }
  })
}
