import { TAXONOMY_VERSION } from '../../taxonomy/contentTaxonomy.js'

const source = Object.freeze({ kind: 'ai-generated', name: 'Study AI Helper original AP Chemistry draft', externalId: null, license: null })
const content = Object.freeze({
  status: 'draft', version: 1, revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: '2026-07-24', reviewers: Object.freeze([]),
})
const refs = Object.freeze({
  'moles-molar-mass': { formulaIds: ['atomic-structure-amount-mass-particles'], priorKnowledge: [] },
  'mass-spectra-elements': { formulaIds: ['atomic-structure-weighted-isotope-mass'], priorKnowledge: [] },
  'elemental-composition-pure-substances': { formulaIds: ['atomic-structure-composition'], priorKnowledge: [] },
  'composition-mixtures': { formulaIds: ['atomic-structure-composition'], priorKnowledge: [] },
  'atomic-structure-electron-configuration': { formulaIds: ['atomic-structure-electron-charge-balance'], priorKnowledge: ['orbital-filling-order-pauli-and-hund'] },
  'photoelectron-spectroscopy': { formulaIds: [], priorKnowledge: ['subshell-electron-count-and-binding-energy'] },
  'periodic-trends': { formulaIds: [], priorKnowledge: ['effective-nuclear-charge-shielding-and-shell-distance'] },
  'valence-electrons-ionic-compounds': { formulaIds: ['atomic-structure-electron-charge-balance'], priorKnowledge: ['valence-electron-count-and-charge-neutrality'] },
})
function referenceRequirements(skillId) {
  const value = refs[skillId]
  if (!value) throw new Error(`Missing Unit 1 reference requirements for ${skillId}`)
  return value
}
function taxonomy(skillId, learningObjectiveId, sciencePracticeIds, questionTypeId = 'multiple-choice') {
  return {
    version: TAXONOMY_VERSION, examId: 'ap', subjectId: 'ap-chemistry', domainId: 'atomic-structure-properties',
    skillId, learningObjectiveIds: [learningObjectiveId], sciencePracticeIds, questionTypeId,
    answeringMethodId: questionTypeId === 'free-response' ? 'write-response' : 'select-option',
  }
}
function multipleChoice({ id, skillId, learningObjectiveId, sciencePracticeIds, prompt, options, correctOptionId, explanation, hints, misconceptionIds, difficulty = 'developing', stimulusId }) {
  return {
    id, taxonomy: taxonomy(skillId, learningObjectiveId, sciencePracticeIds), renderer: 'multiple-choice', prompt,
    answer: { kind: 'selected-response', options, correctOptionId }, explanation, hints, misconceptionIds,
    referenceRequirements: referenceRequirements(skillId), difficulty, ...(stimulusId ? { stimulusId } : {}),
    source: { ...source }, content: { ...content }, tags: ['ap-chemistry', 'atomic-structure-properties'],
  }
}
function freeResponse({ id, skillId, learningObjectiveId, sciencePracticeIds, prompt, modelAnswer, explanation, hints, misconceptionIds, responseFormat, rubricId, parts }) {
  return {
    id, taxonomy: taxonomy(skillId, learningObjectiveId, sciencePracticeIds, 'free-response'), renderer: 'free-response', prompt,
    answer: { kind: 'free-response', grading: 'manual', modelAnswer }, explanation, hints, misconceptionIds,
    referenceRequirements: referenceRequirements(skillId), difficulty: 'exam-ready', responseFormat, rubricId, parts,
    source: { ...source }, content: { ...content }, tags: ['ap-chemistry', 'atomic-structure-properties', responseFormat],
  }
}
const options = (...texts) => texts.map((text, index) => ({ id: String.fromCharCode(97 + index), text }))

