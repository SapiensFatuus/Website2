import { validateMisconceptionCatalog } from './editorialSchema.js'

const UPDATED_AT = '2026-07-24'
const review = Object.freeze({
  status: 'draft', revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: UPDATED_AT,
  reviewers: Object.freeze([]), history: Object.freeze([{ status: 'draft', date: UPDATED_AT, actor: 'codex-ai-assisted-draft' }]),
})
const provenance = Object.freeze({
  kind: 'ai-generated', name: 'Study AI Helper original AP Chemistry draft',
  sourceIds: Object.freeze(['ap-chemistry-ced-fall-2024']),
  originalityNote: 'Independently written misconception diagnosis; no released-question or scoring-guide language was used.',
})
function record(id, title, incorrectIdea, correction, diagnosticCue, skillId, learningObjectiveId, sciencePracticeId) {
  return Object.freeze({
    id, schemaVersion: 1, title, incorrectIdea, correction, diagnosticCue,
    alignment: Object.freeze({
      frameworkId: 'ap-chemistry-fall-2024', subjectId: 'ap-chemistry', domainId: 'thermodynamics-electrochemistry',
      skillIds: Object.freeze([skillId]), learningObjectiveIds: Object.freeze([learningObjectiveId]),
      sciencePracticeIds: Object.freeze([sciencePracticeId]),
    }),
    review, provenance,
  })
}
const misconceptions = [
  record('thermodynamics-entropy-only-disorder', 'Reducing entropy to visual disorder', 'Entropy is just how messy a sample looks.', 'Entropy tracks the dispersal of energy and matter among accessible arrangements; phase, particle count, volume, and temperature provide molecular evidence.', 'Describe particle and energy distribution instead of using appearance alone.', 'introduction-entropy', '9.1.A', '6.C'),
  record('thermodynamics-entropy-reactants-minus-products', 'Reversing the entropy sum', 'Reaction entropy is reactants minus products.', 'Standard reaction entropy is the coefficient-weighted product sum minus the reactant sum.', 'Write the products-minus-reactants structure before substituting values.', 'absolute-entropy-entropy-change', '9.2.A', '5.F'),
  record('thermodynamics-delta-g-unit-mismatch', 'Combining joules and kilojoules directly', 'Values of Delta H in kJ/mol and Delta S in J/(mol K) can be inserted together without conversion.', 'Convert units before evaluating Delta G = Delta H - T Delta S.', 'Annotate every term with units and make T Delta S match Delta H.', 'gibbs-free-energy-thermodynamic-favorability', '9.3.A', '6.E'),
  record('thermodynamics-favorable-means-fast', 'Equating favorability with reaction speed', 'A negative Delta G guarantees an observable rapid reaction.', 'Thermodynamic favorability describes direction; rate depends on the kinetic pathway and activation barrier.', 'Ask separately whether the process is favorable and whether it has a sufficiently fast pathway.', 'thermodynamic-kinetic-control', '9.4.A', '6.E'),
  record('thermodynamics-equilibrium-delta-g-standard-zero', 'Setting standard free energy to zero at equilibrium', 'At equilibrium, Delta G degree is always zero.', 'At equilibrium Delta G under the actual composition is zero; Delta G degree equals -RT ln K and is zero only when K = 1.', 'Distinguish standard-state Delta G degree from composition-dependent Delta G.', 'free-energy-equilibrium', '9.5.A', '6.D'),
  record('thermodynamics-dissolution-enthalpy-alone', 'Using dissolution enthalpy alone', 'An endothermic dissolution can never be favorable.', 'Dissolution favorability depends on both enthalpy and entropy through Delta G.', 'Consider solute-solvent interactions and particle dispersal together.', 'free-energy-dissolution', '9.6.A', '4.D'),
  record('thermodynamics-coupling-no-cancellation', 'Adding free energies without adding reactions', 'Any favorable reaction can drive any unfavorable reaction without stoichiometric connection.', 'Coupled equations must be scaled and added so the shared intermediate cancels; their scaled free energies then add.', 'Verify chemical cancellation before adding Delta G values.', 'coupled-reactions', '9.7.A', '4.D'),
  record('thermodynamics-anode-always-negative', 'Assigning electrode signs without cell type', 'The anode is always negative and the cathode is always positive.', 'Oxidation always occurs at the anode and reduction at the cathode; signs depend on galvanic versus electrolytic operation.', 'Identify oxidation and reduction before assigning cell-specific signs.', 'galvanic-electrolytic-cells', '9.8.A', '2.F'),
]
const validation = validateMisconceptionCatalog(misconceptions)
if (!validation.valid) throw new Error(`Unit 9 misconception validation failed:\n- ${validation.errors.join('\n- ')}`)
export const apChemistryThermodynamicsElectrochemistryMisconceptions = Object.freeze(misconceptions)
