import { TAXONOMY_VERSION } from '../../taxonomy/contentTaxonomy.js'

const source = Object.freeze({ kind: 'ai-generated', name: 'Study AI Helper original AP Chemistry draft', externalId: null, license: null })
const content = Object.freeze({
  status: 'draft', version: 1, revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: '2026-07-24', reviewers: Object.freeze([]),
})
const refs = Object.freeze({
  'introduction-entropy': { formulaIds: [], priorKnowledge: ['particle-dispersal-phase-and-volume'] },
  'absolute-entropy-entropy-change': { formulaIds: ['thermodynamics-reaction-entropy'], priorKnowledge: [] },
  'gibbs-free-energy-thermodynamic-favorability': { formulaIds: ['thermodynamics-gibbs-free-energy'], priorKnowledge: [] },
  'thermodynamic-kinetic-control': { formulaIds: ['thermodynamics-gibbs-free-energy'], priorKnowledge: ['activation-energy-and-rate'] },
  'free-energy-equilibrium': { formulaIds: ['thermodynamics-gibbs-free-energy'], priorKnowledge: [] },
  'free-energy-dissolution': { formulaIds: ['thermodynamics-gibbs-free-energy'], priorKnowledge: ['solute-solvent-interactions-and-mixing'] },
  'coupled-reactions': { formulaIds: ['thermodynamics-gibbs-free-energy'], priorKnowledge: ['reaction-equation-algebra'] },
  'galvanic-electrolytic-cells': { formulaIds: ['thermodynamics-electrochemical-cell'], priorKnowledge: ['oxidation-reduction-and-electron-balance'] },
})
function referenceRequirements(skillId) {
  const value = refs[skillId]
  if (!value) throw new Error(`Missing Unit 9 reference requirements for ${skillId}`)
  return value
}
function taxonomy(skillId, learningObjectiveId, sciencePracticeIds, questionTypeId = 'multiple-choice') {
  return {
    version: TAXONOMY_VERSION, examId: 'ap', subjectId: 'ap-chemistry', domainId: 'thermodynamics-electrochemistry',
    skillId, learningObjectiveIds: [learningObjectiveId], sciencePracticeIds, questionTypeId,
    answeringMethodId: questionTypeId === 'free-response' ? 'write-response' : 'select-option',
  }
}
function multipleChoice({ id, skillId, learningObjectiveId, sciencePracticeIds, prompt, options, correctOptionId, explanation, hints, misconceptionIds, difficulty = 'developing', stimulusId }) {
  return {
    id, taxonomy: taxonomy(skillId, learningObjectiveId, sciencePracticeIds), renderer: 'multiple-choice', prompt,
    answer: { kind: 'selected-response', options, correctOptionId }, explanation, hints, misconceptionIds,
    referenceRequirements: referenceRequirements(skillId), difficulty, ...(stimulusId ? { stimulusId } : {}),
    source: { ...source }, content: { ...content }, tags: ['ap-chemistry', 'thermodynamics-electrochemistry'],
  }
}
function freeResponse({ id, skillId, learningObjectiveId, sciencePracticeIds, prompt, modelAnswer, explanation, hints, misconceptionIds, responseFormat, rubricId, parts }) {
  return {
    id, taxonomy: taxonomy(skillId, learningObjectiveId, sciencePracticeIds, 'free-response'), renderer: 'free-response', prompt,
    answer: { kind: 'free-response', grading: 'manual', modelAnswer }, explanation, hints, misconceptionIds,
    referenceRequirements: referenceRequirements(skillId), difficulty: 'exam-ready', responseFormat, rubricId, parts,
    source: { ...source }, content: { ...content }, tags: ['ap-chemistry', 'thermodynamics-electrochemistry', responseFormat],
  }
}
const options = (...texts) => texts.map((text, index) => ({ id: String.fromCharCode(97 + index), text }))

