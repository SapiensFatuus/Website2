const baseTarget = Object.freeze({ examId: 'ap', subjectId: 'ap-chemistry', domainId: 'acids-bases' })

function pack(skillId, label, skillKeywords, material) {
  return Object.freeze({
    target: Object.freeze({ ...baseTarget, skillId }),
    label,
    reviewStatus: 'draft',
    materialNotice: 'These are original editorial AP Chemistry teaching materials. They summarize chemistry concepts without copying College Board questions, scoring guides, or reference-sheet layout.',
    relevanceRules: Object.freeze({
      skillKeywords,
      followUpPrefixes: ['why', 'how', 'what if', 'can you explain', 'i do not understand'],
      followUpTerms: ['that step', 'this step', 'the calculation', 'the reaction', 'the ratio'],
    }),
    materials: Object.freeze([Object.freeze(material)]),
  })
}

export const apChemistryAcidsBasesContextPacks = Object.freeze([
  pack('introduction-acids-bases', 'Introduction to acids and bases', ['bronsted', 'acid base', 'proton donor', 'proton acceptor', 'conjugate pair'], {
    id: 'ap-chem-acids-bases-proton-transfer-original-1',
    label: 'Track proton transfer and conjugate pairs',
    keywords: ['proton transfer', 'proton donor', 'proton acceptor', 'conjugate acid', 'conjugate base', 'amphiprotic'],
    problem: 'A student must identify acid-base roles in an unfamiliar reaction without relying on charge or memorized species lists.',
    explanation: 'Compare each reactant with its corresponding product. The acid loses one H+ and becomes its conjugate base; the base gains one H+ and becomes its conjugate acid. Members of a conjugate pair differ by exactly one proton and one unit of charge. A species can be amphiprotic when it can donate a proton in one reaction and accept one in another.',
    alternativeMethod: 'Draw an arrow for the transferred proton, then label the species before and after that arrow. This makes role assignments follow the reaction rather than the formula charge.',
  }),
  pack('ph-poh-strong-acids-bases', 'pH, pOH, strong acids, and strong bases', ['ph', 'poh', 'strong acid', 'strong base', 'hydronium', 'hydroxide'], {
    id: 'ap-chem-acids-bases-strong-ph-original-1',
    label: 'Strong-electrolyte stoichiometry before logarithms',
    keywords: ['strong acid', 'strong base', 'ph', 'poh', 'dilution', 'neutralization', 'hydronium', 'hydroxide'],
    problem: 'A student needs the pH after dilution or mixing of strong acids and bases and is unsure when to use moles, concentration, or logarithms.',
    explanation: 'Treat a strong electrolyte as dissociated, including ion coefficients such as two OH- per formula unit of a soluble M(OH)2. For mixing, compare moles of H3O+ and OH- first, subtract by 1:1 neutralization, and divide the excess by the combined volume. Only then calculate pH or pOH. At 25 °C, pH + pOH = 14.00.',
    alternativeMethod: 'Organize the calculation as particles produced, moles reacted, final volume, then logarithm. Keeping those four stages separate prevents concentration and stoichiometry errors.',
  }),
  pack('weak-acid-base-equilibria', 'Weak acid and base equilibria', ['weak acid', 'weak base', 'ka', 'kb', 'percent ionization', 'ice table'], {
    id: 'ap-chem-acids-bases-weak-equilibrium-original-1',
    label: 'Model partial ionization with an equilibrium variable',
    keywords: ['weak acid', 'weak base', 'ka', 'kb', 'ice table', 'percent ionization', 'quadratic', 'small x'],
    problem: 'A student needs to calculate equilibrium pH or percent ionization for a weak acid or base without treating it as completely dissociated.',
    explanation: 'Write the proton-transfer reaction and an ICE table. If x is the amount ionized, product concentrations gain x while the weak reactant concentration loses x. Substitute equilibrium values into Ka or Kb. Use an exact quadratic solution when needed; if a small-x approximation is used, check the resulting percent change. For a weak base, x commonly gives [OH-], so convert pOH to pH.',
    alternativeMethod: 'Solve symbolically for the equilibrium concentrations before entering numbers, then substitute the result back into the equilibrium expression to verify the stated constant.',
  }),
  pack('acid-base-reactions-buffers', 'Acid-base reactions and buffers', ['buffer reaction', 'add acid to buffer', 'add base to buffer', 'neutralize buffer'], {
    id: 'ap-chem-acids-bases-buffer-reaction-original-1',
    label: 'React strong reagent before finding buffer pH',
    keywords: ['buffer', 'add hcl', 'add naoh', 'strong acid added', 'strong base added', 'reaction first', 'buffer stoichiometry'],
    problem: 'A student adds strong acid or base to a buffer and tries to place the added amount directly into an equilibrium expression.',
    explanation: 'Complete the stoichiometric proton-transfer reaction first. Added strong acid consumes the conjugate base and forms weak acid; added strong base consumes the weak acid and forms conjugate base. Update both mole amounts. If meaningful amounts of both weak conjugate partners remain, use their post-reaction ratio for the equilibrium pH. If one is exhausted and strong reagent remains, the mixture is no longer a buffer.',
    alternativeMethod: 'Use a two-column mole ledger for weak acid and conjugate base. Apply equal and opposite changes for the added strong reagent, then decide which pH model fits the final inventory.',
  }),
  pack('acid-base-titrations', 'Acid-base titrations', ['titration', 'equivalence point', 'half equivalence', 'indicator', 'titration curve'], {
    id: 'ap-chem-acids-bases-titration-regions-original-1',
    label: 'Choose a pH model from the titration region',
    keywords: ['titration', 'equivalence', 'half equivalence', 'indicator', 'before equivalence', 'after equivalence', 'hydrolysis'],
    problem: 'A student uses one equation for every point of a titration and assumes all equivalence points have pH 7.',
    explanation: 'Use stoichiometry to locate the region. Before equivalence in a weak-analyte titration, the analyte and conjugate product may form a buffer. At half-equivalence, their amounts are equal and pH equals pKa for a weak acid. At equivalence, the conjugate product can hydrolyze, making weak-acid/strong-base equivalence basic and weak-base/strong-acid equivalence acidic. Beyond equivalence, excess strong titrant controls pH.',
    alternativeMethod: 'At every requested volume, write a one-line species inventory after neutralization. Let that inventory choose among weak equilibrium, buffer ratio, conjugate hydrolysis, or excess-strong-reagent calculations.',
  }),
  pack('molecular-structure-acids-bases', 'Molecular structure of acids and bases', ['acid structure', 'conjugate base stability', 'bond strength', 'inductive effect', 'resonance acidity'], {
    id: 'ap-chem-acids-bases-structure-strength-original-1',
    label: 'Explain strength through conjugate-base stability',
    keywords: ['molecular structure', 'acid strength', 'conjugate base stability', 'resonance', 'inductive effect', 'bond strength', 'oxoacid'],
    problem: 'A student must rank related acids from structure and needs a defensible reason rather than a memorized trend.',
    explanation: 'Compare the products of proton loss. Resonance or charge delocalization, electron-withdrawing inductive effects, and favorable placement of charge can stabilize a conjugate base and strengthen its parent acid. For related binary hydrides, H-X bond strength also matters; high polarity alone does not determine acidity. State which structural change stabilizes the conjugate base or makes proton transfer energetically easier.',
    alternativeMethod: 'Draw or describe each conjugate base first, mark where the negative charge can reside, and rank conjugate-base stability. Reverse that order to obtain conjugate-base strength and use it to support the acid ranking.',
  }),
  pack('ph-pka', 'pH and pKa', ['pka', 'ka and pka', 'acid strength scale', 'ph compared with pka'], {
    id: 'ap-chem-acids-bases-ph-pka-original-1',
    label: 'Use logarithms to connect Ka, pKa, pH, and composition',
    keywords: ['pka', 'ka', 'ph minus pka', 'stronger acid', 'conjugate ratio', 'tenfold'],
    problem: 'A student needs to compare acid strengths or infer conjugate-pair composition from pH and pKa.',
    explanation: 'pKa = -log Ka, so a larger Ka corresponds to a smaller pKa and a stronger acid. A one-unit pKa difference represents a tenfold Ka ratio. For a conjugate pair, pH below pKa means the protonated form predominates, pH equal to pKa means equal forms, and pH above pKa means the deprotonated form predominates.',
    alternativeMethod: 'Translate logarithmic differences into powers of ten. The sign of pH - pKa immediately tells whether the base-to-acid ratio is below, equal to, or above one.',
  }),
  pack('properties-buffers', 'Properties of buffers', ['identify buffer', 'buffer components', 'buffer solution', 'resists ph change'], {
    id: 'ap-chem-acids-bases-buffer-properties-original-1',
    label: 'Identify what a buffer contains and what it can do',
    keywords: ['buffer properties', 'identify buffer', 'weak acid conjugate base', 'weak base conjugate acid', 'resist ph'],
    problem: 'A student labels any acid-base mixture as a buffer or claims that a buffer prevents all pH change.',
    explanation: 'A buffer contains meaningful amounts of a weak acid with its conjugate base, or a weak base with its conjugate acid. It can be prepared directly or by partial neutralization. The conjugate base consumes added strong acid and the weak acid consumes added strong base. Those reactions reduce, but do not eliminate, pH change. Excess strong reagent or exhaustion of one component destroys buffer behavior.',
    alternativeMethod: 'After completing any strong-reagent reaction, inventory the remaining weak species. A valid buffer requires both members of one conjugate pair and no controlling excess strong acid or base.',
  }),
  pack('henderson-hasselbalch-equation', 'Henderson-Hasselbalch equation', ['henderson hasselbalch', 'buffer ratio', 'calculate buffer ph', 'target buffer ph'], {
    id: 'ap-chem-acids-bases-henderson-original-1',
    label: 'Read and rearrange the buffer ratio',
    keywords: ['henderson hasselbalch', 'buffer ph', 'base acid ratio', 'target ph', 'pka plus log'],
    problem: 'A student reverses the conjugate-pair ratio or uses pre-reaction amounts in the Henderson-Hasselbalch equation.',
    explanation: 'For an acid buffer, pH = pKa + log([A-]/[HA]). Use the conjugate base over weak acid, and use amounts after any strong reagent reacts. The same final volume cancels from the ratio, so post-reaction moles may be used directly. Rearranging gives [A-]/[HA] = 10^(pH-pKa), which is useful for designing a target buffer.',
    alternativeMethod: 'Check direction before arithmetic: more conjugate base than acid must give pH above pKa, while more acid must give pH below pKa.',
  }),
  pack('buffer-capacity', 'Buffer capacity', ['buffer capacity', 'more concentrated buffer', 'capacity experiment', 'buffer dilution'], {
    id: 'ap-chem-acids-bases-capacity-original-1',
    label: 'Separate ratio-controlled pH from amount-controlled capacity',
    keywords: ['buffer capacity', 'concentrated buffer', 'diluted buffer', 'same ratio', 'ph change', 'capacity experiment'],
    problem: 'A student concludes that two buffers with the same initial pH must resist the same amount of added acid or base.',
    explanation: 'The conjugate-pair ratio largely positions the initial pH, while the available moles of both components determine how much strong reagent can be consumed. Buffers with the same ratio can start at nearly the same pH but have different capacity. Dilution can leave the ratio and pH nearly unchanged while reducing the reacting amount per sample volume and therefore reducing resistance to a fixed addition.',
    alternativeMethod: 'For a fair comparison, add the same moles of strong reagent to equal volumes under the same conditions and compare the magnitude of each pH change.',
  }),
  pack('ph-solubility', 'pH and solubility', ['ph solubility', 'acid increases solubility', 'hydroxide solubility', 'carbonate solubility'], {
    id: 'ap-chem-acids-bases-ph-solubility-original-1',
    label: 'Couple proton transfer to dissolution equilibrium',
    keywords: ['ph and solubility', 'acid added to carbonate', 'acid added to hydroxide', 'carbonate', 'hydroxide solid', 'more soluble', 'qsp', 'ksp', 'coupled equilibrium'],
    problem: 'A student must explain why changing pH affects some sparingly soluble solids much more than others.',
    explanation: 'Write the dissolution quotient and identify whether a dissolved ion reacts with H3O+ or OH-. If added acid consumes a basic anion such as OH- or carbonate species, its free concentration falls and Qsp drops below Ksp. Additional solid dissolves to restore equilibrium. The effect depends on a favorable coupled reaction; pH does not change every salt equally, and Ksp stays constant when temperature stays constant.',
    alternativeMethod: 'Mark the shared dissolved ion between the dissolution and acid-base reactions. Follow how consuming that ion changes Qsp before predicting the direction of further dissolution.',
  }),
])
