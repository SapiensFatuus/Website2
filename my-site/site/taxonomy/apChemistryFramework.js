import { apChemistrySources, validateSourceRegistry } from './apChemistrySources.js'

export const AP_CHEMISTRY_FRAMEWORK_ID = 'ap-chemistry-fall-2024'

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const OFFICIAL_TOPIC_PATTERN = /^(\d+)\.(\d+)$/
const OBJECTIVE_PATTERN = /^(\d+\.\d+)\.([A-Z])$/
const SUBSKILL_PATTERN = /^[1-6]\.[A-Z]$/

function topic(officialNumber, id, label, summary, practiceIds, objectiveSummaries = null) {
  const learningObjectives = objectiveSummaries || [{ id: `${officialNumber}.A`, summary }]
  return Object.freeze({
    id,
    label,
    officialNumber,
    summary,
    description: summary,
    practiceIds: Object.freeze(practiceIds),
    learningObjectives: Object.freeze(learningObjectives.map((objective) => Object.freeze(objective))),
  })
}

function unit(officialNumber, id, label, description, weighting, topics) {
  return Object.freeze({
    id,
    label,
    officialNumber: String(officialNumber),
    order: officialNumber,
    description,
    weighting: Object.freeze({ section: 'multiple-choice', minPercent: weighting[0], maxPercent: weighting[1] }),
    topics: Object.freeze(topics),
  })
}

export const apChemistrySciencePractices = Object.freeze([
  {
    id: 'models-representations', officialNumber: '1', label: 'Models and Representations',
    summary: 'Interpret chemical models and extract information at particle and bulk scales.',
    subskills: [
      ['1.A', 'Read components and quantitative details from particle-level models.'],
      ['1.B', 'Read models that connect particle-level and macroscopic information.'],
    ],
  },
  {
    id: 'question-method', officialNumber: '2', label: 'Question and Method',
    summary: 'Develop scientific questions and evaluate experimental methods and results.',
    subskills: [
      ['2.A', 'Identify a testable question from observations, data, or a model.'],
      ['2.B', 'Form a hypothesis or predict an experimental result.'],
      ['2.C', 'Choose a procedure that can answer a scientific question.'],
      ['2.D', 'Collect observations or data from laboratory representations with suitable precision.'],
      ['2.E', 'Recognize plausible sources of experimental error.'],
      ['2.F', 'Explain how a procedure change would affect results.'],
    ],
  },
  {
    id: 'representing-data-phenomena', officialNumber: '3', label: 'Representing Data and Phenomena',
    summary: 'Create graphs, diagrams, and models for chemical substances and processes.',
    subskills: [
      ['3.A', 'Graph chemical data with appropriate scales and units.'],
      ['3.B', 'Represent chemical substances or phenomena with a suitable diagram or model.'],
      ['3.C', 'Show relationships between structures and interactions across scales.'],
    ],
  },
  {
    id: 'model-analysis', officialNumber: '4', label: 'Model Analysis',
    summary: 'Use and evaluate representations to explain chemical properties and behavior.',
    subskills: [
      ['4.A', 'Predict or explain phenomena using chemical theories and models.'],
      ['4.B', 'Evaluate whether a model agrees with chemical theory.'],
      ['4.C', 'Connect particle-level structure to macroscopic properties.'],
      ['4.D', 'Evaluate how well a model connects particle and macroscopic behavior.'],
    ],
  },
  {
    id: 'mathematical-routines', officialNumber: '5', label: 'Mathematical Routines',
    summary: 'Select and apply mathematical relationships to solve chemistry problems.',
    subskills: [
      ['5.A', 'Identify the quantities needed to solve a problem.'],
      ['5.B', 'Select a relevant definition, theory, or mathematical relationship.'],
      ['5.C', 'Explain how variables in an equation depend on one another.'],
      ['5.D', 'Use information presented in a graph to solve a problem.'],
      ['5.E', 'Determine a balanced equation for a chemical phenomenon.'],
      ['5.F', 'Calculate an unknown through a logical, precise quantitative pathway.'],
    ],
  },
  {
    id: 'argumentation', officialNumber: '6', label: 'Argumentation',
    summary: 'Construct chemical claims, evidence, and reasoning.',
    subskills: [
      ['6.A', 'Make a scientific claim.'],
      ['6.B', 'Support a claim with experimental evidence.'],
      ['6.C', 'Support a claim with particle-level models or representations.'],
      ['6.D', 'Justify a claim with chemical principles or mathematics.'],
      ['6.E', 'Justify a claim by connecting particle and macroscopic scales.'],
      ['6.F', 'Connect experimental results to chemical concepts or theories.'],
      ['6.G', 'Explain how experimental error could affect results.'],
    ],
  },
].map((practice) => Object.freeze({
  ...practice,
  subskills: Object.freeze(practice.subskills.map(([id, summary]) => Object.freeze({ id, summary }))),
})))

