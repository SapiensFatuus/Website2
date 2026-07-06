import { TAXONOMY_VERSION, getQuestionType } from '../taxonomy/contentTaxonomy.js'

const legacyDemoQuestions = [
  {
    id: 'sat-math-geometry-001',
    topic: 'sat-math',
    type: 'multiple-choice',
    material: 'Geometry',
    prompt: 'How many sides does a square have?',
    options: [
      { id: 'a', text: 'Three' },
      { id: 'b', text: 'Four' },
      { id: 'c', text: 'Five' },
      { id: 'd', text: 'Six' },
    ],
    correctOptionId: 'b',
    explanation: 'A square is a quadrilateral, so it has four sides.',
  },
  {
    id: 'sat-math-geometry-002',
    topic: 'sat-math',
    type: 'multiple-choice',
    material: 'Geometry',
    prompt: 'Which shape has exactly three sides?',
    options: [
      { id: 'a', text: 'Circle' },
      { id: 'b', text: 'Rectangle' },
      { id: 'c', text: 'Triangle' },
      { id: 'd', text: 'Pentagon' },
    ],
    correctOptionId: 'c',
    explanation: 'A triangle is defined as a polygon with three sides.',
  },
  {
    id: 'sat-math-geometry-003',
    topic: 'sat-math',
    type: 'multiple-choice',
    material: 'Geometry',
    prompt: 'How many degrees are in a right angle?',
    options: [
      { id: 'a', text: '45 degrees' },
      { id: 'b', text: '90 degrees' },
      { id: 'c', text: '180 degrees' },
      { id: 'd', text: '360 degrees' },
    ],
    correctOptionId: 'b',
    explanation: 'A right angle measures exactly 90 degrees.',
  },
  {
    id: 'sat-math-algebra-001',
    topic: 'sat-math',
    type: 'multiple-choice',
    material: 'Algebra',
    prompt: 'If x + 2 = 5, what is x?',
    options: [
      { id: 'a', text: '2' },
      { id: 'b', text: '3' },
      { id: 'c', text: '5' },
      { id: 'd', text: '7' },
    ],
    correctOptionId: 'b',
    explanation: 'Subtract 2 from both sides: x = 5 - 2 = 3.',
  },
  {
    id: 'sat-math-algebra-002',
    topic: 'sat-math',
    type: 'multiple-choice',
    material: 'Algebra',
    prompt: 'What is 2 multiplied by 4?',
    options: [
      { id: 'a', text: '6' },
      { id: 'b', text: '8' },
      { id: 'c', text: '10' },
      { id: 'd', text: '12' },
    ],
    correctOptionId: 'b',
    explanation: 'Two groups of four contain eight items in total.',
  },
  {
    id: 'sat-math-algebra-003',
    topic: 'sat-math',
    type: 'multiple-choice',
    material: 'Algebra',
    prompt: 'Which expression is equal to 10?',
    options: [
      { id: 'a', text: '3 + 4' },
      { id: 'b', text: '5 + 5' },
      { id: 'c', text: '12 - 1' },
      { id: 'd', text: '2 × 6' },
    ],
    correctOptionId: 'b',
    explanation: 'Five plus five equals ten.',
  },
  {
    id: 'sat-math-statistics-001',
    topic: 'sat-math',
    type: 'multiple-choice',
    material: 'Statistics',
    prompt: 'What is the average of 2 and 4?',
    options: [
      { id: 'a', text: '2' },
      { id: 'b', text: '3' },
      { id: 'c', text: '4' },
      { id: 'd', text: '6' },
    ],
    correctOptionId: 'b',
    explanation: 'Add the values and divide by two: (2 + 4) ÷ 2 = 3.',
  },
  {
    id: 'sat-math-statistics-002',
    topic: 'sat-math',
    type: 'multiple-choice',
    material: 'Statistics',
    prompt: 'In the list 1, 2, 2, 3, which number appears most often?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: 'All appear equally' },
    ],
    correctOptionId: 'b',
    explanation: 'The number 2 appears twice, more often than any other value.',
  },
  {
    id: 'sat-math-statistics-003',
    topic: 'sat-math',
    type: 'multiple-choice',
    material: 'Statistics',
    prompt: 'A coin has two equally likely sides. What is the chance of heads?',
    options: [
      { id: 'a', text: '0%' },
      { id: 'b', text: '25%' },
      { id: 'c', text: '50%' },
      { id: 'd', text: '100%' },
    ],
    correctOptionId: 'c',
    explanation: 'One of the coin’s two equally likely outcomes is heads, so the probability is 1/2 or 50%.',
  },
  {
    id: 'sat-math-grid-in-algebra-001',
    topic: 'sat-math',
    type: 'grid-in',
    material: 'Algebra',
    prompt: 'If 3x + 5 = 20, what is the value of x?',
    correctAnswer: '5',
    explanation: 'Subtract 5 from both sides to get 3x = 15, then divide by 3. The value of x is 5.',
  },
  {
    id: 'sat-math-grid-in-geometry-001',
    topic: 'sat-math',
    type: 'grid-in',
    material: 'Geometry',
    prompt: 'A rectangle has a length of 8 and a width of 3. What is its area?',
    correctAnswer: '24',
    explanation: 'The area of a rectangle is length times width: 8 times 3 equals 24.',
  },
  {
    id: 'ap-chemistry-mc-atomic-structure-001',
    topic: 'ap-chemistry',
    type: 'multiple-choice',
    material: 'Atomic Structure',
    prompt: 'Which subatomic particle determines the identity of an element?',
    options: [
      { id: 'a', text: 'Electron' },
      { id: 'b', text: 'Neutron' },
      { id: 'c', text: 'Proton' },
      { id: 'd', text: 'Photon' },
    ],
    correctOptionId: 'c',
    explanation: 'An element is defined by its number of protons, also called its atomic number.',
  },
  {
    id: 'ap-chemistry-frq-reactions-001',
    topic: 'ap-chemistry',
    type: 'free-response',
    material: 'Reactions',
    responseFormat: 'essay',
    prompt: 'Explain, at the particle level, why increasing the concentration of a reactant can increase the initial reaction rate.',
    placeholderGrading: 'always-incorrect',
    explanation: 'Free-response grading is not available yet. Your response was saved and is shown below for review.',
  },
  {
    id: 'ap-chemistry-frq-equilibrium-001',
    topic: 'ap-chemistry',
    type: 'free-response',
    material: 'Equilibrium',
    responseFormat: 'essay',
    prompt: 'A system at equilibrium is disturbed by adding more reactant. Describe how the system responds and justify your answer using Le Chatelier\'s principle.',
    placeholderGrading: 'always-incorrect',
    explanation: 'Free-response grading is not available yet. Your response was saved and is shown below for review.',
  },
  {
    id: 'ap-chemistry-frq-grid-in-001',
    topic: 'ap-chemistry',
    renderer: 'grid-in',
    prompt: 'A 2.0 mol sample of an ideal gas occupies 10.0 L. What is the molar concentration of the gas, in mol/L?',
    correctAnswer: '0.2',
    explanation: 'Molar concentration is moles divided by volume: 2.0 mol divided by 10.0 L equals 0.2 mol/L.',
    classifications: {
      questionType: ['free-response'],
      responseFormat: ['grid-in'],
      material: ['thermodynamics'],
    },
  },
]

