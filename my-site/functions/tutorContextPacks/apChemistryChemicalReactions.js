const baseTarget = Object.freeze({ examId: 'ap', subjectId: 'ap-chemistry', domainId: 'chemical-reactions' })

function pack(skillId, label, skillKeywords, material) {
  return Object.freeze({
    target: Object.freeze({ ...baseTarget, skillId }),
    label,
    reviewStatus: 'draft',
    materialNotice: 'These are original editorial AP Chemistry teaching materials. They summarize chemistry concepts without copying College Board questions, scoring guides, or reference-sheet layout.',
    relevanceRules: Object.freeze({
      skillKeywords,
      followUpPrefixes: ['why', 'how', 'what if', 'can you explain', 'i do not understand'],
      followUpTerms: ['that step', 'this step', 'the equation', 'the particle model', 'the calculation'],
    }),
    materials: Object.freeze([Object.freeze(material)]),
  })
}

export const apChemistryChemicalReactionsContextPacks = Object.freeze([
  pack('introduction-reactions', 'Introduction to reactions', ['reaction evidence', 'chemical change', 'observation'], {
    id: 'ap-chem-chemical-reactions-evidence-original-1',
    label: 'Connect observations to a particle-level claim',
    keywords: ['reaction evidence', 'color change', 'gas formation', 'precipitate', 'temperature change'],
    problem: 'A student must decide what an observation supports without treating it as automatic proof of a particular reaction.',
    explanation: 'Separate the observation from the explanation. State what was measured, propose which particles could have changed, and check whether atom count, charge, and phase are consistent. A color change, gas, solid, or temperature change can support a chemical-change claim, but competing physical explanations and additional evidence still matter.',
    alternativeMethod: 'Use a claim-evidence-reasoning table with one row for the observation, one for the proposed particle change, and one for an alternative explanation.',
  }),
  pack('net-ionic-equations', 'Net ionic equations', ['net ionic', 'spectator ion', 'complete ionic'], {
    id: 'ap-chem-chemical-reactions-net-ionic-original-1',
    label: 'Cancel only chemically unchanged aqueous ions',
    keywords: ['net ionic equation', 'spectator ion', 'aqueous electrolyte', 'precipitation', 'cancel ions'],
    problem: 'A student needs to move from a molecular equation to the particles that actually react.',
    explanation: 'Balance valid formulas first. Separate strong soluble aqueous electrolytes into ions, while retaining solids, liquids, gases, and weak molecular species. Cancel only identical aqueous ions with the same charge and phase on both sides. Verify that the net equation conserves every element and total charge.',
    alternativeMethod: 'Circle every species whose identity or phase changes; the circled species should remain after spectators cancel.',
  }),
  pack('representations-reactions', 'Representations of reactions', ['particle diagram reaction', 'conservation', 'before after particles'], {
    id: 'ap-chem-chemical-reactions-representations-original-1',
    label: 'Conserve atoms and charge across representations',
    keywords: ['particle diagram', 'reaction representation', 'limiting reactant', 'atom count', 'charge conservation'],
    problem: 'A student interprets or constructs a before-and-after reaction diagram.',
    explanation: 'Translate each drawn cluster into a chemical species, then count each element and total charge. Coefficients control how many particles react as a set. Total particle count may change when particles combine or split, but atoms and charge cannot disappear. Any unreacted particles must match the limiting-reactant calculation.',
    alternativeMethod: 'Make an inventory table with rows for every element, net charge, and each leftover species.',
  }),
  pack('physical-chemical-changes', 'Physical and chemical changes', ['physical change', 'chemical change', 'phase change'], {
    id: 'ap-chem-chemical-reactions-changes-original-1',
    label: 'Use particle identity to classify a change',
    keywords: ['physical change', 'chemical change', 'phase change', 'bond rearrangement', 'particle identity'],
    problem: 'A student must distinguish a phase or mixing process from a chemical reaction.',
    explanation: 'A physical change alters spacing, motion, shape, or distribution while preserving chemical particle identity. A chemical change produces different species through atom or electron rearrangement. Compare formulas and bonding before and after; do not classify from appearance alone.',
    alternativeMethod: 'Ask whether an intact representative particle before the process is still the same chemical particle afterward.',
  }),
  pack('stoichiometry', 'Stoichiometry', ['stoichiometry', 'limiting reactant', 'mole ratio', 'yield'], {
    id: 'ap-chem-chemical-reactions-stoichiometry-original-1',
    label: 'Let coefficients control reaction amount',
    keywords: ['stoichiometry', 'mole ratio', 'limiting reactant', 'theoretical yield', 'excess reactant'],
    problem: 'A student converts among reactant and product amounts or determines which reactant limits.',
    explanation: 'Balance the equation without changing subscripts. Convert each available reactant to a common reaction extent or common product amount using coefficient ratios. The smaller supported extent limits the reaction. Use that extent for product and subtract the consumed amount from any excess reactant.',
    alternativeMethod: 'Divide each reactant amount by its coefficient; the smallest compatible value identifies the reaction extent before scaling products.',
  }),
  pack('introduction-titration', 'Introduction to titration', ['titration', 'equivalence', 'buret', 'endpoint'], {
    id: 'ap-chem-chemical-reactions-titration-original-1',
    label: 'Treat equivalence as a stoichiometric condition',
    keywords: ['titration', 'equivalence point', 'endpoint', 'titre', 'unknown concentration', 'buret'],
    problem: 'A student uses titration volumes to find an unknown amount or concentration.',
    explanation: 'Select concordant endpoint trials, calculate delivered titrant amount with n = cV, and apply the balanced-equation ratio at equivalence. Equal volumes are not generally required. Report units and significant figures, and explain whether analyte or titrant is in excess before or after equivalence.',
    alternativeMethod: 'Write the chain volume to titrant moles to analyte moles to analyte concentration, placing the balanced coefficient ratio between the two amount steps.',
  }),
  pack('types-chemical-reactions', 'Types of chemical reactions', ['reaction type', 'decomposition', 'precipitation', 'combustion'], {
    id: 'ap-chem-chemical-reactions-types-original-1',
    label: 'Classify the defining particle rearrangement',
    keywords: ['reaction classification', 'decomposition', 'synthesis', 'precipitation', 'combustion', 'displacement'],
    problem: 'A student assigns a reaction category from an equation or observation.',
    explanation: 'Use the balanced species change. Decomposition splits one reactant into multiple products; combination joins species; precipitation forms an insoluble solid from dissolved ions; displacement changes elemental and ionic partners. An observation can support a classification, but the equation supplies the defining rearrangement.',
    alternativeMethod: 'Describe the before-and-after particle pattern in words before choosing a category label.',
  }),
  pack('introduction-acid-base-reactions', 'Introduction to acid-base reactions', ['acid base', 'proton transfer', 'conjugate'], {
    id: 'ap-chem-chemical-reactions-acid-base-original-1',
    label: 'Track the transferred proton',
    keywords: ['acid base reaction', 'proton transfer', 'bronsted lowry', 'conjugate acid', 'conjugate base', 'neutralization'],
    problem: 'A student identifies acid-base roles or interprets a neutralization reaction.',
    explanation: 'A Brønsted-Lowry acid donates H+ and a base accepts H+. Compare each species before and after to locate the transferred proton and pair conjugates that differ by one H+ and one unit of charge. A base need not contain OH- in its original formula.',
    alternativeMethod: 'Draw an arrow for the proton transfer, then label the donor, acceptor, and the two products formed by that transfer.',
  }),
  pack('oxidation-reduction-reactions', 'Oxidation-reduction reactions', ['redox', 'oxidation number', 'electron transfer', 'half reaction'], {
    id: 'ap-chem-chemical-reactions-redox-original-1',
    label: 'Balance electron loss with electron gain',
    keywords: ['redox', 'oxidation', 'reduction', 'oxidation number', 'electron transfer', 'half reaction'],
    problem: 'A student identifies oxidation and reduction or writes electron-transfer half-reactions.',
    explanation: 'Assign oxidation numbers to the changing elements. An increase is oxidation and electron loss; a decrease is reduction and electron gain. Write separate half-reactions, then scale them so total electrons lost equal total electrons gained. Oxygen is not required for a reaction to be redox.',
    alternativeMethod: 'Make a before-to-after oxidation-number line for each changing element and use the numerical change to count electrons.',
  }),
])
