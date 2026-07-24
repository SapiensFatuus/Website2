import test from 'node:test'
import assert from 'node:assert/strict'
import {
  apChemistryAssessmentBlueprints,
  UNIT3_DIAGNOSTIC_ID,
} from './apChemistryAssessmentsValidated.js'
import {
  hasAcceptedTimingCalibration,
  validateAssessmentPilotEvidence,
  validateAssessmentPilotEvidenceCatalog,
} from './assessmentPilotEvidence.js'

function validRecord(overrides = {}) {
  return {
    schemaVersion: 1,
    id: 'unit-3-diagnostic-pilot-july-2026',
    subjectId: 'ap-chemistry',
    unitId: 'properties-substances-mixtures',
    assessmentId: UNIT3_DIAGNOSTIC_ID,
    assessmentRevision: 1,
    collectedFrom: '2026-07-01',
    collectedThrough: '2026-07-20',
    participants: { started: 24, completed: 22 },
    timingMinutes: { median: 11.5, p75: 13.25, p90: 15.0 },
    completion: { selectedResponsePercent: 97.5, frqSelfReviewPercent: null },
    accessibility: {
      reportedBarrierCount: 1,
      summary: 'One participant requested clearer focus movement; no student-level notes are retained.',
    },
    privacy: {
      aggregateOnly: true,
      containsDirectIdentifiers: false,
      containsRawResponses: false,
    },
    calibrationDecision: {
      status: 'accepted',
      decidedAt: '2026-07-22',
      reviewers: ['assessment-reviewer-a', 'assessment-reviewer-b'],
      rationale: 'The reviewers accepted the form timing after examining the aggregate distribution and completion rate.',
      limitations: 'This small convenience sample does not establish population norms or predict AP performance.',
    },
    recordedBy: 'pilot-coordinator',
    notes: 'Aggregate timing evidence only; original event rows were not added to the repository.',
    ...overrides,
  }
}

test('aggregate pilot evidence validates against a registered assessment revision', () => {
  const record = validRecord()
  assert.deepEqual(validateAssessmentPilotEvidence(record, apChemistryAssessmentBlueprints), { valid: true, errors: [] })
  assert.equal(hasAcceptedTimingCalibration(record), true)
})

test('pilot evidence rejects student-level data even when nested', () => {
  const record = validRecord({
    notes: 'Invalid fixture',
    privateData: { email: 'student@example.invalid', rawResponse: 'copied answer' },
  })
  const result = validateAssessmentPilotEvidence(record, apChemistryAssessmentBlueprints)
  assert.equal(result.valid, false)
  assert.ok(result.errors.some((error) => /privateData\.email/.test(error)))
  assert.ok(result.errors.some((error) => /privateData\.rawResponse/.test(error)))
})

test('timing distributions, collection dates, counts, and assessment revisions must be coherent', () => {
  const result = validateAssessmentPilotEvidence(validRecord({
    assessmentRevision: 2,
    collectedFrom: '2026-07-21',
    collectedThrough: '2026-07-20',
    participants: { started: 10, completed: 11 },
    timingMinutes: { median: 15, p75: 12, p90: 10 },
  }), apChemistryAssessmentBlueprints)
  assert.equal(result.valid, false)
  assert.ok(result.errors.some((error) => /assessmentRevision must match/.test(error)))
  assert.ok(result.errors.some((error) => /collectedFrom cannot be after/.test(error)))
  assert.ok(result.errors.some((error) => /cannot exceed/.test(error)))
  assert.ok(result.errors.some((error) => /median <= p75 <= p90/.test(error)))
})

test('accepted or revision calibration decisions require two independent reviewers', () => {
  const result = validateAssessmentPilotEvidence(validRecord({
    calibrationDecision: {
      status: 'accepted',
      decidedAt: '2026-07-22',
      reviewers: ['same-reviewer'],
      rationale: 'Insufficient review fixture.',
      limitations: 'Fixture only.',
    },
  }), apChemistryAssessmentBlueprints)
  assert.equal(result.valid, false)
  assert.ok(result.errors.some((error) => /requires two independent reviewers/.test(error)))
  assert.equal(hasAcceptedTimingCalibration(validRecord({
    calibrationDecision: {
      status: 'accepted',
      decidedAt: '2026-07-22',
      reviewers: ['same-reviewer'],
      rationale: 'Insufficient review fixture.',
      limitations: 'Fixture only.',
    },
  })), false)
})

test('pilot evidence catalog rejects duplicate records for the same fixed assessment', () => {
  const record = validRecord()
  const duplicate = validRecord({ id: 'unit-3-diagnostic-second-record' })
  const result = validateAssessmentPilotEvidenceCatalog([record, duplicate], apChemistryAssessmentBlueprints)
  assert.equal(result.valid, false)
  assert.ok(result.errors.some((error) => /duplicate pilot evidence assessmentId/.test(error)))
})
