import { assertValidEditorialCatalog } from './editorialSchema.js'

const UNIT_ID = 'compound-structure-properties'
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
  return { kind: 'formula', schemaVersion: 1, review: review(), provenance: provenance(), conceptGroup: 'bonding-and-molecular-structure', ...definition }
}
function lesson(definition) {
  return { kind: 'lesson', schemaVersion: 1, review: review(), provenance: provenance(), ...definition }
}

const resources = [
  formula({
    id: 'compound-structure-electrostatic-potential',
    title: 'Electrostatic interaction and bond potential',
    summary: 'Relate charge, separation, attraction, repulsion, equilibrium distance, and bond strength.',
    alignment: alignment(['types-chemical-bonds', 'intramolecular-force-potential-energy', 'structure-ionic-solids'], ['2.1.A', '2.2.A', '2.3.A'], ['3.A', '4.C', '6.A']),
    examReference: { status: 'provided', sourceId: 'ap-chemistry-reference-2026', note: 'The current exam reference information provides Coulombic potential-energy proportionality.' },
    expression: 'electrostatic potential energy is proportional to q1 q2 / r; bond energy is the depth from separated particles to the potential minimum',
    variables: [
      { symbol: 'q1, q2', meaning: 'interacting charges or partial charges', units: 'charge units' },
      { symbol: 'r', meaning: 'separation between charge centers or nuclei', units: 'distance' },
      { symbol: 'potential minimum', meaning: 'equilibrium separation where net force is zero', units: 'energy at a stated distance' },
    ],
    assumptions: ['The comparison uses a consistent electrostatic model.', 'Other structural factors are held sufficiently similar.', 'A potential curve includes both attractive and short-range repulsive contributions.'],
    appliesWhen: ['Comparing ionic lattice attractions.', 'Interpreting bond length and bond-energy curves.', 'Explaining why opposite charges stabilize a structure.'],
    doesNotApplyWhen: ['Claiming the particles collapse to zero separation.', 'Equating zero net force with no attraction or repulsion.'],
    rearrangements: ['Larger charge magnitude strengthens electrostatic interaction at the same r.', 'Smaller r strengthens the magnitude at the same charges.', 'Energy required to dissociate equals the well depth in an idealized curve.'],
    workedExample: {
      prompt: 'Curve A has a minimum at -320 kJ/mol and curve B at -180 kJ/mol relative to separated atoms. Which bond requires more energy to break?',
      steps: ['Measure each well depth from zero separated-particle energy.', 'Compare 320 with 180 kJ/mol.'],
      answer: 'Bond A requires about 320 kJ/mol and is stronger in this model.',
    },
    commonMistake: 'Using the horizontal equilibrium distance as the bond energy.',
  }),
  formula({
    id: 'compound-structure-formal-charge-bond-order',
    title: 'Formal charge and average resonance bond order',
    summary: 'Audit Lewis structures and quantify equivalent bonds in a resonance hybrid.',
    alignment: alignment(['lewis-diagrams', 'resonance-formal-charge'], ['2.5.A', '2.6.A'], ['3.B', '6.C']),
    examReference: { status: 'not-provided', sourceId: 'ap-chemistry-reference-2026', note: 'Formal-charge and resonance bond-order bookkeeping are not separately printed as exam equations.' },
    expression: 'formal charge = valence electrons - nonbonding electrons - bonding electrons/2; average bond order = total bond order across equivalent positions / number of positions',
    variables: [
      { symbol: 'valence electrons', meaning: 'isolated-atom valence count', units: 'electrons' },
      { symbol: 'nonbonding electrons', meaning: 'electrons assigned to lone pairs on the atom', units: 'electrons' },
      { symbol: 'bonding electrons', meaning: 'electrons in bonds connected to the atom', units: 'electrons' },
      { symbol: 'bond order', meaning: 'single, double, or triple bond count contribution', units: 'none' },
    ],
    assumptions: ['The total valence-electron count is correct.', 'Equivalent resonance contributors are being averaged.', 'Formal charge is bookkeeping rather than a full physical charge map.'],
    appliesWhen: ['Choosing among Lewis structures.', 'Explaining equal intermediate bond lengths in resonance hybrids.'],
    doesNotApplyWhen: ['Treating resonance contributors as molecules that switch.', 'Using formal charge alone to predict every structure without octet or chemical evidence.'],
    rearrangements: ['The sum of formal charges equals the species charge.', 'For one double and two single bonds distributed over three equivalent positions, average order = 4/3.'],
    workedExample: {
      prompt: 'Three equivalent positions share one double bond and two single bonds among resonance contributors. Find their average bond order.',
      steps: ['Total bond-order contribution is 2 + 1 + 1 = 4.', 'Divide by three equivalent positions.'],
      answer: 'Each equivalent bond has average bond order 4/3.',
    },
    commonMistake: 'Averaging the number of drawings rather than bond-order contributions.',
  }),
  formula({
    id: 'compound-structure-electron-domains',
    title: 'Electron domains, molecular geometry, and hybridization',
    summary: 'Map electron-domain count to idealized geometry and central-atom hybridization labels.',
    alignment: alignment(['vsepr-hybridization'], ['2.7.A'], ['6.C']),
    examReference: { status: 'not-provided', sourceId: 'ap-chemistry-reference-2026', note: 'VSEPR domain-to-geometry mappings are conceptual reference knowledge, not a printed equation.' },
    expression: 'steric number = sigma-bonding domains + lone-pair domains; 2 -> linear/sp, 3 -> trigonal planar/sp2, 4 -> tetrahedral/sp3',
    variables: [
      { symbol: 'steric number', meaning: 'number of electron domains around the selected central atom', units: 'none' },
      { symbol: 'sigma-bonding domain', meaning: 'one bonded direction, regardless of single or multiple bond', units: 'domain' },
      { symbol: 'lone-pair domain', meaning: 'one localized lone pair on the central atom', units: 'domain' },
    ],
    assumptions: ['Each multiple bond counts as one electron domain.', 'The hybridization label is an idealized localized-bond model.', 'Molecular geometry omits lone-pair positions from its name.'],
    appliesWhen: ['Predicting central-atom electron geometry and molecular geometry.', 'Relating domain count to ideal bond angles and sigma frameworks.'],
    doesNotApplyWhen: ['Counting a double bond as two domains.', 'Naming molecular geometry without accounting for lone pairs.'],
    rearrangements: ['Three bonding domains and no lone pairs give trigonal planar molecular geometry.', 'Four domains with one lone pair give tetrahedral electron geometry and trigonal pyramidal molecular geometry.'],
    workedExample: {
      prompt: 'A central atom has three sigma-bonding domains and one lone pair. State electron geometry, molecular geometry, and hybridization label.',
      steps: ['Steric number is 3 + 1 = 4.', 'Four domains give tetrahedral electron geometry and sp3.', 'Omit the lone pair when naming atom positions.'],
      answer: 'Tetrahedral electron geometry, trigonal pyramidal molecular geometry, and sp3.',
    },
    commonMistake: 'Calling the molecular geometry tetrahedral when one domain is a lone pair.',
  }),
  lesson({
    id: 'compound-structure-bonding-solids-and-energy',
    title: 'Bonding models, potential energy, ionic lattices, and metals',
    summary: 'Choose useful bonding models and connect particle arrangements with energy and material properties.',
    alignment: alignment(
      ['types-chemical-bonds', 'intramolecular-force-potential-energy', 'structure-ionic-solids', 'structure-metals-alloys'],
      ['2.1.A', '2.2.A', '2.3.A', '2.4.A'], ['3.A', '4.C', '6.A'],
    ),
    prerequisites: ['Valence electrons and ion charge.', 'Electrostatic attraction and repulsion.', 'Particle-level representations of solids.'],
    sections: [
      { heading: 'Treat bonding models as an evidence-based continuum', body: 'Electron density may be shared nearly evenly, shared unequally, transferred into an ionic lattice, or delocalized across metal centers. Electronegativity, particle structure, conductivity, and mechanical behavior help choose the most explanatory model.' },
      { heading: 'Read a potential curve as competing interactions', body: 'At large separation the interaction approaches zero. Attraction lowers energy as particles approach, while strong short-range repulsion raises it sharply. At the minimum, attraction and repulsion balance; the well depth represents bond dissociation energy in the idealized model.' },
      { heading: 'Connect extended structures to properties', body: 'Ionic solids are repeating charge-balanced lattices, not molecules. Metals contain delocalized valence electrons and nondirectional attraction, supporting electrical conduction and deformation. Alloying changes the metal-center arrangement and can hinder layer motion.' },
    ],
    workedExamples: [
      { prompt: 'Compare potential wells at -320 and -180 kJ/mol.', steps: ['Use separated atoms as zero.', 'Compare well-depth magnitudes.'], answer: 'The -320 kJ/mol well represents the stronger bond and requires 320 kJ/mol to dissociate.' },
      { prompt: 'Why can a metal conduct while a molecular solid often cannot?', steps: ['Identify delocalized valence electrons in the metal.', 'Contrast with localized electrons in molecules.'], answer: 'Mobile delocalized electrons carry charge through the metallic structure.' },
    ],
    misconceptions: [
      { id: 'compound-structure-bond-type-binary', claim: 'Bond type is perfectly binary.', correction: 'Electron sharing and transfer lie on a continuum interpreted with structural evidence.' },
      { id: 'compound-structure-minimum-zero-force', claim: 'No forces act at the energy minimum.', correction: 'Attractive and repulsive forces balance to zero net force.' },
      { id: 'compound-structure-ionic-molecules', claim: 'Ionic solids contain molecules.', correction: 'They are extended ion lattices with empirical ratios.' },
      { id: 'compound-structure-metal-fixed-bonds', claim: 'Metal electrons are fixed in localized pairs.', correction: 'Valence electrons are delocalized across many centers.' },
    ],
    retrievalChecks: [
      { prompt: 'What does potential-well depth represent?', answer: 'The energy needed to separate the bonded particles in the idealized model.' },
      { prompt: 'What is true about forces at equilibrium bond length?', answer: 'Attraction and repulsion balance, so net force is zero.' },
      { prompt: 'What does an ionic formula represent?', answer: 'The simplest charge-neutral ratio in an extended lattice.' },
      { prompt: 'What structural feature supports metallic conductivity?', answer: 'Mobile delocalized valence electrons.' },
    ],
    formulaIds: ['compound-structure-electrostatic-potential'],
  }),
  lesson({
    id: 'compound-structure-lewis-resonance-and-geometry',
    title: 'Lewis structures, resonance, formal charge, and shape',
    summary: 'Build electron-count-consistent structures and connect delocalization with geometry and bond evidence.',
    alignment: alignment(
      ['lewis-diagrams', 'resonance-formal-charge', 'vsepr-hybridization'],
      ['2.5.A', '2.6.A', '2.7.A'], ['3.B', '6.C'],
    ),
    prerequisites: ['Valence-electron counting.', 'Single, double, and triple bonds.', 'Ionic charge and octet reasoning.'],
    sections: [
      { heading: 'Audit every Lewis diagram', body: 'Count total valence electrons including charge, choose a skeleton, place bonds and lone pairs, and verify the electron total. Formal charges must sum to the species charge and help compare plausible contributors.' },
      { heading: 'Use resonance to represent delocalization', body: 'Equivalent contributors differ only in electron placement. The actual structure is one hybrid, so equivalent bonds can have the same intermediate length and fractional average bond order rather than switching between distinct lengths.' },
      { heading: 'Count domains before naming shape', body: 'Each bonded direction counts as one domain even for a multiple bond, and each central lone pair counts as another. Electron geometry includes all domains; molecular geometry names only atom positions. The steric number supports an idealized hybridization label.' },
    ],
    workedExamples: [
      { prompt: 'A central atom has one double bond and two single bonds in three equivalent resonance positions.', steps: ['Count four total bond-order units.', 'Divide over three equivalent bonds.', 'Count three central electron domains.'], answer: 'Average bond order is 4/3; the central electron geometry is trigonal planar and is labeled sp2.' },
      { prompt: 'A central atom has three bonds and one lone pair.', steps: ['Count four domains.', 'Name tetrahedral electron geometry.', 'Omit the lone pair for molecular geometry.'], answer: 'Trigonal pyramidal molecular geometry with an sp3 central-atom label.' },
    ],
    misconceptions: [
      { id: 'compound-structure-lewis-electron-count', claim: 'Octets alone prove a Lewis diagram.', correction: 'The total valence-electron count and charge must also match.' },
      { id: 'compound-structure-resonance-switching', claim: 'Resonance structures alternate.', correction: 'They are contributors to one delocalized hybrid.' },
      { id: 'compound-structure-vsepr-lone-pairs-invisible', claim: 'Lone pairs do not count as domains.', correction: 'They affect electron geometry and molecular shape.' },
    ],
    retrievalChecks: [
      { prompt: 'What must formal charges sum to?', answer: 'The overall species charge.' },
      { prompt: 'What does resonance represent?', answer: 'One delocalized electron distribution described by multiple contributors.' },
      { prompt: 'How many domains is a double bond?', answer: 'One electron domain.' },
      { prompt: 'What is the difference between electron and molecular geometry?', answer: 'Electron geometry includes lone pairs; molecular geometry names atom positions.' },
    ],
    formulaIds: ['compound-structure-formal-charge-bond-order', 'compound-structure-electron-domains'],
  }),
  {
    id: 'compound-structure-carbonate-stimulus', kind: 'stimulus', schemaVersion: 1,
    title: 'Bond evidence for an original carbonate sample model',
    summary: 'A structure-evidence table for reasoning about Lewis contributors, equivalent bonds, and central geometry.',
    alignment: alignment(['lewis-diagrams', 'resonance-formal-charge', 'vsepr-hybridization'], ['2.5.A', '2.6.A', '2.7.A'], ['3.B', '6.C']),
    review: review(), provenance: provenance(),
    context: 'Diffraction measurements on a carbonate-containing crystal resolve the local CO3^2- group. The three carbon-oxygen distances are equal within experimental uncertainty.',
    representation: {
      type: 'table', caption: 'Local carbonate bond evidence',
      columns: ['Observation or model feature', 'Value'],
      rows: [
        ['Measured C-O distances', 'three equal distances of 129 pm'],
        ['One valid Lewis contributor', 'one C=O and two C-O single bonds'],
        ['Equivalent contributor count', 'three'],
        ['Central-carbon lone pairs', 'zero'],
      ],
      accessibleDescription: 'All three carbon-oxygen distances are equal at 129 picometers. Each valid Lewis contributor contains one carbon-oxygen double bond and two single bonds. There are three equivalent contributors and carbon has no lone pairs.',
    },
  },
  {
    id: 'compound-structure-bond-potential-stimulus', kind: 'stimulus', schemaVersion: 1,
    title: 'Comparing two bond potential-energy curves',
    summary: 'An original curve-summary data set for connecting equilibrium distance, well depth, force, and bond formation energy.',
    alignment: alignment(['intramolecular-force-potential-energy'], ['2.2.A'], ['3.A', '5.F']),
    review: review(), provenance: provenance(),
    context: 'Two hypothetical diatomic bonds, R and S, are modeled relative to separated atoms at 0 kJ/mol. The table records the coordinates of each potential-energy minimum. At distances much shorter than the listed equilibrium value, each curve rises steeply.',
    representation: {
      type: 'table', caption: 'Potential-energy minimum for each hypothetical bond',
      columns: ['Bond', 'Equilibrium distance (pm)', 'Potential energy at minimum (kJ/mol)'],
      rows: [
        ['R', '125', '-410'],
        ['S', '160', '-250'],
      ],
      accessibleDescription: 'Bond R has its potential-energy minimum at 125 picometers and negative 410 kilojoules per mole. Bond S has its minimum at 160 picometers and negative 250 kilojoules per mole. Separated atoms define zero energy, and both curves rise steeply below their equilibrium distances.',
    },
  },
  {
    id: 'compound-structure-potential-short-frq-rubric', kind: 'rubric', schemaVersion: 1,
    title: 'Draft rubric: comparing bond potential curves',
    summary: 'A four-point rubric for bond length, bond energy, net force, and compression.',
    alignment: alignment(['intramolecular-force-potential-energy'], ['2.2.A'], ['3.A']), review: review(), provenance: provenance(),
    questionId: 'ap-chem-compound-structure-properties-short-frq-001', maxPoints: 4,
    parts: [
      { id: 'part-a', prompt: 'Compare equilibrium distances.', points: [{ id: 'a-distance', criterion: 'Reads the horizontal minimum positions.', acceptableEvidence: 'Curve A has shorter equilibrium distance, 110 pm versus 145 pm.' }] },
      { id: 'part-b', prompt: 'Compare dissociation energies.', points: [{ id: 'b-energy', criterion: 'Uses well-depth magnitude.', acceptableEvidence: 'A requires 320 kJ/mol and B requires 180 kJ/mol, so A is stronger.' }] },
      { id: 'part-c', prompt: 'Interpret force at the minimum.', points: [{ id: 'c-force', criterion: 'States that attraction and repulsion balance.', acceptableEvidence: 'Net force is zero even though attractive and repulsive forces remain.' }] },
      { id: 'part-d', prompt: 'Explain compression.', points: [{ id: 'd-compression', criterion: 'Connects short distance to steep repulsive energy.', acceptableEvidence: 'Compressing below equilibrium sharply raises energy because short-range repulsion dominates.' }] },
    ],
  },
  {
    id: 'compound-structure-carbonate-long-frq-rubric', kind: 'rubric', schemaVersion: 1,
    title: 'Draft rubric: carbonate structure and bonding evidence',
    summary: 'A seven-point rubric for electron counting, Lewis structure, formal charge, resonance, bond order, geometry, and ionic-solid context.',
    alignment: alignment(
      ['lewis-diagrams', 'resonance-formal-charge', 'vsepr-hybridization', 'structure-ionic-solids'],
      ['2.5.A', '2.6.A', '2.7.A', '2.3.A'], ['3.B', '4.C', '6.C'],
    ),
    review: review(), provenance: provenance(), questionId: 'ap-chem-compound-structure-properties-long-frq-001', maxPoints: 7,
    parts: [
      { id: 'part-a', prompt: 'Count valence electrons.', points: [{ id: 'a-electrons', criterion: 'Includes the 2- charge.', acceptableEvidence: '4 + 3(6) + 2 = 24 valence electrons.' }] },
      { id: 'part-b', prompt: 'Describe a valid Lewis contributor.', points: [{ id: 'b-lewis', criterion: 'Gives one double and two single C-O bonds with appropriate lone pairs.', acceptableEvidence: 'Carbon has an octet and the diagram uses 24 electrons.' }] },
      { id: 'part-c', prompt: 'Assign formal charges.', points: [
        { id: 'c-carbon-double-oxygen', criterion: 'Assigns zero to carbon and double-bonded oxygen.', acceptableEvidence: 'FC(C) = 0 and FC(double-bonded O) = 0.' },
        { id: 'c-single-oxygen', criterion: 'Assigns -1 to each single-bonded oxygen.', acceptableEvidence: 'Two -1 oxygen charges sum to the 2- ion charge.' },
      ] },
      { id: 'part-d', prompt: 'Explain equal bonds.', points: [{ id: 'd-resonance', criterion: 'Uses three equivalent contributors and a resonance hybrid.', acceptableEvidence: 'The double-bond placement is delocalized, so all three measured bonds are equivalent.' }] },
      { id: 'part-e', prompt: 'Calculate average bond order.', points: [{ id: 'e-bond-order', criterion: 'Averages one double and two singles over three positions.', acceptableEvidence: '(2 + 1 + 1)/3 = 4/3.' }] },
      { id: 'part-f', prompt: 'State geometry and hybridization.', points: [{ id: 'f-geometry', criterion: 'Uses three domains and no central lone pairs.', acceptableEvidence: 'Trigonal planar molecular geometry with an sp2 central-carbon label.' }] },
    ],
  },
]

export const apChemistryCompoundStructurePropertiesResources = Object.freeze(
  assertValidEditorialCatalog(resources).map((resource) => Object.freeze(resource)),
)
