import { createHash } from 'node:crypto'
import { EDITORIAL_CHECKLIST } from './editorialPipeline.js'
import { createEditorialReviewQueue } from './editorialReviewQueue.js'

export const REVIEW_PACKET_SCHEMA_VERSION = 2
export const REVIEW_DECISIONS = Object.freeze(['pending', 'approve', 'request-changes'])

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const checklistIds = Object.freeze(EDITORIAL_CHECKLIST.map(({ id }) => id))

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

export function createEditorialContentHash(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new TypeError('A content record is required.')
  return createHash('sha256').update(stableJson(record)).digest('hex')
}

function recordsById({ questions = [], resources = [], exemplars = [] }) {
  return new Map([...questions, ...resources, ...exemplars].map((record) => [record.id, record]))
}

export function getReviewBundleTarget({ questions = [], resources = [], exemplars = [] } = {}) {
  const targets = [
    ...questions.map((record) => ({ subjectId: record?.taxonomy?.subjectId, unitId: record?.taxonomy?.domainId })),
    ...resources.map((record) => ({ subjectId: record?.alignment?.subjectId, unitId: record?.alignment?.domainId })),
    ...exemplars.map((record) => ({ subjectId: record?.alignment?.subjectId, unitId: record?.alignment?.domainId })),
  ]
  if (!targets.length || targets.some(({ subjectId, unitId }) => !subjectId || !unitId)) {
    throw new TypeError('A review bundle requires content with canonical subject and unit alignment.')
  }
  const keys = new Set(targets.map(({ subjectId, unitId }) => `${subjectId}:${unitId}`))
  if (keys.size !== 1) throw new TypeError('A review bundle must contain exactly one canonical subject and unit.')
  return targets[0]
}

function recordRevision(record) {
  return record?.content?.revision || record?.review?.revision || null
}

function recordAuthor(record) {
  return record?.content?.authoredBy || record?.review?.authoredBy || null
}

function blankChecklist() {
  return EDITORIAL_CHECKLIST.map(({ id, owner, prompt }) => ({ id, owner, prompt, passed: null, note: '' }))
}

export function createBlankReviewPacket({ questions = [], resources = [], exemplars = [] } = {}, {
  reviewerId,
  createdAt,
  packetId = null,
} = {}) {
  const target = getReviewBundleTarget({ questions, resources })
  const resolvedPacketId = packetId || `${target.unitId}-${reviewerId}-${createdAt}`
  if (!ID_PATTERN.test(reviewerId || '') || !DATE_PATTERN.test(createdAt || '') || !ID_PATTERN.test(resolvedPacketId || '')) {
    throw new TypeError('A stable packetId, reviewerId, and YYYY-MM-DD createdAt date are required.')
  }
  const records = recordsById({ questions, resources, exemplars })
  const queue = createEditorialReviewQueue({ questions, resources, exemplars })
  const items = queue.items.map((item) => {
    const record = records.get(item.id)
    return {
      contentId: item.id,
      itemType: item.itemType,
      format: item.responseFormat || item.format,
      sourceRevision: recordRevision(record),
      contentHash: createEditorialContentHash(record),
      decision: 'pending',
      checklistResults: blankChecklist(),
      overallNote: '',
    }
  })
  return {
    schemaVersion: REVIEW_PACKET_SCHEMA_VERSION,
    packetId: resolvedPacketId,
    subjectId: target.subjectId,
    unitId: target.unitId,
    reviewerId,
    createdAt,
    items,
  }
}

function validateChecklist(item, errors) {
  if (!Array.isArray(item.checklistResults)) {
    errors.push(`${item.contentId}: checklistResults must be an array`)
    return
  }
  const ids = item.checklistResults.map(({ id }) => id)
  if (new Set(ids).size !== ids.length || ids.length !== checklistIds.length
    || checklistIds.some((id) => !ids.includes(id))) {
    errors.push(`${item.contentId}: checklistResults must contain every mandatory gate exactly once`)
  }
  item.checklistResults.forEach((result) => {
    if (!checklistIds.includes(result?.id)) errors.push(`${item.contentId}: unknown checklist gate ${result?.id || '(missing)'}`)
    if (![true, false, null].includes(result?.passed)) errors.push(`${item.contentId}: checklist passed must be true, false, or null`)
    if (result?.passed !== null && !nonEmpty(result?.note)) errors.push(`${item.contentId}: completed checklist results require notes`)
  })
}

