const baseTarget = Object.freeze({ examId: 'ap', subjectId: 'ap-chemistry', domainId: 'kinetics' })

function pack(skillId, label, skillKeywords, material) {
  return Object.freeze({
    target: Object.freeze({ ...baseTarget, skillId }),
    label,
    reviewStatus: 'draft',
    materialNotice: 'These are original editorial AP Chemistry teaching materials. They summarize chemistry concepts without copying College Board questions, scoring guides, or reference-sheet layout.',
    relevanceRules: Object.freeze({
      skillKeywords,
      followUpPrefixes: ['why', 'how', 'what if', 'can you explain', 'i do not understand'],
      followUpTerms: ['that step', 'this step', 'the rate law', 'the graph', 'the mechanism'],
    }),
    materials: Object.freeze([Object.freeze(material)]),
  })
}

export const apChemistryKineticsContextPacks = Object.freeze([
  pack('reaction-rates', 'Reaction rates', ['reaction rate', 'average rate', 'concentration change'], {
    id: 'ap-chem-kinetics-rates-original-1',
    label: 'Normalize species slopes with coefficients',
    keywords: ['reaction rate', 'average rate', 'instantaneous rate', 'disappearance', 'appearance', 'stoichiometric coefficient'],
    problem: 'A student relates concentration changes of different species to one reaction rate.',
    explanation: 'Reactant concentration slopes are negative and product slopes are positive. Divide each signed slope by its balanced coefficient, using a minus sign for reactants, to obtain one nonnegative reaction-rate magnitude. An interval gives an average rate; a tangent or rate law gives an instantaneous value.',
    alternativeMethod: 'Build a row for each species containing sign, coefficient, concentration slope, and normalized reaction rate.',
  }),
  pack('introduction-rate-law', 'Introduction to rate law', ['rate law', 'initial rates', 'reaction order'], {
    id: 'ap-chem-kinetics-rate-law-original-1',
    label: 'Determine one empirical order at a time',
    keywords: ['rate law', 'initial rates', 'reaction order', 'rate constant', 'concentration factor'],
    problem: 'A student must infer concentration powers and a rate constant from controlled initial-rate trials.',
    explanation: 'Compare trials where all but one concentration are fixed. If changing concentration by factor f changes rate by factor g, solve g = f^order. After finding every order, substitute one full trial into rate = k[A]^m[B]^n and determine units from the overall order.',
    alternativeMethod: 'Write a factor table rather than dividing raw numbers immediately; this makes powers such as 2 squared equals 4 visible.',
  }),
  pack('concentration-changes-time', 'Concentration changes over time', ['integrated rate', 'half life', 'concentration time'], {
    id: 'ap-chem-kinetics-time-original-1',
    label: 'Choose the linearized concentration representation',
    keywords: ['integrated rate law', 'half-life', 'ln concentration', 'one over concentration', 'concentration versus time'],
    problem: 'A student determines reaction order or predicts concentration from time-series data.',
    explanation: 'Zero order makes [A] linear in time, first order makes ln[A] linear, and second order makes 1/[A] linear. For first order, equal half-lives produce repeated concentration halving and k = ln(2)/t1/2. Use the representation supported by the data rather than assuming raw concentration is linear.',
    alternativeMethod: 'Check equal-time intervals first; constant differences suggest zero order, constant ratios suggest first order.',
  }),
  pack('elementary-reactions', 'Elementary reactions', ['elementary reaction', 'molecularity', 'elementary step'], {
    id: 'ap-chem-kinetics-elementary-original-1',
    label: 'Use molecularity only for an elementary event',
    keywords: ['elementary step', 'molecularity', 'unimolecular', 'bimolecular', 'elementary rate law'],
    problem: 'A student writes the rate expression for a stated elementary step.',
    explanation: 'An elementary event occurs as written, so each reactant coefficient becomes its concentration power in that step rate law. This shortcut does not extend to a multistep overall equation. Molecularity describes the number of reacting particles in the event.',
    alternativeMethod: 'First label the equation elementary or overall; only the elementary label authorizes coefficient-to-exponent translation.',
  }),
  pack('collision-model', 'Collision model', ['collision model', 'activation energy', 'orientation'], {
    id: 'ap-chem-kinetics-collisions-original-1',
    label: 'Separate collision frequency, energy, and orientation',
    keywords: ['collision model', 'effective collision', 'activation energy', 'orientation', 'temperature', 'concentration'],
    problem: 'A student explains why a condition change affects reaction rate at the particle level.',
    explanation: 'A reaction needs encounters, sufficient collision energy, and productive orientation. Concentration often changes encounter frequency. Temperature changes both motion and the fraction of particles above the activation threshold. A catalyst changes the pathway and barrier rather than making every collision successful.',
    alternativeMethod: 'For each experimental change, mark which of the three filters—frequency, energy, or orientation—is directly affected.',
  }),
  pack('reaction-energy-profile', 'Reaction energy profile', ['energy profile', 'activation energy', 'transition state'], {
    id: 'ap-chem-kinetics-energy-profile-original-1',
    label: 'Measure barriers from the correct starting level',
    keywords: ['energy profile', 'activation energy', 'transition state', 'reaction energy', 'exothermic', 'endothermic'],
    problem: 'A student reads activation energy and overall energy change from a profile.',
    explanation: 'Overall energy change is product energy minus reactant energy. Forward activation energy is transition-state energy minus the energy of the state immediately before that peak. In a multistep profile, that starting state may be an intermediate rather than the original reactants.',
    alternativeMethod: 'Draw vertical arrows separately from each starting level to its next peak, then one endpoint arrow from reactants to products.',
  }),
  pack('introduction-reaction-mechanisms', 'Introduction to reaction mechanisms', ['reaction mechanism', 'intermediate', 'catalyst'], {
    id: 'ap-chem-kinetics-mechanisms-original-1',
    label: 'Add steps and classify canceled species',
    keywords: ['mechanism', 'elementary steps', 'intermediate', 'catalyst', 'overall reaction'],
    problem: 'A student checks whether elementary steps reproduce an overall reaction and identifies internal species.',
    explanation: 'Add every step and cancel species on opposite sides. An intermediate is produced then consumed and does not appear in the overall reaction. A catalyst is consumed then regenerated and also cancels, but it is available before the mechanism begins.',
    alternativeMethod: 'Make a species ledger with columns for initial presence, produced, consumed, regenerated, and overall appearance.',
  }),
  pack('reaction-mechanism-rate-law', 'Reaction mechanism and rate law', ['mechanism rate law', 'slow step', 'observed rate law'], {
    id: 'ap-chem-kinetics-mechanism-rate-original-1',
    label: 'Test both stoichiometry and kinetic prediction',
    keywords: ['mechanism rate law', 'rate-determining step', 'slow step', 'intermediate elimination', 'observed rate law'],
    problem: 'A student tests whether a proposed mechanism agrees with a measured rate law.',
    explanation: 'A valid mechanism must sum to the overall reaction and predict the observed rate law. Start with the relevant elementary-step law. If it contains an intermediate, use an earlier fast-step, equilibrium, or steady-state relationship to rewrite it using measurable overall reactants.',
    alternativeMethod: 'Run two independent checks: a species-cancellation check and a reactant-only rate-law check.',
  }),
  pack('pre-equilibrium-approximation', 'Pre-equilibrium approximation', ['pre equilibrium', 'fast equilibrium', 'intermediate concentration'], {
    id: 'ap-chem-kinetics-pre-equilibrium-original-1',
    label: 'Replace the intermediate with a fast-equilibrium ratio',
    keywords: ['pre-equilibrium', 'fast reversible step', 'equilibrium intermediate', 'derive rate law', 'substitution'],
    problem: 'A fast reversible step precedes a slower product-forming step, and the observed law must exclude the intermediate.',
    explanation: 'Write the slow elementary-step rate law. Use the fast equilibrium constant to solve for the intermediate concentration in terms of earlier reactants. Substitute and combine constants. Pre-equilibrium is dynamic; the first step does not stop.',
    alternativeMethod: 'Keep the algebra in three lines: slow rate, fast equilibrium solved for intermediate, substituted observed law.',
  }),
  pack('multistep-reaction-energy-profile', 'Multistep reaction energy profile', ['multistep energy', 'multiple peaks', 'intermediate valley'], {
    id: 'ap-chem-kinetics-multistep-profile-original-1',
    label: 'Match one peak to each elementary step',
    keywords: ['multistep energy profile', 'transition state peaks', 'intermediate valleys', 'rate-determining barrier'],
    problem: 'A student constructs or interprets an energy profile for a mechanism with several elementary steps.',
    explanation: 'Each elementary step contributes one transition-state peak. Intermediates appear as local minima between peaks. Compare each peak with the state immediately before it to find that step barrier; the largest relevant barrier commonly identifies the slowest step under comparable prefactor conditions.',
    alternativeMethod: 'Count steps, then draw that many peaks and one fewer internal valleys before assigning energies.',
  }),
  pack('catalysis', 'Catalysis', ['catalyst', 'alternate pathway', 'lower activation'], {
    id: 'ap-chem-kinetics-catalysis-original-1',
    label: 'Change the pathway without moving endpoints',
    keywords: ['catalyst', 'catalysis', 'alternate mechanism', 'lower activation energy', 'equilibrium composition'],
    problem: 'A student explains a catalyst with an energy profile or equilibrium statement.',
    explanation: 'A catalyst participates in an alternate mechanism and is regenerated. It lowers one or more activation barriers and accelerates both forward and reverse processes. It does not change reactant or product energy, overall energy change, or fixed-temperature equilibrium composition.',
    alternativeMethod: 'Overlay catalyzed and uncatalyzed profiles with identical endpoints but lower catalyzed peaks.',
  }),
])
