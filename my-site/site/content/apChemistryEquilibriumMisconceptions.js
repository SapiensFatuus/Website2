import { validateMisconceptionCatalog } from './editorialSchema.js'

const review = Object.freeze({
  status: 'draft', revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: '2026-07-20', reviewers: Object.freeze([]),
  history: Object.freeze([{ status: 'draft', date: '2026-07-20', actor: 'codex-ai-assisted-draft' }]),
})
const provenance = Object.freeze({
  kind: 'ai-generated', name: 'Study AI Helper original AP Chemistry draft',
  sourceIds: Object.freeze(['ap-chemistry-ced-fall-2024']),
  originalityNote: 'Independently written misconception diagnosis; no released-question or scoring-guide language was used.',
})

function record(id, title, incorrectIdea, correction, diagnosticCue, skillId, learningObjectiveId, sciencePracticeId = '6.D') {
  return Object.freeze({
    id, schemaVersion: 1, title, incorrectIdea, correction, diagnosticCue,
    alignment: Object.freeze({
      frameworkId: 'ap-chemistry-fall-2024', subjectId: 'ap-chemistry', domainId: 'equilibrium',
      skillIds: Object.freeze([skillId]), learningObjectiveIds: Object.freeze([learningObjectiveId]),
      sciencePracticeIds: Object.freeze([sciencePracticeId]),
    }),
    review, provenance,
  })
}

