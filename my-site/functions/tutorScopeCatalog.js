import { apChemistryTutorDomains } from './apChemistryTutorProjection.js'

const satMathDomains = [
  {
    id: 'algebra',
    label: 'Algebra',
    keywords: ['algebra', 'linear', 'equation', 'inequality', 'slope', 'intercept', 'system'],
    skills: [
      ['linear-equations-one-variable', 'Linear equations in one variable', ['solve for x', 'one variable', 'both sides', '3x']],
      ['linear-functions', 'Linear functions', ['linear function', 'slope', 'y-intercept', 'rate of change', 'f(x)']],
      ['linear-equations-two-variables', 'Linear equations in two variables', ['two variables', 'equation of a line', 'coordinate plane']],
      ['systems-linear-equations', 'Systems of two linear equations', ['system of equations', 'simultaneous equations', 'intersection']],
      ['linear-inequalities', 'Linear inequalities', ['inequality', 'greater than', 'less than', 'number line']],
    ],
  },
  {
    id: 'advanced-math',
    label: 'Advanced Math',
    keywords: ['advanced math', 'quadratic', 'polynomial', 'exponential', 'radical', 'nonlinear', 'factoring'],
    skills: [
      ['equivalent-expressions', 'Equivalent expressions', ['equivalent expression', 'rewrite', 'factor', 'exponent rules']],
      ['nonlinear-equations-one-variable', 'Nonlinear equations in one variable', ['quadratic equation', 'radical equation', 'rational equation']],
      ['systems-linear-nonlinear', 'Systems of linear and nonlinear equations', ['linear and nonlinear system', 'line and parabola']],
      ['nonlinear-functions', 'Nonlinear functions', ['quadratic function', 'exponential function', 'polynomial function']],
    ],
  },
  {
    id: 'problem-solving-data-analysis',
    label: 'Problem-Solving and Data Analysis',
    keywords: ['data analysis', 'ratio', 'percent', 'statistics', 'probability', 'sample', 'survey'],
    skills: [
      ['ratios-rates-proportions-units', 'Ratios, rates, proportions, and units', ['ratio', 'rate', 'proportion', 'unit conversion']],
      ['percentages', 'Percentages', ['percent', 'percentage', 'discount', 'percent change']],
      ['one-variable-data', 'One-variable data', ['mean', 'median', 'range', 'standard deviation', 'distribution']],
      ['two-variable-data', 'Two-variable data', ['scatterplot', 'correlation', 'line of best fit', 'two-variable data']],
      ['probability-conditional-probability', 'Probability and conditional probability', ['probability', 'conditional probability', 'outcome']],
      ['inference-sample-statistics', 'Inference from sample statistics', ['sample statistics', 'population', 'margin of error', 'inference']],
      ['evaluating-statistical-claims', 'Evaluating statistical claims', ['statistical claim', 'survey', 'experiment', 'study design']],
    ],
  },
  {
    id: 'geometry-trigonometry',
    label: 'Geometry and Trigonometry',
    keywords: ['geometry', 'trigonometry', 'triangle', 'circle', 'angle', 'area', 'volume'],
    skills: [
      ['area-volume', 'Area and volume', ['area', 'volume', 'surface area', 'two-dimensional', 'three-dimensional']],
      ['lines-angles-triangles', 'Lines, angles, and triangles', ['line', 'angle', 'triangle', 'similarity', 'congruence']],
      ['right-triangles-trigonometry', 'Right triangles and trigonometry', ['right triangle', 'pythagorean', 'sine', 'cosine', 'tangent', 'soh cah toa']],
      ['circles', 'Circles', ['circle', 'radius', 'diameter', 'arc', 'circumference', 'circle equation']],
    ],
  },
]

