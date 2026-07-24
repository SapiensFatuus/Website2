import { draftCanonicalPracticeQuestions } from '../questions/catalog/index.js'
import { assertValidFixedAssessmentCatalog } from './fixedAssessmentSchema.js'
import { unit7AssessmentBlueprints } from './unit7AssessmentBlueprints.js'

export * from './unit7AssessmentBlueprints.js'

assertValidFixedAssessmentCatalog(unit7AssessmentBlueprints, draftCanonicalPracticeQuestions)
