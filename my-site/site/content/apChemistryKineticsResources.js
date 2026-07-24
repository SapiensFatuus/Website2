import { assertValidEditorialCatalog } from './editorialSchema.js'

const UNIT_ID = 'kinetics'
const UPDATED_AT = '2026-07-24'

function review() {
  return {
    status: 'draft', revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: UPDATED_AT, reviewers: [],
    history: [{ status: 'draft', date: UPDATED_AT, actor: 'codex-ai-assisted-draft' }],
  }
}

function provenance() {
  return {
    kind: 'ai-generated',
    name: 'Study AI Helper original AP Chemistry draft',
    sourceIds: ['ap-chemistry-ced-fall-2024', 'ap-chemistry-reference-2026'],
    originalityNote: 'Independently written from canonical framework and exam-reference metadata; no released-question wording, values, diagrams, or scoring language was used.',
  }
}

function alignment(skillIds, learningObjectiveIds, sciencePracticeIds) {
  return {
    frameworkId: 'ap-chemistry-fall-2024', subjectId: 'ap-chemistry', domainId: UNIT_ID,
    skillIds, learningObjectiveIds, sciencePracticeIds,
  }
}

function formula(definition) {
  return {
    kind: 'formula', schemaVersion: 1, review: review(), provenance: provenance(),
    conceptGroup: 'rates-and-rate-laws', ...definition,
  }
}

function lesson(definition) {
  return { kind: 'lesson', schemaVersion: 1, review: review(), provenance: provenance(), ...definition }
}