export const tutorSubjects = Object.freeze({
  'sat:sat-math': Object.freeze({
    examId: 'sat',
    examLabel: 'SAT',
    subjectId: 'sat-math',
    label: 'SAT Math',
    keywords: ['sat math', 'digital sat', 'calculator', 'student-produced response'],
    domains: satMathDomains,
  }),
  'ap:ap-chemistry': Object.freeze({
    examId: 'ap',
    examLabel: 'AP',
    subjectId: 'ap-chemistry',
    label: 'AP Chemistry',
    keywords: ['ap chemistry', 'ap chem', 'multiple choice', 'free response', 'frq', 'laboratory'],
    domains: apChemistryTutorDomains,
  }),
  'sat:sat-reading-writing': Object.freeze({
    examId: 'sat', examLabel: 'SAT', subjectId: 'sat-reading-writing', label: 'SAT Reading & Writing', general: true,
    summary: 'Reading comprehension, grammar, and revision skills through short passages and focused multiple-choice questions.',
    keywords: ['sat reading', 'sat writing', 'grammar', 'reading comprehension'], domains: [],
  }),
  'ap:ap-lang-comp': Object.freeze({
    examId: 'ap', examLabel: 'AP', subjectId: 'ap-lang-comp', label: 'AP Lang & Composition', general: true,
    summary: 'Rhetorical analysis, synthesis, argument writing, and reading comprehension.',
    keywords: ['ap language', 'rhetorical analysis', 'synthesis', 'argument'], domains: [],
  }),
  'ap:ap-us-history': Object.freeze({
    examId: 'ap', examLabel: 'AP', subjectId: 'ap-us-history', label: 'AP US History', general: true,
    summary: 'Historical thinking, document analysis, and argument writing across United States history.',
    keywords: ['apush', 'us history', 'dbq', 'historical thinking'], domains: [],
  }),
  'ap:ap-biology': Object.freeze({
    examId: 'ap', examLabel: 'AP', subjectId: 'ap-biology', label: 'AP Biology', general: true,
    summary: 'Molecules, cells, genetics, evolution, ecology, scientific reasoning, and data interpretation.',
    keywords: ['ap biology', 'cells', 'genetics', 'evolution', 'ecology'], domains: [],
  }),
  'ap:ap-calculus': Object.freeze({
    examId: 'ap', examLabel: 'AP', subjectId: 'ap-calculus', label: 'AP Calculus', general: true,
    summary: 'Limits, derivatives, integrals, and applications of calculus.',
    keywords: ['ap calculus', 'limits', 'derivatives', 'integrals'], domains: [],
  }),
  'ap:ap-physics': Object.freeze({
    examId: 'ap', examLabel: 'AP', subjectId: 'ap-physics', label: 'AP Physics', general: true,
    summary: 'Mechanics, electricity, waves, energy transfer, quantitative problem-solving, and conceptual reasoning.',
    keywords: ['ap physics', 'mechanics', 'electricity', 'waves', 'energy'], domains: [],
  }),
  'ap:ap-government': Object.freeze({
    examId: 'ap', examLabel: 'AP', subjectId: 'ap-government', label: 'AP Government & Politics', general: true,
    summary: 'United States political institutions, constitutional principles, public policy, and political behavior.',
    keywords: ['ap government', 'politics', 'constitution', 'public policy'], domains: [],
  }),
  'ap:ap-literature': Object.freeze({
    examId: 'ap', examLabel: 'AP', subjectId: 'ap-literature', label: 'AP Literature', general: true,
    summary: 'Close reading, interpretation, and literary analysis through prose, poetry, and essay writing.',
    keywords: ['ap literature', 'close reading', 'poetry', 'literary analysis'], domains: [],
  }),
})

function subjectKey(target = {}) {
  return `${target.examId}:${target.subjectId}`
}

function inferredScope(target = {}) {
  if (target.scope) return target.scope
  if (target.skillId) return 'skill'
  if (target.domainId) return 'domain'
  return 'subject'
}

export function resolveTutorTarget(target = {}) {
  const subject = tutorSubjects[subjectKey(target)]
  if (!subject) return null
  const scope = inferredScope(target)
  if (!['skill', 'domain', 'subject'].includes(scope)) return null
  if (scope === 'subject') {
    return { scope, examId: subject.examId, subjectId: subject.subjectId }
  }
  const domain = subject.domains.find((item) => item.id === target.domainId)
  if (!domain) return null
  if (scope === 'domain') {
    return { scope, examId: subject.examId, subjectId: subject.subjectId, domainId: domain.id }
  }
  const skill = domain.skills.find((item) => item[0] === target.skillId)
  if (!skill) return null
  return {
    scope,
    examId: subject.examId,
    subjectId: subject.subjectId,
    domainId: domain.id,
    skillId: skill[0],
  }
}

