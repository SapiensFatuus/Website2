const baseTarget = Object.freeze({ examId: 'ap', subjectId: 'ap-chemistry', domainId: 'equilibrium' })

function pack(skillId, label, skillKeywords, materials) {
  return Object.freeze({
    target: Object.freeze({ ...baseTarget, skillId }),
    label,
    reviewStatus: 'draft',
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
  pack('direction-reversible-reactions', 'Direction of reversible reactions', ['net reaction', 'forward rate', 'reverse rate', 'reversible direction'], [
    {
      id: 'ap-chem-equilibrium-direction-original-1',
      label: 'Using opposing rates to find net direction',
      keywords: ['forward rate', 'reverse rate', 'net rate', 'net direction', 'reversible reaction'],
      problem: 'A student is given forward and reverse reaction rates and must identify the net direction before equilibrium is reached.',
      explanation: 'Compare the two opposing rates at the same instant. A larger forward rate gives net product formation; a larger reverse rate gives net reactant formation. Equal nonzero rates indicate dynamic equilibrium. The rates may both occur even when the system is not yet at equilibrium.',
      alternativeMethod: 'Define forward as positive and compute forward rate minus reverse rate. The sign gives direction, while zero means there is no net composition change.',
    },
  ]),
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
  pack('calculating-equilibrium-constant', 'Calculating the equilibrium constant', ['calculate k', 'find equilibrium constant', 'equilibrium concentrations', 'equilibrium pressures'], [
    {
      id: 'ap-chem-equilibrium-calculate-k-original-1',
      label: 'Calculating K from equilibrium composition',
      keywords: ['calculate k', 'find k', 'equilibrium composition', 'equilibrium concentration', 'equilibrium pressure'],
      problem: 'A student has measured equilibrium concentrations or partial pressures and needs to calculate the constant for a balanced reaction.',
      explanation: 'Write the balanced equation first, then place product activities in the numerator and reactant activities in the denominator, each raised to its stoichiometric coefficient. Omit pure solids and pure liquids. Substitute values measured at equilibrium, not initial values, and state whether the expression is Kc or Kp.',
      alternativeMethod: 'Label the phase of every species and map each variable species coefficient directly to an exponent before entering any numbers. This separates expression errors from arithmetic errors.',
    },
  ]),
  pack('magnitude-equilibrium-constant', 'Magnitude of the equilibrium constant', ['magnitude of k', 'large k', 'small k', 'product favored', 'reactant favored'], [
    {
      id: 'ap-chem-equilibrium-magnitude-original-1',
      label: 'Interpreting the magnitude of K',
      keywords: ['large k', 'small k', 'k near one', 'product favored', 'reactant favored', 'equilibrium composition'],
      problem: 'A student must infer the relative amounts of reactants and products from the magnitude of an equilibrium constant.',
      explanation: 'A very large K indicates that the equilibrium expression has a large product-to-reactant ratio, while a very small K indicates a small ratio. A value near one suggests appreciable amounts on both sides. K describes equilibrium composition; it does not reveal how fast equilibrium is reached or require any concentration to be exactly zero.',
      alternativeMethod: 'Read K as a weighted ratio from the written expression. Check the exponents before translating its size into a composition claim.',
    },
  ]),
  pack('properties-equilibrium-constant', 'Properties of the equilibrium constant', ['reverse reaction k', 'scale reaction k', 'combine reactions', 'transform equilibrium constant'], [
    {
      id: 'ap-chem-equilibrium-transform-k-original-1',
      label: 'Transforming reactions and equilibrium constants',
      keywords: ['reverse reaction', 'multiply coefficients', 'divide coefficients', 'combine reactions', 'transform k'],
      problem: 'A student must determine a new equilibrium constant after reversing, scaling, or adding chemical equations.',
      explanation: 'Reversing a reaction takes the reciprocal of K. Multiplying every coefficient by a factor n raises K to the power n; dividing coefficients by n takes the corresponding root. Adding reactions multiplies their constants after intermediate species cancel. These rules follow from transforming and multiplying the equilibrium expressions.',
      alternativeMethod: 'Transform each equation one step at a time and write the matching operation on K beside it. Combine constants only after the chemical equations produce the requested net reaction.',
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
  pack('representations-equilibrium', 'Representations of equilibrium', ['particle diagram equilibrium', 'equilibrium graph', 'concentration graph', 'equilibrium representation'], [
    {
      id: 'ap-chem-equilibrium-representations-original-1',
      label: 'Reading equilibrium representations',
      keywords: ['particle diagram', 'concentration graph', 'rate graph', 'equilibrium plateau', 'representation'],
      problem: 'A student must connect a particle diagram or graph to macroscopic equilibrium evidence without violating conservation.',
      explanation: 'A concentration graph supports equilibrium when each concentration becomes constant over time; a rate graph supports it when forward and reverse rates become equal. A particle model may show different counts of molecular species, but it must conserve every atom in a closed system. A single snapshot containing both sides is not enough to prove equilibrium.',
      alternativeMethod: 'List the invariant each representation must preserve: atoms for a particle model, plateau values for a concentration graph, and equal opposing values for a rate graph.',
    },
  ]),
  pack('introduction-le-chatelier-principle', "Introduction to Le Chatelier's principle", ['le chatelier', 'stress', 'add reactant', 'remove product', 'pressure', 'temperature'], [
    {
      id: 'ap-chem-equilibrium-le-chatelier-original-1',
      label: 'Explaining equilibrium shifts',
      keywords: ['le chatelier', 'shift', 'stress', 'add', 'remove', 'pressure', 'temperature'],
      problem: 'A student must predict and justify how an equilibrium responds after concentration, pressure, volume, or temperature changes.',
      explanation: 'Describe the stress first, then identify the direction that partially offsets it. Concentration changes alter Q immediately. Pressure or volume changes matter when gaseous mole counts differ. Temperature changes alter K because heat behaves as a reactant or product in the thermochemical equation.',
      alternativeMethod: 'Use Q versus K for concentration and volume problems. Reserve a particle-level explanation to justify why the direction reduces the imposed stress.',
    },
  ]),
  pack('reaction-quotient-le-chatelier-principle', "Reaction quotient and Le Chatelier's principle", ['q after disturbance', 'reaction quotient shift', 'immediate change', 'restore equilibrium'], [
    {
      id: 'ap-chem-equilibrium-disturbance-q-original-1',
      label: 'Using Q after a disturbance',
      keywords: ['q after', 'immediately after', 'disturbance', 'restore equilibrium', 'volume change', 'concentration change'],
      problem: 'A student needs a quantitative explanation for the direction of shift immediately after a composition or volume disturbance.',
      explanation: 'Keep K fixed when temperature is fixed. Recalculate Q from the composition immediately after the disturbance, before the reaction has time to respond. Q below K produces a net forward reaction; Q above K produces a net reverse reaction. A catalyst changes neither Q nor K and therefore does not change the equilibrium composition.',
      alternativeMethod: 'Mark two moments: the instantaneous physical change and the slower chemical response. Change only the quantities directly affected at the first moment, then compare the resulting Q with K.',
    },
  ]),
  pack('introduction-solubility-equilibria', 'Introduction to solubility equilibria', ['ksp', 'solubility product', 'molar solubility', 'sparingly soluble'], [
    {
      id: 'ap-chem-equilibrium-ksp-original-1',
      label: 'Connecting Ksp and molar solubility',
      keywords: ['ksp', 'solubility product', 'molar solubility', 'dissolution equilibrium', 'sparingly soluble'],
      problem: 'A student must write a solubility-product expression and connect it to the molar solubility of an ionic solid.',
      explanation: 'Balance the dissolution equation, omit the pure solid from Ksp, and express each aqueous ion concentration as its stoichiometric coefficient times the molar solubility s when dissolving in pure water. Substitute those expressions into Ksp. The numerical value of Ksp generally is not the same as s.',
      alternativeMethod: 'Create a one-row stoichiometry table from one mole of dissolved solid to the moles of each ion. Convert that relationship to concentrations before using the equilibrium expression.',
    },
  ]),
  pack('common-ion-effect', 'Common-ion effect', ['common ion', 'molar solubility with ion present', 'precipitation qsp', 'selective precipitation'], [
    {
      id: 'ap-chem-equilibrium-common-ion-original-1',
      label: 'Common ions, solubility, and precipitation',
      keywords: ['common ion', 'reduced solubility', 'qsp', 'precipitation', 'ion already present'],
      problem: 'A student must predict or calculate how an ion already in solution affects dissolution or whether a precipitate forms after mixing.',
      explanation: 'Include the initial common-ion concentration in the equilibrium concentration expression; it usually makes less additional solid dissolve. For a precipitation test, calculate the post-mixing ion concentrations first, then compare Qsp with Ksp. Qsp greater than Ksp predicts precipitation, equality is saturated equilibrium, and Qsp below Ksp is unsaturated.',
      alternativeMethod: 'Separate dilution from equilibrium: compute concentrations immediately after solutions are combined, form Qsp from those values, and only then decide whether a reaction occurs.',
    },
  ]),
])
