import { draftCanonicalPracticeQuestions } from '../questions/catalog/index.js'
import { apChemistryAssessmentBlueprints } from './apChemistryAssessments.js'
import { assertValidFixedAssessmentCatalog } from './fixedAssessmentSchema.js'

export * from './apChemistryAssessments.js'

assertValidFixedAssessmentCatalog(apChemistryAssessmentBlueprints, draftCanonicalPracticeQuestions)
