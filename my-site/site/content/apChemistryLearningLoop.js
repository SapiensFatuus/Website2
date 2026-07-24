import { createSkillPracticeUrl, getDomain, getSkill } from '../taxonomy/contentTaxonomy.js'
import { apChemistryAcidsBasesMisconceptions } from './apChemistryAcidsBasesMisconceptions.js'
import { apChemistryAtomicStructurePropertiesMisconceptions } from './apChemistryAtomicStructurePropertiesMisconceptions.js'
import { apChemistryChemicalReactionsMisconceptions } from './apChemistryChemicalReactionsMisconceptions.js'
import { apChemistryCompoundStructurePropertiesMisconceptions } from './apChemistryCompoundStructurePropertiesMisconceptions.js'
import { apChemistryEquilibriumMisconceptions } from './apChemistryEquilibriumMisconceptions.js'
import { apChemistryKineticsMisconceptions } from './apChemistryKineticsMisconceptions.js'
import { apChemistryPropertiesMixturesMisconceptions } from './apChemistryPropertiesMixturesMisconceptions.js'
import { apChemistryThermochemistryMisconceptions } from './apChemistryThermochemistryMisconceptions.js'
import { apChemistryThermodynamicsElectrochemistryMisconceptions } from './apChemistryThermodynamicsElectrochemistryMisconceptions.js'
import { getEditorialResourcesForSkill } from './resourceCatalog.js'
import { createResourceUrl } from './resourceRoutes.js'

const misconceptionsByDomain = Object.freeze({
  'atomic-structure-properties': apChemistryAtomicStructurePropertiesMisconceptions,
  'compound-structure-properties': apChemistryCompoundStructurePropertiesMisconceptions,
  'chemical-reactions': apChemistryChemicalReactionsMisconceptions,
  kinetics: apChemistryKineticsMisconceptions,
  thermochemistry: apChemistryThermochemistryMisconceptions,
  'thermodynamics-electrochemistry': apChemistryThermodynamicsElectrochemistryMisconceptions,
  'properties-substances-mixtures': apChemistryPropertiesMixturesMisconceptions,
  equilibrium: apChemistryEquilibriumMisconceptions,
  'acids-bases': apChemistryAcidsBasesMisconceptions,
})

function collectMisses({ grade, questions }) {
  const questionsById = new Map(questions.map((question) => [question.id, question]))
  const missedSkills = new Map()
  const misconceptionIds = new Set()

  grade.details.forEach((detail) => {
    if (detail.isCorrect || detail.isManualReview) return
    const question = questionsById.get(detail.questionId)
    if (!question) return
    const skillId = question.taxonomy.skillId
    const current = missedSkills.get(skillId) || { missed: 0 }
    current.missed += 1
    missedSkills.set(skillId, current)
    question.misconceptionIds?.forEach((id) => misconceptionIds.add(id))
  })

  return { missedSkills, misconceptionIds }
}

function createRecommendations(missedSkills) {
  return [...missedSkills]
    .sort(([leftId, left], [rightId, right]) => right.missed - left.missed || leftId.localeCompare(rightId))
    .slice(0, 3)
    .map(([skillId, result]) => {
      const skill = getSkill('ap-chemistry', skillId)
      const lesson = getEditorialResourcesForSkill('ap-chemistry', skillId, { includeDrafts: true, kinds: ['lesson'] })[0] || null
      return Object.freeze({
        skillId,
        label: skill?.label || skillId,
        reason: `${result.missed} assessment item${result.missed === 1 ? '' : 's'} missed or unanswered`,
        lessonUrl: lesson ? createResourceUrl(lesson) : null,
        practiceUrl: createSkillPracticeUrl('ap-chemistry', skillId),
      })
    })
}

function createErrorPatterns(domainId, misconceptionIds) {
  const byId = new Map((misconceptionsByDomain[domainId] || []).map((item) => [item.id, item]))
  return [...misconceptionIds]
    .sort()
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((item) => Object.freeze({
      id: item.id,
      title: item.title,
      correction: item.correction,
      diagnosticCue: item.diagnosticCue,
    }))
}

export function createApChemistryAssessmentSummary({ blueprint, grade, questions }) {
  if (!blueprint || !grade || !Array.isArray(questions)) return null
  const domain = getDomain(blueprint.subjectId, blueprint.domainId)
  if (!domain) return null

  const { missedSkills, misconceptionIds } = collectMisses({ grade, questions })
  const recommendations = createRecommendations(missedSkills)
  const errorPatterns = createErrorPatterns(blueprint.domainId, misconceptionIds)
  let heading = recommendations.length ? 'Recommended next steps' : 'Strong diagnostic result'
  let message = recommendations.length
    ? `Review the first weak area, practice it, then retake a mixed set. These are Unit ${domain.officialNumber} study recommendations, not an AP score prediction.`
    : `No automatically scored weakness was detected. Continue with a written response and mixed Unit ${domain.officialNumber} practice; this result is not an AP score prediction.`

  if (blueprint.kind === 'reassessment') {
    heading = recommendations.length ? 'Reassessment follow-up' : 'Reassessment complete'
    message = recommendations.length
      ? 'Use the separate-form results to choose another review cycle. This draft reassessment is not an AP score prediction.'
      : 'No automatically scored weakness was detected on this separate form. Try a written response next; this result is not an AP score prediction.'
  } else if (blueprint.kind === 'unit-test') {
    heading = 'Unit checkpoint follow-up'
    message = `${grade.correct} of ${grade.total} automatically scored questions were correct. ${grade.manualTotal} free responses are available for the point-by-point self-check below. This original checkpoint is not an official AP section or AP score prediction.`
  }

  return Object.freeze({
    id: blueprint.id,
    heading,
    message,
    misconceptionIds: Object.freeze([...misconceptionIds].sort()),
    errorPatterns: Object.freeze(errorPatterns),
    recommendations: Object.freeze(recommendations),
  })
}
