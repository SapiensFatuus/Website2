import test from 'node:test'
import assert from 'node:assert/strict'
import { apChemistryAcidsBasesQuestions } from '../questions/catalog/apChemistryAcidsBasesQuestions.js'

const expectedKeys = Object.freeze({
  'ap-chem-acids-bases-mcq-001': 'a',
  'ap-chem-acids-bases-mcq-002': 'd',
  'ap-chem-acids-bases-mcq-003': 'b',
  'ap-chem-acids-bases-mcq-004': 'b',
  'ap-chem-acids-bases-mcq-005': 'c',
  'ap-chem-acids-bases-mcq-006': 'a',
  'ap-chem-acids-bases-mcq-007': 'c',
  'ap-chem-acids-bases-mcq-008': 'c',
  'ap-chem-acids-bases-mcq-009': 'c',
  'ap-chem-acids-bases-mcq-010': 'a',
  'ap-chem-acids-bases-mcq-011': 'a',
  'ap-chem-acids-bases-mcq-012': 'a',
  'ap-chem-acids-bases-mcq-013': 'b',
  'ap-chem-acids-bases-mcq-014': 'b',
  'ap-chem-acids-bases-mcq-015': 'a',
  'ap-chem-acids-bases-mcq-016': 'c',
  'ap-chem-acids-bases-mcq-017': 'a',
  'ap-chem-acids-bases-mcq-018': 'a',
  'ap-chem-acids-bases-mcq-019': 'a',
  'ap-chem-acids-bases-mcq-020': 'd',
  'ap-chem-acids-bases-mcq-021': 'c',
  'ap-chem-acids-bases-mcq-022': 'b',
  'ap-chem-acids-bases-mcq-023': 'c',
  'ap-chem-acids-bases-mcq-024': 'd',
  'ap-chem-acids-bases-mcq-025': 'b',
  'ap-chem-acids-bases-mcq-026': 'a',
  'ap-chem-acids-bases-mcq-027': 'a',
  'ap-chem-acids-bases-mcq-028': 'b',
  'ap-chem-acids-bases-mcq-029': 'c',
  'ap-chem-acids-bases-mcq-030': 'd',
  'ap-chem-acids-bases-mcq-031': 'b',
  'ap-chem-acids-bases-mcq-032': 'c',
  'ap-chem-acids-bases-mcq-033': 'b',
  'ap-chem-acids-bases-mcq-034': 'a',
  'ap-chem-acids-bases-mcq-035': 'd',
  'ap-chem-acids-bases-stimulus-mcq-001': 'b',
  'ap-chem-acids-bases-stimulus-mcq-002': 'c',
  'ap-chem-acids-bases-stimulus-mcq-003': 'b',
  'ap-chem-acids-bases-stimulus-mcq-004': 'a',
  'ap-chem-acids-bases-stimulus-mcq-005': 'b',
  'ap-chem-acids-bases-stimulus-mcq-006': 'b',
  'ap-chem-acids-bases-stimulus-mcq-007': 'a',
  'ap-chem-acids-bases-stimulus-mcq-008': 'b',
  'ap-chem-acids-bases-stimulus-mcq-009': 'c',
  'ap-chem-acids-bases-stimulus-mcq-010': 'a',
  'ap-chem-acids-bases-stimulus-mcq-011': 'c',
  'ap-chem-acids-bases-stimulus-mcq-012': 'a',
  'ap-chem-acids-bases-stimulus-mcq-013': 'd',
  'ap-chem-acids-bases-stimulus-mcq-014': 'b',
  'ap-chem-acids-bases-stimulus-mcq-015': 'c',
  'ap-chem-acids-bases-stimulus-mcq-016': 'a',
  'ap-chem-acids-bases-stimulus-mcq-017': 'b',
  'ap-chem-acids-bases-stimulus-mcq-018': 'd',
  'ap-chem-acids-bases-stimulus-mcq-019': 'a',
  'ap-chem-acids-bases-stimulus-mcq-020': 'c',
})

