import { apChemistryEquilibriumQuestions } from '../questions/catalog/apChemistryEquilibriumQuestions.js'
import { apChemistryAcidsBasesQuestions } from '../questions/catalog/apChemistryAcidsBasesQuestions.js'
import { apChemistryPropertiesMixturesQuestions } from '../questions/catalog/apChemistryPropertiesMixturesQuestions.js'
import { apChemistryChemicalReactionsQuestions } from '../questions/catalog/apChemistryChemicalReactionsQuestions.js'
import { apChemistryKineticsQuestions } from '../questions/catalog/apChemistryKineticsQuestions.js'
import { apChemistryThermochemistryQuestions } from '../questions/catalog/apChemistryThermochemistryQuestions.js'
import { apChemistryThermodynamicsElectrochemistryQuestions } from '../questions/catalog/apChemistryThermodynamicsElectrochemistryQuestions.js'
import { apChemistryAtomicStructurePropertiesQuestions } from '../questions/catalog/apChemistryAtomicStructurePropertiesQuestions.js'
import { apChemistryCompoundStructurePropertiesQuestions } from '../questions/catalog/apChemistryCompoundStructurePropertiesQuestions.js'
import { apChemistryAcidsBasesResources } from './apChemistryAcidsBasesResources.js'
import { apChemistryEquilibriumResources } from './apChemistryEquilibriumResources.js'
import { apChemistryPropertiesMixturesResources } from './apChemistryPropertiesMixturesResources.js'
import { apChemistryChemicalReactionsResources } from './apChemistryChemicalReactionsResources.js'
import { apChemistryKineticsResources } from './apChemistryKineticsResources.js'
import { apChemistryThermochemistryResources } from './apChemistryThermochemistryResources.js'
import { apChemistryThermodynamicsElectrochemistryResources } from './apChemistryThermodynamicsElectrochemistryResources.js'
import { apChemistryAtomicStructurePropertiesResources } from './apChemistryAtomicStructurePropertiesResources.js'
import { apChemistryCompoundStructurePropertiesResources } from './apChemistryCompoundStructurePropertiesResources.js'

const LEVELS = Object.freeze(['beginning', 'developing', 'strong'])
const equilibriumQuestionsById = new Map(apChemistryEquilibriumQuestions.map((question) => [question.id, question]))
const equilibriumRubricsById = new Map(apChemistryEquilibriumResources.filter((resource) => resource.kind === 'rubric').map((rubric) => [rubric.id, rubric]))
const acidsBasesQuestionsById = new Map(apChemistryAcidsBasesQuestions.map((question) => [question.id, question]))
const acidsBasesRubricsById = new Map(apChemistryAcidsBasesResources.filter((resource) => resource.kind === 'rubric').map((rubric) => [rubric.id, rubric]))
const propertiesMixturesQuestionsById = new Map(apChemistryPropertiesMixturesQuestions.map((question) => [question.id, question]))
const propertiesMixturesRubricsById = new Map(apChemistryPropertiesMixturesResources.filter((resource) => resource.kind === 'rubric').map((rubric) => [rubric.id, rubric]))
const chemicalReactionsQuestionsById = new Map(apChemistryChemicalReactionsQuestions.map((question) => [question.id, question]))
const chemicalReactionsRubricsById = new Map(apChemistryChemicalReactionsResources.filter((resource) => resource.kind === 'rubric').map((rubric) => [rubric.id, rubric]))
const kineticsQuestionsById = new Map(apChemistryKineticsQuestions.map((question) => [question.id, question]))
const kineticsRubricsById = new Map(apChemistryKineticsResources.filter((resource) => resource.kind === 'rubric').map((rubric) => [rubric.id, rubric]))
const thermochemistryQuestionsById = new Map(apChemistryThermochemistryQuestions.map((question) => [question.id, question]))
const thermochemistryRubricsById = new Map(apChemistryThermochemistryResources.filter((resource) => resource.kind === 'rubric').map((rubric) => [rubric.id, rubric]))
const thermodynamicsElectrochemistryQuestionsById = new Map(apChemistryThermodynamicsElectrochemistryQuestions.map((question) => [question.id, question]))
const thermodynamicsElectrochemistryRubricsById = new Map(apChemistryThermodynamicsElectrochemistryResources.filter((resource) => resource.kind === 'rubric').map((rubric) => [rubric.id, rubric]))
const atomicStructurePropertiesQuestionsById = new Map(apChemistryAtomicStructurePropertiesQuestions.map((question) => [question.id, question]))
const atomicStructurePropertiesRubricsById = new Map(apChemistryAtomicStructurePropertiesResources.filter((resource) => resource.kind === 'rubric').map((rubric) => [rubric.id, rubric]))
const compoundStructurePropertiesQuestionsById = new Map(apChemistryCompoundStructurePropertiesQuestions.map((question) => [question.id, question]))
const compoundStructurePropertiesRubricsById = new Map(apChemistryCompoundStructurePropertiesResources.filter((resource) => resource.kind === 'rubric').map((rubric) => [rubric.id, rubric]))

