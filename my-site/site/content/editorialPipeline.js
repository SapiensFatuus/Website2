import { getDomain, getSciencePracticeSubskill, getSkill } from '../taxonomy/contentTaxonomy.js'
import { apChemistrySources } from '../taxonomy/apChemistrySources.js'
import { canTransitionReviewStatus } from './editorialSchema.js'

export const EDITORIAL_CHECKLIST = Object.freeze([
  Object.freeze({ id: 'chemistry-correctness', owner: 'chemistry-reviewer', prompt: 'Verify chemical claims, equations, phases, constants, and directionality.' }),
  Object.freeze({ id: 'solvability', owner: 'chemistry-reviewer', prompt: 'Solve independently and confirm the supplied information is sufficient.' }),
  Object.freeze({ id: 'originality', owner: 'rights-reviewer', prompt: 'Confirm the scenario, values, wording, representations, and rubric are independently written.' }),
  Object.freeze({ id: 'distractors', owner: 'assessment-reviewer', prompt: 'Confirm each distractor is plausible, unique, and tied to a diagnosed misconception.' }),
  Object.freeze({ id: 'units-significant-figures', owner: 'chemistry-reviewer', prompt: 'Check units, dimensional consistency, rounding, and significant-figure expectations.' }),
  Object.freeze({ id: 'accessibility', owner: 'accessibility-reviewer', prompt: 'Check keyboard use, table headers, text alternatives, notation, contrast, and reading order.' }),
  Object.freeze({ id: 'rubric-consistency', owner: 'assessment-reviewer', prompt: 'Confirm every point is independently earnable and matches the question parts and model answer.' }),
  Object.freeze({ id: 'source-rights', owner: 'rights-reviewer', prompt: 'Confirm sources are registered and usage stays within link-only, metadata-only, or licensed terms.' }),
])

export const RELEASED_EXAM_METADATA_SCHEMA_VERSION = 1
export const COVERAGE_BRIEF_SCHEMA_VERSION = 1
export const EDITORIAL_AUDIT_SCHEMA_VERSION = 1
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const FORBIDDEN_REFERENCE_FIELDS = new Set([
  'prompt', 'question', 'questionText', 'rawText', 'rubric', 'rubricText', 'scoringGuidelines',
  'studentResponse', 'studentResponses', 'answerChoices', 'diagram', 'image', 'excerpt',
])
const RELEASED_EXAM_METADATA_FIELDS = new Set([
  'schemaVersion', 'id', 'year', 'publicQuestionNumber', 'sourceId', 'observedAt', 'recordedBy',
  'topicIds', 'sciencePracticeIds', 'taskVerbs', 'representationTypes', 'calculationTypes',
  'misconceptionCategoryIds',
])
const sourceIds = new Set(apChemistrySources.map(({ id }) => id))

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function stableStrings(value) {
  return Array.isArray(value) && value.length > 0 && value.every(nonEmpty) && new Set(value).size === value.length
}

function stableMetadataIds(value) {
  return stableStrings(value) && value.every((item) => item.length <= 64 && ID_PATTERN.test(item))
}

function findForbiddenKeys(value, path = '$', found = []) {
  if (!value || typeof value !== 'object') return found
  Object.entries(value).forEach(([key, child]) => {
    const childPath = `${path}.${key}`
    if (FORBIDDEN_REFERENCE_FIELDS.has(key)) found.push(childPath)
    findForbiddenKeys(child, childPath, found)
  })
  return found
}

