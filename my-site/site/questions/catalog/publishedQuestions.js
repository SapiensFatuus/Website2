import { satMathQuestions } from './satMathQuestions.js'

// This is the lightweight authoritative projection for content that may appear
// in public practice. Draft catalogs stay out of the initial browser bundle.
export const publishedQuestions = Object.freeze([
  ...satMathQuestions.filter((question) => question.content.status === 'published'),
])
