import { getTutorUiScopeDetails, resolveTutorUiTarget } from './tutorScopes.js'

const MAX_MESSAGE_LENGTH = 1200
const MAX_HISTORY_ITEMS = 10

function validateRequest(request) {
  if (!request || typeof request !== 'object') throw new TypeError('Request data must be an object.')
  const target = resolveTutorUiTarget(request.target)
  if (!target) throw new TypeError('This taxonomy target is not supported by the mock tutor.')
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
  return target
}

function sameTarget(left, right) {
  return left.scope === right.scope && left.domainId === right.domainId && left.skillId === right.skillId
}

function result({ answer, target, initialTarget, label, classification = null, scopeNotice = '', insufficient = false }) {
  const resolvedClassification = classification || (sameTarget(target, initialTarget) ? 'same-scope' : 'adjusted-within-subject')
  const notice = scopeNotice || (resolvedClassification === 'adjusted-within-subject'
    ? `This question fits ${label}, so I adjusted the tutoring scope for this response.`
    : '')
  return { answer, insufficient, effectiveTarget: target, scopeNotice: notice, classification: resolvedClassification }
}

function satTarget(scope, domainId = null, skillId = null) {
  return resolveTutorUiTarget({ examId: 'sat', subjectId: 'sat-math', scope, domainId, skillId })
}

function apTarget(scope, domainId = null) {
  return resolveTutorUiTarget({ examId: 'ap', subjectId: 'ap-chemistry', scope, domainId })
}

