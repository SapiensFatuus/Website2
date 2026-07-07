const MAX_MESSAGE_LENGTH = 1200
const MAX_HISTORY_ITEMS = 10

const mockTutors = Object.freeze({
  'sat:sat-math:algebra:linear-equations-one-variable': Object.freeze({
    label: 'linear equations in one variable',
    keywords: Object.freeze(['linear', 'equation', 'solve', '3x', 'variable', 'both sides']),
    sourceId: 'mock-linear-equations-example',
    answer: 'Here is a client-safe mock example:\n\nSubtract $5$ from both sides to get $3x = 15$. Then divide both sides by $3$: $$x = \\frac{15}{3} = 5$$\n\nAlternative method: work backward by undoing addition, then multiplication.',
  }),
  'sat:sat-math:algebra:linear-functions': Object.freeze({
    label: 'linear functions',
    keywords: Object.freeze(['linear', 'function', 'slope', 'intercept', 'rate of change', 'f(x)', 'graph', 'table']),
    sourceId: 'mock-linear-functions-example',
    answer: 'Here is a client-safe mock example:\n\nIn $f(x) = 3x - 4$, the slope is $3$ and the y-intercept is $-4$.\n\nAlternative method: evaluate $f(0)$ for the intercept, then compare outputs one input unit apart for the slope.',
  }),
})

function targetKey(target = {}) {
  return [target.examId, target.subjectId, target.domainId, target.skillId].join(':')
}

function isFollowUp(message) {
  return /^(why|how|can you|could you|show|explain|check|what about|another|is that|does that)|\b(that|it|this method|another method|alternative)\b/.test(message)
}

export function createMockTutorResponse(request) {
  if (!request || typeof request !== 'object') throw new TypeError('Request data must be an object.')
  const tutor = mockTutors[targetKey(request.target)]
  if (!tutor) throw new TypeError('This taxonomy target is not supported by the mock tutor.')
  if (typeof request.message !== 'string' || !request.message.trim() || request.message.trim().length > MAX_MESSAGE_LENGTH) {
    throw new TypeError('A valid message is required.')
  }
  if (!Array.isArray(request.history) || request.history.length > MAX_HISTORY_ITEMS) {
    throw new TypeError(`History must contain at most ${MAX_HISTORY_ITEMS} messages.`)
  }
  const validHistory = request.history.every((item) => (
    item
    && ['user', 'assistant'].includes(item.role)
    && typeof item.content === 'string'
    && item.content.trim().length > 0
    && item.content.length <= MAX_MESSAGE_LENGTH
  ))
  if (!validHistory) throw new TypeError('Chat history contains an invalid message.')

  const message = request.message.trim().toLowerCase()
  const directMatch = tutor.keywords.some((keyword) => message.includes(keyword))
  const historyText = request.history.map((item) => item.content || '').join(' ').toLowerCase()
  const relevantFollowUp = request.history.length > 0
    && isFollowUp(message)
    && tutor.keywords.some((keyword) => historyText.includes(keyword))

  if (!directMatch && !relevantFollowUp) {
    return {
      answer: `I do not have enough supplied mock material to answer that reliably. This mock only covers ${tutor.label}.`,
      sourceIds: [],
      insufficient: true,
    }
  }

  return { answer: tutor.answer, sourceIds: [tutor.sourceId], insufficient: false }
}