export const apChemistryAtomicStructurePropertiesQuestions = Object.freeze([
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-001', skillId: 'moles-molar-mass', learningObjectiveId: '1.1.A', sciencePracticeIds: ['5.B'],
    prompt: 'How many molecules are present in 9.00 g of a molecular substance with molar mass 45.0 g/mol?',
    options: options('1.20 x 10^23', '3.01 x 10^22', '2.71 x 10^24', '4.50 x 10^24'), correctOptionId: 'a',
    explanation: 'The sample is 9.00/45.0 = 0.200 mol, which contains (0.200)(6.022 x 10^23) = 1.20 x 10^23 molecules.',
    hints: ['Convert grams to moles before using Avogadro constant.'], misconceptionIds: ['atomic-structure-molar-mass-particles'], difficulty: 'introductory',
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-002', skillId: 'mass-spectra-elements', learningObjectiveId: '1.2.A', sciencePracticeIds: ['5.D'],
    prompt: 'An element is 75.0% isotope-24 and 25.0% isotope-26. What is its average atomic mass?',
    options: options('24.5 u', '25.0 u', '24.0 u', '50.0 u'), correctOptionId: 'a',
    explanation: 'The weighted average is 24(0.750) + 26(0.250) = 24.5 u.',
    hints: ['Use fractional abundances.'], misconceptionIds: ['atomic-structure-mass-spectrum-peak-height-mass'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-003', skillId: 'elemental-composition-pure-substances', learningObjectiveId: '1.3.A', sciencePracticeIds: ['2.A'],
    prompt: 'A compound contains 4.00 g X (40.0 g/mol) and 6.00 g Y (20.0 g/mol). What is its empirical formula?',
    options: options('XY3', 'X2Y3', 'X3Y', 'X2Y'), correctOptionId: 'a',
    explanation: 'The amounts are 0.100 mol X and 0.300 mol Y, giving the simplest ratio 1:3.',
    hints: ['Subscripts come from mole ratios, not gram ratios.'], misconceptionIds: ['atomic-structure-empirical-mass-ratio'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-004', skillId: 'composition-mixtures', learningObjectiveId: '1.4.A', sciencePracticeIds: ['5.A'],
    prompt: 'A 20.0 g mixture contains 30.0% by mass material P, which is 50.0% element X by mass. The remaining material is 10.0% X by mass. What mass of X is in the mixture?',
    options: options('4.40 g', '6.00 g', '2.00 g', '8.00 g'), correctOptionId: 'a',
    explanation: 'P contributes (6.00 g)(0.500) = 3.00 g X. The remaining 14.0 g contributes 1.40 g X, for 4.40 g total.',
    hints: ['Find each component mass, then each X contribution.'], misconceptionIds: ['atomic-structure-mixture-percent-unweighted'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-005', skillId: 'atomic-structure-electron-configuration', learningObjectiveId: '1.5.A', sciencePracticeIds: ['1.A'],
    prompt: 'Which ground-state electron configuration represents an atom with 17 electrons?',
    options: options('1s2 2s2 2p6 3s2 3p5', '1s2 2s2 2p6 3s2 3p6', '1s2 2s2 2p5 3s2 3p6', '1s2 2s2 2p6 3s1 3p6'),
    correctOptionId: 'a', explanation: 'The configuration follows orbital energy order and contains 2 + 2 + 6 + 2 + 5 = 17 electrons.',
    hints: ['Count electrons and check the filling order.'], misconceptionIds: ['atomic-structure-electrons-fill-by-shell-only'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-006', skillId: 'photoelectron-spectroscopy', learningObjectiveId: '1.6.A', sciencePracticeIds: ['4.B'],
    prompt: 'In a photoelectron spectrum, one valence-subshell peak has approximately five times the area of another valence-subshell peak. What does the area ratio most directly indicate?',
    options: options('The first subshell contains approximately five times as many electrons.', 'The first electrons have five times the binding energy.', 'The first subshell is five principal shells closer to the nucleus.', 'The atom has five isotopes.'),
    correctOptionId: 'a', explanation: 'Relative PES peak area or intensity tracks the number of electrons represented, while horizontal position tracks binding energy.',
    hints: ['Interpret the vertical and horizontal information separately.'], misconceptionIds: ['atomic-structure-pes-intensity-binding'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-007', skillId: 'periodic-trends', learningObjectiveId: '1.7.A', sciencePracticeIds: ['4.A'],
    prompt: 'Why does atomic radius generally decrease from left to right across a period?',
    options: options('Increasing effective nuclear charge attracts valence electrons more strongly within the same principal shell.', 'Additional occupied principal shells are added at each step.', 'Electron shielding increases enough to cancel nuclear charge.', 'The number of protons decreases.'),
    correctOptionId: 'a', explanation: 'Across a period, nuclear charge rises while added electrons occupy the same principal shell, so effective attraction generally increases and radius contracts.',
    hints: ['Compare nuclear charge, shielding, and shell number.'], misconceptionIds: ['atomic-structure-periodic-trend-distance-only'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-008', skillId: 'valence-electrons-ionic-compounds', learningObjectiveId: '1.8.A', sciencePracticeIds: ['4.C'],
    prompt: 'What is the neutral empirical formula formed from X2+ and Y- ions?',
    options: options('XY2', 'X2Y', 'XY', 'X2Y2'), correctOptionId: 'a',
    explanation: 'Two Y- ions balance one X2+ ion, giving the smallest whole-number neutral ratio XY2.',
    hints: ['Verify that total positive and negative charge sums to zero.'], misconceptionIds: ['atomic-structure-ionic-formula-unbalanced'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-009', skillId: 'moles-molar-mass', learningObjectiveId: '1.1.A', sciencePracticeIds: ['5.B'],
    prompt: 'A sample contains 3.011 x 10^23 formula units of a substance with molar mass 80.0 g/mol. What is the sample mass?',
    options: options('40.0 g', '80.0 g', '20.0 g', '2.41 x 10^25 g'), correctOptionId: 'a',
    explanation: 'The sample contains 0.5000 mol because 3.011 x 10^23 is half of Avogadro constant. Its mass is (0.5000 mol)(80.0 g/mol) = 40.0 g.',
    hints: ['Convert particles to moles before using molar mass.'], misconceptionIds: ['atomic-structure-molar-mass-particles'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-010', skillId: 'mass-spectra-elements', learningObjectiveId: '1.2.A', sciencePracticeIds: ['5.D'],
    prompt: 'An element has isotope-10 at 80.0% abundance and isotope-11 at 20.0% abundance. Which average atomic mass is expected?',
    options: options('10.2 u', '10.5 u', '10.8 u', '21.0 u'), correctOptionId: 'a',
    explanation: 'The weighted average is 10(0.800) + 11(0.200) = 10.2 u, closer to the more abundant isotope.',
    hints: ['Weight each isotope mass by its fractional abundance.'], misconceptionIds: ['atomic-structure-mass-spectrum-peak-height-mass'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-011', skillId: 'elemental-composition-pure-substances', learningObjectiveId: '1.3.A', sciencePracticeIds: ['2.A'],
    prompt: 'A compound contains 2.40 g of X (40.0 g/mol) and 1.92 g of oxygen (16.0 g/mol). What is its empirical formula?',
    options: options('XO2', 'X2O', 'XO', 'X2O3'), correctOptionId: 'a',
    explanation: 'The amounts are 0.0600 mol X and 0.120 mol O. Dividing by 0.0600 gives a 1:2 ratio, so the empirical formula is XO2.',
    hints: ['Convert both masses to moles, then divide by the smaller amount.'], misconceptionIds: ['atomic-structure-empirical-mass-ratio'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-012', skillId: 'composition-mixtures', learningObjectiveId: '1.4.A', sciencePracticeIds: ['5.A'],
    prompt: 'A 40.0 g mixture is 25.0% component A and 75.0% component B by mass. A is 80.0% element X, while B is 20.0% X. What mass of X is present?',
    options: options('14.0 g', '20.0 g', '10.0 g', '8.00 g'), correctOptionId: 'a',
    explanation: 'The mixture has 10.0 g A and 30.0 g B. Their X contributions are 8.00 g and 6.00 g, for 14.0 g total.',
    hints: ['Find the mass of each component before applying its composition.'], misconceptionIds: ['atomic-structure-mixture-percent-unweighted'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-013', skillId: 'atomic-structure-electron-configuration', learningObjectiveId: '1.5.A', sciencePracticeIds: ['1.A'],
    prompt: 'Which ground-state configuration represents a neutral atom with 12 electrons?',
    options: options('1s2 2s2 2p6 3s2', '1s2 2s2 2p6 3p2', '1s2 2s2 2p8', '1s2 2s2 2p6 3s1'),
    correctOptionId: 'a', explanation: 'The configuration follows orbital energy order and contains 2 + 2 + 6 + 2 = 12 electrons.',
    hints: ['Fill lower-energy orbitals in order and count the superscripts.'], misconceptionIds: ['atomic-structure-electrons-fill-by-shell-only'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-014', skillId: 'photoelectron-spectroscopy', learningObjectiveId: '1.6.A', sciencePracticeIds: ['4.B'],
    prompt: 'A PES spectrum has one subshell peak with relative area 2 and another with relative area 6. What is the most direct interpretation?',
    options: options('The peaks represent subshells containing two and six electrons, respectively.', 'The second subshell has three times the binding energy.', 'The first peak represents two isotopes and the second six isotopes.', 'The second subshell lies six principal shells from the nucleus.'),
    correctOptionId: 'a', explanation: 'Relative PES peak area tracks the number of electrons represented. Binding energy is read from horizontal peak position, not area.',
    hints: ['Separate peak magnitude from horizontal binding-energy position.'], misconceptionIds: ['atomic-structure-pes-intensity-binding'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-015', skillId: 'moles-molar-mass', learningObjectiveId: '1.1.A', sciencePracticeIds: ['5.B'],
    prompt: 'A NaCl sample contains 3.011 x 10^23 formula units. Using a molar mass of 58.44 g/mol, what is the sample mass?',
    options: options('29.22 g', '58.44 g', '117.0 g', '1.760 x 10^25 g'), correctOptionId: 'a',
    explanation: 'The sample contains 0.5000 mol because 3.011 x 10^23 is half of Avogadro constant. Its mass is (0.5000 mol)(58.44 g/mol) = 29.22 g.',
    hints: ['Convert formula units to moles before applying molar mass.'], misconceptionIds: ['atomic-structure-molar-mass-particles'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-016', skillId: 'composition-mixtures', learningObjectiveId: '1.4.A', sciencePracticeIds: ['5.A'],
    prompt: 'A mixture is made from 30.0 g of an alloy that is 40.0% Cu by mass and 70.0 g of an alloy that is 10.0% Cu. What is the mass percent Cu in the combined mixture?',
    options: options('19.0%', '25.0%', '50.0%', '15.0%'), correctOptionId: 'a',
    explanation: 'The two portions contribute 12.0 g and 7.0 g Cu. The combined 100.0 g mixture therefore contains 19.0 g Cu, or 19.0% by mass.',
    hints: ['Add copper masses, not the two percentages.'], misconceptionIds: ['atomic-structure-mixture-percent-unweighted'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-017', skillId: 'atomic-structure-electron-configuration', learningObjectiveId: '1.5.A', sciencePracticeIds: ['1.A'],
    prompt: 'Which ground-state electron configuration represents Fe3+?',
    options: options('[Ar] 3d5', '[Ar] 4s2 3d3', '[Ar] 4s1 3d4', '[Ne] 3s2 3p6 3d8'), correctOptionId: 'a',
    explanation: 'Neutral Fe is [Ar] 4s2 3d6. Forming Fe3+ removes the two 4s electrons before one 3d electron, leaving [Ar] 3d5.',
    hints: ['For transition-metal cations, remove electrons from the highest principal shell before 3d.'], misconceptionIds: ['atomic-structure-electrons-fill-by-shell-only'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-018', skillId: 'photoelectron-spectroscopy', learningObjectiveId: '1.6.A', sciencePracticeIds: ['4.B'],
    prompt: 'In a PES spectrum of a many-electron atom, which electrons are represented by the peak at the greatest binding energy?',
    options: options('The electrons held most strongly, generally in the innermost occupied subshell', 'The valence electrons farthest from the nucleus', 'The isotope with the greatest mass number', 'The electrons in the subshell with the largest peak area'), correctOptionId: 'a',
    explanation: 'Binding-energy position indicates how strongly electrons are held. Core electrons closest to the nucleus generally require the most energy to remove; peak area instead indicates relative electron count.',
    hints: ['Interpret horizontal binding-energy position separately from peak size.'], misconceptionIds: ['atomic-structure-pes-intensity-binding'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-019', skillId: 'periodic-trends', learningObjectiveId: '1.7.A', sciencePracticeIds: ['4.A'],
    prompt: 'Why is the first ionization energy of Mg generally greater than that of Na?',
    options: options('Mg has a greater effective nuclear charge on electrons in the same principal shell.', 'Mg has one more occupied principal shell than Na.', 'Na has more protons and therefore holds its valence electron more strongly.', 'Mg has a larger atomic radius because it is farther right in the period.'), correctOptionId: 'a',
    explanation: 'Across the same period, nuclear charge increases while shielding changes less. The greater effective nuclear charge in Mg holds its valence electrons more strongly and raises its first ionization energy relative to Na.',
    hints: ['Compare shell number first, then effective nuclear charge.'], misconceptionIds: ['atomic-structure-periodic-trend-distance-only'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-mcq-020', skillId: 'valence-electrons-ionic-compounds', learningObjectiveId: '1.8.A', sciencePracticeIds: ['4.C'],
    prompt: 'What is the simplest formula of the ionic compound formed from Al3+ and O2-?',
    options: options('Al2O3', 'AlO', 'Al3O2', 'AlO3'), correctOptionId: 'a',
    explanation: 'Two Al3+ ions contribute +6 total charge and three O2- ions contribute -6. The smallest neutral whole-number ratio is therefore Al2O3.',
    hints: ['Choose the smallest ion counts whose total charge is zero.'], misconceptionIds: ['atomic-structure-ionic-formula-unbalanced'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-stimulus-mcq-001', stimulusId: 'atomic-structure-isotope-stimulus',
    skillId: 'mass-spectra-elements', learningObjectiveId: '1.2.A', sciencePracticeIds: ['5.D'],
    prompt: 'What is the weighted average atomic mass of element Z?',
    options: options('63.0 u', '64.0 u', '62.8 u', '192 u'), correctOptionId: 'a',
    explanation: '62.0(0.600) + 64.0(0.300) + 66.0(0.100) = 63.0 u.',
    hints: ['Multiply each mass by its fractional abundance.'], misconceptionIds: ['atomic-structure-mass-spectrum-peak-height-mass'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-stimulus-mcq-002', stimulusId: 'atomic-structure-isotope-stimulus',
    skillId: 'mass-spectra-elements', learningObjectiveId: '1.2.A', sciencePracticeIds: ['5.D'],
    prompt: 'Which spectrum description is consistent with the data?',
    options: options('Three peaks at m/z 62, 64, and 66 with relative intensities 60:30:10', 'One peak at m/z 63', 'Three equal-height peaks at m/z 60, 30, and 10', 'A tallest peak at m/z 66 because it is heaviest'),
    correctOptionId: 'a', explanation: 'For singly charged ions, peak positions follow isotope masses and relative intensities follow abundances.',
    hints: ['Keep mass-to-charge position separate from intensity.'], misconceptionIds: ['atomic-structure-mass-spectrum-peak-height-mass'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-stimulus-mcq-003', stimulusId: 'atomic-structure-isotope-stimulus',
    skillId: 'mass-spectra-elements', learningObjectiveId: '1.2.A', sciencePracticeIds: ['5.D'],
    prompt: 'If a second sample has a larger fraction of isotope-66 and a correspondingly smaller fraction of isotope-62, what happens to its average atomic mass?',
    options: options('It increases.', 'It decreases.', 'It remains exactly 63.0 u.', 'It becomes 66 times larger.'),
    correctOptionId: 'a', explanation: 'Shifting abundance from a lighter isotope to a heavier isotope raises the weighted average.',
    hints: ['Reason from the direction of the abundance shift.'], misconceptionIds: ['atomic-structure-mass-spectrum-peak-height-mass'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-stimulus-mcq-004', stimulusId: 'atomic-structure-isotope-stimulus',
    skillId: 'moles-molar-mass', learningObjectiveId: '1.1.A', sciencePracticeIds: ['5.B'],
    prompt: 'Using the average atomic mass, approximately how many moles are in 12.6 g of element Z?',
    options: options('0.200 mol', '0.100 mol', '2.00 mol', '793.8 mol'), correctOptionId: 'a',
    explanation: 'n = 12.6 g/(63.0 g/mol) = 0.200 mol.',
    hints: ['Use the weighted average as the molar mass.'], misconceptionIds: ['atomic-structure-molar-mass-particles'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-pes-stimulus-mcq-001', stimulusId: 'atomic-structure-pes-stimulus',
    skillId: 'photoelectron-spectroscopy', learningObjectiveId: '1.6.A', sciencePracticeIds: ['4.B'],
    prompt: 'How many electrons are present in a neutral atom of element X?',
    options: options('12', '4', '8', '131'), correctOptionId: 'a',
    explanation: 'The integrated areas represent 2 + 2 + 6 + 2 = 12 electrons. Because the atom is neutral, this is also its proton count and atomic number.',
    hints: ['Add peak areas; do not add binding-energy values.'], misconceptionIds: ['atomic-structure-pes-intensity-binding'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-pes-stimulus-mcq-002', stimulusId: 'atomic-structure-pes-stimulus',
    skillId: 'atomic-structure-electron-configuration', learningObjectiveId: '1.5.A', sciencePracticeIds: ['1.A', '4.B'],
    prompt: 'Which ground-state configuration is consistent with the four PES peaks?',
    options: options('1s2 2s2 2p6 3s2', '1s2 2s2 2p4 3s4', '1s2 2s2 2p6 3p2', '1s2 2s2 2p8'), correctOptionId: 'a',
    explanation: 'The areas 2, 2, 6, and 2 match occupied 1s, 2s, 2p, and 3s subshells. Binding energy decreases as the listed electrons become less tightly held.',
    hints: ['Match allowed subshell capacities to the peak areas in binding-energy order.'], misconceptionIds: ['atomic-structure-electrons-fill-by-shell-only', 'atomic-structure-pes-intensity-binding'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-pes-stimulus-mcq-003', stimulusId: 'atomic-structure-pes-stimulus',
    skillId: 'photoelectron-spectroscopy', learningObjectiveId: '1.6.A', sciencePracticeIds: ['4.B'],
    prompt: 'Which interpretation of peak C is best supported?',
    options: options('It represents six electrons in the 2p subshell.', 'It represents the six most strongly bound electrons.', 'It represents an isotope with mass number 6.', 'It represents six electrons in separate principal shells.'), correctOptionId: 'a',
    explanation: 'The area of 6 identifies a six-electron subshell population. Its binding-energy position between the 2s-like and 3s-like peaks is consistent with 2p6.',
    hints: ['Use area for population and horizontal position for binding energy.'], misconceptionIds: ['atomic-structure-pes-intensity-binding'],
  }),
  multipleChoice({
    id: 'ap-chem-atomic-structure-properties-pes-stimulus-mcq-004', stimulusId: 'atomic-structure-pes-stimulus',
    skillId: 'valence-electrons-ionic-compounds', learningObjectiveId: '1.8.A', sciencePracticeIds: ['4.C'],
    prompt: 'If X forms X2+, which change to the spectrum is expected most directly?',
    options: options('Peak D disappears because its two least-bound electrons are removed.', 'Peak A disappears because core electrons are removed first.', 'Peak C doubles in area because the ion has a 2+ charge.', 'All binding energies become zero because the ion is stable.'), correctOptionId: 'a',
    explanation: 'The two 3s electrons associated with the lowest-binding-energy peak D are removed first. The resulting cation has the closed-shell 1s2 2s2 2p6 configuration.',
    hints: ['Ionization removes the least strongly held occupied electrons first.'], misconceptionIds: ['atomic-structure-ionic-formula-unbalanced', 'atomic-structure-pes-intensity-binding'],
  }),
  freeResponse({
    id: 'ap-chem-atomic-structure-properties-short-frq-001', skillId: 'elemental-composition-pure-substances', learningObjectiveId: '1.3.A', sciencePracticeIds: ['2.A'],
    responseFormat: 'short-frq', rubricId: 'atomic-structure-composition-short-frq-rubric',
    prompt: 'A 7.20 g sample of a pure compound contains 2.40 g of element X (40.0 g/mol) and only oxygen (16.0 g/mol). (a) Determine the oxygen mass. (b) Calculate moles of X and O. (c) Determine the empirical formula. (d) Calculate the oxygen mass percent from the formula and compare it with the sample.',
    modelAnswer: '(a) mO = 7.20 - 2.40 = 4.80 g. (b) nX = 2.40/40.0 = 0.0600 mol and nO = 4.80/16.0 = 0.300 mol. (c) Dividing by 0.0600 gives X:O = 1:5, so the empirical formula is XO5. (d) The formula mass is 40.0 + 5(16.0) = 120.0 g/mol and oxygen contributes 80.0/120.0 x 100% = 66.7%, matching 4.80/7.20 x 100% = 66.7%.',
    explanation: 'Empirical composition comes from elemental mole ratios, and the mass-percent check independently confirms consistency.',
    hints: ['Use mass difference.', 'Convert each mass separately to moles.', 'Divide by the smaller mole amount.'],
    misconceptionIds: ['atomic-structure-empirical-mass-ratio'],
    parts: [
      { id: 'part-a', label: 'a', prompt: 'Determine oxygen mass.' },
      { id: 'part-b', label: 'b', prompt: 'Convert both elemental masses to moles.' },
      { id: 'part-c', label: 'c', prompt: 'Determine the empirical formula.' },
      { id: 'part-d', label: 'd', prompt: 'Check oxygen mass percent.' },
    ],
  }),
  freeResponse({
    id: 'ap-chem-atomic-structure-properties-long-frq-001', skillId: 'mass-spectra-elements', learningObjectiveId: '1.2.A', sciencePracticeIds: ['1.A', '4.A', '4.B', '4.C', '5.D'],
    responseFormat: 'long-frq', rubricId: 'atomic-structure-evidence-long-frq-rubric',
    prompt: 'Element Z has isotope masses and abundances 62.0 u (60.0%), 64.0 u (30.0%), and 66.0 u (10.0%). A different atom Y has ground-state configuration [Ne]3s2 3p5. (a) Show the weighted-average calculation for Z. (b) Describe Z mass-spectrum peak positions and relative intensities. (c) State the number of valence electrons in Y and predict its common ion. (d) Explain how a PES spectrum distinguishes the five 3p electrons from core electrons. (e) Compare Y with the element immediately to its left in the same period in radius and first ionization energy using effective nuclear charge. (f) Write the formula formed between X2+ and the common ion of Y.',
    modelAnswer: '(a) 62.0(0.600) + 64.0(0.300) + 66.0(0.100) = 63.0 u. (b) Peaks occur at m/z 62, 64, and 66 with relative intensities 60:30:10. (c) Y has seven valence electrons and commonly forms Y-. (d) The 3p peak area corresponds to five electrons and occurs at lower binding energy than core-electron peaks; position gives binding energy and area gives electron count. (e) Y generally has smaller radius and higher first ionization energy because it has greater effective nuclear charge in the same principal shell. (f) One X2+ requires two Y-, so the formula is XY2.',
    explanation: 'The response separates isotope mass evidence, electron-population evidence, binding energy, effective attraction, and charge neutrality.',
    hints: ['Use fractional abundances.', 'Separate PES horizontal and vertical information.', 'The two atoms compared are in the same shell.', 'Balance total ionic charge.'],
    misconceptionIds: ['atomic-structure-mass-spectrum-peak-height-mass', 'atomic-structure-pes-intensity-binding', 'atomic-structure-periodic-trend-distance-only', 'atomic-structure-ionic-formula-unbalanced'],
    parts: [
      { id: 'part-a', label: 'a', prompt: 'Calculate weighted average mass.' },
      { id: 'part-b', label: 'b', prompt: 'Describe the mass spectrum.' },
      { id: 'part-c', label: 'c', prompt: 'Interpret electron configuration and common ion.' },
      { id: 'part-d', label: 'd', prompt: 'Interpret PES evidence.' },
      { id: 'part-e', label: 'e', prompt: 'Explain the periodic trend.' },
      { id: 'part-f', label: 'f', prompt: 'Write the neutral ionic formula.' },
    ],
  }),
])
