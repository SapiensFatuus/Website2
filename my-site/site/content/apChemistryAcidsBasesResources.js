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
    domainId: 'acids-bases',
    skillIds: Object.freeze(skillIds),
    learningObjectiveIds: Object.freeze(learningObjectiveIds),
    sciencePracticeIds: Object.freeze(sciencePracticeIds),
  })
}

const resources = [
  {
    id: 'acids-bases-ph-poh', kind: 'formula', schemaVersion: 1,
    title: 'pH, pOH, and ion concentration',
    summary: 'Translate among hydronium concentration, hydroxide concentration, pH, and pOH while keeping the temperature assumption visible.',
    alignment: alignment(['ph-poh-strong-acids-bases'], ['8.2.A'], ['5.B']),
    review: draftReview, provenance: originalProvenance, conceptGroup: 'acid-base-equilibria',
    examReference: { status: 'provided', sourceId: 'ap-chemistry-reference-2026', note: 'The current exam reference information provides the logarithmic pH and pOH relationships and the 25 °C pH-pOH sum.' },
    expression: 'pH = -log[H3O+]; pOH = -log[OH-]; at 25 °C, pH + pOH = 14.00',
    variables: [
      { symbol: 'pH', meaning: 'negative base-10 logarithm of hydronium concentration relative to the standard state', units: 'none' },
      { symbol: 'pOH', meaning: 'negative base-10 logarithm of hydroxide concentration relative to the standard state', units: 'none' },
      { symbol: '[H3O+], [OH-]', meaning: 'equilibrium molar ion concentrations', units: 'mol/L' },
    ],
    assumptions: ['The logarithm uses a dimensionless concentration ratio, conventionally represented with molar concentration in introductory calculations.', 'The value 14.00 for pH + pOH assumes 25 °C.'],
    appliesWhen: ['Converting a strong-acid or strong-base ion concentration to pH or pOH.', 'Converting between pH and pOH at 25 °C.'],
    doesNotApplyWhen: ['Treating the formal concentration of a weak acid as if it were its hydronium concentration.', 'Using 14.00 at a temperature where a different value of pKw is supplied.'],
    rearrangements: ['[H3O+] = 10^(-pH)', '[OH-] = 10^(-pOH)', 'At 25 °C, pOH = 14.00 - pH.'],
    workedExample: { prompt: 'A strong monoprotic acid produces [H3O+] = 2.5 × 10^-3 M. Find the pH.', steps: ['Use pH = -log[H3O+].', 'Evaluate -log(2.5 × 10^-3) = 2.602.', 'Report two decimal places because the concentration has two significant figures.'], answer: 'pH = 2.60.' },
    commonMistake: 'Subtracting a hydronium concentration from 14 instead of first converting it to pH.',
  },
  {
    id: 'acids-bases-ka-kb-kw', kind: 'formula', schemaVersion: 1,
    title: 'Acid and base equilibrium constants',
    summary: 'Connect weak-acid and weak-base equilibrium expressions through their conjugate relationship and the water constant.',
    alignment: alignment(['weak-acid-base-equilibria', 'ph-pka'], ['8.3.A', '8.7.A'], ['5.C', '2.D']),
    review: draftReview, provenance: originalProvenance, conceptGroup: 'acid-base-equilibria',
    examReference: { status: 'provided', sourceId: 'ap-chemistry-reference-2026', note: 'The current exam reference information provides Ka, Kb, Kw, and the conjugate-pair product relationship.' },
    expression: 'Ka = [H3O+][A-]/[HA]; Kb = [BH+][OH-]/[B]; Ka × Kb = Kw',
    variables: [
      { symbol: 'Ka, Kb', meaning: 'equilibrium constants for acid and base ionization reactions as written', units: 'dimensionless under the activity convention' },
      { symbol: 'Kw', meaning: 'water autoionization constant at the stated temperature', units: 'dimensionless under the activity convention' },
      { symbol: '[X]', meaning: 'equilibrium molar concentration of species X', units: 'mol/L' },
    ],
    assumptions: ['The equilibrium equation matches the stated constant.', 'Pure liquid water is omitted from the equilibrium expression.', 'KaKb = Kw applies to a conjugate acid-base pair at the same temperature.'],
    appliesWhen: ['Solving weak-acid or weak-base equilibrium composition.', 'Finding a conjugate partner constant from the other constant and Kw.'],
    doesNotApplyWhen: ['Multiplying constants for species that are not a conjugate pair.', 'Using initial concentrations in place of equilibrium concentrations without a justified approximation.'],
    rearrangements: ['Kb = Kw/Ka for the conjugate base of HA.', 'Ka = Kw/Kb for the conjugate acid of B.', 'A larger Ka corresponds to a stronger acid within the same solvent and temperature.'],
    workedExample: { prompt: 'At 25 °C, an acid has Ka = 1.8 × 10^-5. Find Kb for its conjugate base.', steps: ['Use KaKb = Kw.', 'Substitute Kb = (1.0 × 10^-14)/(1.8 × 10^-5).', 'Evaluate and round to two significant figures.'], answer: 'Kb = 5.6 × 10^-10.' },
    commonMistake: 'Using Ka itself as the Kb of the conjugate base instead of applying KaKb = Kw.',
  },
  {
    id: 'acids-bases-henderson-hasselbalch', kind: 'formula', schemaVersion: 1,
    title: 'Buffer composition and pH',
    summary: 'Relate buffer pH to acid strength and the conjugate-base-to-acid ratio after any stoichiometric reaction is complete.',
    alignment: alignment(['acid-base-reactions-buffers', 'properties-buffers', 'henderson-hasselbalch-equation', 'buffer-capacity'], ['8.4.A', '8.8.A', '8.9.A', '8.10.A'], ['5.F', '6.D', '6.G']),
    review: draftReview, provenance: originalProvenance, conceptGroup: 'buffers-and-titrations',
    examReference: { status: 'provided', sourceId: 'ap-chemistry-reference-2026', note: 'The current exam reference information provides the Henderson-Hasselbalch relationship.' },
    expression: 'pH = pKa + log([A-]/[HA])',
    variables: [
      { symbol: 'pKa', meaning: 'negative base-10 logarithm of Ka for the weak acid', units: 'none' },
      { symbol: '[A-]', meaning: 'equilibrium concentration of conjugate base', units: 'mol/L' },
      { symbol: '[HA]', meaning: 'equilibrium concentration of weak acid', units: 'mol/L' },
    ],
    assumptions: ['Both members of the conjugate pair are present in meaningful amounts.', 'Any added strong acid or base has reacted stoichiometrically before the ratio is evaluated.', 'The concentration ratio is a suitable approximation to the activity ratio.'],
    appliesWhen: ['Estimating the pH of a buffer from its conjugate-pair ratio.', 'Reasoning about how a changed ratio shifts buffer pH.'],
    doesNotApplyWhen: ['At an equivalence point where one conjugate component has been essentially consumed.', 'Before accounting for a strong-acid or strong-base neutralization reaction.'],
    rearrangements: ['pH - pKa = log([A-]/[HA])', '[A-]/[HA] = 10^(pH-pKa)', 'Equal conjugate-pair concentrations give pH = pKa.'],
    workedExample: { prompt: 'A buffer has pKa = 4.76 and [A-]/[HA] = 0.50. Find its pH.', steps: ['Substitute the ratio into pH = pKa + log([A-]/[HA]).', 'Evaluate log(0.50) = -0.301.', 'Add: 4.76 - 0.301 = 4.459.'], answer: 'pH = 4.46.' },
    commonMistake: 'Reversing the ratio and using [HA]/[A-], which changes the sign of the logarithmic correction.',
  },
  {
    id: 'acids-bases-buffer-stoichiometry', kind: 'formula', schemaVersion: 1,
    title: 'Buffer reaction before equilibrium',
    summary: 'Track mole changes caused by added strong acid or base before applying a buffer equilibrium relationship.',
    alignment: alignment(['acid-base-reactions-buffers', 'properties-buffers', 'buffer-capacity'], ['8.4.A', '8.8.A', '8.10.A'], ['5.F', '6.D', '6.G']),
    review: draftReview, provenance: originalProvenance, conceptGroup: 'buffers-and-titrations',
    examReference: { status: 'not-provided', sourceId: 'ap-chemistry-reference-2026', note: 'The stoichiometric before-and-after workflow is not supplied as a separate equation; students must construct it from the neutralization reaction.' },
    expression: 'A- + H3O+ -> HA + H2O; HA + OH- -> A- + H2O',
    variables: [
      { symbol: 'n(HA)', meaning: 'amount of weak acid before or after neutralization', units: 'mol' },
      { symbol: 'n(A-)', meaning: 'amount of conjugate base before or after neutralization', units: 'mol' },
      { symbol: 'n(strong reagent)', meaning: 'amount of added strong acid or base', units: 'mol' },
    ],
    assumptions: ['The strong reagent reacts essentially to completion with the appropriate buffer component.', 'Stoichiometric coefficients are applied to mole changes.', 'Both conjugate components remain after reaction if a buffer equation will be used.'],
    appliesWhen: ['A strong acid or base is added to a buffer.', 'Determining whether buffer capacity has been exceeded.'],
    doesNotApplyWhen: ['Skipping directly to a concentration ratio before neutralization.', 'The added reagent remains in excess, in which case its excess controls the pH.'],
    rearrangements: ['For added H3O+: n(A-) decreases and n(HA) increases by the reacted amount.', 'For added OH-: n(HA) decreases and n(A-) increases by the reacted amount.', 'In a common final volume, the mole ratio equals the concentration ratio.'],
    workedExample: { prompt: 'A buffer initially contains 0.020 mol HA and 0.030 mol A-. Then 0.0050 mol HCl is added. Find the post-reaction mole ratio n(A-)/n(HA).', steps: ['H3O+ reacts with A- in a 1:1 ratio.', 'Update A-: 0.030 - 0.0050 = 0.025 mol.', 'Update HA: 0.020 + 0.0050 = 0.025 mol.', 'Form the ratio 0.025/0.025.'], answer: 'n(A-)/n(HA) = 1.00.' },
    commonMistake: 'Subtracting the added acid from HA instead of from the base component that consumes it.',
  },
  {
    id: 'acids-bases-titration-stoichiometry', kind: 'formula', schemaVersion: 1,
    title: 'Titration equivalence stoichiometry',
    summary: 'Use the balanced neutralization reaction to locate equivalence before choosing the equilibrium model for pH.',
    alignment: alignment(['acid-base-titrations'], ['8.5.A'], ['5.D']),
    review: draftReview, provenance: originalProvenance, conceptGroup: 'buffers-and-titrations',
    examReference: { status: 'not-provided', sourceId: 'ap-chemistry-reference-2026', note: 'Equivalence stoichiometry must be derived from the balanced reaction rather than read from a dedicated reference equation.' },
    expression: 'At equivalence, reacting amounts satisfy n(acid)/coefficient(acid) = n(base)/coefficient(base)',
    variables: [
      { symbol: 'n(acid), n(base)', meaning: 'reacting amounts of acid and base', units: 'mol' },
      { symbol: 'coefficient', meaning: 'stoichiometric coefficient in the balanced neutralization equation', units: 'none' },
      { symbol: 'n', meaning: 'amount calculated by n = M × V with V in liters', units: 'mol' },
    ],
    assumptions: ['The neutralization reaction is correctly balanced.', 'The titrant reacts essentially to completion before equilibrium pH analysis.', 'Volumes and molarities describe delivered reacting amounts.'],
    appliesWhen: ['Locating the equivalence volume.', 'Determining the species present before an equilibrium pH calculation.'],
    doesNotApplyWhen: ['Assuming equal volumes at equivalence without comparing reacting moles.', 'Choosing pH = 7 solely because the equivalence point has been reached.'],
    rearrangements: ['For a 1:1 reaction, MacidVacid = MbaseVbase at equivalence.', 'After equivalence, calculate excess strong titrant from the difference in reacting moles.'],
    workedExample: { prompt: 'What volume of 0.100 M NaOH reaches equivalence with 25.00 mL of 0.0800 M monoprotic acid?', steps: ['Calculate acid amount: (0.0800 mol/L)(0.02500 L) = 0.00200 mol.', 'The reaction is 1:1, so 0.00200 mol OH- is required.', 'Divide by 0.100 mol/L to obtain 0.0200 L.'], answer: '20.0 mL of NaOH.' },
    commonMistake: 'Setting acid and base volumes equal instead of setting stoichiometrically adjusted reacting amounts equal.',
  },
  {
    id: 'acids-bases-percent-ionization', kind: 'formula', schemaVersion: 1,
    title: 'Percent ionization of a weak acid',
    summary: 'Compare the amount of weak acid that ionizes with its initial formal concentration.',
    alignment: alignment(['weak-acid-base-equilibria', 'molecular-structure-acids-bases'], ['8.3.A', '8.6.A'], ['5.C', '6.C']),
    review: draftReview, provenance: originalProvenance, conceptGroup: 'acid-base-equilibria',
    examReference: { status: 'not-provided', sourceId: 'ap-chemistry-reference-2026', note: 'Percent ionization is not supplied as a separate relationship; it follows from the fraction of initial acid converted.' },
    expression: 'percent ionization = ([H3O+]equilibrium/[HA]initial) × 100% for a monoprotic weak acid in water',
    variables: [
      { symbol: '[H3O+]equilibrium', meaning: 'equilibrium hydronium concentration produced by acid ionization', units: 'mol/L' },
      { symbol: '[HA]initial', meaning: 'initial formal concentration of weak acid', units: 'mol/L' },
      { symbol: 'percent ionization', meaning: 'percentage of initial weak-acid particles that ionize', units: '%' },
    ],
    assumptions: ['The acid is monoprotic and is the dominant source of hydronium.', 'The numerator represents hydronium produced by the acid rather than an unrelated added source.'],
    appliesWhen: ['Comparing how dilution changes the fraction ionized.', 'Relating measured equilibrium hydronium concentration to weak-acid conversion.'],
    doesNotApplyWhen: ['Treating percent ionization as the same quantity as Ka.', 'A strong acid contribution dominates the measured hydronium concentration.'],
    rearrangements: ['fraction ionized = percent ionization/100', '[H3O+]equilibrium = (fraction ionized)[HA]initial'],
    workedExample: { prompt: 'A 0.100 M monoprotic weak acid establishes [H3O+] = 0.0042 M. Find its percent ionization.', steps: ['Divide equilibrium hydronium by initial acid concentration: 0.0042/0.100 = 0.042.', 'Multiply the fraction by 100%.'], answer: '4.2% ionization.' },
    commonMistake: 'Dividing by the remaining equilibrium acid concentration when the definition asks for the initial formal concentration.',
  },
  {
    id: 'acids-bases-proton-transfer-and-strong-solutions', kind: 'lesson', schemaVersion: 1,
    title: 'From proton transfer to strong-acid and strong-base pH',
    summary: 'Identify conjugate pairs first, then distinguish reaction stoichiometry from the logarithmic pH scale.',
    alignment: alignment(['introduction-acids-bases', 'ph-poh-strong-acids-bases'], ['8.1.A', '8.2.A'], ['5.B']),
    review: draftReview, provenance: originalProvenance,
    prerequisites: ['Balanced molecular and net ionic equations.', 'Molar concentration and powers of ten.', 'Base-10 logarithms.'],
    sections: [
      { heading: 'Follow the proton', body: 'In a Brønsted-Lowry model, an acid donates a proton and a base accepts it. Removing one proton from an acid produces its conjugate base; adding one proton to a base produces its conjugate acid. Charge and atom accounting are faster checks than memorizing labels.' },
      { heading: 'Separate dissociation from pH', body: 'For a strong acid or base, first use formula and stoichiometry to determine the ion concentration. Only then apply the logarithm. A strong diprotic acid is not automatically assumed to release both protons completely; the chemical behavior stated for each step matters.' },
    ],
    workedExamples: [{ prompt: 'In NH3 + H2O <=> NH4+ + OH-, identify both conjugate pairs.', steps: ['NH3 gains H+ and is the base; NH4+ is its conjugate acid.', 'H2O loses H+ and is the acid; OH- is its conjugate base.', 'Each pair differs by exactly one proton.'], answer: 'NH3/NH4+ and H2O/OH- are the conjugate pairs.' }],
    misconceptions: [{ id: 'acid-means-negative-charge', claim: 'An acid must be negatively charged.', correction: 'Acid-base role depends on proton transfer; neutral H2O can donate a proton and positive NH4+ can also act as an acid.' }],
    retrievalChecks: [{ prompt: 'Why is concentration not numerically equal to pH?', answer: 'pH is the negative logarithm of a dimensionless concentration ratio, so it is a different scale.' }],
    formulaIds: ['acids-bases-ph-poh'],
  },
  {
    id: 'acids-bases-weak-equilibrium-and-strength', kind: 'lesson', schemaVersion: 1,
    title: 'Weak equilibria, acid strength, and molecular structure',
    summary: 'Build a weak-acid or weak-base equilibrium model and connect constant magnitude to conjugate stability.',
    alignment: alignment(['weak-acid-base-equilibria', 'molecular-structure-acids-bases', 'ph-pka'], ['8.3.A', '8.6.A', '8.7.A'], ['5.C', '6.C', '2.D']),
    review: draftReview, provenance: originalProvenance,
    prerequisites: ['Equilibrium expressions and ICE-table reasoning.', 'Lewis structures, bond polarity, and resonance.', 'Logarithms and pH.'],
    sections: [
      { heading: 'Use equilibrium, not complete dissociation', body: 'A weak acid establishes an equilibrium with substantial un-ionized acid remaining. Write the proton-transfer equation, map initial-change-equilibrium concentrations, and substitute equilibrium values into Ka. An approximation is a claim that must be checked, not an automatic step.' },
      { heading: 'Explain strength through the products of ionization', body: 'A structural feature strengthens an acid when it makes proton loss more favorable. Stabilizing the conjugate base through resonance, electronegativity, or charge delocalization often increases Ka. A stronger acid has a smaller pKa and a weaker conjugate base.' },
    ],
    workedExamples: [{ prompt: 'An acid has Ka = 4.0 × 10^-6. A second acid has Ka = 2.0 × 10^-4 under the same conditions. Which is stronger?', steps: ['Compare constants for the same type of ionization reaction.', 'The second Ka is fifty times larger.', 'A larger Ka means products of acid ionization are more favored.'], answer: 'The second acid is stronger and has the smaller pKa.' }],
    misconceptions: [{ id: 'strong-means-concentrated', claim: 'A strong acid must have a high concentration.', correction: 'Strength describes extent of ionization; concentration describes amount per volume. A dilute strong acid and concentrated weak acid are both possible.' }],
    retrievalChecks: [{ prompt: 'Why does stabilizing A- generally strengthen HA?', answer: 'A more stable conjugate base lowers the energetic penalty for proton loss, shifting the ionization equilibrium farther toward products.' }],
    formulaIds: ['acids-bases-ka-kb-kw', 'acids-bases-percent-ionization'],
  },
  {
    id: 'acids-bases-buffer-reasoning', kind: 'lesson', schemaVersion: 1,
    title: 'Buffer composition, response, and capacity',
    summary: 'Use reaction-first reasoning to explain buffer response and distinguish pH location from buffer capacity.',
    alignment: alignment(['acid-base-reactions-buffers', 'properties-buffers', 'henderson-hasselbalch-equation', 'buffer-capacity'], ['8.4.A', '8.8.A', '8.9.A', '8.10.A'], ['5.F', '6.D', '6.G']),
    review: draftReview, provenance: originalProvenance,
    prerequisites: ['Conjugate acid-base pairs.', 'Mole stoichiometry.', 'Weak-acid equilibrium and logarithms.'],
    sections: [
      { heading: 'React first', body: 'When strong acid enters a buffer, the conjugate base consumes it. When strong base enters, the weak acid consumes it. Update moles using the balanced reaction before using any equilibrium relationship. If one buffer component is exhausted, the mixture is no longer described by a buffer ratio.' },
      { heading: 'Ratio controls pH; amount controls capacity', body: 'The conjugate-base-to-acid ratio positions the pH relative to pKa. Two buffers with the same ratio can have the same initial pH, while the one containing more moles of both components resists a larger added amount before its ratio changes substantially.' },
    ],
    workedExamples: [{ prompt: 'Two equal-volume buffers have the same [A-]/[HA] ratio. Buffer X has ten times the concentration of both components. Compare their initial pH and capacity.', steps: ['The equal ratios give the same logarithmic correction to pKa.', 'Buffer X contains ten times as many reacting moles in the same volume.', 'A fixed added amount changes X’s ratio less.'], answer: 'They begin at approximately the same pH, but X has greater buffer capacity.' }],
    misconceptions: [{ id: 'buffer-keeps-ph-fixed', claim: 'A buffer prevents any pH change.', correction: 'A buffer reduces the pH change by consuming added strong acid or base; its component ratio still changes.' }],
    retrievalChecks: [{ prompt: 'What calculation comes before Henderson-Hasselbalch after adding HCl?', answer: 'Use the neutralization reaction to decrease conjugate-base moles and increase weak-acid moles.' }],
    formulaIds: ['acids-bases-buffer-stoichiometry', 'acids-bases-henderson-hasselbalch'],
  },
  {
    id: 'acids-bases-titration-regions', kind: 'lesson', schemaVersion: 1,
    title: 'Choose the chemistry model across a titration',
    summary: 'Locate the titration region by stoichiometry, then use the species remaining there to choose a pH model.',
    alignment: alignment(['acid-base-titrations'], ['8.5.A'], ['5.D']),
    review: draftReview, provenance: originalProvenance,
    prerequisites: ['Neutralization stoichiometry.', 'Strong and weak acid-base pH models.', 'Buffer and conjugate-species reasoning.'],
    sections: [
      { heading: 'Inventory species before calculating pH', body: 'Added titrant first reacts stoichiometrically with analyte. Before equivalence, a weak analyte and its conjugate product may form a buffer. At equivalence, the analyte has been converted to its conjugate species, whose hydrolysis can control pH. Beyond equivalence, excess strong titrant usually controls pH.' },
      { heading: 'Equivalence is not the same as neutrality', body: 'Equivalence means stoichiometrically matched reacting amounts. A strong-acid/strong-base equivalence mixture is approximately neutral at 25 °C, but a weak-acid/strong-base equivalence mixture contains a basic conjugate base. The chemical identity of the remaining species decides pH.' },
    ],
    workedExamples: [{ prompt: 'At equivalence in a weak monoprotic acid–strong base titration, what species controls pH?', steps: ['The original weak acid has been consumed stoichiometrically.', 'Its conjugate base remains in solution.', 'That base reacts with water to produce OH-.'], answer: 'Conjugate-base hydrolysis makes the equivalence solution basic.' }],
    misconceptions: [{ id: 'equivalence-always-seven', claim: 'Every acid-base equivalence point has pH 7.', correction: 'Equivalence is a mole relationship; conjugate-acid or conjugate-base hydrolysis can shift pH away from 7.' }],
    retrievalChecks: [{ prompt: 'What usually controls pH after the equivalence point?', answer: 'The concentration of excess strong titrant after stoichiometric neutralization.' }],
    formulaIds: ['acids-bases-titration-stoichiometry'],
  },
  {
    id: 'acids-bases-ph-and-solubility', kind: 'lesson', schemaVersion: 1,
    title: 'Couple proton transfer to solubility equilibrium',
    summary: 'Explain how consuming one dissolved ion can drive additional dissolution without claiming that pH changes every salt equally.',
    alignment: alignment(['ph-solubility'], ['8.11.A'], ['2.D']),
    review: draftReview, provenance: originalProvenance,
    prerequisites: ['Solubility-product expressions.', 'Reaction quotient compared with equilibrium constant.', 'Acid-base reactions of anions.'],
    sections: [
      { heading: 'Connect two reactions through a shared ion', body: 'If a sparingly soluble solid releases an anion that reacts with added acid, protonation lowers the free concentration of that anion. The dissolution quotient falls below Ksp, so more solid can dissolve until the equilibrium condition is restored.' },
      { heading: 'Check whether the ion actually reacts', body: 'Lowering pH has a large effect only when a dissolved ion is appreciably basic or participates in another favorable proton-transfer reaction. A spectator ion that is the conjugate base of a strong acid is not removed to the same extent, so the solubility response may be small.' },
    ],
    workedExamples: [{ prompt: 'Why can a carbonate-containing solid become more soluble when strong acid is added?', steps: ['Dissolution releases carbonate species.', 'Added hydronium protonates those species, lowering their free concentration.', 'The dissolution quotient decreases below Ksp.', 'Additional solid dissolves as the system returns toward equilibrium.'], answer: 'Acid removes a dissolution product through proton transfer, coupling that favorable reaction to further dissolution.' }],
    misconceptions: [{ id: 'acid-dissolves-every-salt', claim: 'Adding acid substantially increases the solubility of every ionic solid.', correction: 'The effect depends on whether acid removes a dissolved ion through a favorable reaction; many ions are not appreciably protonated.' }],
    retrievalChecks: [{ prompt: 'What quotient change drives more solid to dissolve after an anion is protonated?', answer: 'Removing free anion lowers the dissolution quotient below Ksp.' }],
    formulaIds: ['acids-bases-ka-kb-kw'],
  },
  {
    id: 'acids-bases-weak-acid-titration-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Weak-acid titration measurements',
    summary: 'An original titration table for connecting stoichiometric regions, pH, pKa, and conjugate-base hydrolysis.',
    alignment: alignment(
      ['acid-base-titrations', 'ph-pka'],
      ['8.5.A', '8.7.A'],
      ['5.D', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    context: 'A student titrates 25.00 mL of 0.0800 M monoprotic weak acid HX with 0.1000 M NaOH at 25 °C. The acid has Ka = 1.0 × 10^-5. The student records the pH after each listed total volume of titrant has been delivered.',
    representation: {
      type: 'table',
      caption: 'Measured pH during titration of HX with NaOH',
      columns: ['NaOH added (mL)', 'Measured pH'],
      rows: [
        ['0.00', '3.05'],
        ['10.00', '5.00'],
        ['20.00', '8.82'],
        ['24.00', '11.91'],
      ],
      accessibleDescription: 'Before titrant is added, the pH is 3.05. At 10.00 milliliters added, the pH is 5.00. At 20.00 milliliters added, the pH is 8.82. At 24.00 milliliters added, the pH is 11.91.',
    },
  },
  {
    id: 'acids-bases-buffer-capacity-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Buffer composition and response trials',
    summary: 'An original controlled data table for separating the effects of conjugate-pair ratio and total buffer amount.',
    alignment: alignment(
      ['acid-base-reactions-buffers', 'properties-buffers', 'henderson-hasselbalch-equation', 'buffer-capacity'],
      ['8.4.A', '8.8.A', '8.9.A', '8.10.A'],
      ['5.F', '6.D', '6.G'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    context: 'Three 100.0 mL buffers are prepared from the same weak acid HA and conjugate base A-. For this acid, pKa = 4.76. Each buffer receives 0.00200 mol HCl from a concentrated solution, and the volume change is treated as negligible. The listed pH values are measured after mixing.',
    representation: {
      type: 'table',
      caption: 'Buffer composition and pH before and after adding the same amount of HCl',
      columns: ['Buffer', 'Initial [HA] (mol/L)', 'Initial [A-] (mol/L)', 'Initial pH', 'pH after HCl'],
      rows: [
        ['A', '0.100', '0.100', '4.76', '4.58'],
        ['B', '0.500', '0.500', '4.76', '4.73'],
        ['C', '0.0500', '0.200', '5.36', '5.17'],
      ],
      accessibleDescription: 'Buffer A begins with 0.100 molar HA and 0.100 molar A-, changing from pH 4.76 to 4.58. Buffer B begins with 0.500 molar of each component, changing from pH 4.76 to 4.73. Buffer C begins with 0.0500 molar HA and 0.200 molar A-, changing from pH 5.36 to 5.17.',
    },
  },
  {
    id: 'acids-bases-weak-acid-dilution-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Weak-acid dilution series',
    summary: 'An original equilibrium data table separating hydronium concentration from the fraction of weak acid that ionizes.',
    alignment: alignment(
      ['weak-acid-base-equilibria', 'ph-pka'],
      ['8.3.A', '8.7.A'],
      ['2.D', '5.C', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    context: 'At 25 °C, three solutions are prepared from the same monoprotic weak acid HW, for which Ka = 4.0 × 10^-6. The equilibrium pH and percent ionization are determined for each formal acid concentration.',
    representation: {
      type: 'table',
      caption: 'Equilibrium measurements for three concentrations of HW',
      columns: ['Trial', 'Initial [HW] (mol/L)', 'Equilibrium pH', 'Percent ionization'],
      rows: [
        ['1', '0.400', '2.899', '0.316%'],
        ['2', '0.100', '3.200', '0.630%'],
        ['3', '0.0250', '3.503', '1.26%'],
      ],
      accessibleDescription: 'Trial 1 begins with 0.400 molar HW and has equilibrium pH 2.899 and 0.316 percent ionization. Trial 2 begins with 0.100 molar HW and has pH 3.200 and 0.630 percent ionization. Trial 3 begins with 0.0250 molar HW and has pH 3.503 and 1.26 percent ionization.',
    },
  },
  {
    id: 'acids-bases-fluorinated-acids-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Structure and strength of fluorinated carboxylic acids',
    summary: 'An original comparison table for relating acid strength to conjugate-base stabilization and an electron-withdrawing substituent.',
    alignment: alignment(
      ['molecular-structure-acids-bases', 'ph-pka'],
      ['8.6.A', '8.7.A'],
      ['2.D', '5.B', '6.C'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    context: 'At the same temperature, a student compares four monoprotic carboxylic acids. In this series, one hydrogen atom on the carbon next to the carboxyl group is replaced by fluorine at each step. The listed Ka values are used for the comparison.',
    representation: {
      type: 'table',
      caption: 'Acid formulas and Ka values for a fluorinated series',
      columns: ['Acid', 'Condensed formula', 'Ka'],
      rows: [
        ['Ethanoic acid', 'CH3COOH', '1.8 × 10^-5'],
        ['Fluoroethanoic acid', 'FCH2COOH', '2.6 × 10^-3'],
        ['Difluoroethanoic acid', 'F2CHCOOH', '5.7 × 10^-2'],
        ['Trifluoroethanoic acid', 'CF3COOH', '5.9 × 10^-1'],
      ],
      accessibleDescription: 'Ethanoic acid, CH3COOH, has Ka 1.8 times ten to the negative fifth. Fluoroethanoic acid, FCH2COOH, has Ka 2.6 times ten to the negative third. Difluoroethanoic acid, F2CHCOOH, has Ka 5.7 times ten to the negative second. Trifluoroethanoic acid, CF3COOH, has Ka 5.9 times ten to the negative first.',
    },
  },
  {
    id: 'acids-bases-indicator-equilibrium-stimulus',
    kind: 'stimulus',
    schemaVersion: 1,
    title: 'Color indicator equilibrium',
    summary: 'An original composition table for connecting indicator color, conjugate-pair ratio, pKa, and titration suitability.',
    alignment: alignment(
      ['acid-base-titrations', 'ph-pka', 'henderson-hasselbalch-equation'],
      ['8.5.A', '8.7.A', '8.9.A'],
      ['2.D', '5.F', '6.D', '6.G'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    context: 'The weak-acid indicator HIn is yellow, and its conjugate base In- is blue. A student prepares three buffered indicator samples at 25 °C. Spectrophotometric measurements give the percentage of the total indicator present in each form. The indicator concentration is small enough that it does not meaningfully change the sample pH.',
    representation: {
      type: 'table',
      caption: 'Indicator composition and observed color at three pH values',
      columns: ['Sample pH', 'HIn (%)', 'In- (%)', 'Observed color'],
      rows: [
        ['5.80', '90.9', '9.1', 'Yellow'],
        ['6.80', '50.0', '50.0', 'Green'],
        ['7.80', '9.1', '90.9', 'Blue'],
      ],
      accessibleDescription: 'At pH 5.80, the indicator is 90.9 percent yellow HIn and 9.1 percent blue In-, and appears yellow. At pH 6.80, it is 50.0 percent of each form and appears green. At pH 7.80, it is 9.1 percent HIn and 90.9 percent In-, and appears blue.',
    },
  },
  {
    id: 'acids-bases-buffer-reaction-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: buffer reaction before equilibrium',
    summary: 'A point-level draft rubric for a neutralization equation, post-reaction composition, and buffer pH.',
    alignment: alignment(
      ['acid-base-reactions-buffers', 'henderson-hasselbalch-equation'],
      ['8.4.A', '8.9.A'],
      ['5.F'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-acids-bases-short-frq-001',
    maxPoints: 3,
    parts: [
      {
        id: 'part-a',
        prompt: 'Write the net ionic reaction for added hydroxide.',
        points: [
          {
            id: 'a-reaction',
            criterion: 'Writes a chemically and stoichiometrically correct proton-transfer reaction.',
            acceptableEvidence: 'HX + OH- -> X- + H2O, with equivalent chemically valid notation accepted.',
          },
        ],
      },
      {
        id: 'part-b',
        prompt: 'Calculate the pH after the added hydroxide reacts.',
        points: [
          {
            id: 'b-stoichiometry',
            criterion: 'Updates both buffer-component amounts before using an equilibrium relationship.',
            acceptableEvidence: 'Obtains 0.0250 mol HX and 0.0250 mol X- after the 1:1 reaction.',
          },
          {
            id: 'b-ph',
            criterion: 'Uses the post-reaction conjugate-pair ratio to determine pH.',
            acceptableEvidence: 'Uses pH = 4.60 + log(0.0250/0.0250) and reports pH = 4.60.',
          },
        ],
      },
    ],
  },
  {
    id: 'acids-bases-measured-weak-acid-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: measured weak-acid equilibrium',
    summary: 'A four-point draft rubric for converting pH, determining Ka, calculating percent ionization, and predicting dilution effects.',
    alignment: alignment(
      ['weak-acid-base-equilibria', 'ph-pka'],
      ['8.3.A', '8.7.A'],
      ['5.C', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-acids-bases-short-frq-002',
    maxPoints: 4,
    parts: [
      {
        id: 'part-a',
        prompt: 'Calculate equilibrium hydronium concentration.',
        points: [
          {
            id: 'a-hydronium',
            criterion: 'Correctly converts the measured pH to molar hydronium concentration.',
            acceptableEvidence: '[H3O+] = 10^-2.72 = 1.91 × 10^-3 mol/L.',
          },
        ],
      },
      {
        id: 'part-b',
        prompt: 'Calculate Ka.',
        points: [
          {
            id: 'b-ka',
            criterion: 'Uses equilibrium concentrations in the weak-acid expression.',
            acceptableEvidence: 'Ka = (1.91 × 10^-3)^2/(0.150 - 1.91 × 10^-3) = 2.45 × 10^-5.',
          },
        ],
      },
      {
        id: 'part-c',
        prompt: 'Calculate percent ionization.',
        points: [
          {
            id: 'c-percent',
            criterion: 'Compares equilibrium hydronium concentration with initial formal acid concentration.',
            acceptableEvidence: '(1.91 × 10^-3/0.150)(100%) = 1.27%.',
          },
        ],
      },
      {
        id: 'part-d',
        prompt: 'Predict and explain the effect of dilution.',
        points: [
          {
            id: 'd-dilution',
            criterion: 'Distinguishes hydronium concentration from fractional ionization after dilution.',
            acceptableEvidence: 'Predicts higher pH and greater percent ionization, explaining that dilution lowers [H3O+] while favoring a larger ionized fraction at unchanged Ka.',
          },
        ],
      },
    ],
  },
  {
    id: 'acids-bases-ph-solubility-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: carbonate solubility and pH',
    summary: 'A three-point draft rubric for a solubility-product expression, pure-water molar solubility, and acid-coupled dissolution.',
    alignment: alignment(
      ['ph-solubility'],
      ['8.11.A'],
      ['2.D', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-acids-bases-short-frq-003',
    maxPoints: 3,
    parts: [
      {
        id: 'part-a',
        prompt: 'Write the solubility-product expression.',
        points: [
          {
            id: 'a-expression',
            criterion: 'Includes the dissolved ions with correct stoichiometric exponents and omits the pure solid.',
            acceptableEvidence: 'Ksp = [M2+][CO3^2-].',
          },
        ],
      },
      {
        id: 'part-b',
        prompt: 'Calculate molar solubility under the stated pure-water model.',
        points: [
          {
            id: 'b-solubility',
            criterion: 'Relates both ion concentrations to the 1:1 molar solubility and calculates the physical root.',
            acceptableEvidence: 'Ksp = s^2, so s = sqrt(4.0 × 10^-9) = 6.3 × 10^-5 mol/L.',
          },
        ],
      },
      {
        id: 'part-c',
        prompt: 'Predict and explain the effect of added acid.',
        points: [
          {
            id: 'c-acid-effect',
            criterion: 'Connects carbonate protonation to the dissolution quotient and additional dissolution.',
            acceptableEvidence: 'Hydronium consumes dissolved carbonate species, lowering Qsp below Ksp and causing more solid to dissolve; Ksp itself is unchanged at constant temperature.',
          },
        ],
      },
    ],
  },
  {
    id: 'acids-bases-strong-neutralization-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: excess strong acid after neutralization',
    summary: 'A three-point draft rubric for a net ionic reaction, limiting-reactant accounting, and final pH.',
    alignment: alignment(
      ['ph-poh-strong-acids-bases'],
      ['8.2.A'],
      ['5.F'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-acids-bases-short-frq-004',
    maxPoints: 3,
    parts: [
      {
        id: 'part-a',
        prompt: 'Write the net ionic neutralization reaction.',
        points: [
          {
            id: 'a-reaction',
            criterion: 'Writes a chemically and stoichiometrically correct net ionic reaction.',
            acceptableEvidence: 'H3O+ + OH- -> 2 H2O, or H+ + OH- -> H2O.',
          },
        ],
      },
      {
        id: 'part-b',
        prompt: 'Identify the limiting reactant and remaining excess amount.',
        points: [
          {
            id: 'b-mole-accounting',
            criterion: 'Correctly compares reacting moles and determines the excess strong-acid amount.',
            acceptableEvidence: 'Identifies OH- as limiting and obtains 0.000850 mol excess H+.',
          },
        ],
      },
      {
        id: 'part-c',
        prompt: 'Calculate final pH.',
        points: [
          {
            id: 'c-ph',
            criterion: 'Uses excess hydronium in the combined volume and converts the resulting concentration to pH.',
            acceptableEvidence: '[H3O+] = 0.000850 mol/0.0600 L = 0.0142 mol/L and pH = 1.85.',
          },
        ],
      },
    ],
  },
  {
    id: 'acids-bases-buffer-capacity-experiment-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: compare buffer capacity experimentally',
    summary: 'A four-point draft rubric for initial buffer pH, controlled procedure design, capacity reasoning, and post-addition pH.',
    alignment: alignment(
      ['buffer-capacity'],
      ['8.10.A'],
      ['5.F', '6.G'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-acids-bases-short-frq-005',
    maxPoints: 4,
    parts: [
      {
        id: 'part-a',
        prompt: 'Compare initial pH values.',
        points: [
          {
            id: 'a-initial-ph',
            criterion: 'Connects the equal conjugate-pair ratios to equal initial pH.',
            acceptableEvidence: 'Both have pH = 4.74 because pH = pKa + log(1).',
          },
        ],
      },
      {
        id: 'part-b',
        prompt: 'Describe a controlled capacity comparison.',
        points: [
          {
            id: 'b-procedure',
            criterion: 'Uses equal buffer volumes and identical strong-acid additions while measuring pH change under controlled conditions.',
            acceptableEvidence: 'Adds equal measured increments from the same strong-acid solution to equal buffer volumes at the same temperature and compares ΔpH for equal added moles.',
          },
        ],
      },
      {
        id: 'part-c',
        prompt: 'Predict and justify the relative pH change.',
        points: [
          {
            id: 'c-capacity',
            criterion: 'Predicts the more concentrated buffer changes less and justifies with reacting amounts.',
            acceptableEvidence: 'Buffer B changes less because its 0.0500 mol of each component makes 0.00200 mol H+ a smaller fractional change than in buffer A.',
          },
        ],
      },
      {
        id: 'part-d',
        prompt: 'Calculate both post-addition pH values.',
        points: [
          {
            id: 'd-post-addition-ph',
            criterion: 'Updates both conjugate-pair amounts and correctly calculates both pH values.',
            acceptableEvidence: 'For A, pH = 4.74 + log(0.00800/0.0120) = 4.56; for B, pH = 4.74 + log(0.0480/0.0520) = 4.71.',
          },
        ],
      },
    ],
  },
  {
    id: 'acids-bases-weak-base-equilibrium-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: weak-base equilibrium',
    summary: 'A four-point draft rubric for base ionization, exact equilibrium composition, pH, and percent protonation.',
    alignment: alignment(
      ['weak-acid-base-equilibria'],
      ['8.3.A'],
      ['5.C', '5.F'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-acids-bases-short-frq-006',
    maxPoints: 4,
    parts: [
      {
        id: 'part-a',
        prompt: 'Write the base-ionization reaction.',
        points: [
          {
            id: 'a-reaction',
            criterion: 'Writes the chemically and stoichiometrically correct weak-base reaction with water.',
            acceptableEvidence: 'B + H2O <=> BH+ + OH-.',
          },
        ],
      },
      {
        id: 'part-b',
        prompt: 'Calculate equilibrium hydroxide concentration.',
        points: [
          {
            id: 'b-equilibrium',
            criterion: 'Uses the exact equilibrium base concentration and obtains the physical quadratic root.',
            acceptableEvidence: 'Solves 4.0 × 10^-6 = x^2/(0.200 - x) to obtain [OH-] = 8.92 × 10^-4 mol/L.',
          },
        ],
      },
      {
        id: 'part-c',
        prompt: 'Calculate pH.',
        points: [
          {
            id: 'c-ph',
            criterion: 'Converts equilibrium hydroxide concentration to pOH and then pH.',
            acceptableEvidence: 'pOH = 3.05 and pH = 10.95.',
          },
        ],
      },
      {
        id: 'part-d',
        prompt: 'Calculate percent protonation.',
        points: [
          {
            id: 'd-percent',
            criterion: 'Compares equilibrium conjugate-acid concentration with initial base concentration.',
            acceptableEvidence: '(8.92 × 10^-4/0.200)(100%) = 0.446%.',
          },
        ],
      },
    ],
  },
  {
    id: 'acids-bases-oxoacid-structure-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: oxoacid structure and strength',
    summary: 'A three-point draft rubric for ranking a comparable oxoacid series and its conjugate bases.',
    alignment: alignment(
      ['molecular-structure-acids-bases'],
      ['8.6.A'],
      ['6.C'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-acids-bases-short-frq-007',
    maxPoints: 3,
    parts: [
      {
        id: 'part-a',
        prompt: 'Rank acid strength.',
        points: [
          {
            id: 'a-acid-order',
            criterion: 'Ranks the related oxoacids from weakest to strongest.',
            acceptableEvidence: 'HXO < HXO2 < HXO3.',
          },
        ],
      },
      {
        id: 'part-b',
        prompt: 'Justify with conjugate-base stabilization.',
        points: [
          {
            id: 'b-structure',
            criterion: 'Connects additional oxygen atoms to electron withdrawal and greater stabilization of negative charge.',
            acceptableEvidence: 'Uses inductive withdrawal and applicable charge delocalization to explain why proton loss becomes more favorable.',
          },
        ],
      },
      {
        id: 'part-c',
        prompt: 'Rank conjugate-base strength.',
        points: [
          {
            id: 'c-base-order',
            criterion: 'Reverses the acid-strength order for the conjugate bases.',
            acceptableEvidence: 'XO- > XO2- > XO3-.',
          },
        ],
      },
    ],
  },
  {
    id: 'acids-bases-titration-data-short-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: infer acid properties from titration data',
    summary: 'A five-point draft rubric for analyte concentration, half-equivalence Ka, equivalence hydrolysis, and indicator selection.',
    alignment: alignment(
      ['acid-base-titrations'],
      ['8.5.A'],
      ['5.D', '5.F', '6.G'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-acids-bases-short-frq-008',
    maxPoints: 5,
    parts: [
      {
        id: 'part-a',
        prompt: 'Calculate initial acid molarity.',
        points: [
          {
            id: 'a-concentration',
            criterion: 'Uses equivalence stoichiometry to determine initial acid moles and concentration.',
            acceptableEvidence: 'Calculates 0.001860 mol HZ and [HZ]initial = 0.09300 mol/L.',
          },
        ],
      },
      {
        id: 'part-b',
        prompt: 'Determine Ka.',
        points: [
          {
            id: 'b-ka',
            criterion: 'Recognizes half-equivalence and converts the measured pH to Ka.',
            acceptableEvidence: 'pKa = 4.35 and Ka = 10^-4.35 = 4.47 × 10^-5.',
          },
        ],
      },
      {
        id: 'part-c',
        prompt: 'Calculate equivalence-point pH.',
        points: [
          {
            id: 'c-hydrolysis-setup',
            criterion: 'Determines the conjugate-base concentration and Kb at equivalence.',
            acceptableEvidence: '[Z-] = 0.04819 mol/L and Kb = 2.24 × 10^-10.',
          },
          {
            id: 'c-ph',
            criterion: 'Solves the conjugate-base hydrolysis and reports equivalence pH.',
            acceptableEvidence: '[OH-] = 3.28 × 10^-6 mol/L and pH = 8.52.',
          },
        ],
      },
      {
        id: 'part-d',
        prompt: 'Select an indicator.',
        points: [
          {
            id: 'd-indicator',
            criterion: 'Selects the transition range that contains the calculated equivalence pH.',
            acceptableEvidence: 'Selects indicator Q because pH 8.52 lies within 7.6-9.2.',
          },
        ],
      },
    ],
  },
  {
    id: 'acids-bases-titration-long-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: weak-acid titration across multiple regions',
    summary: 'A seven-point draft rubric for initial weak-acid equilibrium, titration stoichiometry, half-equivalence, equivalence hydrolysis, and indicator selection.',
    alignment: alignment(
      ['weak-acid-base-equilibria', 'acid-base-titrations', 'ph-pka'],
      ['8.3.A', '8.5.A', '8.7.A'],
      ['5.C', '5.D', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-acids-bases-long-frq-001',
    maxPoints: 7,
    parts: [
      {
        id: 'part-a',
        prompt: 'Calculate the initial pH and verify the weak-acid approximation.',
        points: [
          {
            id: 'a-equilibrium',
            criterion: 'Uses a valid weak-acid equilibrium relationship to determine hydronium concentration.',
            acceptableEvidence: 'Solves Ka = x^2/(0.120 - x), or a justified approximation, to obtain [H3O+] about 1.72 × 10^-3 mol/L.',
          },
          {
            id: 'a-ph-check',
            criterion: 'Reports the initial pH and quantitatively checks the approximation.',
            acceptableEvidence: 'Reports pH about 2.76 and percent ionization about 1.43%, supporting the small-x approximation.',
          },
        ],
      },
      {
        id: 'part-b',
        prompt: 'Calculate the NaOH volume required for equivalence.',
        points: [
          {
            id: 'b-equivalence-volume',
            criterion: 'Uses 1:1 neutralization stoichiometry and titrant molarity.',
            acceptableEvidence: 'Calculates 0.00300 mol HY and 0.0300 L, or 30.0 mL, of 0.100 M NaOH.',
          },
        ],
      },
      {
        id: 'part-c',
        prompt: 'Calculate the pH at half-equivalence.',
        points: [
          {
            id: 'c-half-equivalence',
            criterion: 'Connects equal conjugate-pair amounts with pH equal to pKa.',
            acceptableEvidence: 'At 15.0 mL, pH = pKa = -log(2.5 × 10^-5) = 4.60.',
          },
        ],
      },
      {
        id: 'part-d',
        prompt: 'Calculate the pH at equivalence.',
        points: [
          {
            id: 'd-hydrolysis-setup',
            criterion: 'Models conjugate-base hydrolysis using the correct concentration and Kb.',
            acceptableEvidence: 'Uses [Y-] = 0.00300 mol/0.0550 L = 0.0545 mol/L and Kb = Kw/Ka = 4.0 × 10^-10.',
          },
          {
            id: 'd-equivalence-ph',
            criterion: 'Calculates the hydroxide concentration and equivalence-point pH.',
            acceptableEvidence: 'Obtains [OH-] about 4.67 × 10^-6 mol/L and pH about 8.67.',
          },
        ],
      },
      {
        id: 'part-e',
        prompt: 'Choose an appropriate indicator and justify the choice.',
        points: [
          {
            id: 'e-indicator',
            criterion: 'Selects the indicator whose transition range contains the basic equivalence region.',
            acceptableEvidence: 'Selects indicator N, with range 8.0–9.6, because it includes the calculated equivalence pH of about 8.67.',
          },
        ],
      },
    ],
  },
  {
    id: 'acids-bases-buffer-design-long-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: buffer response, capacity, and design',
    summary: 'A seven-point draft rubric for buffer pH, reaction-first additions, dilution effects, and target-composition design.',
    alignment: alignment(
      ['buffer-capacity'],
      ['8.10.A'],
      ['5.F', '6.D', '6.G'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-acids-bases-long-frq-002',
    maxPoints: 7,
    parts: [
      {
        id: 'part-a',
        prompt: 'Calculate initial buffer pH.',
        points: [
          {
            id: 'a-initial-ph',
            criterion: 'Uses the initial conjugate-pair ratio and acid pKa.',
            acceptableEvidence: 'pKa = 4.2007 and pH = 4.2007 + log(0.0200/0.0400) = 3.90.',
          },
        ],
      },
      {
        id: 'part-b',
        prompt: 'Calculate pH after adding HCl.',
        points: [
          {
            id: 'b-stoichiometry',
            criterion: 'Correctly updates both buffer-component amounts after strong-acid reaction.',
            acceptableEvidence: 'Obtains 0.0150 mol A- and 0.0450 mol HA.',
          },
          {
            id: 'b-ph',
            criterion: 'Uses the post-reaction ratio to calculate pH.',
            acceptableEvidence: 'pH = 4.2007 + log(0.0150/0.0450) = 3.72.',
          },
        ],
      },
      {
        id: 'part-c',
        prompt: 'Analyze the separate NaOH addition.',
        points: [
          {
            id: 'c-composition',
            criterion: 'Correctly updates the conjugate-pair amounts and identifies that both remain.',
            acceptableEvidence: 'Obtains 0.0200 mol HA and 0.0400 mol A- and states that the mixture remains a buffer.',
          },
          {
            id: 'c-ph',
            criterion: 'Calculates pH from the post-reaction ratio.',
            acceptableEvidence: 'pH = 4.2007 + log(0.0400/0.0200) = 4.50.',
          },
        ],
      },
      {
        id: 'part-d',
        prompt: 'Predict dilution effects.',
        points: [
          {
            id: 'd-dilution',
            criterion: 'Distinguishes the nearly unchanged ratio-controlled pH from reduced amount-dependent capacity.',
            acceptableEvidence: 'Predicts approximately unchanged pH but lower capacity because a fixed addition consumes a larger fraction of the diluted components.',
          },
        ],
      },
      {
        id: 'part-e',
        prompt: 'Design a target-pH buffer composition.',
        points: [
          {
            id: 'e-design',
            criterion: 'Solves the target ratio together with the fixed total moles.',
            acceptableEvidence: 'Uses n(A-)/n(HA) = 1.99 to obtain about 0.0201 mol HA and 0.0399 mol A-.',
          },
        ],
      },
    ],
  },
  {
    id: 'acids-bases-unknown-acid-investigation-long-frq-rubric',
    kind: 'rubric',
    schemaVersion: 1,
    title: 'Draft rubric: unknown weak-acid investigation',
    summary: 'An eight-point draft rubric connecting particle-level ionization, measured Ka, titration regions, hydrolysis, and indicator selection.',
    alignment: alignment(
      ['acid-base-titrations'],
      ['8.5.A'],
      ['2.D', '5.C', '5.D', '5.F', '6.D'],
    ),
    review: draftReview,
    provenance: originalProvenance,
    questionId: 'ap-chem-acids-bases-long-frq-003',
    maxPoints: 8,
    parts: [
      {
        id: 'part-a',
        prompt: 'Explain the equal-concentration pH difference.',
        points: [
          {
            id: 'a-particles',
            criterion: 'Distinguishes essentially complete HU ionization from partial HV ionization at the particle level.',
            acceptableEvidence: 'Explains that HU produces approximately 0.100 M hydronium while most HV remains unionized at equilibrium.',
          },
        ],
      },
      {
        id: 'part-b',
        prompt: 'Calculate Ka for HV.',
        points: [
          {
            id: 'b-hydronium',
            criterion: 'Correctly converts the measured pH to equilibrium hydronium concentration.',
            acceptableEvidence: '[H3O+] = 10^-2.87 = 1.35 × 10^-3 mol/L.',
          },
          {
            id: 'b-ka',
            criterion: 'Uses the reduced equilibrium acid concentration in the Ka expression.',
            acceptableEvidence: 'Ka = (1.35 × 10^-3)^2/(0.100 - 0.00135) = 1.84 × 10^-5.',
          },
        ],
      },
      {
        id: 'part-c',
        prompt: 'Calculate equivalence volume.',
        points: [
          {
            id: 'c-volume',
            criterion: 'Uses 1:1 neutralization stoichiometry and titrant molarity.',
            acceptableEvidence: 'Calculates 0.002500 mol HV and 20.00 mL of 0.1250 M NaOH.',
          },
        ],
      },
      {
        id: 'part-d',
        prompt: 'Calculate half-equivalence pH.',
        points: [
          {
            id: 'd-half-equivalence',
            criterion: 'Uses equal weak-acid and conjugate-base amounts at half-equivalence.',
            acceptableEvidence: 'pH = pKa = 4.73.',
          },
        ],
      },
      {
        id: 'part-e',
        prompt: 'Calculate equivalence-point pH.',
        points: [
          {
            id: 'e-hydrolysis-setup',
            criterion: 'Determines the conjugate-base concentration and Kb.',
            acceptableEvidence: '[V-] = 0.05556 mol/L and Kb = 5.42 × 10^-10.',
          },
          {
            id: 'e-ph',
            criterion: 'Solves conjugate-base hydrolysis and reports pH.',
            acceptableEvidence: '[OH-] = 5.49 × 10^-6 mol/L and pH = 8.74.',
          },
        ],
      },
      {
        id: 'part-f',
        prompt: 'Select an indicator.',
        points: [
          {
            id: 'f-indicator',
            criterion: 'Selects the range containing the calculated equivalence pH.',
            acceptableEvidence: 'Selects indicator S because 8.74 lies within its 8.0-9.5 transition range.',
          },
        ],
      },
    ],
  },
]

export const apChemistryAcidsBasesResources = Object.freeze(assertValidEditorialCatalog(resources))
