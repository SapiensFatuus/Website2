import { FIXED_ASSESSMENT_SCHEMA_VERSION } from './fixedAssessmentSchema.js'

export const UNIT5_DIAGNOSTIC_ID = 'ap-chemistry-unit-5-diagnostic-v1'
export const UNIT5_REASSESSMENT_ID = 'ap-chemistry-unit-5-reassessment-v1'
export const UNIT5_TIMED_CHECKPOINT_ID = 'ap-chemistry-unit-5-timed-checkpoint-v1'

export const UNIT5_DIAGNOSTIC_QUESTION_IDS = Object.freeze([
  'ap-chem-kinetics-mcq-001',
  'ap-chem-kinetics-mcq-002',
  'ap-chem-kinetics-mcq-003',
  'ap-chem-kinetics-mcq-004',
  'ap-chem-kinetics-mcq-005',
  'ap-chem-kinetics-mcq-006',
])

export const UNIT5_REASSESSMENT_QUESTION_IDS = Object.freeze([
  'ap-chem-kinetics-mcq-009',
  'ap-chem-kinetics-mcq-010',
  'ap-chem-kinetics-mcq-011',
  'ap-chem-kinetics-mcq-012',
  'ap-chem-kinetics-mcq-013',
  'ap-chem-kinetics-mcq-014',
])

export const UNIT5_TIMED_CHECKPOINT_QUESTION_IDS = Object.freeze([
  ...UNIT5_DIAGNOSTIC_QUESTION_IDS,
  'ap-chem-kinetics-mcq-007',
  'ap-chem-kinetics-mcq-008',
  ...UNIT5_REASSESSMENT_QUESTION_IDS,
  'ap-chem-kinetics-stimulus-mcq-001',
  'ap-chem-kinetics-stimulus-mcq-002',
  'ap-chem-kinetics-stimulus-mcq-003',
  'ap-chem-kinetics-stimulus-mcq-004',
  'ap-chem-kinetics-short-frq-001',
  'ap-chem-kinetics-long-frq-001',
])

const review = Object.freeze({
  status: 'draft', revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: '2026-07-24',
  reviewers: Object.freeze([]),
  history: Object.freeze([{ status: 'draft', date: '2026-07-24', actor: 'codex-ai-assisted-draft' }]),
})

const provenance = Object.freeze({
  kind: 'ai-generated',
  name: 'Study AI Helper original Unit 5 assessment blueprint',
  sourceIds: Object.freeze(['ap-chemistry-ced-fall-2024']),
  originalityNote: 'Original assessment arrangement and timing; no released-question wording, values, diagrams, or scoring language were used.',
})

function blueprint({ id, kind, title, description, questionIds, timerMinutes, startLabel, scoringNotice }) {
  return Object.freeze({
    schemaVersion: FIXED_ASSESSMENT_SCHEMA_VERSION,
    id,
    kind,
    title,
    description,
    subjectId: 'ap-chemistry',
    domainId: 'kinetics',
    mode: 'testing',
    questionIds,
    timerMinutes,
    startLabel,
    scoringNotice,
    review,
    provenance,
  })
}

export const unit5AssessmentBlueprints = Object.freeze([
  blueprint({
    id: UNIT5_DIAGNOSTIC_ID,
    kind: 'diagnostic',
    title: 'Unit 5 diagnostic preview',
    description: 'Six original selected-response questions sample reaction rates, elementary steps, collision theory, energy profiles, mechanisms, and catalysis. Feedback remains hidden until submission.',
    questionIds: UNIT5_DIAGNOSTIC_QUESTION_IDS,
    timerMinutes: null,
    startLabel: 'diagnostic',
    scoringNotice: 'This draft diagnostic guides study recommendations. It is not an official AP score prediction.',
  }),
  blueprint({
    id: UNIT5_REASSESSMENT_ID,
    kind: 'reassessment',
    title: 'Unit 5 reassessment preview',
    description: 'A separate six-question form checks the same six skill areas with different original prompts after review and practice.',
    questionIds: UNIT5_REASSESSMENT_QUESTION_IDS,
    timerMinutes: 15,
    startLabel: 'reassessment',
    scoringNotice: 'Compare this result with your study needs, not with an AP score scale. The form is draft and unreviewed.',
  }),
  blueprint({
    id: UNIT5_TIMED_CHECKPOINT_ID,
    kind: 'unit-test',
    title: 'Unit 5 timed checkpoint preview',
    description: 'A 45-minute original checkpoint combines 18 selected-response questions with one short and one long free response across all 11 topics.',
    questionIds: UNIT5_TIMED_CHECKPOINT_QUESTION_IDS,
    timerMinutes: 45,
    startLabel: 'timed checkpoint',
    scoringNotice: 'This product-defined unit checkpoint is not an official AP section. Selected responses are scored automatically; both FRQs require rubric self-review.',
  }),
])