const misconceptions = [
  record('reversed-q-k-direction', 'Reversing the Q-versus-K direction', 'A mixture with Q below K shifts toward reactants.', 'When Q is below K, net product formation increases Q toward K.', 'Ask which direction would make the quotient larger.', 'reaction-quotient-le-chatelier-principle', '7.10.A', '5.F'),
  record('include-pure-solids', 'Including pure solids in K', 'Every species in the equation belongs in the equilibrium expression.', 'Pure solids and liquids have constant activity and are omitted.', 'Ask the student to label each phase before writing K.', 'reaction-quotient-equilibrium-constant', '7.3.A', '5.B'),
  record('multiply-k-by-coefficient', 'Scaling K linearly', 'Doubling reaction coefficients doubles K.', 'Multiplying coefficients by n raises K to the nth power.', 'Compare the new exponents in the equilibrium expression.', 'properties-equilibrium-constant', '7.6.A', '5.F'),
  record('small-k-no-products', 'Treating small K as zero products', 'A very small K means products cannot exist.', 'A small K means reactants predominate; it does not require zero product.', 'Ask whether a ratio can be small without being zero.', 'magnitude-equilibrium-constant', '7.5.A'),
  record('large-k-fast-reaction', 'Inferring rate from K', 'A large equilibrium constant proves the reaction is fast.', 'K describes equilibrium composition, not the time required to reach it.', 'Ask what kinetic measurement would actually reveal speed.', 'magnitude-equilibrium-constant', '7.5.A'),
  record('equilibrium-means-stopped', 'Treating equilibrium as stopped', 'Molecular reactions stop once concentrations level off.', 'Forward and reverse molecular events continue at equal rates.', 'Ask the student to distinguish a constant average from no events.', 'introduction-equilibrium', '7.1.A'),
  record('more-solid-more-soluble', 'More solid means more dissolved', 'Adding more undissolved solid increases molar solubility.', 'At fixed temperature, extra solid does not change saturated ion concentrations.', 'Ask whether the equilibrium expression contains the pure solid.', 'common-ion-effect', '7.12.A', '2.F'),
  record('missing-stoichiometric-exponent', 'Omitting a quotient exponent', 'Concentrations enter Q without stoichiometric exponents.', 'Each variable activity is raised to its balanced-equation coefficient.', 'Have the student map coefficients to exponents before substituting.', 'reaction-quotient-equilibrium-constant', '7.3.A', '5.F'),
  record('equilibrium-equal-concentrations', 'Equating concentrations at equilibrium', 'Equilibrium requires equal reactant and product concentrations.', 'Equilibrium requires equal opposing rates and Q = K; concentrations need only be constant.', 'Ask whether K = 1 was actually given.', 'introduction-equilibrium', '7.1.A'),
  record('shift-changes-k', 'Changing K with concentration', 'Adding a reactant changes the equilibrium constant.', 'At fixed temperature, the disturbance changes Q; K stays fixed.', 'Ask what variable K depends on for a fixed reaction.', 'reaction-quotient-le-chatelier-principle', '7.10.A', '5.F'),
  record('incorrect-ice-stoichiometry', 'Using equal ICE changes', 'Every row in an ICE table changes by the same amount.', 'Species changes scale with the balanced coefficients.', 'Ask the student to write changes as coefficient multiples of one x.', 'calculating-equilibrium-constant', '7.4.A', '5.F'),
  record('compression-always-shifts', 'Assuming compression always shifts', 'Reducing volume always favors products.', 'A gas-volume change favors the side with fewer gas particles; equal totals produce no shift.', 'Count gaseous coefficients on both sides before predicting.', 'introduction-le-chatelier-principle', '7.9.A', '6.D'),
  record('both-directions-means-equilibrium', 'Treating reversibility as equilibrium', 'A system is at equilibrium whenever both reaction directions occur.', 'Both directions can occur with different rates; equilibrium requires equal forward and reverse rates.', 'Have the student subtract the opposing rates to find the net direction.', 'direction-reversible-reactions', '7.2.A', '4.D'),
  record('ice-change-ignores-coefficients', 'Ignoring stoichiometry in an ICE table', 'Every species changes by the same concentration in an ICE table.', 'Each change is the reaction progress multiplied by that species coefficient.', 'Write one reaction-progress variable, then attach every coefficient before substituting.', 'calculating-equilibrium-concentrations', '7.7.A', '5.F'),
  record('single-snapshot-proves-equilibrium', 'Calling one snapshot equilibrium', 'The presence of reactants and products in one snapshot proves equilibrium.', 'Equilibrium evidence requires constant bulk composition over time or equal opposing rates, not merely coexistence.', 'Compare at least two later snapshots or a pair of opposing rates.', 'representations-equilibrium', '7.8.A', '3.C'),
  record('ksp-equals-molar-solubility', 'Equating Ksp with molar solubility', 'The numerical value of Ksp is always the molar solubility.', 'Write ion concentrations in terms of molar solubility and substitute them into the Ksp expression.', 'Ask whether the dissolution stoichiometry makes Ksp equal to s, s squared, or another expression.', 'introduction-solubility-equilibria', '7.11.A', '5.B'),
  record('solubility-stoichiometry-one-to-one', 'Ignoring dissolution coefficients', 'Every dissolved ion has concentration s regardless of its coefficient.', 'Ion concentrations equal their dissolution coefficients multiplied by molar solubility s.', 'Balance the dissolution equation before writing the ion concentrations.', 'introduction-solubility-equilibria', '7.11.A', '5.F'),
  record('all-concentrations-change-after-single-species-addition', 'Changing every concentration at injection', 'Adding one species causes every concentration to jump at the instant of addition.', 'An instantaneous composition change directly affects the added species; subsequent reaction changes follow over time.', 'Separate the vertical graph discontinuity from the sloped response that follows.', 'introduction-le-chatelier-principle', '7.9.A', '5.D'),
  record('add-reactions-add-constants', 'Adding equilibrium constants', 'When chemical equations are added, their equilibrium constants should be added.', 'Multiplying the underlying equilibrium expressions means the constants multiply when reactions are added.', 'Cancel the intermediate species, then multiply the constants associated with the component reactions.', 'properties-equilibrium-constant', '7.6.A', '5.A'),
  record('particle-model-breaks-conservation', 'Ignoring atoms in a particle model', 'A particle diagram may change the total number of represented atoms as equilibrium develops.', 'A closed-system particle model can change molecular groupings but must conserve each type of atom.', 'Count atoms inside every monomer and bonded group before comparing snapshots.', 'representations-equilibrium', '7.8.A', '1.A'),
  record('temperature-never-changes-k', 'Holding K fixed across temperatures', 'The equilibrium constant never changes when a system is heated or cooled.', 'For a fixed reaction, K is constant only at a fixed temperature; changing temperature changes the equilibrium target.', 'Check whether the disturbance changes composition only or changes temperature itself.', 'introduction-le-chatelier-principle', '7.9.A', '6.F'),
]

const validation = validateMisconceptionCatalog(misconceptions)
if (!validation.valid) throw new Error(`Misconception catalog validation failed:\n- ${validation.errors.join('\n- ')}`)
export const apChemistryEquilibriumMisconceptions = Object.freeze(misconceptions)
