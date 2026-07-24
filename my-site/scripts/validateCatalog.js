import { canonicalQuestions } from '../site/questions/catalog/index.js'
import { apChemistryEquilibriumResources } from '../site/content/apChemistryEquilibriumResources.js'
import { apChemistryEquilibriumQuestions } from '../site/questions/catalog/apChemistryEquilibriumQuestions.js'
import { assertValidContentBundle } from '../site/content/contentBundle.js'
import { apChemistryEquilibriumMisconceptions } from '../site/content/apChemistryEquilibriumMisconceptions.js'
import { apChemistryAcidsBasesResources } from '../site/content/apChemistryAcidsBasesResources.js'
import { apChemistryAcidsBasesMisconceptions } from '../site/content/apChemistryAcidsBasesMisconceptions.js'
import { apChemistryAcidsBasesQuestions } from '../site/questions/catalog/apChemistryAcidsBasesQuestions.js'
import { apChemistryPropertiesMixturesResources } from '../site/content/apChemistryPropertiesMixturesResources.js'
import { apChemistryPropertiesMixturesMisconceptions } from '../site/content/apChemistryPropertiesMixturesMisconceptions.js'
import { apChemistryPropertiesMixturesQuestions } from '../site/questions/catalog/apChemistryPropertiesMixturesQuestions.js'
import { apChemistryChemicalReactionsResources } from '../site/content/apChemistryChemicalReactionsResources.js'
import { apChemistryChemicalReactionsMisconceptions } from '../site/content/apChemistryChemicalReactionsMisconceptions.js'
import { apChemistryChemicalReactionsQuestions } from '../site/questions/catalog/apChemistryChemicalReactionsQuestions.js'
import { apChemistryKineticsResources } from '../site/content/apChemistryKineticsResources.js'
import { apChemistryKineticsMisconceptions } from '../site/content/apChemistryKineticsMisconceptions.js'
import { apChemistryKineticsQuestions } from '../site/questions/catalog/apChemistryKineticsQuestions.js'
import { apChemistryThermochemistryResources } from '../site/content/apChemistryThermochemistryResources.js'
import { apChemistryThermochemistryMisconceptions } from '../site/content/apChemistryThermochemistryMisconceptions.js'
import { apChemistryThermochemistryQuestions } from '../site/questions/catalog/apChemistryThermochemistryQuestions.js'
import { apChemistryThermodynamicsElectrochemistryResources } from '../site/content/apChemistryThermodynamicsElectrochemistryResources.js'
import { apChemistryThermodynamicsElectrochemistryMisconceptions } from '../site/content/apChemistryThermodynamicsElectrochemistryMisconceptions.js'
import { apChemistryThermodynamicsElectrochemistryQuestions } from '../site/questions/catalog/apChemistryThermodynamicsElectrochemistryQuestions.js'
import { apChemistryAtomicStructurePropertiesResources } from '../site/content/apChemistryAtomicStructurePropertiesResources.js'
import { apChemistryAtomicStructurePropertiesMisconceptions } from '../site/content/apChemistryAtomicStructurePropertiesMisconceptions.js'
import { apChemistryAtomicStructurePropertiesQuestions } from '../site/questions/catalog/apChemistryAtomicStructurePropertiesQuestions.js'
import { apChemistryCompoundStructurePropertiesResources } from '../site/content/apChemistryCompoundStructurePropertiesResources.js'
import { apChemistryCompoundStructurePropertiesMisconceptions } from '../site/content/apChemistryCompoundStructurePropertiesMisconceptions.js'
import { apChemistryCompoundStructurePropertiesQuestions } from '../site/questions/catalog/apChemistryCompoundStructurePropertiesQuestions.js'
import { apChemistryReleasedExamMetadata } from '../site/content/apChemistryReleasedExamMetadata.js'
import { validateReleasedExamMetadataCatalog } from '../site/content/editorialPipeline.js'
import { assertValidQuestionCatalog } from '../site/questions/catalog/questionSchema.js'
import { apChemistryAssessmentBlueprints } from '../site/content/apChemistryAssessmentsValidated.js'
import {
  apChemistryAssessmentPilotEvidence,
  assertValidAssessmentPilotEvidenceCatalog,
} from '../site/content/assessmentPilotEvidence.js'

assertValidQuestionCatalog(canonicalQuestions)
assertValidContentBundle({
  resources: apChemistryEquilibriumResources,
  questions: apChemistryEquilibriumQuestions,
  misconceptions: apChemistryEquilibriumMisconceptions,
})
assertValidContentBundle({
  resources: apChemistryAcidsBasesResources,
  questions: apChemistryAcidsBasesQuestions,
  misconceptions: apChemistryAcidsBasesMisconceptions,
})
assertValidContentBundle({
  resources: apChemistryPropertiesMixturesResources,
  questions: apChemistryPropertiesMixturesQuestions,
  misconceptions: apChemistryPropertiesMixturesMisconceptions,
})
assertValidContentBundle({
  resources: apChemistryChemicalReactionsResources,
  questions: apChemistryChemicalReactionsQuestions,
  misconceptions: apChemistryChemicalReactionsMisconceptions,
})
assertValidContentBundle({
  resources: apChemistryKineticsResources,
  questions: apChemistryKineticsQuestions,
  misconceptions: apChemistryKineticsMisconceptions,
})
assertValidContentBundle({
  resources: apChemistryThermochemistryResources,
  questions: apChemistryThermochemistryQuestions,
  misconceptions: apChemistryThermochemistryMisconceptions,
})
assertValidContentBundle({
  resources: apChemistryThermodynamicsElectrochemistryResources,
  questions: apChemistryThermodynamicsElectrochemistryQuestions,
  misconceptions: apChemistryThermodynamicsElectrochemistryMisconceptions,
})
assertValidContentBundle({
  resources: apChemistryAtomicStructurePropertiesResources,
  questions: apChemistryAtomicStructurePropertiesQuestions,
  misconceptions: apChemistryAtomicStructurePropertiesMisconceptions,
})
assertValidContentBundle({
  resources: apChemistryCompoundStructurePropertiesResources,
  questions: apChemistryCompoundStructurePropertiesQuestions,
  misconceptions: apChemistryCompoundStructurePropertiesMisconceptions,
})
const releasedMetadata = validateReleasedExamMetadataCatalog(apChemistryReleasedExamMetadata)
if (!releasedMetadata.valid) throw new Error(`Released-exam metadata invalid:\n- ${releasedMetadata.errors.join('\n- ')}`)
assertValidAssessmentPilotEvidenceCatalog(apChemistryAssessmentPilotEvidence, apChemistryAssessmentBlueprints)
console.log(`Question catalog valid: ${canonicalQuestions.length} canonical questions.`)