export const apChemistryThermodynamicsElectrochemistryQuestions = Object.freeze([
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-001', skillId: 'introduction-entropy', learningObjectiveId: '9.1.A', sciencePracticeIds: ['6.C'],
    prompt: 'Which change most clearly increases the entropy of a fixed amount of ideal gas?',
    options: options('Expansion into a larger evacuated volume at the same temperature', 'Compression into half the volume at the same temperature', 'Condensation to a liquid', 'Cooling at constant volume'),
    correctOptionId: 'a', explanation: 'Expansion gives the gas particles more accessible positional arrangements, increasing matter dispersal and entropy.',
    hints: ['Compare the number of accessible particle arrangements.'], misconceptionIds: ['thermodynamics-entropy-only-disorder'], difficulty: 'introductory',
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-002', skillId: 'absolute-entropy-entropy-change', learningObjectiveId: '9.2.A', sciencePracticeIds: ['5.F'],
    prompt: 'For A(g) + B(g) -> C(g), standard molar entropies are 190, 210, and 260 J mol^-1 K^-1 respectively. What is Delta S degree rxn?',
    options: options('-140 J mol^-1 K^-1', '+140 J mol^-1 K^-1', '+260 J mol^-1 K^-1', '-660 J mol^-1 K^-1'),
    correctOptionId: 'a', explanation: 'Delta S degree = 260 - (190 + 210) = -140 J mol^-1 K^-1.',
    hints: ['Use products minus reactants.'], misconceptionIds: ['thermodynamics-entropy-reactants-minus-products'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-003', skillId: 'gibbs-free-energy-thermodynamic-favorability', learningObjectiveId: '9.3.A', sciencePracticeIds: ['6.E'],
    prompt: 'At 298 K, a process has Delta H degree = +20.0 kJ/mol and Delta S degree = +100 J mol^-1 K^-1. What is Delta G degree?',
    options: options('-9.8 kJ/mol', '+19.9 kJ/mol', '+49.8 kJ/mol', '-29.8 kJ/mol'),
    correctOptionId: 'a', explanation: 'Convert entropy to 0.100 kJ mol^-1 K^-1, then Delta G degree = 20.0 - 298(0.100) = -9.8 kJ/mol.',
    hints: ['Make the entropy energy unit match the enthalpy unit.'], misconceptionIds: ['thermodynamics-delta-g-unit-mismatch'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-004', skillId: 'thermodynamic-kinetic-control', learningObjectiveId: '9.4.A', sciencePracticeIds: ['6.E'],
    prompt: 'A reaction has negative Delta G under the stated conditions but shows no measurable change over several minutes. Which explanation is most appropriate?',
    options: options('The reaction is thermodynamically favorable but may have a large activation barrier.', 'Negative Delta G requires the reaction to be at equilibrium.', 'The equilibrium constant must be less than one.', 'The reaction is necessarily endothermic.'),
    correctOptionId: 'a', explanation: 'Delta G addresses thermodynamic direction, whereas the activation barrier controls how quickly a pathway is traversed.',
    hints: ['Separate direction from rate.'], misconceptionIds: ['thermodynamics-favorable-means-fast'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-005', skillId: 'free-energy-equilibrium', learningObjectiveId: '9.5.A', sciencePracticeIds: ['6.D'],
    prompt: 'For a reaction at 298 K, Delta G degree is negative. Which conclusion follows from Delta G degree = -RT ln K?',
    options: options('K is greater than 1.', 'K equals 1.', 'K is less than 1.', 'The forward reaction must be instantaneous.'),
    correctOptionId: 'a', explanation: 'Negative Delta G degree makes ln K positive, so K > 1 and products are favored at equilibrium under the standard relationship.',
    hints: ['R and T are positive.'], misconceptionIds: ['thermodynamics-equilibrium-delta-g-standard-zero'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-006', skillId: 'free-energy-dissolution', learningObjectiveId: '9.6.A', sciencePracticeIds: ['4.D'],
    prompt: 'A salt dissolves endothermically but dissolves spontaneously at a sufficiently high temperature. Which explanation is consistent with Delta G = Delta H - T Delta S?',
    options: options('A positive entropy change makes the -T Delta S term sufficiently negative.', 'Endothermic dissolution requires Delta S to be negative.', 'The activation energy becomes the equilibrium constant.', 'Delta H changes sign because the solution is mixed.'),
    correctOptionId: 'a', explanation: 'When Delta S is positive, increasing T strengthens the favorable negative -T Delta S contribution enough to outweigh positive Delta H.',
    hints: ['Consider the sign and temperature dependence of -T Delta S.'], misconceptionIds: ['thermodynamics-dissolution-enthalpy-alone'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-007', skillId: 'coupled-reactions', learningObjectiveId: '9.7.A', sciencePracticeIds: ['4.D'],
    prompt: 'Process 1 has Delta G degree = +12 kJ/mol and consumes intermediate I. Process 2 produces I and has Delta G degree = -20 kJ/mol. The equations add one-to-one and I cancels. What is the net Delta G degree?',
    options: options('-8 kJ/mol', '+8 kJ/mol', '-32 kJ/mol', '+32 kJ/mol'),
    correctOptionId: 'a', explanation: 'Because the coupled equations add one-to-one and I cancels, the free energies add: +12 + (-20) = -8 kJ/mol.',
    hints: ['Verify the intermediate cancellation, then add the scaled values.'], misconceptionIds: ['thermodynamics-coupling-no-cancellation'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-008', skillId: 'galvanic-electrolytic-cells', learningObjectiveId: '9.8.A', sciencePracticeIds: ['2.F'],
    prompt: 'Which statement is true for both galvanic and electrolytic cells?',
    options: options('Oxidation occurs at the anode and electrons move through the external circuit toward the cathode.', 'The anode is negative.', 'The cathode reaction produces electrons.', 'The cell reaction is spontaneous.'),
    correctOptionId: 'a', explanation: 'Anode means oxidation and cathode means reduction in both cell types. Electrode signs and spontaneity differ.',
    hints: ['Use process definitions rather than memorized signs.'], misconceptionIds: ['thermodynamics-anode-always-negative'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-009', skillId: 'introduction-entropy', learningObjectiveId: '9.1.A', sciencePracticeIds: ['6.C'],
    prompt: 'Two different ideal gases initially occupy separate equal-volume chambers at the same temperature. A partition is removed while total volume and temperature remain fixed. Why does entropy increase?',
    options: options('Each gas can occupy more positional arrangements throughout the combined volume.', 'The gases become chemically bonded and lose kinetic energy.', 'The number of gas particles decreases.', 'The final sample must have a higher temperature.'),
    correctOptionId: 'a', explanation: 'Mixing lets particles of each gas access positions throughout the total volume, increasing the number of accessible arrangements without requiring a temperature change.',
    hints: ['Describe how matter is distributed before and after removing the partition.'], misconceptionIds: ['thermodynamics-entropy-only-disorder'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-010', skillId: 'absolute-entropy-entropy-change', learningObjectiveId: '9.2.A', sciencePracticeIds: ['5.F'],
    prompt: 'For 2 D(g) -> E(g) + F(g), standard molar entropies are 150, 200, and 250 J mol^-1 K^-1 for D, E, and F. What is Delta S degree rxn?',
    options: options('+150 J mol^-1 K^-1', '-150 J mol^-1 K^-1', '+300 J mol^-1 K^-1', '+450 J mol^-1 K^-1'),
    correctOptionId: 'a', explanation: 'Products minus reactants gives (200 + 250) - 2(150) = +150 J mol^-1 K^-1.',
    hints: ['Include every stoichiometric coefficient in the entropy sums.'], misconceptionIds: ['thermodynamics-entropy-reactants-minus-products'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-011', skillId: 'gibbs-free-energy-thermodynamic-favorability', learningObjectiveId: '9.3.A', sciencePracticeIds: ['6.E'],
    prompt: 'At 500 K, a process has Delta H degree = -30.0 kJ/mol and Delta S degree = -50.0 J mol^-1 K^-1. What is Delta G degree?',
    options: options('-5.0 kJ/mol', '-55.0 kJ/mol', '+5.0 kJ/mol', '+25.0 kJ/mol'),
    correctOptionId: 'a', explanation: 'Convert entropy to -0.0500 kJ mol^-1 K^-1. Then Delta G degree = -30.0 - 500(-0.0500) = -5.0 kJ/mol.',
    hints: ['Convert the entropy unit before multiplying by temperature.'], misconceptionIds: ['thermodynamics-delta-g-unit-mismatch'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-012', skillId: 'thermodynamic-kinetic-control', learningObjectiveId: '9.4.A', sciencePracticeIds: ['6.E'],
    prompt: 'A catalyst is added to a reaction mixture at fixed temperature. Which statement correctly separates kinetic and thermodynamic effects?',
    options: options('The catalyst can increase forward and reverse rates without changing Delta G degree or the equilibrium constant.', 'The catalyst makes Delta G degree more negative by lowering product energy.', 'The catalyst changes an unfavorable reaction into a favorable one.', 'The catalyst increases the equilibrium product fraction by accelerating only the forward pathway.'),
    correctOptionId: 'a', explanation: 'A catalyst changes the pathway barriers and rates in both directions, but it does not change state-function differences or the fixed-temperature equilibrium constant.',
    hints: ['Separate pathway barriers from reactant and product state energies.'], misconceptionIds: ['thermodynamics-favorable-means-fast'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-013', skillId: 'free-energy-equilibrium', learningObjectiveId: '9.5.A', sciencePracticeIds: ['6.D'],
    prompt: 'At a stated temperature, a reaction has K = 0.010. Which statement about its standard free-energy change is correct?',
    options: options('Delta G degree is positive because ln K is negative.', 'Delta G degree is zero because the system can reach equilibrium.', 'Delta G degree is negative because K is nonzero.', 'The sign cannot be inferred without a reaction rate.'),
    correctOptionId: 'a', explanation: 'Because Delta G degree = -RT ln K and ln(0.010) is negative, the standard free-energy change is positive.',
    hints: ['R and T are positive; determine the sign of ln K.'], misconceptionIds: ['thermodynamics-equilibrium-delta-g-standard-zero'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-014', skillId: 'free-energy-dissolution', learningObjectiveId: '9.6.A', sciencePracticeIds: ['4.D'],
    prompt: 'A dissolution has Delta H degree = +15.0 kJ/mol and Delta S degree = +60.0 J mol^-1 K^-1. What is Delta G degree at 300 K?',
    options: options('-3.0 kJ/mol', '+3.0 kJ/mol', '+15.0 kJ/mol', '-18.0 kJ/mol'),
    correctOptionId: 'a', explanation: 'Convert entropy to 0.0600 kJ mol^-1 K^-1. Then Delta G degree = 15.0 - 300(0.0600) = -3.0 kJ/mol.',
    hints: ['An endothermic process can be favorable when the positive entropy term is large enough.'], misconceptionIds: ['thermodynamics-dissolution-enthalpy-alone'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-015', skillId: 'introduction-entropy', learningObjectiveId: '9.1.A', sciencePracticeIds: ['6.C'],
    prompt: 'At the same temperature and pressure, which sample generally has the greatest molar entropy?',
    options: options('A gas whose particles occupy the full container volume', 'The corresponding liquid with particles close together', 'The corresponding crystalline solid', 'All three phases have the same entropy because their chemical formula is unchanged'),
    correctOptionId: 'a', explanation: 'Gas particles have far more accessible positional arrangements and greater matter dispersal than particles in the liquid or solid phases, so the gas generally has the greatest molar entropy.',
    hints: ['Compare accessible particle arrangements across phases.'], misconceptionIds: ['thermodynamics-entropy-only-disorder'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-016', skillId: 'absolute-entropy-entropy-change', learningObjectiveId: '9.2.A', sciencePracticeIds: ['5.F'],
    prompt: 'For 2 D(g) -> E(g), the standard molar entropies are 175 J mol^-1 K^-1 for D and 240 J mol^-1 K^-1 for E. What is Delta S degree for the reaction as written?',
    options: options('-110 J mol^-1 K^-1', '+110 J mol^-1 K^-1', '-65 J mol^-1 K^-1', '+415 J mol^-1 K^-1'),
    correctOptionId: 'a', explanation: 'Delta S degree = 240 - 2(175) = -110 J mol^-1 K^-1. The coefficients must multiply the molar entropies before products minus reactants is evaluated.',
    hints: ['Apply every stoichiometric coefficient in the entropy sum.'], misconceptionIds: ['thermodynamics-entropy-reactants-minus-products'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-017', skillId: 'gibbs-free-energy-thermodynamic-favorability', learningObjectiveId: '9.3.A', sciencePracticeIds: ['6.E'],
    prompt: 'A process has Delta H degree = +36.0 kJ/mol and Delta S degree = +120 J mol^-1 K^-1. Above what temperature does Delta G degree become negative under the stated approximation?',
    options: options('300 K', '30 K', '3,000 K', '432 K'),
    correctOptionId: 'a', explanation: 'At the threshold, Delta G degree = 0, so T = Delta H degree/Delta S degree = 36.0 kJ mol^-1 / 0.120 kJ mol^-1 K^-1 = 300 K. With both terms positive, temperatures above 300 K make T Delta S larger than Delta H.',
    hints: ['Convert the entropy to kilojoules before dividing.'], misconceptionIds: ['thermodynamics-delta-g-unit-mismatch'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-018', skillId: 'free-energy-equilibrium', learningObjectiveId: '9.5.A', sciencePracticeIds: ['6.D'],
    prompt: 'At a fixed temperature, Delta G degree for a reaction is negative. Which relationship must hold for the equilibrium constant?',
    options: options('K > 1', 'K = 1', '0 < K < 1', 'K = 0'),
    correctOptionId: 'a', explanation: 'Delta G degree = -RT ln K. A negative standard free-energy change requires ln K to be positive, which means K is greater than 1.',
    hints: ['R and T are positive, so track the two minus signs in the relationship.'], misconceptionIds: ['thermodynamics-equilibrium-delta-g-standard-zero'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-019', skillId: 'coupled-reactions', learningObjectiveId: '9.7.A', sciencePracticeIds: ['4.D'],
    prompt: 'An unfavorable reaction has Delta G degree = +25 kJ per reaction event. A second reaction with Delta G degree = -18 kJ can be coupled twice so that the shared intermediate cancels. What is the net Delta G degree?',
    options: options('-11 kJ', '+7 kJ', '-36 kJ', '+43 kJ'),
    correctOptionId: 'a', explanation: 'The favorable reaction is scaled by 2, so its contribution is 2(-18) = -36 kJ. Adding the properly coupled reactions gives +25 - 36 = -11 kJ.',
    hints: ['Scale both the chemical equation and its free-energy change before adding.'], misconceptionIds: ['thermodynamics-coupling-no-cancellation'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-mcq-020', skillId: 'galvanic-electrolytic-cells', learningObjectiveId: '9.8.A', sciencePracticeIds: ['2.F'],
    prompt: 'A galvanic cell uses a cathode half-reaction with E degree red = +0.80 V and an anode half-reaction listed as E degree red = -0.40 V. What is E degree cell?',
    options: options('+1.20 V', '+0.40 V', '-1.20 V', '+0.32 V'),
    correctOptionId: 'a', explanation: 'Using tabulated reduction potentials, E degree cell = E degree cathode - E degree anode = 0.80 - (-0.40) = +1.20 V. The positive result is consistent with spontaneous galvanic operation.',
    hints: ['Subtract the anode reduction potential rather than adding it with the same sign.'], misconceptionIds: ['thermodynamics-anode-always-negative'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-temperature-stimulus-mcq-001', stimulusId: 'thermodynamics-temperature-favorability-stimulus',
    skillId: 'gibbs-free-energy-thermodynamic-favorability', learningObjectiveId: '9.3.A', sciencePracticeIds: ['6.E'],
    prompt: 'What is Delta G degree for the reaction at 200 K?',
    options: options('-14.0 kJ/mol', '+14.0 kJ/mol', '+42.0 kJ/mol', '+70.0 kJ/mol'),
    correctOptionId: 'b',
    explanation: 'Convert Delta S degree to +0.140 kJ mol^-1 K^-1. Then Delta G degree = 42.0 - 200(0.140) = +14.0 kJ/mol.',
    hints: ['Make the entropy energy unit match the enthalpy unit before subtracting T Delta S.'],
    misconceptionIds: ['thermodynamics-delta-g-unit-mismatch'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-temperature-stimulus-mcq-002', stimulusId: 'thermodynamics-temperature-favorability-stimulus',
    skillId: 'gibbs-free-energy-thermodynamic-favorability', learningObjectiveId: '9.3.A', sciencePracticeIds: ['6.E'],
    prompt: 'At what temperature is Delta G degree equal to zero for this reaction?',
    options: options('140 K', '200 K', '300 K', '400 K'),
    correctOptionId: 'c',
    explanation: 'At the boundary, 0 = Delta H degree - T Delta S degree, so T = 42.0 kJ/mol divided by 0.140 kJ mol^-1 K^-1 = 300 K.',
    hints: ['Set Delta G degree to zero and use consistent energy units.'],
    misconceptionIds: ['thermodynamics-delta-g-unit-mismatch'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-temperature-stimulus-mcq-003', stimulusId: 'thermodynamics-temperature-favorability-stimulus',
    skillId: 'thermodynamic-kinetic-control', learningObjectiveId: '9.4.A', sciencePracticeIds: ['6.E'],
    prompt: 'Which conclusion is supported at 400 K?',
    options: options(
      'Delta G degree is negative, so the reaction is thermodynamically favorable under standard-state conditions, but its rate cannot be determined.',
      'Delta G degree is negative, so the reaction must proceed rapidly.',
      'Delta G degree is positive, so the reverse reaction must proceed rapidly.',
      'Delta G degree is zero, so forward and reverse reaction rates are both zero.',
    ),
    correctOptionId: 'a',
    explanation: 'Delta G degree = 42.0 - 400(0.140) = -14.0 kJ/mol. This supports standard-state thermodynamic favorability but supplies no activation barrier or rate information.',
    hints: ['Calculate the sign of Delta G degree, then ask whether the data contain any kinetic information.'],
    misconceptionIds: ['thermodynamics-favorable-means-fast'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-temperature-stimulus-mcq-004', stimulusId: 'thermodynamics-temperature-favorability-stimulus',
    skillId: 'free-energy-equilibrium', learningObjectiveId: '9.5.A', sciencePracticeIds: ['6.D'],
    prompt: 'At 300 K, which statement follows from Delta G degree = -RT ln K?',
    options: options(
      'K is greater than 1 because the products must have equal concentrations.',
      'K is less than 1 because the forward reaction is endothermic.',
      'K cannot be related to Delta G degree without kinetic data.',
      'K equals 1, although this does not require every equilibrium concentration to be equal.',
    ),
    correctOptionId: 'd',
    explanation: 'At 300 K, Delta G degree is zero. Therefore ln K = 0 and K = 1. An equilibrium-constant value of one constrains the activity expression; it does not say all species concentrations are equal.',
    hints: ['Substitute zero for Delta G degree and solve for ln K.'],
    misconceptionIds: ['thermodynamics-equilibrium-delta-g-standard-zero'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-stimulus-mcq-001', stimulusId: 'thermodynamics-galvanic-cell-stimulus',
    skillId: 'galvanic-electrolytic-cells', learningObjectiveId: '9.8.A', sciencePracticeIds: ['2.F'],
    prompt: 'Which electrode is the cathode in the spontaneous cell?',
    options: options('The Q electrode, because Q+ has the more positive reduction potential', 'The M electrode, because M2+ has the more negative reduction potential', 'The M electrode, because oxidation occurs at the cathode', 'Neither electrode until a battery is connected'),
    correctOptionId: 'a', explanation: 'The more positive reduction potential is reduced at the cathode, so Q+ is reduced to Q.',
    hints: ['Compare reduction tendencies.'], misconceptionIds: ['thermodynamics-anode-always-negative'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-stimulus-mcq-002', stimulusId: 'thermodynamics-galvanic-cell-stimulus',
    skillId: 'galvanic-electrolytic-cells', learningObjectiveId: '9.8.A', sciencePracticeIds: ['2.F'],
    prompt: 'What is the standard cell potential?',
    options: options('+0.80 V', '+0.30 V', '-0.80 V', '+1.10 V'), correctOptionId: 'a',
    explanation: 'E degree cell = E degree cathode - E degree anode = 0.55 - (-0.25) = +0.80 V.',
    hints: ['Both table values are reduction potentials.'], misconceptionIds: ['thermodynamics-anode-always-negative'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-stimulus-mcq-003', stimulusId: 'thermodynamics-galvanic-cell-stimulus',
    skillId: 'galvanic-electrolytic-cells', learningObjectiveId: '9.8.A', sciencePracticeIds: ['2.F'],
    prompt: 'Using F = 96485 C/mol e-, what is Delta G degree for the cell reaction?',
    options: options('-154 kJ/mol', '+154 kJ/mol', '-77.2 kJ/mol', '+0.80 kJ/mol'), correctOptionId: 'a',
    explanation: 'Delta G degree = -nFE degree = -(2)(96485)(0.80) J/mol = -154 kJ/mol.',
    hints: ['The balanced reaction transfers two electrons.'], misconceptionIds: ['thermodynamics-anode-always-negative'],
  }),
  multipleChoice({
    id: 'ap-chem-thermodynamics-electrochemistry-stimulus-mcq-004', stimulusId: 'thermodynamics-galvanic-cell-stimulus',
    skillId: 'galvanic-electrolytic-cells', learningObjectiveId: '9.8.A', sciencePracticeIds: ['2.F'],
    prompt: 'As the cell operates spontaneously, which mass change occurs?',
    options: options('The M electrode loses mass and the Q electrode gains mass.', 'Both electrodes gain mass.', 'The Q electrode loses mass and the M electrode gains mass.', 'Neither mass changes because electrons carry no mass.'),
    correctOptionId: 'a', explanation: 'M is oxidized to M2+ at the anode, so its electrode loses atoms. Q+ is reduced and plates as Q at the cathode.',
    hints: ['Write the oxidation and reduction directions.'], misconceptionIds: ['thermodynamics-anode-always-negative'],
  }),
  freeResponse({
    id: 'ap-chem-thermodynamics-electrochemistry-short-frq-001', skillId: 'galvanic-electrolytic-cells', learningObjectiveId: '9.8.A', sciencePracticeIds: ['2.F'],
    responseFormat: 'short-frq', rubricId: 'thermodynamics-electrochemical-short-frq-rubric',
    prompt: 'A standard galvanic cell uses M2+(aq) + 2 e- -> M(s), E degree = -0.25 V, and Q+(aq) + e- -> Q(s), E degree = +0.55 V. (a) Identify the anode, cathode, and electron-flow direction. (b) Write the balanced net reaction. (c) Calculate E degree cell. (d) Calculate Delta G degree using F = 96485 C/mol e-.',
    modelAnswer: '(a) M is oxidized at the anode; Q+ is reduced at the cathode; electrons flow from M to Q. (b) M(s) + 2 Q+(aq) -> M2+(aq) + 2 Q(s). (c) E degree cell = 0.55 - (-0.25) = +0.80 V. (d) Delta G degree = -(2)(96485)(0.80) = -1.54 x 10^5 J/mol = -154 kJ/mol.',
    explanation: 'Reduction potential identifies the cathode, and the balanced reaction supplies n for the free-energy relationship.',
    hints: ['Do not multiply a potential by its electron coefficient.', 'Balance electrons before using n.'],
    misconceptionIds: ['thermodynamics-anode-always-negative'],
    parts: [
      { id: 'part-a', label: 'a', prompt: 'Assign electrodes and electron flow.' },
      { id: 'part-b', label: 'b', prompt: 'Write the balanced net ionic cell reaction.' },
      { id: 'part-c', label: 'c', prompt: 'Calculate the standard cell potential.' },
      { id: 'part-d', label: 'd', prompt: 'Calculate the standard free-energy change.' },
    ],
  }),
  freeResponse({
    id: 'ap-chem-thermodynamics-electrochemistry-long-frq-001', skillId: 'absolute-entropy-entropy-change', learningObjectiveId: '9.2.A', sciencePracticeIds: ['4.D', '5.F', '6.D', '6.E'],
    responseFormat: 'long-frq', rubricId: 'thermodynamics-favorability-long-frq-rubric',
    prompt: 'For A(g) + B(g) -> C(g), S degree values are 190, 210, and 260 J mol^-1 K^-1, and Delta H degree = -50.0 kJ/mol. (a) Calculate Delta S degree. (b) Calculate Delta G degree at 298 K. (c) Find the temperature where Delta G degree = 0, assuming Delta H degree and Delta S degree are constant. (d) Explain why a favorable value need not mean a fast reaction. (e) Predict whether K is greater or less than 1 at 298 K. (f) The reaction is coupled one-to-one to a process with Delta G degree = +12.0 kJ/mol. Determine the net Delta G degree and favorability at 298 K.',
    modelAnswer: '(a) Delta S degree = 260 - (190 + 210) = -140 J mol^-1 K^-1. (b) Convert to -0.140 kJ mol^-1 K^-1: Delta G degree = -50.0 - 298(-0.140) = -8.28 kJ/mol. (c) 0 = Delta H - T Delta S gives T = (-50.0)/(-0.140) = 357 K. (d) A large activation barrier can make a thermodynamically favorable process slow. (e) Negative Delta G degree means ln K is positive, so K > 1. (f) Net Delta G degree = -8.28 + 12.0 = +3.72 kJ/mol, so the one-to-one coupled process is not favorable under standard-state conditions at 298 K.',
    explanation: 'The calculation uses consistent energy units. Thermodynamic direction, kinetic rate, equilibrium magnitude, and coupled-reaction algebra remain distinct claims.',
    hints: ['Use products minus reactants.', 'Convert J to kJ before Delta G.', 'Set Delta G to zero for the boundary temperature.', 'Add the coupled free energies one-to-one.'],
    misconceptionIds: ['thermodynamics-entropy-reactants-minus-products', 'thermodynamics-delta-g-unit-mismatch', 'thermodynamics-favorable-means-fast', 'thermodynamics-equilibrium-delta-g-standard-zero', 'thermodynamics-coupling-no-cancellation'],
    parts: [
      { id: 'part-a', label: 'a', prompt: 'Calculate standard reaction entropy.' },
      { id: 'part-b', label: 'b', prompt: 'Calculate standard free energy at 298 K.' },
      { id: 'part-c', label: 'c', prompt: 'Find the boundary temperature.' },
      { id: 'part-d', label: 'd', prompt: 'Distinguish kinetic rate from thermodynamic favorability.' },
      { id: 'part-e', label: 'e', prompt: 'Relate the free-energy sign to K.' },
      { id: 'part-f', label: 'f', prompt: 'Calculate and interpret the coupled free energy.' },
    ],
  }),
])
