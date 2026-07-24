import { FIXED_ASSESSMENT_SCHEMA_VERSION } from './fixedAssessmentSchema.js'

export const UNIT6_DIAGNOSTIC_ID = 'ap-chemistry-unit-6-diagnostic-v1'
export const UNIT6_REASSESSMENT_ID = 'ap-chemistry-unit-6-reassessment-v1'
export const UNIT6_TIMED_CHECKPOINT_ID = 'ap-chemistry-unit-6-timed-checkpoint-v1'

export const UNIT6_DIAGNOSTIC_QUESTION_IDS = Object.freeze([
  'ap-chem-thermochemistry-mcq-001',
  'ap-chem-thermochemistry-mcq-002',
  'ap-chem-thermochemistry-mcq-003',
  'ap-chem-thermochemistry-mcq-004',
  'ap-chem-thermochemistry-mcq-005',
  'ap-chem-thermochemistry-mcq-006',
])

export const UNIT6_REASSESSMENT_QUESTION_IDS = Object.freeze([
  'ap-chem-thermochemistry-mcq-007',
  'ap-chem-thermochemistry-mcq-008',
  'ap-chem-thermochemistry-mcq-009',
  'ap-chem-thermochemistry-mcq-010',
  'ap-chem-thermochemistry-mcq-011',
  'ap-chem-thermochemistry-mcq-012',
])

export const UNIT6_TIMED_CHECKPOINT_QUESTION_IDS = Object.freeze([
  ...UNIT6_DIAGNOSTIC_QUESTION_IDS,
  ...UNIT6_REASSESSMENT_QUESTION_IDS,
  'ap-chem-thermochemistry-stimulus-mcq-001',
  'ap-chem-thermochemistry-stimulus-mcq-002',
  'ap-chem-thermochemistry-stimulus-mcq-003',
  'ap-chem-thermochemistry-stimulus-mcq-004',
  'ap-chem-thermochemistry-short-frq-001',
  'ap-chem-thermochemistry-long-frq-001',
])

const review = Object.freeze({
  status: 'draft', revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: '2026-07-24',
  reviewers: Object.freeze([]),
  history: Object.freeze([{ status: 'draft', date: '2026-07-24', actor: 'codex-ai-assisted-draft' }]),
})

const provenance = Object.freeze({
  kind: 'ai-generated',
  name: 'Study AI Helper original Unit 6 assessment blueprint',
  sourceIds: Object.freeze(['ap-chemistry-ced-fall-2024']),
  originalityNote: 'Original assessment arrangement and timing; no released-question wording, values, diagrams, or scoring language were used.',
})

function blueprint({ id, kind, title, description, questionIds, timerMinutes, startLabel, scoringNotice }) {
  return Object.freeze({
    schemaVersion: FIXED_ASSESSMENT_SCHEMA_VERSION,
    id, kind, title, description,
    subjectId: 'ap-chemistry',
    domainId: 'thermochemistry',
    mode: 'testing',
    questionIds, timerMinutes, startLabel, scoringNotice, review, provenance,
  })
}

export const unit6AssessmentBlueprints = Object.freeze([
  blueprint({
    id: UNIT6_DIAGNOSTIC_ID,
    kind: 'diagnostic',
    title: 'Unit 6 diagnostic preview',
    description: 'Six original selected-response questions sample heat-flow signs, energy diagrams, thermal equilibrium, phase changes, bond enthalpies, and formation enthalpies. Feedback remains hidden until submission.',
    questionIds: UNIT6_DIAGNOSTIC_QUESTION_IDS,
    timerMinutes: null,
    startLabel: 'diagnostic',
    scoringNotice: 'This draft diagnostic guides study recommendations. It is not an official AP score prediction.',
  }),
  blueprint({
    id: UNIT6_REASSESSMENT_ID,
    kind: 'reassessment',
    title: 'Unit 6 reassessment preview',
    description: 'A separate six-question form checks the same six skill areas with different original prompts after review and practice.',
    questionIds: UNIT6_REASSESSMENT_QUESTION_IDS,
    timerMinutes: 15,
    startLabel: 'reassessment',
    scoringNotice: 'Compare this result with your study needs, not with an AP score scale. The form is draft and unreviewed.',
  }),
  blueprint({
    id: UNIT6_TIMED_CHECKPOINT_ID,
    kind: 'unit-test',
    title: 'Unit 6 timed checkpoint preview',
    description: 'A 40-minute original checkpoint combines 16 selected-response questions with one short and one long free response across all nine topics.',
    questionIds: UNIT6_TIMED_CHECKPOINT_QUESTION_IDS,
    timerMinutes: 40,
    startLabel: 'timed checkpoint',
    scoringNotice: 'This product-defined unit checkpoint is not an official AP section. Selected responses are scored automatically; both FRQs require rubric self-review.',
  }),
])
