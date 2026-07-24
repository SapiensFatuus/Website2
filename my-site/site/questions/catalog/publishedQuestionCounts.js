import { publishedQuestions } from './publishedQuestions.js'

const publishedQuestionCounts = publishedQuestions.reduce((counts, question) => {
  const key = `${question.taxonomy.examId}:${question.taxonomy.subjectId}:${question.taxonomy.domainId}:${question.taxonomy.skillId}`
  counts.set(key, (counts.get(key) || 0) + 1)
  return counts
}, new Map())

export function getPublishedQuestionCount({ examId, subjectId, domainId, skillId }) {
  return publishedQuestionCounts.get(`${examId}:${subjectId}:${domainId}:${skillId}`) || 0
}