function text(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function rubricPointIds(rubric) {
  return rubric.parts.flatMap((part) => part.points.map((point) => point.id))
}

function exemplar(questionId, developing, beginning) {
  return createExemplar(equilibriumQuestionsById, equilibriumRubricsById, questionId, developing, beginning, '2026-07-20')
}

function acidsBasesExemplar(questionId, developing, beginning) {
  return createExemplar(acidsBasesQuestionsById, acidsBasesRubricsById, questionId, developing, beginning, '2026-07-24')
}

function propertiesMixturesExemplar(questionId, developing, beginning) {
  return createExemplar(propertiesMixturesQuestionsById, propertiesMixturesRubricsById, questionId, developing, beginning, '2026-07-24')
}

function chemicalReactionsExemplar(questionId, developing, beginning) {
  return createExemplar(chemicalReactionsQuestionsById, chemicalReactionsRubricsById, questionId, developing, beginning, '2026-07-24')
}

function kineticsExemplar(questionId, developing, beginning) {
  return createExemplar(kineticsQuestionsById, kineticsRubricsById, questionId, developing, beginning, '2026-07-24')
}

function thermochemistryExemplar(questionId, developing, beginning) {
  return createExemplar(thermochemistryQuestionsById, thermochemistryRubricsById, questionId, developing, beginning, '2026-07-24')
}

function thermodynamicsElectrochemistryExemplar(questionId, developing, beginning) {
  return createExemplar(thermodynamicsElectrochemistryQuestionsById, thermodynamicsElectrochemistryRubricsById, questionId, developing, beginning, '2026-07-24')
}

function atomicStructurePropertiesExemplar(questionId, developing, beginning) {
  return createExemplar(atomicStructurePropertiesQuestionsById, atomicStructurePropertiesRubricsById, questionId, developing, beginning, '2026-07-24')
}

function compoundStructurePropertiesExemplar(questionId, developing, beginning) {
  return createExemplar(compoundStructurePropertiesQuestionsById, compoundStructurePropertiesRubricsById, questionId, developing, beginning, '2026-07-24')
}

function createExemplar(questionMap, rubricMap, questionId, developing, beginning, updatedAt) {
  const question = questionMap.get(questionId)
  const rubric = rubricMap.get(question?.rubricId)
  return {
    id: `${questionId}-exemplars`,
    questionId,
    title: `Three-level response exemplars for ${questionId}`,
    alignment: {
      subjectId: question.taxonomy.subjectId,
      domainId: question.taxonomy.domainId,
      skillIds: [question.taxonomy.skillId],
      sciencePracticeIds: [...question.taxonomy.sciencePracticeIds],
    },
    review: {
      status: 'draft',
      authoredBy: 'codex-ai-assisted-draft',
      updatedAt,
      revision: 1,
      reviewers: [],
    },
    responses: [
      {
        level: 'beginning',
        response: beginning.response,
        earnedPointIds: beginning.earnedPointIds,
        feedback: beginning.feedback,
      },
      {
        level: 'developing',
        response: developing.response,
        earnedPointIds: developing.earnedPointIds,
        feedback: developing.feedback,
      },
      {
        level: 'strong',
        response: question.answer.modelAnswer,
        earnedPointIds: rubricPointIds(rubric),
        feedback: 'This sample addresses every draft rubric criterion with explicit chemistry reasoning, calculations, and units where applicable. It remains an unreviewed teaching example, not an official scored response.',
      },
    ],
  }
}

const records = [
  exemplar('ap-chem-equilibrium-short-frq-001', {
    response: 'The mixture shifts toward products because adding A makes the product-to-reactant ratio smaller than the equilibrium value. I get Qc = 0.40.',
    earnedPointIds: ['b-direction'],
    feedback: 'The direction is correct, but the quotient arithmetic must use all three concentrations and the justification must compare the calculated value explicitly with Kc.',
  }, {
    response: 'Adding a reactant always increases Kc, so the system shifts right.',
    earnedPointIds: [],
    feedback: 'At fixed temperature, Kc is unchanged. Recalculate Qc immediately after the addition and compare it with Kc.',
  }),
  exemplar('ap-chem-equilibrium-short-frq-002', {
    response: 'Because two Z- ions form, the molar solubility is 2.40 x 10^-3 mol/L. Ksp is [M2+][Z-]^2, but I would use the measured Z- concentration as both ion concentrations.',
    earnedPointIds: ['a-solubility', 'b-expression'],
    feedback: 'The stoichiometry and expression are right. Use [M2+] = s and [Z-] = 2s for the numerical value, then trace evaporation through the concentration product.',
  }, {
    response: 'The molar solubility is 4.80 x 10^-3 mol/L and Ksp is the same number. Evaporation does not matter.',
    earnedPointIds: [],
    feedback: 'Molar solubility is not generally equal to an ion concentration or to Ksp. Start from the balanced dissolution stoichiometry.',
  }),
  exemplar('ap-chem-equilibrium-short-frq-003', {
    response: 'Let x of D react, so [D] is 0.800 - x and [E] is x. A catalyst does not change the final concentrations because it speeds both directions.',
    earnedPointIds: ['a-setup', 'c-catalyst'],
    feedback: 'The setup and catalyst reasoning are sound. Solve the equation for x and use that value to calculate percent conversion.',
  }, {
    response: 'At equilibrium D and E must each be 0.400 M. The catalyst makes more E.',
    earnedPointIds: [],
    feedback: 'Equilibrium does not require equal concentrations, and a catalyst does not change equilibrium composition. Substitute an ICE relationship into Kc.',
  }),
  exemplar('ap-chem-equilibrium-short-frq-004', {
    response: 'At 40 s the rates are equal, so the concentrations stay constant after that time. The concentrations are equal to each other.',
    earnedPointIds: ['b-equal-rates', 'c-bulk-constant'],
    feedback: 'Equal rates and constant concentrations are correct. Remove the unsupported claim that concentrations are equal and describe continuing molecular events.',
  }, {
    response: 'The net rate is 0.080 mol L^-1 s^-1. At 40 s both reactions stop.',
    earnedPointIds: [],
    feedback: 'Net rate is the difference, not the sum. At equilibrium both directions continue at equal nonzero rates.',
  }),
  exemplar('ap-chem-equilibrium-short-frq-005', {
    response: 'Kc = [L]^2/[L2]. Since Kc is small, there is more L2 than L at equilibrium. That also means the forward reaction is slow.',
    earnedPointIds: ['a-expression', 'b-composition'],
    feedback: 'The expression and composition interpretation are useful. Complete the calculation and separate equilibrium composition from kinetic speed.',
  }, {
    response: 'Kc = [L]/[L2] = 0.25, so products predominate and the reaction is fast.',
    earnedPointIds: [],
    feedback: 'Use the coefficient of L as an exponent. Kc does not establish reaction speed.',
  }),
  exemplar('ap-chem-equilibrium-short-frq-006', {
    response: 'Reversing the equation takes the reciprocal, so the constant becomes 4.00. Adding X changes Qc but not Kc because temperature stays fixed.',
    earnedPointIds: ['b-reciprocal', 'c-fixed-temperature'],
    feedback: 'The reversal and fixed-temperature reasoning are correct. Account for doubling all coefficients by squaring the reversed constant.',
  }, {
    response: 'Double the original Kc to get 0.500. Adding X makes Kc larger.',
    earnedPointIds: [],
    feedback: 'Scaling coefficients changes K exponentially, not linearly, and concentration changes affect Q rather than K at fixed temperature.',
  }),
  exemplar('ap-chem-equilibrium-short-frq-007', {
    response: 'Snapshot 1 has 20 atoms and snapshot 2 also has 20 atoms. Since the last two pictures match, the reaction has stopped.',
    earnedPointIds: ['a-first-count', 'a-second-count'],
    feedback: 'Atom conservation is demonstrated. Next connect the changing monomer/dimer counts to net direction and require equal nonzero opposing rates for dynamic equilibrium.',
  }, {
    response: 'There are 17 particles in snapshot 1 and 14 in snapshot 2, so atoms were lost. Matching final pictures prove equilibrium.',
    earnedPointIds: [],
    feedback: 'Count atoms inside each A2 particle rather than counting drawn objects. Repeated composition alone does not directly show molecular rates.',
  }),
  exemplar('ap-chem-equilibrium-short-frq-008', {
    response: 'In pure water, s is 5.00 x 10^-5 mol/L. The common ion lowers solubility because X- is already present, so less P+ is required to reach Ksp.',
    earnedPointIds: ['a-solubility', 'c-explanation'],
    feedback: 'The pure-water value and qualitative explanation are correct. Set up x(0.0200 + x), calculate x, and quantify the approximation check.',
  }, {
    response: 'Ksp is the molar solubility in both solutions, so s = 2.50 x 10^-9 mol/L.',
    earnedPointIds: [],
    feedback: 'Ksp is an ion-activity product, not generally molar solubility. Write each equilibrium ion concentration in terms of s or x.',
  }),
  exemplar('ap-chem-equilibrium-long-frq-001', {
    response: 'The equilibrium concentrations are 0.30 M R2, 0.30 M S2, and 0.40 M RS, so Kc = 1.78. I would measure the colored product with a balance. Compression shifts toward products.',
    earnedPointIds: ['a-ice-setup', 'a-values', 'b-k-value'],
    feedback: 'The ICE work and Kc are correct. Choose a selective quantitative concentration method, evaluate the equal gas-coefficient totals, and describe equal-rate particle behavior.',
  }, {
    response: 'All equilibrium concentrations are 0.20 M. Kc is 1. A smaller vessel always shifts right.',
    earnedPointIds: [],
    feedback: 'Apply the 1:1:2 stoichiometric changes to the initial values. A volume effect depends on gaseous coefficients rather than a universal direction.',
  }),
  exemplar('ap-chem-equilibrium-long-frq-002', {
    response: 'Ksp = [Y+][F-]. In pure water Ksp = s squared, so s = 2.53 x 10^-4 mol/L. The common ion should make less dissolve, but I used the same s for the NaF solution.',
    earnedPointIds: ['a-expression', 'b-setup', 'b-value'],
    feedback: 'The expression and pure-water calculation are complete. Include the 0.0100 M common-ion term, verify the approximation, and dilute both mixed solutions before the precipitation test.',
  }, {
    response: 'Ksp includes the solid concentration. Adding NaF changes Ksp, and equal volumes do not change ion concentrations.',
    earnedPointIds: [],
    feedback: 'Omit the pure solid, keep Ksp fixed at the stated temperature, and account for dilution when equal volumes are mixed.',
  }),
  exemplar('ap-chem-equilibrium-long-frq-003', {
    response: 'J decreases twice as much as K increases. Kc = [K]/[J]^2 = 1.25. Compression doubles both concentrations, so the equilibrium constant doubles.',
    earnedPointIds: ['a-stoichiometry', 'b-expression', 'b-value'],
    feedback: 'The stoichiometry, expression, and initial constant are correct. Transform K for the new equation, calculate the post-compression Q, and keep K fixed for a constant-temperature compression.',
  }, {
    response: 'J and K change by the same amount, Kc = [J]^2/[K], and reversing the equation doubles Kc.',
    earnedPointIds: [],
    feedback: 'Use the 2:1 coefficients for concentration changes, write products over reactants, and apply reciprocal/power rules to transformed equations.',
  }),
]

const acidsBasesRecords = [
  acidsBasesExemplar('ap-chem-acids-bases-short-frq-001', {
    response: 'Hydroxide reacts one-to-one with HX, so 0.00500 mol OH- consumes 0.00500 mol HX and produces 0.00500 mol X-. The remaining amounts are 0.0250 mol HX and 0.0250 mol X-.',
    earnedPointIds: ['b-stoichiometry'],
    feedback: 'The mole accounting is correct. Add the net ionic reaction and use the equal post-reaction buffer amounts to calculate the pH.',
  }, {
    response: 'The added hydroxide makes the solution basic, so the pH must be greater than 7.',
    earnedPointIds: [],
    feedback: 'Treat the strong hydroxide as a stoichiometric reactant first. It consumes weak acid and changes the conjugate-pair ratio rather than automatically leaving excess hydroxide.',
  }),
  acidsBasesExemplar('ap-chem-acids-bases-short-frq-002', {
    response: '[H3O+] = 10^-2.72 = 1.91 × 10^-3 M. For HQ, Ka = x^2/(0.150 - x), so Ka is about 2.45 × 10^-5.',
    earnedPointIds: ['a-hydronium', 'b-ka'],
    feedback: 'The hydronium concentration and Ka calculation are complete. Calculate percent ionization and distinguish the effects of dilution on pH, percent ionization, and Ka.',
  }, {
    response: 'The hydronium concentration is 2.72 M because the pH is 2.72.',
    earnedPointIds: [],
    feedback: 'pH is logarithmic. Convert with [H3O+] = 10^(-pH) before constructing the weak-acid equilibrium expression.',
  }),
  acidsBasesExemplar('ap-chem-acids-bases-short-frq-003', {
    response: 'Ksp = [M2+][CO3^2-]. Acid lowers the carbonate concentration, so more of the solid can dissolve.',
    earnedPointIds: ['a-expression', 'c-acid-effect'],
    feedback: 'The equilibrium expression and qualitative acid effect are sound. Use the 1:1 dissolution stoichiometry to calculate the pure-water molar solubility.',
  }, {
    response: 'Adding acid increases Ksp, which causes the solid to dissolve.',
    earnedPointIds: [],
    feedback: 'At constant temperature Ksp does not change. Explain how protonation lowers free carbonate, changes Qsp, and shifts the dissolution equilibrium.',
  }),
  acidsBasesExemplar('ap-chem-acids-bases-short-frq-004', {
    response: 'H3O+ + OH- -> 2 H2O. There are 0.00210 mol acid and 0.00125 mol base, so hydroxide is limiting and 0.000850 mol H+ remains.',
    earnedPointIds: ['a-reaction', 'b-mole-accounting'],
    feedback: 'The reaction and limiting-reagent accounting are correct. Divide the excess hydronium amount by the combined volume before taking the negative logarithm.',
  }, {
    response: 'The acid and base neutralize completely, so the final pH is 7.',
    earnedPointIds: [],
    feedback: 'Neutralization reaches pH 7 only for stoichiometrically equivalent strong acid and strong base amounts. Compare moles before calculating the remaining concentration.',
  }),
  acidsBasesExemplar('ap-chem-acids-bases-short-frq-005', {
    response: 'Both buffers start at pH 4.74 because each has equal amounts of HA and A-. I would add equal increments of the same HCl solution to equal buffer volumes and record each pH.',
    earnedPointIds: ['a-initial-ph', 'b-procedure'],
    feedback: 'The starting pH and controlled comparison are correct. Explain capacity using component amounts and calculate both post-addition pH values.',
  }, {
    response: 'Buffer B has the higher starting pH because its concentrations are larger.',
    earnedPointIds: [],
    feedback: 'For this conjugate pair, initial pH depends on the base-to-acid ratio, which is one in both samples. Concentration affects capacity even when the starting pH matches.',
  }),
  acidsBasesExemplar('ap-chem-acids-bases-short-frq-006', {
    response: 'B + H2O <=> BH+ + OH-. If x is [OH-], then Kb = x^2/(0.200 - x).',
    earnedPointIds: ['a-reaction', 'b-equilibrium'],
    feedback: 'The reaction and equilibrium setup are correct. Solve for x, convert pOH to pH, and use x relative to the initial base concentration for percent protonation.',
  }, {
    response: 'Because the solution is 0.200 M base, [OH-] is 0.200 M.',
    earnedPointIds: [],
    feedback: 'A weak base ionizes only partially. Use an equilibrium variable and Kb instead of treating the analytical concentration as the hydroxide concentration.',
  }),
  acidsBasesExemplar('ap-chem-acids-bases-short-frq-007', {
    response: 'The acid-strength order is HXO < HXO2 < HXO3. More oxygen atoms withdraw electron density and stabilize the conjugate base.',
    earnedPointIds: ['a-acid-order', 'b-structure'],
    feedback: 'The acid order and structural reasoning are correct. Complete the response by reversing the order for conjugate-base strength.',
  }, {
    response: 'HXO is strongest because it has the fewest oxygen atoms holding onto the proton.',
    earnedPointIds: [],
    feedback: 'Compare stabilization of the conjugate bases. Additional electronegative oxygen atoms increase induction and can distribute negative charge more effectively.',
  }),
  acidsBasesExemplar('ap-chem-acids-bases-short-frq-008', {
    response: 'At equivalence, the original acid concentration is (0.01860 L)(0.1000 M)/(0.02000 L) = 0.09300 M. At 9.30 mL the titration is at half-equivalence, so pKa = 4.35 and Ka = 4.47 × 10^-5.',
    earnedPointIds: ['a-concentration', 'b-ka'],
    feedback: 'The original concentration and Ka are correct. Use conjugate-base hydrolysis at equivalence, then select the indicator whose transition range contains that calculated basic pH.',
  }, {
    response: 'The acid concentration is 0.1000 M because the acid and base react one-to-one.',
    earnedPointIds: [],
    feedback: 'The titrant concentration is not automatically the analyte concentration. Use the measured equivalence volume to find initial acid moles, then divide by the acid sample volume.',
  }),
  acidsBasesExemplar('ap-chem-acids-bases-long-frq-001', {
    response: 'For HY, Ka = x^2/(0.120 - x), which gives [H3O+] about 1.72 × 10^-3 M and pH 2.76. The acid sample contains 0.00300 mol, so it needs 30.0 mL of 0.100 M NaOH at equivalence. At half-equivalence, pH = pKa = 4.60.',
    earnedPointIds: ['a-equilibrium', 'a-ph-check', 'b-equivalence-volume', 'c-half-equivalence'],
    feedback: 'The initial equilibrium, equivalence volume, and half-equivalence reasoning are complete. Finish with conjugate-base hydrolysis at equivalence and justify the indicator from that pH.',
  }, {
    response: 'The equivalence volume is 30.0 mL because the reaction is one-to-one.',
    earnedPointIds: ['b-equivalence-volume'],
    feedback: 'The equivalence volume is correct, but show the mole calculation. Then treat the initial weak acid, half-equivalence buffer, and equivalence-point conjugate base as three different chemical regimes.',
  }),
  acidsBasesExemplar('ap-chem-acids-bases-long-frq-002', {
    response: 'The initial pH is 3.90 from pH = pKa + log(0.0200/0.0400). Added H+ consumes A-, leaving 0.0150 mol A- and 0.0450 mol HA, so the new pH is 3.72. Added OH- instead leaves both buffer components and gives pH 4.50.',
    earnedPointIds: ['a-initial-ph', 'b-stoichiometry', 'b-ph', 'c-composition', 'c-ph'],
    feedback: 'The initial and post-reaction calculations are correct. Add the distinction between dilution effects on pH and capacity, then solve the fixed-total target-ratio design.',
  }, {
    response: 'The initial pH is 3.90 because there is twice as much acid as base.',
    earnedPointIds: ['a-initial-ph'],
    feedback: 'The initial value is correct, but explicitly use pKa and the conjugate-base-to-acid ratio. Perform stoichiometry before every later Henderson–Hasselbalch calculation.',
  }),
  acidsBasesExemplar('ap-chem-acids-bases-long-frq-003', {
    response: 'HU is strong because its pH 1.00 corresponds to 0.100 M H3O+, while HV is mostly unionized. For HV, x = 10^-2.87 = 1.35 × 10^-3 M and Ka = x^2/(0.100 - x) = 1.84 × 10^-5. The 0.02500 L sample contains 0.002500 mol, so equivalence occurs at 20.00 mL NaOH. At half-equivalence, pH = pKa = 4.73.',
    earnedPointIds: ['a-particles', 'b-hydronium', 'b-ka', 'c-volume', 'd-half-equivalence'],
    feedback: 'The particle interpretation, Ka, equivalence volume, and half-equivalence pH are correct. Complete the conjugate-base hydrolysis calculation and use its equivalence pH to select the indicator.',
  }, {
    response: 'HV is weaker because its pH is higher even though both solutions have the same concentration.',
    earnedPointIds: ['a-particles'],
    feedback: 'The comparison is directionally correct. Connect pH to the fraction ionized, calculate Ka, and analyze the stoichiometric and equilibrium regions of the titration separately.',
  }),
]

const propertiesMixturesRecords = [
  propertiesMixturesExemplar('ap-chem-properties-mixtures-short-frq-001', {
    response: 'The dry gas pressure is 1.200 - 0.105 = 1.095 atm. Using that pressure, n = PV/RT = (1.095)(0.250)/[(0.08206)(320)] = 0.0104 mol.',
    earnedPointIds: ['a-pressure', 'b-moles'],
    feedback: 'The mixture pressure and ideal-gas amount are correct. Use the sample mass to determine molar mass, then separate the equal-temperature kinetic-energy comparison from the mass-dependent speed comparison.',
  }, {
    response: 'The gas pressure is 1.095 atm because the water pressure must be subtracted from the total.',
    earnedPointIds: ['a-pressure'],
    feedback: 'The partial-pressure step is correct. Continue with the dry-gas pressure in PV = nRT rather than using the total collected pressure.',
  }),
  propertiesMixturesExemplar('ap-chem-properties-mixtures-short-frq-002', {
    response: 'Q has more surface contact than compact P, so its dispersion attractions are stronger. R can hydrogen bond because it has an O-H group, which explains its still higher boiling point.',
    earnedPointIds: ['a-shape-dispersion', 'b-hydrogen-bonding'],
    feedback: 'The boiling-point explanations are correct. Use those attraction strengths to rank vapor pressures, then compare solute-water interactions to predict aqueous solubility.',
  }, {
    response: 'Q has the higher boiling point because its extended shape gives neighboring molecules more contact and stronger dispersion forces.',
    earnedPointIds: ['a-shape-dispersion'],
    feedback: 'The P-Q comparison is sound. Extend the same interaction model to R, vapor pressure, and mixing with water.',
  }),
  propertiesMixturesExemplar('ap-chem-properties-mixtures-short-frq-003', {
    response: 'W is metallic and conducts through mobile delocalized electrons. X is ionic: its ions are fixed in the solid but can move after melting.',
    earnedPointIds: ['a-metallic', 'b-ionic-mobility'],
    feedback: 'The conductivity evidence correctly classifies W and X. Next distinguish molecular Y from network-covalent Z and explain ionic brittleness through lattice displacement.',
  }, {
    response: 'W is metallic, and its mobile electrons carry charge through the solid.',
    earnedPointIds: ['a-metallic'],
    feedback: 'The classification and carrier are correct. Apply the same evidence-based approach to each remaining solid.',
  }),
  propertiesMixturesExemplar('ap-chem-properties-mixtures-short-frq-004', {
    response: 'There are 0.500 mol total, so P = nRT/V = 1.23 atm. The Ne mole fraction is 0.200/0.500 = 0.400, giving PNe = 0.492 atm.',
    earnedPointIds: ['a-total-pressure', 'b-neon-partial'],
    feedback: 'The initial total and partial pressures are correct. Update total amount after adding He, then separate equal-temperature kinetic energy from mass-dependent speed.',
  }, {
    response: 'Using the total 0.500 mol in PV = nRT gives a total pressure of about 1.23 atm.',
    earnedPointIds: ['a-total-pressure'],
    feedback: 'The total pressure is correct. Use mixture composition for partial pressure and recalculate after the amount changes.',
  }),
  propertiesMixturesExemplar('ap-chem-properties-mixtures-short-frq-005', {
    response: 'Attractions reduce momentum transfer to the wall, so the measured pressure is below ideal. At 250 K the particles have less kinetic energy, so attractions cause a larger relative effect; the deficits are 18% and 5%.',
    earnedPointIds: ['a-attractions', 'b-temperature-effect'],
    feedback: 'The attraction and temperature reasoning are complete. Add the opposing excluded-volume effect and calculate the square-root speed ratio.',
  }, {
    response: 'Attractive forces pull gas particles away from the wall and reduce collision momentum, making measured pressure lower than ideal.',
    earnedPointIds: ['a-attractions'],
    feedback: 'The sign of the attraction effect is correct. Quantify how temperature changes its importance and contrast it with finite particle volume.',
  }),
  propertiesMixturesExemplar('ap-chem-properties-mixtures-short-frq-006', {
    response: 'The amount needed is (0.200 M)(0.2500 L) = 0.0500 mol. The mass is (0.0500 mol)(110.98 g/mol) = 5.55 g.',
    earnedPointIds: ['a-solute-moles', 'b-solute-mass'],
    feedback: 'The preparation amount and mass are correct. Apply CaCl2 stoichiometry to the ion representation and conserve transferred solute during dilution.',
  }, {
    response: 'n = MV = (0.200 mol/L)(0.2500 L) = 0.0500 mol CaCl2.',
    earnedPointIds: ['a-solute-moles'],
    feedback: 'The amount is correct. Convert it to mass, then distinguish formal solute concentration from individual ion concentrations.',
  }),
  propertiesMixturesExemplar('ap-chem-properties-mixtures-short-frq-007', {
    response: 'Rf,A = 6.4/8.0 = 0.80. B has the strongest stationary-phase attraction because it travels least and has Rf = 2.0/8.0 = 0.25.',
    earnedPointIds: ['a-retention-factor', 'b-stationary-affinity'],
    feedback: 'The numerical comparison and affinity conclusion are correct. Explain the two-phase mechanism and propagate the shared solvent-front error.',
  }, {
    response: 'Pigment A has Rf = 6.4 cm/8.0 cm = 0.80.',
    earnedPointIds: ['a-retention-factor'],
    feedback: 'The retention factor is correct. Now interpret migration as evidence about relative phase affinities.',
  }),
  propertiesMixturesExemplar('ap-chem-properties-mixtures-short-frq-008', {
    response: 'For the diluted unknown, c = (0.380 - 0.020)/(6.00 x 10^3) = 6.00 x 10^-5 M. Undoing the 5.00-to-20.00 mL dilution gives 2.40 x 10^-4 M in the original.',
    earnedPointIds: ['b-diluted-concentration', 'c-original-concentration'],
    feedback: 'Both concentration calculations correctly use the intercept and dilution factor. Add the wavelength-sensitivity justification and calculate photon energy.',
  }, {
    response: 'Subtracting the intercept first gives c = 0.360/(6.00 x 10^3) = 6.00 x 10^-5 M for the diluted sample.',
    earnedPointIds: ['b-diluted-concentration'],
    feedback: 'The calibration calculation is correct. Reverse the dilution and connect the selected wavelength to both signal sensitivity and photon energy.',
  }),
  propertiesMixturesExemplar('ap-chem-properties-mixtures-long-frq-001', {
    response: 'The 6.00 mL standard has concentration (1.00 x 10^-3)(6.00/50.00) = 1.20 x 10^-4 M. The slope is 0.540/(1.20 x 10^-4) = 4.50 x 10^3 L/mol, so epsilon is 4.50 x 10^3 L mol^-1 cm^-1. The diluted unknown is 0.450/(4.50 x 10^3) = 1.00 x 10^-4 M, and undoing the fivefold dilution gives 5.00 x 10^-4 M.',
    earnedPointIds: ['a-standard', 'b-slope', 'c-diluted', 'd-original'],
    feedback: 'The quantitative calibration and both dilution steps are complete. Add the direction of the residual-water error, explain wavelength control through epsilon, and calculate the 525 nm photon energy.',
  }, {
    response: 'The 6.00 mL standard is 1.20 x 10^-4 M because the stock is diluted to 50.00 mL.',
    earnedPointIds: ['a-standard'],
    feedback: 'The standard preparation is correct. Use multiple standards to establish the calibration slope before finding either unknown concentration.',
  }),
  propertiesMixturesExemplar('ap-chem-properties-mixtures-long-frq-002', {
    response: 'Using PV = nRT gives n = (0.158)(0.250)/[(0.08206)(375)] = 1.28 x 10^-3 mol, so the molar mass is 0.125/(1.28 x 10^-3) = 97.4 g/mol. If some liquid condenses, the pressure and calculated moles are too low, so the calculated molar mass is too high. At the same temperature V and a lighter gas have equal average kinetic energy, but the lighter gas moves faster.',
    earnedPointIds: ['a-vapor-moles', 'b-molar-mass', 'c-condensation-error', 'd-energy-speed'],
    feedback: 'The quantitative result, error direction, and kinetic comparison are correct. Complete the response with attraction-driven pressure deviation, a conserved particle model, and a controlled physical-property comparison.',
  }, {
    response: 'n = PV/RT = 1.28 x 10^-3 mol, so the vaporized amount is about 0.00128 mol.',
    earnedPointIds: ['a-vapor-moles'],
    feedback: 'The vapor amount is correct. Use the fixed sample mass for molar mass, then connect the measurement to phase, motion, attractions, and experimental error.',
  }),
  propertiesMixturesExemplar('ap-chem-properties-mixtures-long-frq-003', {
    response: 'The dye mass is 1.500 - 0.540 = 0.960 g, or 64.0% of the sample. Filtration retains insoluble W while dissolved D passes with water. The final dilution has c = 0.480/40.0 = 0.0120 M, so the original filtrate is five times as concentrated, 0.0600 M. The 100.0 mL filtrate contains 0.00600 mol, giving 0.960/0.00600 = 160 g/mol.',
    earnedPointIds: ['a-mass-composition', 'b-filtration', 'c-final-concentration', 'd-filtrate-concentration', 'e-dye-molar-mass'],
    feedback: 'The separation and full quantitative chain are correct. Add the residual-water error propagation and calculate the energy of a 600 nm photon.',
  }, {
    response: 'The dye mass is 1.500 g - 0.540 g = 0.960 g, so the mixture is 64.0% dye by mass.',
    earnedPointIds: ['a-mass-composition'],
    feedback: 'The composition is correct. Continue by explaining the separation and tracing the calibration and dilution data to amount and molar mass.',
  }),
]

const chemicalReactionsRecords = [
  chemicalReactionsExemplar('ap-chem-chemical-reactions-short-frq-001', {
    response: 'Ag+(aq) + Cl-(aq) -> AgCl(s). Chloride is limiting because 0.0150 mol is less than 0.0200 mol, so 0.0150 mol AgCl forms and its mass is (0.0150)(143.32) = 2.15 g.',
    earnedPointIds: ['a-net-ionic', 'b-limiting', 'c-mass'],
    feedback: 'The reacting equation, limiting-ion decision, and mass are correct. Complete the particle inventory by identifying the excess Ag+ amount and both spectator ions.',
  }, {
    response: 'The precipitate is AgCl, and 0.0150 mol forms because chloride runs out first.',
    earnedPointIds: ['b-limiting'],
    feedback: 'The limiting-ion conclusion is correct. Add the balanced net ionic equation, convert precipitate amount to mass, and account for every principal particle after reaction.',
  }),
  chemicalReactionsExemplar('ap-chem-chemical-reactions-long-frq-001', {
    response: 'The copper amount is 0.762/63.55 = 0.01199 mol. The equation gives 0.007994 mol M, so its molar mass is 0.540/0.007994 = 67.6 g/mol. Initially there are 0.01500 mol Cu2+, leaving 0.003009 mol or 0.0602 M. The M3+ concentration is 0.007994/0.05000 = 0.160 M.',
    earnedPointIds: ['a-copper-amount', 'b-metal-amount', 'c-molar-mass', 'd-copper-concentration', 'd-metal-concentration'],
    feedback: 'The complete quantitative chain is correct. Add balanced oxidation and reduction half-reactions and propagate the wet-copper error through the inferred amount to molar mass.',
  }, {
    response: 'The deposited copper amount is 0.762 g divided by 63.55 g/mol, or about 0.0120 mol.',
    earnedPointIds: ['a-copper-amount'],
    feedback: 'The first conversion is correct. Use the two-to-three coefficient ratio for M, then continue to molar mass, solution composition, electron transfer, and error direction.',
  }),
]

const kineticsRecords = [
  kineticsExemplar('ap-chem-kinetics-short-frq-001', {
    response: 'The concentration halves from 0.800 M to 0.400 M in 200 s and again to 0.200 M in another 200 s, so it is first order. The half-life is 200 s and k = 0.693/200 = 3.47 x 10^-3 s^-1.',
    earnedPointIds: ['a-order', 'b-rate-constant', 'c-half-life'],
    feedback: 'The order evidence, rate constant, and half-life are correct. Finish by using rate = k[A] at the specified 200-second concentration.',
  }, {
    response: 'The half-life is 200 s because the concentration reaches 0.400 M then.',
    earnedPointIds: ['c-half-life'],
    feedback: 'The half-life is identified correctly. Use repeated halving to justify first-order behavior, calculate k, and find the rate magnitude at 200 s.',
  }),
  kineticsExemplar('ap-chem-kinetics-long-frq-001', {
    response: 'The overall reaction is 2 X + Y -> Z + W, and I is the intermediate. The slow step gives rate = k2[I][X]. From the fast equilibrium, [I] = K1[X][Y], so rate = kobs[X]^2[Y]. Doubling X therefore makes the rate four times larger.',
    earnedPointIds: ['a-overall', 'b-intermediate', 'c-slow-law', 'c-substitution', 'd-rate-factor'],
    feedback: 'The mechanism and derived rate law are complete. Add the two forward activation barriers and explain what a catalyst changes without changing endpoints or equilibrium composition.',
  }, {
    response: 'I is an intermediate because it is made in the first step and used in the second step.',
    earnedPointIds: ['b-intermediate'],
    feedback: 'The intermediate identification is correct. Sum the steps, derive a reactant-only rate law, apply its concentration powers, and interpret the energy profile and catalyst.',
  }),
]

const thermochemistryRecords = [
  thermochemistryExemplar('ap-chem-thermochemistry-short-frq-001', {
    response: 'The calibration gives Ccal = 2.40 kJ/4.0 K = 0.600 kJ/K. During reaction qcal = (0.600)(5.0) = +3.00 kJ, so the reaction releases -3.00 kJ.',
    earnedPointIds: ['a-capacity', 'b-calorimeter-heat', 'd-sign'],
    feedback: 'The calibration, calorimeter heat, and reaction sign are correct. Divide the reaction heat by 0.0200 mol to report the molar enthalpy.',
  }, {
    response: 'The calorimeter heat capacity is 0.600 kJ/K.',
    earnedPointIds: ['a-capacity'],
    feedback: 'The calibration is correct. Continue with the reaction temperature change, opposite heat sign, molar conversion, and sign explanation.',
  }),
  thermochemistryExemplar('ap-chem-thermochemistry-long-frq-001', {
    response: 'Formation values give Delta H = -66 - (0 + 0) = -66 kJ. Reversing the third supplied equation and adding all three cancels XO2, YO, and O2; the enthalpy is -100 - 120 + 154 = -66 kJ. For 0.250 mol, q = -16.5 kJ.',
    earnedPointIds: ['a-setup', 'a-result', 'b-operations', 'b-result', 'd-scale'],
    feedback: 'Both exact routes and the scale calculation are correct. Add why average bond values can differ and why enthalpy is path independent.',
  }, {
    response: 'The formation enthalpy is -66 kJ because the elements have zero formation enthalpy.',
    earnedPointIds: ['a-result'],
    feedback: 'The result is correct. Show the full products-minus-reactants setup, perform the Hess algebra, compare the bond estimate, scale the amount, and explain state-function behavior.',
  }),
]

const thermodynamicsElectrochemistryRecords = [
  thermodynamicsElectrochemistryExemplar('ap-chem-thermodynamics-electrochemistry-short-frq-001', {
    response: 'Q+ is reduced at the cathode and M is oxidized at the anode, so electrons flow from M to Q. The net reaction is M + 2 Q+ -> M2+ + 2 Q. E degree cell = 0.55 - (-0.25) = 0.80 V.',
    earnedPointIds: ['a-electrodes', 'b-reaction', 'c-potential'],
    feedback: 'The cell assignments, balanced reaction, and potential are correct. Complete the solution by using n = 2 in Delta G degree = -nFE degree.',
  }, {
    response: 'Q is the cathode because it has the more positive reduction potential.',
    earnedPointIds: ['a-electrodes'],
    feedback: 'The cathode is correct. Also identify the anode and electron flow, balance the net reaction, and calculate potential and free energy.',
  }),
  thermodynamicsElectrochemistryExemplar('ap-chem-thermodynamics-electrochemistry-long-frq-001', {
    response: 'Delta S degree = 260 - (190 + 210) = -140 J mol^-1 K^-1. Using -0.140 kJ mol^-1 K^-1, Delta G degree at 298 K is -50.0 - 298(-0.140) = -8.28 kJ/mol. Setting Delta G degree to zero gives T = 357 K. Since Delta G degree is negative at 298 K, K is greater than one.',
    earnedPointIds: ['a-entropy', 'b-unit-conversion', 'b-free-energy', 'c-temperature', 'e-equilibrium'],
    feedback: 'The entropy, free energy, threshold, and equilibrium direction are correct. Add the kinetic distinction and the one-to-one coupled free-energy result.',
  }, {
    response: 'The entropy change is -140 J mol^-1 K^-1 because products minus reactants is 260 - 400.',
    earnedPointIds: ['a-entropy'],
    feedback: 'The entropy calculation is correct. Continue with unit conversion, free energy, threshold temperature, kinetic interpretation, equilibrium, and coupling.',
  }),
]

const atomicStructurePropertiesRecords = [
  atomicStructurePropertiesExemplar('ap-chem-atomic-structure-properties-short-frq-001', {
    response: 'The oxygen mass is 7.20 - 2.40 = 4.80 g. The amounts are 2.40/40.0 = 0.0600 mol X and 4.80/16.0 = 0.300 mol O, so the ratio is 1:5 and the formula is XO5.',
    earnedPointIds: ['a-oxygen-mass', 'b-moles', 'c-formula'],
    feedback: 'The mass, mole conversion, and empirical formula are correct. Complete the independent oxygen mass-percent check.',
  }, {
    response: 'The oxygen mass is 4.80 g.',
    earnedPointIds: ['a-oxygen-mass'],
    feedback: 'The mass difference is correct. Convert both element masses to moles, reduce the ratio, and check the formula by mass percent.',
  }),
  atomicStructurePropertiesExemplar('ap-chem-atomic-structure-properties-long-frq-001', {
    response: 'The average mass is 62(0.600) + 64(0.300) + 66(0.100) = 63.0 u. The spectrum has peaks at 62, 64, and 66 with intensities 60:30:10. Y has seven valence electrons and forms Y-.',
    earnedPointIds: ['a-setup', 'a-result', 'b-spectrum', 'c-configuration'],
    feedback: 'The isotope evidence and common ion are correct. Add PES interpretation, the effective-nuclear-charge trend, and the neutral formula with X2+.',
  }, {
    response: 'The average mass is 63.0 u.',
    earnedPointIds: ['a-result'],
    feedback: 'The result is correct. Show the weighted setup and complete the spectrum, electron configuration, PES, periodic trend, and ionic formula reasoning.',
  }),
]

const compoundStructurePropertiesRecords = [
  compoundStructurePropertiesExemplar('ap-chem-compound-structure-properties-short-frq-001', {
    response: 'Curve A has the shorter equilibrium distance, 110 pm versus 145 pm. Its well is also deeper, so A requires 320 kJ/mol to break while B requires 180 kJ/mol.',
    earnedPointIds: ['a-distance', 'b-energy'],
    feedback: 'The distance and dissociation-energy comparisons are correct. Add the balanced-force interpretation at the minimum and short-range repulsion explanation.',
  }, {
    response: 'Curve A has a shorter bond because its minimum is at 110 pm.',
    earnedPointIds: ['a-distance'],
    feedback: 'The equilibrium-distance comparison is correct. Continue with well depth, net force, and the compressed-region energy increase.',
  }),
  compoundStructurePropertiesExemplar('ap-chem-compound-structure-properties-long-frq-001', {
    response: 'CO3^2- has 4 + 3(6) + 2 = 24 valence electrons. One contributor contains one C=O and two C-O single bonds. Carbon and the double-bonded oxygen have formal charge zero, and each single-bonded oxygen has -1.',
    earnedPointIds: ['a-electrons', 'b-lewis', 'c-carbon-double-oxygen', 'c-single-oxygen'],
    feedback: 'The electron count, contributor, and formal charges are correct. Add the resonance-hybrid explanation, average bond order, and geometry.',
  }, {
    response: 'The ion has 24 valence electrons.',
    earnedPointIds: ['a-electrons'],
    feedback: 'The electron count is correct. Complete a Lewis contributor, formal charges, resonance evidence, bond order, and VSEPR geometry.',
  }),
]

export function validateFrqExemplarCatalog(exemplars, { questions = apChemistryEquilibriumQuestions, resources = apChemistryEquilibriumResources, requireComplete = true } = {}) {
  const errors = []
  const questionMap = new Map(questions.map((question) => [question.id, question]))
  const rubricMap = new Map(resources.filter((resource) => resource.kind === 'rubric').map((rubric) => [rubric.id, rubric]))
  const seen = new Set()
  exemplars.forEach((record) => {
    const question = questionMap.get(record?.questionId)
    const rubric = rubricMap.get(question?.rubricId)
    if (!question || question.renderer !== 'free-response' || !rubric) errors.push(`${record?.questionId || '(missing)'}: exemplar must reference a free-response question and rubric`)
    if (seen.has(record?.questionId)) errors.push(`${record.questionId}: duplicate exemplar record`)
    seen.add(record?.questionId)
    if (record?.review?.status !== 'draft' || !text(record?.review?.authoredBy)
      || !/^\d{4}-\d{2}-\d{2}$/.test(record?.review?.updatedAt || '')
      || record?.review?.revision !== 1 || record?.review?.reviewers?.length !== 0) {
      errors.push(`${record?.questionId || '(missing)'}: draft review metadata is required`)
    }
    if (record?.id !== `${record?.questionId}-exemplars` || !text(record?.title)
      || record?.alignment?.subjectId !== question?.taxonomy?.subjectId
      || record?.alignment?.domainId !== question?.taxonomy?.domainId
      || record?.alignment?.skillIds?.length !== 1
      || record?.alignment?.skillIds?.[0] !== question?.taxonomy?.skillId
      || record?.alignment?.sciencePracticeIds?.join('|') !== (question?.taxonomy?.sciencePracticeIds || []).join('|')) {
      errors.push(`${record?.questionId || '(missing)'}: stable id and canonical question alignment are required`)
    }
    const responses = record?.responses || []
    if (responses.length !== LEVELS.length || responses.map(({ level }) => level).join('|') !== LEVELS.join('|')) {
      errors.push(`${record?.questionId || '(missing)'}: responses must be ordered beginning, developing, strong`)
    }
    const knownPoints = new Set(rubric ? rubricPointIds(rubric) : [])
    responses.forEach((response) => {
      if (!text(response?.response) || !text(response?.feedback)) errors.push(`${record?.questionId || '(missing)'}: every exemplar needs response and feedback text`)
      if (!Array.isArray(response?.earnedPointIds) || new Set(response.earnedPointIds).size !== response.earnedPointIds.length
        || response.earnedPointIds.some((id) => !knownPoints.has(id))) errors.push(`${record?.questionId || '(missing)'}: exemplar has unknown or duplicate earned point ids`)
    })
    const counts = responses.map((response) => response.earnedPointIds?.length || 0)
    if (counts.length === 3 && !(counts[0] < counts[1] && counts[1] < counts[2] && counts[2] === knownPoints.size)) {
      errors.push(`${record?.questionId || '(missing)'}: exemplar levels must show strictly increasing rubric evidence and a complete strong response`)
    }
  })
  if (requireComplete) {
    questions.filter((question) => question.renderer === 'free-response').forEach((question) => {
      if (!seen.has(question.id)) errors.push(`${question.id}: missing exemplar record`)
    })
  }
  return { valid: errors.length === 0, errors }
}

const validation = validateFrqExemplarCatalog(records)
if (!validation.valid) throw new Error(`FRQ exemplar validation failed:\n- ${validation.errors.join('\n- ')}`)
const acidsBasesValidation = validateFrqExemplarCatalog(acidsBasesRecords, {
  questions: apChemistryAcidsBasesQuestions,
  resources: apChemistryAcidsBasesResources,
})
if (!acidsBasesValidation.valid) throw new Error(`Unit 8 FRQ exemplar validation failed:\n- ${acidsBasesValidation.errors.join('\n- ')}`)
const propertiesMixturesValidation = validateFrqExemplarCatalog(propertiesMixturesRecords, {
  questions: apChemistryPropertiesMixturesQuestions,
  resources: apChemistryPropertiesMixturesResources,
})
if (!propertiesMixturesValidation.valid) throw new Error(`Unit 3 FRQ exemplar validation failed:\n- ${propertiesMixturesValidation.errors.join('\n- ')}`)
const chemicalReactionsValidation = validateFrqExemplarCatalog(chemicalReactionsRecords, {
  questions: apChemistryChemicalReactionsQuestions,
  resources: apChemistryChemicalReactionsResources,
})
if (!chemicalReactionsValidation.valid) throw new Error(`Unit 4 FRQ exemplar validation failed:\n- ${chemicalReactionsValidation.errors.join('\n- ')}`)
const kineticsValidation = validateFrqExemplarCatalog(kineticsRecords, {
  questions: apChemistryKineticsQuestions,
  resources: apChemistryKineticsResources,
})
if (!kineticsValidation.valid) throw new Error(`Unit 5 FRQ exemplar validation failed:\n- ${kineticsValidation.errors.join('\n- ')}`)
const thermochemistryValidation = validateFrqExemplarCatalog(thermochemistryRecords, {
  questions: apChemistryThermochemistryQuestions,
  resources: apChemistryThermochemistryResources,
})
if (!thermochemistryValidation.valid) throw new Error(`Unit 6 FRQ exemplar validation failed:\n- ${thermochemistryValidation.errors.join('\n- ')}`)
const thermodynamicsElectrochemistryValidation = validateFrqExemplarCatalog(thermodynamicsElectrochemistryRecords, {
  questions: apChemistryThermodynamicsElectrochemistryQuestions,
  resources: apChemistryThermodynamicsElectrochemistryResources,
})
if (!thermodynamicsElectrochemistryValidation.valid) throw new Error(`Unit 9 FRQ exemplar validation failed:\n- ${thermodynamicsElectrochemistryValidation.errors.join('\n- ')}`)
const atomicStructurePropertiesValidation = validateFrqExemplarCatalog(atomicStructurePropertiesRecords, {
  questions: apChemistryAtomicStructurePropertiesQuestions,
  resources: apChemistryAtomicStructurePropertiesResources,
})
if (!atomicStructurePropertiesValidation.valid) throw new Error(`Unit 1 FRQ exemplar validation failed:\n- ${atomicStructurePropertiesValidation.errors.join('\n- ')}`)
const compoundStructurePropertiesValidation = validateFrqExemplarCatalog(compoundStructurePropertiesRecords, {
  questions: apChemistryCompoundStructurePropertiesQuestions,
  resources: apChemistryCompoundStructurePropertiesResources,
})
if (!compoundStructurePropertiesValidation.valid) throw new Error(`Unit 2 FRQ exemplar validation failed:\n- ${compoundStructurePropertiesValidation.errors.join('\n- ')}`)

function freezeRecords(items) {
  return Object.freeze(items.map((record) => Object.freeze({
    ...record,
    alignment: Object.freeze({
      ...record.alignment,
      skillIds: Object.freeze([...record.alignment.skillIds]),
      sciencePracticeIds: Object.freeze([...record.alignment.sciencePracticeIds]),
    }),
    review: Object.freeze({
      ...record.review,
      reviewers: Object.freeze([...record.review.reviewers]),
    }),
    responses: Object.freeze(record.responses.map((response) => Object.freeze({
      ...response,
      earnedPointIds: Object.freeze([...response.earnedPointIds]),
    }))),
  })))
}

export const apChemistryEquilibriumFrqExemplars = freezeRecords(records)
export const apChemistryAcidsBasesFrqExemplars = freezeRecords(acidsBasesRecords)
export const apChemistryPropertiesMixturesFrqExemplars = freezeRecords(propertiesMixturesRecords)
export const apChemistryChemicalReactionsFrqExemplars = freezeRecords(chemicalReactionsRecords)
export const apChemistryKineticsFrqExemplars = freezeRecords(kineticsRecords)
export const apChemistryThermochemistryFrqExemplars = freezeRecords(thermochemistryRecords)
export const apChemistryThermodynamicsElectrochemistryFrqExemplars = freezeRecords(thermodynamicsElectrochemistryRecords)
export const apChemistryAtomicStructurePropertiesFrqExemplars = freezeRecords(atomicStructurePropertiesRecords)
export const apChemistryCompoundStructurePropertiesFrqExemplars = freezeRecords(compoundStructurePropertiesRecords)
export const apChemistryFrqExemplars = Object.freeze([
  ...apChemistryEquilibriumFrqExemplars,
  ...apChemistryAcidsBasesFrqExemplars,
  ...apChemistryPropertiesMixturesFrqExemplars,
  ...apChemistryChemicalReactionsFrqExemplars,
  ...apChemistryKineticsFrqExemplars,
  ...apChemistryThermochemistryFrqExemplars,
  ...apChemistryThermodynamicsElectrochemistryFrqExemplars,
  ...apChemistryAtomicStructurePropertiesFrqExemplars,
  ...apChemistryCompoundStructurePropertiesFrqExemplars,
])

const exemplarByQuestionId = new Map(apChemistryFrqExemplars.map((record) => [record.questionId, record]))

export function getFrqExemplars(questionId, { editorialPreview = false } = {}) {
  const record = exemplarByQuestionId.get(questionId)
  if (!record || (!editorialPreview && !['approved', 'published'].includes(record.review.status))) return Object.freeze([])
  return record.responses
}
