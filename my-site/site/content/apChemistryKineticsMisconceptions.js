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
    id,
    schemaVersion: 1,
    title,
    incorrectIdea,
    correction,
    diagnosticCue,
    alignment: Object.freeze({
      frameworkId: 'ap-chemistry-fall-2024',
      subjectId: 'ap-chemistry',
      domainId: 'kinetics',
      skillIds: Object.freeze([skillId]),
      learningObjectiveIds: Object.freeze([learningObjectiveId]),
      sciencePracticeIds: Object.freeze([sciencePracticeId]),
    }),
    review,
    provenance,
  })
}

const misconceptions = [
  record('kinetics-negative-rate-value', 'Reporting a negative reaction rate', 'A disappearing reactant gives a negative reaction rate.', 'The reactant concentration change is negative, but the conventional reaction rate includes a minus sign and is reported as a nonnegative magnitude.', 'Separate the signed concentration slope from the defined reaction-rate magnitude.', 'reaction-rates', '5.1.A', '6.E'),
  record('kinetics-rate-law-from-overall-equation', 'Reading a rate law from an overall equation', 'The coefficients in any balanced overall equation are automatically the rate-law exponents.', 'Rate-law orders are empirical unless the equation represents one elementary step.', 'Ask whether the relationship came from initial-rate evidence or a stated elementary event.', 'introduction-rate-law', '5.2.A', '5.C'),
  record('kinetics-concentration-always-linear', 'Expecting concentration to be linear in time', 'A reactant concentration versus time graph is linear for every reaction order.', 'Different integrated rate laws linearize [A], ln[A], or 1/[A]; the data decide which representation is linear.', 'Compare equal-time changes or test transformed plots.', 'concentration-changes-time', '5.3.A', '5.B'),
  record('kinetics-elementary-coefficients-ignored', 'Ignoring elementary-step molecularity', 'The rate law for an elementary step is unrelated to its reacting-particle coefficients.', 'For an elementary step, reactant molecularity directly determines the concentration powers in its rate expression.', 'Confirm the statement says elementary before using coefficients as exponents.', 'elementary-reactions', '5.4.A', '5.E'),
  record('kinetics-every-collision-reacts', 'Treating every collision as effective', 'Every reactant collision produces products.', 'A productive collision must have sufficient energy and a suitable orientation as well as occur.', 'Evaluate frequency, energy distribution, and orientation separately.', 'collision-model', '5.5.A', '6.E'),
  record('kinetics-catalyst-changes-delta-h', 'Changing reaction energy with a catalyst', 'A catalyst lowers the energies of products and makes the overall reaction more exothermic.', 'A catalyst provides an alternate pathway with lower activation barriers while leaving reactant, product, and overall energy difference unchanged.', 'Compare endpoints separately from transition-state peaks.', 'reaction-energy-profile', '5.6.A', '3.B'),
  record('kinetics-intermediate-in-overall-reaction', 'Leaving an intermediate in the overall equation', 'A species produced in one mechanism step and consumed later belongs in the net reaction.', 'An intermediate cancels when elementary steps are added and therefore is absent from the overall equation.', 'Add the steps and cancel species appearing on opposite sides.', 'introduction-reaction-mechanisms', '5.7.A', '1.B'),
  record('kinetics-slow-step-only-rate-law', 'Using a slow-step law without eliminating intermediates', 'The observed rate law may contain any intermediate appearing in the slow step.', 'An observed rate law must use measurable reactants; intermediates are eliminated using a preceding relationship such as a fast equilibrium.', 'Inspect the slow-step law for species absent from the overall reactants.', 'reaction-mechanism-rate-law', '5.8.A', '5.B'),
  record('kinetics-pre-equilibrium-means-static', 'Treating pre-equilibrium as stopped', 'A fast pre-equilibrium means the first step has stopped before the slow step occurs.', 'The fast forward and reverse events continue while maintaining an approximate equilibrium relationship used to express the intermediate concentration.', 'Write the equilibrium ratio before substituting into the slow-step rate.', 'pre-equilibrium-approximation', '5.9.A', '5.B'),
  record('kinetics-one-peak-multistep', 'Drawing one peak for a multistep mechanism', 'Every overall reaction has exactly one transition-state peak.', 'A mechanism has one transition-state peak per elementary step and an intermediate minimum between adjacent peaks.', 'Count elementary steps, peaks, and intermediate valleys.', 'multistep-reaction-energy-profile', '5.10.A', '3.B'),
  record('kinetics-catalyst-changes-equilibrium-yield', 'Changing equilibrium yield with a catalyst', 'A catalyst increases the equilibrium amount of products.', 'A catalyst accelerates forward and reverse pathways and changes the time to equilibrium, not the equilibrium composition at fixed temperature.', 'Distinguish kinetic arrival time from thermodynamic equilibrium position.', 'catalysis', '5.11.A', '6.E'),
]

const validation = validateMisconceptionCatalog(misconceptions)
if (!validation.valid) throw new Error(`Unit 5 misconception validation failed:\n- ${validation.errors.join('\n- ')}`)

export const apChemistryKineticsMisconceptions = Object.freeze(misconceptions)