test('Unit 8 selected-response keys are independently enumerated and complete', () => {
  const selectedResponseQuestions = apChemistryAcidsBasesQuestions
    .filter((question) => question.answer.kind === 'selected-response')
  assert.equal(selectedResponseQuestions.length, Object.keys(expectedKeys).length)
  selectedResponseQuestions.forEach((question) => {
    assert.equal(question.answer.correctOptionId, expectedKeys[question.id], question.id)
    assert.equal(question.answer.options.filter(({ id }) => id === question.answer.correctOptionId).length, 1)
  })
})

test('Unit 8 numerical question keys reproduce the stated values', () => {
  const hydroxide = 2 * 0.0040
  const pOH = -Math.log10(hydroxide)
  const pHStrongBase = 14 - pOH
  assert.ok(Math.abs(pHStrongBase - 11.90309) < 1e-5)

  const ka = 1.0e-5
  const initialAcid = 0.100
  const exactHydronium = (-ka + Math.sqrt((ka ** 2) + (4 * ka * initialAcid))) / 2
  const exactWeakAcidPh = -Math.log10(exactHydronium)
  assert.ok(Math.abs(exactWeakAcidPh - 3.00217) < 1e-5)
  assert.ok((exactHydronium / initialAcid) * 100 < 1.1)

  const bufferRatioAfterAcid = (0.050 - 0.010) / (0.030 + 0.010)
  assert.ok(Math.abs(bufferRatioAfterAcid - 1) < 1e-12)

  const ratioOnePhUnitAbovePka = 10 ** 1
  assert.equal(ratioOnePhUnitAbovePka, 10)

  const bufferPh = 4.20 + Math.log10(4.0)
  assert.ok(Math.abs(bufferPh - 4.80206) < 1e-5)

  const initialMoles = 0.02500 * 0.0800
  const equivalenceVolume = initialMoles / 0.1000
  assert.ok(Math.abs(initialMoles - 0.00200) < 1e-12)
  assert.ok(Math.abs(equivalenceVolume - 0.02000) < 1e-12)

  const excessHydroxide = ((0.02400 * 0.1000) - initialMoles) / (0.02500 + 0.02400)
  const postEquivalencePh = 14 + Math.log10(excessHydroxide)
  assert.ok(Math.abs(excessHydroxide - 0.00816327) < 1e-8)
  assert.ok(Math.abs(postEquivalencePh - 11.91186) < 1e-5)

  const remainingWeakAcid = 0.0300 - 0.00500
  const resultingConjugateBase = 0.0200 + 0.00500
  const frqPh = 4.60 + Math.log10(resultingConjugateBase / remainingWeakAcid)
  assert.ok(Math.abs(remainingWeakAcid - 0.0250) < 1e-12)
  assert.ok(Math.abs(resultingConjugateBase - 0.0250) < 1e-12)
  assert.ok(Math.abs(frqPh - 4.60) < 1e-12)

  const longFrqKa = 2.5e-5
  const longFrqInitialAcid = 0.120
  const initialHydronium = (
    -longFrqKa + Math.sqrt((longFrqKa ** 2) + (4 * longFrqKa * longFrqInitialAcid))
  ) / 2
  const initialPh = -Math.log10(initialHydronium)
  const percentIonization = (initialHydronium / longFrqInitialAcid) * 100
  assert.ok(Math.abs(initialHydronium - 1.71960e-3) < 1e-8)
  assert.ok(Math.abs(initialPh - 2.76457) < 1e-5)
  assert.ok(Math.abs(percentIonization - 1.43300) < 1e-5)

  const longFrqInitialMoles = 0.02500 * longFrqInitialAcid
  const longFrqEquivalenceVolume = longFrqInitialMoles / 0.100
  const halfEquivalencePh = -Math.log10(longFrqKa)
  assert.ok(Math.abs(longFrqInitialMoles - 0.00300) < 1e-12)
  assert.ok(Math.abs(longFrqEquivalenceVolume - 0.0300) < 1e-12)
  assert.ok(Math.abs(halfEquivalencePh - 4.60206) < 1e-5)

  const conjugateBaseConcentration = longFrqInitialMoles / (0.02500 + longFrqEquivalenceVolume)
  const kb = 1e-14 / longFrqKa
  const equivalenceHydroxide = (-kb + Math.sqrt((kb ** 2) + (4 * kb * conjugateBaseConcentration))) / 2
  const equivalencePh = 14 + Math.log10(equivalenceHydroxide)
  assert.ok(Math.abs(conjugateBaseConcentration - 0.0545455) < 1e-7)
  assert.ok(Math.abs(equivalenceHydroxide - 4.67079e-6) < 1e-11)
  assert.ok(Math.abs(equivalencePh - 8.66939) < 1e-5)

  const bufferTrials = [
    { acid: 0.100, base: 0.100, expectedInitial: 4.76, expectedAfter: 4.58391 },
    { acid: 0.500, base: 0.500, expectedInitial: 4.76, expectedAfter: 4.72524 },
    { acid: 0.0500, base: 0.200, expectedInitial: 5.36206, expectedAfter: 5.17017 },
  ]
  bufferTrials.forEach(({ acid, base, expectedInitial, expectedAfter }) => {
    const initial = 4.76 + Math.log10(base / acid)
    const after = 4.76 + Math.log10(((base * 0.1000) - 0.00200) / ((acid * 0.1000) + 0.00200))
    assert.ok(Math.abs(initial - expectedInitial) < 1e-5)
    assert.ok(Math.abs(after - expectedAfter) < 1e-5)
  })
  const bufferChanges = bufferTrials.map(({ expectedInitial, expectedAfter }) => Math.abs(expectedAfter - expectedInitial))
  assert.equal(bufferChanges.indexOf(Math.min(...bufferChanges)), 1)

  const mixedAcidMoles = (0.0250 * 0.0200) - (0.0250 * 0.0100)
  const mixedHydronium = mixedAcidMoles / 0.0500
  assert.ok(Math.abs(-Math.log10(mixedHydronium) - 2.30103) < 1e-5)

  const titrationExcessHydroxide = ((0.0250 * 0.100) - (0.0200 * 0.100)) / 0.0450
  const strongTitrationPh = 14 + Math.log10(titrationExcessHydroxide)
  assert.ok(Math.abs(titrationExcessHydroxide - 0.0111111) < 1e-7)
  assert.ok(Math.abs(strongTitrationPh - 12.04576) < 1e-5)

  assert.ok(Math.abs((1e-3 / 1e-6) - 1000) < 1e-9)
  assert.equal(-Math.log10(1e-3), 3)
  assert.equal(-Math.log10(1e-6), 6)
  assert.ok(Math.abs((10 ** (6.20 - 5.70)) - 3.16228) < 1e-5)

  const dilutionKa = 4.0e-6
  const dilutionTrials = [
    { concentration: 0.400, expectedPh: 2.89863, expectedPercent: 0.31573 },
    { concentration: 0.100, expectedPh: 3.20034, expectedPercent: 0.63046 },
    { concentration: 0.0250, expectedPh: 3.50275, expectedPercent: 1.25694 },
    { concentration: 0.00625, expectedPh: 3.80652, expectedPercent: 2.49802 },
  ]
  dilutionTrials.forEach(({ concentration, expectedPh, expectedPercent }) => {
    const hydronium = (
      -dilutionKa + Math.sqrt((dilutionKa ** 2) + (4 * dilutionKa * concentration))
    ) / 2
    assert.ok(Math.abs(-Math.log10(hydronium) - expectedPh) < 1e-5)
    assert.ok(Math.abs(((hydronium / concentration) * 100) - expectedPercent) < 1e-5)
    assert.ok(Math.abs(((hydronium ** 2) / (concentration - hydronium)) - dilutionKa) < 1e-15)
  })

  const measuredHydronium = 10 ** -2.72
  const measuredKa = (measuredHydronium ** 2) / (0.150 - measuredHydronium)
  const measuredPercent = (measuredHydronium / 0.150) * 100
  assert.ok(Math.abs(measuredHydronium - 1.90546e-3) < 1e-8)
  assert.ok(Math.abs(measuredKa - 2.45166e-5) < 1e-10)
  assert.ok(Math.abs(measuredPercent - 1.27031) < 1e-5)

  const carbonateSolubility = Math.sqrt(4.0e-9)
  assert.ok(Math.abs(carbonateSolubility - 6.32456e-5) < 1e-10)

  const dilutedStrongAcid = (0.0200 * 0.0100) / 0.2500
  assert.ok(Math.abs(dilutedStrongAcid - 8.00e-4) < 1e-12)
  assert.ok(Math.abs(-Math.log10(dilutedStrongAcid) - 3.09691) < 1e-5)

  const discreteWeakBaseKb = 2.0e-5
  const discreteWeakBaseInitial = 0.0500
  const discreteWeakBaseHydroxide = (
    -discreteWeakBaseKb
    + Math.sqrt((discreteWeakBaseKb ** 2) + (4 * discreteWeakBaseKb * discreteWeakBaseInitial))
  ) / 2
  assert.ok(Math.abs(discreteWeakBaseHydroxide - 9.90050e-4) < 1e-9)
  assert.ok(Math.abs((14 + Math.log10(discreteWeakBaseHydroxide)) - 10.99566) < 1e-5)

  assert.ok(Math.abs((4.80 + Math.log10(0.0100 / 0.0300)) - 4.32288) < 1e-5)
  assert.ok(Math.abs((0.0500 * 0.200) - 0.0100) < 1e-12)

  const bariumHydroxideAcidMoles = 0.0300 * 0.0300
  const bariumHydroxideBaseMoles = 2 * 0.0200 * 0.0200
  const bariumHydroxideExcessAcid = (
    bariumHydroxideAcidMoles - bariumHydroxideBaseMoles
  ) / (0.0300 + 0.0200)
  assert.ok(Math.abs(bariumHydroxideExcessAcid - 0.00200) < 1e-12)
  assert.ok(Math.abs(-Math.log10(bariumHydroxideExcessAcid) - 2.69897) < 1e-5)

  const discreteWeakAcidKa = 2.5e-4
  const discreteWeakAcidInitial = 0.0400
  const discreteWeakAcidHydronium = (
    -discreteWeakAcidKa
    + Math.sqrt((discreteWeakAcidKa ** 2) + (4 * discreteWeakAcidKa * discreteWeakAcidInitial))
  ) / 2
  assert.ok(Math.abs(discreteWeakAcidHydronium - 3.03975e-3) < 1e-8)
  assert.ok(Math.abs(-Math.log10(discreteWeakAcidHydronium) - 2.51716) < 1e-5)

  const discreteEquivalenceVolume = (0.0300 * 0.0750) / 0.150
  assert.ok(Math.abs(discreteEquivalenceVolume - 0.0150) < 1e-12)
  assert.ok(Math.abs((1e-14 / 4.0e-6) - 2.5e-9) < 1e-20)

  const strongAcidMoles = 0.0350 * 0.0600
  const strongBaseMoles = 0.0250 * 0.0500
  const excessStrongAcidMoles = strongAcidMoles - strongBaseMoles
  const mixedStrongAcidConcentration = excessStrongAcidMoles / (0.0350 + 0.0250)
  const mixedStrongAcidPh = -Math.log10(mixedStrongAcidConcentration)
  assert.ok(Math.abs(strongAcidMoles - 0.00210) < 1e-12)
  assert.ok(Math.abs(strongBaseMoles - 0.00125) < 1e-12)
  assert.ok(Math.abs(excessStrongAcidMoles - 0.000850) < 1e-12)
  assert.ok(Math.abs(mixedStrongAcidConcentration - 0.0141667) < 1e-7)
  assert.ok(Math.abs(mixedStrongAcidPh - 1.84873) < 1e-5)

  const capacityBufferAPh = 4.74 + Math.log10(0.00800 / 0.0120)
  const capacityBufferBPh = 4.74 + Math.log10(0.0480 / 0.0520)
  assert.ok(Math.abs(capacityBufferAPh - 4.56391) < 1e-5)
  assert.ok(Math.abs(capacityBufferBPh - 4.70524) < 1e-5)
  assert.ok(Math.abs(capacityBufferBPh - 4.74) < Math.abs(capacityBufferAPh - 4.74))

  const weakBaseKb = 4.0e-6
  const weakBaseInitial = 0.200
  const weakBaseHydroxide = (
    -weakBaseKb + Math.sqrt((weakBaseKb ** 2) + (4 * weakBaseKb * weakBaseInitial))
  ) / 2
  const weakBasePh = 14 + Math.log10(weakBaseHydroxide)
  const weakBasePercent = (weakBaseHydroxide / weakBaseInitial) * 100
  assert.ok(Math.abs(weakBaseHydroxide - 8.92429e-4) < 1e-9)
  assert.ok(Math.abs(weakBasePh - 10.95057) < 1e-5)
  assert.ok(Math.abs(weakBasePercent - 0.44621) < 1e-5)

  const dataTitrationMoles = 0.01860 * 0.1000
  const dataTitrationInitialConcentration = dataTitrationMoles / 0.02000
  const dataTitrationKa = 10 ** -4.35
  const dataTitrationConjugateBase = dataTitrationMoles / (0.02000 + 0.01860)
  const dataTitrationKb = 1e-14 / dataTitrationKa
  const dataTitrationHydroxide = (
    -dataTitrationKb
    + Math.sqrt((dataTitrationKb ** 2) + (4 * dataTitrationKb * dataTitrationConjugateBase))
  ) / 2
  const dataTitrationEquivalencePh = 14 + Math.log10(dataTitrationHydroxide)
  assert.ok(Math.abs(dataTitrationMoles - 0.001860) < 1e-12)
  assert.ok(Math.abs(dataTitrationInitialConcentration - 0.09300) < 1e-12)
  assert.ok(Math.abs(dataTitrationKa - 4.46684e-5) < 1e-10)
  assert.ok(Math.abs(dataTitrationConjugateBase - 0.0481865) < 1e-7)
  assert.ok(Math.abs(dataTitrationHydroxide - 3.28434e-6) < 1e-11)
  assert.ok(Math.abs(dataTitrationEquivalencePh - 8.51645) < 1e-5)

  const bufferDesignKa = 6.3e-5
  const bufferDesignPka = -Math.log10(bufferDesignKa)
  const bufferDesignInitialPh = bufferDesignPka + Math.log10(0.0200 / 0.0400)
  const bufferDesignAcidPh = bufferDesignPka + Math.log10(0.0150 / 0.0450)
  const bufferDesignBasePh = bufferDesignPka + Math.log10(0.0400 / 0.0200)
  const bufferDesignTargetRatio = 10 ** (4.50 - bufferDesignPka)
  const bufferDesignTargetAcid = 0.0600 / (1 + bufferDesignTargetRatio)
  const bufferDesignTargetBase = 0.0600 - bufferDesignTargetAcid
  assert.ok(Math.abs(bufferDesignPka - 4.20066) < 1e-5)
  assert.ok(Math.abs(bufferDesignInitialPh - 3.89963) < 1e-5)
  assert.ok(Math.abs(bufferDesignAcidPh - 3.72354) < 1e-5)
  assert.ok(Math.abs(bufferDesignBasePh - 4.50169) < 1e-5)
  assert.ok(Math.abs(bufferDesignTargetRatio - 1.99223) < 1e-5)
  assert.ok(Math.abs(bufferDesignTargetAcid - 0.0200519) < 1e-7)
  assert.ok(Math.abs(bufferDesignTargetBase - 0.0399481) < 1e-7)

  const unknownAcidHydronium = 10 ** -2.87
  const unknownAcidKa = (unknownAcidHydronium ** 2) / (0.100 - unknownAcidHydronium)
  const unknownAcidPka = -Math.log10(unknownAcidKa)
  const unknownAcidMoles = 0.02500 * 0.100
  const unknownAcidEquivalenceVolume = unknownAcidMoles / 0.1250
  const unknownAcidConjugateBase = unknownAcidMoles / (0.02500 + unknownAcidEquivalenceVolume)
  const unknownAcidKb = 1e-14 / unknownAcidKa
  const unknownAcidHydroxide = (
    -unknownAcidKb
    + Math.sqrt((unknownAcidKb ** 2) + (4 * unknownAcidKb * unknownAcidConjugateBase))
  ) / 2
  const unknownAcidEquivalencePh = 14 + Math.log10(unknownAcidHydroxide)
  assert.ok(Math.abs(unknownAcidHydronium - 1.34896e-3) < 1e-8)
  assert.ok(Math.abs(unknownAcidKa - 1.84458e-5) < 1e-10)
  assert.ok(Math.abs(unknownAcidPka - 4.73410) < 1e-5)
  assert.ok(Math.abs(unknownAcidEquivalenceVolume - 0.02000) < 1e-12)
  assert.ok(Math.abs(unknownAcidConjugateBase - 0.0555556) < 1e-7)
  assert.ok(Math.abs(unknownAcidHydroxide - 5.48773e-6) < 1e-11)
  assert.ok(Math.abs(unknownAcidEquivalencePh - 8.73939) < 1e-5)

  const fluorinatedAcidKas = [1.8e-5, 2.6e-3, 5.7e-2, 5.9e-1]
  assert.ok(fluorinatedAcidKas.every((ka, index) => index === 0 || ka > fluorinatedAcidKas[index - 1]))
  assert.ok(Math.abs(-Math.log10(2.6e-3) - 2.58503) < 1e-5)

  const indicatorBaseToAcidRatios = [
    9.1 / 90.9,
    50.0 / 50.0,
    90.9 / 9.1,
  ]
  assert.ok(Math.abs(indicatorBaseToAcidRatios[0] - 0.10011) < 1e-5)
  assert.equal(indicatorBaseToAcidRatios[1], 1)
  assert.ok(Math.abs(indicatorBaseToAcidRatios[2] - 9.98901) < 1e-5)
  assert.ok(Math.abs((6.80 + Math.log10(indicatorBaseToAcidRatios[2])) - 7.79952) < 1e-5)
})

