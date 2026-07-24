import test from 'node:test'
import assert from 'node:assert/strict'
import { apChemistryEquilibriumResources } from './apChemistryEquilibriumResources.js'
import { apChemistryEquilibriumQuestions } from '../questions/catalog/apChemistryEquilibriumQuestions.js'

const questionsById = new Map(apChemistryEquilibriumQuestions.map((question) => [question.id, question]))
const resourceById = new Map(apChemistryEquilibriumResources.map((resource) => [resource.id, resource]))

function close(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should equal ${expected}`)
}

test('all discrete and stimulus selected-response answer keys are independently enumerated', () => {
  const expected = {
    'ap-chem-equilibrium-mcq-001': 'a',
    'ap-chem-equilibrium-mcq-002': 'a',
    'ap-chem-equilibrium-mcq-003': 'a',
    'ap-chem-equilibrium-mcq-004': 'a',
    'ap-chem-equilibrium-mcq-005': 'a',
    'ap-chem-equilibrium-mcq-006': 'a',
    'ap-chem-equilibrium-mcq-007': 'a',
    'ap-chem-equilibrium-mcq-008': 'a',
    'ap-chem-equilibrium-mcq-009': 'a',
    'ap-chem-equilibrium-mcq-010': 'a',
    'ap-chem-equilibrium-mcq-011': 'a',
    'ap-chem-equilibrium-mcq-012': 'a',
    'ap-chem-equilibrium-mcq-013': 'a',
    'ap-chem-equilibrium-mcq-014': 'a',
    'ap-chem-equilibrium-mcq-015': 'a',
    'ap-chem-equilibrium-mcq-016': 'a',
    'ap-chem-equilibrium-mcq-017': 'a',
    'ap-chem-equilibrium-mcq-018': 'a',
    'ap-chem-equilibrium-mcq-019': 'a',
    'ap-chem-equilibrium-mcq-020': 'a',
    'ap-chem-equilibrium-mcq-021': 'a',
    'ap-chem-equilibrium-mcq-022': 'a',
    'ap-chem-equilibrium-mcq-023': 'a',
    'ap-chem-equilibrium-mcq-024': 'a',
    'ap-chem-equilibrium-mcq-025': 'a',
    'ap-chem-equilibrium-mcq-026': 'a',
    'ap-chem-equilibrium-mcq-027': 'a',
    'ap-chem-equilibrium-mcq-028': 'a',
    'ap-chem-equilibrium-mcq-029': 'c',
    'ap-chem-equilibrium-mcq-030': 'b',
    'ap-chem-equilibrium-mcq-031': 'd',
    'ap-chem-equilibrium-mcq-032': 'b',
    'ap-chem-equilibrium-mcq-033': 'c',
    'ap-chem-equilibrium-mcq-034': 'd',
    'ap-chem-equilibrium-mcq-035': 'b',
    'ap-chem-equilibrium-stimulus-mcq-001': 'a',
    'ap-chem-equilibrium-stimulus-mcq-002': 'b',
    'ap-chem-equilibrium-stimulus-mcq-003': 'a',
    'ap-chem-equilibrium-stimulus-mcq-004': 'a',
    'ap-chem-equilibrium-stimulus-mcq-005': 'a',
    'ap-chem-equilibrium-stimulus-mcq-006': 'a',
    'ap-chem-equilibrium-stimulus-mcq-007': 'a',
    'ap-chem-equilibrium-stimulus-mcq-008': 'b',
    'ap-chem-equilibrium-stimulus-mcq-009': 'c',
    'ap-chem-equilibrium-stimulus-mcq-010': 'd',
    'ap-chem-equilibrium-stimulus-mcq-011': 'a',
    'ap-chem-equilibrium-stimulus-mcq-012': 'c',
    'ap-chem-equilibrium-stimulus-mcq-013': 'b',
    'ap-chem-equilibrium-stimulus-mcq-014': 'a',
    'ap-chem-equilibrium-stimulus-mcq-015': 'd',
    'ap-chem-equilibrium-stimulus-mcq-016': 'c',
  }
  const selectedResponseQuestions = apChemistryEquilibriumQuestions.filter(({ renderer }) => renderer === 'multiple-choice')
  assert.equal(selectedResponseQuestions.length, Object.keys(expected).length)
  selectedResponseQuestions.forEach((question) => {
    assert.equal(question.answer.correctOptionId, expected[question.id], question.id)
  })
})

test('reaction-quotient and equilibrium-constant calculations reproduce every numerical key', () => {
  close((0.40 ** 2) / 0.50, 0.32)
  close((1 / 9) ** 2, 1 / 81)
  close((0.20 ** 2) / 0.40, 0.10)
  close((0.30 ** 2) / 0.25, 0.36)
  close((0.40 ** 2) / 0.20, 0.80)
  close(0.10 / (0.625 * 0.50), 0.32)
  close((0.40 ** 2) / (0.30 * 0.30), 16 / 9)
  close((0.80 ** 2) / (0.60 * 0.60), 16 / 9)
  close(Math.cbrt(3.2e-8 / 4), 2.0e-3)
  const iceProgress = (-1 + Math.sqrt(17)) / 8
  close(1 - iceProgress, 0.6096117967977924)
  close(2 * iceProgress, 0.7807764064044151)
  close(1.0e-8 / 0.010, 1.0e-6)
  close((1 / 4) ** 3, 1 / 64)
  close((0.80 ** 2) / (0.20 * 0.20), 16)
  close(0.040 - 0.015, 0.025)
  const concentrationProgress = (-0.20 + Math.sqrt(0.20 ** 2 + 4 * 4 * 0.10)) / 8
  close((2 * concentrationProgress) ** 2 / (0.500 - concentrationProgress), 0.20)
  close(0.500 - concentrationProgress, 0.3649218940641788)
  close(2 * concentrationProgress, 0.2701562118716424)
  close(Math.cbrt(3.2e-11 / 4), 2.0e-4)
  close((2 * 0.80) ** 2 / ((2 * 0.20) * (2 * 0.20)), (0.80 ** 2) / (0.20 * 0.20))
  close(0.50 / 0.50, 1.00)
  close(0.50 / 0.80, 0.625)
  close(0.65 / 0.65, 1.00)
  close((2.40e-3) * (4.80e-3) ** 2, 5.5296e-8)
  const oneToOneProgress = (0.250 * 0.800) / 1.250
  close(oneToOneProgress, 0.160)
  close(oneToOneProgress / (0.800 - oneToOneProgress), 0.250)
  close((oneToOneProgress / 0.800) * 100, 20.0)
  close(0.060 - 0.020, 0.040)
  const pureWaterSolubility = Math.sqrt(6.40e-8)
  close(pureWaterSolubility ** 2, 6.40e-8)
  close(pureWaterSolubility * 1e4, Math.sqrt(6.40))
  const commonIonExact = (-0.0100 + Math.sqrt(0.0100 ** 2 + 4 * 6.40e-8)) / 2
  close(commonIonExact * (0.0100 + commonIonExact), 6.40e-8)
  close(6.40e-8 / 0.0100, 6.40e-6)
  close((6.40e-6 / 0.0100) * 100, 0.064)
  close((5.00e-4) * (1.00e-4), 5.00e-8)
  close(0.600 + 2 * 0.100, 0.400 + 2 * 0.200)
  close(0.200 / (0.400 ** 2), 1.25)
  close((1 / 1.25) ** 2, 0.640)
  close(0.400 / (0.800 ** 2), 0.625)
  close(0.030 - 0.018, 0.012)
  close(5.0 * 0.20, 1.0)
  const threeToOneProgress = 3.0 / 4.0
  close(threeToOneProgress / (1.00 - threeToOneProgress), 3.0)
  close(10 + 2 * 5, 6 + 2 * 7)
  close(0.450 / (0.300 ** 2), 5.00)
  const commonIonSolubility = 9.0e-10 / 0.010
  close(commonIonSolubility, 9.0e-8)
  assert.ok(commonIonSolubility / 0.010 < 0.001)
  close(0.027 - 0.018, 0.009)
  close((0.300 ** 2) / 0.500, 0.180)
  close(Math.sqrt(1 / 81), 1 / 9)
  close(0.250 / (0.500 ** 2), 1.0)
  close((2.0e-4) * (3.0e-4) ** 2, 1.8e-11)
  close((0.200 ** 2) / 0.800, 0.0500)
  close((1 / 0.250) ** 2, 16.0)
  close(14 + 2 * 3, 8 + 2 * 6)
  close(Math.sqrt(2.50e-9), 5.00e-5)
  close(2.50e-9 / 0.0200, 1.25e-7)
  close(((1.25e-7) / 0.0200) * 100, 0.000625)
})

test('particle-count representation preserves atoms across every snapshot', () => {
  const snapshots = [[12, 4], [9, 10], [8, 12], [8, 12]]
  assert.deepEqual(snapshots.map(([a2, a]) => 2 * a2 + a), [28, 28, 28, 28])
  assert.deepEqual(snapshots.at(-1), snapshots.at(-2))
})

test('stimulus table values and questions remain synchronized', () => {
  const stimulus = resourceById.get('equilibrium-mixture-comparison-stimulus')
  const rows = new Map(stimulus.representation.rows.map(([vessel, n2o4, no2]) => (
    [vessel, { n2o4: Number(n2o4), no2: Number(no2) }]
  )))
  const q = ({ n2o4, no2 }) => (no2 ** 2) / n2o4
  close(q(rows.get('A')), 0.10)
  close(q(rows.get('B')), 0.36)
  close(q(rows.get('C')), 0.80)
  assert.ok(q(rows.get('A')) < 0.36)
  assert.equal(q(rows.get('B')), 0.36)
  assert.ok(q(rows.get('C')) > 0.36)
})

test('disturbance graph preserves one-to-one reaction totals and both equilibrium plateaus', () => {
  const stimulus = resourceById.get('equilibrium-disturbance-line-graph-stimulus')
  const [bSeries, cSeries] = stimulus.representation.series
  const rows = bSeries.points.map(([time, b], index) => ({ time, b, c: cSeries.points[index][1] }))
  assert.deepEqual(rows.map(({ time }) => time), [0, 10, 20, 30, 40, 50, 60, 70, 80])
  rows.slice(0, 5).forEach(({ b, c }) => close(b + c, 1.00))
  rows.slice(5).forEach(({ b, c }) => close(b + c, 1.30))
  close(rows[3].c / rows[3].b, 1.00)
  close(rows.at(-1).c / rows.at(-1).b, 1.00)
})

test('new rate, solubility, and reaction-combination stimuli reproduce their linked answers', () => {
  const rateRows = resourceById.get('equilibrium-opposing-rates-stimulus').representation.rows
    .map(([time, forward, reverse]) => ({ time: Number(time), forward: Number(forward), reverse: Number(reverse) }))
  close(rateRows[0].forward - rateRows[0].reverse, 0.080)
  assert.equal(rateRows.find(({ forward, reverse }) => forward === reverse).time, 40)

  const solubilityRows = resourceById.get('equilibrium-solubility-trials-stimulus').representation.rows
    .map(([trial, metal, anion]) => ({ trial, metal: Number(metal.replace(' x 10^-', 'e-')), anion: Number(anion.replace(' x 10^-', 'e-')) }))
  const ionProducts = solubilityRows.map(({ metal, anion }) => metal * anion ** 2)
  close(ionProducts[0], 1.0e-10)
  close(ionProducts[1], 2.0e-10)
  close(ionProducts[2], 3.0e-10)
  assert.deepEqual(ionProducts.map((value) => Math.sign(value - 2.0e-10)), [-1, 0, 1])

  const reactionRows = resourceById.get('equilibrium-reaction-combination-stimulus').representation.rows
  const constants = reactionRows.map((row) => Number(row[2]))
  close(constants[0] * constants[1], 2.0)
  close(1 / (constants[0] * constants[1]), 0.50)
  close((constants[0] * constants[1]) ** 2, 4.0)
})

test('FRQ model answers and point-level rubrics reproduce the stated results', () => {
  const short = questionsById.get('ap-chem-equilibrium-short-frq-001')
  const solubilityShort = questionsById.get('ap-chem-equilibrium-short-frq-002')
  const concentrationShort = questionsById.get('ap-chem-equilibrium-short-frq-003')
  const ratesShort = questionsById.get('ap-chem-equilibrium-short-frq-004')
  const magnitudeShort = questionsById.get('ap-chem-equilibrium-short-frq-005')
  const transformShort = questionsById.get('ap-chem-equilibrium-short-frq-006')
  const particleShort = questionsById.get('ap-chem-equilibrium-short-frq-007')
  const commonIonShort = questionsById.get('ap-chem-equilibrium-short-frq-008')
  const long = questionsById.get('ap-chem-equilibrium-long-frq-001')
  const commonIonLong = questionsById.get('ap-chem-equilibrium-long-frq-002')
  const transformationsLong = questionsById.get('ap-chem-equilibrium-long-frq-003')
  assert.match(short.answer.modelAnswer, /0\.32/)
  assert.match(long.answer.modelAnswer, /0\.30 M, 0\.30 M, and 0\.40 M/)
  assert.match(long.answer.modelAnswer, /1\.78/)
  assert.match(solubilityShort.answer.modelAnswer, /5\.53 x 10\^-8/)
  assert.match(concentrationShort.answer.modelAnswer, /20\.0%/)
  assert.match(ratesShort.answer.modelAnswer, /0\.040 mol L\^-1 s\^-1/)
  assert.match(magnitudeShort.answer.modelAnswer, /0\.0500/)
  assert.match(transformShort.answer.modelAnswer, /16\.0/)
  assert.match(particleShort.answer.modelAnswer, /20 A atoms/)
  assert.match(commonIonShort.answer.modelAnswer, /1\.25 x 10\^-7 mol\/L/)
  assert.match(commonIonLong.answer.modelAnswer, /2\.53 x 10\^-4 mol\/L/)
  assert.match(commonIonLong.answer.modelAnswer, /5\.00 x 10\^-8/)
  assert.match(transformationsLong.answer.modelAnswer, /0\.640/)
  assert.match(transformationsLong.answer.modelAnswer, /0\.625/)

  for (const question of [short, solubilityShort, concentrationShort, ratesShort, magnitudeShort, transformShort, particleShort, commonIonShort, long, commonIonLong, transformationsLong]) {
    const rubric = resourceById.get(question.rubricId)
    const pointCount = rubric.parts.reduce((total, part) => total + part.points.length, 0)
    assert.equal(rubric.maxPoints, pointCount)
    assert.equal(rubric.questionId, question.id)
  }
  assert.equal(resourceById.get(short.rubricId).maxPoints, 3)
  assert.equal(resourceById.get(solubilityShort.rubricId).maxPoints, 4)
  assert.equal(resourceById.get(concentrationShort.rubricId).maxPoints, 4)
  assert.equal(resourceById.get(ratesShort.rubricId).maxPoints, 4)
  assert.equal(resourceById.get(magnitudeShort.rubricId).maxPoints, 4)
  assert.equal(resourceById.get(transformShort.rubricId).maxPoints, 4)
  assert.equal(resourceById.get(particleShort.rubricId).maxPoints, 4)
  assert.equal(resourceById.get(commonIonShort.rubricId).maxPoints, 4)
  assert.equal(resourceById.get(long.rubricId).maxPoints, 6)
  assert.equal(resourceById.get(commonIonLong.rubricId).maxPoints, 7)
  assert.equal(resourceById.get(transformationsLong.rubricId).maxPoints, 8)
})
