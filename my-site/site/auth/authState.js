export function getAuthStatus(user, isReady) {
  if (!isReady) {
    return 'loading'
  }

  return user ? 'signed-in' : 'signed-out'
}

export function canPersistLearningRecords(user, session) {
  return Boolean(user?.uid && session?.status === 'complete')
}

export function getProgressPersistenceLabel(user, session) {
  if (!session || session.status === 'complete') {
    return user
      ? 'Signed-in progress can be saved to your account.'
      : 'Guest progress is temporary until you sign in.'
  }

  return user
    ? 'This session is stored on this device while you work, then saved to your account when you finish.'
    : 'This session is temporary and stored only on this device until you sign in.'
}
