import { getDomain } from '../taxonomy/contentTaxonomy.js'
import { validateProvenanceMetadata, validateReviewMetadata } from './editorialSchema.js'

export const FIXED_ASSESSMENT_SCHEMA_VERSION = 1
export const FIXED_ASSESSMENT_KINDS = Object.freeze(['diagnostic', 'reassessment', 'unit-test'])

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function validateFixedAssessmentBlueprint(blueprint, questions = []) {
  const errors = []
  if (blueprint?.schemaVersion !== FIXED_ASSESSMENT_SCHEMA_VERSION) errors.push('unsupported assessment schemaVersion')
  if (!ID_PATTERN.test(blueprint?.id || '')) errors.push('assessment id must be a stable slug')
  if (!FIXED_ASSESSMENT_KINDS.includes(blueprint?.kind)) errors.push('unsupported assessment kind')
  for (const field of ['title', 'description', 'startLabel', 'scoringNotice']) {
    if (!nonEmpty(blueprint?.[field])) errors.push(`${field} is required`)
  }
  if (blueprint?.subjectId !== 'ap-chemistry') errors.push('subjectId must be ap-chemistry')
  const domain = getDomain(blueprint?.subjectId, blueprint?.domainId)
  if (!domain) errors.push('assessment domain must be canonical')
  if (blueprint?.mode !== 'testing') errors.push('fixed assessments must withhold feedback until completion')
  if (blueprint?.timerMinutes !== null && (!Number.isInteger(blueprint?.timerMinutes) || blueprint.timerMinutes < 1 || blueprint.timerMinutes > 300)) {
    errors.push('timerMinutes must be null or an integer from 1 through 300')
  }
  if (!Array.isArray(blueprint?.questionIds) || blueprint.questionIds.length < 1 || new Set(blueprint.questionIds).size !== blueprint.questionIds.length) {
    errors.push('questionIds must contain unique stable IDs')
  }

  const questionById = new Map(questions.map((question) => [question.id, question]))
  const selected = (blueprint?.questionIds || []).map((id) => questionById.get(id))
  if (selected.some((question) => !question)) errors.push('every assessment question must resolve in the canonical catalog')
  if (selected.some((question) => question && (
    question.taxonomy?.subjectId !== blueprint.subjectId || question.taxonomy?.domainId !== blueprint.domainId
  ))) errors.push('every assessment question must belong to the assessment unit')
  if (['diagnostic', 'reassessment'].includes(blueprint?.kind) && selected.some((question) => question?.renderer !== 'multiple-choice')) {
    errors.push('diagnostic and reassessment forms must be automatically scored selected response')
  }
  if (blueprint?.kind === 'unit-test' && selected.filter(Boolean).length) {
    if (!selected.some((question) => question?.renderer === 'multiple-choice')) errors.push('unit-test requires selected-response questions')
    if (!selected.some((question) => question?.renderer === 'free-response')) errors.push('unit-test requires free-response questions')
  }

  const review = validateReviewMetadata(blueprint?.review)
  errors.push(...review.errors.map((error) => `review: ${error}`))
  const provenance = validateProvenanceMetadata(blueprint?.provenance)
  errors.push(...provenance.errors.map((error) => `provenance: ${error}`))
  if (['approved', 'published'].includes(blueprint?.review?.status) && selected.some((question) => question?.content?.status !== 'published')) {
    errors.push('approved or published assessments cannot contain unpublished questions')
  }
  return { valid: errors.length === 0, errors }
}

export function validateFixedAssessmentCatalog(blueprints, questions = []) {
  const errors = []
  const ids = new Set()
  for (const blueprint of blueprints || []) {
    if (ids.has(blueprint?.id)) errors.push(`duplicate assessment id: ${blueprint.id}`)
    ids.add(blueprint?.id)
    const result = validateFixedAssessmentBlueprint(blueprint, questions)
    errors.push(...result.errors.map((error) => `${blueprint?.id || '(missing id)'}: ${error}`))
  }
  return { valid: errors.length === 0, errors }
}

export function assertValidFixedAssessmentCatalog(blueprints, questions = []) {
  const result = validateFixedAssessmentCatalog(blueprints, questions)
  if (!result.valid) throw new Error(`Fixed assessment catalog validation failed:\n- ${result.errors.join('\n- ')}`)
  return blueprints
}

export function createFixedAssessmentSessionConfig(blueprint, { topic, filters = {}, reportingGroupId = 'material' }) {
  if (!blueprint) return null
  return Object.freeze({
    topic,
    mode: blueprint.mode,
    filters,
    reportingGroupId,
    questionCount: 'all',
    timerMinutes: blueprint.timerMinutes,
    assessmentId: blueprint.id,
    assessmentKind: blueprint.kind,
    assessmentTitle: blueprint.title,
  })
}
