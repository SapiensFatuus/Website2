import { FIXED_ASSESSMENT_SCHEMA_VERSION } from './fixedAssessmentSchema.js'

export const UNIT2_DIAGNOSTIC_ID = 'ap-chemistry-unit-2-diagnostic-v1'
export const UNIT2_REASSESSMENT_ID = 'ap-chemistry-unit-2-reassessment-v1'
export const UNIT2_TIMED_CHECKPOINT_ID = 'ap-chemistry-unit-2-timed-checkpoint-v1'

export const UNIT2_DIAGNOSTIC_QUESTION_IDS = Object.freeze([
  'ap-chem-compound-structure-properties-mcq-001',
  'ap-chem-compound-structure-properties-mcq-002',
  'ap-chem-compound-structure-properties-mcq-003',
  'ap-chem-compound-structure-properties-mcq-004',
  'ap-chem-compound-structure-properties-mcq-005',
  'ap-chem-compound-structure-properties-mcq-006',
  'ap-chem-compound-structure-properties-mcq-007',
])

export const UNIT2_REASSESSMENT_QUESTION_IDS = Object.freeze([
  'ap-chem-compound-structure-properties-mcq-008',
  'ap-chem-compound-structure-properties-mcq-009',
  'ap-chem-compound-structure-properties-mcq-010',
  'ap-chem-compound-structure-properties-mcq-011',
  'ap-chem-compound-structure-properties-mcq-012',
  'ap-chem-compound-structure-properties-mcq-013',
  'ap-chem-compound-structure-properties-mcq-014',
])

export const UNIT2_TIMED_CHECKPOINT_QUESTION_IDS = Object.freeze([
  ...UNIT2_DIAGNOSTIC_QUESTION_IDS,
  ...UNIT2_REASSESSMENT_QUESTION_IDS,
  'ap-chem-compound-structure-properties-stimulus-mcq-001',
  'ap-chem-compound-structure-properties-stimulus-mcq-002',
  'ap-chem-compound-structure-properties-stimulus-mcq-003',
  'ap-chem-compound-structure-properties-stimulus-mcq-004',
  'ap-chem-compound-structure-properties-short-frq-001',
  'ap-chem-compound-structure-properties-long-frq-001',
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
  name: 'Study AI Helper original Unit 2 assessment blueprint',
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
    domainId: 'compound-structure-properties',
    mode: 'testing',
    questionIds,
    timerMinutes,
    startLabel,
    scoringNotice,
    review,
    provenance,
  })
}

export const unit2AssessmentBlueprints = Object.freeze([
  blueprint({
    id: UNIT2_DIAGNOSTIC_ID,
    kind: 'diagnostic',
    title: 'Unit 2 diagnostic preview',
    description: 'Seven original selected-response questions sample bonding, potential energy, solid structures, Lewis diagrams, resonance, and molecular geometry. Feedback remains hidden until submission.',
    questionIds: UNIT2_DIAGNOSTIC_QUESTION_IDS,
    timerMinutes: null,
    startLabel: 'diagnostic',
    scoringNotice: 'This draft diagnostic guides study recommendations. It is not an official AP score prediction.',
  }),
  blueprint({
    id: UNIT2_REASSESSMENT_ID,
    kind: 'reassessment',
    title: 'Unit 2 reassessment preview',
    description: 'A disjoint seven-question form checks the same seven canonical topics with different original prompts after review and practice.',
    questionIds: UNIT2_REASSESSMENT_QUESTION_IDS,
    timerMinutes: 18,
    startLabel: 'reassessment',
    scoringNotice: 'Compare this result with your study needs, not with an AP score scale. The form is draft and unreviewed.',
  }),
  blueprint({
    id: UNIT2_TIMED_CHECKPOINT_ID,
    kind: 'unit-test',
    title: 'Unit 2 timed checkpoint preview',
    description: 'A 40-minute original checkpoint combines 18 selected-response questions with one short and one long free response across all seven topics.',
    questionIds: UNIT2_TIMED_CHECKPOINT_QUESTION_IDS,
    timerMinutes: 40,
    startLabel: 'timed checkpoint',
    scoringNotice: 'This product-defined unit checkpoint is not an official AP section. Selected responses are scored automatically; both FRQs require rubric self-review.',
  }),
])

