import { TAXONOMY_VERSION } from '../../taxonomy/contentTaxonomy.js'

const source = Object.freeze({ kind: 'ai-generated', name: 'Study AI Helper original AP Chemistry draft', externalId: null, license: null })
const content = Object.freeze({
  status: 'draft', version: 1, revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: '2026-07-24', reviewers: Object.freeze([]),
})
const refs = Object.freeze({
  'endothermic-exothermic-processes': { formulaIds: [], priorKnowledge: ['system-surroundings-and-heat-sign'] },
  'energy-diagrams': { formulaIds: [], priorKnowledge: ['reactant-product-and-transition-state-energy'] },
  'heat-transfer-thermal-equilibrium': { formulaIds: ['thermochemistry-heat-capacity'], priorKnowledge: [] },
  'heat-capacity-calorimetry': { formulaIds: ['thermochemistry-heat-capacity'], priorKnowledge: [] },
  'energy-phase-changes': { formulaIds: [], priorKnowledge: ['phase-change-energy-and-heating-curves'] },
  'introduction-enthalpy-reaction': { formulaIds: ['thermochemistry-formation-enthalpy'], priorKnowledge: ['reaction-extent-and-energy-conservation'] },
  'bond-enthalpies': { formulaIds: ['thermochemistry-bond-enthalpy'], priorKnowledge: [] },
  'enthalpy-formation': { formulaIds: ['thermochemistry-formation-enthalpy'], priorKnowledge: [] },
  'hess-law': { formulaIds: ['thermochemistry-formation-enthalpy'], priorKnowledge: ['thermochemical-equation-algebra'] },
})
function referenceRequirements(skillId) {
  const value = refs[skillId]
  if (!value) throw new Error(`Missing Unit 6 reference requirements for ${skillId}`)
  return value
}
function taxonomy(skillId, learningObjectiveId, sciencePracticeIds, questionTypeId = 'multiple-choice') {
  return {
    version: TAXONOMY_VERSION, examId: 'ap', subjectId: 'ap-chemistry', domainId: 'thermochemistry',
    skillId, learningObjectiveIds: [learningObjectiveId], sciencePracticeIds, questionTypeId,
    answeringMethodId: questionTypeId === 'free-response' ? 'write-response' : 'select-option',
  }
}
function multipleChoice({ id, skillId, learningObjectiveId, sciencePracticeIds, prompt, options, correctOptionId, explanation, hints, misconceptionIds, difficulty = 'developing', stimulusId }) {
  return {
    id, taxonomy: taxonomy(skillId, learningObjectiveId, sciencePracticeIds), renderer: 'multiple-choice', prompt,
    answer: { kind: 'selected-response', options, correctOptionId }, explanation, hints, misconceptionIds,
    referenceRequirements: referenceRequirements(skillId), difficulty, ...(stimulusId ? { stimulusId } : {}),
    source: { ...source }, content: { ...content }, tags: ['ap-chemistry', 'thermochemistry'],
  }
}
function freeResponse({ id, skillId, learningObjectiveId, sciencePracticeIds, prompt, modelAnswer, explanation, hints, misconceptionIds, responseFormat, rubricId, parts }) {
  return {
    id, taxonomy: taxonomy(skillId, learningObjectiveId, sciencePracticeIds, 'free-response'), renderer: 'free-response', prompt,
    answer: { kind: 'free-response', grading: 'manual', modelAnswer }, explanation, hints, misconceptionIds,
    referenceRequirements: referenceRequirements(skillId), difficulty: 'exam-ready', responseFormat, rubricId, parts,
    source: { ...source }, content: { ...content }, tags: ['ap-chemistry', 'thermochemistry', responseFormat],
  }
}
const options = (...texts) => texts.map((text, index) => ({ id: String.fromCharCode(97 + index), text }))

