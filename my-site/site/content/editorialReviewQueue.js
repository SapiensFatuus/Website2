import { EDITORIAL_CHECKLIST, findSimilarInternalDrafts } from './editorialPipeline.js'

const PRIORITY = Object.freeze({
  'free-response': 0,
  'frq-exemplars': 1,
  rubric: 2,
  stimulus: 3,
  'multiple-choice': 4,
  lesson: 5,
  formula: 6,
})

function countBy(items, select) {
  const counts = new Map()
  items.forEach((item) => {
    const key = select(item)
    counts.set(key, (counts.get(key) || 0) + 1)
  })
  return Object.freeze([...counts].sort(([left], [right]) => left.localeCompare(right)).map(([id, count]) => Object.freeze({ id, count })))
}

function checklist() {
  return Object.freeze(EDITORIAL_CHECKLIST.map(({ id, owner, prompt }) => Object.freeze({ id, owner, prompt, status: 'pending' })))
}

export function createEditorialReviewQueue({
  questions = [],
  resources = [],
  exemplars = [],
  similarityThreshold = 0.45,
} = {}) {
  const similarityCandidates = [
    ...questions.map((question) => ({
      id: question.id,
      text: [question.prompt, ...(question.answer?.options || []).map(({ text }) => text), question.explanation].join(' '),
    })),
    ...exemplars.map((record) => ({
      id: record.id,
      text: record.responses.map(({ response, feedback }) => `${response} ${feedback}`).join(' '),
    })),
  ]
  const similarityFlags = findSimilarInternalDrafts(similarityCandidates, { threshold: similarityThreshold })
  const flagsById = new Map()
  similarityFlags.forEach((flag) => {
    flagsById.set(flag.leftId, [...(flagsById.get(flag.leftId) || []), flag])
    flagsById.set(flag.rightId, [...(flagsById.get(flag.rightId) || []), flag])
  })

  const questionItems = questions.map((question) => Object.freeze({
    id: question.id,
    itemType: 'question',
    format: question.renderer,
    responseFormat: question.responseFormat || null,
    title: question.prompt,
    status: question.content?.status || 'draft',
    authoredBy: question.content?.authoredBy || 'unknown',
    updatedAt: question.content?.updatedAt || null,
    revision: question.content?.revision || null,
    reviewerIds: Object.freeze([...(question.content?.reviewers || [])]),
    topicIds: Object.freeze([question.taxonomy.skillId]),
    sciencePracticeIds: Object.freeze([...(question.taxonomy.sciencePracticeIds || [])]),
    checklist: checklist(),
    similarityFlags: Object.freeze([...(flagsById.get(question.id) || [])]),
    priority: PRIORITY[question.renderer] ?? 99,
  }))
  const resourceItems = resources.map((resource) => Object.freeze({
    id: resource.id,
    itemType: 'resource',
    format: resource.kind,
    responseFormat: null,
    title: resource.title,
    status: resource.review?.status || 'draft',
    authoredBy: resource.review?.authoredBy || 'unknown',
    updatedAt: resource.review?.updatedAt || null,
    revision: resource.review?.revision || null,
    reviewerIds: Object.freeze([...(resource.review?.reviewers || [])]),
    topicIds: Object.freeze([...(resource.alignment?.skillIds || [])]),
    sciencePracticeIds: Object.freeze([...(resource.alignment?.sciencePracticeIds || [])]),
    checklist: checklist(),
    similarityFlags: Object.freeze([]),
    priority: PRIORITY[resource.kind] ?? 99,
  }))
  const exemplarItems = exemplars.map((record) => Object.freeze({
    id: record.id,
    itemType: 'exemplar',
    format: 'frq-exemplars',
    responseFormat: null,
    title: record.title,
    status: record.review?.status || 'draft',
    authoredBy: record.review?.authoredBy || 'unknown',
    updatedAt: record.review?.updatedAt || null,
    revision: record.review?.revision || null,
    reviewerIds: Object.freeze([...(record.review?.reviewers || [])]),
    topicIds: Object.freeze([...(record.alignment?.skillIds || [])]),
    sciencePracticeIds: Object.freeze([...(record.alignment?.sciencePracticeIds || [])]),
    checklist: checklist(),
    similarityFlags: Object.freeze([...(flagsById.get(record.id) || [])]),
    priority: PRIORITY['frq-exemplars'],
  }))
  const items = [...questionItems, ...resourceItems, ...exemplarItems]
  const ids = new Set()
  items.forEach(({ id }) => {
    if (ids.has(id)) throw new Error(`Duplicate editorial review item: ${id}`)
    ids.add(id)
  })
  items.sort((left, right) => left.priority - right.priority || left.id.localeCompare(right.id))

  return Object.freeze({
    itemCount: items.length,
    questionCount: questionItems.length,
    resourceCount: resourceItems.length,
    exemplarCount: exemplarItems.length,
    pendingChecklistCount: items.length * EDITORIAL_CHECKLIST.length,
    statusCounts: countBy(items, (item) => item.status),
    formatCounts: countBy(items, (item) => item.responseFormat || item.format),
    similarityFlags: Object.freeze(similarityFlags),
    items: Object.freeze(items),
  })
}
