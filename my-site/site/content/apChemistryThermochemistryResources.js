import { assertValidEditorialCatalog } from './editorialSchema.js'

const UNIT_ID = 'thermochemistry'
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
  return {
    frameworkId: 'ap-chemistry-fall-2024', subjectId: 'ap-chemistry', domainId: UNIT_ID,
    skillIds, learningObjectiveIds, sciencePracticeIds,
  }
}
function formula(definition) {
  return { kind: 'formula', schemaVersion: 1, review: review(), provenance: provenance(), conceptGroup: 'energy-and-enthalpy', ...definition }
}
function lesson(definition) {
  return { kind: 'lesson', schemaVersion: 1, review: review(), provenance: provenance(), ...definition }
}

const resources = [
  formula({
    id: 'thermochemistry-heat-capacity',
    title: 'Sensible heat and heat capacity',
    summary: 'Relate a temperature change to energy transfer using sample heat capacity.',
    alignment: alignment(['heat-transfer-thermal-equilibrium', 'heat-capacity-calorimetry'], ['6.3.A', '6.4.A'], ['2.D', '6.E']),
    examReference: { status: 'provided', sourceId: 'ap-chemistry-reference-2026', note: 'The current exam reference information provides the mass-specific heat relationship.' },
    expression: 'q = mc Delta T; C = q/Delta T',
    variables: [
      { symbol: 'q', meaning: 'heat absorbed by the selected object', units: 'J' },
      { symbol: 'm', meaning: 'sample mass', units: 'g' },
      { symbol: 'c', meaning: 'specific heat capacity', units: 'J g^-1 K^-1' },
      { symbol: 'C', meaning: 'heat capacity of the whole object', units: 'J K^-1' },
      { symbol: 'Delta T', meaning: 'final temperature minus initial temperature', units: 'K or degrees C' },
    ],
    assumptions: ['The heat capacity is effectively constant over the interval.', 'No phase change occurs.', 'The identified object is the system for the sign of q.'],
    appliesWhen: ['Heating or cooling within one phase.', 'Interpreting coffee-cup or calibrated calorimeter data.'],
    doesNotApplyWhen: ['A phase transition occurs during the interval.', 'Unaccounted heat loss is large.'],
    rearrangements: ['c = q/(m Delta T)', 'Delta T = q/(mc)', 'For an isolated exchange, qhot + qcold = 0.'],
    workedExample: {
      prompt: 'How much heat does 125.0 g of water absorb when it warms from 20.0 to 26.0 degrees C? Use c = 4.184 J g^-1 K^-1.',
      steps: ['Calculate Delta T = 6.0 K.', 'Substitute q = (125.0 g)(4.184 J g^-1 K^-1)(6.0 K).', 'The positive sign indicates absorption by the water.'],
      answer: 'q = +3.14 x 10^3 J.',
    },
    commonMistake: 'Using the initial temperature instead of the temperature change.',
  }),
  formula({
    id: 'thermochemistry-formation-enthalpy',
    title: 'Reaction enthalpy from standard formation values',
    summary: 'Calculate a reaction enthalpy from stoichiometric sums of product and reactant formation enthalpies.',
    alignment: alignment(['introduction-enthalpy-reaction', 'enthalpy-formation'], ['6.6.A', '6.8.A'], ['5.F']),
    examReference: { status: 'provided', sourceId: 'ap-chemistry-reference-2026', note: 'The current exam reference information provides the standard formation-enthalpy relationship.' },
    expression: 'Delta Hrxn = sum(n Delta Hf products) - sum(n Delta Hf reactants)',
    variables: [
      { symbol: 'Delta Hrxn', meaning: 'enthalpy change for the reaction as written', units: 'kJ per stated reaction' },
      { symbol: 'n', meaning: 'stoichiometric coefficient', units: 'none' },
      { symbol: 'Delta Hf', meaning: 'standard molar enthalpy of formation', units: 'kJ/mol' },
    ],
    assumptions: ['Values correspond to the stated phases and standard states.', 'The chemical equation is balanced.', 'An element in its standard state has Delta Hf = 0.'],
    appliesWhen: ['Standard formation values are supplied.', 'Comparing alternative paths between the same initial and final states.'],
    doesNotApplyWhen: ['Phases in the data do not match the equation.', 'Coefficients are omitted from the sums.'],
    rearrangements: ['Scale Delta Hrxn when the equation is scaled.', 'Reverse the sign when the equation is reversed.'],
    workedExample: {
      prompt: 'For R(g) + 2 S(g) -> T(g), Delta Hf values are -40, 0, and -190 kJ/mol respectively. Find Delta Hrxn.',
      steps: ['Product sum is -190 kJ.', 'Reactant sum is -40 + 2(0) = -40 kJ.', 'Subtract reactants from products.'],
      answer: 'Delta Hrxn = -150 kJ per reaction as written.',
    },
    commonMistake: 'Subtracting products from reactants or ignoring coefficients.',
  }),
  formula({
    id: 'thermochemistry-bond-enthalpy',
    title: 'Reaction enthalpy from average bond enthalpies',
    summary: 'Estimate gas-phase reaction enthalpy by comparing bonds broken with bonds formed.',
    alignment: alignment(['bond-enthalpies'], ['6.7.A'], ['5.F']),
    examReference: { status: 'provided', sourceId: 'ap-chemistry-reference-2026', note: 'The current exam reference information provides the average bond-enthalpy relationship and table.' },
    expression: 'Delta Hrxn approximately sum(D bonds broken) - sum(D bonds formed)',
    variables: [
      { symbol: 'D', meaning: 'average bond enthalpy', units: 'kJ/mol of bonds' },
      { symbol: 'Delta Hrxn', meaning: 'estimated reaction enthalpy', units: 'kJ per stated reaction' },
    ],
    assumptions: ['Species are represented as gas-phase bonds.', 'Average bond enthalpies are suitable estimates.', 'All changed bonds are counted with stoichiometric multiplicity.'],
    appliesWhen: ['Estimating enthalpy from molecular structures.', 'Explaining why bond formation offsets bond-breaking cost.'],
    doesNotApplyWhen: ['A precise phase-specific enthalpy is required.', 'Intermolecular phase effects dominate but are omitted.'],
    rearrangements: ['Energy required to break bonds is positive.', 'Energy released by forming bonds enters through subtraction.'],
    workedExample: {
      prompt: 'One A-A bond and one B-B bond are broken and two A-B bonds form. Their bond enthalpies are 160, 240, and 230 kJ/mol. Estimate Delta H.',
      steps: ['Broken-bond sum = 160 + 240 = 400 kJ.', 'Formed-bond sum = 2(230) = 460 kJ.', 'Calculate 400 - 460.'],
      answer: 'Delta H is approximately -60 kJ.',
    },
    commonMistake: 'Adding both bond sums instead of subtracting the formed-bond sum.',
  }),
  lesson({
    id: 'thermochemistry-energy-transfer-and-calorimetry',
    title: 'Energy transfer, phase change, and calorimetry',
    summary: 'Track heat signs, distinguish temperature from transferred energy, and solve thermal-exchange experiments.',
    alignment: alignment(
      ['endothermic-exothermic-processes', 'energy-diagrams', 'heat-transfer-thermal-equilibrium', 'heat-capacity-calorimetry', 'energy-phase-changes'],
      ['6.1.A', '6.2.A', '6.3.A', '6.4.A', '6.5.A'], ['1.B', '2.D', '3.A', '6.D', '6.E'],
    ),
    prerequisites: ['System and surroundings.', 'Conservation of energy.', 'Mass, moles, and temperature differences.'],
    sections: [
      { heading: 'Choose the system before assigning signs', body: 'Heat is positive for the object that absorbs it and negative for the object that releases it. Exothermic and endothermic labels describe the chosen system, not whether a thermometer rises or falls in isolation.' },
      { heading: 'Separate temperature from energy', body: 'Temperature tracks average particle energy. The energy required for a temperature change also depends on mass and heat capacity. At thermal equilibrium, objects share a final temperature while transferring equal-magnitude, opposite-sign heat in an ideal isolated exchange.' },
      { heading: 'Treat phase plateaus separately', body: 'Within one phase use q = mc Delta T. During a phase transition, added or removed energy changes intermolecular organization at nearly constant temperature, so a latent-heat relationship is needed instead.' },
    ],
    workedExamples: [
      { prompt: 'A reaction warms 125.0 g of solution by 6.0 K. With c = 4.184 J g^-1 K^-1, find qreaction.', steps: ['Calculate qsolution = mc Delta T = +3.14 kJ.', 'Use qreaction = -qsolution.'], answer: 'qreaction = -3.14 kJ for the reacting amount.' },
      { prompt: 'Equal masses of two liquids exchange heat. Liquid X has twice the specific heat of Y. Which has the smaller temperature change?', steps: ['The exchanged heat magnitudes are equal.', 'Use |Delta T| = |q|/(mc).', 'Larger c produces smaller |Delta T|.'], answer: 'Liquid X has half the temperature-change magnitude of Y.' },
    ],
    misconceptions: [
      { id: 'thermochemistry-exothermic-system-gains-heat', claim: 'Exothermic means the system gains heat.', correction: 'The system releases heat to its surroundings.' },
      { id: 'thermochemistry-diagram-sign-from-peak', claim: 'The peak height sets the sign of Delta H.', correction: 'Endpoint ordering sets the sign; peak height describes activation energy.' },
      { id: 'thermochemistry-temperature-equals-heat', claim: 'Hotter always means more energy transferred.', correction: 'Mass and heat capacity also determine q.' },
      { id: 'thermochemistry-calorimeter-same-sign', claim: 'Reaction and solution q have the same sign.', correction: 'They have opposite signs in an ideal calorimeter.' },
      { id: 'thermochemistry-phase-change-temperature-rise', claim: 'Temperature rises throughout melting.', correction: 'Energy changes phase at an approximately constant melting temperature.' },
    ],
    retrievalChecks: [
      { prompt: 'A solution warms during a reaction. What is the sign of qreaction?', answer: 'Negative, because the reaction transfers heat to the solution.' },
      { prompt: 'What determines Delta H on an energy diagram?', answer: 'The energy difference between products and reactants.' },
      { prompt: 'Why can two objects at the same temperature contain different thermal energy?', answer: 'They can have different amounts and heat capacities.' },
      { prompt: 'Which relationship applies within one phase?', answer: 'q = mc Delta T.' },
    ],
    formulaIds: ['thermochemistry-heat-capacity'],
  }),
  lesson({
    id: 'thermochemistry-reaction-enthalpy-pathways',
    title: 'Reaction enthalpy from equations, bonds, and state functions',
    summary: 'Scale thermochemical equations and calculate enthalpy through formation values, bond estimates, and Hess cycles.',
    alignment: alignment(
      ['introduction-enthalpy-reaction', 'bond-enthalpies', 'enthalpy-formation', 'hess-law'],
      ['6.6.A', '6.7.A', '6.8.A', '6.9.A', '6.9.B'], ['5.A', '5.F'],
    ),
    prerequisites: ['Balanced equations and stoichiometric coefficients.', 'Molecular structures and bond counting.', 'Algebraic addition of equations.'],
    sections: [
      { heading: 'Treat enthalpy as reaction stoichiometry', body: 'A listed Delta H belongs to the reaction exactly as written. Multiplying the equation multiplies Delta H; reversing the reaction reverses the sign.' },
      { heading: 'Choose data that match the desired precision', body: 'Formation enthalpies use phase-specific state-function data. Average bond enthalpies estimate gas-phase changes by subtracting formed-bond energy from broken-bond energy.' },
      { heading: 'Build a Hess path without changing endpoints', body: 'Because enthalpy is a state function, valid intermediate equations may be reversed, scaled, and added until they cancel to the target. Apply every equation operation to its Delta H.' },
    ],
    workedExamples: [
      { prompt: 'Using Delta Hf values -40, 0, and -190 kJ/mol for R, S, and T, find Delta H for R + 2 S -> T.', steps: ['Sum products: -190 kJ.', 'Sum reactants: -40 kJ.', 'Subtract.'], answer: 'Delta H = -150 kJ.' },
      { prompt: 'A -> B has Delta H = +25 kJ and B -> C has Delta H = -70 kJ. Find A -> C.', steps: ['Add equations so B cancels.', 'Add their enthalpies.'], answer: 'Delta H = -45 kJ.' },
    ],
    misconceptions: [
      { id: 'thermochemistry-enthalpy-not-extensive', claim: 'Delta H does not scale with reaction amount.', correction: 'It scales with the equation and reverses sign with direction.' },
      { id: 'thermochemistry-bond-enthalpy-signs', claim: 'Bond breaking releases energy.', correction: 'Breaking requires energy and forming releases it.' },
      { id: 'thermochemistry-elements-nonzero-formation', claim: 'Standard elements require tabulated nonzero values.', correction: 'Their standard formation enthalpy is zero.' },
      { id: 'thermochemistry-hess-no-scaling', claim: 'Equation algebra leaves Delta H unchanged.', correction: 'Perform the identical reversal or scale operation on Delta H.' },
    ],
    retrievalChecks: [
      { prompt: 'What happens to Delta H when a reaction is reversed?', answer: 'Its sign reverses.' },
      { prompt: 'What is the bond-enthalpy sign pattern?', answer: 'Bonds broken minus bonds formed.' },
      { prompt: 'What is Delta Hf for O2(g) in its standard state?', answer: 'Zero.' },
      { prompt: 'Why may Hess equations be combined?', answer: 'Enthalpy depends only on the initial and final states.' },
    ],
    formulaIds: ['thermochemistry-formation-enthalpy', 'thermochemistry-bond-enthalpy'],
  }),
  {
    id: 'thermochemistry-calorimetry-stimulus', kind: 'stimulus', schemaVersion: 1,
    title: 'Calorimeter calibration and reaction trial',
    summary: 'An original two-stage data set for determining calorimeter heat capacity and molar reaction enthalpy.',
    alignment: alignment(['heat-capacity-calorimetry', 'introduction-enthalpy-reaction'], ['6.4.A', '6.6.A'], ['2.D', '5.F']),
    review: review(), provenance: provenance(),
    context: 'A rigid insulated calorimeter is first calibrated electrically. A separate reaction trial then occurs in the same calorimeter. Heat exchange with the external room is negligible.',
    representation: {
      type: 'table', caption: 'Calibration and reaction-trial measurements',
      columns: ['Trial', 'Energy or reacting amount', 'Initial temperature', 'Final temperature'],
      rows: [
        ['Electrical calibration', '2.40 kJ supplied', '21.0 degrees C', '25.0 degrees C'],
        ['Chemical reaction', '0.0200 mol reacted', '22.0 degrees C', '27.0 degrees C'],
      ],
      accessibleDescription: 'The electrical calibration supplies 2.40 kilojoules and raises the calorimeter from 21.0 to 25.0 degrees Celsius. In the reaction trial, 0.0200 mole reacts and the calorimeter rises from 22.0 to 27.0 degrees Celsius.',
    },
  },
  {
    id: 'thermochemistry-heating-curve-stimulus', kind: 'stimulus', schemaVersion: 1,
    title: 'Heating a pure solid through melting',
    summary: 'An original cumulative-energy data set for calculating heat capacity and interpreting a constant-temperature phase transition.',
    alignment: alignment(['heat-capacity-calorimetry', 'energy-phase-changes'], ['6.4.A', '6.5.A'], ['1.B', '2.D', '5.F']),
    review: review(), provenance: provenance(),
    context: 'A student supplies energy at a steady average rate to a 50.0 g sample of a pure substance in an insulated container. The sample begins as a solid. Heat absorbed by the container is negligible, and the pressure remains constant.',
    representation: {
      type: 'table', caption: 'Cumulative energy supplied and sample temperature',
      columns: ['Cumulative energy supplied (kJ)', 'Sample temperature (degrees C)', 'Observed state'],
      rows: [
        ['0.00', '20.0', 'Solid'],
        ['2.50', '45.0', 'Solid begins to melt'],
        ['5.00', '45.0', 'Melting is complete'],
        ['7.50', '70.0', 'Liquid'],
      ],
      accessibleDescription: 'A 50.0 gram solid starts at 20.0 degrees Celsius with zero energy supplied. At 2.50 kilojoules it reaches 45.0 degrees and begins melting. The temperature remains 45.0 degrees through 5.00 kilojoules, when melting is complete. At 7.50 kilojoules the liquid reaches 70.0 degrees.',
    },
  },
  {
    id: 'thermochemistry-calorimetry-short-frq-rubric', kind: 'rubric', schemaVersion: 1,
    title: 'Draft rubric: calibrated reaction calorimetry',
    summary: 'A four-point rubric for calibration, heat balance, molar enthalpy, and sign interpretation.',
    alignment: alignment(['heat-capacity-calorimetry', 'introduction-enthalpy-reaction'], ['6.4.A', '6.6.A'], ['2.D', '5.F']),
    review: review(), provenance: provenance(), questionId: 'ap-chem-thermochemistry-short-frq-001', maxPoints: 4,
    parts: [
      { id: 'part-a', prompt: 'Determine calorimeter heat capacity.', points: [{ id: 'a-capacity', criterion: 'Uses calibration energy divided by temperature change.', acceptableEvidence: 'Ccal = 2.40 kJ/4.0 K = 0.600 kJ K^-1.' }] },
      { id: 'part-b', prompt: 'Determine calorimeter heat in the reaction trial.', points: [{ id: 'b-calorimeter-heat', criterion: 'Applies qcal = Ccal Delta T.', acceptableEvidence: 'qcal = (0.600 kJ K^-1)(5.0 K) = +3.00 kJ.' }] },
      { id: 'part-c', prompt: 'Calculate molar reaction enthalpy.', points: [{ id: 'c-molar-enthalpy', criterion: 'Uses the opposite reaction sign and divides by reacting amount.', acceptableEvidence: 'Delta H = -3.00 kJ/0.0200 mol = -150 kJ/mol.' }] },
      { id: 'part-d', prompt: 'Explain the sign.', points: [{ id: 'd-sign', criterion: 'Links the temperature rise to heat released by the reaction.', acceptableEvidence: 'The calorimeter absorbs heat, so the reaction is exothermic and has negative Delta H.' }] },
    ],
  },
  {
    id: 'thermochemistry-pathways-long-frq-rubric', kind: 'rubric', schemaVersion: 1,
    title: 'Draft rubric: three routes to reaction enthalpy',
    summary: 'A seven-point rubric for formation values, Hess algebra, bond estimates, scaling, and evidence comparison.',
    alignment: alignment(['bond-enthalpies', 'enthalpy-formation', 'hess-law'], ['6.7.A', '6.8.A', '6.9.A', '6.9.B'], ['5.A', '5.F']),
    review: review(), provenance: provenance(), questionId: 'ap-chem-thermochemistry-long-frq-001', maxPoints: 7,
    parts: [
      { id: 'part-a', prompt: 'Calculate Delta H from formation values.', points: [
        { id: 'a-setup', criterion: 'Uses products minus reactants with coefficients.', acceptableEvidence: 'Writes [-286] - [(-100) + (-120)].' },
        { id: 'a-result', criterion: 'Evaluates the formation-enthalpy expression.', acceptableEvidence: 'Obtains -66 kJ for the reaction as written.' },
      ] },
      { id: 'part-b', prompt: 'Obtain the target with Hess equations.', points: [
        { id: 'b-operations', criterion: 'Reverses/scales the supplied equations consistently.', acceptableEvidence: 'Combines X + O2 -> XO2, Y + 1/2 O2 -> YO, and the reverse of XY + 3/2 O2 -> XO2 + YO.' },
        { id: 'b-result', criterion: 'Adds enthalpies with the same operations.', acceptableEvidence: 'Calculates -100 + -120 + 154 = -66 kJ.' },
      ] },
      { id: 'part-c', prompt: 'Interpret a bond-enthalpy estimate of -58 kJ.', points: [{ id: 'c-estimate', criterion: 'Explains why the estimate can differ from formation data.', acceptableEvidence: 'Average bond enthalpies are approximate gas-phase averages and may omit phase-specific effects.' }] },
      { id: 'part-d', prompt: 'Scale the target reaction.', points: [{ id: 'd-scale', criterion: 'Scales enthalpy with reaction amount.', acceptableEvidence: 'For 0.250 mol reaction, q = 0.250(-66) = -16.5 kJ.' }] },
      { id: 'part-e', prompt: 'Explain path independence.', points: [{ id: 'e-state-function', criterion: 'Connects identical endpoints with identical enthalpy change.', acceptableEvidence: 'Enthalpy is a state function, so any valid path from the same reactants to products gives the same Delta H.' }] },
    ],
  },
]

export const apChemistryThermochemistryResources = Object.freeze(
  assertValidEditorialCatalog(resources).map((resource) => Object.freeze(resource)),
)