export const apChemistryThermochemistryQuestions = Object.freeze([
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-001', skillId: 'endothermic-exothermic-processes', learningObjectiveId: '6.1.A', sciencePracticeIds: ['6.D'],
    prompt: 'A sealed reaction vessel becomes warmer than the surrounding water while the reaction occurs. Which statement best describes the reaction system?',
    options: options('It is exothermic because energy leaves the reaction system.', 'It is endothermic because the water gains energy.', 'It has q = 0 because the vessel is sealed.', 'Its enthalpy sign is determined only by activation energy.'),
    correctOptionId: 'a', explanation: 'The reaction system transfers energy to the vessel and water, so q for the reaction is negative and the process is exothermic.',
    hints: ['Define the reacting chemicals as the system.'], misconceptionIds: ['thermochemistry-exothermic-system-gains-heat'], difficulty: 'introductory',
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-002', skillId: 'energy-diagrams', learningObjectiveId: '6.2.A', sciencePracticeIds: ['3.A'],
    prompt: 'An energy diagram places reactants at 80 kJ/mol, products at 125 kJ/mol, and the transition state at 170 kJ/mol. Which statement is correct?',
    options: options('Delta H = +45 kJ/mol and the forward activation energy is 90 kJ/mol.', 'Delta H = -45 kJ/mol and the forward activation energy is 45 kJ/mol.', 'Delta H = +90 kJ/mol and the forward activation energy is 45 kJ/mol.', 'Delta H = -90 kJ/mol and the forward activation energy is 170 kJ/mol.'),
    correctOptionId: 'a', explanation: 'Delta H = 125 - 80 = +45 kJ/mol, and Ea,forward = 170 - 80 = 90 kJ/mol.',
    hints: ['Use endpoints for Delta H and reactants-to-peak for forward Ea.'], misconceptionIds: ['thermochemistry-diagram-sign-from-peak'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-003', skillId: 'heat-transfer-thermal-equilibrium', learningObjectiveId: '6.3.A', sciencePracticeIds: ['6.E'],
    prompt: 'Equal masses of liquids X and Y exchange heat only with each other. X has twice the specific heat of Y. Which relationship holds before they reach the same final temperature?',
    options: options('The magnitudes of heat transfer are equal, and X has half the temperature-change magnitude of Y.', 'X transfers twice as much heat as Y.', 'X and Y must have equal temperature changes.', 'Y has half the temperature-change magnitude of X.'),
    correctOptionId: 'a', explanation: 'Energy conservation gives equal and opposite q. Since |Delta T| = |q|/(mc), doubling c halves the temperature-change magnitude.',
    hints: ['Apply both energy conservation and q = mc Delta T.'], misconceptionIds: ['thermochemistry-temperature-equals-heat'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-004', skillId: 'energy-phase-changes', learningObjectiveId: '6.5.A', sciencePracticeIds: ['1.B'],
    prompt: 'A pure solid melts at constant pressure while energy is supplied. Why does its temperature remain approximately constant during melting?',
    options: options('The supplied energy changes intermolecular organization rather than average kinetic energy.', 'The particles stop moving until all solid disappears.', 'The sample releases exactly as much heat as it absorbs.', 'The specific heat becomes zero.'),
    correctOptionId: 'a', explanation: 'During the phase transition, energy increases potential energy by disrupting intermolecular attractions rather than raising average kinetic energy.',
    hints: ['Separate particle kinetic energy from interaction potential energy.'], misconceptionIds: ['thermochemistry-phase-change-temperature-rise'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-005', skillId: 'bond-enthalpies', learningObjectiveId: '6.7.A', sciencePracticeIds: ['5.F'],
    prompt: 'One A-A bond (160 kJ/mol) and one B-B bond (240 kJ/mol) break while two A-B bonds (230 kJ/mol each) form. What is the estimated reaction enthalpy?',
    options: options('-60 kJ/mol', '+60 kJ/mol', '-460 kJ/mol', '+860 kJ/mol'),
    correctOptionId: 'a', explanation: 'Delta H is approximately (160 + 240) - 2(230) = -60 kJ/mol.',
    hints: ['Use bonds broken minus bonds formed.'], misconceptionIds: ['thermochemistry-bond-enthalpy-signs'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-006', skillId: 'enthalpy-formation', learningObjectiveId: '6.8.A', sciencePracticeIds: ['5.F'],
    prompt: 'For R(g) + 2 S(g) -> T(g), the standard formation enthalpies are -40, 0, and -190 kJ/mol respectively. What is Delta H for the reaction as written?',
    options: options('-150 kJ', '+150 kJ', '-230 kJ', '-190 kJ'),
    correctOptionId: 'a', explanation: 'Delta H = -190 - [-40 + 2(0)] = -150 kJ.',
    hints: ['Subtract the coefficient-weighted reactant sum from the product sum.'], misconceptionIds: ['thermochemistry-elements-nonzero-formation'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-007', skillId: 'endothermic-exothermic-processes', learningObjectiveId: '6.1.A', sciencePracticeIds: ['6.D'],
    prompt: 'A flexible cold pack becomes colder after two internal substances mix. Treating the reacting substances as the system, which statement is correct?',
    options: options('The process is endothermic because the system absorbs energy from the pack and nearby surroundings.', 'The process is exothermic because the pack loses thermal energy.', 'The process has q = 0 because the substances remain inside the pack.', 'The enthalpy sign cannot be related to the observed temperature change.'),
    correctOptionId: 'a', explanation: 'The surrounding pack cools as energy enters the reacting system, so the system has positive heat flow and the process is endothermic.',
    hints: ['Name the reacting substances as the system, then follow energy across that boundary.'], misconceptionIds: ['thermochemistry-exothermic-system-gains-heat'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-008', skillId: 'energy-diagrams', learningObjectiveId: '6.2.A', sciencePracticeIds: ['3.A'],
    prompt: 'An energy profile places reactants at 60 kJ/mol, products at 20 kJ/mol, and the transition state at 140 kJ/mol. Which values are correct?',
    options: options('Delta H = -40 kJ/mol, forward Ea = 80 kJ/mol, and reverse Ea = 120 kJ/mol', 'Delta H = +40 kJ/mol, forward Ea = 120 kJ/mol, and reverse Ea = 80 kJ/mol', 'Delta H = -120 kJ/mol and forward Ea = 40 kJ/mol', 'Delta H = +80 kJ/mol and reverse Ea = 140 kJ/mol'),
    correctOptionId: 'a', explanation: 'Products minus reactants gives 20 - 60 = -40 kJ/mol. The forward and reverse barriers are 140 - 60 = 80 and 140 - 20 = 120 kJ/mol.',
    hints: ['Use endpoints for Delta H and measure each activation barrier from its own starting side.'], misconceptionIds: ['thermochemistry-diagram-sign-from-peak'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-009', skillId: 'heat-transfer-thermal-equilibrium', learningObjectiveId: '6.3.A', sciencePracticeIds: ['6.E'],
    prompt: 'An insulated container holds 100 g of liquid X at 80 degrees C and 200 g of liquid Y at 20 degrees C. The specific heats are 2.0 J/(g K) for X and 1.0 J/(g K) for Y. What equilibrium temperature is predicted?',
    options: options('50 degrees C', '40 degrees C', '60 degrees C', '20 degrees C'),
    correctOptionId: 'a', explanation: 'Energy conservation gives (100)(2.0)(80 - Tf) = (200)(1.0)(Tf - 20). The heat-capacity products are equal, so Tf is halfway between the initial temperatures: 50 degrees C.',
    hints: ['Set the magnitude lost by X equal to the magnitude gained by Y.'], misconceptionIds: ['thermochemistry-temperature-equals-heat'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-010', skillId: 'energy-phase-changes', learningObjectiveId: '6.5.A', sciencePracticeIds: ['1.B'],
    prompt: 'During the constant-temperature boiling plateau of a pure liquid at constant pressure, what happens to the supplied energy?',
    options: options('It increases intermolecular potential energy as particles separate into the gas phase.', 'It raises average kinetic energy while particle spacing stays fixed.', 'It is destroyed because temperature does not change.', 'It converts the substance into a different chemical compound.'),
    correctOptionId: 'a', explanation: 'At the phase plateau, average kinetic energy and temperature remain approximately constant while energy changes particle organization and intermolecular potential energy.',
    hints: ['Temperature follows average kinetic energy; phase change also involves interaction energy.'], misconceptionIds: ['thermochemistry-phase-change-temperature-rise'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-011', skillId: 'bond-enthalpies', learningObjectiveId: '6.7.A', sciencePracticeIds: ['5.F'],
    prompt: 'A reaction breaks two X-H bonds of 400 kJ/mol each and forms one H-H bond of 436 kJ/mol plus one X-X bond of 250 kJ/mol. What is the bond-enthalpy estimate of Delta H?',
    options: options('+114 kJ/mol', '-114 kJ/mol', '+686 kJ/mol', '-800 kJ/mol'),
    correctOptionId: 'a', explanation: 'The estimate is energy to break bonds minus energy released forming bonds: 2(400) - (436 + 250) = +114 kJ/mol.',
    hints: ['Add broken-bond energies, add formed-bond energies, then subtract formed from broken.'], misconceptionIds: ['thermochemistry-bond-enthalpy-signs'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-012', skillId: 'enthalpy-formation', learningObjectiveId: '6.8.A', sciencePracticeIds: ['5.F'],
    prompt: 'For P(g) + Q(s) -> R(g), Delta Hf values are -50 kJ/mol for P, 0 for Q in its standard elemental state, and -180 kJ/mol for R. What is Delta H for the reaction?',
    options: options('-130 kJ', '+130 kJ', '-230 kJ', '-180 kJ'),
    correctOptionId: 'a', explanation: 'Products minus reactants gives -180 - [-50 + 0] = -130 kJ. The standard-state element Q has formation enthalpy zero.',
    hints: ['Apply products minus reactants and retain the defined zero for the standard-state element.'], misconceptionIds: ['thermochemistry-elements-nonzero-formation'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-013', skillId: 'heat-capacity-calorimetry', learningObjectiveId: '6.4.A', sciencePracticeIds: ['2.D', '5.F'],
    prompt: 'A 75.0 g aqueous solution with specific heat 4.18 J/(g K) warms by 5.20 K. Assuming no heat is lost, what heat does the solution absorb?',
    options: options('+1.63 kJ', '-1.63 kJ', '+0.326 kJ', '+16.3 kJ'),
    correctOptionId: 'a', explanation: 'qsolution = mc Delta T = (75.0 g)(4.18 J/(g K))(5.20 K) = 1.63 x 10^3 J = +1.63 kJ. The positive sign denotes energy absorbed by the solution.',
    hints: ['Keep joules through the multiplication, then convert to kilojoules.'], misconceptionIds: ['thermochemistry-calorimeter-same-sign'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-014', skillId: 'endothermic-exothermic-processes', learningObjectiveId: '6.1.A', sciencePracticeIds: ['6.D'],
    prompt: 'A reaction transfers 8.0 kJ of energy to its surroundings at constant pressure. Which pair of signs is consistent with this transfer?',
    options: options('qreaction is negative and qsurroundings is positive.', 'qreaction is positive and qsurroundings is negative.', 'Both heat quantities are positive.', 'Both heat quantities are negative.'),
    correctOptionId: 'a', explanation: 'Energy leaves the reaction system, so qreaction = -8.0 kJ. The surroundings receive that energy, so qsurroundings = +8.0 kJ.',
    hints: ['Use one sign convention after naming the reaction as the system.'], misconceptionIds: ['thermochemistry-exothermic-system-gains-heat'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-015', skillId: 'energy-phase-changes', learningObjectiveId: '6.5.A', sciencePracticeIds: ['1.B'],
    prompt: 'While a pure liquid boils at constant pressure, which particle-level change occurs as energy continues to enter the sample?',
    options: options('Average kinetic energy stays approximately constant while intermolecular potential energy increases.', 'Average kinetic energy increases while intermolecular potential energy stays constant.', 'Both average kinetic and intermolecular potential energy decrease.', 'Chemical bonds within each molecule break to create the gas phase.'),
    correctOptionId: 'a', explanation: 'The constant-temperature plateau means average kinetic energy remains approximately constant. Energy is used to separate particles against intermolecular attractions, increasing potential energy.',
    hints: ['Relate temperature to average kinetic energy, then account for the added energy.'], misconceptionIds: ['thermochemistry-phase-change-temperature-rise'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-016', skillId: 'introduction-enthalpy-reaction', learningObjectiveId: '6.6.A', sciencePracticeIds: ['5.F'],
    prompt: 'A thermochemical equation reports Delta H = -92 kJ when 2.0 mol of product forms. What is Delta H when the same reaction forms 0.50 mol of product?',
    options: options('-23 kJ', '-46 kJ', '-92 kJ', '+23 kJ'),
    correctOptionId: 'a', explanation: 'Reaction enthalpy scales with reaction extent. Forming 0.50 mol is one fourth of 2.0 mol, so Delta H = (-92 kJ)(0.50/2.0) = -23 kJ.',
    hints: ['Scale the energy by the same factor as the balanced reaction amount.'], misconceptionIds: ['thermochemistry-enthalpy-not-extensive'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-017', skillId: 'bond-enthalpies', learningObjectiveId: '6.7.A', sciencePracticeIds: ['5.F'],
    prompt: 'Using bond enthalpies H-H = 436 kJ/mol, Cl-Cl = 243 kJ/mol, and H-Cl = 431 kJ/mol, estimate Delta H for H2(g) + Cl2(g) -> 2 HCl(g).',
    options: options('-183 kJ/mol', '+183 kJ/mol', '-674 kJ/mol', '+1,541 kJ/mol'),
    correctOptionId: 'a', explanation: 'Breaking H-H and Cl-Cl requires 436 + 243 = 679 kJ/mol. Forming two H-Cl bonds releases 2(431) = 862 kJ/mol, so Delta H is approximately 679 - 862 = -183 kJ/mol.',
    hints: ['Sum broken bonds, subtract the sum for formed bonds, and retain coefficients.'], misconceptionIds: ['thermochemistry-bond-enthalpy-signs'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-mcq-018', skillId: 'hess-law', learningObjectiveId: '6.9.A', sciencePracticeIds: ['5.A'],
    prompt: 'An equation with Delta H = +35 kJ is reversed and then multiplied by 3. What is Delta H for the resulting equation?',
    options: options('-105 kJ', '+105 kJ', '-35 kJ', '+11.7 kJ'),
    correctOptionId: 'a', explanation: 'Reversing the equation changes the sign to -35 kJ. Multiplying every coefficient by 3 also multiplies the enthalpy, giving -105 kJ.',
    hints: ['Apply each equation operation to Delta H in the same order.'], misconceptionIds: ['thermochemistry-hess-no-scaling'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-stimulus-mcq-001', stimulusId: 'thermochemistry-calorimetry-stimulus',
    skillId: 'heat-capacity-calorimetry', learningObjectiveId: '6.4.A', sciencePracticeIds: ['2.D'],
    prompt: 'Based on the electrical calibration, what is the heat capacity of the calorimeter?',
    options: options('0.600 kJ/K', '1.67 kJ/K', '2.40 kJ/K', '9.60 kJ/K'), correctOptionId: 'a',
    explanation: 'Ccal = q/Delta T = 2.40 kJ/(25.0 - 21.0 K) = 0.600 kJ/K.',
    hints: ['Divide supplied energy by the calibration temperature change.'], misconceptionIds: ['thermochemistry-calorimeter-same-sign'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-stimulus-mcq-002', stimulusId: 'thermochemistry-calorimetry-stimulus',
    skillId: 'heat-capacity-calorimetry', learningObjectiveId: '6.4.A', sciencePracticeIds: ['2.D'],
    prompt: 'How much heat does the calorimeter absorb during the chemical-reaction trial?',
    options: options('+3.00 kJ', '-3.00 kJ', '+0.120 kJ', '+12.0 kJ'), correctOptionId: 'a',
    explanation: 'qcal = (0.600 kJ/K)(27.0 - 22.0 K) = +3.00 kJ.',
    hints: ['Use the calibrated whole-calorimeter heat capacity.'], misconceptionIds: ['thermochemistry-calorimeter-same-sign'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-stimulus-mcq-003', stimulusId: 'thermochemistry-calorimetry-stimulus',
    skillId: 'introduction-enthalpy-reaction', learningObjectiveId: '6.6.A', sciencePracticeIds: ['5.F'],
    prompt: 'What is the molar enthalpy change for the reaction trial?',
    options: options('-150 kJ/mol', '+150 kJ/mol', '-60.0 kJ/mol', '+3.00 kJ/mol'), correctOptionId: 'a',
    explanation: 'The reaction releases 3.00 kJ when 0.0200 mol reacts, so Delta H = -3.00/0.0200 = -150 kJ/mol.',
    hints: ['Reaction heat has the opposite sign from calorimeter heat.'], misconceptionIds: ['thermochemistry-calorimeter-same-sign'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-stimulus-mcq-004', stimulusId: 'thermochemistry-calorimetry-stimulus',
    skillId: 'endothermic-exothermic-processes', learningObjectiveId: '6.1.A', sciencePracticeIds: ['6.D'],
    prompt: 'Which observation directly supports classifying the chemical reaction as exothermic?',
    options: options('The calorimeter temperature rises, showing that the surroundings absorb energy from the reaction.', 'The reacting amount is less than one mole.', 'The calibration uses electrical energy.', 'The initial reaction temperature differs from the calibration temperature.'),
    correctOptionId: 'a', explanation: 'The calorimeter is part of the surroundings. Its temperature rise shows it absorbs energy released by the reaction system.',
    hints: ['Connect the measured temperature change with the direction of heat flow.'], misconceptionIds: ['thermochemistry-exothermic-system-gains-heat'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-heating-stimulus-mcq-001', stimulusId: 'thermochemistry-heating-curve-stimulus',
    skillId: 'heat-capacity-calorimetry', learningObjectiveId: '6.4.A', sciencePracticeIds: ['2.D', '5.F'],
    prompt: 'What is the specific heat capacity of the solid before melting begins?',
    options: options('2.00 J/(g K)', '0.500 J/(g K)', '5.00 J/(g K)', '50.0 J/(g K)'), correctOptionId: 'a',
    explanation: 'Before melting, q = 2.50 kJ = 2500 J, m = 50.0 g, and Delta T = 45.0 - 20.0 = 25.0 K. Thus c = q/(m Delta T) = 2500/[50.0(25.0)] = 2.00 J/(g K).',
    hints: ['Use only the single-phase warming interval and convert kilojoules to joules.'], misconceptionIds: ['thermochemistry-temperature-equals-heat'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-heating-stimulus-mcq-002', stimulusId: 'thermochemistry-heating-curve-stimulus',
    skillId: 'energy-phase-changes', learningObjectiveId: '6.5.A', sciencePracticeIds: ['1.B'],
    prompt: 'Why does the temperature remain at 45.0 degrees C while energy supplied increases from 2.50 to 5.00 kJ?',
    options: options('The energy increases intermolecular potential energy as the solid becomes liquid.', 'The sample releases exactly as much energy as it absorbs.', 'The particles stop moving, so their kinetic energy becomes zero.', 'The supplied energy breaks the covalent bonds within each molecule.'), correctOptionId: 'a',
    explanation: 'During melting, the added energy changes particle organization and increases intermolecular potential energy. Average kinetic energy and therefore temperature remain approximately constant until the phase change is complete.',
    hints: ['Separate average kinetic energy from interaction potential energy.'], misconceptionIds: ['thermochemistry-phase-change-temperature-rise'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-heating-stimulus-mcq-003', stimulusId: 'thermochemistry-heating-curve-stimulus',
    skillId: 'energy-phase-changes', learningObjectiveId: '6.5.A', sciencePracticeIds: ['5.F'],
    prompt: 'What energy per gram is absorbed during melting?',
    options: options('50.0 J/g', '25.0 J/g', '100 J/g', '2.00 J/g'), correctOptionId: 'a',
    explanation: 'The melting interval absorbs 5.00 - 2.50 = 2.50 kJ = 2500 J. Dividing by 50.0 g gives 50.0 J/g.',
    hints: ['Use the energy difference across the plateau, not the cumulative endpoint alone.'], misconceptionIds: ['thermochemistry-phase-change-temperature-rise'],
  }),
  multipleChoice({
    id: 'ap-chem-thermochemistry-heating-stimulus-mcq-004', stimulusId: 'thermochemistry-heating-curve-stimulus',
    skillId: 'heat-capacity-calorimetry', learningObjectiveId: '6.4.A', sciencePracticeIds: ['2.D', '5.F'],
    prompt: 'Using the same phase-change energy per gram, how much energy is required to melt 125 g of the substance already at 45.0 degrees C?',
    options: options('6.25 kJ', '2.50 kJ', '4.00 kJ', '12.5 kJ'), correctOptionId: 'a',
    explanation: 'The phase-change energy is 50.0 J/g. For 125 g, q = (125 g)(50.0 J/g) = 6250 J = 6.25 kJ.',
    hints: ['The sample begins at the melting temperature, so include only the phase-change interval.'], misconceptionIds: ['thermochemistry-temperature-equals-heat'],
  }),
  freeResponse({
    id: 'ap-chem-thermochemistry-short-frq-001', skillId: 'heat-capacity-calorimetry', learningObjectiveId: '6.4.A', sciencePracticeIds: ['2.D', '5.F'],
    responseFormat: 'short-frq', rubricId: 'thermochemistry-calorimetry-short-frq-rubric',
    prompt: 'A calorimeter is calibrated by supplying 2.40 kJ, which raises its temperature from 21.0 to 25.0 degrees C. In a separate trial, 0.0200 mol of a reaction raises the same calorimeter from 22.0 to 27.0 degrees C. Assume negligible external heat exchange. (a) Determine the calorimeter heat capacity. (b) Determine qcal in the reaction trial. (c) Calculate the molar reaction enthalpy. (d) Explain its sign.',
    modelAnswer: 'Ccal = 2.40 kJ/4.0 K = 0.600 kJ/K. In the reaction trial qcal = (0.600)(5.0) = +3.00 kJ, so qreaction = -3.00 kJ. Dividing by 0.0200 mol gives Delta H = -150 kJ/mol. The negative sign is consistent with the calorimeter warming because the reaction releases heat.',
    explanation: 'Calibration converts temperature change into an apparatus heat capacity. Conservation then makes the reaction and calorimeter heats equal in magnitude and opposite in sign.',
    hints: ['Calibrate first.', 'Write qreaction = -qcal before dividing by moles.'],
    misconceptionIds: ['thermochemistry-calorimeter-same-sign', 'thermochemistry-exothermic-system-gains-heat'],
    parts: [
      { id: 'part-a', label: 'a', prompt: 'Determine the calorimeter heat capacity.' },
      { id: 'part-b', label: 'b', prompt: 'Determine the heat absorbed by the calorimeter in the reaction trial.' },
      { id: 'part-c', label: 'c', prompt: 'Calculate the molar enthalpy change of the reaction.' },
      { id: 'part-d', label: 'd', prompt: 'Explain the sign of the molar enthalpy.' },
    ],
  }),
  freeResponse({
    id: 'ap-chem-thermochemistry-long-frq-001', skillId: 'hess-law', learningObjectiveId: '6.9.A', sciencePracticeIds: ['5.A', '5.F'],
    responseFormat: 'long-frq', rubricId: 'thermochemistry-pathways-long-frq-rubric',
    prompt: 'Consider X(s) + Y(s) -> XY(s). Standard formation enthalpies for X(s), Y(s), and XY(s) are 0, 0, and -66 kJ/mol. A second route supplies: X + O2 -> XO2, Delta H = -100 kJ; Y + 1/2 O2 -> YO, Delta H = -120 kJ; XY + 3/2 O2 -> XO2 + YO, Delta H = -154 kJ. (a) Calculate Delta H from formation values, showing setup. (b) Use the three equations to obtain the target and its Delta H. (c) An average-bond estimate gives -58 kJ; explain the difference. (d) Find the enthalpy change when 0.250 mol XY forms. (e) Explain why valid routes share one Delta H.',
    modelAnswer: '(a) Delta H = -66 - [0 + 0] = -66 kJ. (b) Add the first two equations to the reverse of the third; XO2, YO, and O2 cancel, and Delta H = -100 - 120 + 154 = -66 kJ. (c) Average bond enthalpies are approximate gas-phase averages and need not reproduce phase-specific formation data exactly. (d) q = (0.250 mol)(-66 kJ/mol) = -16.5 kJ. (e) Enthalpy is a state function, so it depends on endpoints rather than path.',
    explanation: 'Both formation data and Hess algebra describe the same initial and final states. Bond enthalpies provide an estimate, while scaling follows the reaction extent.',
    hints: ['Reverse the third equation.', 'Apply every equation operation to Delta H.', 'Scale -66 kJ/mol by 0.250 mol.'],
    misconceptionIds: ['thermochemistry-hess-no-scaling', 'thermochemistry-bond-enthalpy-signs', 'thermochemistry-enthalpy-not-extensive'],
    parts: [
      { id: 'part-a', label: 'a', prompt: 'Calculate Delta H from standard formation values and show the products-minus-reactants setup.' },
      { id: 'part-b', label: 'b', prompt: 'Combine the three supplied thermochemical equations to obtain the target and its Delta H.' },
      { id: 'part-c', label: 'c', prompt: 'Explain why the average-bond estimate may differ from the formation-value result.' },
      { id: 'part-d', label: 'd', prompt: 'Calculate the enthalpy change when 0.250 mol of XY forms.' },
      { id: 'part-e', label: 'e', prompt: 'Explain why every valid route between the same states gives one Delta H.' },
    ],
  }),
])