export const apChemistryUnits = Object.freeze([
  unit(1, 'atomic-structure-properties', 'Atomic Structure and Properties',
    'Connect moles, atomic evidence, electron structure, and periodic behavior.', [7, 9], [
      topic('1.1', 'moles-molar-mass', 'Moles and Molar Mass', 'Convert among particle counts, amount in moles, and sample mass.', ['5.B']),
      topic('1.2', 'mass-spectra-elements', 'Mass Spectra of Elements', 'Use isotope peaks and abundance data to interpret elemental mass spectra.', ['5.D']),
      topic('1.3', 'elemental-composition-pure-substances', 'Elemental Composition of Pure Substances', 'Determine empirical composition from measured amounts in a pure substance.', ['2.A']),
      topic('1.4', 'composition-mixtures', 'Composition of Mixtures', 'Relate measurements of a mixture to the amounts of its components.', ['5.A']),
      topic('1.5', 'atomic-structure-electron-configuration', 'Atomic Structure and Electron Configuration', 'Represent electron arrangements and connect them to atomic structure.', ['1.A']),
      topic('1.6', 'photoelectron-spectroscopy', 'Photoelectron Spectroscopy', 'Interpret photoelectron spectra using electron configurations and nuclear attraction.', ['4.B']),
      topic('1.7', 'periodic-trends', 'Periodic Trends', 'Explain recurring atomic properties through charge, distance, and electron structure.', ['4.A']),
      topic('1.8', 'valence-electrons-ionic-compounds', 'Valence Electrons and Ionic Compounds', 'Relate valence electrons to ionic charge, formulas, and compound behavior.', ['4.C']),
    ]),
  unit(2, 'compound-structure-properties', 'Compound Structure and Properties',
    'Use bonding and molecular structure to explain the properties of compounds and solids.', [7, 9], [
      topic('2.1', 'types-chemical-bonds', 'Types of Chemical Bonds', 'Distinguish bonding types using electron distribution and electronegativity.', ['6.A']),
      topic('2.2', 'intramolecular-force-potential-energy', 'Intramolecular Force and Potential Energy', 'Connect bond formation, internuclear distance, and potential energy.', ['3.A']),
      topic('2.3', 'structure-ionic-solids', 'Structure of Ionic Solids', 'Use ionic lattice models to explain the behavior of ionic solids.', ['4.C']),
      topic('2.4', 'structure-metals-alloys', 'Structure of Metals and Alloys', 'Use particle models of metals and alloys to explain their properties.', ['4.C']),
      topic('2.5', 'lewis-diagrams', 'Lewis Diagrams', 'Construct Lewis diagrams that represent valence-electron arrangements.', ['3.B']),
      topic('2.6', 'resonance-formal-charge', 'Resonance and Formal Charge', 'Evaluate resonance structures and formal charge when representing bonding.', ['6.C']),
      topic('2.7', 'vsepr-hybridization', 'VSEPR and Hybridization', 'Predict molecular geometry and bonding descriptions from electron domains.', ['6.C']),
    ]),
  unit(3, 'properties-substances-mixtures', 'Properties of Substances and Mixtures',
    'Explain phases, gases, solutions, and spectroscopy through particle interactions.', [18, 22], [
      topic('3.1', 'intermolecular-interparticle-forces', 'Intermolecular and Interparticle Forces', 'Compare attractions among particles and connect them to physical behavior.', ['4.D']),
      topic('3.2', 'properties-solids', 'Properties of Solids', 'Explain solid properties using particle arrangement and interactions.', ['4.C']),
      topic('3.3', 'solids-liquids-gases', 'Solids, Liquids, and Gases', 'Represent how particle motion and spacing differ among phases.', ['3.C']),
      topic('3.4', 'ideal-gas-law', 'Ideal Gas Law', 'Relate pressure, volume, temperature, and amount for ideal gases.', ['5.C']),
      topic('3.5', 'kinetic-molecular-theory', 'Kinetic Molecular Theory', 'Use molecular motion and collisions to explain gas behavior.', ['4.A']),
      topic('3.6', 'deviation-ideal-gas-law', 'Deviation from Ideal Gas Law', 'Explain nonideal gas behavior through particle volume and attractions.', ['6.E']),
      topic('3.7', 'solutions-mixtures', 'Solutions and Mixtures', 'Calculate and interpret composition and concentration in mixtures.', ['5.F']),
      topic('3.8', 'representations-solutions', 'Representations of Solutions', 'Translate among symbolic, particle-level, and macroscopic solution descriptions.', ['3.C']),
      topic('3.9', 'separation-solutions-mixtures', 'Separation of Solutions and Mixtures', 'Choose separation methods based on differences in physical properties.', ['2.C']),
      topic('3.10', 'solubility', 'Solubility', 'Explain dissolution and solubility using competing particle interactions.', ['4.D']),
      topic('3.11', 'spectroscopy-electromagnetic-spectrum', 'Spectroscopy and the Electromagnetic Spectrum', 'Connect electromagnetic radiation to energy changes and measured spectra.', ['4.A']),
      topic('3.12', 'properties-photons', 'Properties of Photons', 'Relate photon energy, wavelength, and frequency quantitatively.', ['5.F']),
      topic('3.13', 'beer-lambert-law', 'Beer-Lambert Law', 'Use absorbance and calibration data to determine solution concentration.', ['2.E']),
    ]),
  unit(4, 'chemical-reactions', 'Chemical Reactions',
    'Represent chemical change and use balanced reactions for quantitative reasoning.', [7, 9], [
      topic('4.1', 'introduction-reactions', 'Introduction for Reactions', 'Identify evidence of chemical change and represent reacting systems.', ['2.B']),
      topic('4.2', 'net-ionic-equations', 'Net Ionic Equations', 'Write balanced net ionic equations for reactions in solution.', ['5.E']),
      topic('4.3', 'representations-reactions', 'Representations of Reactions', 'Connect molecular, ionic, symbolic, and particle representations of reactions.', ['3.B']),
      topic('4.4', 'physical-chemical-changes', 'Physical and Chemical Changes', 'Use evidence to distinguish physical processes from chemical reactions.', ['6.B']),
      topic('4.5', 'stoichiometry', 'Stoichiometry', 'Use balanced equations to calculate amounts consumed and produced.', ['5.C']),
      topic('4.6', 'introduction-titration', 'Introduction to Titration', 'Interpret titration measurements to determine an unknown amount or concentration.', ['3.A']),
      topic('4.7', 'types-chemical-reactions', 'Types of Chemical Reactions', 'Classify reactions by their characteristic particle and species changes.', ['1.B']),
      topic('4.8', 'introduction-acid-base-reactions', 'Introduction to Acid-Base Reactions', 'Represent proton-transfer reactions and identify reacting acid-base pairs.', ['1.B']),
      topic('4.9', 'oxidation-reduction-reactions', 'Oxidation-Reduction (Redox) Reactions', 'Track electron transfer and oxidation states in balanced redox reactions.', ['5.E']),
    ]),
  unit(5, 'kinetics', 'Kinetics',
    'Describe reaction rates and explain them with collision models and mechanisms.', [7, 9], [
      topic('5.1', 'reaction-rates', 'Reaction Rates', 'Measure and explain how concentrations change as reactions proceed.', ['6.E']),
      topic('5.2', 'introduction-rate-law', 'Introduction to Rate Law', 'Relate reaction rate to concentration through an empirical rate law.', ['5.C']),
      topic('5.3', 'concentration-changes-time', 'Concentration Changes Over Time', 'Use integrated relationships and graphs to analyze concentration over time.', ['5.B']),
      topic('5.4', 'elementary-reactions', 'Elementary Reactions', 'Derive a rate expression from the molecularity of an elementary step.', ['5.E']),
      topic('5.5', 'collision-model', 'Collision Model', 'Explain rate changes using collision frequency, orientation, and energy.', ['6.E']),
      topic('5.6', 'reaction-energy-profile', 'Reaction Energy Profile', 'Represent activation energy and energy change on a reaction profile.', ['3.B']),
      topic('5.7', 'introduction-reaction-mechanisms', 'Introduction to Reaction Mechanisms', 'Relate elementary steps and intermediates to an overall reaction.', ['1.B']),
      topic('5.8', 'reaction-mechanism-rate-law', 'Reaction Mechanism and Rate Law', 'Test whether a proposed mechanism agrees with an observed rate law.', ['5.B']),
      topic('5.9', 'pre-equilibrium-approximation', 'Pre-Equilibrium Approximation', 'Derive a rate law when a fast reversible step precedes a slower step.', ['5.B']),
      topic('5.10', 'multistep-reaction-energy-profile', 'Multistep Reaction Energy Profile', 'Construct energy profiles for reactions with multiple elementary steps.', ['3.B']),
      topic('5.11', 'catalysis', 'Catalysis', 'Explain how catalysts change a mechanism and lower its activation barrier.', ['6.E']),
    ]),
  unit(6, 'thermochemistry', 'Thermochemistry',
    'Track energy transfer and calculate enthalpy changes in chemical and physical processes.', [7, 9], [
      topic('6.1', 'endothermic-exothermic-processes', 'Endothermic and Exothermic Processes', 'Classify and explain energy transfer between a system and its surroundings.', ['6.D']),
      topic('6.2', 'energy-diagrams', 'Energy Diagrams', 'Represent relative energy changes for endothermic and exothermic processes.', ['3.A']),
      topic('6.3', 'heat-transfer-thermal-equilibrium', 'Heat Transfer and Thermal Equilibrium', 'Predict heat flow and final conditions as systems approach thermal equilibrium.', ['6.E']),
      topic('6.4', 'heat-capacity-calorimetry', 'Heat Capacity and Calorimetry', 'Use calorimetry data to determine heat, heat capacity, or reaction energy.', ['2.D']),
      topic('6.5', 'energy-phase-changes', 'Energy of Phase Changes', 'Relate phase changes to energy transfer and intermolecular interactions.', ['1.B']),
      topic('6.6', 'introduction-enthalpy-reaction', 'Introduction to Enthalpy of Reaction', 'Calculate and interpret enthalpy change for a chemical reaction.', ['5.F']),
      topic('6.7', 'bond-enthalpies', 'Bond Enthalpies', 'Estimate reaction enthalpy from bonds broken and formed.', ['5.F']),
      topic('6.8', 'enthalpy-formation', 'Enthalpy of Formation', 'Calculate reaction enthalpy using standard formation values.', ['5.F']),
      topic('6.9', 'hess-law', "Hess's Law", 'Combine thermochemical equations and energy changes to obtain a target process.', ['5.A'], [
        { id: '6.9.A', summary: 'Calculate a target enthalpy by adding and scaling known thermochemical equations.' },
        { id: '6.9.B', summary: 'Represent why enthalpy change is independent of the path between initial and final states.' },
      ]),
    ]),
  unit(7, 'equilibrium', 'Equilibrium',
    'Represent dynamic equilibrium and predict composition under changing conditions.', [7, 9], [
      topic('7.1', 'introduction-equilibrium', 'Introduction to Equilibrium', 'Explain dynamic equilibrium using observable behavior and opposing process rates.', ['6.D']),
      topic('7.2', 'direction-reversible-reactions', 'Direction of Reversible Reactions', 'Relate net reaction direction to the forward and reverse rates.', ['4.D']),
      topic('7.3', 'reaction-quotient-equilibrium-constant', 'Reaction Quotient and Equilibrium Constant', 'Construct reaction quotient and equilibrium expressions for reversible systems.', ['3.A']),
      topic('7.4', 'calculating-equilibrium-constant', 'Calculating the Equilibrium Constant', 'Calculate an equilibrium constant from measured equilibrium composition.', ['5.C']),
      topic('7.5', 'magnitude-equilibrium-constant', 'Magnitude of the Equilibrium Constant', 'Interpret constant magnitude as the relative presence of reactants and products.', ['6.D']),
      topic('7.6', 'properties-equilibrium-constant', 'Properties of the Equilibrium Constant', 'Combine, reverse, or scale reactions and determine the resulting equilibrium constant.', ['5.A']),
      topic('7.7', 'calculating-equilibrium-concentrations', 'Calculating Equilibrium Concentrations', 'Determine equilibrium composition from initial conditions and a constant.', ['3.A']),
      topic('7.8', 'representations-equilibrium', 'Representations of Equilibrium', 'Translate equilibrium composition among particle, graphical, and numerical forms.', ['3.C']),
      topic('7.9', 'introduction-le-chatelier-principle', "Introduction to Le Chatelier's Principle", 'Predict how an equilibrium system responds to an imposed change.', ['6.F']),
      topic('7.10', 'reaction-quotient-le-chatelier-principle', "Reaction Quotient and Le Chatelier's Principle", 'Use the relationship between reaction quotient and constant to explain shifts.', ['5.F']),
      topic('7.11', 'introduction-solubility-equilibria', 'Introduction to Solubility Equilibria', 'Represent dissolution equilibria and reason with solubility constants.', ['5.B']),
      topic('7.12', 'common-ion-effect', 'Common-Ion Effect', 'Explain and predict how a shared ion changes solubility equilibrium.', ['2.F']),
    ]),
  unit(8, 'acids-bases', 'Acids and Bases',
    'Analyze acid-base equilibria, buffers, titrations, and structural effects on acidity.', [11, 15], [
      topic('8.1', 'introduction-acids-bases', 'Introduction to Acids and Bases', 'Identify acids, bases, conjugate pairs, and proton-transfer behavior.', ['5.B']),
      topic('8.2', 'ph-poh-strong-acids-bases', 'pH and pOH of Strong Acids and Bases', 'Calculate hydrogen or hydroxide concentration and pH for strong species.', ['5.B']),
      topic('8.3', 'weak-acid-base-equilibria', 'Weak Acid and Base Equilibria', 'Determine equilibrium composition and pH for weak acids and bases.', ['5.C']),
      topic('8.4', 'acid-base-reactions-buffers', 'Acid-Base Reactions and Buffers', 'Use stoichiometry and equilibrium reasoning for mixtures that can buffer pH.', ['5.F']),
      topic('8.5', 'acid-base-titrations', 'Acid-Base Titrations', 'Interpret titration curves and calculations across stages of a titration.', ['5.D']),
      topic('8.6', 'molecular-structure-acids-bases', 'Molecular Structure of Acids and Bases', 'Explain relative acid-base strength using molecular structure and bonding.', ['6.C']),
      topic('8.7', 'ph-pka', 'pH and pKa', 'Relate pH, acid strength, and conjugate-pair composition.', ['2.D']),
      topic('8.8', 'properties-buffers', 'Properties of Buffers', 'Explain how buffer components resist changes in pH.', ['6.D']),
      topic('8.9', 'henderson-hasselbalch-equation', 'Henderson-Hasselbalch Equation', 'Use the buffer equation to relate pH, pKa, and conjugate concentrations.', ['5.F']),
      topic('8.10', 'buffer-capacity', 'Buffer Capacity', 'Predict how composition and amount affect a buffer response.', ['6.G']),
      topic('8.11', 'ph-solubility', 'pH and Solubility', 'Explain how acid-base conditions alter dissolution equilibria.', ['2.D']),
    ]),
  unit(9, 'thermodynamics-electrochemistry', 'Thermodynamics and Electrochemistry',
    'Use entropy and free energy to predict favorability and analyze electrochemical cells.', [7, 9], [
      topic('9.1', 'introduction-entropy', 'Introduction to Entropy', 'Predict qualitative entropy changes from particle dispersal and energy distribution.', ['6.C']),
      topic('9.2', 'absolute-entropy-entropy-change', 'Absolute Entropy and Entropy Change', 'Calculate reaction entropy from standard molar entropy data.', ['5.F']),
      topic('9.3', 'gibbs-free-energy-thermodynamic-favorability', 'Gibbs Free Energy and Thermodynamic Favorability', 'Relate enthalpy, entropy, temperature, and free energy to favorability.', ['6.E']),
      topic('9.4', 'thermodynamic-kinetic-control', 'Thermodynamic and Kinetic Control', 'Distinguish favorable processes from processes that occur at an observable rate.', ['6.E']),
      topic('9.5', 'free-energy-equilibrium', 'Free Energy and Equilibrium', 'Connect reaction free energy, equilibrium composition, and the equilibrium constant.', ['6.D']),
      topic('9.6', 'free-energy-dissolution', 'Free Energy of Dissolution', 'Explain dissolution favorability through competing enthalpy and entropy effects.', ['4.D']),
      topic('9.7', 'coupled-reactions', 'Coupled Reactions', 'Explain how combining processes can produce a favorable overall reaction.', ['4.D']),
      topic('9.8', 'galvanic-electrolytic-cells', 'Galvanic (Voltaic) and Electrolytic Cells', 'Analyze electron flow, cell components, potentials, and electrolysis.', ['2.F']),
    ]),
])

