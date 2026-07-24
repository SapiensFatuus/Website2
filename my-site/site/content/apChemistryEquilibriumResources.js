import { assertValidEditorialCatalog } from './editorialSchema.js'

const draftReview = Object.freeze({
  status: 'draft',
  revision: 1,
  authoredBy: 'codex-ai-assisted-draft',
  updatedAt: '2026-07-20',
  reviewers: Object.freeze([]),
  history: Object.freeze([{ status: 'draft', date: '2026-07-20', actor: 'codex-ai-assisted-draft' }]),
})

const originalProvenance = Object.freeze({
  kind: 'ai-generated',
  name: 'Study AI Helper original AP Chemistry draft',
  sourceIds: Object.freeze(['ap-chemistry-ced-fall-2024', 'ap-chemistry-reference-2026']),
  originalityNote: 'Independently written instructional content aligned to framework metadata; no past-exam wording, values, diagrams, or scoring language was used.',
})

function alignment(skillIds, learningObjectiveIds, sciencePracticeIds) {
  return Object.freeze({
    frameworkId: 'ap-chemistry-fall-2024',
    subjectId: 'ap-chemistry',
    domainId: 'equilibrium',
    skillIds: Object.freeze(skillIds),
    learningObjectiveIds: Object.freeze(learningObjectiveIds),
    sciencePracticeIds: Object.freeze(sciencePracticeIds),
  })
}

