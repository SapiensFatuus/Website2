import { FIXED_ASSESSMENT_SCHEMA_VERSION } from './fixedAssessmentSchema.js'

export const UNIT1_DIAGNOSTIC_ID = 'ap-chemistry-unit-1-diagnostic-v1'
export const UNIT1_REASSESSMENT_ID = 'ap-chemistry-unit-1-reassessment-v1'
export const UNIT1_TIMED_CHECKPOINT_ID = 'ap-chemistry-unit-1-timed-checkpoint-v1'

export const UNIT1_DIAGNOSTIC_QUESTION_IDS = Object.freeze([
  'ap-chem-atomic-structure-properties-mcq-001',
  'ap-chem-atomic-structure-properties-mcq-002',
  'ap-chem-atomic-structure-properties-mcq-003',
  'ap-chem-atomic-structure-properties-mcq-004',
  'ap-chem-atomic-structure-properties-mcq-005',
  'ap-chem-atomic-structure-properties-mcq-006',
])

export const UNIT1_REASSESSMENT_QUESTION_IDS = Object.freeze([
  'ap-chem-atomic-structure-properties-mcq-009',
  'ap-chem-atomic-structure-properties-mcq-010',
  'ap-chem-atomic-structure-properties-mcq-011',
  'ap-chem-atomic-structure-properties-mcq-012',
  'ap-chem-atomic-structure-properties-mcq-013',
  'ap-chem-atomic-structure-properties-mcq-014',
])

export const UNIT1_TIMED_CHECKPOINT_QUESTION_IDS = Object.freeze([
  ...UNIT1_DIAGNOSTIC_QUESTION_IDS,
  'ap-chem-atomic-structure-properties-mcq-007',
  'ap-chem-atomic-structure-properties-mcq-008',
  ...UNIT1_REASSESSMENT_QUESTION_IDS,
  'ap-chem-atomic-structure-properties-stimulus-mcq-001',
  'ap-chem-atomic-structure-properties-stimulus-mcq-002',
  'ap-chem-atomic-structure-properties-stimulus-mcq-003',
  'ap-chem-atomic-structure-properties-stimulus-mcq-004',
  'ap-chem-atomic-structure-properties-short-frq-001',
  'ap-chem-atomic-structure-properties-long-frq-001',
])

const review = Object.freeze({
  status: 'draft', revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: '2026-07-24',
  reviewers: Object.freeze([]),
  history: Object.freeze([{ status: 'draft', date: '2026-07-24', actor: 'codex-ai-assisted-draft' }]),
})

const provenance = Object.freeze({
  kind: 'ai-generated',
  name: 'Study AI Helper original Unit 1 assessment blueprint',
  sourceIds: Object.freeze(['ap-chemistry-ced-fall-2024']),
  originalityNote: 'Original assessment arrangement and timing; no released-question wording, values, diagrams, or scoring language were used.',
})

function blueprint({ id, kind, title, description, questionIds, timerMinutes, startLabel, scoringNotice }) {
  return Object.freeze({
    schemaVersion: FIXED_ASSESSMENT_SCHEMA_VERSION,
    id, kind, title, description,
    subjectId: 'ap-chemistry',
    domainId: 'atomic-structure-properties',
    mode: 'testing',
    questionIds, timerMinutes, startLabel, scoringNotice, review, provenance,
  })
}

export const unit1AssessmentBlueprints = Object.freeze([
  blueprint({
    id: UNIT1_DIAGNOSTIC_ID,
    kind: 'diagnostic',
    title: 'Unit 1 diagnostic preview',
    description: 'Six original selected-response questions sample amount conversions, isotope evidence, composition, mixtures, electron configurations, and PES. Feedback remains hidden until submission.',
    questionIds: UNIT1_DIAGNOSTIC_QUESTION_IDS,
    timerMinutes: null,
    startLabel: 'diagnostic',
    scoringNotice: 'This draft diagnostic guides study recommendations. It is not an official AP score prediction.',
  }),
  blueprint({
    id: UNIT1_REASSESSMENT_ID,
    kind: 'reassessment',
    title: 'Unit 1 reassessment preview',
    description: 'A separate six-question form checks the same six skill areas with different original prompts after review and practice.',
    questionIds: UNIT1_REASSESSMENT_QUESTION_IDS,
    timerMinutes: 15,
    startLabel: 'reassessment',
    scoringNotice: 'Compare this result with your study needs, not with an AP score scale. The form is draft and unreviewed.',
  }),
  blueprint({
    id: UNIT1_TIMED_CHECKPOINT_ID,
    kind: 'unit-test',
    title: 'Unit 1 timed checkpoint preview',
    description: 'A 45-minute original checkpoint combines 18 selected-response questions with one short and one long free response across all eight topics.',
    questionIds: UNIT1_TIMED_CHECKPOINT_QUESTION_IDS,
    timerMinutes: 45,
    startLabel: 'timed checkpoint',
    scoringNotice: 'This product-defined unit checkpoint is not an official AP section. Selected responses are scored automatically; both FRQs require rubric self-review.',
  }),
])
