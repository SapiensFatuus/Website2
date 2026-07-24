const baseTarget = Object.freeze({ examId: 'ap', subjectId: 'ap-chemistry', domainId: 'compound-structure-properties' })

function pack(skillId, label, skillKeywords, explanation, alternativeMethod) {
  return Object.freeze({
    target: Object.freeze({ ...baseTarget, skillId }),
    label, reviewStatus: 'draft',
    materialNotice: 'These are original editorial AP Chemistry teaching materials. They summarize chemistry concepts without copying College Board questions, scoring guides, or reference-sheet layout.',
    relevanceRules: Object.freeze({
      skillKeywords,
      followUpPrefixes: ['why', 'how', 'what if', 'can you explain', 'i do not understand'],
      followUpTerms: ['that step', 'this step', 'the structure', 'the bond', 'the shape'],
    }),
    materials: Object.freeze([Object.freeze({
      id: `ap-chem-compound-structure-properties-${skillId}-original-1`,
      label, keywords: skillKeywords, problem: `A student needs help with ${label.toLowerCase()}.`, explanation, alternativeMethod,
    })]),
  })
}

export const apChemistryCompoundStructurePropertiesContextPacks = Object.freeze([
  pack(
    'types-chemical-bonds', 'Types of chemical bonds',
    ['bond type', 'ionic bond', 'covalent bond', 'metallic bond', 'electronegativity'],
    'Choose a bonding model from electron-density and bulk-structure evidence. Sharing can be nearly even or polar, electron transfer supports an ion lattice, and delocalization supports a metal. Bonding is a continuum, so avoid relying on one rigid electronegativity cutoff.',
    'List electron distribution, particle organization, conductivity, and mechanical evidence before naming the model.',
  ),
  pack(
    'intramolecular-force-potential-energy', 'Intramolecular force and potential energy',
    ['potential energy curve', 'bond length', 'bond energy', 'equilibrium distance', 'net force'],
    'The horizontal coordinate of the potential minimum gives equilibrium separation and the well depth gives idealized dissociation energy. At the minimum, attraction and repulsion balance to zero net force. Compression below equilibrium makes repulsion dominate.',
    'Read x-position, y-depth, slope, and short-range wall as four separate features.',
  ),
  pack(
    'structure-ionic-solids', 'Structure of ionic solids',
    ['ionic solid', 'ionic lattice', 'formula unit', 'brittle', 'molten conductivity'],
    'An ionic solid is an extended lattice of cations and anions; its formula is the simplest neutral ratio, not a molecule. Fixed ions prevent solid-state ionic conduction, while molten or dissolved ions can move. Lattice shifts can align like charges and promote fracture.',
    'Translate the formula into a repeating charge-balanced particle array rather than a discrete unit.',
  ),
  pack(
    'structure-metals-alloys', 'Structure of metals and alloys',
    ['metallic bonding', 'alloy', 'delocalized electrons', 'malleable', 'conductivity'],
    'Metal centers share delocalized valence electrons across an extended structure. Mobile electrons support conductivity and nondirectional attraction allows layers to shift. Substitutional or interstitial alloy atoms disrupt regular packing and can change strength.',
    'Connect each property to either electron mobility or the ease of layer motion.',
  ),
  pack(
    'lewis-diagrams', 'Lewis diagrams',
    ['lewis structure', 'valence electrons', 'octet', 'lone pair', 'multiple bond'],
    'Count total valence electrons including charge, choose a skeleton, add bonds and lone pairs, and audit the total. Then check octets or recognized exceptions and ensure formal charges sum to the species charge.',
    'Keep a running electron budget and subtract every placed bond or lone pair.',
  ),
  pack(
    'resonance-formal-charge', 'Resonance and formal charge',
    ['resonance', 'formal charge', 'delocalization', 'bond order', 'equivalent bonds'],
    'Formal charge equals valence minus nonbonding electrons minus half the bonding electrons. Equivalent resonance drawings are contributors to one delocalized hybrid, not alternating molecules. Average equivalent-bond order follows total bond-order contribution divided across positions.',
    'Calculate formal charge atom by atom, verify the total charge, then compare contributors with measured bond evidence.',
  ),
  pack(
    'vsepr-hybridization', 'VSEPR and hybridization',
    ['vsepr', 'molecular geometry', 'electron geometry', 'hybridization', 'lone pair'],
    'Count every bonded direction as one electron domain and every central lone pair as one domain. Electron geometry includes all domains; molecular geometry names atom positions only. Steric numbers 2, 3, and 4 map to linear/sp, trigonal planar/sp2, and tetrahedral/sp3 idealized frameworks.',
    'Count domains first, name electron geometry second, remove lone-pair positions for molecular geometry third.',
  ),
])
