import { FIXED_ASSESSMENT_SCHEMA_VERSION } from './fixedAssessmentSchema.js'

export const UNIT3_DIAGNOSTIC_ID = 'ap-chemistry-unit-3-diagnostic-v1'
export const UNIT3_REASSESSMENT_ID = 'ap-chemistry-unit-3-reassessment-v1'
export const UNIT3_TIMED_CHECKPOINT_ID = 'ap-chemistry-unit-3-timed-checkpoint-v1'

export const UNIT3_DIAGNOSTIC_QUESTION_IDS = Object.freeze([
  'ap-chem-properties-mixtures-mcq-001',
  'ap-chem-properties-mixtures-mcq-002',
  'ap-chem-properties-mixtures-mcq-003',
  'ap-chem-properties-mixtures-mcq-004',
  'ap-chem-properties-mixtures-mcq-023',
  'ap-chem-properties-mixtures-mcq-006',
])

export const UNIT3_REASSESSMENT_QUESTION_IDS = Object.freeze([
  'ap-chem-properties-mixtures-mcq-012',
  'ap-chem-properties-mixtures-mcq-014',
  'ap-chem-properties-mixtures-mcq-018',
  'ap-chem-properties-mixtures-mcq-021',
  'ap-chem-properties-mixtures-mcq-024',
  'ap-chem-properties-mixtures-mcq-033',
])

export const UNIT3_TIMED_CHECKPOINT_QUESTION_IDS = Object.freeze([
  ...UNIT3_DIAGNOSTIC_QUESTION_IDS,
  ...UNIT3_REASSESSMENT_QUESTION_IDS,
  'ap-chem-properties-mixtures-mcq-016',
  'ap-chem-properties-mixtures-mcq-019',
  'ap-chem-properties-mixtures-mcq-025',
  'ap-chem-properties-mixtures-mcq-027',
  'ap-chem-properties-mixtures-mcq-029',
  'ap-chem-properties-mixtures-mcq-031',
  'ap-chem-properties-mixtures-mcq-035',
  'ap-chem-properties-mixtures-stimulus-mcq-002',
  'ap-chem-properties-mixtures-short-frq-005',
  'ap-chem-properties-mixtures-long-frq-003',
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
  name: 'Study AI Helper original Unit 3 assessment blueprint',
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
    domainId: 'properties-substances-mixtures',
    mode: 'testing',
    questionIds,
    timerMinutes,
    startLabel,
    scoringNotice,
    review,
    provenance,
  })
}

export const unit3AssessmentBlueprints = Object.freeze([
  blueprint({
    id: UNIT3_DIAGNOSTIC_ID,
    kind: 'diagnostic',
    title: 'Unit 3 diagnostic preview',
    description: 'Six original selected-response questions sample intermolecular forces, solid structure, ideal and nonideal gases, solution concentration, and photon energy. Feedback remains hidden until submission.',
    questionIds: UNIT3_DIAGNOSTIC_QUESTION_IDS,
    timerMinutes: null,
    startLabel: 'diagnostic',
    scoringNotice: 'This draft diagnostic guides study recommendations. It is not an official AP score prediction.',
  }),
  blueprint({
    id: UNIT3_REASSESSMENT_ID,
    kind: 'reassessment',
    title: 'Unit 3 reassessment preview',
    description: 'A separate six-question form checks the same six skill areas with different original prompts after review and practice.',
    questionIds: UNIT3_REASSESSMENT_QUESTION_IDS,
    timerMinutes: 15,
    startLabel: 'reassessment',
    scoringNotice: 'Compare this result with your study needs, not with an AP score scale. The form is draft and unreviewed.',
  }),
  blueprint({
    id: UNIT3_TIMED_CHECKPOINT_ID,
    kind: 'unit-test',
    title: 'Unit 3 timed checkpoint preview',
    description: 'A 45-minute original unit checkpoint combines 20 selected-response questions spanning all 13 topics with one short and one long free response.',
    questionIds: UNIT3_TIMED_CHECKPOINT_QUESTION_IDS,
    timerMinutes: 45,
    startLabel: 'timed checkpoint',
    scoringNotice: 'This product-defined unit checkpoint is not an official AP section. Selected responses are scored automatically; both FRQs require rubric self-review.',
  }),
])

export function getUnit3AssessmentBlueprint(id) {
  return unit3AssessmentBlueprints.find((item) => item.id === id) || null
}

export function createUnit3AssessmentUrl(id) {
  return getUnit3AssessmentBlueprint(id)
    ? `/questions.html?topic=ap-chemistry&domain=properties-substances-mixtures&assessment=${encodeURIComponent(id)}`
    : null
}
