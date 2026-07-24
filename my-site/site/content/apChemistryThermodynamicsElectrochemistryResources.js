import { assertValidEditorialCatalog } from './editorialSchema.js'

const UNIT_ID = 'thermodynamics-electrochemistry'
const UPDATED_AT = '2026-07-24'
function review() {
  return {
    status: 'draft', revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: UPDATED_AT, reviewers: [],
    history: [{ status: 'draft', date: UPDATED_AT, actor: 'codex-ai-assisted-draft' }],
  }
}
function provenance() {
  return {
    kind: 'ai-generated', name: 'Study AI Helper original AP Chemistry draft',
    sourceIds: ['ap-chemistry-ced-fall-2024', 'ap-chemistry-reference-2026'],
    originalityNote: 'Independently written from canonical framework and exam-reference metadata; no released-question wording, values, diagrams, or scoring language was used.',
  }
}
function alignment(skillIds, learningObjectiveIds, sciencePracticeIds) {
  return { frameworkId: 'ap-chemistry-fall-2024', subjectId: 'ap-chemistry', domainId: UNIT_ID, skillIds, learningObjectiveIds, sciencePracticeIds }
}
function formula(definition) {
  return { kind: 'formula', schemaVersion: 1, review: review(), provenance: provenance(), conceptGroup: 'entropy-and-free-energy', ...definition }
}
function lesson(definition) {
  return { kind: 'lesson', schemaVersion: 1, review: review(), provenance: provenance(), ...definition }
}

