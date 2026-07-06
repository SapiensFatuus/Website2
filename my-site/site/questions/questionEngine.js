export const SESSION_VERSION = 3

export function shuffle(items, random = Math.random) {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}

export function createSession(config, matchingQuestions, random = Math.random, now = Date.now()) {
  const requestedCount = config.mode === 'practice' || config.questionCount === 'all'
    ? matchingQuestions.length
    : Math.min(Number(config.questionCount), matchingQuestions.length)
  const selectedQuestions = shuffle(matchingQuestions, random).slice(0, requestedCount)
  const questionIds = selectedQuestions.map((question) => question.id)
  const optionOrders = Object.fromEntries(selectedQuestions.map((question) => [
    question.id,
    question.options ? shuffle(question.options.map((option) => option.id), random) : [],
  ]))

  return {
    version: SESSION_VERSION,
    status: 'active',
    config,
    questionIds,
    currentIndex: 0,
    answers: {},
    eliminated: {},
    flagged: {},
    submitted: {},
    skipped: {},
    optionOrders,
    timeSpentMs: {},
    activeQuestionStartedAt: now,
    startedAt: now,
    completedAt: null,
    deadline: config.timerMinutes ? now + Number(config.timerMinutes) * 60_000 : null,
    completionReason: null,
    practicePoolExhausted: false,
  }
}

