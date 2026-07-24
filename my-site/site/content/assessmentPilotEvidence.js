import { getDomain } from '../taxonomy/contentTaxonomy.js'

export const ASSESSMENT_PILOT_SCHEMA_VERSION = 1
export const PILOT_CALIBRATION_STATUSES = Object.freeze(['collecting', 'revise', 'accepted'])

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const FORBIDDEN_STUDENT_LEVEL_FIELDS = new Set([
  'answertext',
  'chat',
  'email',
  'ipaddress',
  'name',
  'participantid',
  'rawdata',
  'rawevents',
  'rawresponse',
  'responsetext',
  'studentid',
  'studentname',
  'uid',
  'userid',
])

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function validDate(value) {
  return DATE_PATTERN.test(value || '') && !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))
}

function validPercent(value) {
  return Number.isFinite(value) && value >= 0 && value <= 100
}

function findForbiddenFields(value, path = '', findings = []) {
  if (!value || typeof value !== 'object') return findings
  if (Array.isArray(value)) {
    value.forEach((item, index) => findForbiddenFields(item, `${path}[${index}]`, findings))
    return findings
  }
  Object.entries(value).forEach(([key, child]) => {
    const childPath = path ? `${path}.${key}` : key
    if (FORBIDDEN_STUDENT_LEVEL_FIELDS.has(key.toLowerCase())) findings.push(childPath)
    findForbiddenFields(child, childPath, findings)
  })
  return findings
}

