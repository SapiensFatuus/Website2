import { canonicalQuestions } from '../site/questions/catalog/index.js'
import { assertValidQuestionCatalog } from '../site/questions/catalog/questionSchema.js'

assertValidQuestionCatalog(canonicalQuestions)
console.log(`Question catalog valid: ${canonicalQuestions.length} canonical questions.`)