export const apChemistryFramework = Object.freeze({
  id: AP_CHEMISTRY_FRAMEWORK_ID,
  title: 'AP Chemistry framework',
  effectiveDate: '2024-FALL',
  reviewStatus: 'reviewed',
  lastVerifiedDate: '2026-07-18',
  sourceIds: Object.freeze([
    'ap-chemistry-ced-fall-2024',
    'ap-chemistry-exam-2026',
    'ap-chemistry-reference-2026',
    'ap-chemistry-released-frqs',
    'ap-course-exam-change-log',
  ]),
  sciencePractices: apChemistrySciencePractices,
  units: apChemistryUnits,
})

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function validateApChemistryFramework(framework = apChemistryFramework, sources = apChemistrySources) {
  const errors = [...validateSourceRegistry(sources).errors]
  const sourceIds = new Set(sources.map((source) => source.id))
  const seenIds = new Set()
  const officialNumbers = new Set()
  const subskillIds = new Set()

  if (framework?.id !== AP_CHEMISTRY_FRAMEWORK_ID) errors.push(`framework.id must be ${AP_CHEMISTRY_FRAMEWORK_ID}`)
  if (framework?.reviewStatus !== 'reviewed') errors.push('framework.reviewStatus must be reviewed')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(framework?.lastVerifiedDate || '')) errors.push('framework.lastVerifiedDate must be an ISO date')
  for (const sourceId of framework?.sourceIds || []) {
    if (!sourceIds.has(sourceId)) errors.push(`unknown framework source: ${sourceId}`)
  }

  for (const practice of framework?.sciencePractices || []) {
    if (!ID_PATTERN.test(practice.id || '') || seenIds.has(practice.id)) errors.push(`invalid or duplicate practice id: ${practice.id || '(missing)'}`)
    seenIds.add(practice.id)
    if (!/^[1-6]$/.test(practice.officialNumber || '') || !nonEmpty(practice.label) || !nonEmpty(practice.summary)) {
      errors.push(`${practice.id || '(missing practice)'}: practice metadata is incomplete`)
    }
    for (const subskill of practice.subskills || []) {
      if (!SUBSKILL_PATTERN.test(subskill.id || '') || subskillIds.has(subskill.id)) errors.push(`invalid or duplicate subskill id: ${subskill.id || '(missing)'}`)
      if (!subskill.id?.startsWith(`${practice.officialNumber}.`)) errors.push(`${subskill.id}: subskill belongs to the wrong practice`)
      if (!nonEmpty(subskill.summary)) errors.push(`${subskill.id}: subskill summary is required`)
      subskillIds.add(subskill.id)
    }
  }

  if (framework?.units?.length !== 9) errors.push('AP Chemistry framework must contain exactly nine units')
  framework?.units?.forEach((courseUnit, index) => {
    const prefix = courseUnit?.id || '(missing unit)'
    if (!ID_PATTERN.test(courseUnit?.id || '') || seenIds.has(courseUnit.id)) errors.push(`invalid or duplicate unit id: ${prefix}`)
    seenIds.add(courseUnit?.id)
    if (courseUnit.order !== index + 1 || courseUnit.officialNumber !== String(index + 1)) errors.push(`${prefix}: unit order and officialNumber must match position`)
    if (!nonEmpty(courseUnit.label) || !nonEmpty(courseUnit.description)) errors.push(`${prefix}: label and original description are required`)
    const weighting = courseUnit.weighting
    if (weighting?.section !== 'multiple-choice' || !Number.isInteger(weighting?.minPercent)
      || !Number.isInteger(weighting?.maxPercent) || weighting.minPercent < 0 || weighting.maxPercent > 100
      || weighting.minPercent > weighting.maxPercent) errors.push(`${prefix}: invalid multiple-choice weighting`)
    if (!Array.isArray(courseUnit.topics) || !courseUnit.topics.length) errors.push(`${prefix}: topics are required`)

    for (const courseTopic of courseUnit.topics || []) {
      const match = OFFICIAL_TOPIC_PATTERN.exec(courseTopic.officialNumber || '')
      if (!ID_PATTERN.test(courseTopic.id || '') || seenIds.has(courseTopic.id)) errors.push(`invalid or duplicate topic id: ${courseTopic.id || '(missing)'}`)
      seenIds.add(courseTopic.id)
      if (!match || match[1] !== courseUnit.officialNumber || officialNumbers.has(courseTopic.officialNumber)) {
        errors.push(`${courseTopic.id}: invalid, duplicate, or incorrectly owned official topic number`)
      }
      officialNumbers.add(courseTopic.officialNumber)
      if (!nonEmpty(courseTopic.label) || !nonEmpty(courseTopic.summary)) errors.push(`${courseTopic.id}: label and original summary are required`)
      if (!Array.isArray(courseTopic.practiceIds) || !courseTopic.practiceIds.length) errors.push(`${courseTopic.id}: practiceIds are required`)
      for (const practiceId of courseTopic.practiceIds || []) {
        if (!subskillIds.has(practiceId)) errors.push(`${courseTopic.id}: unknown practice subskill ${practiceId}`)
      }
      if (!Array.isArray(courseTopic.learningObjectives) || !courseTopic.learningObjectives.length) errors.push(`${courseTopic.id}: learning objectives are required`)
      for (const objective of courseTopic.learningObjectives || []) {
        const objectiveMatch = OBJECTIVE_PATTERN.exec(objective.id || '')
        if (!objectiveMatch || objectiveMatch[1] !== courseTopic.officialNumber || seenIds.has(objective.id)) {
          errors.push(`${courseTopic.id}: invalid, duplicate, or incorrectly owned learning objective ${objective.id || '(missing)'}`)
        }
        if (!nonEmpty(objective.summary)) errors.push(`${objective.id}: original summary is required`)
        seenIds.add(objective.id)
      }
    }
  })

  return { valid: errors.length === 0, errors }
}

export function assertValidApChemistryFramework(framework = apChemistryFramework, sources = apChemistrySources) {
  const result = validateApChemistryFramework(framework, sources)
  if (!result.valid) throw new Error(`AP Chemistry framework validation failed:\n- ${result.errors.join('\n- ')}`)
  return framework
}

assertValidApChemistryFramework()