export function validateAssessmentPilotEvidence(record, assessmentBlueprints = []) {
  const errors = []
  if (record?.schemaVersion !== ASSESSMENT_PILOT_SCHEMA_VERSION) errors.push('unsupported pilot schemaVersion')
  if (!ID_PATTERN.test(record?.id || '')) errors.push('pilot evidence id must be a stable slug')
  if (record?.subjectId !== 'ap-chemistry') errors.push('subjectId must be ap-chemistry')
  const unit = getDomain('ap-chemistry', record?.unitId)
  if (!unit) errors.push('unitId must identify a canonical AP Chemistry unit')
  const blueprint = assessmentBlueprints.find(({ id }) => id === record?.assessmentId)
  if (!blueprint) errors.push('assessmentId must identify a registered fixed assessment')
  else if (blueprint.domainId !== record?.unitId) errors.push('assessmentId must belong to unitId')
  if (!Number.isInteger(record?.assessmentRevision) || record.assessmentRevision < 1) {
    errors.push('assessmentRevision must be a positive integer')
  } else if (blueprint && record.assessmentRevision !== blueprint.review?.revision) {
    errors.push('assessmentRevision must match the registered assessment revision')
  }
  if (!validDate(record?.collectedFrom) || !validDate(record?.collectedThrough)) {
    errors.push('collection dates must use valid YYYY-MM-DD values')
  } else if (record.collectedFrom > record.collectedThrough) {
    errors.push('collectedFrom cannot be after collectedThrough')
  }

  const participants = record?.participants
  if (!Number.isInteger(participants?.started) || participants.started < 1) {
    errors.push('participants.started must be a positive integer')
  }
  if (!Number.isInteger(participants?.completed) || participants.completed < 1 || participants.completed > participants?.started) {
    errors.push('participants.completed must be positive and cannot exceed participants.started')
  }

  const timing = record?.timingMinutes
  if (![timing?.median, timing?.p75, timing?.p90].every((value) => Number.isFinite(value) && value > 0 && value <= 300)) {
    errors.push('timingMinutes requires finite median, p75, and p90 values from 0 through 300')
  } else if (timing.median > timing.p75 || timing.p75 > timing.p90) {
    errors.push('timingMinutes must satisfy median <= p75 <= p90')
  }

  const completion = record?.completion
  if (!validPercent(completion?.selectedResponsePercent)) errors.push('completion.selectedResponsePercent must be from 0 through 100')
  if (blueprint?.kind === 'unit-test') {
    if (!validPercent(completion?.frqSelfReviewPercent)) errors.push('unit-test pilot evidence requires an FRQ self-review completion percentage')
  } else if (completion?.frqSelfReviewPercent !== null) {
    errors.push('diagnostic and reassessment evidence must use null for frqSelfReviewPercent')
  }
  if (!Number.isInteger(record?.accessibility?.reportedBarrierCount) || record.accessibility.reportedBarrierCount < 0) {
    errors.push('accessibility.reportedBarrierCount must be a nonnegative integer')
  }
  if (!nonEmpty(record?.accessibility?.summary)) errors.push('accessibility.summary is required')

  if (record?.privacy?.aggregateOnly !== true
    || record?.privacy?.containsDirectIdentifiers !== false
    || record?.privacy?.containsRawResponses !== false) {
    errors.push('privacy must assert aggregate-only data with no direct identifiers or raw responses')
  }
  const forbidden = findForbiddenFields(record)
  if (forbidden.length) errors.push(`student-level fields are forbidden: ${forbidden.join(', ')}`)

  const decision = record?.calibrationDecision
  if (!PILOT_CALIBRATION_STATUSES.includes(decision?.status)) errors.push('unsupported calibrationDecision.status')
  if (!nonEmpty(decision?.rationale)) errors.push('calibrationDecision.rationale is required')
  if (!nonEmpty(decision?.limitations)) errors.push('calibrationDecision.limitations is required')
  if (!Array.isArray(decision?.reviewers)
    || decision.reviewers.some((reviewer) => !nonEmpty(reviewer))
    || new Set(decision.reviewers).size !== decision.reviewers.length) {
    errors.push('calibrationDecision.reviewers must contain distinct non-empty identifiers')
  }
  if (decision?.status === 'collecting') {
    if (decision?.reviewers?.length) errors.push('collecting evidence cannot claim calibration reviewers')
    if (decision?.decidedAt !== null) errors.push('collecting evidence must use a null decidedAt')
  } else {
    if (decision?.reviewers?.length < 2) errors.push(`${decision?.status || 'decided'} calibration requires two independent reviewers`)
    if (!validDate(decision?.decidedAt)) errors.push('decided calibration requires a valid decidedAt date')
  }

  if (!nonEmpty(record?.recordedBy)) errors.push('recordedBy is required')
  if (!nonEmpty(record?.notes)) errors.push('notes is required')
  return { valid: errors.length === 0, errors }
}

export function validateAssessmentPilotEvidenceCatalog(records, assessmentBlueprints = []) {
  const errors = []
  const ids = new Set()
  const assessmentIds = new Set()
  for (const record of records || []) {
    if (ids.has(record?.id)) errors.push(`duplicate pilot evidence id: ${record.id}`)
    if (assessmentIds.has(record?.assessmentId)) errors.push(`duplicate pilot evidence assessmentId: ${record.assessmentId}`)
    ids.add(record?.id)
    assessmentIds.add(record?.assessmentId)
    const result = validateAssessmentPilotEvidence(record, assessmentBlueprints)
    errors.push(...result.errors.map((error) => `${record?.id || '(missing id)'}: ${error}`))
  }
  return { valid: errors.length === 0, errors }
}

export function assertValidAssessmentPilotEvidenceCatalog(records, assessmentBlueprints = []) {
  const result = validateAssessmentPilotEvidenceCatalog(records, assessmentBlueprints)
  if (!result.valid) throw new Error(`Assessment pilot evidence validation failed:\n- ${result.errors.join('\n- ')}`)
  return records
}

export function hasAcceptedTimingCalibration(record) {
  return record?.calibrationDecision?.status === 'accepted'
    && new Set(record.calibrationDecision.reviewers || []).size >= 2
}

// Intentionally empty until aggregate pilot evidence is collected and reviewed.
export const apChemistryAssessmentPilotEvidence = Object.freeze([])
