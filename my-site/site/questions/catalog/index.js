import { assertValidQuestionCatalog } from './questionSchema.js'
import { apChemistryEquilibriumQuestions } from './apChemistryEquilibriumQuestions.js'
import { apChemistryAcidsBasesQuestions } from './apChemistryAcidsBasesQuestions.js'
import { apChemistryPropertiesMixturesQuestions } from './apChemistryPropertiesMixturesQuestions.js'
import { apChemistryChemicalReactionsQuestions } from './apChemistryChemicalReactionsQuestions.js'
import { apChemistryKineticsQuestions } from './apChemistryKineticsQuestions.js'
import { apChemistryThermochemistryQuestions } from './apChemistryThermochemistryQuestions.js'
import { apChemistryThermodynamicsElectrochemistryQuestions } from './apChemistryThermodynamicsElectrochemistryQuestions.js'
import { apChemistryAtomicStructurePropertiesQuestions } from './apChemistryAtomicStructurePropertiesQuestions.js'
import { apChemistryCompoundStructurePropertiesQuestions } from './apChemistryCompoundStructurePropertiesQuestions.js'
import { publishedQuestions } from './publishedQuestions.js'
import { getEditorialResource } from '../../content/resourceCatalog.js'
import { createResourceUrl } from '../../content/resourceRoutes.js'
export { getPublishedQuestionCount } from './publishedQuestionCounts.js'

export const canonicalQuestions = Object.freeze(assertValidQuestionCatalog([
  ...publishedQuestions,
  ...apChemistryEquilibriumQuestions,
  ...apChemistryAcidsBasesQuestions,
  ...apChemistryPropertiesMixturesQuestions,
  ...apChemistryChemicalReactionsQuestions,
  ...apChemistryKineticsQuestions,
  ...apChemistryThermochemistryQuestions,
  ...apChemistryThermodynamicsElectrochemistryQuestions,
  ...apChemistryAtomicStructurePropertiesQuestions,
  ...apChemistryCompoundStructurePropertiesQuestions,
]))

export function toPracticeQuestion(question) {
  const formulaReferences = (question.referenceRequirements?.formulaIds || [])
    .map((id) => getEditorialResource(id, { includeDrafts: true }))
    .filter(Boolean)
    .map((formula) => ({ id: formula.id, title: formula.title, url: createResourceUrl(formula) }))
  const practiceQuestion = {
    id: question.id,
    topic: question.taxonomy.subjectId,
    renderer: question.renderer,
    prompt: question.prompt,
    explanation: question.explanation,
    taxonomy: question.taxonomy,
    source: question.source,
    content: question.content,
    tags: question.tags || [],
    classifications: {
      questionType: [question.taxonomy.questionTypeId],
      domain: [question.taxonomy.domainId],
      skill: [question.taxonomy.skillId],
      ...(question.responseFormat ? { responseFormat: [question.responseFormat] } : {}),
    },
    difficulty: question.difficulty,
    hints: question.hints || [],
    misconceptionIds: question.misconceptionIds || [],
    referenceRequirements: question.referenceRequirements,
    formulaReferences,
    responseFormat: question.responseFormat,
    stimulusId: question.stimulusId,
    rubricId: question.rubricId,
    modelAnswer: question.answer.modelAnswer,
    parts: question.parts || [],
    stimulus: question.stimulusId ? getEditorialResource(question.stimulusId, { includeDrafts: true }) : null,
    rubric: question.rubricId ? getEditorialResource(question.rubricId, { includeDrafts: true }) : null,
  }

  if (question.answer.kind === 'selected-response') {
    return {
      ...practiceQuestion,
      options: question.answer.options,
      correctOptionId: question.answer.correctOptionId,
    }
  }
  if (question.answer.kind === 'student-produced-response') {
    return { ...practiceQuestion, correctAnswer: question.answer.acceptedAnswers[0] }
  }
  return { ...practiceQuestion, placeholderGrading: question.answer.grading === 'placeholder' ? 'always-incorrect' : undefined }
}

export const canonicalPracticeQuestions = Object.freeze(canonicalQuestions
  .filter((question) => question.content.status === 'published')
  .map(toPracticeQuestion))

export const draftCanonicalPracticeQuestions = Object.freeze(canonicalQuestions
  .filter((question) => question.content.status === 'draft')
  .map(toPracticeQuestion))