export function createMockTutorResponse(request) {
  const initialTarget = validateRequest(request)
  const message = request.message.trim().toLowerCase()
  const details = getTutorUiScopeDetails(initialTarget)

  if (/photosynthesis|cellular respiration|world war|shakespeare|capital of france/.test(message)) {
    return result({
      initialTarget,
      target: initialTarget,
      classification: 'outside-subject',
      scopeNotice: `This question is outside ${details.subject.label}, but I can still help with a general explanation.`,
      answer: `This question is outside ${details.subject.label}, but I can still help with a general explanation.\n\nPhotosynthesis is the process plants, algae, and some bacteria use to convert light energy into chemical energy. In simplified form, carbon dioxide and water are used to produce glucose and oxygen.\n\nA useful next step is to separate the light-dependent reactions from the Calvin cycle. Which part would you like to examine?`,
    })
  }

  if (/entire|whole test|study plan|test strategy|overall review/.test(message)) {
    const target = initialTarget.subjectId === 'sat-math' ? satTarget('subject') : apTarget('subject')
    const label = getTutorUiScopeDetails(target).label
    return result({
      initialTarget,
      target,
      label,
      classification: sameTarget(target, initialTarget) ? 'same-scope' : 'broadened',
      scopeNotice: sameTarget(target, initialTarget) ? '' : `I widened the tutoring scope to the entire ${label}.`,
      answer: initialTarget.subjectId === 'sat-math'
        ? '**SAT Math review plan**\n\n1. Take a short mixed diagnostic and tag misses by domain.\n2. Spend most practice time on the two weakest domains.\n3. Alternate untimed skill work with timed mixed sets.\n4. Keep an error log that records the cause of each miss, not just the answer.\n5. Finish with full-module pacing practice.\n\nWhat is your test date and current score range?'
        : '**AP Chemistry review plan**\n\n1. Diagnose strengths across all eight units.\n2. Rebuild weak concepts before adding calculations.\n3. Practice particle-level, symbolic, and macroscopic representations together.\n4. Mix multiple-choice work with written justification and FRQs.\n5. Review errors by misconception, setup, algebra, and units.\n\nWhen is your exam, and which unit currently feels weakest?',
    })
  }

  if (initialTarget.scope === 'domain' && /review|unit|overview|topics|study/.test(message)) {
    return result({
      initialTarget,
      target: initialTarget,
      answer: `Here is a useful way to review the ${details.label} unit:\n\n1. List the core concepts and formulas from memory.\n2. Work one representative problem from each major skill.\n3. Explain why each method works, not only the steps.\n4. Finish with a mixed timed set and review every error.\n\nWhich skill in this unit should we start with?`,
    })
  }

  if (initialTarget.subjectId === 'ap-chemistry' && /equilibrium|le chatelier|reaction quotient|\bksp\b/.test(message)) {
    const target = apTarget('domain', 'equilibrium')
    return result({
      initialTarget,
      target,
      label: 'Equilibrium',
      answer: 'Start by comparing the reaction quotient $Q$ with the equilibrium constant $K$.\n\n- If $Q < K$, the reaction shifts toward products.\n- If $Q > K$, it shifts toward reactants.\n- If $Q = K$, the system is already at equilibrium.\n\nFor a stress such as added reactant, use this comparison rather than memorizing a direction. Would you like a numerical example or a Le Chatelier conceptual example?',
    })
  }

  if (initialTarget.subjectId === 'sat-math' && /circle|radius|diameter|circumference|\barc\b/.test(message)) {
    const target = satTarget('skill', 'geometry-trigonometry', 'circles')
    return result({
      initialTarget,
      target,
      label: 'Circles',
      answer: 'A strong first step is to identify whether the question uses a measurement formula or a coordinate equation.\n\nFor $(x-h)^2+(y-k)^2=r^2$, the center is $(h,k)$ and the radius is $r$. Notice that the signs inside the parentheses are opposite the center coordinates.\n\nIf you share the exact circle question, I can guide you through the setup before revealing the full solution.',
    })
  }

  if (initialTarget.subjectId === 'sat-math' && /slope|y-intercept|linear function|rate of change|f\(x\)/.test(message)) {
    const target = satTarget('skill', 'algebra', 'linear-functions')
    return result({
      initialTarget,
      target,
      label: 'Linear functions',
      answer: 'For $f(x)=3x-4$, compare it with $y=mx+b$. The coefficient $m=3$ is the slope, and $b=-4$ is the y-intercept.\n\nTo verify instead of memorizing, evaluate $f(0)=-4$ for the intercept, then compare outputs one input unit apart to see the constant change of $3$.',
    })
  }

  if (initialTarget.subjectId === 'sat-math' && /solve|equation|3x|variable|both sides/.test(message)) {
    const target = satTarget('skill', 'algebra', 'linear-equations-one-variable')
    return result({
      initialTarget,
      target,
      label: 'Linear equations in one variable',
      answer: 'Try the first step yourself: undo the added $5$ by subtracting $5$ from both sides. That gives $3x=15$.\n\nIf you want the full solution, divide both sides by $3$:\n\n$$x=\\frac{15}{3}=5$$\n\nCheck by substituting $5$ into the original equation.',
    })
  }

  if (message === 'help' || message === 'can you help me') {
    return result({
      initialTarget,
      target: initialTarget,
      insufficient: true,
      answer: `I can help with ${details.label}. Are you looking for a concept explanation, help with a specific question, a worked example, or a study plan?`,
    })
  }

  if (initialTarget.scope === 'skill' && /teach me|explain|review|practice/.test(message)) {
    return result({
      initialTarget,
      target: initialTarget,
      answer: `Let’s work on ${details.label}. Before we begin, what do you already know about this skill, and where do you tend to get stuck?\n\nOnce I know that, I’ll explain the key idea with a ${details.subject.label}-style example and guide you through a practice problem one step at a time.`,
    })
  }

  const target = initialTarget.scope === 'subject'
    ? initialTarget
    : resolveTutorUiTarget({ examId: initialTarget.examId, subjectId: initialTarget.subjectId, scope: 'subject' })
  return result({
    initialTarget,
    target,
    label: getTutorUiScopeDetails(target).label,
    classification: sameTarget(target, initialTarget) ? 'same-scope' : 'broadened',
    scopeNotice: sameTarget(target, initialTarget) ? '' : `I widened the tutoring scope to the entire ${details.subject.label} so I can answer beyond the selected ${initialTarget.scope}.`,
    answer: `I can help with that within the broader ${details.subject.label} context. Tell me the exact problem or concept, and include any answer choices or work you have already tried so I can give a precise explanation rather than guess.`,
  })
}