export function validateReviewPacket(packet, bundle, { requireCompleteDecisions = false } = {}) {
  if (!packet || typeof packet !== 'object' || Array.isArray(packet)) return { valid: false, errors: ['packet must be an object'] }
  const errors = []
  let target = null
  try {
    target = getReviewBundleTarget(bundle)
  } catch (error) {
    errors.push(error.message)
  }
  if (packet.schemaVersion !== REVIEW_PACKET_SCHEMA_VERSION) errors.push(`schemaVersion must be ${REVIEW_PACKET_SCHEMA_VERSION}`)
  if (!ID_PATTERN.test(packet.packetId || '')) errors.push('packetId must be lowercase kebab-case')
  if (target && (packet.subjectId !== target.subjectId || packet.unitId !== target.unitId)) {
    errors.push(`packet must target ${target.subjectId}:${target.unitId}`)
  }
  if (!ID_PATTERN.test(packet.reviewerId || '')) errors.push('reviewerId must be a stable lowercase identifier')
  if (!DATE_PATTERN.test(packet.createdAt || '')) errors.push('createdAt must be YYYY-MM-DD')
  if (!Array.isArray(packet.items)) return { valid: false, errors: [...errors, 'items must be an array'] }

  const records = recordsById(bundle)
  const expectedIds = [...records.keys()]
  const itemIds = packet.items.map(({ contentId }) => contentId)
  if (new Set(itemIds).size !== itemIds.length) errors.push('packet contains duplicate contentId values')
  if (itemIds.length !== expectedIds.length || expectedIds.some((id) => !itemIds.includes(id))) {
    errors.push('packet must include every current question, resource, and exemplar in the selected review bundle exactly once')
  }

  packet.items.forEach((item) => {
    const record = records.get(item?.contentId)
    if (!record) {
      errors.push(`${item?.contentId || '(missing)'}: unknown content record`)
      return
    }
    if (item.sourceRevision !== recordRevision(record)) errors.push(`${item.contentId}: stale sourceRevision`)
    if (item.contentHash !== createEditorialContentHash(record)) errors.push(`${item.contentId}: stale contentHash`)
    if (!REVIEW_DECISIONS.includes(item.decision)) errors.push(`${item.contentId}: unsupported decision`)
    validateChecklist(item, errors)

    if (requireCompleteDecisions && item.decision === 'pending') errors.push(`${item.contentId}: pending decisions are not allowed in a completed packet`)
    if (item.decision === 'pending') {
      if (item.checklistResults?.some(({ passed, note }) => passed !== null || nonEmpty(note)) || nonEmpty(item.overallNote)) {
        errors.push(`${item.contentId}: pending decisions cannot contain completed review results`)
      }
    }
    if (item.decision === 'approve') {
      if (packet.reviewerId === recordAuthor(record)) errors.push(`${item.contentId}: an author cannot approve their own content`)
      if (item.checklistResults?.some(({ passed }) => passed !== true)) errors.push(`${item.contentId}: approval requires every checklist gate to pass`)
      if (!nonEmpty(item.overallNote)) errors.push(`${item.contentId}: approval requires an overallNote`)
    }
    if (item.decision === 'request-changes') {
      if (!item.checklistResults?.some(({ passed }) => passed === false)) errors.push(`${item.contentId}: request-changes requires at least one failed gate`)
      if (!nonEmpty(item.overallNote)) errors.push(`${item.contentId}: request-changes requires an overallNote`)
    }
  })

  return { valid: errors.length === 0, errors }
}

export function aggregateReviewPackets(packets, bundle) {
  if (!Array.isArray(packets) || packets.length < 2) throw new TypeError('At least two completed review packets are required.')
  const packetErrors = packets.flatMap((packet) => validateReviewPacket(packet, bundle, { requireCompleteDecisions: true }).errors)
  const reviewerIds = packets.map(({ reviewerId }) => reviewerId)
  if (new Set(reviewerIds).size !== reviewerIds.length) packetErrors.push('Review packets must come from distinct reviewers.')
  if (packetErrors.length) throw new Error(`Review packet aggregation failed:\n- ${packetErrors.join('\n- ')}`)

  const decisionsByContent = new Map()
  packets.forEach((packet) => packet.items.forEach((item) => {
    decisionsByContent.set(item.contentId, [...(decisionsByContent.get(item.contentId) || []), {
      reviewerId: packet.reviewerId,
      packetId: packet.packetId,
      decision: item.decision,
      sourceRevision: item.sourceRevision,
      contentHash: item.contentHash,
    }])
  }))
  const items = [...decisionsByContent].sort(([left], [right]) => left.localeCompare(right)).map(([contentId, decisions]) => {
    const approvalCount = decisions.filter(({ decision }) => decision === 'approve').length
    const changeRequestCount = decisions.filter(({ decision }) => decision === 'request-changes').length
    return {
      contentId,
      approvalCount,
      changeRequestCount,
      readyForStatusTransition: approvalCount >= 2 && changeRequestCount === 0,
      decisions,
    }
  })
  return {
    schemaVersion: REVIEW_PACKET_SCHEMA_VERSION,
    reviewerIds: [...new Set(reviewerIds)].sort(),
    itemCount: items.length,
    readyCount: items.filter(({ readyForStatusTransition }) => readyForStatusTransition).length,
    changeRequestedCount: items.filter(({ changeRequestCount }) => changeRequestCount > 0).length,
    items,
    appliesChanges: false,
  }
}