export const SUPPORTED_RENDERERS = new Set(['multiple-choice', 'grid-in', 'free-response'])

const satMathClassification = {
  'sat-math-geometry-001': ['geometry-trigonometry', 'lines-angles-triangles'],
  'sat-math-geometry-002': ['geometry-trigonometry', 'lines-angles-triangles'],
  'sat-math-geometry-003': ['geometry-trigonometry', 'lines-angles-triangles'],
  'sat-math-algebra-001': ['algebra', 'linear-equations-one-variable'],
  'sat-math-algebra-002': ['algebra', 'linear-equations-one-variable'],
  'sat-math-algebra-003': ['advanced-math', 'equivalent-expressions'],
  'sat-math-statistics-001': ['problem-solving-data-analysis', 'one-variable-data'],
  'sat-math-statistics-002': ['problem-solving-data-analysis', 'one-variable-data'],
  'sat-math-statistics-003': ['problem-solving-data-analysis', 'probability-conditional-probability'],
  'sat-math-grid-in-algebra-001': ['algebra', 'linear-equations-one-variable'],
  'sat-math-grid-in-geometry-001': ['geometry-trigonometry', 'area-volume'],
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function normalizeQuestion(question) {
  if (question.renderer && question.classifications) return question
  const { type = 'multiple-choice', material = 'Unknown', responseFormat, ...rest } = question
  if (question.topic === 'sat-math') {
    const [domainId, skillId] = satMathClassification[question.id]
    const questionTypeId = type === 'grid-in' ? 'student-produced-response' : type
    return {
      ...rest,
      renderer: getQuestionType(questionTypeId).renderer,
      taxonomy: {
        version: TAXONOMY_VERSION, examId: 'sat', subjectId: 'sat-math', domainId, skillId,
        questionTypeId, answeringMethodId: type === 'grid-in' ? 'enter-answer' : 'select-option',
      },
      source: { kind: 'ai-generated', name: 'Study Website', externalId: null },
      classifications: {
        questionType: [questionTypeId], domain: [domainId], skill: [skillId],
      },
    }
  }
  return {
    ...rest,
    renderer: type,
    classifications: {
      questionType: [type],
      material: [slugify(material)],
      ...(responseFormat ? { responseFormat: [responseFormat] } : {}),
    },
  }
}

export const demoQuestions = legacyDemoQuestions.map(normalizeQuestion)

export function isFilterGroupVisible(group, selections = {}) {
  if (!group.visibleWhen) return true
  const selected = selections[group.visibleWhen.groupId] || []
  if (group.visibleWhen.hasSelection) return selected.length > 0
  return group.visibleWhen.includesAny.some((value) => selected.includes(value))
}

export function sanitizeFilterSelections(topic, selections = {}) {
  const sanitized = { ...selections }
  topic.questionFilters.forEach((group) => {
    if (!isFilterGroupVisible(group, sanitized)) delete sanitized[group.id]
  })
  return sanitized
}

export function matchesFilters(question, filters = {}, excludedGroupId = null) {
  return Object.entries(filters).every(([groupId, selected]) => (
    groupId === excludedGroupId
    || !selected?.length
    || selected.some((value) => question.classifications[groupId]?.includes(value))
  ))
}

export function getQuestions({ topic, filters = {}, type, materials = [] }) {
  const normalizedType = type === 'grid-in' ? 'student-produced-response' : type
  const satDomainAliases = {
    geometry: 'geometry-trigonometry', statistics: 'problem-solving-data-analysis',
    'advanced-math': 'advanced-math', algebra: 'algebra',
  }
  const normalizedFilters = Object.keys(filters).length
    ? filters
    : {
        ...(normalizedType ? { questionType: [normalizedType] } : {}),
        ...(materials.length ? {
          [topic === 'sat-math' ? 'domain' : 'material']: materials.map(slugify).map((id) => (
            topic === 'sat-math' ? satDomainAliases[id] || id : id
          )),
        } : {}),
      }
  return demoQuestions.filter((question) => (
    question.topic === topic
    && SUPPORTED_RENDERERS.has(question.renderer)
    && matchesFilters(question, normalizedFilters)
  ))
}

export function getAvailableFilterGroups(topic, selections = {}) {
  const sanitized = sanitizeFilterSelections(topic, selections)
  const topicQuestions = demoQuestions.filter((question) => (
    question.topic === topic.slug && SUPPORTED_RENDERERS.has(question.renderer)
  ))

  return topic.questionFilters
    .filter((group) => isFilterGroupVisible(group, sanitized))
    .map((group) => ({
      ...group,
      options: group.options.filter((option) => (
        (!option.renderer || SUPPORTED_RENDERERS.has(option.renderer))
        && (!option.parentId || sanitized.domain?.includes(option.parentId))
        && (
          sanitized[group.id]?.includes(option.id)
          || topicQuestions.some((question) => (
            question.classifications[group.id]?.includes(option.id)
            && matchesFilters(question, sanitized, group.id)
          ))
        )
      )),
    }))
    .filter((group) => group.options.length)
}

export function reconcileFilterSelections(topic, selections = {}) {
  let reconciled = sanitizeFilterSelections(topic, selections)

  topic.questionFilters.forEach((group) => {
    const configuredIds = new Set(group.options.map((option) => option.id))
    const selected = (reconciled[group.id] || []).filter((value) => configuredIds.has(value))
    if (selected.length) reconciled[group.id] = group.selection === 'single' ? [selected[0]] : selected
    else delete reconciled[group.id]
  })

  for (let pass = 0; pass < 2; pass += 1) {
    const groups = getAvailableFilterGroups(topic, reconciled)
    const visibleGroupIds = new Set(groups.map((group) => group.id))
    Object.keys(reconciled).forEach((groupId) => {
      if (!visibleGroupIds.has(groupId)) delete reconciled[groupId]
    })
    groups.forEach((group) => {
      const availableIds = new Set(group.options.map((option) => option.id))
      const selected = (reconciled[group.id] || []).filter((value) => availableIds.has(value))
      if (selected.length) reconciled[group.id] = group.selection === 'single' ? [selected[0]] : selected
      else delete reconciled[group.id]
    })
    reconciled = sanitizeFilterSelections(topic, reconciled)
  }

  return reconciled
}

export function getDefaultFilterSelections(topic) {
  const selections = {}
  getAvailableFilterGroups(topic, selections).forEach((group) => {
    if (group.selection === 'single' && group.options.length === 1) {
      selections[group.id] = [group.options[0].id]
    }
  })
  return selections
}

export function getReportingGroup(topic) {
  return topic.questionFilters.find((group) => group.reporting) || null
}

export function getFilterOptionLabel(topic, groupId, optionId) {
  const group = topic.questionFilters.find((item) => item.id === groupId)
  return group?.options.find((option) => option.id === optionId)?.label || optionId
}

export function getAvailableMaterials(topic, type = 'multiple-choice') {
  return [...new Set(
    demoQuestions
      .filter((question) => question.topic === topic && (
        question.classifications.questionType.includes(type)
        || (type === 'grid-in' && question.renderer === 'grid-in')
      ))
      .flatMap((question) => question.classifications.material || question.classifications.domain || []),
  )].sort()
}

export function getQuestionsByIds(ids) {
  const questionsById = new Map(demoQuestions.map((question) => [question.id, question]))
  return ids.map((id) => questionsById.get(id)).filter(Boolean)
}
