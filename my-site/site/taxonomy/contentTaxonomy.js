export const TAXONOMY_VERSION = 1
export const TUTOR_ENABLED_SKILL_ID = 'linear-equations-one-variable'

export const questionTypes = [
  { id: 'multiple-choice', label: 'Multiple Choice', renderer: 'multiple-choice' },
  { id: 'student-produced-response', label: 'Student-Produced Response', renderer: 'grid-in' },
  { id: 'free-response', label: 'Free Response', renderer: 'free-response' },
]

export const answeringMethods = [
  { id: 'select-option', label: 'Select an option' },
  { id: 'enter-answer', label: 'Enter an answer' },
  { id: 'write-response', label: 'Write a response' },
]

const satMathDomains = [
  {
    id: 'algebra', label: 'Algebra', order: 1,
    description: 'Build and interpret linear equations, inequalities, systems, and functions.',
    skills: [
      ['linear-equations-one-variable', 'Linear equations in one variable', 'Solve equations and interpret their solutions in context.'],
      ['linear-functions', 'Linear functions', 'Connect linear graphs, tables, equations, slopes, and intercepts.'],
      ['linear-equations-two-variables', 'Linear equations in two variables', 'Represent relationships between two variables with lines.'],
      ['systems-linear-equations', 'Systems of two linear equations', 'Solve and interpret where two linear relationships meet.'],
      ['linear-inequalities', 'Linear inequalities', 'Solve and graph inequalities in one or two variables.'],
    ],
  },
  {
    id: 'advanced-math', label: 'Advanced Math', order: 2,
    description: 'Work with nonlinear expressions, equations, systems, and functions.',
    skills: [
      ['equivalent-expressions', 'Equivalent expressions', 'Rewrite expressions using structure, factoring, and exponent rules.'],
      ['nonlinear-equations-one-variable', 'Nonlinear equations in one variable', 'Solve quadratic, radical, rational, and other nonlinear equations.'],
      ['systems-linear-nonlinear', 'Systems of linear and nonlinear equations', 'Find solutions shared by linear and nonlinear relationships.'],
      ['nonlinear-functions', 'Nonlinear functions', 'Analyze quadratic, exponential, polynomial, and rational functions.'],
    ],
  },
  {
    id: 'problem-solving-data-analysis', label: 'Problem-Solving and Data Analysis', order: 3,
    description: 'Use ratios, percentages, statistics, and probability to reason with real-world data.',
    skills: [
      ['ratios-rates-proportions-units', 'Ratios, rates, proportions, and units', 'Solve proportional relationships and convert between units.'],
      ['percentages', 'Percentages', 'Calculate and interpret percent change, discounts, and growth.'],
      ['one-variable-data', 'One-variable data', 'Summarize distributions using center, spread, and shape.'],
      ['two-variable-data', 'Two-variable data', 'Interpret scatterplots, associations, and models between variables.'],
      ['probability-conditional-probability', 'Probability and conditional probability', 'Find probabilities, including outcomes under given conditions.'],
      ['inference-sample-statistics', 'Inference from sample statistics', 'Use representative samples to estimate population values.'],
      ['evaluating-statistical-claims', 'Evaluating statistical claims', 'Judge conclusions from studies, surveys, and experiments.'],
    ],
  },
  {
    id: 'geometry-trigonometry', label: 'Geometry and Trigonometry', order: 4,
    description: 'Apply geometric measurement, angle relationships, circles, and trigonometry.',
    skills: [
      ['area-volume', 'Area and volume', 'Calculate and reason about measurements of two- and three-dimensional figures.'],
      ['lines-angles-triangles', 'Lines, angles, and triangles', 'Use angle rules, congruence, similarity, and triangle properties.'],
      ['right-triangles-trigonometry', 'Right triangles and trigonometry', 'Apply the Pythagorean theorem and trigonometric ratios.'],
      ['circles', 'Circles', 'Work with circle equations, arcs, angles, and measurements.'],
    ],
  },
].map((domain) => ({
  ...domain,
  skills: domain.skills.map(([id, label, description], index) => ({
    id, label, description, order: index + 1, domainId: domain.id,
    tutorEnabled: id === TUTOR_ENABLED_SKILL_ID,
  })),
}))

export const exams = [
  {
    id: 'sat', label: 'SAT', provider: 'college-board',
    subjects: [{
      id: 'sat-math', label: 'Math', routeSlug: 'sat-math',
      domains: satMathDomains,
      questionTypeIds: ['multiple-choice', 'student-produced-response'],
      answeringMethodIds: ['select-option', 'enter-answer'],
    }],
  },
]

