function createFallbackId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function createStableSessionId(seed = null) {
  if (seed) {
    return seed
  }

  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return createFallbackId('session')
}

export function createAttemptId(sessionId, questionId) {
  if (!sessionId || !questionId) {
    throw new Error('Attempt IDs require both a session ID and a question ID.')
  }

  return `${sessionId}__${questionId}`
}

export function createPersistenceFingerprint(uid, sessionId) {
  if (!uid || !sessionId) {
    throw new Error('Persistence fingerprints require both a UID and a session ID.')
  }

  return `${uid}:${sessionId}`
}
