import { createApChemistryAssessmentSummary } from './apChemistryLearningLoop.js'
import {
  UNIT7_DIAGNOSTIC_ID,
  UNIT7_DIAGNOSTIC_QUESTION_IDS,
  UNIT7_REASSESSMENT_ID,
  UNIT7_REASSESSMENT_QUESTION_IDS,
  UNIT7_TIMED_CHECKPOINT_ID,
  getUnit7AssessmentBlueprint,
} from './unit7AssessmentBlueprints.js'

export { UNIT7_DIAGNOSTIC_ID, UNIT7_DIAGNOSTIC_QUESTION_IDS }

export function selectUnit7DiagnosticQuestions(questions) {
  const byId = new Map(questions.map((question) => [question.id, question]))
  return UNIT7_DIAGNOSTIC_QUESTION_IDS.map((id) => byId.get(id)).filter(Boolean)
}

export function selectUnit7ReassessmentQuestions(questions) {
  const byId = new Map(questions.map((question) => [question.id, question]))
  return UNIT7_REASSESSMENT_QUESTION_IDS.map((id) => byId.get(id)).filter(Boolean)
}

export function createUnit7DiagnosticSummary({ grade, questions }) {
  return createApChemistryAssessmentSummary({
    blueprint: getUnit7AssessmentBlueprint(UNIT7_DIAGNOSTIC_ID),
    grade,
    questions,
  })
}

export function createUnit7ReassessmentSummary({ grade, questions }) {
  return createApChemistryAssessmentSummary({
    blueprint: getUnit7AssessmentBlueprint(UNIT7_REASSESSMENT_ID),
    grade,
    questions,
  })
}

export function createUnit7TimedCheckpointSummary({ grade, questions }) {
  return createApChemistryAssessmentSummary({
    blueprint: getUnit7AssessmentBlueprint(UNIT7_TIMED_CHECKPOINT_ID),
    grade,
    questions,
  })
}
