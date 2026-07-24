import { TAXONOMY_VERSION } from '../../taxonomy/contentTaxonomy.js'

const source = Object.freeze({ kind: 'ai-generated', name: 'Study AI Helper original AP Chemistry draft', externalId: null, license: null })
const content = Object.freeze({
  status: 'draft', version: 1, revision: 1, authoredBy: 'codex-ai-assisted-draft', updatedAt: '2026-07-24', reviewers: Object.freeze([]),
})
const refs = Object.freeze({
  'types-chemical-bonds': { formulaIds: ['compound-structure-electrostatic-potential'], priorKnowledge: ['electronegativity-and-electron-density'] },
  'intramolecular-force-potential-energy': { formulaIds: ['compound-structure-electrostatic-potential'], priorKnowledge: [] },
  'structure-ionic-solids': { formulaIds: ['compound-structure-electrostatic-potential'], priorKnowledge: ['charge-neutral-extended-lattice'] },
  'structure-metals-alloys': { formulaIds: [], priorKnowledge: ['delocalized-valence-electron-model'] },
  'lewis-diagrams': { formulaIds: ['compound-structure-formal-charge-bond-order'], priorKnowledge: ['valence-electron-counting'] },
  'resonance-formal-charge': { formulaIds: ['compound-structure-formal-charge-bond-order'], priorKnowledge: [] },
  'vsepr-hybridization': { formulaIds: ['compound-structure-electron-domains'], priorKnowledge: [] },
})
function referenceRequirements(skillId) {
  const value = refs[skillId]
  if (!value) throw new Error(`Missing Unit 2 reference requirements for ${skillId}`)
  return value
}
function taxonomy(skillId, learningObjectiveId, sciencePracticeIds, questionTypeId = 'multiple-choice') {
  return {
    version: TAXONOMY_VERSION, examId: 'ap', subjectId: 'ap-chemistry', domainId: 'compound-structure-properties',
    skillId, learningObjectiveIds: [learningObjectiveId], sciencePracticeIds, questionTypeId,
    answeringMethodId: questionTypeId === 'free-response' ? 'write-response' : 'select-option',
  }
}
function multipleChoice({ id, skillId, learningObjectiveId, sciencePracticeIds, prompt, options, correctOptionId, explanation, hints, misconceptionIds, difficulty = 'developing', stimulusId }) {
  return {
    id, taxonomy: taxonomy(skillId, learningObjectiveId, sciencePracticeIds), renderer: 'multiple-choice', prompt,
    answer: { kind: 'selected-response', options, correctOptionId }, explanation, hints, misconceptionIds,
    referenceRequirements: referenceRequirements(skillId), difficulty, ...(stimulusId ? { stimulusId } : {}),
    source: { ...source }, content: { ...content }, tags: ['ap-chemistry', 'compound-structure-properties'],
  }
}
function freeResponse({ id, skillId, learningObjectiveId, sciencePracticeIds, prompt, modelAnswer, explanation, hints, misconceptionIds, responseFormat, rubricId, parts }) {
  return {
    id, taxonomy: taxonomy(skillId, learningObjectiveId, sciencePracticeIds, 'free-response'), renderer: 'free-response', prompt,
    answer: { kind: 'free-response', grading: 'manual', modelAnswer }, explanation, hints, misconceptionIds,
    referenceRequirements: referenceRequirements(skillId), difficulty: 'exam-ready', responseFormat, rubricId, parts,
    source: { ...source }, content: { ...content }, tags: ['ap-chemistry', 'compound-structure-properties', responseFormat],
  }
}
const options = (...texts) => texts.map((text, index) => ({ id: String.fromCharCode(97 + index), text }))

