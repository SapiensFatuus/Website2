import { assertValidQuestionCatalog } from './questionSchema.js'
import { satMathQuestions } from './satMathQuestions.js'

export const canonicalQuestions = Object.freeze(assertValidQuestionCatalog([...satMathQuestions]))

export function toPracticeQuestion(question) {
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
    },
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
