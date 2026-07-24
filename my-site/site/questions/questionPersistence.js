export function getQuestionPersistencePolicy(questions, { useFirestoreEmulator = false } = {}) {
  const unpublishedQuestionIds = (questions || [])
    .filter((question) => question?.content?.status && question.content.status !== 'published')
    .map(({ id }) => id)

  if (!unpublishedQuestionIds.length) {
    return Object.freeze({ allowed: true, destination: 'configured-firestore', unpublishedQuestionIds: Object.freeze([]), message: '' })
  }

  if (useFirestoreEmulator) {
    return Object.freeze({
      allowed: true,
      destination: 'firestore-emulator',
      unpublishedQuestionIds: Object.freeze(unpublishedQuestionIds),
      message: 'Draft preview progress is isolated in the local Firestore emulator.',
    })
  }

  return Object.freeze({
    allowed: false,
    destination: 'none',
    unpublishedQuestionIds: Object.freeze(unpublishedQuestionIds),
    message: 'Draft preview results stay on this page and are not added to your live account history. Use the Firestore emulator to test draft persistence.',
  })
}
