const baseTarget = Object.freeze({ examId: 'ap', subjectId: 'ap-chemistry', domainId: 'thermodynamics-electrochemistry' })

function pack(skillId, label, skillKeywords, explanation, alternativeMethod) {
  return Object.freeze({
    target: Object.freeze({ ...baseTarget, skillId }),
    label,
    reviewStatus: 'draft',
    materialNotice: 'These are original editorial AP Chemistry teaching materials. They summarize chemistry concepts without copying College Board questions, scoring guides, or reference-sheet layout.',
    relevanceRules: Object.freeze({
      skillKeywords,
      followUpPrefixes: ['why', 'how', 'what if', 'can you explain', 'i do not understand'],
      followUpTerms: ['that step', 'this step', 'the sign', 'the equation', 'the cell'],
    }),
    materials: Object.freeze([Object.freeze({
      id: `ap-chem-thermodynamics-electrochemistry-${skillId}-original-1`,
      label, keywords: skillKeywords, problem: `A student needs help with ${label.toLowerCase()}.`, explanation, alternativeMethod,
    })]),
  })
}

export const apChemistryThermodynamicsElectrochemistryContextPacks = Object.freeze([
  pack(
    'introduction-entropy', 'Introduction to entropy',
    ['entropy', 'dispersal', 'microstates', 'gas particles', 'phase change'],
    'Entropy tracks how matter and energy are distributed among accessible arrangements. Expansion, mixing, more gas particles, and higher temperature often increase the number of accessible arrangements; support the prediction with a particle-level comparison.',
    'Compare initial and final particle number, phase, volume, mixing, and temperature in a small evidence table.',
  ),
  pack(
    'absolute-entropy-entropy-change', 'Absolute entropy and entropy change',
    ['standard molar entropy', 'reaction entropy', 'delta s', 'products minus reactants'],
    'Multiply each standard molar entropy by its balanced coefficient, sum products, and subtract the reactant sum. Match phases and keep units in joules per mole-kelvin unless a later calculation requires conversion.',
    'Write coefficient times entropy beside every species before taking products minus reactants.',
  ),
  pack(
    'gibbs-free-energy-thermodynamic-favorability', 'Gibbs free energy and favorability',
    ['gibbs free energy', 'delta g', 'delta h minus t delta s', 'favorability', 'temperature'],
    'Use Delta G = Delta H - T Delta S with temperature in kelvin and consistent energy units. Negative Delta G supports thermodynamic favorability under the stated conditions; the signs of Delta H and Delta S determine how temperature changes that conclusion.',
    'Convert entropy units first, calculate T Delta S separately, then subtract with signs visible.',
  ),
  pack(
    'thermodynamic-kinetic-control', 'Thermodynamic and kinetic control',
    ['thermodynamic control', 'kinetic control', 'activation energy', 'favorable but slow'],
    'Thermodynamics addresses direction and relative stability, while kinetics addresses pathway and rate. A negative Delta G process can be extremely slow if its activation barrier is large; a catalyst changes rate without changing Delta G.',
    'Answer two separate questions: Is the process favorable, and is an accessible pathway fast enough?',
  ),
  pack(
    'free-energy-equilibrium', 'Free energy and equilibrium',
    ['free energy equilibrium', 'delta g standard', 'equilibrium constant', 'minus rt ln k'],
    'Standard free energy and equilibrium constant satisfy Delta G degree = -RT ln K. Negative Delta G degree corresponds to K greater than one. At equilibrium the actual composition-dependent Delta G is zero, but Delta G degree is zero only when K equals one.',
    'Label every statement as standard-state or actual-composition before interpreting zero.',
  ),
  pack(
    'free-energy-dissolution', 'Free energy of dissolution',
    ['dissolution free energy', 'solvation', 'mixing entropy', 'endothermic dissolution'],
    'Dissolution balances separation costs, new solute-solvent interactions, and dispersal. Positive dissolution enthalpy does not by itself prevent favorability; positive entropy and temperature can make Delta H - T Delta S negative.',
    'List enthalpy evidence and entropy evidence separately, then combine them with the temperature.',
  ),
  pack(
    'coupled-reactions', 'Coupled reactions',
    ['coupled reactions', 'reaction coupling', 'shared intermediate', 'add free energies'],
    'Scale and add chemical equations so a shared intermediate is produced by one process and consumed by the other. Only after verifying cancellation should the correspondingly scaled free energies be added.',
    'Do equation algebra first and free-energy arithmetic second.',
  ),
  pack(
    'galvanic-electrolytic-cells', 'Galvanic and electrolytic cells',
    ['galvanic cell', 'electrolytic cell', 'anode', 'cathode', 'cell potential', 'electrolysis'],
    'Oxidation is at the anode, reduction at the cathode, and electrons flow externally from anode to cathode. Use listed reduction potentials as Ecathode - Eanode without multiplying potentials. For electrolysis, q = It and moles electrons = q/F.',
    'Assign oxidation and reduction first, then electrode labels, electron flow, potential, and finally charge stoichiometry.',
  ),
])