export function validateReleasedExamMetadata(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return { valid: false, errors: ['record must be an object'] }
  const errors = []
  Object.keys(record).forEach((field) => {
    if (!RELEASED_EXAM_METADATA_FIELDS.has(field)) errors.push(`unknown metadata field is forbidden: $.${field}`)
  })
  if (record.schemaVersion !== RELEASED_EXAM_METADATA_SCHEMA_VERSION) errors.push(`schemaVersion must be ${RELEASED_EXAM_METADATA_SCHEMA_VERSION}`)
  if (!ID_PATTERN.test(record.id || '')) errors.push('id must be lowercase kebab-case')
  if (!Number.isInteger(record.year) || record.year < 1950 || record.year > 2100) errors.push('year must be a plausible integer')
  if (!/^[A-Za-z0-9]+(?:[ .-][A-Za-z0-9]+)*$/.test(record.publicQuestionNumber || '') || record.publicQuestionNumber.length > 24) {
    errors.push('publicQuestionNumber must be a short public label')
  }
  if (!sourceIds.has(record.sourceId)) errors.push('sourceId must reference the registered AP source catalog')
  if (!DATE_PATTERN.test(record.observedAt || '')) errors.push('observedAt must be YYYY-MM-DD')
  if (!nonEmpty(record.recordedBy)) errors.push('recordedBy is required')
  for (const field of ['topicIds', 'sciencePracticeIds']) {
    if (!stableStrings(record[field])) errors.push(`${field} must contain unique non-empty metadata labels`)
  }
  for (const field of ['taskVerbs', 'representationTypes', 'calculationTypes', 'misconceptionCategoryIds']) {
    if (!stableMetadataIds(record[field])) errors.push(`${field} must contain unique lowercase kebab-case metadata IDs of at most 64 characters`)
  }
  record.topicIds?.forEach((id) => {
    if (!getSkill('ap-chemistry', id)) errors.push(`unknown AP Chemistry topic: ${id}`)
  })
  record.sciencePracticeIds?.forEach((id) => {
    if (!getSciencePracticeSubskill(id)) errors.push(`unknown science practice: ${id}`)
  })
  findForbiddenKeys(record).forEach((path) => errors.push(`protected content field is forbidden: ${path}`))
  return { valid: errors.length === 0, errors }
}

export function validateReleasedExamMetadataCatalog(records) {
  if (!Array.isArray(records)) return { valid: false, errors: ['metadata catalog must be an array'] }
  const errors = []
  const ids = new Set()
  const publicKeys = new Set()
  records.forEach((record) => {
    const result = validateReleasedExamMetadata(record)
    result.errors.forEach((error) => errors.push(`${record?.id || '(missing id)'}: ${error}`))
    if (ids.has(record?.id)) errors.push(`${record.id}: duplicate metadata id`)
    ids.add(record?.id)
    const normalizedQuestionNumber = String(record?.publicQuestionNumber || '').trim().toLowerCase().replace(/\s+/g, ' ')
    const publicKey = `${record?.year}:${normalizedQuestionNumber}`
    if (publicKeys.has(publicKey)) errors.push(`${record?.id}: duplicate public exam question reference`)
    publicKeys.add(publicKey)
  })
  return { valid: errors.length === 0, errors }
}

export function createCoverageBrief(records, {
  id, title, unitId, desiredTopicCounts = {}, desiredPracticeCounts = {}, createdAt, createdBy,
}) {
  if (!ID_PATTERN.test(id || '') || !nonEmpty(title) || !getDomain('ap-chemistry', unitId)
    || !DATE_PATTERN.test(createdAt || '') || !nonEmpty(createdBy)) throw new TypeError('Coverage brief metadata is incomplete.')
  Object.keys(desiredTopicCounts).forEach((topicId) => {
    const skill = getSkill('ap-chemistry', topicId)
    if (!skill || skill.domainId !== unitId) throw new TypeError(`Coverage brief has an invalid topic: ${topicId}`)
  })
  Object.keys(desiredPracticeCounts).forEach((practiceId) => {
    if (!getSciencePracticeSubskill(practiceId)) throw new TypeError(`Coverage brief has an invalid science practice: ${practiceId}`)
  })
  ;[...Object.values(desiredTopicCounts), ...Object.values(desiredPracticeCounts)].forEach((count) => {
    if (!Number.isInteger(count) || count < 0) throw new TypeError('Coverage targets must be non-negative integers.')
  })
  const observedTopics = new Map()
  const observedPractices = new Map()
  records.forEach((record) => {
    record.topicIds.forEach((topicId) => observedTopics.set(topicId, (observedTopics.get(topicId) || 0) + 1))
    record.sciencePracticeIds.forEach((practiceId) => observedPractices.set(practiceId, (observedPractices.get(practiceId) || 0) + 1))
  })
  const gaps = (desired, observed) => Object.entries(desired).sort(([a], [b]) => a.localeCompare(b)).map(([targetId, desiredCount]) => ({
    targetId, desiredCount, observedCount: observed.get(targetId) || 0,
    neededCount: Math.max(0, desiredCount - (observed.get(targetId) || 0)),
  }))
  return Object.freeze({
    schemaVersion: COVERAGE_BRIEF_SCHEMA_VERSION, id, title, subjectId: 'ap-chemistry', unitId, createdAt, createdBy,
    sourceMetadataIds: Object.freeze(records.map(({ id: recordId }) => recordId).sort()),
    topicRequirements: Object.freeze(gaps(desiredTopicCounts, observedTopics)),
    practiceRequirements: Object.freeze(gaps(desiredPracticeCounts, observedPractices)),
    originalityRequirement: 'Create independently written scenarios, values, representations, explanations, and rubrics; do not imitate any single released item.',
  })
}

