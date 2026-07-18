const baseTarget = Object.freeze({ examId: 'ap', subjectId: 'ap-chemistry', domainId: 'equilibrium' })

function pack(skillId, label, skillKeywords, materials) {
  return Object.freeze({
    target: Object.freeze({ ...baseTarget, skillId }),
    label,
    materialNotice: 'These are original editorial AP Chemistry teaching materials. They summarize chemistry concepts without copying College Board questions, scoring guides, or reference-sheet layout.',
    relevanceRules: Object.freeze({
      skillKeywords,
      followUpPrefixes: ['why', 'how', 'what if', 'can you explain', 'i do not understand'],
      followUpTerms: ['that step', 'this step', 'the calculation', 'the shift'],
    }),
    materials: Object.freeze(materials.map((material) => Object.freeze(material))),
  })
}

export const apChemistryEquilibriumContextPacks = Object.freeze([
  pack('reaction-quotient-equilibrium-constant', 'Reaction quotient and equilibrium constant', ['equilibrium constant', 'reaction quotient', 'q', 'k', 'compare q'], [
    {
      id: 'ap-chem-equilibrium-q-k-original-1',
      label: 'Comparing Q and K',
      keywords: ['q', 'k', 'reaction quotient', 'equilibrium constant', 'shift left', 'shift right'],
      problem: 'A student has an equilibrium expression and measured concentrations at one moment. They need to decide whether the mixture will shift toward reactants or products.',
      explanation: 'Calculate Q with the same expression used for K. If Q is smaller than K, too little product is present relative to equilibrium, so the net reaction proceeds forward. If Q is larger than K, the net reaction proceeds in reverse. If Q equals K, the system is at equilibrium.',
      alternativeMethod: 'Before calculating, identify whether the measured mixture has relatively more product or reactant than the equilibrium ratio. Use that qualitative prediction to check the numerical comparison.',
    },
  ]),
  pack('calculating-equilibrium-concentrations', 'Calculating equilibrium concentrations', ['ice table', 'equilibrium concentration', 'initial change equilibrium', 'solve for x'], [
    {
      id: 'ap-chem-equilibrium-ice-original-1',
      label: 'ICE-table reasoning',
      keywords: ['ice table', 'initial change equilibrium', 'equilibrium concentration', 'x', 'concentration'],
      problem: 'A student knows initial concentrations and K and needs to organize a reversible reaction without losing the stoichiometric relationship among species.',
      explanation: 'Use an ICE table to separate what is known initially from the change caused by the net reaction and the final equilibrium values. Define one change variable and apply coefficients to every row before substituting into K. Check that every final concentration is physically possible.',
      alternativeMethod: 'Write the balanced reaction above the table and label the assumed forward direction. That makes the signs and coefficient multipliers easier to audit before solving.',
    },
  ]),
  pack('introduction-le-chatelier-principle', 'Le Châtelier’s principle', ['le chatelier', 'stress', 'add reactant', 'remove product', 'pressure', 'temperature'], [
    {
      id: 'ap-chem-equilibrium-le-chatelier-original-1',
      label: 'Explaining equilibrium shifts',
      keywords: ['le chatelier', 'shift', 'stress', 'add', 'remove', 'pressure', 'temperature'],
      problem: 'A student must predict and justify how an equilibrium responds after concentration, pressure, volume, or temperature changes.',
      explanation: 'Describe the stress first, then identify the direction that partially offsets it. Concentration changes alter Q immediately. Pressure or volume changes matter when gaseous mole counts differ. Temperature changes alter K because heat behaves as a reactant or product in the thermochemical equation.',
      alternativeMethod: 'Use Q versus K for concentration and volume problems. Reserve a particle-level explanation to justify why the direction reduces the imposed stress.',
    },
  ]),
  pack('introduction-equilibrium', 'Introduction to equilibrium', ['dynamic equilibrium', 'forward reaction', 'reverse reaction', 'rate'], [
    {
      id: 'ap-chem-equilibrium-dynamic-original-1',
      label: 'Dynamic equilibrium and common misconceptions',
      keywords: ['dynamic equilibrium', 'forward', 'reverse', 'rate', 'stopped', 'equal concentrations'],
      problem: 'A student sees a constant concentration graph and needs to explain what is happening microscopically at equilibrium.',
      explanation: 'Equilibrium is dynamic: forward and reverse reactions continue, but at equal rates. Constant concentrations do not mean equal concentrations, no particles moving, or that the reaction has stopped.',
      alternativeMethod: 'Sketch two rate-versus-time curves that meet at the same value while concentration curves level off. The two graphs emphasize different facts about the same system.',
    },
  ]),
])
