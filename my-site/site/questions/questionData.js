import { canonicalPracticeQuestions } from './catalog/index.js'
import { legacyApChemistryPracticeQuestions } from './legacy/apChemistryAdapter.js'

export const SUPPORTED_RENDERERS = new Set(['multiple-choice', 'grid-in', 'free-response'])

// Compatibility export for the existing practice engine. SAT Math records come
// from the validated canonical catalog; only AP Chemistry uses the legacy adapter.
export const demoQuestions = Object.freeze([
  ...canonicalPracticeQuestions,
  ...legacyApChemistryPracticeQuestions,
])

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

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

export function matchesFilters(question, filters = {}, excludedGroupId = null, filterGroups = []) {
  return Object.entries(filters).every(([groupId, selected]) => {
    const group = filterGroups.find((item) => item.id === groupId)
    const appliesTo = group?.appliesTo
    const appliesToQuestion = !appliesTo || appliesTo.includesAny.some((value) => (
      question.classifications[appliesTo.groupId]?.includes(value)
    ))

    return groupId === excludedGroupId
      || !selected?.length
      || !appliesToQuestion
      || selected.some((value) => question.classifications[groupId]?.includes(value))
  })
}

export function getQuestions({ topic, filters = {}, type, materials = [], filterGroups = [] }) {
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
    && matchesFilters(question, normalizedFilters, null, filterGroups)
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
          option.showWhenEmpty
          ||
          sanitized[group.id]?.includes(option.id)
          || topicQuestions.some((question) => (
            question.classifications[group.id]?.includes(option.id)
            && matchesFilters(question, sanitized, group.id, topic.questionFilters)
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
