import { assertValidEditorialCatalog } from './editorialSchema.js'

const UNIT_ID = 'atomic-structure-properties'
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
  return { kind: 'formula', schemaVersion: 1, review: review(), provenance: provenance(), conceptGroup: 'atomic-quantities-and-structure', ...definition }
}
function lesson(definition) {
  return { kind: 'lesson', schemaVersion: 1, review: review(), provenance: provenance(), ...definition }
}

const resources = [
  formula({
    id: 'atomic-structure-amount-mass-particles',
    title: 'Amount, mass, and particle count',
    summary: 'Convert among moles, sample mass, and representative particles.',
    alignment: alignment(['moles-molar-mass'], ['1.1.A'], ['5.B']),
    examReference: { status: 'provided', sourceId: 'ap-chemistry-reference-2026', note: 'The current exam reference information provides Avogadro constant; molar mass comes from elemental masses and formula composition.' },
    expression: 'n = m/M; N = n NA',
    variables: [
      { symbol: 'n', meaning: 'amount of substance', units: 'mol' },
      { symbol: 'm', meaning: 'sample mass', units: 'g' },
      { symbol: 'M', meaning: 'molar mass', units: 'g/mol' },
      { symbol: 'N', meaning: 'number of representative particles', units: 'particles' },
      { symbol: 'NA', meaning: 'Avogadro constant', units: '6.022 x 10^23 mol^-1' },
    ],
    assumptions: ['The chemical identity and molar mass are correct.', 'The selected representative particle matches the substance and question.'],
    appliesWhen: ['Converting sample mass to formula units, molecules, atoms, or ions.', 'Scaling composition by amount.'],
    doesNotApplyWhen: ['Using volume as amount without a density or gas relationship.', 'Confusing atoms within each formula unit with formula-unit count.'],
    rearrangements: ['m = nM', 'n = N/NA', 'N = (m/M)NA'],
    workedExample: {
      prompt: 'How many molecules are in 9.00 g of a substance with molar mass 45.0 g/mol?',
      steps: ['Calculate n = 9.00/45.0 = 0.200 mol.', 'Multiply by 6.022 x 10^23 molecules/mol.'],
      answer: 'N = 1.20 x 10^23 molecules.',
    },
    commonMistake: 'Multiplying grams directly by Avogadro constant without dividing by molar mass.',
  }),
  formula({
    id: 'atomic-structure-weighted-isotope-mass',
    title: 'Weighted average atomic mass',
    summary: 'Use isotope masses and fractional abundances to calculate an average atomic mass.',
    alignment: alignment(['mass-spectra-elements'], ['1.2.A'], ['5.D']),
    examReference: { status: 'not-provided', sourceId: 'ap-chemistry-reference-2026', note: 'The weighted-average expression is ordinary proportional reasoning rather than a separately printed exam equation.' },
    expression: 'average atomic mass = sum(isotope mass x fractional abundance)',
    variables: [
      { symbol: 'isotope mass', meaning: 'mass of one isotope', units: 'u' },
      { symbol: 'fractional abundance', meaning: 'isotope fraction of the sample', units: 'none; fractions sum to 1' },
    ],
    assumptions: ['Abundances describe the same representative sample.', 'Percent abundances are divided by 100 before multiplication.', 'For singly charged ions, mass-to-charge peak position numerically tracks isotope mass.'],
    appliesWhen: ['Interpreting isotope mass spectra.', 'Checking whether an elemental average lies between isotope masses.'],
    doesNotApplyWhen: ['Using peak height as the isotope mass.', 'Adding percentages that do not total approximately 100%.'],
    rearrangements: ['For two isotopes, average = m1 f + m2(1 - f).', 'Unknown abundance f = (average - m2)/(m1 - m2).'],
    workedExample: {
      prompt: 'An element is 75.0% isotope-24 and 25.0% isotope-26. Find its average atomic mass.',
      steps: ['Convert percentages to 0.750 and 0.250.', 'Calculate 24(0.750) + 26(0.250).'],
      answer: 'Average atomic mass = 24.5 u.',
    },
    commonMistake: 'Using 75 and 25 rather than 0.750 and 0.250.',
  }),
  formula({
    id: 'atomic-structure-composition',
    title: 'Mass percent and empirical composition',
    summary: 'Relate component mass, total mass, mole ratios, and empirical formulas.',
    alignment: alignment(['elemental-composition-pure-substances', 'composition-mixtures'], ['1.3.A', '1.4.A'], ['2.A', '5.A']),
    examReference: { status: 'not-provided', sourceId: 'ap-chemistry-reference-2026', note: 'Mass-percent and empirical-ratio steps are not separately printed as a dedicated formula.' },
    expression: 'mass percent = component mass / total mass x 100%; empirical subscripts follow simplest whole-number mole ratio',
    variables: [
      { symbol: 'component mass', meaning: 'mass of the selected element or mixture component', units: 'g' },
      { symbol: 'total mass', meaning: 'mass of the entire pure sample or mixture', units: 'g' },
      { symbol: 'mole ratio', meaning: 'elemental mole amount divided by the smallest elemental mole amount', units: 'none' },
    ],
    assumptions: ['All component masses refer to one sample.', 'Element masses are converted with appropriate atomic masses.', 'Empirical subscripts are whole-number ratios within measurement precision.'],
    appliesWhen: ['Determining empirical formulas.', 'Solving mixture mass balances and percent composition.'],
    doesNotApplyWhen: ['Using gram ratios directly as atom ratios.', 'Taking an unweighted average of component percentages.'],
    rearrangements: ['component mass = mass fraction x total mass', 'mixture analyte mass = sum(component mass x component analyte fraction)'],
    workedExample: {
      prompt: 'A 10.0 g compound contains 4.00 g X (40.0 g/mol) and 6.00 g Y (20.0 g/mol). Find its empirical formula.',
      steps: ['nX = 4.00/40.0 = 0.100 mol.', 'nY = 6.00/20.0 = 0.300 mol.', 'Divide both by 0.100.'],
      answer: 'The empirical formula is XY3.',
    },
    commonMistake: 'Using 4:6 as the subscript ratio instead of converting each mass to moles.',
  }),
  formula({
    id: 'atomic-structure-electron-charge-balance',
    title: 'Electron count and ionic charge balance',
    summary: 'Relate atomic number, ion charge, electron count, and neutral ionic formulas.',
    alignment: alignment(['atomic-structure-electron-configuration', 'valence-electrons-ionic-compounds'], ['1.5.A', '1.8.A'], ['1.A', '4.C']),
    examReference: { status: 'not-provided', sourceId: 'ap-chemistry-reference-2026', note: 'Electron counting and ionic charge balance are structural reasoning, not a separately printed exam equation.' },
    expression: 'electron count = atomic number - signed ionic charge; sum(ion count x ion charge) = 0',
    variables: [
      { symbol: 'atomic number', meaning: 'number of protons', units: 'none' },
      { symbol: 'signed ionic charge', meaning: 'positive for cations and negative for anions', units: 'elementary-charge units' },
      { symbol: 'ion count', meaning: 'formula subscript for an ion', units: 'none' },
    ],
    assumptions: ['The species is monatomic when atomic number is used directly.', 'The ionic formula represents a neutral compound.', 'Subscripts use the smallest whole-number ratio.'],
    appliesWhen: ['Counting electrons in monatomic ions.', 'Writing neutral empirical formulas from ion charges.'],
    doesNotApplyWhen: ['Assigning orbital order without the filling rules.', 'Inferring common ion charge for transition metals without additional evidence.'],
    rearrangements: ['For X2+, electron count = Z - 2.', 'For Y-, electron count = Z + 1.', 'One X2+ requires two Y- for neutrality.'],
    workedExample: {
      prompt: 'An element with atomic number 17 forms a 1- ion. How many electrons does the ion have, and what formula forms with X2+?',
      steps: ['Electron count = 17 - (-1) = 18.', 'Two 1- ions balance one 2+ ion.'],
      answer: 'The ion has 18 electrons and forms XY2 with X2+.',
    },
    commonMistake: 'Subtracting the magnitude of a negative ion charge instead of adding an electron.',
  }),
  lesson({
    id: 'atomic-structure-quantities-composition-and-spectra',
    title: 'Atomic quantities, composition, and mass spectra',
    summary: 'Move among particle count, mass, isotope abundance, empirical composition, and mixture mass balances.',
    alignment: alignment(
      ['moles-molar-mass', 'mass-spectra-elements', 'elemental-composition-pure-substances', 'composition-mixtures'],
      ['1.1.A', '1.2.A', '1.3.A', '1.4.A'], ['2.A', '5.A', '5.B', '5.D'],
    ),
    prerequisites: ['Dimensional analysis.', 'Percent as a fraction.', 'Atomic masses and balanced arithmetic.'],
    sections: [
      { heading: 'Use the mole as the central bridge', body: 'Representative particles convert to moles through Avogadro constant, while mass converts through molar mass. For compounds, distinguish formula-unit or molecule count from the number of atoms or ions within each unit.' },
      { heading: 'Read both axes of a mass spectrum', body: 'Peak position identifies mass-to-charge value and relative peak size represents abundance. A weighted average must lie between the isotope masses and closer to the more abundant isotope.' },
      { heading: 'Convert mass evidence into chemical ratios', body: 'For a pure compound, convert each elemental mass to moles before reducing to whole-number ratios. For mixtures, keep component mass and analyte contribution separate and solve one mass balance.' },
    ],
    workedExamples: [
      { prompt: 'Find molecules in 9.00 g of a 45.0 g/mol substance.', steps: ['Convert to 0.200 mol.', 'Multiply by Avogadro constant.'], answer: '1.20 x 10^23 molecules.' },
      { prompt: 'Find average mass for 75.0% isotope-24 and 25.0% isotope-26.', steps: ['Use fractional abundances.', 'Calculate the weighted sum.'], answer: '24.5 u.' },
    ],
    misconceptions: [
      { id: 'atomic-structure-molar-mass-particles', claim: 'Grams convert directly with Avogadro constant.', correction: 'Convert mass to moles first.' },
      { id: 'atomic-structure-mass-spectrum-peak-height-mass', claim: 'Peak height gives isotope mass.', correction: 'Position gives mass; height gives abundance.' },
      { id: 'atomic-structure-empirical-mass-ratio', claim: 'Gram ratios are empirical subscripts.', correction: 'Convert masses to mole ratios.' },
      { id: 'atomic-structure-mixture-percent-unweighted', claim: 'Mixture percentages can be averaged directly.', correction: 'Weight each contribution by component amount.' },
    ],
    retrievalChecks: [
      { prompt: 'What connects grams to moles?', answer: 'Molar mass.' },
      { prompt: 'What does mass-spectrum peak intensity represent?', answer: 'Relative isotope abundance.' },
      { prompt: 'What is the first empirical-formula step after measuring masses?', answer: 'Convert each element mass to moles.' },
      { prompt: 'How do you find analyte mass in a mixture?', answer: 'Sum each component mass times its analyte fraction.' },
    ],
    formulaIds: ['atomic-structure-amount-mass-particles', 'atomic-structure-weighted-isotope-mass', 'atomic-structure-composition'],
  }),
  lesson({
    id: 'atomic-structure-electrons-pes-and-periodicity',
    title: 'Electron structure, PES, periodic trends, and ionic formulas',
    summary: 'Connect electron configurations and photoelectron evidence to periodic behavior and ionic charge.',
    alignment: alignment(
      ['atomic-structure-electron-configuration', 'photoelectron-spectroscopy', 'periodic-trends', 'valence-electrons-ionic-compounds'],
      ['1.5.A', '1.6.A', '1.7.A', '1.8.A'], ['1.A', '4.A', '4.B', '4.C'],
    ),
    prerequisites: ['Protons, electrons, and ion charge.', 'Orbital labels and periodic-table organization.', 'Coulombic attraction qualitatively.'],
    sections: [
      { heading: 'Build configurations from electron count and orbital energy', body: 'Count electrons from atomic number and ion charge, fill orbitals in energy order, and apply Pauli and Hund rules. Valence electrons occupy the highest relevant energy shell and guide common main-group ion charges.' },
      { heading: 'Interpret PES position and intensity independently', body: 'Greater binding energy means an electron is held more strongly. Peak intensity or area reflects the number of electrons in a subshell. Core electrons have greater binding energies than valence electrons.' },
      { heading: 'Explain trends with effective attraction', body: 'Across a period, increasing effective nuclear charge generally shrinks radius and raises ionization energy. Down a group, additional occupied shells increase distance and shielding. Ionic formulas then follow charge neutrality, not a direct copying of valence counts.' },
    ],
    workedExamples: [
      { prompt: 'An atom has configuration [Ne]3s2 3p5. Predict its common monatomic ion.', steps: ['Count seven valence electrons.', 'Adding one electron completes the p subshell.'], answer: 'A 1- ion with an [Ar] configuration is expected.' },
      { prompt: 'Ion X2+ combines with Y-. Find the formula.', steps: ['Two Y- ions are required for +2 charge.', 'Use the lowest whole-number ratio.'], answer: 'XY2.' },
    ],
    misconceptions: [
      { id: 'atomic-structure-electrons-fill-by-shell-only', claim: 'Orbitals fill only by shell number.', correction: 'Use orbital energy order plus Pauli and Hund rules.' },
      { id: 'atomic-structure-pes-intensity-binding', claim: 'Tall PES peaks have greater binding energy.', correction: 'Position gives binding energy; intensity gives electron count.' },
      { id: 'atomic-structure-periodic-trend-distance-only', claim: 'Only shell distance controls trends.', correction: 'Effective nuclear charge, shielding, and distance all matter.' },
      { id: 'atomic-structure-ionic-formula-unbalanced', claim: 'Ionic subscripts copy valence counts.', correction: 'Subscripts give the smallest charge-neutral ion ratio.' },
    ],
    retrievalChecks: [
      { prompt: 'What fixes total electrons in a neutral atom?', answer: 'Atomic number.' },
      { prompt: 'What does a PES peak area represent?', answer: 'Relative electron population in that subshell.' },
      { prompt: 'Why does atomic radius generally decrease across a period?', answer: 'Effective nuclear attraction increases within the same principal shell.' },
      { prompt: 'What must the net charge of an ionic formula be?', answer: 'Zero.' },
    ],
    formulaIds: ['atomic-structure-electron-charge-balance'],
  }),
  {
    id: 'atomic-structure-isotope-stimulus', kind: 'stimulus', schemaVersion: 1,
    title: 'Original isotope spectrum for element Z',
    summary: 'An original three-isotope data set for abundance, average mass, and spectrum interpretation.',
    alignment: alignment(['mass-spectra-elements'], ['1.2.A'], ['5.D']), review: review(), provenance: provenance(),
    context: 'A naturally occurring element Z produces singly charged ions with three isotope peaks. The relative abundance values have been normalized to a total of 100.0%.',
    representation: {
      type: 'table', caption: 'Isotope mass and relative abundance',
      columns: ['Isotope mass (u)', 'Relative abundance (%)'],
      rows: [['62.0', '60.0'], ['64.0', '30.0'], ['66.0', '10.0']],
      accessibleDescription: 'Element Z has isotope masses 62.0, 64.0, and 66.0 atomic mass units with relative abundances 60.0, 30.0, and 10.0 percent respectively.',
    },
  },
  {
    id: 'atomic-structure-pes-stimulus', kind: 'stimulus', schemaVersion: 1,
    title: 'Photoelectron spectrum of neutral element X',
    summary: 'An original four-peak PES data set for inferring electron population, configuration, and cation formation.',
    alignment: alignment(
      ['atomic-structure-electron-configuration', 'photoelectron-spectroscopy', 'valence-electrons-ionic-compounds'],
      ['1.5.A', '1.6.A', '1.8.A'], ['1.A', '4.B', '4.C'],
    ),
    review: review(), provenance: provenance(),
    context: 'A neutral gas-phase atom of element X is analyzed by photoelectron spectroscopy. Each peak corresponds to one occupied subshell. Integrated relative area is proportional to the number of electrons represented by the peak; larger binding energy means that the electrons are held more strongly.',
    representation: {
      type: 'table', caption: 'PES peak binding energies and integrated relative areas',
      columns: ['Peak', 'Binding energy (MJ/mol)', 'Integrated relative area'],
      rows: [
        ['A', '131', '2'],
        ['B', '7.40', '2'],
        ['C', '5.40', '6'],
        ['D', '0.740', '2'],
      ],
      accessibleDescription: 'Peak A has binding energy 131 megajoules per mole and relative area 2. Peak B has binding energy 7.40 and area 2. Peak C has binding energy 5.40 and area 6. Peak D has binding energy 0.740 and area 2. Areas sum to 12 electrons, and peak D has the lowest binding energy.',
    },
  },
  {
    id: 'atomic-structure-composition-short-frq-rubric', kind: 'rubric', schemaVersion: 1,
    title: 'Draft rubric: empirical composition',
    summary: 'A four-point rubric for elemental masses, mole amounts, simplest ratio, and formula check.',
    alignment: alignment(['elemental-composition-pure-substances'], ['1.3.A'], ['2.A']), review: review(), provenance: provenance(),
    questionId: 'ap-chem-atomic-structure-properties-short-frq-001', maxPoints: 4,
    parts: [
      { id: 'part-a', prompt: 'Determine oxygen mass.', points: [{ id: 'a-oxygen-mass', criterion: 'Uses mass difference.', acceptableEvidence: 'mO = 7.20 - 2.40 = 4.80 g.' }] },
      { id: 'part-b', prompt: 'Convert both elements to moles.', points: [{ id: 'b-moles', criterion: 'Uses correct atomic masses.', acceptableEvidence: 'nX = 2.40/40.0 = 0.0600 mol and nO = 4.80/16.0 = 0.300 mol.' }] },
      { id: 'part-c', prompt: 'Find the empirical formula.', points: [{ id: 'c-formula', criterion: 'Reduces the mole ratio to whole numbers.', acceptableEvidence: 'X:O = 1:5, giving XO5.' }] },
      { id: 'part-d', prompt: 'Check mass percent.', points: [{ id: 'd-percent', criterion: 'Verifies the oxygen mass fraction from the proposed formula.', acceptableEvidence: '80.0/(40.0 + 80.0) x 100% = 66.7%, matching 4.80/7.20.' }] },
    ],
  },
  {
    id: 'atomic-structure-evidence-long-frq-rubric', kind: 'rubric', schemaVersion: 1,
    title: 'Draft rubric: isotope and electron-structure evidence',
    summary: 'A seven-point rubric for isotope average, spectrum representation, electron configuration, PES, periodic trends, and ionic formula.',
    alignment: alignment(
      ['mass-spectra-elements', 'atomic-structure-electron-configuration', 'photoelectron-spectroscopy', 'periodic-trends', 'valence-electrons-ionic-compounds'],
      ['1.2.A', '1.5.A', '1.6.A', '1.7.A', '1.8.A'], ['1.A', '4.A', '4.B', '4.C', '5.D'],
    ),
    review: review(), provenance: provenance(), questionId: 'ap-chem-atomic-structure-properties-long-frq-001', maxPoints: 7,
    parts: [
      { id: 'part-a', prompt: 'Calculate average isotope mass.', points: [
        { id: 'a-setup', criterion: 'Uses fractional abundances in a weighted sum.', acceptableEvidence: 'Writes 62.0(0.600) + 64.0(0.300) + 66.0(0.100).' },
        { id: 'a-result', criterion: 'Evaluates the weighted average.', acceptableEvidence: 'Obtains 63.0 u.' },
      ] },
      { id: 'part-b', prompt: 'Describe the spectrum.', points: [{ id: 'b-spectrum', criterion: 'Separates peak position from relative intensity.', acceptableEvidence: 'Three peaks at m/z 62, 64, and 66 with relative sizes 60:30:10.' }] },
      { id: 'part-c', prompt: 'Interpret an electron configuration.', points: [{ id: 'c-configuration', criterion: 'Connects [Ne]3s2 3p5 with seven valence electrons and a 1- ion.', acceptableEvidence: 'Adding one electron gives a closed-shell [Ar] arrangement.' }] },
      { id: 'part-d', prompt: 'Interpret PES evidence.', points: [{ id: 'd-pes', criterion: 'Uses intensity for electron count and position for binding energy.', acceptableEvidence: 'The 3p peak has five-electron intensity and lower binding energy than core peaks.' }] },
      { id: 'part-e', prompt: 'Explain a periodic trend.', points: [{ id: 'e-trend', criterion: 'Uses effective nuclear charge for a same-period comparison.', acceptableEvidence: 'Greater effective nuclear attraction produces smaller radius and higher ionization energy.' }] },
      { id: 'part-f', prompt: 'Write an ionic formula.', points: [{ id: 'f-ionic-formula', criterion: 'Balances X2+ with the identified 1- ion.', acceptableEvidence: 'The neutral formula is XY2.' }] },
    ],
  },
]

export const apChemistryAtomicStructurePropertiesResources = Object.freeze(
  assertValidEditorialCatalog(resources).map((resource) => Object.freeze(resource)),
)