export function validateEditorialAudit(audit) {
  if (!audit || typeof audit !== 'object' || Array.isArray(audit)) return { valid: false, errors: ['audit must be an object'] }
  const errors = []
  if (audit.schemaVersion !== EDITORIAL_AUDIT_SCHEMA_VERSION) errors.push(`schemaVersion must be ${EDITORIAL_AUDIT_SCHEMA_VERSION}`)
  if (!ID_PATTERN.test(audit.contentId || '')) errors.push('contentId must be lowercase kebab-case')
  if (!nonEmpty(audit.authoredBy)) errors.push('authoredBy is required')
  if (!Array.isArray(audit.revisions) || !audit.revisions.length) errors.push('revisions are required')
  else {
    let prior = 0
    audit.revisions.forEach((revision) => {
      if (!Number.isInteger(revision?.revision) || revision.revision !== prior + 1
        || !DATE_PATTERN.test(revision?.date || '') || !nonEmpty(revision?.actor)
        || !nonEmpty(revision?.summary) || !/^[a-f0-9]{64}$/.test(revision?.contentHash || '')) {
        errors.push('revisions must be sequential and include date, actor, summary, and SHA-256 contentHash')
      }
      prior = revision?.revision || prior
    })
  }
  if (!Array.isArray(audit.decisions)) errors.push('decisions must be an array')
  else audit.decisions.forEach((decision) => {
    if (!canTransitionReviewStatus(decision?.from, decision?.to) || !DATE_PATTERN.test(decision?.date || '') || !nonEmpty(decision?.reviewerId)) {
      errors.push('each review decision requires a valid transition, date, and reviewerId')
    }
    const results = new Map((decision?.checklistResults || []).map((result) => [result.id, result]))
    if (['approved', 'published'].includes(decision?.to)) {
      EDITORIAL_CHECKLIST.forEach(({ id }) => {
        const result = results.get(id)
        if (!result || result.passed !== true || !nonEmpty(result.note)) errors.push(`${decision.to} decision requires a passing ${id} checklist result with notes`)
      })
      if (decision.reviewerId === audit.authoredBy) errors.push(`${decision.to} decision requires a reviewer other than the author`)
    }
  })
  return { valid: errors.length === 0, errors }
}

function normalizedTokens(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter((token) => token.length > 2)
}

function shingles(text, width = 3) {
  const tokens = normalizedTokens(text)
  const values = new Set()
  for (let index = 0; index <= tokens.length - width; index += 1) values.add(tokens.slice(index, index + width).join(' '))
  return values
}

function jaccard(left, right) {
  if (!left.size && !right.size) return 0
  let overlap = 0
  left.forEach((value) => { if (right.has(value)) overlap += 1 })
  return overlap / (left.size + right.size - overlap)
}

export function findSimilarInternalDrafts(drafts, { threshold = 0.45 } = {}) {
  if (!Array.isArray(drafts) || threshold <= 0 || threshold > 1) throw new TypeError('Drafts and a threshold from 0 to 1 are required.')
  const prepared = drafts.map(({ id, text }) => ({ id, shingles: shingles(text) })).sort((a, b) => a.id.localeCompare(b.id))
  const flags = []
  for (let left = 0; left < prepared.length; left += 1) {
    for (let right = left + 1; right < prepared.length; right += 1) {
      const score = jaccard(prepared[left].shingles, prepared[right].shingles)
      if (score >= threshold) flags.push({ leftId: prepared[left].id, rightId: prepared[right].id, score: Number(score.toFixed(4)) })
    }
  }
  return flags
}
