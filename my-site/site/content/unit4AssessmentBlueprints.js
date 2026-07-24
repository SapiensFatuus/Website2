import { FIXED_ASSESSMENT_SCHEMA_VERSION } from './fixedAssessmentSchema.js'

export const UNIT4_DIAGNOSTIC_ID = 'ap-chemistry-unit-4-diagnostic-v1'
export const UNIT4_REASSESSMENT_ID = 'ap-chemistry-unit-4-reassessment-v1'
export const UNIT4_TIMED_CHECKPOINT_ID = 'ap-chemistry-unit-4-timed-checkpoint-v1'

export const UNIT4_DIAGNOSTIC_QUESTION_IDS = Object.freeze([
  'ap-chem-chemical-reactions-mcq-001',
  'ap-chem-chemical-reactions-mcq-002',
  'ap-chem-chemical-reactions-mcq-003',
  'ap-chem-chemical-reactions-mcq-004',
  'ap-chem-chemical-reactions-mcq-005',
  'ap-chem-chemical-reactions-mcq-006',
])

export const UNIT4_REASSESSMENT_QUESTION_IDS = Object.freeze([
  'ap-chem-chemical-reactions-mcq-007',
  'ap-chem-chemical-reactions-mcq-008',
  'ap-chem-chemical-reactions-mcq-009',
  'ap-chem-chemical-reactions-mcq-010',
  'ap-chem-chemical-reactions-mcq-011',
  'ap-chem-chemical-reactions-mcq-012',
])

export const UNIT4_TIMED_CHECKPOINT_QUESTION_IDS = Object.freeze([
  ...UNIT4_DIAGNOSTIC_QUESTION_IDS,
  ...UNIT4_REASSESSMENT_QUESTION_IDS,
  'ap-chem-chemical-reactions-stimulus-mcq-001',
  'ap-chem-chemical-reactions-stimulus-mcq-002',
  'ap-chem-chemical-reactions-stimulus-mcq-003',
  'ap-chem-chemical-reactions-stimulus-mcq-004',
  'ap-chem-chemical-reactions-short-frq-001',
  'ap-chem-chemical-reactions-long-frq-001',
])

const review = Object.freeze({
  status: 'draft',
  revision: 1,
  authoredBy: 'codex-ai-assisted-draft',
  updatedAt: '2026-07-24',
  reviewers: Object.freeze([]),
  history: Object.freeze([{ status: 'draft', date: '2026-07-24', actor: 'codex-ai-assisted-draft' }]),
})

const provenance = Object.freeze({
  kind: 'ai-generated',
  name: 'Study AI Helper original Unit 4 assessment blueprint',
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
    domainId: 'chemical-reactions',
    mode: 'testing',
    questionIds,
    timerMinutes,
    startLabel,
    scoringNotice,
    review,
    provenance,
  })
}

export const unit4AssessmentBlueprints = Object.freeze([
  blueprint({
    id: UNIT4_DIAGNOSTIC_ID,
    kind: 'diagnostic',
    title: 'Unit 4 diagnostic preview',
    description: 'Six original selected-response questions sample reaction evidence, ionic equations, particle representations, physical and chemical changes, reaction types, and redox. Feedback remains hidden until submission.',
    questionIds: UNIT4_DIAGNOSTIC_QUESTION_IDS,
    timerMinutes: null,
    startLabel: 'diagnostic',
    scoringNotice: 'This draft diagnostic guides study recommendations. It is not an official AP score prediction.',
  }),
  blueprint({
    id: UNIT4_REASSESSMENT_ID,
    kind: 'reassessment',
    title: 'Unit 4 reassessment preview',
    description: 'A separate six-question form checks the same six skill areas with different original prompts after review and practice.',
    questionIds: UNIT4_REASSESSMENT_QUESTION_IDS,
    timerMinutes: 15,
    startLabel: 'reassessment',
    scoringNotice: 'Compare this result with your study needs, not with an AP score scale. The form is draft and unreviewed.',
  }),
  blueprint({
    id: UNIT4_TIMED_CHECKPOINT_ID,
    kind: 'unit-test',
    title: 'Unit 4 timed checkpoint preview',
    description: 'A 40-minute original checkpoint combines 16 selected-response questions with one short and one long free response across all nine topics.',
    questionIds: UNIT4_TIMED_CHECKPOINT_QUESTION_IDS,
    timerMinutes: 40,
    startLabel: 'timed checkpoint',
    scoringNotice: 'This product-defined unit checkpoint is not an official AP section. Selected responses are scored automatically; both FRQs require rubric self-review.',
  }),
])
