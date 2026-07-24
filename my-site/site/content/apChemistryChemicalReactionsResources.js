import { assertValidEditorialCatalog } from './editorialSchema.js'

const UNIT_ID = 'chemical-reactions'
const UPDATED_AT = '2026-07-24'

function review() {
  return {
    status: 'draft',
    revision: 1,
    authoredBy: 'codex-ai-assisted-draft',
    updatedAt: UPDATED_AT,
    reviewers: [],
    history: [{ status: 'draft', date: UPDATED_AT, actor: 'codex-ai-assisted-draft' }],
  }
}

function provenance() {
  return {
    kind: 'ai-generated',
    name: 'Study AI Helper original AP Chemistry draft',
    sourceIds: ['ap-chemistry-ced-fall-2024', 'ap-chemistry-reference-2026'],
    originalityNote: 'Independently written from canonical framework and exam-reference metadata; no released-question wording, values, diagrams, or scoring language was used.',
  }
}

function alignment(skillIds, learningObjectiveIds, sciencePracticeIds) {
  return {
    frameworkId: 'ap-chemistry-fall-2024',
    subjectId: 'ap-chemistry',
    domainId: UNIT_ID,
    skillIds,
    learningObjectiveIds,
    sciencePracticeIds,
  }
}

function formula(definition) {
  return {
    kind: 'formula',
    schemaVersion: 1,
    review: review(),
    provenance: provenance(),
    conceptGroup: 'stoichiometry-and-reactions',
    ...definition,
  }
}

function lesson(definition) {
  return {
    kind: 'lesson',
    schemaVersion: 1,
    review: review(),
    provenance: provenance(),
    ...definition,
  }
}

