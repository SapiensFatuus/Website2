const baseTarget = Object.freeze({ examId: 'ap', subjectId: 'ap-chemistry', domainId: 'atomic-structure-properties' })

function pack(skillId, label, skillKeywords, explanation, alternativeMethod) {
  return Object.freeze({
    target: Object.freeze({ ...baseTarget, skillId }),
    label, reviewStatus: 'draft',
    materialNotice: 'These are original editorial AP Chemistry teaching materials. They summarize chemistry concepts without copying College Board questions, scoring guides, or reference-sheet layout.',
    relevanceRules: Object.freeze({
      skillKeywords,
      followUpPrefixes: ['why', 'how', 'what if', 'can you explain', 'i do not understand'],
      followUpTerms: ['that step', 'this step', 'the peak', 'the configuration', 'the ratio'],
    }),
    materials: Object.freeze([Object.freeze({
      id: `ap-chem-atomic-structure-properties-${skillId}-original-1`,
      label, keywords: skillKeywords, problem: `A student needs help with ${label.toLowerCase()}.`, explanation, alternativeMethod,
    })]),
  })
}

export const apChemistryAtomicStructurePropertiesContextPacks = Object.freeze([
  pack(
    'moles-molar-mass', 'Moles and molar mass',
    ['moles', 'molar mass', 'avogadro', 'particles', 'sample mass'],
    'Use moles as the bridge. Divide sample mass by molar mass, then multiply moles by Avogadro constant for representative particles. If atoms within a compound are requested, apply the formula subscript after finding molecule or formula-unit count.',
    'Write a unit-canceling chain from the given unit to moles and then to the requested unit.',
  ),
  pack(
    'mass-spectra-elements', 'Mass spectra of elements',
    ['mass spectrum', 'isotope', 'abundance', 'average atomic mass', 'mass to charge'],
    'For singly charged isotope ions, horizontal peak position identifies isotope mass and relative peak size identifies abundance. Calculate average mass as the sum of isotope mass times fractional abundance; the answer must lie between isotope masses.',
    'Make a mass, percent, fraction, and mass-times-fraction table before adding.',
  ),
  pack(
    'elemental-composition-pure-substances', 'Elemental composition of pure substances',
    ['empirical formula', 'percent composition', 'element mass', 'mole ratio'],
    'Convert each elemental mass or mass percent to moles with its atomic mass. Divide every amount by the smallest and scale only when needed to obtain simple whole-number subscripts. Check the result by recalculating mass percent.',
    'Use a four-column table: mass, molar mass, moles, reduced ratio.',
  ),
  pack(
    'composition-mixtures', 'Composition of mixtures',
    ['mixture composition', 'mass percent mixture', 'component fraction', 'mass balance'],
    'Track total component mass and analyte contribution separately. Each component contributes its mass times its analyte fraction. Add contributions or solve one total-mass balance; do not take an unweighted average of percentages.',
    'Build one row per component with component mass, analyte fraction, and analyte mass.',
  ),
  pack(
    'atomic-structure-electron-configuration', 'Atomic structure and electron configuration',
    ['electron configuration', 'orbital filling', 'pauli', 'hund', 'valence electrons'],
    'Find electron count from atomic number and charge, then fill orbitals in energy order while applying Pauli exclusion and Hund filling. Verify the total electron count and identify valence electrons from the highest relevant shell.',
    'Count electrons twice: once from the species charge and once by summing configuration superscripts.',
  ),
  pack(
    'photoelectron-spectroscopy', 'Photoelectron spectroscopy',
    ['photoelectron spectrum', 'pes', 'binding energy', 'peak intensity', 'subshell'],
    'PES peak position represents electron binding energy, while relative area or intensity represents the number of electrons in a subshell. Core electrons appear at greater binding energy than valence electrons.',
    'Annotate every peak twice: subshell electron count from area and attraction strength from position.',
  ),
  pack(
    'periodic-trends', 'Periodic trends',
    ['periodic trends', 'atomic radius', 'ionization energy', 'effective nuclear charge', 'shielding'],
    'Across a period, increasing effective nuclear charge within the same principal shell generally shrinks radius and raises ionization energy. Down a group, added shells increase distance and shielding. Use charge, shielding, and distance rather than a memorized arrow alone.',
    'State which structural variable changes and how it changes nucleus-electron attraction.',
  ),
  pack(
    'valence-electrons-ionic-compounds', 'Valence electrons and ionic compounds',
    ['valence electrons', 'ionic charge', 'ionic formula', 'charge neutrality'],
    'Main-group valence structure helps predict common ion charge. Write ion charges explicitly, then choose the smallest whole-number ratio whose total charge is zero. Formula subscripts reflect charge balance, not the number of valence electrons directly.',
    'Multiply each ion charge by its proposed subscript and require the sum to equal zero.',
  ),
])