test('Unit 8 conceptual keys preserve the governing chemical distinction', () => {
  const byId = new Map(apChemistryAcidsBasesQuestions.map((question) => [question.id, question]))
  assert.match(byId.get('ap-chem-acids-bases-mcq-005').explanation, /conjugate base A-.*produces OH-/)
  assert.match(byId.get('ap-chem-acids-bases-mcq-006').explanation, /Stabilizing the conjugate base favors proton loss/)
  assert.match(byId.get('ap-chem-acids-bases-mcq-010').explanation, /equal ratio.*same.*pH.*five times as many moles/i)
  assert.match(byId.get('ap-chem-acids-bases-mcq-011').explanation, /dissolution quotient falls below Ksp/)
  assert.match(byId.get('ap-chem-acids-bases-mcq-014').explanation, /hydronium concentration.*fraction.*ionizes/i)
  assert.match(byId.get('ap-chem-acids-bases-mcq-017').explanation, /Resonance delocalization stabilizes/)
  assert.match(byId.get('ap-chem-acids-bases-mcq-019').explanation, /0\.010 mol NH3.*0\.010 mol NH4\+/)
  assert.match(byId.get('ap-chem-acids-bases-mcq-021').explanation, /accepts a proton.*acts as a base.*donates a proton.*acts as an acid/i)
  assert.match(byId.get('ap-chem-acids-bases-mcq-025').explanation, /conjugate acid transfers a proton to water/)
  assert.match(byId.get('ap-chem-acids-bases-mcq-026').explanation, /strong H-F bond opposes ionization.*polarity alone/i)
  assert.match(byId.get('ap-chem-acids-bases-mcq-028').explanation, /hydroxide consumes all.*remains.*excess.*weak conjugate pair/i)
  assert.match(byId.get('ap-chem-acids-bases-mcq-031').explanation, /Removing OH- lowers Qsp.*below Ksp/i)
  assert.match(byId.get('ap-chem-acids-bases-stimulus-mcq-015').explanation, /inductive effect stabilizes.*conjugate base/i)
  assert.match(byId.get('ap-chem-acids-bases-stimulus-mcq-016').explanation, /weakest acid has the strongest conjugate base/i)
  assert.match(byId.get('ap-chem-acids-bases-stimulus-mcq-020').explanation, /reports the region but does not create the equivalence point/i)

  const shortFrq = byId.get('ap-chem-acids-bases-short-frq-001')
  assert.equal(shortFrq.answer.kind, 'free-response')
  assert.match(shortFrq.answer.modelAnswer, /0\.0250 mol HX.*0\.0250 mol X-/)
  assert.match(shortFrq.answer.modelAnswer, /pH = pKa.*= 4\.60\.$/)

  const longFrq = byId.get('ap-chem-acids-bases-long-frq-001')
  assert.equal(longFrq.answer.kind, 'free-response')
  assert.equal(longFrq.parts.length, 5)
  assert.match(longFrq.answer.modelAnswer, /pH = 2\.76.*30\.0 mL.*pH = pKa.*pH = 8\.67.*Indicator N/)

  const bufferDesignLongFrq = byId.get('ap-chem-acids-bases-long-frq-002')
  assert.equal(bufferDesignLongFrq.parts.length, 5)
  assert.match(bufferDesignLongFrq.answer.modelAnswer, /3\.90.*3\.72.*still a buffer.*4\.50.*lower capacity/)
  assert.match(bufferDesignLongFrq.answer.modelAnswer, /n\(HA\) = 0\.0201 mol.*n\(A-\) = 0\.0399 mol/)

  const unknownAcidLongFrq = byId.get('ap-chem-acids-bases-long-frq-003')
  assert.equal(unknownAcidLongFrq.parts.length, 6)
  assert.match(unknownAcidLongFrq.answer.modelAnswer, /1\.84 × 10\^-5.*20\.00 mL.*4\.73.*8\.74.*Indicator S/)

  const measuredAcidFrq = byId.get('ap-chem-acids-bases-short-frq-002')
  assert.equal(measuredAcidFrq.parts.length, 4)
  assert.match(measuredAcidFrq.answer.modelAnswer, /1\.91 × 10\^-3.*2\.45 × 10\^-5.*1\.27%/)

  const solubilityFrq = byId.get('ap-chem-acids-bases-short-frq-003')
  assert.equal(solubilityFrq.parts.length, 3)
  assert.match(solubilityFrq.answer.modelAnswer, /6\.3 × 10\^-5.*molar solubility increases.*Qsp/)

  const strongNeutralizationFrq = byId.get('ap-chem-acids-bases-short-frq-004')
  assert.equal(strongNeutralizationFrq.parts.length, 3)
  assert.match(strongNeutralizationFrq.answer.modelAnswer, /Hydroxide is limiting.*0\.000850 mol H\+.*pH = -log.*1\.85/)

  const capacityExperimentFrq = byId.get('ap-chem-acids-bases-short-frq-005')
  assert.equal(capacityExperimentFrq.parts.length, 4)
  assert.match(capacityExperimentFrq.answer.modelAnswer, /same measured increments.*Buffer B changes less.*4\.56.*4\.71/)

  const weakBaseFrq = byId.get('ap-chem-acids-bases-short-frq-006')
  assert.equal(weakBaseFrq.parts.length, 4)
  assert.match(weakBaseFrq.answer.modelAnswer, /8\.92 × 10\^-4.*pH = 14\.00.*10\.95.*0\.446%/)

  const oxoacidFrq = byId.get('ap-chem-acids-bases-short-frq-007')
  assert.equal(oxoacidFrq.parts.length, 3)
  assert.match(oxoacidFrq.answer.modelAnswer, /HXO < HXO2 < HXO3.*induction.*XO- > XO2- > XO3-/)

  const titrationDataFrq = byId.get('ap-chem-acids-bases-short-frq-008')
  assert.equal(titrationDataFrq.parts.length, 4)
  assert.match(titrationDataFrq.answer.modelAnswer, /0\.09300 M.*4\.47 × 10\^-5.*pH = 8\.52.*Indicator Q/)
})
