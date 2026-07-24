import { getDomain } from '../taxonomy/contentTaxonomy.js'
import { hasAcceptedTimingCalibration } from './assessmentPilotEvidence.js'

export const AP_CHEMISTRY_UNIT_DRAFT_TARGETS = Object.freeze({
  discreteMultipleChoice: 35,
  stimulusSets: 5,
  linkedQuestionsPerStimulusMinimum: 3,
  linkedQuestionsPerStimulusMaximum: 4,
  shortFreeResponse: 8,
  longFreeResponse: 3,
})
export const UNIT7_DRAFT_TARGETS = AP_CHEMISTRY_UNIT_DRAFT_TARGETS

function gate(id, actual, target, detail, pass = actual >= target) {
  return Object.freeze({ id, pass, actual, target, remaining: Math.max(0, target - actual), detail })
}

function hasTwoReviewers(record) {
  const status = record.content?.status || record.review?.status
  const reviewers = record.content?.reviewers || record.review?.reviewers || []
  return ['approved', 'published'].includes(status) && new Set(reviewers).size >= 2
}

export function createApChemistryUnitReadinessReport({
  unitId,
  questions = [],
  resources = [],
  exemplars = [],
  assessments = [],
  pilotEvidence = [],
  targets = AP_CHEMISTRY_UNIT_DRAFT_TARGETS,
} = {}) {
  const unit = getDomain('ap-chemistry', unitId)
  if (!unit) throw new TypeError(`Unknown AP Chemistry unit: ${unitId || '(missing)'}`)
  const unitQuestions = questions.filter((question) => (
    question.taxonomy?.subjectId === 'ap-chemistry' && question.taxonomy?.domainId === unitId
  ))
  const unitResources = resources.filter((resource) => (
    resource.alignment?.subjectId === 'ap-chemistry' && resource.alignment?.domainId === unitId
  ))
  const unitExemplars = exemplars.filter((record) => (
    record.alignment?.subjectId === 'ap-chemistry' && record.alignment?.domainId === unitId
  ))
  const unitAssessments = assessments.filter((assessment) => (
    assessment.subjectId === 'ap-chemistry' && assessment.domainId === unitId
  ))
  const assessmentIds = new Set(unitAssessments.map(({ id }) => id))
  const assessmentKinds = new Set(unitAssessments.map(({ kind }) => kind))
  const completeFixedAssessmentKinds = ['diagnostic', 'reassessment', 'unit-test']
    .filter((kind) => assessmentKinds.has(kind))
  const unitPilotEvidence = pilotEvidence.filter((record) => (
    record.subjectId === 'ap-chemistry'
    && record.unitId === unitId
    && assessmentIds.has(record.assessmentId)
  ))
  const pilotAssessmentIds = new Set(unitPilotEvidence.map(({ assessmentId }) => assessmentId))
  const calibratedAssessmentIds = new Set(unitPilotEvidence
    .filter(hasAcceptedTimingCalibration)
    .map(({ assessmentId }) => assessmentId))
  const topicIds = new Set(unit.skills.map((skill) => skill.id))
  const discreteQuestions = unitQuestions.filter((question) => question.renderer === 'multiple-choice' && !question.stimulusId)
  const linkedQuestions = unitQuestions.filter((question) => question.renderer === 'multiple-choice' && question.stimulusId)
  const shortQuestions = unitQuestions.filter((question) => question.responseFormat === 'short-frq')
  const longQuestions = unitQuestions.filter((question) => question.responseFormat === 'long-frq')
  const stimulusResources = new Map(unitResources.filter((resource) => resource.kind === 'stimulus').map((resource) => [resource.id, resource]))
  const linkedByStimulus = new Map()
  linkedQuestions.forEach((question) => linkedByStimulus.set(question.stimulusId, (linkedByStimulus.get(question.stimulusId) || 0) + 1))
  const validStimulusSets = [...linkedByStimulus].filter(([id, count]) => (
    stimulusResources.has(id)
    && count >= targets.linkedQuestionsPerStimulusMinimum
    && count <= targets.linkedQuestionsPerStimulusMaximum
  ))
  const questionTopicCoverage = new Set(unitQuestions.map((question) => question.taxonomy?.skillId).filter((id) => topicIds.has(id)))
  const lessonTopicCoverage = new Set(unitResources
    .filter((resource) => resource.kind === 'lesson')
    .flatMap((resource) => resource.alignment?.skillIds || [])
    .filter((id) => topicIds.has(id)))
  const freeResponseIds = new Set([...shortQuestions, ...longQuestions].map(({ id }) => id))
  const exemplarCoveredFrqIds = new Set(unitExemplars
    .filter((record) => freeResponseIds.has(record.questionId) && record.responses?.length === 3)
    .map((record) => record.questionId))
  const reviewRecords = [...unitQuestions, ...unitResources, ...unitExemplars]
  const fullyReviewedRecords = reviewRecords.filter(hasTwoReviewers)
  const formulasById = new Map(unitResources.filter((resource) => resource.kind === 'formula').map((resource) => [resource.id, resource]))
  const questionsWithReferenceCoverage = unitQuestions.filter((question) => {
    const requirements = question.referenceRequirements
    return requirements
      && requirements.formulaIds.length + requirements.priorKnowledge.length > 0
      && requirements.formulaIds.every((id) => formulasById.has(id))
  })
  const referencedFormulaIds = new Set(unitQuestions.flatMap((question) => question.referenceRequirements?.formulaIds || []))
  const referencedFormulas = [...referencedFormulaIds].map((id) => formulasById.get(id)).filter(Boolean)
  const fullyReviewedFormulas = referencedFormulas.filter(hasTwoReviewers)

  const gates = Object.freeze([
    gate('discrete-multiple-choice-volume', discreteQuestions.length, targets.discreteMultipleChoice, 'Original discrete multiple-choice drafts.'),
    gate('stimulus-set-volume', validStimulusSets.length, targets.stimulusSets, 'Stimulus resources with three or four linked multiple-choice drafts.'),
    gate('short-free-response-volume', shortQuestions.length, targets.shortFreeResponse, 'Original short free-response drafts with linked rubrics.'),
    gate('long-free-response-volume', longQuestions.length, targets.longFreeResponse, 'Original long free-response drafts with linked rubrics.'),
    gate('frq-exemplar-coverage', exemplarCoveredFrqIds.size, freeResponseIds.size, 'Free-response drafts with beginning, developing, and strong response exemplars.'),
    gate('question-topic-coverage', questionTopicCoverage.size, topicIds.size, `Canonical Unit ${unit.officialNumber} topics represented by scored drafts.`),
    gate('lesson-topic-coverage', lessonTopicCoverage.size, topicIds.size, `Canonical Unit ${unit.officialNumber} topics represented by original lessons.`),
    gate('question-reference-coverage', questionsWithReferenceCoverage.length, unitQuestions.length, 'Questions linked to valid formula entries or explicitly classified prior knowledge.'),
    gate('fixed-assessment-coverage', completeFixedAssessmentKinds.length, 3, 'Registered diagnostic, reassessment, and timed unit-test blueprints.'),
    gate('two-reviewer-approval', fullyReviewedRecords.length, reviewRecords.length, 'Questions, supporting resources, and exemplar sets with approved/published status and two distinct reviewers.'),
    gate('reference-entry-review', fullyReviewedFormulas.length, referencedFormulas.length, 'Formula entries used by questions with approved/published status and two distinct reviewers.'),
    gate('aggregate-pilot-evidence', pilotAssessmentIds.size, 3, 'Privacy-safe aggregate pilot evidence for each fixed assessment; student-level data is forbidden.'),
    gate('timing-calibration-approval', calibratedAssessmentIds.size, 3, 'Pilot timing decisions accepted by two independent reviewers for each fixed assessment.'),
  ])

  return Object.freeze({
    unitId,
    unitNumber: unit.officialNumber,
    unitLabel: unit.label,
    ready: gates.every((item) => item.pass),
    gates,
    counts: Object.freeze({
      questions: unitQuestions.length,
      resources: unitResources.length,
      discreteMultipleChoice: discreteQuestions.length,
      linkedMultipleChoice: linkedQuestions.length,
      validStimulusSets: validStimulusSets.length,
      shortFreeResponse: shortQuestions.length,
      longFreeResponse: longQuestions.length,
      frqExemplarSets: unitExemplars.length,
      freeResponsesWithExemplars: exemplarCoveredFrqIds.size,
      reviewedContentRecords: fullyReviewedRecords.length,
      reviewRequiredContentRecords: reviewRecords.length,
      questionsWithReferenceCoverage: questionsWithReferenceCoverage.length,
      referencedFormulaEntries: referencedFormulas.length,
      reviewedFormulaEntries: fullyReviewedFormulas.length,
      fixedAssessmentBlueprints: unitAssessments.length,
      pilotEvidenceRecords: unitPilotEvidence.length,
      timingCalibrationsAccepted: calibratedAssessmentIds.size,
    }),
  })
}

export function createUnit7ReadinessReport(bundle = {}) {
  return createApChemistryUnitReadinessReport({ unitId: 'equilibrium', ...bundle })
}