export function getTutorScopeDetails(target) {
  const canonical = resolveTutorTarget(target)
  if (!canonical) return null
  const subject = tutorSubjects[subjectKey(canonical)]
  const domain = canonical.domainId ? subject.domains.find((item) => item.id === canonical.domainId) : null
  const skill = canonical.skillId ? domain?.skills.find((item) => item[0] === canonical.skillId) : null
  return {
    target: canonical,
    subject,
    domain,
    skill: skill ? { id: skill[0], label: skill[1], keywords: skill[2] } : null,
    label: skill?.[1] || domain?.label || subject.label,
  }
}

function includesPhrase(text, phrase) {
  const normalizedPhrase = phrase.toLowerCase().trim()
  if (!normalizedPhrase) return false
  let start = text.indexOf(normalizedPhrase)
  while (start >= 0) {
    const end = start + normalizedPhrase.length
    const requiresLeftBoundary = /[a-z0-9]/.test(normalizedPhrase[0])
    const requiresRightBoundary = /[a-z0-9]/.test(normalizedPhrase.at(-1))
    const hasLeftBoundary = start === 0 || !/[a-z0-9]/.test(text[start - 1])
    const hasRightBoundary = end === text.length || !/[a-z0-9]/.test(text[end])
    if ((!requiresLeftBoundary || hasLeftBoundary) && (!requiresRightBoundary || hasRightBoundary)) return true
    start = text.indexOf(normalizedPhrase, start + 1)
  }
  return false
}

function scoreKeywords(text, keywords) {
  return keywords.reduce((score, keyword) => score + (includesPhrase(text, keyword) ? Math.max(1, keyword.split(/\s+/).length) : 0), 0)
}

function targetsEqual(left, right) {
  return left.scope === right.scope
    && left.examId === right.examId
    && left.subjectId === right.subjectId
    && left.domainId === right.domainId
    && left.skillId === right.skillId
}

function isConversationalFollowUp(text) {
  return /^(why|how|can you|could you|show me|explain that|what about|another way|is that|does that)\b/.test(text)
}

export function resolveEffectiveTutorTarget(initialTarget, message, history = []) {
  const initial = resolveTutorTarget(initialTarget)
  const details = getTutorScopeDetails(initial)
  if (!initial || !details) return null
  const text = String(message || '').trim().toLowerCase()
  if (!text) return null

  if (isConversationalFollowUp(text) && history.length) {
    return { target: initial, classification: 'same-scope', scopeNotice: '' }
  }

  if (/\b(entire|whole|full)\s+(test|exam|subject)\b|\bstudy plan\b|\btest strategy\b|\boverall review\b/.test(text)) {
    const target = { scope: 'subject', examId: initial.examId, subjectId: initial.subjectId }
    return {
      target,
      classification: targetsEqual(initial, target) ? 'same-scope' : 'broadened',
      scopeNotice: targetsEqual(initial, target) ? '' : `I widened the tutoring scope to the entire ${details.subject.label}.`,
    }
  }

  let best = null
  for (const domain of details.subject.domains) {
    const domainScore = scoreKeywords(text, [domain.label, domain.id, ...domain.keywords])
    if (domainScore > (best?.score || 0)) {
      best = { score: domainScore, target: { scope: 'domain', examId: initial.examId, subjectId: initial.subjectId, domainId: domain.id }, label: domain.label }
    }
    for (const [skillId, skillLabel, skillKeywords] of domain.skills) {
      const skillScore = scoreKeywords(text, [skillLabel, skillId, ...skillKeywords])
      if (skillScore > (best?.score || 0) || (skillScore > 0 && skillScore === best?.score && best.target.scope === 'domain')) {
        best = {
          score: skillScore,
          target: { scope: 'skill', examId: initial.examId, subjectId: initial.subjectId, domainId: domain.id, skillId },
          label: skillLabel,
        }
      }
    }
  }

  if (best?.score) {
    const same = targetsEqual(initial, best.target)
    return {
      target: best.target,
      classification: same ? 'same-scope' : 'adjusted-within-subject',
      scopeNotice: same ? '' : `This question fits ${best.label}, so I adjusted the tutoring scope for this response.`,
    }
  }

  if (initial.scope === 'subject') return { target: initial, classification: 'same-scope', scopeNotice: '' }
  return {
    target: { scope: 'subject', examId: initial.examId, subjectId: initial.subjectId },
    classification: 'broadened',
    scopeNotice: `I widened the tutoring scope to the entire ${details.subject.label} so I can address a question beyond the selected ${initial.scope}.`,
  }
}
