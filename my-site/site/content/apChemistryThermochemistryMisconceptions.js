import { validateMisconceptionCatalog } from './editorialSchema.js'

const UPDATED_AT = '2026-07-24'
const review = Object.freeze({
  status: 'draft', revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: UPDATED_AT,
  reviewers: Object.freeze([]),
  history: Object.freeze([{ status: 'draft', date: UPDATED_AT, actor: 'codex-ai-assisted-draft' }]),
})
const provenance = Object.freeze({
  kind: 'ai-generated',
  name: 'Study AI Helper original AP Chemistry draft',
  sourceIds: Object.freeze(['ap-chemistry-ced-fall-2024']),
  originalityNote: 'Independently written misconception diagnosis; no released-question or scoring-guide language was used.',
})

function record(id, title, incorrectIdea, correction, diagnosticCue, skillId, learningObjectiveId, sciencePracticeId) {
  return Object.freeze({
    id, schemaVersion: 1, title, incorrectIdea, correction, diagnosticCue,
    alignment: Object.freeze({
      frameworkId: 'ap-chemistry-fall-2024', subjectId: 'ap-chemistry', domainId: 'thermochemistry',
      skillIds: Object.freeze([skillId]), learningObjectiveIds: Object.freeze([learningObjectiveId]),
      sciencePracticeIds: Object.freeze([sciencePracticeId]),
    }),
    review, provenance,
  })
}

const misconceptions = [
  record('thermochemistry-exothermic-system-gains-heat', 'Reversing the direction of exothermic heat flow', 'An exothermic system absorbs heat from the surroundings.', 'An exothermic process transfers energy from the system to the surroundings, so the system has negative q at constant-pressure sign convention.', 'Name the system first, then track the direction of energy crossing its boundary.', 'endothermic-exothermic-processes', '6.1.A', '6.D'),
  record('thermochemistry-diagram-sign-from-peak', 'Using the activation peak to determine enthalpy sign', 'A tall energy barrier makes a reaction endothermic.', 'Reaction enthalpy depends on product and reactant energy levels; the transition-state peak controls activation energy instead.', 'Compare endpoints for ΔH and compare an endpoint with a peak for activation energy.', 'energy-diagrams', '6.2.A', '3.A'),
  record('thermochemistry-temperature-equals-heat', 'Treating temperature and heat as the same quantity', 'The warmer object always contains more thermal energy than the cooler object.', 'Temperature reflects average particle energy, while transferred heat also depends on amount and heat capacity.', 'Compare mass and heat capacity before inferring the amount of energy transferred.', 'heat-transfer-thermal-equilibrium', '6.3.A', '6.E'),
  record('thermochemistry-calorimeter-same-sign', 'Giving the reaction and calorimeter the same heat sign', 'If the solution gains heat, the reaction also has positive q.', 'Energy conservation gives qreaction = -qsurroundings when other losses are negligible.', 'Write the system-surroundings energy balance before inserting numbers.', 'heat-capacity-calorimetry', '6.4.A', '2.D'),
  record('thermochemistry-phase-change-temperature-rise', 'Raising temperature during a phase transition', 'Added heat always raises the temperature of a pure substance.', 'At constant pressure during a phase change, energy changes intermolecular organization while temperature remains approximately constant.', 'Decide whether the sample is within one phase or on a phase plateau.', 'energy-phase-changes', '6.5.A', '1.B'),
  record('thermochemistry-enthalpy-not-extensive', 'Ignoring reaction amount when scaling enthalpy', 'The listed ΔH applies unchanged to any amount of reaction.', 'Reaction enthalpy scales with the reaction extent and reverses sign when the equation is reversed.', 'Track both equation direction and the mole ratio between the stated and target reaction.', 'introduction-enthalpy-reaction', '6.6.A', '5.F'),
  record('thermochemistry-bond-enthalpy-signs', 'Reversing bond-enthalpy signs', 'Breaking bonds releases energy and forming bonds requires energy.', 'Breaking bonds requires energy; forming bonds releases energy, so ΔH ≈ bonds broken minus bonds formed.', 'Separate bonds broken from bonds formed before subtracting the sums.', 'bond-enthalpies', '6.7.A', '5.F'),
  record('thermochemistry-elements-nonzero-formation', 'Assigning arbitrary formation enthalpies to standard elements', 'Every substance has a nonzero standard enthalpy of formation.', 'An element in its standard state has ΔHf° = 0 by definition.', 'Check whether each species is an element in its reference form at standard conditions.', 'enthalpy-formation', '6.8.A', '5.F'),
  record('thermochemistry-hess-no-scaling', 'Changing equations without changing ΔH', 'Thermochemical equations can be reversed or multiplied without changing their ΔH values.', 'Reverse an equation and reverse the sign; multiply an equation and multiply ΔH by the same factor.', 'Perform the same algebraic operation on the equation and its enthalpy.', 'hess-law', '6.9.A', '5.A'),
]

const validation = validateMisconceptionCatalog(misconceptions)
if (!validation.valid) throw new Error(`Unit 6 misconception validation failed:\n- ${validation.errors.join('\n- ')}`)

export const apChemistryThermochemistryMisconceptions = Object.freeze(misconceptions)
