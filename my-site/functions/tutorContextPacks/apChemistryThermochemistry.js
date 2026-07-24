const baseTarget = Object.freeze({ examId: 'ap', subjectId: 'ap-chemistry', domainId: 'thermochemistry' })

function pack(skillId, label, skillKeywords, explanation, alternativeMethod) {
  return Object.freeze({
    target: Object.freeze({ ...baseTarget, skillId }),
    label,
    reviewStatus: 'draft',
    materialNotice: 'These are original editorial AP Chemistry teaching materials. They summarize chemistry concepts without copying College Board questions, scoring guides, or reference-sheet layout.',
    relevanceRules: Object.freeze({
      skillKeywords,
      followUpPrefixes: ['why', 'how', 'what if', 'can you explain', 'i do not understand'],
      followUpTerms: ['that step', 'this step', 'the sign', 'the diagram', 'the calculation'],
    }),
    materials: Object.freeze([Object.freeze({
      id: `ap-chem-thermochemistry-${skillId}-original-1`,
      label,
      keywords: skillKeywords,
      problem: `A student needs help with ${label.toLowerCase()}.`,
      explanation,
      alternativeMethod,
    })]),
  })
}

export const apChemistryThermochemistryContextPacks = Object.freeze([
  pack(
    'endothermic-exothermic-processes',
    'Endothermic and exothermic processes',
    ['endothermic', 'exothermic', 'heat flow', 'system', 'surroundings'],
    'Define the system first. Energy entering it gives positive q and an endothermic process; energy leaving it gives negative q and an exothermic process. A warmer surrounding solution usually means the reaction released heat.',
    'Draw a boundary and an arrow for energy transfer before choosing a sign.',
  ),
  pack(
    'energy-diagrams',
    'Energy diagrams',
    ['energy diagram', 'enthalpy diagram', 'reaction energy', 'transition state'],
    'Product energy minus reactant energy gives the reaction enthalpy sign. The transition-state peak determines activation energy, not whether the process is endothermic. Keep endpoint and barrier calculations separate.',
    'Draw one vertical arrow between endpoints and a second from reactants to the peak.',
  ),
  pack(
    'heat-transfer-thermal-equilibrium',
    'Heat transfer and thermal equilibrium',
    ['thermal equilibrium', 'heat transfer', 'final temperature', 'specific heat'],
    'For an isolated exchange, qhot + qcold = 0. Equal heat magnitudes do not imply equal temperature changes because mass and heat capacity may differ. Without a phase change, the final temperature lies between the initial values.',
    'Write each object as mc(Tfinal - Tinitial) and solve one shared final temperature.',
  ),
  pack(
    'heat-capacity-calorimetry',
    'Heat capacity and calorimetry',
    ['calorimeter', 'calorimetry', 'heat capacity', 'specific heat', 'molar enthalpy'],
    'Use calibration data to find apparatus heat capacity when needed. Then qcal = Ccal Delta T and qreaction = -qcal if other transfers are negligible. Divide by reaction extent only after establishing heat and sign.',
    'Use a three-line ledger: apparatus heat, reaction heat, heat per mole.',
  ),
  pack(
    'energy-phase-changes',
    'Energy of phase changes',
    ['phase change', 'melting', 'freezing', 'vaporization', 'heating curve'],
    'Within one phase, energy changes temperature and q = mc Delta T applies. During a phase transition at constant pressure, temperature is approximately constant while energy changes intermolecular organization.',
    'Partition a heating curve at every phase boundary and label each segment temperature-change or phase-change.',
  ),
  pack(
    'introduction-enthalpy-reaction',
    'Introduction to enthalpy of reaction',
    ['reaction enthalpy', 'delta h reaction', 'thermochemical equation', 'reaction extent'],
    'Delta H belongs to the balanced process exactly as written. Multiplying all coefficients multiplies Delta H, and reversing the equation reverses its sign. Convert actual reacting amount into reaction extent before scaling.',
    'Write a ratio of actual moles to the matching coefficient, then multiply the listed reaction enthalpy.',
  ),
  pack(
    'bond-enthalpies',
    'Bond enthalpies',
    ['bond enthalpy', 'bond energy', 'bonds broken', 'bonds formed'],
    'Breaking bonds requires energy and forming bonds releases energy. Count every changed bond with stoichiometric multiplicity, then estimate Delta H as the broken-bond sum minus the formed-bond sum.',
    'Make two tables, broken and formed, before doing arithmetic.',
  ),
  pack(
    'enthalpy-formation',
    'Enthalpy of formation',
    ['enthalpy of formation', 'formation values', 'standard state', 'products minus reactants'],
    'Multiply every formation value by its coefficient, sum products, and subtract the reactant sum. Match phases exactly. An element in its standard state has standard formation enthalpy zero.',
    'Write a coefficient-value-product column for each species before taking the difference.',
  ),
  pack(
    'hess-law',
    "Hess's law",
    ['hess law', 'combine equations', 'reverse equation', 'state function'],
    'Reverse, scale, and add supplied equations until unwanted species cancel and the target remains. Apply identical operations to each Delta H. This works because enthalpy is determined by initial and final states.',
    'Mark each target species side, choose equation multipliers, then verify cancellation before adding enthalpies.',
  ),
])
