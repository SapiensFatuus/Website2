import { apChemistryEquilibriumResources } from './apChemistryEquilibriumResources.js'
import { apChemistryAcidsBasesResources } from './apChemistryAcidsBasesResources.js'
import { apChemistryPropertiesMixturesResources } from './apChemistryPropertiesMixturesResources.js'
import { apChemistryChemicalReactionsResources } from './apChemistryChemicalReactionsResources.js'
import { apChemistryKineticsResources } from './apChemistryKineticsResources.js'
import { apChemistryThermochemistryResources } from './apChemistryThermochemistryResources.js'
import { apChemistryThermodynamicsElectrochemistryResources } from './apChemistryThermodynamicsElectrochemistryResources.js'
import { apChemistryAtomicStructurePropertiesResources } from './apChemistryAtomicStructurePropertiesResources.js'
import { apChemistryCompoundStructurePropertiesResources } from './apChemistryCompoundStructurePropertiesResources.js'
import { assertValidEditorialCatalog } from './editorialSchema.js'

export const editorialResources = Object.freeze(assertValidEditorialCatalog([
  ...apChemistryEquilibriumResources,
  ...apChemistryAcidsBasesResources,
  ...apChemistryPropertiesMixturesResources,
  ...apChemistryChemicalReactionsResources,
  ...apChemistryKineticsResources,
  ...apChemistryThermochemistryResources,
  ...apChemistryThermodynamicsElectrochemistryResources,
  ...apChemistryAtomicStructurePropertiesResources,
  ...apChemistryCompoundStructurePropertiesResources,
]))

export function getEditorialResource(id, { includeDrafts = false } = {}) {
  const resource = editorialResources.find((item) => item.id === id) || null
  if (!resource || (!includeDrafts && resource.review.status !== 'published')) return null
  return resource
}

export function getEditorialResourcesForSkill(subjectId, skillId, { includeDrafts = false, kinds = null } = {}) {
  return editorialResources.filter((resource) => (
    resource.alignment.subjectId === subjectId
    && resource.alignment.skillIds.includes(skillId)
    && (includeDrafts || resource.review.status === 'published')
    && (!kinds || kinds.includes(resource.kind))
  ))
}

export function getEditorialResourcesForDomain(subjectId, domainId, { includeDrafts = false, kinds = null } = {}) {
  return editorialResources.filter((resource) => (
    resource.alignment.subjectId === subjectId
    && resource.alignment.domainId === domainId
    && (includeDrafts || resource.review.status === 'published')
    && (!kinds || kinds.includes(resource.kind))
  ))
}