export function getSubject(subjectId) {
  for (const exam of exams) {
    const subject = exam.subjects.find((item) => item.id === subjectId)
    if (subject) return { ...subject, examId: exam.id }
  }
  return null
}

export function getDomain(subjectId, domainId) {
  return getSubject(subjectId)?.domains.find((domain) => domain.id === domainId) || null
}

export function getSkill(subjectId, skillId) {
  return getSubject(subjectId)?.domains.flatMap((domain) => domain.skills).find((skill) => skill.id === skillId) || null
}

export function getQuestionType(typeId) {
  return questionTypes.find((type) => type.id === typeId) || null
}

export function resolveSubjectLocation(subjectId, { domainId = null, skillId = null } = {}) {
  const subject = getSubject(subjectId)
  if (!subject) return { status: 'invalid-subject', subject: null, domain: null, skill: null }
  const skill = skillId ? getSkill(subjectId, skillId) : null
  const resolvedDomainId = domainId || skill?.domainId || null
  const domain = resolvedDomainId ? getDomain(subjectId, resolvedDomainId) : null
  if ((domainId && !domain) || (skillId && !skill) || (skill && domain?.id !== skill.domainId)) {
    return { status: 'invalid-target', subject, domain: null, skill: null }
  }
  return { status: 'valid', subject, domain, skill }
}

export function createSkillBrowserUrl(subjectId, skillId) {
  const skill = getSkill(subjectId, skillId)
  if (!skill) return null
  return `/topics.html?topic=${encodeURIComponent(subjectId)}&domain=${encodeURIComponent(skill.domainId)}&skill=${encodeURIComponent(skill.id)}`
}

export function createSkillPracticeUrl(subjectId, skillId) {
  const skill = getSkill(subjectId, skillId)
  if (!skill) return null
  return `/questions.html?topic=${encodeURIComponent(subjectId)}&domain=${encodeURIComponent(skill.domainId)}&skill=${encodeURIComponent(skill.id)}`
}

export function createSkillChatUrl(subjectId, skillId) {
  const subject = getSubject(subjectId)
  const skill = getSkill(subjectId, skillId)
  if (!subject || !skill?.tutorEnabled) return null
  return `/chat.html?exam=${encodeURIComponent(subject.examId)}&topic=${encodeURIComponent(subjectId)}&domain=${encodeURIComponent(skill.domainId)}&skill=${encodeURIComponent(skill.id)}`
}

export function getPracticeFilters(subjectId, { domainId = null, skillId = null } = {}) {
  const target = resolveSubjectLocation(subjectId, { domainId, skillId })
  if (target.status !== 'valid') return {}
  return {
    ...(target.domain ? { domain: [target.domain.id] } : {}),
    ...(target.skill ? { skill: [target.skill.id] } : {}),
  }
}

export function createContextTarget({ examId, subjectId, domainId, skillId }) {
  const subject = getSubject(subjectId)
  if (!subject || subject.examId !== examId) return null
  if (!domainId) return { level: 'subject', examId, subjectId }
  const domain = getDomain(subjectId, domainId)
  if (!domain) return null
  if (!skillId) return { level: 'domain', examId, subjectId, domainId }
  const skill = getSkill(subjectId, skillId)
  return skill?.domainId === domainId
    ? { level: 'skill', examId, subjectId, domainId, skillId }
    : null
}

export function createSubjectFilters(subjectId) {
  const subject = getSubject(subjectId)
  if (!subject) return []
  return [
    {
      id: 'questionType', label: 'Question type', selection: 'multi',
      options: subject.questionTypeIds.map(getQuestionType),
    },
    {
      id: 'domain', label: 'Domain', selection: 'multi', reporting: true,
      options: subject.domains.map(({ id, label }) => ({ id, label })),
    },
    {
      id: 'skill', label: 'Skill', selection: 'multi',
      visibleWhen: { groupId: 'domain', hasSelection: true },
      options: subject.domains.flatMap((domain) => domain.skills.map(({ id, label }) => ({
        id, label, parentId: domain.id,
      }))),
    },
  ]
}

export function validateQuestionTaxonomy(question) {
  const { taxonomy, source } = question
  if (!taxonomy || !source) return false
  const target = createContextTarget(taxonomy)
  return Boolean(
    target?.level === 'skill'
    && getQuestionType(taxonomy.questionTypeId)
    && answeringMethods.some((method) => method.id === taxonomy.answeringMethodId)
    && ['official', 'ai-generated', 'editorial', 'third-party'].includes(source.kind)
    && source.name,
  )
}