const resources = [
  formula({
    id: 'chemical-reactions-balanced-equation-ratios',
    title: 'Balanced-equation amount ratios',
    summary: 'Translate coefficients in a balanced equation into proportional reacting and produced amounts without changing chemical formulas.',
    alignment: alignment(['stoichiometry'], ['4.5.A'], ['5.C']),
    examReference: {
      status: 'not-provided',
      sourceId: 'ap-chemistry-reference-2026',
      note: 'The current exam reference information does not print a separate coefficient-ratio formula; the relationship follows from the balanced chemical equation.',
    },
    expression: 'For a A + b B -> c C + d D, nA/a = nB/b = nC/c = nD/d for stoichiometrically related changes',
    variables: [
      { symbol: 'nX', meaning: 'amount of species X consumed or produced', units: 'mol' },
      { symbol: 'a, b, c, d', meaning: 'whole-number coefficients in the balanced equation', units: 'none' },
    ],
    assumptions: [
      'The chemical equation is correctly balanced.',
      'Amounts refer to the same reaction event or reaction extent.',
      'A limiting reactant may cap the amount that can react.',
    ],
    appliesWhen: [
      'Converting an amount of one reactant or product into another.',
      'Determining limiting reactant, theoretical yield, or remaining excess reactant.',
    ],
    doesNotApplyWhen: [
      'Using subscripts as if they were adjustable coefficients.',
      'Comparing initial amounts without first identifying which reactant limits the reaction.',
    ],
    rearrangements: [
      'nB = nA(b/a)',
      'nC = nA(c/a)',
      'Excess remaining = initial excess amount - amount consumed.',
    ],
    workedExample: {
      prompt: 'For 2 Al + 3 Cl2 -> 2 AlCl3, how much AlCl3 can form from 0.240 mol Cl2 with excess Al?',
      steps: [
        'Use the product-to-reactant coefficient ratio 2 mol AlCl3 per 3 mol Cl2.',
        'Calculate (0.240 mol Cl2)(2 mol AlCl3/3 mol Cl2).',
        'Report the amount with three significant figures.',
      ],
      answer: '0.160 mol AlCl3 can form.',
    },
    commonMistake: 'Using a 1:1 amount ratio because the formulas each appear once in the written equation.',
  }),
  formula({
    id: 'chemical-reactions-solution-amount',
    title: 'Amount delivered by a solution',
    summary: 'Convert solution concentration and delivered volume into the amount of a dissolved reactant.',
    alignment: alignment(['stoichiometry', 'introduction-titration'], ['4.5.A', '4.6.A'], ['5.C', '3.A']),
    examReference: {
      status: 'provided',
      sourceId: 'ap-chemistry-reference-2026',
      note: 'The current exam reference information provides molarity as amount of solute per liter of solution.',
    },
    expression: 'n = cV',
    variables: [
      { symbol: 'n', meaning: 'amount of dissolved solute delivered', units: 'mol' },
      { symbol: 'c', meaning: 'molar concentration of the solution', units: 'mol/L' },
      { symbol: 'V', meaning: 'delivered solution volume', units: 'L' },
    ],
    assumptions: [
      'Volume is converted to liters when concentration is in moles per liter.',
      'The concentration and volume describe the same solution aliquot.',
      'The dissolved species is counted using the formula required by the balanced equation.',
    ],
    appliesWhen: [
      'Finding reactant amount from a measured solution volume.',
      'Starting a titration or precipitation stoichiometry calculation.',
    ],
    doesNotApplyWhen: [
      'Using milliliters directly with mol/L without conversion.',
      'Assuming the solution amount equals the amount of every ion without dissociation stoichiometry.',
    ],
    rearrangements: [
      'c = n/V',
      'V = n/c',
      'Combine n = cV with a balanced-equation coefficient ratio.',
    ],
    workedExample: {
      prompt: 'How many moles of NaOH are delivered by 18.40 mL of 0.1250 M NaOH?',
      steps: [
        'Convert 18.40 mL to 0.01840 L.',
        'Use n = cV.',
        'Multiply (0.1250 mol/L)(0.01840 L).',
      ],
      answer: '2.300 x 10^-3 mol NaOH are delivered.',
    },
    commonMistake: 'Substituting 18.40 as liters and obtaining an amount one thousand times too large.',
  }),
  formula({
    id: 'chemical-reactions-titration-stoichiometry',
    title: 'Titration equivalence accounting',
    summary: 'Connect measured solution volumes and concentrations through the balanced-equation ratio at equivalence.',
    alignment: alignment(['introduction-titration'], ['4.6.A'], ['3.A', '5.C']),
    examReference: {
      status: 'partly-provided',
      sourceId: 'ap-chemistry-reference-2026',
      note: 'The current exam reference information provides molarity; the equivalence relationship must be derived from n = cV and the balanced-equation coefficients.',
    },
    expression: 'For a A + b B -> products at equivalence, cA VA/a = cB VB/b',
    variables: [
      { symbol: 'cA, cB', meaning: 'molar concentrations of reacting solutions A and B', units: 'mol/L' },
      { symbol: 'VA, VB', meaning: 'reacting solution volumes at equivalence', units: 'the same volume unit' },
      { symbol: 'a, b', meaning: 'balanced-equation coefficients for A and B', units: 'none' },
    ],
    assumptions: [
      'The endpoint measurement is a suitable estimate of the equivalence point.',
      'The reacting species follow the stated balanced equation without important side reactions.',
      'Concordant trials are selected before averaging.',
    ],
    appliesWhen: [
      'Finding an unknown concentration from a titration.',
      'Checking whether a proposed equivalence volume is consistent with reaction stoichiometry.',
    ],
    doesNotApplyWhen: [
      'Using equal volumes as the definition of equivalence.',
      'A polyprotic or other non-one-to-one reaction is treated as one-to-one without using coefficients.',
    ],
    rearrangements: [
      'cA = a cB VB/(b VA)',
      'VB = b cA VA/(a cB)',
      'For a one-to-one reaction only, cA VA = cB VB.',
    ],
    workedExample: {
      prompt: 'A 20.00 mL monoprotic acid sample requires 18.40 mL of 0.1250 M NaOH. Find the acid concentration.',
      steps: [
        'The net reaction is one-to-one, so acid amount equals NaOH amount at equivalence.',
        'Use cacid = cbase Vbase/Vacid.',
        'Calculate (0.1250 M)(18.40 mL)/(20.00 mL).',
      ],
      answer: 'The acid concentration is 0.1150 M.',
    },
    commonMistake: 'Averaging every trial, including a rough or visibly discordant titre, before calculating the concentration.',
  }),
  lesson({
    id: 'chemical-reactions-representations-and-classification',
    title: 'Reading reactions across equations, particles, and evidence',
    summary: 'Connect macroscopic evidence to conserved particle models, net ionic equations, acid-base transfer, and oxidation-reduction classification.',
    alignment: alignment(
      ['introduction-reactions', 'net-ionic-equations', 'representations-reactions', 'physical-chemical-changes', 'types-chemical-reactions', 'introduction-acid-base-reactions', 'oxidation-reduction-reactions'],
      ['4.1.A', '4.2.A', '4.3.A', '4.4.A', '4.7.A', '4.8.A', '4.9.A'],
      ['1.B', '2.B', '3.B', '5.E', '6.B'],
    ),
    prerequisites: [
      'Chemical formulas, phases, ionic charges, and balanced equations.',
      'Particle diagrams and conservation of atoms and charge.',
      'Basic ideas of proton and electron transfer.',
    ],
    sections: [
      {
        heading: 'Evidence supports a particle-level claim',
        body: 'Color change, gas formation, a precipitate, or energy transfer may support a chemical-change claim, but no observation identifies a reaction by itself. A strong explanation names the species before and after, preserves every atom and total charge, and distinguishes a rearrangement of bonds from a physical change in spacing or phase.',
      },
      {
        heading: 'Move among molecular, complete ionic, and net ionic equations',
        body: 'Begin with valid formulas and balance using coefficients. For aqueous strong electrolytes, separate soluble species into ions in the complete ionic equation. Cancel only ions that appear unchanged on both sides. The remaining net ionic equation shows the particles that actually change.',
      },
      {
        heading: 'Classify by the change, not by the appearance',
        body: 'Precipitation produces an insoluble solid from dissolved ions. Acid-base reactions transfer a proton, even when no reactant formula contains OH-. Redox reactions transfer electrons or change oxidation numbers, even when oxygen is absent. Some reactions fit more than one useful description, so classification should cite the defining particle change.',
      },
    ],
    workedExamples: [
      {
        prompt: 'Mix aqueous BaCl2 and Na2SO4. Write the net ionic equation and identify the spectators.',
        steps: [
          'Use solubility behavior to identify BaSO4(s) as the precipitate.',
          'Write Ba2+(aq) + 2 Cl-(aq) + 2 Na+(aq) + SO4^2-(aq) -> BaSO4(s) + 2 Na+(aq) + 2 Cl-(aq).',
          'Cancel Na+ and Cl-, which remain unchanged in aqueous form.',
        ],
        answer: 'Ba2+(aq) + SO4^2-(aq) -> BaSO4(s); Na+ and Cl- are spectator ions.',
      },
      {
        prompt: 'Classify Zn(s) + Cu2+(aq) -> Zn2+(aq) + Cu(s) using oxidation numbers.',
        steps: [
          'Zn changes from 0 to +2, so it loses two electrons and is oxidized.',
          'Cu changes from +2 to 0, so it gains two electrons and is reduced.',
          'The coupled oxidation-number changes establish electron transfer.',
        ],
        answer: 'The reaction is redox: Zn is oxidized and Cu2+ is reduced.',
      },
    ],
    misconceptions: [
      { id: 'reaction-evidence-proves-identity', claim: 'One visible observation proves a particular reaction.', correction: 'Connect multiple observations to a balanced particle-level model and consider physical alternatives.' },
      { id: 'spectator-ion-in-net-ionic', claim: 'Every dissolved ion belongs in the net ionic equation.', correction: 'Cancel aqueous ions that remain chemically unchanged.' },
      { id: 'particle-count-conservation-only', claim: 'The number of particles must stay constant.', correction: 'Conserve each element and total charge; particle count may change.' },
      { id: 'phase-change-always-chemical', claim: 'A phase change creates a new substance.', correction: 'Check whether bonded particle identity changes.' },
      { id: 'reaction-type-by-appearance', claim: 'Appearance alone determines reaction type.', correction: 'Use the balanced equation and defining particle transfer or rearrangement.' },
      { id: 'acid-base-requires-hydroxide', claim: 'Every base contains hydroxide.', correction: 'A base can instead be identified as a proton acceptor.' },
      { id: 'redox-requires-oxygen', claim: 'Every redox reaction contains oxygen.', correction: 'Track electrons or oxidation numbers rather than searching for oxygen.' },
    ],
    retrievalChecks: [
      { prompt: 'What must be conserved in every correctly represented chemical reaction?', answer: 'The count of each element and total electric charge.' },
      { prompt: 'Why is Na+ omitted from a net ionic equation when it remains Na+(aq) throughout?', answer: 'It is a spectator ion because its chemical form and phase do not change.' },
      { prompt: 'Can NH3 act as a base even though its formula lacks OH-?', answer: 'Yes. It accepts a proton to form NH4+.' },
      { prompt: 'What evidence establishes that Zn(s) + Cu2+(aq) is redox?', answer: 'Zn loses electrons as its oxidation number rises from 0 to +2, while Cu2+ gains electrons as its oxidation number falls to 0.' },
    ],
    formulaIds: ['chemical-reactions-balanced-equation-ratios'],
  }),
  lesson({
    id: 'chemical-reactions-quantities-and-titration',
    title: 'Reaction quantities, limiting reactants, and titration',
    summary: 'Build a reliable quantitative chain from a balanced equation through solution amount, limiting reactant, equivalence, and experimental evidence.',
    alignment: alignment(
      ['stoichiometry', 'introduction-titration', 'net-ionic-equations', 'representations-reactions'],
      ['4.5.A', '4.6.A', '4.2.A', '4.3.A'],
      ['3.A', '3.B', '5.C', '5.E'],
    ),
    prerequisites: [
      'Molar mass, molarity, and unit conversion.',
      'Balanced molecular and net ionic equations.',
      'Significant figures and selecting concordant measurements.',
    ],
    sections: [
      {
        heading: 'Let the balanced equation control every conversion',
        body: 'Coefficients describe ratios of reacting amounts. Convert each available reactant to a common reaction extent or predicted product amount; the smaller permitted extent identifies the limiting reactant. Never alter subscripts to force a balance because that changes chemical identity.',
      },
      {
        heading: 'Treat titration as measured stoichiometry',
        body: 'A buret measures delivered volume. Concentration times volume gives delivered amount, and the balanced equation relates that amount to the analyte. Equivalence is a mole-ratio condition, not an equal-volume condition. Concordant trials should agree closely enough to represent the same endpoint technique.',
      },
      {
        heading: 'Check the result chemically',
        body: 'A complete result includes units, sensible significant figures, and a particle-level check. Before equivalence, the analyte may remain in excess; after equivalence, titrant may remain. A net ionic equation helps identify which species is consumed and which ions merely accompany the reacting particles.',
      },
    ],
    workedExamples: [
      {
        prompt: 'A 20.00 mL acid sample is titrated with 0.1250 M NaOH. Concordant titres are 18.38, 18.40, and 18.39 mL. Find the concentration for a one-to-one reaction.',
        steps: [
          'Average the concordant titres: 18.39 mL.',
          'Calculate NaOH amount: (0.1250 mol/L)(0.01839 L) = 0.00229875 mol.',
          'Use the one-to-one ratio and divide by 0.02000 L acid.',
        ],
        answer: 'The acid concentration is 0.1149 M.',
      },
      {
        prompt: 'Mix 0.0200 mol Ag+ with 0.0150 mol Cl-. Identify the limiting ion and amount of AgCl formed.',
        steps: [
          'Use Ag+(aq) + Cl-(aq) -> AgCl(s).',
          'The coefficient ratio is one-to-one, and Cl- has the smaller initial amount.',
          'Consume 0.0150 mol of each ion and form 0.0150 mol AgCl.',
        ],
        answer: 'Cl- is limiting; 0.0150 mol AgCl forms and 0.0050 mol Ag+ remains.',
      },
    ],
    misconceptions: [
      { id: 'coefficients-change-subscripts', claim: 'Changing subscripts is an acceptable balancing strategy.', correction: 'Preserve formulas and change only coefficients.' },
      { id: 'titration-equal-volumes', claim: 'Equivalence requires equal solution volumes.', correction: 'Use concentration, volume, and the balanced coefficient ratio.' },
      { id: 'spectator-ion-in-net-ionic', claim: 'Spectator ions determine the reacting mole ratio.', correction: 'Base the ratio on species retained in the balanced net ionic reaction.' },
      { id: 'particle-count-conservation-only', claim: 'A quantitative answer is valid whenever the total particle count matches.', correction: 'Check element counts, charge, and stoichiometric amount relationships.' },
    ],
    retrievalChecks: [
      { prompt: 'What quantity should be compared to identify a limiting reactant?', answer: 'The reaction extent or amount of a common product each reactant can support using the balanced coefficients.' },
      { prompt: 'What does a titre measure directly?', answer: 'The volume of titrant delivered from the buret.' },
      { prompt: 'At equivalence, what relationship is guaranteed?', answer: 'The reacting amounts satisfy the balanced-equation coefficient ratio.' },
      { prompt: 'For a one-to-one precipitation with 0.0150 mol limiting ion, how much precipitate forms?', answer: '0.0150 mol, assuming complete stoichiometric reaction.' },
    ],
    formulaIds: [
      'chemical-reactions-balanced-equation-ratios',
      'chemical-reactions-solution-amount',
      'chemical-reactions-titration-stoichiometry',
    ],
  }),
  {
    id: 'chemical-reactions-monoprotic-acid-titration-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Monoprotic acid titration trials',
    summary: 'An original set of buret measurements for selecting concordant trials, calculating an acid concentration, and interpreting the reacting ions.',
    alignment: alignment(
      ['introduction-titration', 'net-ionic-equations', 'introduction-acid-base-reactions'],
      ['4.6.A', '4.2.A', '4.8.A'],
      ['1.B', '3.A', '5.E'],
    ),
    review: review(),
    provenance: provenance(),
    context: 'A student transfers 20.00 mL of an unknown strong monoprotic acid to a flask and titrates it with 0.1250 M NaOH. A rough trial locates the endpoint; three later trials use the same indicator and careful dropwise delivery near the endpoint.',
    representation: {
      type: 'table',
      caption: 'NaOH volumes delivered in four titration trials',
      columns: ['Trial', 'Role', 'NaOH delivered (mL)'],
      rows: [
        ['1', 'Rough', '18.92'],
        ['2', 'Careful', '18.38'],
        ['3', 'Careful', '18.40'],
        ['4', 'Careful', '18.39'],
      ],
      accessibleDescription: 'The rough trial used 18.92 milliliters of sodium hydroxide. Three careful trials used 18.38, 18.40, and 18.39 milliliters. The three careful trials are concordant and have a mean of 18.39 milliliters.',
    },
  },
  {
    id: 'chemical-reactions-carbonate-gas-evolution-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Carbonate and acid gas-evolution trials',
    summary: 'An original reaction-series data set for connecting a net ionic equation, limiting-reactant reasoning, and a product plateau.',
    alignment: alignment(
      ['net-ionic-equations', 'representations-reactions', 'stoichiometry'],
      ['4.2.A', '4.3.A', '4.5.A'],
      ['3.B', '4.B', '5.C', '5.E'],
    ),
    review: review(),
    provenance: provenance(),
    context: 'In each trial, a student places a solution containing 0.00400 mol CO3^2- into a sealed reaction vessel, injects a measured amount of strong acid, and collects the CO2 produced. The net reaction goes to completion. Small gas losses during collection account for measured amounts slightly below the stoichiometric predictions.',
    representation: {
      type: 'table',
      caption: 'Initial reacting amounts and measured carbon dioxide in four gas-evolution trials',
      columns: ['Trial', 'Initial CO3^2- (mol)', 'Initial H+ (mol)', 'Measured CO2 (mol)'],
      rows: [
        ['1', '0.00400', '0.00300', '0.00147'],
        ['2', '0.00400', '0.00600', '0.00295'],
        ['3', '0.00400', '0.00900', '0.00394'],
        ['4', '0.00400', '0.01200', '0.00395'],
      ],
      accessibleDescription: 'All four trials begin with 0.00400 mole carbonate. Initial hydrogen ion amounts increase from 0.00300 to 0.00600, 0.00900, and 0.01200 mole. Measured carbon dioxide amounts are 0.00147, 0.00295, 0.00394, and 0.00395 mole, respectively. Carbon dioxide production rises for the first three trials and is nearly unchanged between trials 3 and 4.',
    },
  },
  {
    id: 'chemical-reactions-silver-chloride-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: silver chloride precipitation',
    summary: 'A four-point rubric for a net ionic equation, limiting ion, precipitate mass, and remaining species.',
    alignment: alignment(
      ['net-ionic-equations', 'stoichiometry', 'representations-reactions'],
      ['4.2.A', '4.5.A', '4.3.A'],
      ['3.B', '5.C', '5.E'],
    ),
    review: review(),
    provenance: provenance(),
    questionId: 'ap-chem-chemical-reactions-short-frq-001',
    maxPoints: 4,
    parts: [
      { id: 'part-a', prompt: 'Write the net ionic equation.', points: [{ id: 'a-net-ionic', criterion: 'Writes a balanced precipitation equation with phases and charge conserved.', acceptableEvidence: 'Ag+(aq) + Cl-(aq) -> AgCl(s).' }] },
      { id: 'part-b', prompt: 'Identify the limiting ion.', points: [{ id: 'b-limiting', criterion: 'Compares reacting amounts using the one-to-one ratio.', acceptableEvidence: 'Identifies Cl- as limiting because 0.0150 mol is less than 0.0200 mol Ag+.' }] },
      { id: 'part-c', prompt: 'Calculate precipitate mass.', points: [{ id: 'c-mass', criterion: 'Converts limiting-ion amount to AgCl mass.', acceptableEvidence: 'Calculates (0.0150 mol)(143.32 g/mol) = 2.15 g AgCl.' }] },
      { id: 'part-d', prompt: 'Describe the final particle inventory.', points: [{ id: 'd-inventory', criterion: 'Accounts for excess and spectator ions after reaction.', acceptableEvidence: 'Reports 0.0050 mol Ag+ remaining, Na+ and NO3- as spectators, and 0.0150 mol AgCl(s); a complete inventory may also state 0.0150 mol Na+ and 0.0200 mol NO3-.' }] },
    ],
  },
  {
    id: 'chemical-reactions-metal-displacement-long-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: metal displacement analysis',
    summary: 'A seven-point rubric for reaction stoichiometry, molar mass, remaining solution composition, half-reactions, and error direction.',
    alignment: alignment(
      ['stoichiometry', 'oxidation-reduction-reactions', 'representations-reactions'],
      ['4.5.A', '4.9.A', '4.3.A'],
      ['3.B', '5.C', '5.E', '6.B'],
    ),
    review: review(),
    provenance: provenance(),
    questionId: 'ap-chem-chemical-reactions-long-frq-001',
    maxPoints: 7,
    parts: [
      { id: 'part-a', prompt: 'Calculate deposited Cu amount.', points: [{ id: 'a-copper-amount', criterion: 'Converts copper mass to amount.', acceptableEvidence: 'Calculates 0.762 g/63.55 g mol^-1 = 0.01199 mol Cu.' }] },
      { id: 'part-b', prompt: 'Calculate reacted M amount.', points: [{ id: 'b-metal-amount', criterion: 'Uses the two-to-three M-to-Cu coefficient ratio.', acceptableEvidence: 'Calculates (2/3)(0.01199 mol) = 0.007994 mol M.' }] },
      { id: 'part-c', prompt: 'Determine the molar mass of M.', points: [{ id: 'c-molar-mass', criterion: 'Divides the original metal mass by its reacted amount.', acceptableEvidence: 'Calculates approximately 67.6 g/mol.' }] },
      {
        id: 'part-d',
        prompt: 'Determine final Cu2+ and M3+ concentrations.',
        points: [
          { id: 'd-copper-concentration', criterion: 'Subtracts consumed Cu2+ from the initial amount and divides by final volume.', acceptableEvidence: 'Uses 0.01500 - 0.01199 = 0.003009 mol and obtains [Cu2+] = 0.0602 M.' },
          { id: 'd-metal-concentration', criterion: 'Uses reacted M amount and final volume for M3+.', acceptableEvidence: 'Obtains [M3+] = 0.007994 mol/0.05000 L = 0.160 M.' },
        ],
      },
      { id: 'part-e', prompt: 'Write oxidation and reduction half-reactions.', points: [{ id: 'e-half-reactions', criterion: 'Balances atoms and electrons in both half-reactions.', acceptableEvidence: 'M(s) -> M3+(aq) + 3 e- and Cu2+(aq) + 2 e- -> Cu(s).' }] },
      { id: 'part-f', prompt: 'Analyze wet-product error.', points: [{ id: 'f-error', criterion: 'Propagates an excessive measured copper mass to the inferred metal molar mass.', acceptableEvidence: 'Wet copper makes calculated Cu and M amounts too high, so dividing fixed M mass by an excessive M amount makes the calculated molar mass too low.' }] },
    ],
  },
]

export const apChemistryChemicalReactionsResources = Object.freeze(
  assertValidEditorialCatalog(resources).map((resource) => Object.freeze(resource)),
)