export function normalizeSession(session, questions, random = Math.random, now = Date.now()) {
  const questionsById = new Map(questions.map((question) => [question.id, question]))
  const optionOrders = { ...(session.optionOrders || {}) }

  session.questionIds.forEach((questionId) => {
    if (optionOrders[questionId]?.length) return
    const question = questionsById.get(questionId)
    if (question) optionOrders[questionId] = question.options
      ? shuffle(question.options.map((option) => option.id), random)
      : []
  })

  return {
    ...session,
    version: SESSION_VERSION,
    config: {
      ...session.config,
      filters: session.config.filters || {
        ...(session.config.type ? { questionType: [session.config.type] } : {}),
        ...(session.config.materials?.length ? {
          material: session.config.materials.map((value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')),
        } : {}),
      },
      reportingGroupId: session.config.reportingGroupId || 'material',
    },
    optionOrders,
    skipped: session.skipped || {},
    timeSpentMs: session.timeSpentMs || {},
    activeQuestionStartedAt: session.activeQuestionStartedAt ?? now,
    practicePoolExhausted: session.practicePoolExhausted || false,
  }
}

export function getOrderedOptions(question, session) {
  if (!question.options) return []
  const optionsById = new Map(question.options.map((option) => [option.id, option]))
  const order = session.optionOrders?.[question.id] || question.options.map((option) => option.id)
  return order.map((id) => optionsById.get(id)).filter(Boolean)
}

export function commitQuestionTime(session, now = Date.now(), keepActive = false) {
  if (!session.activeQuestionStartedAt || session.status !== 'active') return session
  const questionId = session.questionIds[session.currentIndex]
  const elapsed = Math.max(0, now - session.activeQuestionStartedAt)

  return {
    ...session,
    timeSpentMs: {
      ...session.timeSpentMs,
      [questionId]: (session.timeSpentMs?.[questionId] || 0) + elapsed,
    },
    activeQuestionStartedAt: keepActive ? now : null,
  }
}

export function moveToQuestion(session, nextIndex, now = Date.now(), isActive = true) {
  const timed = commitQuestionTime(session, now)
  return {
    ...timed,
    currentIndex: Math.max(0, Math.min(nextIndex, session.questionIds.length - 1)),
    activeQuestionStartedAt: isActive ? now : null,
  }
}

export function setSessionVisibility(session, isVisible, now = Date.now()) {
  if (session.status !== 'active') return session
  if (!isVisible) return commitQuestionTime(session, now)
  if (session.activeQuestionStartedAt) return session
  return { ...session, activeQuestionStartedAt: now }
}

export function advancePracticeSession(session, { skip = false } = {}, now = Date.now(), isActive = true) {
  const questionId = session.questionIds[session.currentIndex]
  const timed = commitQuestionTime(session, now)
  const nextIndex = session.currentIndex + 1
  const exhausted = nextIndex >= session.questionIds.length
  const answers = { ...timed.answers }
  const eliminated = { ...timed.eliminated }
  const submitted = { ...timed.submitted }
  const skipped = { ...timed.skipped }

  if (skip) {
    delete answers[questionId]
    delete eliminated[questionId]
    delete submitted[questionId]
    skipped[questionId] = true
  }

  return {
    ...timed,
    answers,
    eliminated,
    submitted,
    skipped,
    currentIndex: exhausted ? session.currentIndex : nextIndex,
    practicePoolExhausted: exhausted,
    activeQuestionStartedAt: exhausted || !isActive ? null : now,
  }
}

export function answeredCount(session) {
  return session.questionIds.filter((id) => String(session.answers[id] ?? '').trim().length > 0).length
}

export function progressPercent(session) {
  if (!session.questionIds.length) return 0
  return Math.round((answeredCount(session) / session.questionIds.length) * 100)
}

export function completeSession(session, reason = 'submitted', now = Date.now()) {
  const timed = commitQuestionTime(session, now)
  return {
    ...timed,
    status: 'complete',
    completedAt: now,
    completionReason: reason,
  }
}

export function getQuestionTimeSeconds(session, questionId, now = Date.now()) {
  let milliseconds = session.timeSpentMs?.[questionId] || 0
  const currentQuestionId = session.questionIds[session.currentIndex]
  if (session.status === 'active' && currentQuestionId === questionId && session.activeQuestionStartedAt) {
    milliseconds += Math.max(0, now - session.activeQuestionStartedAt)
  }
  return Math.floor(milliseconds / 1000)
}

export function gradeSession(session, questions) {
  const questionsById = new Map(questions.map((question) => [question.id, question]))
  const includedQuestionIds = session.config.mode === 'practice'
    ? session.questionIds.filter((questionId) => session.submitted[questionId] || session.skipped?.[questionId])
    : session.questionIds
  const details = includedQuestionIds.map((questionId) => {
    const question = questionsById.get(questionId)
    const answer = session.answers[questionId] ?? null
    const normalizedAnswer = typeof answer === 'string' ? answer.trim() : answer
    const isSkipped = Boolean(session.skipped?.[questionId])
    const isSubmitted = session.config.mode === 'testing' || Boolean(session.submitted[questionId])
    const hasAnswer = normalizedAnswer !== null && normalizedAnswer !== ''
    const isCorrect = Boolean(question && hasAnswer && isSubmitted && !isSkipped && (
      question.renderer === 'grid-in'
        ? normalizedAnswer === String(question.correctAnswer).trim()
        : question.renderer === 'free-response'
          ? false
          : normalizedAnswer === question.correctOptionId
    ))

    const reportingGroupId = session.config.reportingGroupId || 'material'
    const materials = question?.classifications?.[reportingGroupId]
      || question?.classifications?.domain
      || [question?.material || 'Unknown']
    return {
      questionId,
      material: materials[0],
      materials,
      answer,
      selectedOptionId: question?.renderer === 'multiple-choice' ? answer : null,
      isSubmitted,
      isCorrect,
      isSkipped,
      isUnanswered: !isSkipped && (!hasAnswer || !isSubmitted),
    }
  })
  const scoredDetails = details.filter((detail) => !detail.isSkipped)
  const correct = scoredDetails.filter((detail) => detail.isCorrect).length
  const unanswered = scoredDetails.filter((detail) => detail.isUnanswered).length
  const total = scoredDetails.length
  const incorrect = total - correct - unanswered
  const skipped = details.filter((detail) => detail.isSkipped).length
  const byMaterial = {}

  details.forEach((detail) => {
    if (detail.isSkipped) return
    detail.materials.forEach((material) => {
      byMaterial[material] ||= { total: 0, correct: 0, incorrect: 0, unanswered: 0 }
      byMaterial[material].total += 1
      if (detail.isCorrect) byMaterial[material].correct += 1
      else if (detail.isUnanswered) byMaterial[material].unanswered += 1
      else byMaterial[material].incorrect += 1
    })
  })

  return {
    total,
    correct,
    incorrect,
    unanswered,
    skipped,
    percent: total ? Math.round((correct / total) * 100) : 0,
    details,
    byMaterial,
  }
}

export function getElapsedSeconds(session, now = Date.now()) {
  const end = session.completedAt || now
  return Math.max(0, Math.floor((end - session.startedAt) / 1000))
}

export function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function getScoreBand(percent) {
  if (percent < 25) return 'red'
  if (percent < 50) return 'orange'
  if (percent < 75) return 'yellow'
  return 'green'
}

export function getMaterialPercent(result) {
  return result.total ? Math.round((result.correct / result.total) * 100) : 0
}

export function sortReviewQuestions(questions, session, details, sortKey = 'order', direction = 'asc') {
  const originalOrder = new Map(session.questionIds.map((id, index) => [id, index]))
  const detailsById = new Map(details.map((detail) => [detail.questionId, detail]))
  const statusRank = (detail) => detail?.isCorrect ? 3 : detail?.isUnanswered ? 2 : detail?.isSkipped ? 1 : 0
  const multiplier = direction === 'desc' ? -1 : 1

  return [...questions].sort((left, right) => {
    let comparison
    if (sortKey === 'material') {
      const groupId = session.config?.reportingGroupId || 'material'
      const leftMaterial = left.classifications?.[groupId]?.join(',') || left.classifications?.domain?.join(',') || left.material || ''
      const rightMaterial = right.classifications?.[groupId]?.join(',') || right.classifications?.domain?.join(',') || right.material || ''
      comparison = leftMaterial.localeCompare(rightMaterial)
    }
    else if (sortKey === 'status') comparison = statusRank(detailsById.get(left.id)) - statusRank(detailsById.get(right.id))
    else if (sortKey === 'time') comparison = getQuestionTimeSeconds(session, left.id) - getQuestionTimeSeconds(session, right.id)
    else comparison = originalOrder.get(left.id) - originalOrder.get(right.id)

    if (comparison === 0) comparison = originalOrder.get(left.id) - originalOrder.get(right.id)
    return comparison * multiplier
  })
}

export function isRestorableSession(value, topic) {
  return Boolean(
    value
    && (value.version === 1 || value.version === 2 || value.version === SESSION_VERSION)
    && value.status === 'active'
    && value.config?.topic === topic
    && Array.isArray(value.questionIds)
    && value.questionIds.length,
  )
}
