import { unit1AssessmentBlueprints } from './unit1AssessmentBlueprints.js'
import { unit2AssessmentBlueprints } from './unit2AssessmentBlueprints.js'
import { unit3AssessmentBlueprints } from './unit3AssessmentBlueprints.js'
import { unit4AssessmentBlueprints } from './unit4AssessmentBlueprints.js'
import { unit5AssessmentBlueprints } from './unit5AssessmentBlueprints.js'
import { unit6AssessmentBlueprints } from './unit6AssessmentBlueprints.js'
import { unit7AssessmentBlueprints } from './unit7AssessmentBlueprints.js'
import { unit8AssessmentBlueprints } from './unit8AssessmentBlueprints.js'
import { unit9AssessmentBlueprints } from './unit9AssessmentBlueprints.js'

export * from './unit1AssessmentBlueprints.js'
export * from './unit2AssessmentBlueprints.js'
export * from './unit3AssessmentBlueprints.js'
export * from './unit4AssessmentBlueprints.js'
export * from './unit5AssessmentBlueprints.js'
export * from './unit6AssessmentBlueprints.js'
export * from './unit7AssessmentBlueprints.js'
export * from './unit8AssessmentBlueprints.js'
export * from './unit9AssessmentBlueprints.js'

export const apChemistryAssessmentBlueprints = Object.freeze([
  ...unit1AssessmentBlueprints,
  ...unit2AssessmentBlueprints,
  ...unit3AssessmentBlueprints,
  ...unit4AssessmentBlueprints,
  ...unit5AssessmentBlueprints,
  ...unit6AssessmentBlueprints,
  ...unit7AssessmentBlueprints,
  ...unit8AssessmentBlueprints,
  ...unit9AssessmentBlueprints,
])

export function getApChemistryAssessmentBlueprint(id) {
  return apChemistryAssessmentBlueprints.find((item) => item.id === id) || null
}

export function getAssessmentBlueprintsForDomain(domainId) {
  return apChemistryAssessmentBlueprints.filter((item) => item.domainId === domainId)
}

export function createApChemistryAssessmentUrl(id) {
  const blueprint = getApChemistryAssessmentBlueprint(id)
  return blueprint
    ? `/questions.html?topic=ap-chemistry&domain=${encodeURIComponent(blueprint.domainId)}&assessment=${encodeURIComponent(id)}`
    : null
}