const resources = [
  {
    id: 'equilibrium-reaction-quotient',
    kind: 'formula',
    schemaVersion: 1,
    title: 'Reaction quotient for concentration data',
    summary: 'Use the current composition of a mixture to determine which net reaction direction will move it toward equilibrium.',
    alignment: alignment(
      ['reaction-quotient-equilibrium-constant', 'reaction-quotient-le-chatelier-principle'],
      ['7.3.A', '7.10.A'],
      ['5.B', '5.F'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    conceptGroup: 'composition-and-direction',
    examReference: {
      status: 'partly-provided',
      sourceId: 'ap-chemistry-reference-2026',
      note: 'The 2026 exam reference information provides the concentration equilibrium-constant form. Using that same structure for a current, nonequilibrium composition as Qc is a reasoning step students must recognize.',
    },
    expression: 'For aA(g) + bB(g) <=> cC(g) + dD(g), Qc = ([C]^c[D]^d)/([A]^a[B]^b)',
    variables: [
      { symbol: 'Qc', meaning: 'reaction quotient calculated from the mixture at the current moment', units: 'dimensionless when expressed through standard-state activities' },
      { symbol: '[X]', meaning: 'molar concentration of gaseous or aqueous species X', units: 'mol/L' },
      { symbol: 'a, b, c, d', meaning: 'stoichiometric coefficients in the balanced reaction as written', units: 'none' },
    ],
    assumptions: [
      'The chemical equation is balanced and written in the direction being analyzed.',
      'Concentrations consistently represent the same instant and temperature.',
      'Pure solids and pure liquids have constant activity and are omitted from the expression.',
    ],
    appliesWhen: [
      'Comparing a current gas-phase or solution mixture with its equilibrium composition.',
      'Predicting net reaction direction by comparing Qc with Kc at the same temperature.',
    ],
    doesNotApplyWhen: [
      'The provided values are partial pressures and the requested expression is specifically Qp.',
      'The mixture temperature differs from the temperature associated with the stated equilibrium constant.',
    ],
    rearrangements: [
      'Q < K means the net reaction proceeds toward products until Q increases to K.',
      'Q > K means the net reaction proceeds toward reactants until Q decreases to K.',
      'Q = K means there is no net composition change, although both directions continue microscopically.',
    ],
    workedExample: {
      prompt: 'For A(g) <=> 2 B(g), a mixture has [A] = 0.50 M and [B] = 0.20 M. The value of Kc is 0.16. Predict the net direction.',
      steps: [
        'Write Qc = [B]^2/[A].',
        'Substitute the current values: Qc = (0.20)^2/0.50 = 0.080.',
        'Because 0.080 is less than 0.16, product formation must raise Qc until it equals Kc.',
      ],
      answer: 'The mixture undergoes a net shift toward B.',
    },
    commonMistake: 'Comparing concentrations one at a time instead of first combining them into the correctly exponentiated quotient.',
  },
  {
    id: 'equilibrium-transforming-constants',
    kind: 'formula',
    schemaVersion: 1,
    title: 'Transforming equilibrium constants',
    summary: 'Track how reversing, scaling, and adding reactions changes the associated equilibrium constant.',
    alignment: alignment(
      ['properties-equilibrium-constant'],
      ['7.6.A'],
      ['5.A', '5.F'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    conceptGroup: 'reaction-transformation',
    examReference: {
      status: 'not-provided',
      sourceId: 'ap-chemistry-reference-2026',
      note: 'The 2026 exam reference information does not list the reverse, scale, and reaction-addition transformation rules as a formula set.',
    },
    expression: 'reverse: Knew = 1/K; multiply coefficients by n: Knew = K^n; add reactions: Koverall = K1*K2',
    variables: [
      { symbol: 'K', meaning: 'equilibrium constant for the original balanced reaction at a fixed temperature', units: 'dimensionless under the activity convention' },
      { symbol: 'n', meaning: 'factor applied to every stoichiometric coefficient', units: 'none' },
      { symbol: 'Koverall', meaning: 'constant for a reaction obtained by adding component reactions', units: 'dimensionless under the activity convention' },
    ],
    assumptions: [
      'All constants refer to the same temperature.',
      'Reaction transformations are applied to every coefficient, not selected species.',
    ],
    appliesWhen: [
      'Finding a constant for a target equation assembled from known equilibrium reactions.',
      'Checking how a differently written version of the same equilibrium changes K.',
    ],
    doesNotApplyWhen: [
      'The temperature changes, because the numerical constant may then change independently of algebraic reaction manipulation.',
      'Only initial concentrations change while the balanced reaction remains unchanged.',
    ],
    rearrangements: [
      'Dividing all coefficients by n raises the original constant to the power 1/n.',
      'Subtracting a component reaction is equivalent to adding its reverse and multiplying by the reciprocal constant.',
    ],
    workedExample: {
      prompt: 'A reaction has K = 25. Determine K for one-half of the reverse reaction.',
      steps: [
        'Reverse the reaction: Kreverse = 1/25.',
        'Halve every coefficient: Knew = (1/25)^(1/2).',
      ],
      answer: 'Knew = 0.20.',
    },
    commonMistake: 'Multiplying K by a coefficient factor instead of raising K to that factor as an exponent.',
  },
  {
    id: 'equilibrium-solubility-product',
    kind: 'formula',
    schemaVersion: 1,
    title: 'Solubility-product constant',
    summary: 'Relate equilibrium ion concentrations to the dissolution stoichiometry of a sparingly soluble ionic solid.',
    alignment: alignment(
      ['introduction-solubility-equilibria', 'common-ion-effect'],
      ['7.11.A', '7.12.A'],
      ['2.F', '5.F'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    conceptGroup: 'solubility',
    examReference: {
      status: 'not-provided',
      sourceId: 'ap-chemistry-reference-2026',
      note: 'The 2026 exam reference information does not separately print a general Ksp expression; students must construct it from the balanced dissolution equation.',
    },
    expression: 'For MpXq(s) <=> p M^(q+)(aq) + q X^(p-)(aq), Ksp = [M^(q+)]^p[X^(p-)]^q',
    variables: [
      { symbol: 'Ksp', meaning: 'solubility-product constant for the dissolution reaction at a fixed temperature', units: 'dimensionless when expressed through standard-state activities' },
      { symbol: '[M^(q+)]', meaning: 'equilibrium molar concentration of the cation', units: 'mol/L' },
      { symbol: '[X^(p-)]', meaning: 'equilibrium molar concentration of the anion', units: 'mol/L' },
      { symbol: 'p, q', meaning: 'balanced dissolution coefficients and quotient exponents', units: 'none' },
    ],
    assumptions: [
      'The solid dissolution equation and ionic charges are balanced.',
      'The stated Ksp and concentrations refer to the same temperature.',
      'The pure solid has constant activity and is omitted from the expression.',
    ],
    appliesWhen: [
      'Calculating ion concentrations in a saturated solution with solid present.',
      'Comparing an ion product Qsp with Ksp to predict dissolution or precipitation.',
    ],
    doesNotApplyWhen: [
      'The ionic compound is treated as completely soluble rather than establishing a heterogeneous equilibrium.',
      'Side reactions such as complex formation or acid-base reaction materially change free-ion concentrations but are not modeled.',
    ],
    rearrangements: [
      'For MX(s) <=> M+(aq) + X-(aq) in pure water, Ksp = s^2 and s = sqrt(Ksp).',
      'For MX2(s) <=> M2+(aq) + 2 X-(aq) in pure water, Ksp = s(2s)^2 = 4s^3.',
      'Qsp > Ksp predicts net precipitation; Qsp < Ksp permits net dissolution when solid is available.',
    ],
    workedExample: {
      prompt: 'For ZF2(s) <=> Z2+(aq) + 2 F-(aq), Ksp = 3.2 x 10^-8. Estimate the molar solubility in pure water.',
      steps: [
        'Let the molar solubility be s, so [Z2+] = s and [F-] = 2s.',
        'Write Ksp = [Z2+][F-]^2 = s(2s)^2 = 4s^3.',
        'Solve s = (3.2 x 10^-8/4)^(1/3) = 2.0 x 10^-3 mol/L.',
      ],
      answer: 'The molar solubility is 2.0 x 10^-3 mol/L.',
    },
    commonMistake: 'Calling Ksp the molar solubility without applying the dissolution coefficients to the ion concentrations.',
  },
  {
    id: 'equilibrium-partial-pressure-expression',
    kind: 'formula',
    schemaVersion: 1,
    title: 'Gas equilibrium quotient from partial pressures',
    summary: 'Build Kp or Qp from gas partial pressures and use the current-to-equilibrium comparison without mixing pressure and concentration data.',
    alignment: alignment(
      ['reaction-quotient-equilibrium-constant', 'calculating-equilibrium-constant'],
      ['7.3.A', '7.4.A'],
      ['5.B', '5.F'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    conceptGroup: 'composition-and-direction',
    examReference: {
      status: 'provided',
      sourceId: 'ap-chemistry-reference-2026',
      note: 'The 2026 exam reference information provides the general partial-pressure equilibrium-constant form. Applying it to a current composition as Qp still requires interpretation.',
    },
    expression: 'For aA(g) + bB(g) <=> cC(g) + dD(g), Kp = ((PC)^c(PD)^d)/((PA)^a(PB)^b)',
    variables: [
      { symbol: 'Kp', meaning: 'equilibrium constant written in terms of gas partial pressures', units: 'dimensionless under the standard-state activity convention' },
      { symbol: 'PX', meaning: 'partial pressure of gaseous species X', units: 'a consistent pressure unit, commonly atm' },
      { symbol: 'a, b, c, d', meaning: 'stoichiometric coefficients in the balanced gas reaction', units: 'none' },
    ],
    assumptions: [
      'The equation is balanced and every pressure term belongs to a gaseous species.',
      'All pressures and the stated constant refer to the same temperature.',
      'Pure solids and liquids are omitted because their activities are effectively constant.',
    ],
    appliesWhen: [
      'A gas equilibrium is described using partial pressures rather than molar concentrations.',
      'A current pressure quotient Qp must be compared with Kp at the same temperature.',
    ],
    doesNotApplyWhen: [
      'The data are molar concentrations and the requested constant is Kc.',
      'A total pressure is supplied without enough composition information to find each needed partial pressure.',
    ],
    rearrangements: [
      'Replace Kp by Qp when the pressure values describe a current mixture that may not be at equilibrium.',
      'Qp < Kp predicts net product formation; Qp > Kp predicts net reactant formation.',
    ],
    workedExample: {
      prompt: 'For A(g) + B(g) <=> C(g), Kp = 5.0. A mixture has PA = 0.40 atm, PB = 0.20 atm, and PC = 0.10 atm. Predict the net direction.',
      steps: [
        'Write Qp = PC/(PA*PB).',
        'Substitute Qp = 0.10/((0.40)(0.20)) = 1.25.',
        'Because 1.25 is less than 5.0, net product formation raises Qp toward Kp.',
      ],
      answer: 'The mixture changes in the forward direction toward C.',
    },
    commonMistake: 'Using total pressure in every term instead of the partial pressure of the corresponding gas.',
  },
  {
    id: 'equilibrium-reaction-progress-model',
    kind: 'formula',
    schemaVersion: 1,
    title: 'Reaction-progress model for ICE tables',
    summary: 'Connect every concentration change to one reaction-progress variable so the equilibrium model conserves matter and follows stoichiometry.',
    alignment: alignment(
      ['calculating-equilibrium-concentrations'],
      ['7.7.A'],
      ['5.A', '5.F'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    conceptGroup: 'equilibrium-modeling',
    examReference: {
      status: 'not-provided',
      sourceId: 'ap-chemistry-reference-2026',
      note: 'The 2026 exam reference information does not supply an ICE-table template or reaction-progress procedure.',
    },
    expression: 'For a forward change of extent x: delta[A] = -a*x, delta[B] = -b*x, delta[C] = +c*x, delta[D] = +d*x',
    variables: [
      { symbol: 'x', meaning: 'concentration-scale reaction progress chosen for one stoichiometric unit of reaction', units: 'mol/L' },
      { symbol: 'delta[X]', meaning: 'modeled concentration change for species X', units: 'mol/L' },
      { symbol: 'a, b, c, d', meaning: 'balanced stoichiometric coefficients', units: 'none' },
    ],
    assumptions: [
      'The reaction equation is balanced before changes are assigned.',
      'All species share the same reaction-progress variable and the chosen signs match the net direction.',
      'The modeled volume is constant unless a separate volume change is explicitly included.',
    ],
    appliesWhen: [
      'Initial composition and an equilibrium constant are used to solve equilibrium concentrations.',
      'One measured concentration change must determine the corresponding changes of other species.',
    ],
    doesNotApplyWhen: [
      'Independent side reactions materially change species amounts but are omitted from the model.',
      'A proposed algebraic root produces a negative physical concentration.',
    ],
    rearrangements: [
      'Equilibrium concentration equals initial concentration plus the signed stoichiometric change.',
      'A reverse net change reverses every sign while keeping coefficient ratios intact.',
      'A final check substitutes the modeled concentrations into Q and verifies Q approximately equals K.',
    ],
    workedExample: {
      prompt: 'For N2O4(g) <=> 2 NO2(g), [N2O4] falls from 0.80 M to 0.65 M. Find the increase in [NO2].',
      steps: [
        'The N2O4 change is -0.15 M, so x = 0.15 M for the forward direction.',
        'The coefficient of NO2 is 2, so its change is +2x.',
        'Calculate +2(0.15 M) = +0.30 M.',
      ],
      answer: '[NO2] increases by 0.30 M.',
    },
    commonMistake: 'Changing every species by the same x even when the balanced coefficients differ.',
  },
  {
    id: 'equilibrium-concentration-volume-relationship',
    kind: 'formula',
    schemaVersion: 1,
    title: 'Concentration changes caused by volume or mixing',
    summary: 'Calculate the immediate concentration after a volume change or mixture dilution before the equilibrium system has time to shift.',
    alignment: alignment(
      ['introduction-le-chatelier-principle', 'reaction-quotient-le-chatelier-principle', 'common-ion-effect'],
      ['7.9.A', '7.10.A', '7.12.A'],
      ['5.B', '5.F'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    conceptGroup: 'concentration-and-volume',
    examReference: {
      status: 'provided',
      sourceId: 'ap-chemistry-reference-2026',
      note: 'The 2026 exam reference information provides the molarity relationship. Students must apply it to the immediate post-volume-change state before evaluating Q.',
    },
    expression: 'M = n/V; if moles are unchanged, M2 = M1*(V1/V2)',
    variables: [
      { symbol: 'M', meaning: 'molar concentration of one dissolved or gaseous species', units: 'mol/L' },
      { symbol: 'n', meaning: 'amount of that species before reaction responds', units: 'mol' },
      { symbol: 'V', meaning: 'total mixture volume', units: 'L' },
    ],
    assumptions: [
      'The immediate physical volume change occurs before appreciable chemical reaction.',
      'The amount of the tracked species is unchanged during that immediate step.',
      'Volumes are additive when the calculation treats mixed solutions by simple dilution.',
    ],
    appliesWhen: [
      'A container is compressed or expanded and the immediate gas concentrations are needed.',
      'Solutions are mixed and diluted ion concentrations are required before a precipitation comparison.',
    ],
    doesNotApplyWhen: [
      'The requested concentration is after the system has already reestablished equilibrium.',
      'A reaction during mixing consumes a meaningful amount before the stated instant.',
    ],
    rearrangements: [
      'At fixed moles, halving volume doubles every affected concentration.',
      'For simple mixing, concentration after mixing equals initial moles divided by total volume.',
      'Use the immediate concentrations to calculate Q; the subsequent reaction changes them toward Q = K.',
    ],
    workedExample: {
      prompt: 'A gas mixture at equilibrium is compressed from 2.00 L to 1.00 L at constant temperature. What happens immediately to each gas concentration?',
      steps: [
        'During the immediate compression, the moles of each gas have not yet changed.',
        'Use M2 = M1(V1/V2) = M1(2.00/1.00).',
        'Each gas concentration is therefore twice its value before compression; the reaction response is analyzed afterward with Q.',
      ],
      answer: 'Every gas concentration immediately doubles.',
    },
    commonMistake: 'Skipping the immediate dilution or compression calculation and comparing K with concentrations from before the physical change.',
  },
  {
    id: 'equilibrium-q-versus-k-decision-tool',
    kind: 'lesson',
    schemaVersion: 1,
    title: 'Use Q and K to predict net reaction direction',
    summary: 'A decision-focused lesson connecting equilibrium expressions, constant magnitude, and Le Chatelier reasoning.',
    alignment: alignment(
      ['reaction-quotient-equilibrium-constant', 'magnitude-equilibrium-constant', 'reaction-quotient-le-chatelier-principle'],
      ['7.3.A', '7.5.A', '7.10.A'],
      ['5.B', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    prerequisites: [
      'Balance a chemical equation and interpret its coefficients.',
      'Distinguish concentration at a particular moment from a rate of concentration change.',
      'Apply exponent rules and substitute measured values with units tracked separately.',
    ],
    sections: [
      {
        heading: 'K is the destination ratio at one temperature',
        body: 'An equilibrium constant describes a particular balanced reaction at a particular temperature. Its magnitude tells which side contributes more strongly to the equilibrium composition, but it does not say that either side disappears. A large K favors products at equilibrium; a small K favors reactants. Neither statement determines how fast equilibrium is reached.',
      },
      {
        heading: 'Q is a snapshot of the mixture now',
        body: 'The reaction quotient uses the same algebraic structure as K but accepts concentrations from any moment. Treat Q as the mixture\'s current product-to-reactant activity ratio. The comparison Q versus K identifies which net direction changes that ratio toward its equilibrium value.',
      },
      {
        heading: 'Translate the comparison into particle changes',
        body: 'If Q is below K, the mixture has too little product contribution relative to reactant contribution, so forward events exceed reverse events overall. If Q is above K, reverse events dominate overall. At Q equal to K, forward and reverse rates are equal; both molecular processes continue, but bulk concentrations remain constant.',
      },
      {
        heading: 'Separate a shift from a change in K',
        body: 'Changing concentration or pressure can change Q immediately and cause a shift, but K remains fixed as long as temperature is fixed. A catalyst changes how quickly both directions approach equilibrium without changing Q, K, or the eventual equilibrium composition.',
      },
    ],
    workedExamples: [
      {
        prompt: 'For X2(g) + Y2(g) <=> 2 XY(g), Kc = 4.0. A mixture has [X2] = 0.50 M, [Y2] = 0.50 M, and [XY] = 0.50 M. Predict the net direction.',
        steps: [
          'Write Qc = [XY]^2/([X2][Y2]).',
          'Substitute: Qc = (0.50)^2/((0.50)(0.50)) = 1.0.',
          'Compare 1.0 with 4.0. Product formation increases the quotient toward 4.0.',
        ],
        answer: 'The net reaction proceeds toward XY.',
      },
      {
        prompt: 'For M(g) <=> N(g), a system is at equilibrium. More N is injected at constant temperature and volume. Explain the immediate and subsequent changes.',
        steps: [
          'Immediately after injection, [N] increases while [M] has not yet changed, so Q rises above K.',
          'The reverse reaction then has a greater net effect, consuming N and producing M.',
          'The system reaches a new composition when Q once again equals the unchanged K.',
        ],
        answer: 'There is a net shift toward M; K does not change.',
      },
    ],
    misconceptions: [
      {
        id: 'equilibrium-means-stopped',
        claim: 'At equilibrium, the forward and reverse reactions stop.',
        correction: 'Both directions continue at equal rates, producing no net bulk composition change.',
      },
      {
        id: 'large-k-fast-reaction',
        claim: 'A large K means the reaction reaches equilibrium quickly.',
        correction: 'K concerns equilibrium composition, whereas reaction speed is kinetic information.',
      },
      {
        id: 'shift-changes-k',
        claim: 'Adding a reactant increases the equilibrium constant.',
        correction: 'At fixed temperature, the addition changes Q and the composition, not K.',
      },
    ],
    retrievalChecks: [
      { prompt: 'If Q is greater than K, which net direction lowers Q?', answer: 'The reverse direction, toward reactants.' },
      { prompt: 'What must be true about Q when equilibrium is restored?', answer: 'Q equals K for the reaction as written at that temperature.' },
      { prompt: 'Does a catalyst change K or the final composition?', answer: 'No. It accelerates approach in both directions without changing the equilibrium target.' },
    ],
    formulaIds: ['equilibrium-reaction-quotient', 'equilibrium-partial-pressure-expression', 'equilibrium-transforming-constants'],
  },
  {
    id: 'equilibrium-dynamic-systems-and-representations',
    kind: 'lesson',
    schemaVersion: 1,
    title: 'Recognize dynamic equilibrium in reversible systems',
    summary: 'Connect molecular events, rate graphs, concentration graphs, and the direction of a reversible reaction.',
    alignment: alignment(
      ['introduction-equilibrium', 'direction-reversible-reactions', 'representations-equilibrium'],
      ['7.1.A', '7.2.A', '7.8.A'],
      ['2.C', '4.A', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    prerequisites: [
      'Interpret concentration-versus-time and rate-versus-time graphs.',
      'Distinguish microscopic collisions from macroscopic concentration measurements.',
    ],
    sections: [
      { heading: 'Reversible does not mean undecided', body: 'A reversible reaction can proceed in both molecular directions. The net direction at a particular moment is the direction with the greater rate. Early in a product-free mixture, forward events may dominate; as products accumulate, reverse events become more frequent.' },
      { heading: 'Dynamic equilibrium is a rate condition', body: 'At equilibrium, the forward and reverse rates are equal. Individual particles continue reacting, but equal opposing event rates keep average amounts constant. Equilibrium does not require equal reactant and product concentrations.' },
      { heading: 'Read two graph types without mixing them', body: 'On a rate graph, the two curves meet at equilibrium. On a concentration graph, each curve becomes horizontal, but the plateaus can have different heights. A graph may show constant concentrations without directly revealing their numerical ratio.' },
    ],
    workedExamples: [{
      prompt: 'A sealed vessel initially contains only P(g) for P(g) <=> Q(g). Describe the likely rate and concentration graphs as equilibrium develops.',
      steps: [
        'The initial forward rate is positive while the reverse rate is zero because no Q is present.',
        'As P is consumed, the forward rate falls; as Q forms, the reverse rate rises.',
        'The rates become equal and remain equal while both concentrations level off at constant, not necessarily equal, values.',
      ],
      answer: 'Rate curves converge; concentration curves approach separate horizontal plateaus.',
    }],
    misconceptions: [
      { id: 'equilibrium-means-stopped', claim: 'Flat concentration curves mean molecular reactions have stopped.', correction: 'Flat curves indicate equal opposing rates and no net concentration change.' },
      { id: 'equilibrium-equal-concentrations', claim: 'Reactant and product plateaus must have the same height.', correction: 'Equal rates do not require equal concentrations.' },
    ],
    retrievalChecks: [
      { prompt: 'What equality defines dynamic equilibrium?', answer: 'The forward and reverse reaction rates are equal.' },
      { prompt: 'Can the reactant plateau exceed the product plateau at equilibrium?', answer: 'Yes. Equilibrium concentrations are constant but need not be equal.' },
    ],
    formulaIds: ['equilibrium-reaction-quotient', 'equilibrium-partial-pressure-expression'],
  },
  {
    id: 'equilibrium-ice-table-concentration-reasoning',
    kind: 'lesson',
    schemaVersion: 1,
    title: 'Build and audit an ICE-table model',
    summary: 'Use one reaction-progress variable, balanced coefficients, and physical checks to calculate equilibrium concentrations.',
    alignment: alignment(
      ['calculating-equilibrium-constant', 'properties-equilibrium-constant', 'calculating-equilibrium-concentrations'],
      ['7.4.A', '7.6.A', '7.7.A'],
      ['5.A', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    prerequisites: [
      'Write a balanced reaction and its equilibrium expression.',
      'Solve a quadratic equation or evaluate whether an approximation is justified.',
    ],
    sections: [
      { heading: 'One x connects every species', body: 'An ICE table is a stoichiometric model, not a memorized layout. Choose one reaction-progress variable x. Multiply its signed change by each balanced coefficient so the table conserves atoms.' },
      { heading: 'Choose signs from evidence', body: 'Use an initial Q-versus-K comparison when the net direction is uncertain. A forward net change gives negative reactant changes and positive product changes; a reverse net change flips those signs.' },
      { heading: 'Solve, then reject impossible roots', body: 'Substitute equilibrium-row expressions into K. A valid root must keep every modeled concentration nonnegative and must match the assumed direction. Recalculate Q from the final concentrations to confirm it equals K within rounding.' },
    ],
    workedExamples: [{
      prompt: 'For U(g) <=> 2 V(g), Kc = 1.0. Initially [U] = 1.0 M and [V] = 0. Let x mol/L of U react. Determine the equilibrium concentrations.',
      steps: [
        'Write [U]eq = 1.0 - x and [V]eq = 2x.',
        'Substitute: 1.0 = (2x)^2/(1.0 - x), giving 4x^2 + x - 1 = 0.',
        'The positive root is x = (-1 + sqrt(17))/8 = 0.390 M; reject the negative root.',
        'Calculate [U]eq = 0.610 M and [V]eq = 0.781 M. Rounding explains the final digit.',
      ],
      answer: '[U]eq is about 0.610 M and [V]eq is about 0.781 M.',
    }],
    misconceptions: [
      { id: 'incorrect-ice-stoichiometry', claim: 'Every ICE-table concentration changes by x.', correction: 'Each change is its balanced coefficient times the same reaction-progress variable.' },
      { id: 'reversed-q-k-direction', claim: 'The signs can be chosen without checking the initial composition.', correction: 'A Q-versus-K comparison establishes the physically consistent net direction.' },
    ],
    retrievalChecks: [
      { prompt: 'Why can an algebraically valid root still be rejected?', answer: 'It may create a negative concentration or contradict the assumed net direction.' },
      { prompt: 'What final numerical check should an ICE solution pass?', answer: 'Substitution of final concentrations should give Q equal to K within rounding.' },
    ],
    formulaIds: ['equilibrium-reaction-quotient', 'equilibrium-reaction-progress-model', 'equilibrium-transforming-constants'],
  },
  {
    id: 'equilibrium-disturbances-with-q',
    kind: 'lesson',
    schemaVersion: 1,
    title: 'Analyze equilibrium disturbances without changing K',
    summary: 'Predict concentration, volume, catalyst, and temperature effects using an immediate-change snapshot and Q-versus-K reasoning.',
    alignment: alignment(
      ['introduction-le-chatelier-principle', 'reaction-quotient-le-chatelier-principle'],
      ['7.9.A', '7.10.A'],
      ['2.F', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    prerequisites: [
      'Write Q for a balanced reaction and compare it with K.',
      'Relate gas concentration to amount and volume.',
    ],
    sections: [
      { heading: 'Separate the instant from the response', body: 'First identify what changes immediately before reaction can occur. An injection changes selected concentrations; a volume change changes every gas concentration; a catalyst changes neither composition nor the equilibrium target.' },
      { heading: 'Use Q for composition and volume changes', body: 'Recalculate Q from the immediate snapshot and compare it with the unchanged K. For volume changes, equal total gas coefficients make the concentration factor cancel, so compression produces no net shift.' },
      { heading: 'Temperature is the exception', body: 'Changing temperature changes the equilibrium constant. Treat heat as part of the thermochemical direction: raising temperature favors the endothermic direction and establishes a new K at the new temperature.' },
    ],
    workedExamples: [{
      prompt: 'For 2 D(g) <=> E(g), an equilibrium mixture is compressed to half its original volume at constant temperature. Predict the immediate Q change and net direction.',
      steps: [
        'Every gas concentration doubles immediately.',
        'The numerator [E] gains a factor of 2, while denominator [D]^2 gains a factor of 4.',
        'Q becomes one-half of its previous value, so Q is now below K.',
      ],
      answer: 'The system proceeds toward E until Q again equals K.',
    }],
    misconceptions: [
      { id: 'shift-changes-k', claim: 'Any stress changes the value of K.', correction: 'At fixed temperature, stresses change Q or rates; K stays fixed.' },
      { id: 'compression-always-shifts', claim: 'Compression always favors products.', correction: 'Compression favors the side with fewer total gaseous coefficients, if those totals differ.' },
    ],
    retrievalChecks: [
      { prompt: 'Which common disturbance changes K?', answer: 'A temperature change.' },
      { prompt: 'Why does a catalyst cause no equilibrium shift?', answer: 'It accelerates both directions without changing Q, K, or the equilibrium composition.' },
    ],
    formulaIds: ['equilibrium-reaction-quotient', 'equilibrium-concentration-volume-relationship'],
  },
  {
    id: 'equilibrium-solubility-and-common-ions',
    kind: 'lesson',
    schemaVersion: 1,
    title: 'Connect Ksp, molar solubility, and common ions',
    summary: 'Model heterogeneous dissolution equilibria and predict how an existing ion changes free-ion concentrations and molar solubility.',
    alignment: alignment(
      ['introduction-solubility-equilibria', 'common-ion-effect'],
      ['7.11.A', '7.12.A'],
      ['2.F', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    prerequisites: [
      'Dissociate ionic formulas into correctly charged ions.',
      'Use balanced coefficients as equilibrium-expression exponents.',
    ],
    sections: [
      { heading: 'Ksp is an ion-activity product', body: 'For a saturated solution at fixed temperature, the dissolved free-ion activities satisfy Ksp. The pure solid is omitted. Molar solubility s is an amount dissolved per liter; it equals an ion concentration only when stoichiometry makes that relationship one-to-one.' },
      { heading: 'Compare Qsp with Ksp', body: 'Qsp below Ksp permits additional solid to dissolve when solid is present. Qsp above Ksp predicts net precipitation. Equality describes saturation equilibrium, not necessarily the absence of visible solid.' },
      { heading: 'A common ion changes the initial row', body: 'A soluble salt supplying one dissolution ion raises that ion concentration before the sparingly soluble solid dissolves. The equilibrium then requires less additional dissolution, so molar solubility decreases while Ksp remains unchanged at fixed temperature.' },
    ],
    workedExamples: [{
      prompt: 'MX(s) has Ksp = 1.0 x 10^-8. Estimate its molar solubility in 0.010 M X-(aq), assuming the added X- concentration changes negligibly.',
      steps: [
        'Let the added molar solubility be s, so [M+] = s and [X-] is approximately 0.010 M.',
        'Use Ksp = [M+][X-] = s(0.010).',
        'Solve s = 1.0 x 10^-8/0.010 = 1.0 x 10^-6 mol/L.',
        'The approximation is consistent because 1.0 x 10^-6 is much smaller than 0.010.',
      ],
      answer: 'The estimated molar solubility is 1.0 x 10^-6 mol/L.',
    }],
    misconceptions: [
      { id: 'include-pure-solids', claim: 'The amount of solid belongs in the Ksp expression.', correction: 'Pure-solid activity is constant, so only dissolved ion activities appear.' },
      { id: 'more-solid-more-soluble', claim: 'Adding extra solid raises the saturated ion concentrations.', correction: 'With solid already present at fixed temperature, extra solid changes the amount of solid phase, not Ksp or the equilibrium free-ion concentrations.' },
    ],
    retrievalChecks: [
      { prompt: 'What does Qsp greater than Ksp predict?', answer: 'Net precipitation until the ion product falls to Ksp.' },
      { prompt: 'Does a common ion change Ksp at fixed temperature?', answer: 'No. It changes the equilibrium composition and lowers molar solubility.' },
    ],
    formulaIds: ['equilibrium-solubility-product', 'equilibrium-concentration-volume-relationship'],
  },
  {
    id: 'equilibrium-mixture-comparison-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Three mixtures of dinitrogen tetroxide and nitrogen dioxide',
    summary: 'An original concentration table for comparing reaction quotients at one temperature.',
    alignment: alignment(
      ['reaction-quotient-equilibrium-constant', 'reaction-quotient-le-chatelier-principle'],
      ['7.3.A', '7.10.A'],
      ['3.A', '5.F'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    context: 'At a fixed temperature, N2O4(g) <=> 2 NO2(g) has Kc = 0.36. Three sealed vessels are prepared with the concentrations shown before any subsequent net change occurs.',
    representation: {
      type: 'table',
      caption: 'Initial concentration snapshots for three vessels at the same temperature',
      columns: ['Vessel', '[N2O4] (mol/L)', '[NO2] (mol/L)'],
      rows: [
        ['A', '0.40', '0.20'],
        ['B', '0.25', '0.30'],
        ['C', '0.20', '0.40'],
      ],
      accessibleDescription: 'Vessel A contains 0.40 molar N2O4 and 0.20 molar NO2. Vessel B contains 0.25 molar N2O4 and 0.30 molar NO2. Vessel C contains 0.20 molar N2O4 and 0.40 molar NO2.',
    },
  },
  {
    id: 'equilibrium-disturbance-line-graph-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Concentration history before and after a disturbance',
    summary: 'An original concentration-time graph for interpreting equilibrium evidence and an imposed composition change.',
    alignment: alignment(
      ['introduction-equilibrium', 'direction-reversible-reactions', 'calculating-equilibrium-constant', 'representations-equilibrium', 'introduction-le-chatelier-principle', 'reaction-quotient-le-chatelier-principle'],
      ['7.1.A', '7.2.A', '7.4.A', '7.8.A', '7.9.A', '7.10.A'],
      ['4.A', '5.D', '5.F', '6.B', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    context: 'At constant temperature, B(g) <=> C(g) is monitored in a rigid vessel. The mixture first reaches equilibrium. At 50 s, a disturbance is applied almost instantaneously; the vessel is then left undisturbed.',
    representation: {
      type: 'line-graph',
      caption: 'Concentrations of B and C versus time',
      xLabel: 'Time (s)',
      yLabel: 'Concentration (mol/L)',
      accessibleDescription: 'From 0 to 30 seconds, B decreases from 0.80 to 0.50 molar while C increases from 0.20 to 0.50 molar. Both remain 0.50 molar through 40 seconds. At 50 seconds, B jumps to 0.80 molar while C remains 0.50 molar. Thereafter B decreases and C increases until both level at 0.65 molar by 80 seconds.',
      series: [
        { label: '[B]', color: '#5c47a8', points: [[0, 0.80], [10, 0.65], [20, 0.55], [30, 0.50], [40, 0.50], [50, 0.80], [60, 0.70], [70, 0.66], [80, 0.65]] },
        { label: '[C]', color: '#c94d62', points: [[0, 0.20], [10, 0.35], [20, 0.45], [30, 0.50], [40, 0.50], [50, 0.50], [60, 0.60], [70, 0.64], [80, 0.65]] },
      ],
    },
  },
  {
    id: 'equilibrium-opposing-rates-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Opposing reaction rates over time',
    summary: 'An original rate table for determining net direction and recognizing dynamic equilibrium.',
    alignment: alignment(
      ['introduction-equilibrium', 'direction-reversible-reactions', 'representations-equilibrium'],
      ['7.1.A', '7.2.A', '7.8.A'],
      ['3.C', '4.D', '5.F', '6.E'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    context: 'A closed vessel contains the reversible reaction U(g) <=> V(g). At constant temperature, the forward and reverse rates are measured at several times after the vessel is prepared.',
    representation: {
      type: 'table',
      caption: 'Forward and reverse rates for U(g) <=> V(g)',
      columns: ['Time (s)', 'Forward rate (mol L^-1 s^-1)', 'Reverse rate (mol L^-1 s^-1)'],
      rows: [
        ['0', '0.100', '0.020'],
        ['20', '0.060', '0.030'],
        ['40', '0.040', '0.040'],
        ['60', '0.040', '0.040'],
      ],
      accessibleDescription: 'At zero seconds the forward and reverse rates are 0.100 and 0.020 molar per second. At 20 seconds they are 0.060 and 0.030. At 40 and 60 seconds both rates are 0.040 molar per second.',
    },
  },
  {
    id: 'equilibrium-solubility-trials-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Ion-product trials for a sparingly soluble solid',
    summary: 'An original concentration table for comparing ion products with a solubility-product constant.',
    alignment: alignment(
      ['introduction-solubility-equilibria', 'common-ion-effect'],
      ['7.11.A', '7.12.A'],
      ['3.B', '5.B', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    context: 'For MX2(s) <=> M2+(aq) + 2 X-(aq), Ksp = 2.0 x 10^-10 at the experiment temperature. The table gives dissolved-ion concentrations immediately after each mixture is prepared and before any possible precipitation.',
    representation: {
      type: 'table',
      caption: 'Post-mixing ion concentrations for three trials',
      columns: ['Trial', '[M2+] (mol/L)', '[X-] (mol/L)'],
      rows: [
        ['A', '1.0 x 10^-4', '1.0 x 10^-3'],
        ['B', '2.0 x 10^-4', '1.0 x 10^-3'],
        ['C', '3.0 x 10^-4', '1.0 x 10^-3'],
      ],
      accessibleDescription: 'Trials A, B, and C have M two-plus concentrations of 1.0, 2.0, and 3.0 times ten to the negative fourth molar, respectively. Each has an X-minus concentration of 1.0 times ten to the negative third molar.',
    },
  },
  {
    id: 'equilibrium-reaction-combination-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Combining two reversible reactions',
    summary: 'An original reaction table for deriving constants after equations are added, reversed, or scaled.',
    alignment: alignment(
      ['properties-equilibrium-constant'],
      ['7.6.A'],
      ['3.B', '5.A', '5.F'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    context: 'At one temperature, two gas-phase reactions share the intermediate Q. The equations and constants are written in the directions shown.',
    representation: {
      type: 'table',
      caption: 'Component reactions and equilibrium constants',
      columns: ['Reaction', 'Equation', 'Kc'],
      rows: [
        ['1', 'P(g) <=> Q(g)', '4.0'],
        ['2', 'Q(g) <=> R(g)', '0.50'],
      ],
      accessibleDescription: 'Reaction 1 converts P gas reversibly to Q gas and has Kc 4.0. Reaction 2 converts Q gas reversibly to R gas and has Kc 0.50.',
    },
  },
  {
    id: 'equilibrium-solubility-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: solubility measurement and error analysis',
    summary: 'A point-level draft rubric for translating dissolved-ion data into molar solubility, Ksp, and directional error.',
    alignment: alignment(
      ['introduction-solubility-equilibria'],
      ['7.11.A'],
      ['5.B', '5.F', '6.G'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-equilibrium-short-frq-002',
    maxPoints: 4,
    parts: [
      {
        id: 'part-a', prompt: 'Determine molar solubility from the measured anion concentration.',
        points: [{ id: 'a-solubility', criterion: 'Uses dissolution stoichiometry to determine molar solubility.', acceptableEvidence: 'Uses [Z-] = 2s and obtains s = 2.40 x 10^-3 mol/L.' }],
      },
      {
        id: 'part-b', prompt: 'Write the Ksp expression and calculate its value.',
        points: [
          { id: 'b-expression', criterion: 'Writes the equilibrium-constant expression without the pure solid.', acceptableEvidence: 'Ksp = [M2+][Z-]^2.' },
          { id: 'b-value', criterion: 'Substitutes stoichiometrically consistent ion concentrations.', acceptableEvidence: 'Calculates (2.40 x 10^-3)(4.80 x 10^-3)^2 = 5.53 x 10^-8.' },
        ],
      },
      {
        id: 'part-c', prompt: 'Predict the effect of sample evaporation before analysis.',
        points: [{ id: 'c-error', criterion: 'Connects evaporation to the direction of error in the calculated constant.', acceptableEvidence: 'Evaporation raises the measured ion concentration, so the calculated molar solubility and Ksp are too large.' }],
      },
    ],
  },
  {
    id: 'equilibrium-concentration-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: equilibrium concentration from initial conditions',
    summary: 'A point-level draft rubric for an ICE relationship, physical solution, percent conversion, and catalyst reasoning.',
    alignment: alignment(
      ['introduction-equilibrium', 'calculating-equilibrium-concentrations'],
      ['7.1.A', '7.7.A'],
      ['5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-equilibrium-short-frq-003',
    maxPoints: 4,
    parts: [
      {
        id: 'part-a', prompt: 'Set up and solve the equilibrium-concentration relationship.',
        points: [
          { id: 'a-setup', criterion: 'Represents the concentration changes and equilibrium expression consistently.', acceptableEvidence: 'Uses [D]eq = 0.800 - x, [E]eq = x, and 0.250 = x/(0.800 - x).' },
          { id: 'a-values', criterion: 'Obtains the physical equilibrium concentrations.', acceptableEvidence: 'Reports [D]eq = 0.640 mol/L and [E]eq = 0.160 mol/L.' },
        ],
      },
      {
        id: 'part-b', prompt: 'Calculate percent conversion of D.',
        points: [{ id: 'b-percent', criterion: 'Calculates the fraction of initial D converted.', acceptableEvidence: '(0.160/0.800) x 100% = 20.0%.' }],
      },
      {
        id: 'part-c', prompt: 'Predict the effect of a catalyst on the equilibrium composition.',
        points: [{ id: 'c-catalyst', criterion: 'Distinguishes equilibrium composition from time to equilibrium.', acceptableEvidence: 'States that the equilibrium concentrations do not change because a catalyst accelerates both directions without changing Kc.' }],
      },
    ],
  },
  {
    id: 'equilibrium-rates-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: opposing rates and dynamic equilibrium',
    summary: 'A point-level draft rubric connecting net rate, equal opposing rates, bulk composition, and molecular events.',
    alignment: alignment(
      ['introduction-equilibrium', 'direction-reversible-reactions'],
      ['7.1.A', '7.2.A'],
      ['4.D', '5.F', '6.E'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-equilibrium-short-frq-004',
    maxPoints: 4,
    parts: [
      {
        id: 'part-a', prompt: 'Determine net direction and net rate at 10 seconds.',
        points: [{ id: 'a-net-rate', criterion: 'Subtracts opposing rates with the correct direction.', acceptableEvidence: 'Obtains a net product-formation rate of 0.040 mol L^-1 s^-1.' }],
      },
      {
        id: 'part-b', prompt: 'Identify when the rate data first support equilibrium.',
        points: [{ id: 'b-equal-rates', criterion: 'Uses equal forward and reverse rates as equilibrium evidence.', acceptableEvidence: 'Identifies 40 seconds and explains that both rates are 0.030 mol L^-1 s^-1.' }],
      },
      {
        id: 'part-c', prompt: 'Describe the concentration behavior after equilibrium is reached.',
        points: [{ id: 'c-bulk-constant', criterion: 'Connects zero net rate to constant bulk composition.', acceptableEvidence: 'States that reactant and product concentrations remain constant on average, without requiring them to be equal.' }],
      },
      {
        id: 'part-d', prompt: 'Describe the molecular behavior after equilibrium is reached.',
        points: [{ id: 'd-molecular-events', criterion: 'Describes continuing opposing molecular events.', acceptableEvidence: 'States that both directions continue at equal nonzero rates.' }],
      },
    ],
  },
  {
    id: 'equilibrium-magnitude-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: constant magnitude and kinetic interpretation',
    summary: 'A point-level draft rubric for calculating K, interpreting equilibrium composition, and rejecting an unsupported rate claim.',
    alignment: alignment(
      ['calculating-equilibrium-constant', 'magnitude-equilibrium-constant'],
      ['7.4.A', '7.5.A'],
      ['5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-equilibrium-short-frq-005',
    maxPoints: 4,
    parts: [
      {
        id: 'part-a', prompt: 'Write the expression and calculate Kc.',
        points: [
          { id: 'a-expression', criterion: 'Writes the equilibrium expression with the correct exponent.', acceptableEvidence: 'Kc = [L]^2/[L2].' },
          { id: 'a-value', criterion: 'Calculates the constant from equilibrium concentrations.', acceptableEvidence: 'Kc = (0.200)^2/0.800 = 0.0500.' },
        ],
      },
      {
        id: 'part-b', prompt: 'Interpret the equilibrium composition.',
        points: [{ id: 'b-composition', criterion: 'Connects the small constant with reactant-predominant composition.', acceptableEvidence: 'States that reactants predominate without claiming product concentration is zero.' }],
      },
      {
        id: 'part-c', prompt: 'Evaluate the kinetic claim.',
        points: [{ id: 'c-kinetics', criterion: 'Separates equilibrium composition from reaction rate.', acceptableEvidence: 'States that Kc alone gives no reaction-speed information and that kinetic data would be needed.' }],
      },
    ],
  },
  {
    id: 'equilibrium-transform-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: transformed reaction and concentration disturbance',
    summary: 'A point-level draft rubric for reciprocal, exponent, expression, and fixed-temperature reasoning.',
    alignment: alignment(
      ['properties-equilibrium-constant', 'reaction-quotient-le-chatelier-principle'],
      ['7.6.A', '7.10.A'],
      ['5.A', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-equilibrium-short-frq-006',
    maxPoints: 4,
    parts: [
      {
        id: 'part-a', prompt: 'Calculate the transformed equilibrium constant.',
        points: [{ id: 'a-value', criterion: 'Uses both reversal and coefficient scaling.', acceptableEvidence: 'Kc = (1/0.250)^2 = 16.0.' }],
      },
      {
        id: 'part-b', prompt: 'Explain the transformations.',
        points: [
          { id: 'b-reciprocal', criterion: 'Connects reaction reversal with a reciprocal.', acceptableEvidence: 'Explains that numerator and denominator exchange when the reaction is reversed.' },
          { id: 'b-exponent', criterion: 'Connects coefficient scaling with exponentiation.', acceptableEvidence: 'Explains that doubling coefficients squares every activity exponent and therefore K.' },
        ],
      },
      {
        id: 'part-c', prompt: 'Analyze adding X at fixed temperature.',
        points: [{ id: 'c-fixed-temperature', criterion: 'Distinguishes Qc from Kc.', acceptableEvidence: 'States that added X changes Qc and composition but not Kc at unchanged temperature.' }],
      },
    ],
  },
  {
    id: 'equilibrium-particle-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: particle conservation and dynamic evidence',
    summary: 'A point-level draft rubric for atom conservation, net particle change, and equal-rate evidence.',
    alignment: alignment(
      ['direction-reversible-reactions', 'representations-equilibrium'],
      ['7.2.A', '7.8.A'],
      ['1.A', '3.C', '6.E'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-equilibrium-short-frq-007',
    maxPoints: 4,
    parts: [
      {
        id: 'part-a', prompt: 'Verify atom conservation.',
        points: [
          { id: 'a-first-count', criterion: 'Counts atoms in snapshot 1.', acceptableEvidence: '14 + 2(3) = 20 A atoms.' },
          { id: 'a-second-count', criterion: 'Counts atoms in snapshot 2 and compares totals.', acceptableEvidence: '8 + 2(6) = 20 A atoms, equal to snapshot 1.' },
        ],
      },
      {
        id: 'part-b', prompt: 'Determine net direction.',
        points: [{ id: 'b-direction', criterion: 'Uses the changing species counts to identify net dimer formation.', acceptableEvidence: 'A2 count rises by 3 while A count falls by 6, consistent with net 2 A to A2.' }],
      },
      {
        id: 'part-c', prompt: 'Identify dynamic-equilibrium evidence.',
        points: [{ id: 'c-rates', criterion: 'Requires equal nonzero opposing molecular rates.', acceptableEvidence: 'States that both directions must continue at equal nonzero rates; repeated counts alone do not directly show events.' }],
      },
    ],
  },
  {
    id: 'equilibrium-common-ion-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: pure-water and common-ion solubility',
    summary: 'A point-level draft rubric for two solubility calculations, approximation verification, and composition reasoning.',
    alignment: alignment(
      ['introduction-solubility-equilibria', 'common-ion-effect'],
      ['7.11.A', '7.12.A'],
      ['5.B', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-equilibrium-short-frq-008',
    maxPoints: 4,
    parts: [
      {
        id: 'part-a', prompt: 'Calculate pure-water molar solubility.',
        points: [{ id: 'a-solubility', criterion: 'Uses 1:1 dissolution stoichiometry and solves Ksp = s squared.', acceptableEvidence: 's = sqrt(2.50 x 10^-9) = 5.00 x 10^-5 mol/L.' }],
      },
      {
        id: 'part-b', prompt: 'Calculate and verify common-ion molar solubility.',
        points: [
          { id: 'b-value', criterion: 'Uses the common-ion concentration to estimate solubility.', acceptableEvidence: 'x = (2.50 x 10^-9)/0.0200 = 1.25 x 10^-7 mol/L.' },
          { id: 'b-check', criterion: 'Quantitatively verifies the approximation.', acceptableEvidence: 'x is 0.000625% of 0.0200 mol/L, so neglecting x in the X- total is reasonable.' },
        ],
      },
      {
        id: 'part-c', prompt: 'Explain the common-ion effect.',
        points: [{ id: 'c-explanation', criterion: 'Explains lower molar solubility at unchanged Ksp.', acceptableEvidence: 'Preexisting X- means less P+ is needed to reach the same ion product; Ksp is unchanged at fixed temperature.' }],
      },
    ],
  },
  {
    id: 'equilibrium-common-ion-long-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: solubility, common ion, and precipitation',
    summary: 'A point-level draft rubric for Ksp, molar solubility, approximation checking, common-ion reasoning, and a precipitation test.',
    alignment: alignment(
      ['introduction-solubility-equilibria', 'common-ion-effect'],
      ['7.11.A', '7.12.A'],
      ['5.B', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-equilibrium-long-frq-002',
    maxPoints: 7,
    parts: [
      {
        id: 'part-a', prompt: 'Write the solubility-product expression.',
        points: [{ id: 'a-expression', criterion: 'Omits the pure solid and includes both dissolved ions.', acceptableEvidence: 'Ksp = [Y+][F-].' }],
      },
      {
        id: 'part-b', prompt: 'Calculate molar solubility in pure water.',
        points: [
          { id: 'b-setup', criterion: 'Relates both ion concentrations to the 1:1 molar solubility.', acceptableEvidence: 'Uses [Y+] = [F-] = s and Ksp = s^2.' },
          { id: 'b-value', criterion: 'Calculates the pure-water molar solubility.', acceptableEvidence: 's = sqrt(6.40 x 10^-8) = 2.53 x 10^-4 mol/L.' },
        ],
      },
      {
        id: 'part-c', prompt: 'Calculate molar solubility in 0.0100 mol/L F-.',
        points: [
          { id: 'c-setup', criterion: 'Includes the common-ion concentration in the equilibrium expression.', acceptableEvidence: 'Uses 6.40 x 10^-8 = x(0.0100 + x), or the justified approximation x(0.0100).' },
          { id: 'c-value', criterion: 'Obtains and checks the common-ion molar solubility.', acceptableEvidence: 'Reports approximately 6.40 x 10^-6 mol/L and notes x is about 0.064% of 0.0100 mol/L.' },
        ],
      },
      {
        id: 'part-d', prompt: 'Explain the solubility decrease.',
        points: [{ id: 'd-common-ion', criterion: 'Uses quotient or equilibrium reasoning for the common-ion effect.', acceptableEvidence: 'Added F- raises Qsp, favoring solid formation and lowering the equilibrium [Y+].' }],
      },
      {
        id: 'part-e', prompt: 'Predict precipitation after mixing two solutions.',
        points: [{ id: 'e-precipitation', criterion: 'Accounts for dilution and compares Qsp with Ksp.', acceptableEvidence: 'After equal-volume mixing, Qsp = (5.0 x 10^-4)(1.0 x 10^-4) = 5.0 x 10^-8; because Qsp < Ksp, no precipitate is predicted.' }],
      },
    ],
  },
  {
    id: 'equilibrium-transformations-long-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: constant transformations and disturbances',
    summary: 'A point-level draft rubric combining equilibrium composition, transformed reactions, compression, temperature evidence, and a particle model.',
    alignment: alignment(
      ['calculating-equilibrium-constant', 'properties-equilibrium-constant', 'representations-equilibrium', 'introduction-le-chatelier-principle', 'reaction-quotient-le-chatelier-principle'],
      ['7.4.A', '7.6.A', '7.8.A', '7.9.A', '7.10.A'],
      ['3.B', '5.F', '6.D', '6.E'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-equilibrium-long-frq-003',
    maxPoints: 8,
    parts: [
      {
        id: 'part-a', prompt: 'Determine the equilibrium concentration change.',
        points: [{ id: 'a-stoichiometry', criterion: 'Uses the 2:1 stoichiometric change for J and K.', acceptableEvidence: 'Shows that a 0.200 mol/L decrease in J produces a 0.100 mol/L increase in K.' }],
      },
      {
        id: 'part-b', prompt: 'Write the expression and calculate Kc.',
        points: [
          { id: 'b-expression', criterion: 'Writes the equilibrium expression for the reaction as given.', acceptableEvidence: 'Kc = [K]/[J]^2.' },
          { id: 'b-value', criterion: 'Calculates Kc from equilibrium concentrations.', acceptableEvidence: 'Kc = 0.200/(0.400)^2 = 1.25.' },
        ],
      },
      {
        id: 'part-c', prompt: 'Determine Kc for the reversed and doubled reaction.',
        points: [{ id: 'c-transformation', criterion: 'Applies reciprocal and exponent transformations.', acceptableEvidence: 'For 2 K(g) <=> 4 J(g), Kc = (1/1.25)^2 = 0.640.' }],
      },
      {
        id: 'part-d', prompt: 'Analyze a compression at constant temperature.',
        points: [
          { id: 'd-quotient', criterion: 'Calculates or proportionally evaluates the immediate quotient.', acceptableEvidence: 'Doubling both concentrations gives Qc = 0.400/(0.800)^2 = 0.625.' },
          { id: 'd-direction', criterion: 'Uses Qc < Kc to predict a net product shift.', acceptableEvidence: 'States that net K formation occurs because 0.625 is below 1.25.' },
        ],
      },
      {
        id: 'part-e', prompt: 'Infer the thermal direction from a higher-temperature constant.',
        points: [{ id: 'e-temperature', criterion: 'Uses the increase in Kc with temperature to infer endothermic forward reaction.', acceptableEvidence: 'States that heat favors products, so the forward reaction is endothermic.' }],
      },
      {
        id: 'part-f', prompt: 'Describe a particle model at the new equilibrium.',
        points: [{ id: 'f-model', criterion: 'Connects stable average particle counts with continuing equal-rate events.', acceptableEvidence: 'Shows or describes both J-to-K and K-to-J events continuing while average counts remain constant.' }],
      },
    ],
  },
  {
    id: 'equilibrium-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: concentration disturbance explanation',
    summary: 'A point-level draft rubric separating quotient calculation, direction, and reasoning.',
    alignment: alignment(
      ['reaction-quotient-le-chatelier-principle'],
      ['7.10.A'],
      ['5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-equilibrium-short-frq-001',
    maxPoints: 3,
    parts: [
      {
        id: 'part-a',
        prompt: 'Calculate the reaction quotient immediately after the disturbance.',
        points: [{ id: 'a-calculation', criterion: 'Calculates the post-disturbance quotient correctly.', acceptableEvidence: 'Shows the correct expression and obtains Qc = 0.32.' }],
      },
      {
        id: 'part-b',
        prompt: 'Predict the net direction.',
        points: [{ id: 'b-direction', criterion: 'States the correct net direction.', acceptableEvidence: 'States that the system proceeds toward products.' }],
      },
      {
        id: 'part-c',
        prompt: 'Justify the prediction.',
        points: [{ id: 'c-reasoning', criterion: 'Uses a valid Q-versus-K comparison.', acceptableEvidence: 'Explains that Qc = 0.32 is less than Kc = 0.50, so product formation raises Qc.' }],
      },
    ],
  },
  {
    id: 'equilibrium-long-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: equilibrium investigation and model',
    summary: 'A point-level draft rubric for calculation, experimental reasoning, and particle-level explanation.',
    alignment: alignment(
      ['calculating-equilibrium-constant', 'representations-equilibrium', 'introduction-le-chatelier-principle'],
      ['7.4.A', '7.8.A', '7.9.A'],
      ['2.C', '3.C', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-equilibrium-long-frq-001',
    maxPoints: 6,
    parts: [
      {
        id: 'part-a', prompt: 'Determine equilibrium concentrations.',
        points: [
          { id: 'a-ice-setup', criterion: 'Uses stoichiometrically consistent concentration changes.', acceptableEvidence: 'Represents changes as -x, -x, and +2x for R2, S2, and RS.' },
          { id: 'a-values', criterion: 'Obtains the correct equilibrium concentrations.', acceptableEvidence: '[R2] = [S2] = 0.30 M and [RS] = 0.40 M.' },
        ],
      },
      {
        id: 'part-b', prompt: 'Calculate Kc.',
        points: [{ id: 'b-k-value', criterion: 'Calculates Kc from equilibrium values.', acceptableEvidence: 'Kc = (0.40)^2/((0.30)(0.30)) = 1.78, or 1.8 with appropriate rounding.' }],
      },
      {
        id: 'part-c', prompt: 'Select a measurement method.',
        points: [{ id: 'c-method', criterion: 'Identifies a measurement that can distinguish a colored species.', acceptableEvidence: 'Uses calibrated absorbance or another selective quantitative measurement tied to concentration.' }],
      },
      {
        id: 'part-d', prompt: 'Predict and justify a volume disturbance.',
        points: [{ id: 'd-volume', criterion: 'Recognizes no preferred shift for equal gas coefficients.', acceptableEvidence: 'Both sides contain two total moles of gas, so compression changes numerator and denominator proportionally and leaves Qc equal to Kc.' }],
      },
      {
        id: 'part-e', prompt: 'Describe the equilibrium particle model.',
        points: [{ id: 'e-model', criterion: 'Connects a constant composition with continuing opposing events.', acceptableEvidence: 'Describes fixed average counts while both bond-forming and bond-breaking events continue at equal rates.' }],
      },
    ],
  },
]

export const apChemistryEquilibriumResources = Object.freeze(assertValidEditorialCatalog(resources))

export function getEquilibriumResource(id) {
  return apChemistryEquilibriumResources.find((resource) => resource.id === id) || null
}

export function getEquilibriumResourcesByKind(kind, { includeDrafts = false } = {}) {
  return apChemistryEquilibriumResources.filter((resource) => (
    resource.kind === kind && (includeDrafts || resource.review.status === 'published')
  ))
}
