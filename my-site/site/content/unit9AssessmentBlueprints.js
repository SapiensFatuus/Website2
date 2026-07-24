import { FIXED_ASSESSMENT_SCHEMA_VERSION } from './fixedAssessmentSchema.js'

export const UNIT9_DIAGNOSTIC_ID = 'ap-chemistry-unit-9-diagnostic-v1'
export const UNIT9_REASSESSMENT_ID = 'ap-chemistry-unit-9-reassessment-v1'
export const UNIT9_TIMED_CHECKPOINT_ID = 'ap-chemistry-unit-9-timed-checkpoint-v1'

export const UNIT9_DIAGNOSTIC_QUESTION_IDS = Object.freeze([
  'ap-chem-thermodynamics-electrochemistry-mcq-001',
  'ap-chem-thermodynamics-electrochemistry-mcq-002',
  'ap-chem-thermodynamics-electrochemistry-mcq-003',
  'ap-chem-thermodynamics-electrochemistry-mcq-004',
  'ap-chem-thermodynamics-electrochemistry-mcq-005',
  'ap-chem-thermodynamics-electrochemistry-mcq-006',
])

export const UNIT9_REASSESSMENT_QUESTION_IDS = Object.freeze([
  'ap-chem-thermodynamics-electrochemistry-mcq-009',
  'ap-chem-thermodynamics-electrochemistry-mcq-010',
  'ap-chem-thermodynamics-electrochemistry-mcq-011',
  'ap-chem-thermodynamics-electrochemistry-mcq-012',
  'ap-chem-thermodynamics-electrochemistry-mcq-013',
  'ap-chem-thermodynamics-electrochemistry-mcq-014',
])

export const UNIT9_TIMED_CHECKPOINT_QUESTION_IDS = Object.freeze([
  ...UNIT9_DIAGNOSTIC_QUESTION_IDS,
  'ap-chem-thermodynamics-electrochemistry-mcq-007',
  'ap-chem-thermodynamics-electrochemistry-mcq-008',
  ...UNIT9_REASSESSMENT_QUESTION_IDS,
  'ap-chem-thermodynamics-electrochemistry-stimulus-mcq-001',
  'ap-chem-thermodynamics-electrochemistry-stimulus-mcq-002',
  'ap-chem-thermodynamics-electrochemistry-stimulus-mcq-003',
  'ap-chem-thermodynamics-electrochemistry-stimulus-mcq-004',
  'ap-chem-thermodynamics-electrochemistry-short-frq-001',
  'ap-chem-thermodynamics-electrochemistry-long-frq-001',
])

const review = Object.freeze({
  status: 'draft', revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: '2026-07-24',
  reviewers: Object.freeze([]),
  history: Object.freeze([{ status: 'draft', date: '2026-07-24', actor: 'codex-ai-assisted-draft' }]),
})

const provenance = Object.freeze({
  kind: 'ai-generated',
  name: 'Study AI Helper original Unit 9 assessment blueprint',
  sourceIds: Object.freeze(['ap-chemistry-ced-fall-2024']),
  originalityNote: 'Original assessment arrangement and timing; no released-question wording, values, diagrams, or scoring language were used.',
})

function blueprint({ id, kind, title, description, questionIds, timerMinutes, startLabel, scoringNotice }) {
  return Object.freeze({
    schemaVersion: FIXED_ASSESSMENT_SCHEMA_VERSION,
    id, kind, title, description,
    subjectId: 'ap-chemistry',
    domainId: 'thermodynamics-electrochemistry',
    mode: 'testing',
    questionIds, timerMinutes, startLabel, scoringNotice, review, provenance,
  })
}

export const unit9AssessmentBlueprints = Object.freeze([
  blueprint({
    id: UNIT9_DIAGNOSTIC_ID,
    kind: 'diagnostic',
    title: 'Unit 9 diagnostic preview',
    description: 'Six original selected-response questions sample entropy, reaction entropy, free energy, kinetic control, equilibrium, and dissolution. Feedback remains hidden until submission.',
    questionIds: UNIT9_DIAGNOSTIC_QUESTION_IDS,
    timerMinutes: null,
    startLabel: 'diagnostic',
    scoringNotice: 'This draft diagnostic guides study recommendations. It is not an official AP score prediction.',
  }),
  blueprint({
    id: UNIT9_REASSESSMENT_ID,
    kind: 'reassessment',
    title: 'Unit 9 reassessment preview',
    description: 'A separate six-question form checks the same six skill areas with different original prompts after review and practice.',
    questionIds: UNIT9_REASSESSMENT_QUESTION_IDS,
    timerMinutes: 15,
    startLabel: 'reassessment',
    scoringNotice: 'Compare this result with your study needs, not with an AP score scale. The form is draft and unreviewed.',
  }),
  blueprint({
    id: UNIT9_TIMED_CHECKPOINT_ID,
    kind: 'unit-test',
    title: 'Unit 9 timed checkpoint preview',
    description: 'A 45-minute original checkpoint combines 18 selected-response questions with one short and one long free response across all eight topics.',
    questionIds: UNIT9_TIMED_CHECKPOINT_QUESTION_IDS,
    timerMinutes: 45,
    startLabel: 'timed checkpoint',
    scoringNotice: 'This product-defined unit checkpoint is not an official AP section. Selected responses are scored automatically; both FRQs require rubric self-review.',
  }),
])