const resources = [
  formula({
    id: 'kinetics-stoichiometric-reaction-rate',
    title: 'Stoichiometric reaction-rate definition',
    summary: 'Convert species concentration slopes into one consistently scaled reaction rate.',
    alignment: alignment(['reaction-rates'], ['5.1.A'], ['6.E']),
    examReference: {
      status: 'not-provided',
      sourceId: 'ap-chemistry-reference-2026',
      note: 'The current exam reference information does not separately print the coefficient-scaled species-rate equality.',
    },
    expression: 'For a A + b B -> c C + d D, rate = -(1/a)Δ[A]/Δt = -(1/b)Δ[B]/Δt = (1/c)Δ[C]/Δt = (1/d)Δ[D]/Δt',
    variables: [
      { symbol: 'rate', meaning: 'coefficient-normalized reaction rate', units: 'mol L^-1 s^-1 or another concentration/time unit' },
      { symbol: 'Δ[X]', meaning: 'change in concentration of species X', units: 'mol/L' },
      { symbol: 'Δt', meaning: 'elapsed time', units: 's or another stated time unit' },
      { symbol: 'a, b, c, d', meaning: 'balanced-equation coefficients', units: 'none' },
    ],
    assumptions: ['The equation is balanced.', 'Concentration changes describe the same time interval.', 'Volume and sampling conditions support concentration-based comparison.'],
    appliesWhen: ['Relating disappearance and appearance rates.', 'Calculating an average reaction rate from concentration-time data.'],
    doesNotApplyWhen: ['Using raw species slopes without coefficient scaling.', 'Treating an average rate as the exact instantaneous rate at every point in the interval.'],
    rearrangements: ['-Δ[A]/Δt = a(rate)', 'Δ[C]/Δt = c(rate)', 'A reactant slope is negative while the defined reaction-rate magnitude is nonnegative.'],
    workedExample: {
      prompt: 'For 2 R -> 3 P, [R] falls by 0.0800 M in 20.0 s. Find the average reaction rate and P appearance rate.',
      steps: ['Calculate -Δ[R]/Δt = 0.0800/20.0 = 0.00400 M/s.', 'Divide by coefficient 2 for the reaction rate.', 'Multiply the reaction rate by coefficient 3 for P appearance.'],
      answer: 'Reaction rate = 0.00200 M/s; Δ[P]/Δt = 0.00600 M/s.',
    },
    commonMistake: 'Reporting -0.00400 M/s as the reaction rate without correcting sign or coefficient.',
  }),
  formula({
    id: 'kinetics-empirical-rate-law',
    title: 'Empirical differential rate law',
    summary: 'Represent how measured rate responds to reactant concentrations and determine the rate constant with consistent units.',
    alignment: alignment(['introduction-rate-law', 'reaction-mechanism-rate-law'], ['5.2.A', '5.8.A'], ['5.B', '5.C']),
    examReference: {
      status: 'provided',
      sourceId: 'ap-chemistry-reference-2026',
      note: 'The current exam reference information provides the general concentration rate-law form.',
    },
    expression: 'rate = k[A]^m[B]^n',
    variables: [
      { symbol: 'rate', meaning: 'measured reaction rate', units: 'mol L^-1 s^-1' },
      { symbol: 'k', meaning: 'rate constant at the stated temperature', units: 'depend on overall order' },
      { symbol: '[A], [B]', meaning: 'reactant molar concentrations', units: 'mol/L' },
      { symbol: 'm, n', meaning: 'empirically determined reaction orders', units: 'none' },
    ],
    assumptions: ['Temperature and other rate-affecting conditions are constant across compared trials.', 'Initial-rate comparisons isolate one concentration change at a time when possible.', 'Orders are not inferred from an overall equation unless an elementary step is explicitly stated.'],
    appliesWhen: ['Determining orders from initial-rate data.', 'Predicting a rate at new concentrations within the model range.'],
    doesNotApplyWhen: ['Reading exponents directly from a non-elementary overall equation.', 'Comparing rate constants measured at different temperatures as if k were unchanged.'],
    rearrangements: ['k = rate/([A]^m[B]^n)', 'overall order = m + n', 'For overall order p, units of k are M^(1-p) time^-1.'],
    workedExample: {
      prompt: 'A reaction follows rate = k[A]^2[B]. At [A] = 0.100 M and [B] = 0.200 M, rate = 4.80 x 10^-3 M/s. Find k.',
      steps: ['Substitute into k = rate/([A]^2[B]).', 'Calculate 4.80 x 10^-3/[(0.100)^2(0.200)].', 'Use third-order units M^-2 s^-1.'],
      answer: 'k = 2.40 M^-2 s^-1.',
    },
    commonMistake: 'Assigning k units of s^-1 for every reaction order.',
  }),
  formula({
    id: 'kinetics-first-order-time',
    title: 'First-order concentration and half-life',
    summary: 'Use logarithmic concentration-time behavior to determine a first-order rate constant and half-life.',
    alignment: alignment(['concentration-changes-time'], ['5.3.A'], ['5.B']),
    examReference: {
      status: 'provided',
      sourceId: 'ap-chemistry-reference-2026',
      note: 'The current exam reference information provides the first-order integrated rate law and half-life relationship.',
    },
    expression: 'ln[A]t = -kt + ln[A]0; t1/2 = ln(2)/k',
    variables: [
      { symbol: '[A]t', meaning: 'reactant concentration at elapsed time t', units: 'mol/L' },
      { symbol: '[A]0', meaning: 'initial reactant concentration', units: 'mol/L' },
      { symbol: 'k', meaning: 'first-order rate constant', units: 'time^-1' },
      { symbol: 't, t1/2', meaning: 'elapsed time and first-order half-life', units: 'same time unit used in k' },
    ],
    assumptions: ['The reaction is first order in the tracked reactant over the interval.', 'Temperature and rate constant remain effectively constant.', 'Natural logarithms are used.'],
    appliesWhen: ['A ln[A] versus time plot is linear.', 'Concentration halves in equal time intervals.'],
    doesNotApplyWhen: ['A different transformed concentration plot is linear.', 'The temperature changes enough to alter k during the run.'],
    rearrangements: ['k = ln([A]0/[A]t)/t', '[A]t = [A]0 e^(-kt)', 'After n half-lives, [A] = [A]0(1/2)^n.'],
    workedExample: {
      prompt: 'A first-order reactant falls from 0.800 M to 0.400 M in 200 s. Find k.',
      steps: ['Recognize one half-life of 200 s.', 'Use k = ln(2)/t1/2.', 'Calculate 0.693/200 s.'],
      answer: 'k = 3.47 x 10^-3 s^-1.',
    },
    commonMistake: 'Using log base 10 with a relationship written for natural logarithm.',
  }),
  lesson({
    id: 'kinetics-rates-laws-and-collisions',
    title: 'From concentration data to a molecular rate model',
    summary: 'Connect measured concentration change, empirical rate laws, integrated behavior, elementary molecularity, and effective collisions.',
    alignment: alignment(
      ['reaction-rates', 'introduction-rate-law', 'concentration-changes-time', 'elementary-reactions', 'collision-model'],
      ['5.1.A', '5.2.A', '5.3.A', '5.4.A', '5.5.A'],
      ['5.B', '5.C', '5.E', '6.E'],
    ),
    prerequisites: ['Balanced equations and concentration units.', 'Graph slope and logarithm interpretation.', 'Particle motion, energy distributions, and temperature.'],
    sections: [
      {
        heading: 'Define the rate before comparing species',
        body: 'Reactant slopes are negative and product slopes are positive. Balanced coefficients scale those species slopes into one common reaction rate. An interval gives an average rate; a tangent or sufficiently local model gives an instantaneous rate.',
      },
      {
        heading: 'Let experiments determine the rate law',
        body: 'Initial-rate trials reveal how rate changes when one concentration changes. A factor change in concentration and the corresponding factor change in rate determine each order. Only an explicitly elementary step permits its reacting coefficients to become rate-law powers directly.',
      },
      {
        heading: 'Connect mathematical order to particle collisions',
        body: 'Integrated plots diagnose how concentration evolves with time. At the particle level, a rate changes when collision frequency, the fraction above the activation threshold, or productive orientation changes. Higher temperature affects the energy distribution, while concentration commonly affects encounter frequency.',
      },
    ],
    workedExamples: [
      {
        prompt: 'Doubling [A] quadruples rate while tripling [B] triples rate. Determine the rate-law powers.',
        steps: ['Set 4 = 2^m and obtain m = 2.', 'Set 3 = 3^n and obtain n = 1.', 'Write rate = k[A]^2[B].'],
        answer: 'The reaction is second order in A, first order in B, and third order overall.',
      },
      {
        prompt: 'A reactant halves from 0.800 M to 0.400 M and then to 0.200 M in equal 200 s intervals. What model is supported?',
        steps: ['Identify a constant half-life.', 'A constant half-life supports first-order behavior.', 'Calculate k = ln(2)/200 s.'],
        answer: 'First-order behavior with k = 3.47 x 10^-3 s^-1 is supported.',
      },
    ],
    misconceptions: [
      { id: 'kinetics-negative-rate-value', claim: 'Reactant disappearance makes the defined rate negative.', correction: 'The concentration slope is negative; the conventional reaction rate uses a minus sign.' },
      { id: 'kinetics-rate-law-from-overall-equation', claim: 'Overall coefficients determine empirical orders.', correction: 'Determine orders from data unless a step is explicitly elementary.' },
      { id: 'kinetics-concentration-always-linear', claim: 'Raw concentration must be linear in time.', correction: 'Test the integrated-law transformation appropriate to each order.' },
      { id: 'kinetics-elementary-coefficients-ignored', claim: 'Elementary molecularity says nothing about rate powers.', correction: 'Reactant coefficients in an elementary event do determine its rate expression.' },
      { id: 'kinetics-every-collision-reacts', claim: 'Every collision is productive.', correction: 'Sufficient energy and suitable orientation are also required.' },
    ],
    retrievalChecks: [
      { prompt: 'Why is a reactant term preceded by a minus sign in the reaction-rate definition?', answer: 'Its concentration change is negative, and the sign makes the reported reaction-rate magnitude nonnegative.' },
      { prompt: 'What rate change indicates second order in A when [A] doubles?', answer: 'The rate increases by a factor of four.' },
      { prompt: 'Which plot is linear for first-order A?', answer: 'ln[A] versus time, with slope -k.' },
      { prompt: 'What three collision features control whether an encounter reacts?', answer: 'Collision frequency, sufficient energy, and suitable orientation.' },
    ],
    formulaIds: ['kinetics-stoichiometric-reaction-rate', 'kinetics-empirical-rate-law', 'kinetics-first-order-time'],
  }),
  lesson({
    id: 'kinetics-energy-mechanisms-and-catalysis',
    title: 'Energy profiles, mechanisms, and catalysts',
    summary: 'Use elementary steps and energy landscapes to test mechanisms, eliminate intermediates, identify rate control, and explain catalysis.',
    alignment: alignment(
      ['reaction-energy-profile', 'introduction-reaction-mechanisms', 'reaction-mechanism-rate-law', 'pre-equilibrium-approximation', 'multistep-reaction-energy-profile', 'catalysis'],
      ['5.6.A', '5.7.A', '5.8.A', '5.9.A', '5.10.A', '5.11.A'],
      ['1.B', '3.B', '5.B', '6.E'],
    ),
    prerequisites: ['Potential-energy diagrams and activation energy.', 'Rate laws for elementary reactions.', 'Equilibrium expressions and algebraic substitution.'],
    sections: [
      {
        heading: 'Read endpoints, peaks, and valleys separately',
        body: 'Reactant-to-product energy difference describes the overall energy change. Each elementary step adds a transition-state peak; each intermediate appears as a valley between peaks. The activation barrier for a step is measured from that step reactant or intermediate level to its next peak.',
      },
      {
        heading: 'A mechanism must satisfy two independent tests',
        body: 'Adding all elementary steps must reproduce the overall reaction after intermediates cancel. The mechanism must also predict the observed rate law. A slow-step expression containing an intermediate is not yet observable and must be rewritten using an earlier relationship.',
      },
      {
        heading: 'Use pre-equilibrium and catalysis without changing thermodynamics',
        body: 'A fast reversible step can establish an approximate equilibrium expression for an intermediate. Substitute that expression into the slow-step rate law. A catalyst changes the sequence and lowers one or more barriers, accelerating forward and reverse processes without changing endpoint energies or equilibrium composition.',
      },
    ],
    workedExamples: [
      {
        prompt: 'Fast X + Y <=> I is followed by slow I + X -> products. Derive the reactant-only rate form.',
        steps: ['Write slow-step rate = k2[I][X].', 'Use K1 = [I]/([X][Y]), so [I] = K1[X][Y].', 'Substitute and combine constants.'],
        answer: 'rate = k2K1[X]^2[Y] = kobs[X]^2[Y].',
      },
      {
        prompt: 'A two-step profile has an intermediate at 55 kJ/mol and the second transition state at 125 kJ/mol. Find the second-step activation energy.',
        steps: ['Use the intermediate as the second-step starting level.', 'Subtract 55 kJ/mol from 125 kJ/mol.', 'Keep the barrier distinct from the overall energy change.'],
        answer: 'The second-step activation energy is 70 kJ/mol.',
      },
    ],
    misconceptions: [
      { id: 'kinetics-catalyst-changes-delta-h', claim: 'A catalyst changes endpoint energy.', correction: 'It changes pathway barriers while leaving reactant and product energies unchanged.' },
      { id: 'kinetics-intermediate-in-overall-reaction', claim: 'An intermediate remains in the net equation.', correction: 'It is produced then consumed and cancels when steps are added.' },
      { id: 'kinetics-slow-step-only-rate-law', claim: 'An observed rate law may retain an intermediate.', correction: 'Eliminate intermediates using an earlier mechanistic relationship.' },
      { id: 'kinetics-pre-equilibrium-means-static', claim: 'Pre-equilibrium means the first step stops.', correction: 'Forward and reverse events continue while maintaining an approximate ratio.' },
      { id: 'kinetics-one-peak-multistep', claim: 'A multistep mechanism has one peak.', correction: 'Each elementary step has its own transition-state peak.' },
      { id: 'kinetics-catalyst-changes-equilibrium-yield', claim: 'A catalyst raises equilibrium product yield.', correction: 'It changes the approach rate, not equilibrium composition at fixed temperature.' },
    ],
    retrievalChecks: [
      { prompt: 'How many peaks should a three-step energy profile have?', answer: 'Three transition-state peaks and two intermediate valleys.' },
      { prompt: 'What happens to an intermediate when mechanism steps are summed?', answer: 'It cancels because it is produced in one step and consumed in another.' },
      { prompt: 'Why must an intermediate be eliminated from an observed rate law?', answer: 'The final law must be written in terms of measurable overall reactants rather than a transient internal species.' },
      { prompt: 'Which profile features remain unchanged when a catalyst is added?', answer: 'Reactant energy, product energy, and therefore the overall energy difference.' },
    ],
    formulaIds: ['kinetics-empirical-rate-law', 'kinetics-first-order-time'],
  }),
  {
    id: 'kinetics-initial-rates-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Initial-rate study for reactants A and B',
    summary: 'An original controlled data set for determining reaction orders, rate-constant units, and a predicted initial rate.',
    alignment: alignment(['introduction-rate-law'], ['5.2.A'], ['5.C']),
    review: review(),
    provenance: provenance(),
    context: 'A reaction between A and B is studied at one temperature. Each trial begins with fresh reactants, and the initial product-formation rate is measured before concentrations change appreciably.',
    representation: {
      type: 'table',
      caption: 'Initial concentrations and measured initial rates',
      columns: ['Trial', 'Initial [A] (M)', 'Initial [B] (M)', 'Initial rate (M/s)'],
      rows: [
        ['1', '0.100', '0.100', '2.40 x 10^-3'],
        ['2', '0.200', '0.100', '9.60 x 10^-3'],
        ['3', '0.200', '0.300', '2.88 x 10^-2'],
      ],
      accessibleDescription: 'Trial 1 uses 0.100 molar A and 0.100 molar B with rate 2.40 times ten to the negative third molar per second. Trial 2 doubles A while holding B constant and the rate quadruples. Trial 3 triples B relative to trial 2 while holding A constant and the rate triples.',
    },
  },
  {
    id: 'kinetics-first-order-time-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Concentration-time series for reactant C',
    summary: 'An original repeated-halving data set for identifying first-order behavior, calculating a rate constant, and predicting rate.',
    alignment: alignment(['concentration-changes-time'], ['5.3.A'], ['5.B', '5.C']),
    review: review(),
    provenance: provenance(),
    context: 'Reactant C decomposes in a constant-volume vessel at fixed temperature. Its concentration is measured at equal time intervals. Measurement uncertainty is small relative to the displayed digits.',
    representation: {
      type: 'table',
      caption: 'Reactant C concentration as a function of time',
      columns: ['Time (s)', '[C] (M)'],
      rows: [
        ['0', '0.640'],
        ['150', '0.320'],
        ['300', '0.160'],
        ['450', '0.0800'],
      ],
      accessibleDescription: 'Reactant C begins at 0.640 molar. Its concentration is 0.320 molar at 150 seconds, 0.160 molar at 300 seconds, and 0.0800 molar at 450 seconds. The concentration halves every 150 seconds.',
    },
  },
  {
    id: 'kinetics-first-order-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: first-order concentration study',
    summary: 'A four-point rubric for order evidence, rate constant, half-life, and instantaneous-rate magnitude.',
    alignment: alignment(['concentration-changes-time'], ['5.3.A'], ['5.B', '5.C']),
    review: review(),
    provenance: provenance(),
    questionId: 'ap-chem-kinetics-short-frq-001',
    maxPoints: 4,
    parts: [
      { id: 'part-a', prompt: 'Identify the supported order and evidence.', points: [{ id: 'a-order', criterion: 'Uses constant halving or a linear logarithmic representation to support first order.', acceptableEvidence: 'Notes that [A] halves from 0.800 M to 0.400 M in 200 s and from 0.400 M to 0.200 M in the next 200 s.' }] },
      { id: 'part-b', prompt: 'Calculate the rate constant.', points: [{ id: 'b-rate-constant', criterion: 'Applies the first-order half-life or integrated relationship.', acceptableEvidence: 'Calculates k = ln(2)/200 s = 3.47 x 10^-3 s^-1.' }] },
      { id: 'part-c', prompt: 'Determine the half-life and predict concentration.', points: [{ id: 'c-half-life', criterion: 'Uses repeated first-order halving.', acceptableEvidence: 'Reports t1/2 = 200 s and [A] at 600 s = 0.100 M.' }] },
      { id: 'part-d', prompt: 'Calculate the rate magnitude at 200 s.', points: [{ id: 'd-instantaneous-rate', criterion: 'Uses rate = k[A] for the first-order disappearance magnitude.', acceptableEvidence: 'Calculates (3.47 x 10^-3 s^-1)(0.400 M) = 1.39 x 10^-3 M/s.' }] },
    ],
  },
  {
    id: 'kinetics-mechanism-long-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: pre-equilibrium mechanism and energy profile',
    summary: 'A seven-point rubric for net reaction, intermediate, derived rate law, concentration response, energy barriers, and catalysis.',
    alignment: alignment(
      ['reaction-mechanism-rate-law', 'pre-equilibrium-approximation', 'multistep-reaction-energy-profile', 'catalysis'],
      ['5.8.A', '5.9.A', '5.10.A', '5.11.A'],
      ['3.B', '5.B', '6.E'],
    ),
    review: review(),
    provenance: provenance(),
    questionId: 'ap-chem-kinetics-long-frq-001',
    maxPoints: 7,
    parts: [
      { id: 'part-a', prompt: 'Obtain the overall reaction.', points: [{ id: 'a-overall', criterion: 'Adds the steps and cancels the intermediate.', acceptableEvidence: 'Obtains 2 X + Y -> Z + W.' }] },
      { id: 'part-b', prompt: 'Identify the intermediate.', points: [{ id: 'b-intermediate', criterion: 'Identifies the species formed then consumed.', acceptableEvidence: 'Identifies I as the intermediate.' }] },
      {
        id: 'part-c',
        prompt: 'Derive the observed rate law.',
        points: [
          { id: 'c-slow-law', criterion: 'Writes the slow elementary-step rate expression.', acceptableEvidence: 'rate = k2[I][X].' },
          { id: 'c-substitution', criterion: 'Eliminates I with the fast-equilibrium relationship.', acceptableEvidence: 'Uses [I] = K1[X][Y] to obtain rate = kobs[X]^2[Y].' },
        ],
      },
      { id: 'part-d', prompt: 'Predict the effect of doubling X.', points: [{ id: 'd-rate-factor', criterion: 'Uses second-order dependence on X.', acceptableEvidence: 'Predicts a fourfold rate increase at fixed Y.' }] },
      { id: 'part-e', prompt: 'Interpret the energy profile.', points: [{ id: 'e-energy', criterion: 'Identifies the second barrier from the intermediate and the slower step.', acceptableEvidence: 'Calculates 125 - 55 = 70 kJ/mol and identifies step 2 as having the larger forward barrier.' }] },
      { id: 'part-f', prompt: 'Explain catalysis.', points: [{ id: 'f-catalyst', criterion: 'Separates lowered barriers from unchanged endpoints and equilibrium.', acceptableEvidence: 'States that an alternate mechanism lowers activation barriers but leaves reactant/product energies, ΔE, and equilibrium composition unchanged.' }] },
    ],
  },
]

export const apChemistryKineticsResources = Object.freeze(
  assertValidEditorialCatalog(resources).map((resource) => Object.freeze(resource)),
)