export const apChemistryCompoundStructurePropertiesQuestions = Object.freeze([
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-001', skillId: 'types-chemical-bonds', learningObjectiveId: '2.1.A', sciencePracticeIds: ['6.A'],
    prompt: 'Which evidence most strongly supports describing a solid with an ionic rather than molecular-covalent model?',
    options: options('It forms a repeating array of cations and anions and conducts when molten but not as a solid.', 'It contains atoms joined in separate neutral units and has a low boiling point.', 'It is malleable and conducts in the solid state.', 'Its electrons are shared evenly in every bond.'),
    correctOptionId: 'a', explanation: 'An extended ion lattice has fixed ions in the solid but mobile ions when molten, matching the conductivity change.',
    hints: ['Use both particle structure and conductivity evidence.'], misconceptionIds: ['compound-structure-bond-type-binary'], difficulty: 'introductory',
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-002', skillId: 'intramolecular-force-potential-energy', learningObjectiveId: '2.2.A', sciencePracticeIds: ['3.A'],
    prompt: 'At the minimum of a two-atom potential-energy curve, which statement is correct?',
    options: options('Attractive and repulsive forces balance, so the net force is zero.', 'Both attractive and repulsive forces are absent.', 'The atoms have zero potential energy by definition.', 'The atoms are infinitely separated.'),
    correctOptionId: 'a', explanation: 'The slope of potential energy is zero at equilibrium, corresponding to balanced nonzero attractive and repulsive contributions.',
    hints: ['Zero net force does not require every force to be zero.'], misconceptionIds: ['compound-structure-minimum-zero-force'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-003', skillId: 'structure-ionic-solids', learningObjectiveId: '2.3.A', sciencePracticeIds: ['4.C'],
    prompt: 'What does the formula CaF2 represent in a crystalline sample?',
    options: options('The simplest ratio of Ca2+ to F- ions in an extended charge-neutral lattice', 'A discrete molecule containing one calcium atom and two fluorine atoms', 'Two covalent Ca-F bonds isolated from neighboring ions', 'A metallic alloy with two mobile fluorine electrons'),
    correctOptionId: 'a', explanation: 'Ionic formulas describe the smallest charge-neutral ratio in an extended lattice rather than separate molecules.',
    hints: ['Think about repeating ionic coordination.'], misconceptionIds: ['compound-structure-ionic-molecules'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-004', skillId: 'structure-metals-alloys', learningObjectiveId: '2.4.A', sciencePracticeIds: ['4.C'],
    prompt: 'Which metallic-structure feature best explains electrical conductivity and malleability?',
    options: options('Delocalized valence electrons and nondirectional attraction among metal centers', 'Fixed ions that cannot move and localized electron pairs between only two atoms', 'Separate neutral molecules held only by dispersion forces', 'Alternating cations and anions with no mobile charge in any phase'),
    correctOptionId: 'a', explanation: 'Delocalized electrons carry charge, and nondirectional metallic attraction lets layers shift without breaking a fixed set of localized bonds.',
    hints: ['Connect one structural feature to each property.'], misconceptionIds: ['compound-structure-metal-fixed-bonds'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-005', skillId: 'lewis-diagrams', learningObjectiveId: '2.5.A', sciencePracticeIds: ['3.B'],
    prompt: 'What is the first electron-accounting step when drawing a Lewis structure for NO3-?',
    options: options('Count 5 + 3(6) + 1 = 24 valence electrons.', 'Assume every atom has zero formal charge.', 'Place three N=O double bonds before counting electrons.', 'Use 23 electrons because the ion charge is negative.'),
    correctOptionId: 'a', explanation: 'Nitrogen contributes 5, three oxygens contribute 18, and the 1- charge adds one electron for 24 total.',
    hints: ['A negative charge adds electrons to the neutral-atom total.'], misconceptionIds: ['compound-structure-lewis-electron-count'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-006', skillId: 'resonance-formal-charge', learningObjectiveId: '2.6.A', sciencePracticeIds: ['6.C'],
    prompt: 'Three equivalent bonds are represented by contributors containing one double bond and two single bonds. What is the average bond order for each equivalent bond?',
    options: options('4/3', '1', '3/2', '2'), correctOptionId: 'a',
    explanation: 'The total bond-order contribution 2 + 1 + 1 = 4 is delocalized across three equivalent positions, giving 4/3.',
    hints: ['Average bond-order units across equivalent positions.'], misconceptionIds: ['compound-structure-resonance-switching'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-007', skillId: 'vsepr-hybridization', learningObjectiveId: '2.7.A', sciencePracticeIds: ['6.C'],
    prompt: 'A central atom has three sigma-bonding domains and one lone-pair domain. Which description is correct?',
    options: options('Tetrahedral electron geometry, trigonal pyramidal molecular geometry, sp3 label', 'Trigonal planar electron and molecular geometry, sp2 label', 'Tetrahedral molecular geometry, sp3 label', 'Linear molecular geometry, sp label'),
    correctOptionId: 'a', explanation: 'Four total domains give tetrahedral electron geometry and sp3. With one lone pair, the atom positions are trigonal pyramidal.',
    hints: ['Count the lone pair as an electron domain, then omit it from the molecular-geometry name.'], misconceptionIds: ['compound-structure-vsepr-lone-pairs-invisible'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-008', skillId: 'types-chemical-bonds', learningObjectiveId: '2.1.A', sciencePracticeIds: ['6.A'],
    prompt: 'A pure substance is a brittle crystalline solid with a high melting point. It does not conduct as a solid but does conduct after melting. Which particle-level model best fits the evidence?',
    options: options('An extended lattice of oppositely charged ions', 'Separate nonpolar molecules with weak attractions', 'Metal centers surrounded by mobile delocalized electrons', 'A network containing only identical atoms joined by nonpolar bonds'),
    correctOptionId: 'a', explanation: 'The conductivity change indicates ions fixed in a solid lattice that become mobile in the liquid. The high melting point and brittleness are also consistent with an ionic lattice.',
    hints: ['Ask which charged particles can become mobile without changing the substance.'], misconceptionIds: ['compound-structure-bond-type-binary'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-009', skillId: 'intramolecular-force-potential-energy', learningObjectiveId: '2.2.A', sciencePracticeIds: ['3.A'],
    prompt: 'Potential-energy curves for bonds X and Y approach 0 kJ/mol at large separation. Their minima are -410 kJ/mol and -260 kJ/mol, respectively. What conclusion follows?',
    options: options('More energy is required to dissociate bond X than bond Y.', 'Bond Y must have the shorter equilibrium distance.', 'The net force at the minimum of X is attractive.', 'Bond X has no repulsive interaction at its minimum.'),
    correctOptionId: 'a', explanation: 'Dissociation from the minimum to separated atoms requires 410 kJ/mol for X and 260 kJ/mol for Y. Minimum depth alone does not determine which equilibrium distance is shorter.',
    hints: ['Dissociation energy is the vertical rise from the well minimum to the separated-atom reference.'], misconceptionIds: ['compound-structure-minimum-zero-force'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-010', skillId: 'structure-ionic-solids', learningObjectiveId: '2.3.A', sciencePracticeIds: ['4.C'],
    prompt: 'Assume comparable ion separations. Which ionic solid should have the larger-magnitude electrostatic attraction between neighboring ions?',
    options: options('MgO, because neighboring ions have charges of +2 and -2', 'NaF, because neighboring ions have charges of +1 and -1', 'Both, because every ionic formula is neutral', 'Neither, because ions in a solid do not attract'),
    correctOptionId: 'a', explanation: 'At comparable separation, electrostatic interaction magnitude grows with |q1q2|. The charge product magnitude is 4 for MgO and 1 for NaF.',
    hints: ['Compare the magnitude of the product of neighboring ionic charges.'], misconceptionIds: ['compound-structure-ionic-molecules'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-011', skillId: 'structure-metals-alloys', learningObjectiveId: '2.4.A', sciencePracticeIds: ['4.C'],
    prompt: 'Small carbon atoms occupy spaces between iron atoms in a solid while the metal lattice remains continuous. Which model describes the material?',
    options: options('An interstitial alloy', 'A substitutional alloy', 'An ionic crystal', 'A molecular solid'),
    correctOptionId: 'a', explanation: 'Atoms much smaller than the host metal can occupy holes between host atoms, producing an interstitial alloy rather than replacing host atoms.',
    hints: ['Distinguish occupying a gap from replacing a host atom.'], misconceptionIds: ['compound-structure-metal-fixed-bonds'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-012', skillId: 'lewis-diagrams', learningObjectiveId: '2.5.A', sciencePracticeIds: ['3.B'],
    prompt: 'How many valence electrons must be placed in any valid Lewis representation of neutral SO2?',
    options: options('18', '16', '20', '24'), correctOptionId: 'a',
    explanation: 'Sulfur contributes 6 valence electrons and the two oxygen atoms contribute 12, for 18 total.',
    hints: ['Add the neutral-atom valence counts; there is no ionic charge to adjust.'], misconceptionIds: ['compound-structure-lewis-electron-count'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-013', skillId: 'resonance-formal-charge', learningObjectiveId: '2.6.A', sciencePracticeIds: ['6.C'],
    prompt: 'A species has two equivalent bonds represented by two equivalent contributors, each with one single bond and one double bond. What bond order is predicted for each measured bond?',
    options: options('1.5', '1', '2', '2.5'), correctOptionId: 'a',
    explanation: 'The total bond order of 3 is delocalized equally over two equivalent positions, so each bond has average order 3/2.',
    hints: ['Average the total bond-order contribution across equivalent positions.'], misconceptionIds: ['compound-structure-resonance-switching'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-014', skillId: 'vsepr-hybridization', learningObjectiveId: '2.7.A', sciencePracticeIds: ['6.C'],
    prompt: 'A central atom has four sigma bonds and one lone pair. Which molecular geometry follows from five electron domains?',
    options: options('Seesaw', 'Tetrahedral', 'Trigonal planar', 'Square planar'), correctOptionId: 'a',
    explanation: 'Five electron domains have trigonal-bipyramidal electron geometry. With one lone pair and four bonded atoms, the molecular geometry is seesaw.',
    hints: ['Name the electron geometry from all five domains, then omit the lone pair when naming molecular geometry.'], misconceptionIds: ['compound-structure-vsepr-lone-pairs-invisible'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-015', skillId: 'types-chemical-bonds', learningObjectiveId: '2.1.A', sciencePracticeIds: ['6.A'],
    prompt: 'Which description best represents the electron distribution in a polar covalent C-F bond?',
    options: options('The bonding electrons are shared but spend more time near F.', 'One electron is transferred completely from C to F in every molecule.', 'The bonding electrons are shared equally because both atoms are nonmetals.', 'The bond contains mobile electrons delocalized throughout a metal lattice.'),
    correctOptionId: 'a', explanation: 'Both atoms participate in a shared bonding pair, but fluorine attracts the electron density more strongly. Polar covalent bonding therefore lies between equal sharing and complete ionic transfer.',
    hints: ['Use a continuum of electron sharing rather than a strict bond-type switch.'], misconceptionIds: ['compound-structure-bond-type-binary'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-016', skillId: 'intramolecular-force-potential-energy', learningObjectiveId: '2.2.A', sciencePracticeIds: ['3.A'],
    prompt: 'Compared with bond X, bond Y has a deeper potential-energy minimum at a shorter internuclear distance. Which inference is best supported?',
    options: options('Bond Y is stronger and has a shorter equilibrium bond length.', 'Bond Y is weaker because its potential energy is more negative.', 'Bond X and bond Y must have equal bond energies because both curves have minima.', 'Bond Y has no repulsive interaction at its equilibrium distance.'),
    correctOptionId: 'a', explanation: 'A deeper well requires more energy to separate the atoms, indicating a stronger bond. The horizontal position of the minimum gives the equilibrium bond length, which is shorter for Y.',
    hints: ['Interpret well depth and minimum position as different quantities.'], misconceptionIds: ['compound-structure-minimum-zero-force'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-017', skillId: 'structure-ionic-solids', learningObjectiveId: '2.3.A', sciencePracticeIds: ['4.C'],
    prompt: 'Why does MgO generally have a larger lattice-energy magnitude than NaCl when the ion separations are comparable?',
    options: options('Mg2+ and O2- have a larger charge product than Na+ and Cl-.', 'MgO consists of discrete molecules with stronger covalent bonds.', 'NaCl contains no electrostatic attractions in the solid state.', 'MgO has fewer ions, so each ion has more kinetic energy.'),
    correctOptionId: 'a', explanation: 'Electrostatic attraction grows with the magnitude of the charge product. The product |(+2)(-2)| is greater than |(+1)(-1)|, strengthening the MgO lattice when distance is comparable.',
    hints: ['Compare both ionic charges before considering separation.'], misconceptionIds: ['compound-structure-ionic-molecules'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-018', skillId: 'structure-metals-alloys', learningObjectiveId: '2.4.A', sciencePracticeIds: ['4.C'],
    prompt: 'A metal atom of similar radius replaces some host-metal atoms at regular lattice positions. Which material model best describes the resulting solid?',
    options: options('A substitutional alloy with delocalized electrons across the metal lattice', 'An interstitial alloy with the added atoms only in lattice holes', 'An ionic solid made of alternating cations and anions', 'A molecular solid made of separate metal-containing molecules'),
    correctOptionId: 'a', explanation: 'Atoms of comparable size can replace host atoms to form a substitutional alloy. Metallic bonding remains extended and nondirectional, with valence electrons delocalized across many metal centers.',
    hints: ['Replacement of a host site differs from occupation of a lattice gap.'], misconceptionIds: ['compound-structure-metal-fixed-bonds'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-019', skillId: 'lewis-diagrams', learningObjectiveId: '2.5.A', sciencePracticeIds: ['3.B'],
    prompt: 'How many valence electrons must be included in a Lewis representation of SF4?',
    options: options('34', '32', '36', '40'), correctOptionId: 'a',
    explanation: 'Sulfur contributes 6 valence electrons and four fluorine atoms contribute 4(7) = 28, for 34 total electrons.',
    hints: ['Sum the valence contribution from every atom before drawing bonds.'], misconceptionIds: ['compound-structure-lewis-electron-count'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-mcq-020', skillId: 'vsepr-hybridization', learningObjectiveId: '2.7.A', sciencePracticeIds: ['6.C'],
    prompt: 'What are the electron-domain geometry and molecular geometry around N in NH3?',
    options: options('Tetrahedral electron-domain geometry and trigonal-pyramidal molecular geometry', 'Trigonal-planar electron-domain geometry and trigonal-planar molecular geometry', 'Tetrahedral electron-domain geometry and tetrahedral molecular geometry', 'Linear electron-domain geometry and bent molecular geometry'),
    correctOptionId: 'a', explanation: 'Three N-H bonds and one lone pair make four electron domains, giving tetrahedral electron-domain geometry. Omitting the lone pair when naming atom positions gives trigonal-pyramidal molecular geometry.',
    hints: ['Count the lone pair as a domain, then exclude it from the molecular-geometry name.'], misconceptionIds: ['compound-structure-vsepr-lone-pairs-invisible'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-stimulus-mcq-001', stimulusId: 'compound-structure-carbonate-stimulus',
    skillId: 'lewis-diagrams', learningObjectiveId: '2.5.A', sciencePracticeIds: ['3.B'],
    prompt: 'How many total valence electrons must a Lewis structure for CO3^2- contain?',
    options: options('24', '22', '18', '26'), correctOptionId: 'a',
    explanation: 'Carbon contributes 4, three oxygens contribute 18, and the 2- charge adds 2: total 24.',
    hints: ['Include electrons associated with the negative charge.'], misconceptionIds: ['compound-structure-lewis-electron-count'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-stimulus-mcq-002', stimulusId: 'compound-structure-carbonate-stimulus',
    skillId: 'resonance-formal-charge', learningObjectiveId: '2.6.A', sciencePracticeIds: ['6.C'],
    prompt: 'Why are the three measured C-O distances equal?',
    options: options('The pi bonding is delocalized over three equivalent resonance positions.', 'The ion switches slowly among three molecules during measurement.', 'All three bonds are localized double bonds in one contributor.', 'Carbon has three lone pairs that equalize the distances.'),
    correctOptionId: 'a', explanation: 'Equivalent contributors describe one resonance hybrid with delocalized pi bonding and three equivalent C-O bonds.',
    hints: ['Treat resonance drawings as contributors to one structure.'], misconceptionIds: ['compound-structure-resonance-switching'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-stimulus-mcq-003', stimulusId: 'compound-structure-carbonate-stimulus',
    skillId: 'resonance-formal-charge', learningObjectiveId: '2.6.A', sciencePracticeIds: ['6.C'],
    prompt: 'In one valid contributor, what are the formal charges on the double-bonded oxygen and each single-bonded oxygen?',
    options: options('0 on the double-bonded O and -1 on each single-bonded O', '-1 on every oxygen', '+1 on the double-bonded O and 0 on the others', '0 on every oxygen'),
    correctOptionId: 'a', explanation: 'The double-bonded oxygen has formal charge 0; each single-bonded oxygen has -1, giving the ion total -2.',
    hints: ['Formal charges must sum to -2.'], misconceptionIds: ['compound-structure-lewis-electron-count'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-stimulus-mcq-004', stimulusId: 'compound-structure-carbonate-stimulus',
    skillId: 'vsepr-hybridization', learningObjectiveId: '2.7.A', sciencePracticeIds: ['6.C'],
    prompt: 'What are the central-carbon molecular geometry and hybridization label in CO3^2-?',
    options: options('Trigonal planar and sp2', 'Trigonal pyramidal and sp3', 'Tetrahedral and sp3', 'Linear and sp'),
    correctOptionId: 'a', explanation: 'Carbon has three bonding domains and no lone pairs, so the geometry is trigonal planar with the common sp2 label.',
    hints: ['Each C-O bond direction counts as one domain even when drawn double in a contributor.'], misconceptionIds: ['compound-structure-vsepr-lone-pairs-invisible'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-potential-stimulus-mcq-001', stimulusId: 'compound-structure-bond-potential-stimulus',
    skillId: 'intramolecular-force-potential-energy', learningObjectiveId: '2.2.A', sciencePracticeIds: ['3.A'],
    prompt: 'Which comparison is supported by the potential-energy minima?',
    options: options('Bond R is shorter and stronger than bond S.', 'Bond R is longer and weaker than bond S.', 'Bond S is shorter but stronger than bond R.', 'The two bonds have identical length and strength because both minima are negative.'),
    correctOptionId: 'a', explanation: 'Minimum position gives equilibrium distance, so R is shorter at 125 pm versus 160 pm. Well-depth magnitude gives dissociation energy, so R is stronger at 410 kJ/mol versus 250 kJ/mol.',
    hints: ['Read the horizontal and vertical minimum coordinates separately.'], misconceptionIds: ['compound-structure-minimum-zero-force'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-potential-stimulus-mcq-002', stimulusId: 'compound-structure-bond-potential-stimulus',
    skillId: 'intramolecular-force-potential-energy', learningObjectiveId: '2.2.A', sciencePracticeIds: ['5.F'],
    prompt: 'How much energy is required to dissociate 0.150 mol of bond R into separated atoms?',
    options: options('61.5 kJ', '27.3 kJ', '410 kJ', '2,730 kJ'),
    correctOptionId: 'a', explanation: 'The R well depth is 410 kJ/mol relative to separated atoms. Dissociating 0.150 mol requires (0.150 mol)(410 kJ/mol) = 61.5 kJ.',
    hints: ['Use the magnitude of the minimum-to-zero energy difference.'], misconceptionIds: ['compound-structure-minimum-zero-force'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-potential-stimulus-mcq-003', stimulusId: 'compound-structure-bond-potential-stimulus',
    skillId: 'intramolecular-force-potential-energy', learningObjectiveId: '2.2.A', sciencePracticeIds: ['3.A'],
    prompt: 'What is true about the two atoms in bond R at 125 pm?',
    options: options('Attractive and repulsive forces balance, so the net force is zero.', 'No attractive or repulsive forces act at that distance.', 'Only attraction acts because the potential energy is negative.', 'Only repulsion acts because the atoms are close together.'),
    correctOptionId: 'a', explanation: 'The potential-energy minimum has zero slope, corresponding to zero net force. The individual attractive and repulsive interactions remain present but balance.',
    hints: ['Zero net force is not the same as absence of individual forces.'], misconceptionIds: ['compound-structure-minimum-zero-force'],
  }),
  multipleChoice({
    id: 'ap-chem-compound-structure-properties-potential-stimulus-mcq-004', stimulusId: 'compound-structure-bond-potential-stimulus',
    skillId: 'intramolecular-force-potential-energy', learningObjectiveId: '2.2.A', sciencePracticeIds: ['3.A'],
    prompt: 'If the atoms forming bond S move from very large separation to the 160 pm equilibrium distance, what approximate energy change occurs per mole of bonds formed?',
    options: options('-250 kJ/mol', '+250 kJ/mol', '-410 kJ/mol', '0 kJ/mol'),
    correctOptionId: 'a', explanation: 'The reference energy for separated atoms is 0 kJ/mol, and the S minimum is -250 kJ/mol. Moving to the bound state releases about 250 kJ/mol, so the system energy change is -250 kJ/mol.',
    hints: ['Calculate final potential energy minus initial potential energy.'], misconceptionIds: ['compound-structure-minimum-zero-force'],
  }),
  freeResponse({
    id: 'ap-chem-compound-structure-properties-short-frq-001', skillId: 'intramolecular-force-potential-energy', learningObjectiveId: '2.2.A', sciencePracticeIds: ['3.A'],
    responseFormat: 'short-frq', rubricId: 'compound-structure-potential-short-frq-rubric',
    prompt: 'Two idealized diatomic potential curves use separated atoms as 0 kJ/mol. Curve A has its minimum at 110 pm and -320 kJ/mol. Curve B has its minimum at 145 pm and -180 kJ/mol. (a) Compare equilibrium bond lengths. (b) Compare dissociation energies and bond strengths. (c) Explain the net force at each minimum. (d) Explain why energy rises steeply if either pair is compressed well below equilibrium distance.',
    modelAnswer: '(a) A has the shorter equilibrium length: 110 pm versus 145 pm. (b) A requires 320 kJ/mol to dissociate, compared with 180 kJ/mol for B, so A is stronger. (c) At each minimum, attractive and repulsive forces balance and net force is zero; the individual interactions are not absent. (d) At very short separation, electron-cloud and nucleus-related repulsive contributions dominate, sharply increasing potential energy.',
    explanation: 'Minimum position gives equilibrium length, well depth gives dissociation energy, slope relates to net force, and the steep short-range wall represents repulsion.',
    hints: ['Read horizontal and vertical coordinates separately.', 'Measure energy from the minimum to zero.', 'Zero net force means balanced forces.'],
    misconceptionIds: ['compound-structure-minimum-zero-force'],
    parts: [
      { id: 'part-a', label: 'a', prompt: 'Compare equilibrium distances.' },
      { id: 'part-b', label: 'b', prompt: 'Compare dissociation energies and strengths.' },
      { id: 'part-c', label: 'c', prompt: 'Interpret force at each minimum.' },
      { id: 'part-d', label: 'd', prompt: 'Explain the short-range energy increase.' },
    ],
  }),
  freeResponse({
    id: 'ap-chem-compound-structure-properties-long-frq-001', skillId: 'lewis-diagrams', learningObjectiveId: '2.5.A', sciencePracticeIds: ['3.B', '4.C', '6.C'],
    responseFormat: 'long-frq', rubricId: 'compound-structure-carbonate-long-frq-rubric',
    prompt: 'Diffraction shows three equal 129 pm C-O distances in a carbonate group, CO3^2-. (a) Calculate the total valence electrons. (b) Describe one valid Lewis contributor including bonds and lone pairs. (c) Calculate formal charges on carbon, the double-bonded oxygen, and the two single-bonded oxygens. (d) Explain why all measured bonds are equal even though one contributor has different bond types. (e) Calculate the average C-O bond order. (f) State the central-carbon molecular geometry and hybridization label.',
    modelAnswer: '(a) 4 + 3(6) + 2 = 24 electrons. (b) One contributor has central C with one C=O and two C-O single bonds; the double-bonded O has two lone pairs and each single-bonded O has three, giving carbon an octet and using 24 electrons. (c) Carbon and the double-bonded oxygen each have formal charge 0; each single-bonded oxygen is -1, summing to -2. (d) Three equivalent contributors differ only in double-bond placement, describing one delocalized resonance hybrid with equivalent bonds. (e) Average bond order = (2 + 1 + 1)/3 = 4/3. (f) Carbon has three domains and no lone pairs, so it is trigonal planar with an sp2 label.',
    explanation: 'Electron counting, formal-charge accounting, equivalent resonance contributors, observed bond equality, and VSEPR all support one consistent structural model.',
    hints: ['The 2- charge adds two electrons.', 'Formal charges must sum to -2.', 'Average bond-order contribution over three positions.', 'Count domains around carbon.'],
    misconceptionIds: ['compound-structure-lewis-electron-count', 'compound-structure-resonance-switching', 'compound-structure-vsepr-lone-pairs-invisible'],
    parts: [
      { id: 'part-a', label: 'a', prompt: 'Count valence electrons.' },
      { id: 'part-b', label: 'b', prompt: 'Describe one valid Lewis contributor.' },
      { id: 'part-c', label: 'c', prompt: 'Assign formal charges.' },
      { id: 'part-d', label: 'd', prompt: 'Explain equivalent measured bonds.' },
      { id: 'part-e', label: 'e', prompt: 'Calculate average bond order.' },
      { id: 'part-f', label: 'f', prompt: 'State geometry and hybridization.' },
    ],
  }),
])
