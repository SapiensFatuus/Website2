import { validateEditorialCatalog, validateMisconceptionCatalog } from './editorialSchema.js'
import { validateQuestionCatalog } from '../questions/catalog/questionSchema.js'

export function validateContentBundle({ resources, questions, misconceptions = [] }) {
  const errors = []
  const resourceResult = validateEditorialCatalog(resources)
  const questionResult = validateQuestionCatalog(questions)
  const misconceptionResult = validateMisconceptionCatalog(misconceptions)
  resourceResult.errors.forEach((error) => errors.push(`resource: ${error}`))
  questionResult.errors.forEach((error) => errors.push(`question: ${error}`))
  misconceptionResult.errors.forEach((error) => errors.push(`misconception: ${error}`))

  const resourcesById = new Map(resources.map((resource) => [resource.id, resource]))
  const questionsById = new Map(questions.map((question) => [question.id, question]))
  const misconceptionIds = new Set(misconceptions.map(({ id }) => id))

  questions.forEach((question) => {
    question.referenceRequirements?.formulaIds?.forEach((id) => {
      const formula = resourcesById.get(id)
      if (!formula || formula.kind !== 'formula') errors.push(`${question.id}: unknown formula ${id}`)
      else if (question.content.status === 'published' && formula.review.status !== 'published') {
        errors.push(`${question.id}: published questions require published formula references`)
      }
    })
    question.misconceptionIds?.forEach((id) => {
      if (!misconceptionIds.has(id)) errors.push(`${question.id}: unknown misconception ${id}`)
    })
    if (question.stimulusId) {
      const stimulus = resourcesById.get(question.stimulusId)
      if (!stimulus || stimulus.kind !== 'stimulus') errors.push(`${question.id}: unknown stimulus ${question.stimulusId}`)
      else if (question.content.status === 'published' && stimulus.review.status !== 'published') {
        errors.push(`${question.id}: published questions require a published stimulus`)
      }
    }
    if (question.rubricId) {
      const rubric = resourcesById.get(question.rubricId)
      if (!rubric || rubric.kind !== 'rubric') errors.push(`${question.id}: unknown rubric ${question.rubricId}`)
      else {
        if (rubric.questionId !== question.id) errors.push(`${question.id}: rubric points to ${rubric.questionId}`)
        const questionPartIds = question.parts?.map(({ id }) => id) || []
        const rubricPartIds = rubric.parts.map(({ id }) => id)
        if (questionPartIds.join('|') !== rubricPartIds.join('|')) errors.push(`${question.id}: question and rubric parts must match in order`)
        if (question.content.status === 'published' && rubric.review.status !== 'published') {
          errors.push(`${question.id}: published FRQs require a published rubric`)
        }
      }
    }
  })

  resources.filter(({ kind }) => kind === 'lesson').forEach((lesson) => {
    lesson.misconceptions.forEach(({ id }) => {
      if (!misconceptionIds.has(id)) errors.push(`${lesson.id}: unknown misconception ${id}`)
    })
  })

  resources.filter(({ kind }) => kind === 'rubric').forEach((rubric) => {
    const question = questionsById.get(rubric.questionId)
    if (!question) errors.push(`${rubric.id}: rubric references unknown question ${rubric.questionId}`)
    else if (question.rubricId !== rubric.id) errors.push(`${rubric.id}: question does not link back to rubric`)
  })

  return { valid: errors.length === 0, errors }
}

export function assertValidContentBundle(bundle) {
  const result = validateContentBundle(bundle)
  if (!result.valid) throw new Error(`Content bundle validation failed:\n- ${result.errors.join('\n- ')}`)
  return bundle
}
