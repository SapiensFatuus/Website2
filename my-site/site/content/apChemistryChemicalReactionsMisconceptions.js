import { validateMisconceptionCatalog } from './editorialSchema.js'

const UPDATED_AT = '2026-07-24'

const review = Object.freeze({
  status: 'draft',
  revision: 1,
  authoredBy: 'codex-ai-assisted-draft',
  updatedAt: UPDATED_AT,
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
    id,
    schemaVersion: 1,
    title,
    incorrectIdea,
    correction,
    diagnosticCue,
    alignment: Object.freeze({
      frameworkId: 'ap-chemistry-fall-2024',
      subjectId: 'ap-chemistry',
      domainId: 'chemical-reactions',
      skillIds: Object.freeze([skillId]),
      learningObjectiveIds: Object.freeze([learningObjectiveId]),
      sciencePracticeIds: Object.freeze([sciencePracticeId]),
    }),
    review,
    provenance,
  })
}

const misconceptions = [
  record('reaction-evidence-proves-identity', 'Treating one observation as proof', 'Any visible change proves a particular chemical reaction occurred.', 'An observation can support a reaction claim only when it is connected to a plausible particle-level change and competing explanations are considered.', 'Ask what particle change would produce the observation and whether a physical process could also do so.', 'introduction-reactions', '4.1.A', '2.B'),
  record('spectator-ion-in-net-ionic', 'Keeping spectator ions in a net ionic equation', 'Every dissolved ion written in a molecular equation must appear in the net ionic equation.', 'Ions that remain unchanged in aqueous form on both sides are spectators and cancel from the net ionic equation.', 'Write strong soluble electrolytes as ions and cancel only identical species with identical phases and charges.', 'net-ionic-equations', '4.2.A', '5.E'),
  record('particle-count-conservation-only', 'Conserving particles instead of atoms and charge', 'A reaction diagram must show the same number of particles before and after reaction.', 'Chemical reactions conserve each element and total charge, but particles can combine or split, so the total particle count may change.', 'Count atoms of each element and net charge rather than counting circles or clusters alone.', 'representations-reactions', '4.3.A', '3.B'),
  record('phase-change-always-chemical', 'Calling every phase change a chemical reaction', 'A new phase means a new chemical substance has formed.', 'A phase change alters spacing and attractions while preserving particle identity; a chemical change rearranges atoms into different species.', 'Compare the bonded particle identities before and after the change.', 'physical-chemical-changes', '4.4.A', '6.B'),
  record('coefficients-change-subscripts', 'Changing formulas to balance an equation', 'Subscripts in chemical formulas may be changed to balance atom counts.', 'Only whole-number coefficients may be changed during balancing; changing a subscript changes the substance itself.', 'Lock every valid formula, then adjust the number of formula units or molecules.', 'stoichiometry', '4.5.A', '5.C'),
  record('titration-equal-volumes', 'Assuming equivalence means equal volumes', 'A titration reaches equivalence whenever the two solution volumes are equal.', 'Equivalence occurs when reacting amounts satisfy the balanced-equation mole ratio; equal volumes matter only for a one-to-one reaction with equal concentrations.', 'Convert each delivered volume to amount and compare using coefficients.', 'introduction-titration', '4.6.A', '3.A'),
  record('reaction-type-by-appearance', 'Classifying reactions by appearance alone', 'A reaction can be classified reliably from a color or temperature change without an equation.', 'Reaction classification follows the species and particle rearrangement shown by a balanced equation, not one macroscopic observation.', 'Identify what is transferred, combined, separated, or changed in oxidation state.', 'types-chemical-reactions', '4.7.A', '1.B'),
  record('acid-base-requires-hydroxide', 'Requiring hydroxide in every acid-base reaction', 'A base must contain OH- in its formula.', 'A Brønsted-Lowry base accepts a proton, so species such as NH3 can act as bases without containing hydroxide.', 'Track proton transfer and identify the conjugate pairs.', 'introduction-acid-base-reactions', '4.8.A', '1.B'),
  record('redox-requires-oxygen', 'Requiring oxygen in every redox reaction', 'Oxidation-reduction reactions must contain oxygen.', 'Redox is defined by electron transfer or oxidation-number changes; oxygen may be absent.', 'Assign oxidation numbers or write half-reactions to track electrons.', 'oxidation-reduction-reactions', '4.9.A', '5.E'),
]

const validation = validateMisconceptionCatalog(misconceptions)
if (!validation.valid) throw new Error(`Unit 4 misconception validation failed:\n- ${validation.errors.join('\n- ')}`)

export const apChemistryChemicalReactionsMisconceptions = Object.freeze(misconceptions)
