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

const apChemistryDomains = [
  ['atomic-structure', 'Atomic Structure and Properties', ['atom', 'atomic structure', 'electron', 'periodic', 'mole', 'mass spectrum']],
  ['bonding', 'Molecular and Ionic Compound Structure and Properties', ['bond', 'lewis', 'molecular geometry', 'ionic', 'covalent', 'intermolecular']],
  ['reactions', 'Chemical Reactions', ['reaction', 'stoichiometry', 'titration', 'net ionic', 'precipitation', 'redox']],
  ['kinetics', 'Kinetics', ['kinetics', 'reaction rate', 'rate law', 'activation energy', 'mechanism']],
  ['thermodynamics', 'Thermodynamics', ['thermodynamics', 'enthalpy', 'entropy', 'gibbs', 'calorimetry', 'heat']],
  ['equilibrium', 'Equilibrium', ['equilibrium', 'le chatelier', 'equilibrium constant', 'reaction quotient', 'ksp']],
  ['acids-bases', 'Acids and Bases', ['acid', 'base', 'ph', 'pka', 'buffer', 'neutralization']],
  ['applications', 'Applications of Thermodynamics', ['electrochemistry', 'galvanic', 'electrolytic', 'free energy', 'cell potential']],
].map(([id, label, keywords]) => ({ id, label, keywords, skills: [] }))

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
    domains: apChemistryDomains,
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
  return text.includes(phrase.toLowerCase())
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
