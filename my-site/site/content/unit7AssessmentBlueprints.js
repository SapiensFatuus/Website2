import { FIXED_ASSESSMENT_SCHEMA_VERSION } from './fixedAssessmentSchema.js'

export const UNIT7_DIAGNOSTIC_ID = 'ap-chemistry-unit-7-diagnostic-v1'
export const UNIT7_REASSESSMENT_ID = 'ap-chemistry-unit-7-reassessment-v1'
export const UNIT7_TIMED_CHECKPOINT_ID = 'ap-chemistry-unit-7-timed-checkpoint-v1'

export const UNIT7_DIAGNOSTIC_QUESTION_IDS = Object.freeze([
  'ap-chem-equilibrium-mcq-005', 'ap-chem-equilibrium-mcq-002', 'ap-chem-equilibrium-mcq-004',
  'ap-chem-equilibrium-mcq-003', 'ap-chem-equilibrium-mcq-001', 'ap-chem-equilibrium-mcq-006',
])

export const UNIT7_REASSESSMENT_QUESTION_IDS = Object.freeze([
  'ap-chem-equilibrium-mcq-007', 'ap-chem-equilibrium-mcq-008', 'ap-chem-equilibrium-mcq-009',
  'ap-chem-equilibrium-mcq-010', 'ap-chem-equilibrium-mcq-011', 'ap-chem-equilibrium-mcq-012',
])

export const UNIT7_TIMED_CHECKPOINT_QUESTION_IDS = Object.freeze([
  ...UNIT7_DIAGNOSTIC_QUESTION_IDS,
  ...UNIT7_REASSESSMENT_QUESTION_IDS,
  'ap-chem-equilibrium-mcq-013',
  'ap-chem-equilibrium-mcq-014',
  'ap-chem-equilibrium-mcq-015',
  'ap-chem-equilibrium-mcq-016',
  'ap-chem-equilibrium-mcq-017',
  'ap-chem-equilibrium-stimulus-mcq-001',
  'ap-chem-equilibrium-stimulus-mcq-002',
  'ap-chem-equilibrium-stimulus-mcq-003',
  'ap-chem-equilibrium-short-frq-001',
  'ap-chem-equilibrium-long-frq-001',
])

const review = Object.freeze({
  status: 'draft', revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: '2026-07-20', reviewers: Object.freeze([]),
  history: Object.freeze([{ status: 'draft', date: '2026-07-20', actor: 'codex-ai-assisted-draft' }]),
})
const provenance = Object.freeze({
  kind: 'ai-generated',
  name: 'Study AI Helper original Unit 7 assessment blueprint',
  sourceIds: Object.freeze(['ap-chemistry-ced-fall-2024']),
  originalityNote: 'Original assessment arrangement and timing; no released-question wording, values, diagrams, or scoring language were used.',
})

function blueprint({ id, kind, title, description, questionIds, timerMinutes, startLabel, scoringNotice }) {
  return Object.freeze({
    schemaVersion: FIXED_ASSESSMENT_SCHEMA_VERSION,
    id, kind, title, description, subjectId: 'ap-chemistry', domainId: 'equilibrium',
    mode: 'testing', questionIds, timerMinutes, startLabel, scoringNotice, review, provenance,
  })
}

export const unit7AssessmentBlueprints = Object.freeze([
  blueprint({
    id: UNIT7_DIAGNOSTIC_ID,
    kind: 'diagnostic',
    title: 'Unit 7 diagnostic preview',
    description: 'Six original selected-response questions sample six foundational Equilibrium skills. Feedback remains hidden until the form is submitted.',
    questionIds: UNIT7_DIAGNOSTIC_QUESTION_IDS,
    timerMinutes: null,
    startLabel: 'diagnostic',
    scoringNotice: 'This draft diagnostic guides study recommendations. It is not an official AP score prediction.',
  }),
  blueprint({
    id: UNIT7_REASSESSMENT_ID,
    kind: 'reassessment',
    title: 'Unit 7 reassessment preview',
    description: 'A separate six-question form checks the same six skill areas with new original prompts after review and practice.',
    questionIds: UNIT7_REASSESSMENT_QUESTION_IDS,
    timerMinutes: 15,
    startLabel: 'reassessment',
    scoringNotice: 'Compare this result with your study needs, not with an AP score scale. The form is draft and unreviewed.',
  }),
  blueprint({
    id: UNIT7_TIMED_CHECKPOINT_ID,
    kind: 'unit-test',
    title: 'Unit 7 timed checkpoint preview',
    description: 'A 45-minute original unit checkpoint combines 20 selected-response questions with one short and one long free response.',
    questionIds: UNIT7_TIMED_CHECKPOINT_QUESTION_IDS,
    timerMinutes: 45,
    startLabel: 'timed checkpoint',
    scoringNotice: 'This product-defined unit checkpoint is not an official AP section. Selected responses are scored automatically; both FRQs require rubric self-review.',
  }),
])

export function getUnit7AssessmentBlueprint(id) {
  return unit7AssessmentBlueprints.find((item) => item.id === id) || null
}

export function createUnit7AssessmentUrl(id) {
  return getUnit7AssessmentBlueprint(id)
    ? `/questions.html?topic=ap-chemistry&domain=equilibrium&assessment=${encodeURIComponent(id)}`
    : null
}
