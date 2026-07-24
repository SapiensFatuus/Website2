import { FIXED_ASSESSMENT_SCHEMA_VERSION } from './fixedAssessmentSchema.js'

export const UNIT8_DIAGNOSTIC_ID = 'ap-chemistry-unit-8-diagnostic-v1'
export const UNIT8_REASSESSMENT_ID = 'ap-chemistry-unit-8-reassessment-v1'
export const UNIT8_TIMED_CHECKPOINT_ID = 'ap-chemistry-unit-8-timed-checkpoint-v1'

export const UNIT8_DIAGNOSTIC_QUESTION_IDS = Object.freeze([
  'ap-chem-acids-bases-mcq-021',
  'ap-chem-acids-bases-mcq-022',
  'ap-chem-acids-bases-mcq-023',
  'ap-chem-acids-bases-mcq-024',
  'ap-chem-acids-bases-mcq-025',
  'ap-chem-acids-bases-mcq-026',
])

export const UNIT8_REASSESSMENT_QUESTION_IDS = Object.freeze([
  'ap-chem-acids-bases-mcq-012',
  'ap-chem-acids-bases-mcq-013',
  'ap-chem-acids-bases-mcq-014',
  'ap-chem-acids-bases-mcq-015',
  'ap-chem-acids-bases-mcq-016',
  'ap-chem-acids-bases-mcq-017',
])

export const UNIT8_TIMED_CHECKPOINT_QUESTION_IDS = Object.freeze([
  ...UNIT8_DIAGNOSTIC_QUESTION_IDS,
  ...UNIT8_REASSESSMENT_QUESTION_IDS,
  'ap-chem-acids-bases-mcq-027',
  'ap-chem-acids-bases-mcq-028',
  'ap-chem-acids-bases-mcq-029',
  'ap-chem-acids-bases-mcq-030',
  'ap-chem-acids-bases-mcq-031',
  'ap-chem-acids-bases-mcq-032',
  'ap-chem-acids-bases-stimulus-mcq-013',
  'ap-chem-acids-bases-stimulus-mcq-017',
  'ap-chem-acids-bases-short-frq-005',
  'ap-chem-acids-bases-long-frq-003',
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
  name: 'Study AI Helper original Unit 8 assessment blueprint',
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
    domainId: 'acids-bases',
    mode: 'testing',
    questionIds,
    timerMinutes,
    startLabel,
    scoringNotice,
    review,
    provenance,
  })
}

export const unit8AssessmentBlueprints = Object.freeze([
  blueprint({
    id: UNIT8_DIAGNOSTIC_ID,
    kind: 'diagnostic',
    title: 'Unit 8 diagnostic preview',
    description: 'Six original selected-response questions sample proton transfer, strong-solution pH, weak equilibrium, buffer reaction, titration, and structural acidity. Feedback remains hidden until submission.',
    questionIds: UNIT8_DIAGNOSTIC_QUESTION_IDS,
    timerMinutes: null,
    startLabel: 'diagnostic',
    scoringNotice: 'This draft diagnostic guides study recommendations. It is not an official AP score prediction.',
  }),
  blueprint({
    id: UNIT8_REASSESSMENT_ID,
    kind: 'reassessment',
    title: 'Unit 8 reassessment preview',
    description: 'A separate six-question form checks the same six skill areas with different original prompts after review and practice.',
    questionIds: UNIT8_REASSESSMENT_QUESTION_IDS,
    timerMinutes: 15,
    startLabel: 'reassessment',
    scoringNotice: 'Compare this result with your study needs, not with an AP score scale. The form is draft and unreviewed.',
  }),
  blueprint({
    id: UNIT8_TIMED_CHECKPOINT_ID,
    kind: 'unit-test',
    title: 'Unit 8 timed checkpoint preview',
    description: 'A 45-minute original unit checkpoint combines 20 selected-response questions spanning all 11 topics with one short and one long free response.',
    questionIds: UNIT8_TIMED_CHECKPOINT_QUESTION_IDS,
    timerMinutes: 45,
    startLabel: 'timed checkpoint',
    scoringNotice: 'This product-defined unit checkpoint is not an official AP section. Selected responses are scored automatically; both FRQs require rubric self-review.',
  }),
])

export function getUnit8AssessmentBlueprint(id) {
  return unit8AssessmentBlueprints.find((item) => item.id === id) || null
}

export function createUnit8AssessmentUrl(id) {
  return getUnit8AssessmentBlueprint(id)
    ? `/questions.html?topic=ap-chemistry&domain=acids-bases&assessment=${encodeURIComponent(id)}`
    : null
}