const resources = [
  formula({
    id: 'thermodynamics-reaction-entropy',
    title: 'Standard reaction entropy',
    summary: 'Calculate entropy change from coefficient-weighted standard molar entropy values.',
    alignment: alignment(['absolute-entropy-entropy-change'], ['9.2.A'], ['5.F']),
    examReference: { status: 'provided', sourceId: 'ap-chemistry-reference-2026', note: 'The current exam reference information provides the standard reaction-entropy relationship.' },
    expression: 'Delta S degree rxn = sum(n S degree products) - sum(n S degree reactants)',
    variables: [
      { symbol: 'Delta S degree rxn', meaning: 'standard entropy change for the reaction as written', units: 'J mol^-1 K^-1' },
      { symbol: 'S degree', meaning: 'standard molar entropy', units: 'J mol^-1 K^-1' },
      { symbol: 'n', meaning: 'stoichiometric coefficient', units: 'none' },
    ],
    assumptions: ['The equation is balanced.', 'Values match each species and phase.', 'Coefficients multiply molar entropy values.'],
    appliesWhen: ['Standard molar entropy data are supplied.', 'Checking a qualitative entropy prediction quantitatively.'],
    doesNotApplyWhen: ['Species phases or coefficients are mismatched.', 'Using formation enthalpies in place of entropy values.'],
    rearrangements: ['Reverse the reaction and reverse Delta S.', 'Scale the equation and scale Delta S.'],
    workedExample: {
      prompt: 'For A(g) + B(g) -> C(g), standard entropies are 190, 210, and 260 J mol^-1 K^-1. Find Delta S degree.',
      steps: ['Product sum is 260.', 'Reactant sum is 190 + 210 = 400.', 'Subtract reactants from products.'],
      answer: 'Delta S degree = -140 J mol^-1 K^-1.',
    },
    commonMistake: 'Subtracting products from reactants.',
  }),
  formula({
    id: 'thermodynamics-gibbs-free-energy',
    title: 'Gibbs free energy, temperature, and equilibrium',
    summary: 'Connect enthalpy, entropy, temperature, standard free energy, and equilibrium constant.',
    alignment: alignment(
      ['gibbs-free-energy-thermodynamic-favorability', 'free-energy-equilibrium', 'coupled-reactions'],
      ['9.3.A', '9.5.A', '9.7.A'], ['4.D', '6.D', '6.E'],
    ),
    examReference: { status: 'provided', sourceId: 'ap-chemistry-reference-2026', note: 'The current exam reference information provides Gibbs-energy and equilibrium relationships.' },
    expression: 'Delta G degree = Delta H degree - T Delta S degree; Delta G degree = -RT ln K',
    variables: [
      { symbol: 'Delta G degree', meaning: 'standard Gibbs free-energy change', units: 'kJ/mol or J/mol consistently' },
      { symbol: 'Delta H degree', meaning: 'standard enthalpy change', units: 'same energy unit as T Delta S' },
      { symbol: 'T', meaning: 'absolute temperature', units: 'K' },
      { symbol: 'Delta S degree', meaning: 'standard entropy change', units: 'energy mol^-1 K^-1' },
      { symbol: 'R', meaning: 'gas constant', units: '8.314 J mol^-1 K^-1' },
      { symbol: 'K', meaning: 'thermodynamic equilibrium constant', units: 'dimensionless' },
    ],
    assumptions: ['Temperature is in kelvin.', 'Energy units are consistent.', 'The equilibrium relationship uses standard free energy and dimensionless K.'],
    appliesWhen: ['Predicting standard-state favorability.', 'Relating K magnitude to Delta G degree.', 'Adding scaled free energies for coupled reactions.'],
    doesNotApplyWhen: ['Inferring reaction speed from Delta G.', 'Claiming Delta G degree is zero at every equilibrium.'],
    rearrangements: ['Tboundary = Delta H degree/Delta S degree when both are nonzero and units match.', 'ln K = -Delta G degree/(RT).', 'Coupled reaction free energies add after equations are scaled and added.'],
    workedExample: {
      prompt: 'At 298 K, Delta H degree = +20.0 kJ/mol and Delta S degree = +100 J mol^-1 K^-1. Find Delta G degree.',
      steps: ['Convert Delta S to 0.100 kJ mol^-1 K^-1.', 'Calculate T Delta S = 29.8 kJ/mol.', 'Subtract from Delta H.'],
      answer: 'Delta G degree = -9.8 kJ/mol.',
    },
    commonMistake: 'Combining kJ and J without conversion.',
  }),
  formula({
    id: 'thermodynamics-electrochemical-cell',
    title: 'Electrochemical cell potential and charge',
    summary: 'Calculate standard cell potential and relate transferred charge to electron amount.',
    conceptGroup: 'electrochemistry',
    alignment: alignment(['galvanic-electrolytic-cells'], ['9.8.A'], ['2.F']),
    examReference: { status: 'provided', sourceId: 'ap-chemistry-reference-2026', note: 'The current exam reference information provides cell-potential, free-energy, and charge relationships.' },
    expression: 'E degree cell = E degree cathode - E degree anode; Delta G degree = -n F E degree cell; q = I t = n(e-)F',
    variables: [
      { symbol: 'E degree cell', meaning: 'standard cell potential', units: 'V' },
      { symbol: 'E degree cathode, E degree anode', meaning: 'listed standard reduction potentials', units: 'V' },
      { symbol: 'n', meaning: 'moles of electrons per reaction or transferred electron amount as context requires', units: 'mol' },
      { symbol: 'F', meaning: 'Faraday constant', units: 'C/mol e-' },
      { symbol: 'q', meaning: 'electric charge', units: 'C' },
      { symbol: 'I, t', meaning: 'current and elapsed time', units: 'A and s' },
    ],
    assumptions: ['Both table entries are reduction potentials.', 'The balanced redox reaction fixes electron amount.', 'Current is constant when q = It is used.'],
    appliesWhen: ['Predicting galvanic-cell voltage.', 'Connecting voltage with standard free energy.', 'Calculating electrolysis amount from current and time.'],
    doesNotApplyWhen: ['Multiplying an electrode potential by a stoichiometric coefficient.', 'Assigning anode and cathode from signs alone without identifying oxidation and reduction.'],
    rearrangements: ['q = It', 'moles e- = q/F', 'E degree cell > 0 corresponds to Delta G degree < 0 for the reaction as written.'],
    workedExample: {
      prompt: 'Cathode and anode reduction potentials are +0.80 V and +0.20 V. Two electrons transfer. Find E degree cell and Delta G degree using F = 96485 C/mol.',
      steps: ['Calculate E degree cell = 0.80 - 0.20 = 0.60 V.', 'Use Delta G degree = -(2)(96485)(0.60) J/mol.', 'Convert to kJ/mol.'],
      answer: 'E degree cell = +0.60 V and Delta G degree = -116 kJ/mol.',
    },
    commonMistake: 'Multiplying a reduction potential by the electron-balancing coefficient.',
  }),
  lesson({
    id: 'thermodynamics-entropy-free-energy-and-coupling',
    title: 'Entropy, free energy, equilibrium, and coupling',
    summary: 'Use particle dispersal and energy accounting to distinguish favorability, equilibrium, kinetics, dissolution, and coupled processes.',
    alignment: alignment(
      ['introduction-entropy', 'absolute-entropy-entropy-change', 'gibbs-free-energy-thermodynamic-favorability', 'thermodynamic-kinetic-control', 'free-energy-equilibrium', 'free-energy-dissolution', 'coupled-reactions'],
      ['9.1.A', '9.2.A', '9.3.A', '9.4.A', '9.5.A', '9.6.A', '9.7.A'], ['4.D', '5.F', '6.C', '6.D', '6.E'],
    ),
    prerequisites: ['Thermochemical equations and enthalpy.', 'Equilibrium constants and natural logarithms.', 'Particle-level phase and solution models.'],
    sections: [
      { heading: 'Predict entropy from accessible arrangements', body: 'Entropy increases when matter or energy can spread among more accessible arrangements. More gas particles, greater volume, mixing, and higher temperature often support an increase, but calculate products minus reactants when standard data are supplied.' },
      { heading: 'Use free energy for direction, not speed', body: 'Delta G combines enthalpy and entropy at a stated temperature. A negative value supports thermodynamic favorability under the stated conditions, but a large activation barrier may still make the process slow. At equilibrium the composition-dependent Delta G is zero, while Delta G degree records K through -RT ln K.' },
      { heading: 'Analyze dissolution and coupling as complete processes', body: 'Dissolution can be favorable even when endothermic if increased dispersal makes T Delta S sufficiently favorable. Coupled reactions must share and cancel an intermediate; scale and add both equations and their free energies.' },
    ],
    workedExamples: [
      { prompt: 'At 298 K, Delta H degree is +20.0 kJ/mol and Delta S degree is +100 J mol^-1 K^-1. Determine favorability.', steps: ['Convert entropy to 0.100 kJ mol^-1 K^-1.', 'Calculate Delta G degree = 20.0 - 298(0.100).'], answer: 'Delta G degree = -9.8 kJ/mol, favorable under standard-state conditions at 298 K.' },
      { prompt: 'A process with Delta G = +12 kJ is coupled one-to-one to a process with Delta G = -20 kJ.', steps: ['Add the reactions so their shared intermediate cancels.', 'Add free energies.'], answer: 'The net Delta G is -8 kJ, so the combined process is favorable as written.' },
    ],
    misconceptions: [
      { id: 'thermodynamics-entropy-only-disorder', claim: 'Entropy is visual messiness.', correction: 'Use matter and energy dispersal among accessible arrangements.' },
      { id: 'thermodynamics-entropy-reactants-minus-products', claim: 'Entropy uses reactants minus products.', correction: 'Use products minus reactants.' },
      { id: 'thermodynamics-delta-g-unit-mismatch', claim: 'J and kJ can be mixed directly.', correction: 'Convert units before subtracting T Delta S.' },
      { id: 'thermodynamics-favorable-means-fast', claim: 'Favorable means fast.', correction: 'Favorability and rate answer different questions.' },
      { id: 'thermodynamics-equilibrium-delta-g-standard-zero', claim: 'Delta G degree is zero at equilibrium.', correction: 'Composition-dependent Delta G is zero; Delta G degree depends on K.' },
      { id: 'thermodynamics-dissolution-enthalpy-alone', claim: 'Endothermic dissolution cannot occur.', correction: 'Both enthalpy and entropy determine Delta G.' },
      { id: 'thermodynamics-coupling-no-cancellation', claim: 'Any favorable process can drive any other.', correction: 'The scaled chemical processes must be coupled through cancellation.' },
    ],
    retrievalChecks: [
      { prompt: 'What two particle changes commonly raise entropy?', answer: 'Greater matter/energy dispersal, such as more gas particles or mixing.' },
      { prompt: 'What does negative Delta G not tell you?', answer: 'It does not tell you the reaction rate.' },
      { prompt: 'At equilibrium, which free energy is zero?', answer: 'The composition-dependent Delta G, not necessarily Delta G degree.' },
      { prompt: 'What must cancel in a coupled reaction?', answer: 'The shared intermediate connecting the processes.' },
    ],
    formulaIds: ['thermodynamics-reaction-entropy', 'thermodynamics-gibbs-free-energy'],
  }),
  lesson({
    id: 'thermodynamics-electrochemical-cells',
    title: 'Galvanic and electrolytic cells',
    summary: 'Track oxidation, reduction, electron flow, ion migration, cell potential, free energy, and electrolysis amount.',
    alignment: alignment(['galvanic-electrolytic-cells'], ['9.8.A'], ['2.F']),
    prerequisites: ['Oxidation numbers and balanced redox equations.', 'Moles, electric current, and unit conversion.', 'Gibbs free energy and favorability.'],
    sections: [
      { heading: 'Assign processes before signs', body: 'Oxidation occurs at the anode and reduction at the cathode in every cell. Electrons travel through the external circuit from anode to cathode. Electrode signs differ: a spontaneous galvanic cell has a negative anode and positive cathode, while an external source drives an electrolytic cell.' },
      { heading: 'Keep reduction-potential algebra intensive', body: 'Use listed reduction potentials as Ecell = Ecathode - Eanode. Do not multiply a potential by stoichiometric coefficients. Balance electrons to determine n only for free-energy or electrolysis calculations.' },
      { heading: 'Connect charge to chemical amount', body: 'Current is charge per time, so q = It. Divide charge by Faraday constant to obtain electron amount, then apply the balanced half-reaction ratio to the plated or consumed species.' },
    ],
    workedExamples: [
      { prompt: 'Reduction potentials are +0.80 V at the cathode and +0.20 V for the half-reaction reversed at the anode.', steps: ['Subtract the listed anode reduction potential from the cathode value.'], answer: 'E degree cell = +0.60 V.' },
      { prompt: 'A 2.00 A current runs for 965 s through a process requiring two electrons per metal atom.', steps: ['q = (2.00 C/s)(965 s) = 1930 C.', 'Moles e- = 1930/96485 = 0.0200 mol.', 'Divide by two.'], answer: '0.0100 mol metal is deposited.' },
    ],
    misconceptions: [
      { id: 'thermodynamics-anode-always-negative', claim: 'The anode is always negative.', correction: 'Oxidation defines the anode; its sign depends on cell type.' },
    ],
    retrievalChecks: [
      { prompt: 'Where does oxidation occur?', answer: 'At the anode.' },
      { prompt: 'Which way do electrons flow?', answer: 'From anode to cathode through the external circuit.' },
      { prompt: 'Do you multiply reduction potential by a coefficient?', answer: 'No; potential is intensive.' },
      { prompt: 'How do you convert current and time to electron amount?', answer: 'Use q = It, then moles e- = q/F.' },
    ],
    formulaIds: ['thermodynamics-electrochemical-cell', 'thermodynamics-gibbs-free-energy'],
  }),
  {
    id: 'thermodynamics-temperature-favorability-stimulus', kind: 'stimulus', schemaVersion: 1,
    title: 'Temperature-dependent reaction favorability',
    summary: 'An original thermodynamic data set for calculating free energy, locating a boundary temperature, and separating favorability from rate.',
    alignment: alignment(
      ['gibbs-free-energy-thermodynamic-favorability', 'thermodynamic-kinetic-control', 'free-energy-equilibrium'],
      ['9.3.A', '9.4.A', '9.5.A'], ['6.D', '6.E'],
    ),
    review: review(), provenance: provenance(),
    context: 'For the reaction X(g) -> Y(g), the standard enthalpy and entropy changes below may be treated as constant from 200 K through 400 K. No kinetic data are supplied.',
    representation: {
      type: 'table', caption: 'Standard thermodynamic data for X(g) -> Y(g)',
      columns: ['Quantity', 'Value'],
      rows: [['Delta H degree', '+42.0 kJ/mol'], ['Delta S degree', '+140 J/(mol K)']],
      accessibleDescription: 'For the reaction X gas forms Y gas, the standard enthalpy change is positive 42.0 kilojoules per mole and the standard entropy change is positive 140 joules per mole kelvin.',
    },
  },
  {
    id: 'thermodynamics-galvanic-cell-stimulus', kind: 'stimulus', schemaVersion: 1,
    title: 'Original M-Q galvanic cell data',
    summary: 'An original cell data set for potential, electron flow, free energy, and electrode-mass reasoning.',
    alignment: alignment(['galvanic-electrolytic-cells'], ['9.8.A'], ['2.F']), review: review(), provenance: provenance(),
    context: 'A galvanic cell uses M2+/M and Q+/Q half-cells under standard conditions. The balanced spontaneous cell reaction transfers two moles of electrons per mole of reaction.',
    representation: {
      type: 'table', caption: 'Standard reduction potentials',
      columns: ['Reduction half-reaction', 'E degree (V)'],
      rows: [['M2+(aq) + 2 e- -> M(s)', '-0.25'], ['Q+(aq) + e- -> Q(s)', '+0.55']],
      accessibleDescription: 'The standard reduction potential for M two plus to M is negative 0.25 volt. The standard reduction potential for Q plus to Q is positive 0.55 volt.',
    },
  },
  {
    id: 'thermodynamics-electrochemical-short-frq-rubric', kind: 'rubric', schemaVersion: 1,
    title: 'Draft rubric: galvanic-cell analysis',
    summary: 'A four-point rubric for electrodes, net reaction, cell potential, and free energy.',
    alignment: alignment(['galvanic-electrolytic-cells'], ['9.8.A'], ['2.F']), review: review(), provenance: provenance(),
    questionId: 'ap-chem-thermodynamics-electrochemistry-short-frq-001', maxPoints: 4,
    parts: [
      { id: 'part-a', prompt: 'Assign electrodes and electron flow.', points: [{ id: 'a-electrodes', criterion: 'Identifies M as anode, Q as cathode, and electron flow M to Q.', acceptableEvidence: 'The more positive Q reduction occurs at the cathode; M is oxidized at the anode.' }] },
      { id: 'part-b', prompt: 'Write the net reaction.', points: [{ id: 'b-reaction', criterion: 'Balances electron transfer and species.', acceptableEvidence: 'M(s) + 2 Q+(aq) -> M2+(aq) + 2 Q(s).' }] },
      { id: 'part-c', prompt: 'Calculate cell potential.', points: [{ id: 'c-potential', criterion: 'Subtracts anode reduction potential from cathode reduction potential.', acceptableEvidence: 'E degree cell = 0.55 - (-0.25) = +0.80 V.' }] },
      { id: 'part-d', prompt: 'Calculate standard free energy.', points: [{ id: 'd-free-energy', criterion: 'Uses Delta G degree = -nFE degree with n = 2.', acceptableEvidence: 'Delta G degree = -(2)(96485)(0.80) = -154 kJ/mol.' }] },
    ],
  },
  {
    id: 'thermodynamics-favorability-long-frq-rubric', kind: 'rubric', schemaVersion: 1,
    title: 'Draft rubric: entropy, free energy, equilibrium, and coupling',
    summary: 'A seven-point rubric for entropy, free energy, threshold temperature, kinetics, equilibrium, and coupling.',
    alignment: alignment(
      ['absolute-entropy-entropy-change', 'gibbs-free-energy-thermodynamic-favorability', 'thermodynamic-kinetic-control', 'free-energy-equilibrium', 'coupled-reactions'],
      ['9.2.A', '9.3.A', '9.4.A', '9.5.A', '9.7.A'], ['4.D', '5.F', '6.D', '6.E'],
    ),
    review: review(), provenance: provenance(), questionId: 'ap-chem-thermodynamics-electrochemistry-long-frq-001', maxPoints: 7,
    parts: [
      { id: 'part-a', prompt: 'Calculate standard reaction entropy.', points: [{ id: 'a-entropy', criterion: 'Uses products minus reactants with coefficients.', acceptableEvidence: 'Delta S degree = 260 - (190 + 210) = -140 J mol^-1 K^-1.' }] },
      { id: 'part-b', prompt: 'Calculate standard free energy at 298 K.', points: [
        { id: 'b-unit-conversion', criterion: 'Converts entropy to kJ mol^-1 K^-1.', acceptableEvidence: 'Uses -0.140 kJ mol^-1 K^-1.' },
        { id: 'b-free-energy', criterion: 'Evaluates Delta H - T Delta S.', acceptableEvidence: 'Delta G degree = -50.0 - 298(-0.140) = -8.28 kJ/mol.' },
      ] },
      { id: 'part-c', prompt: 'Find the boundary temperature.', points: [{ id: 'c-temperature', criterion: 'Sets Delta G degree to zero with consistent units.', acceptableEvidence: 'T = (-50.0 kJ/mol)/(-0.140 kJ mol^-1 K^-1) = 357 K.' }] },
      { id: 'part-d', prompt: 'Separate kinetics from thermodynamics.', points: [{ id: 'd-kinetics', criterion: 'States that favorable Delta G does not ensure fast rate.', acceptableEvidence: 'A large activation barrier can make a favorable process slow.' }] },
      { id: 'part-e', prompt: 'Interpret equilibrium constant magnitude.', points: [{ id: 'e-equilibrium', criterion: 'Connects negative Delta G degree with K greater than one.', acceptableEvidence: 'Because Delta G degree = -RT ln K is negative, ln K is positive and K > 1.' }] },
      { id: 'part-f', prompt: 'Analyze coupling.', points: [{ id: 'f-coupling', criterion: 'Adds scaled free energies after chemical cancellation.', acceptableEvidence: 'Coupling +12 kJ/mol one-to-one gives net Delta G degree = +3.72 kJ/mol at 298 K, so that combination is not favorable.' }] },
    ],
  },
]

export const apChemistryThermodynamicsElectrochemistryResources = Object.freeze(
  assertValidEditorialCatalog(resources).map((resource) => Object.freeze(resource)),
)
