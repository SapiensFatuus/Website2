import test from 'node:test'
import assert from 'node:assert/strict'
import { apChemistryEquilibriumQuestions } from '../questions/catalog/apChemistryEquilibriumQuestions.js'
import { apChemistryEquilibriumResources } from './apChemistryEquilibriumResources.js'
import { apChemistryAcidsBasesQuestions } from '../questions/catalog/apChemistryAcidsBasesQuestions.js'
import { apChemistryAcidsBasesResources } from './apChemistryAcidsBasesResources.js'
import { apChemistryPropertiesMixturesResources } from './apChemistryPropertiesMixturesResources.js'
import { apChemistryPropertiesMixturesQuestions } from '../questions/catalog/apChemistryPropertiesMixturesQuestions.js'
import { apChemistryChemicalReactionsResources } from './apChemistryChemicalReactionsResources.js'
import { apChemistryChemicalReactionsQuestions } from '../questions/catalog/apChemistryChemicalReactionsQuestions.js'
import { apChemistryKineticsResources } from './apChemistryKineticsResources.js'
import { apChemistryKineticsQuestions } from '../questions/catalog/apChemistryKineticsQuestions.js'
import { apChemistryThermochemistryResources } from './apChemistryThermochemistryResources.js'
import { apChemistryThermochemistryQuestions } from '../questions/catalog/apChemistryThermochemistryQuestions.js'
import { apChemistryThermodynamicsElectrochemistryResources } from './apChemistryThermodynamicsElectrochemistryResources.js'
import { apChemistryThermodynamicsElectrochemistryQuestions } from '../questions/catalog/apChemistryThermodynamicsElectrochemistryQuestions.js'
import { apChemistryAtomicStructurePropertiesResources } from './apChemistryAtomicStructurePropertiesResources.js'
import { apChemistryAtomicStructurePropertiesQuestions } from '../questions/catalog/apChemistryAtomicStructurePropertiesQuestions.js'
import { apChemistryCompoundStructurePropertiesResources } from './apChemistryCompoundStructurePropertiesResources.js'
import { apChemistryCompoundStructurePropertiesQuestions } from '../questions/catalog/apChemistryCompoundStructurePropertiesQuestions.js'
import {
  apChemistryAcidsBasesFrqExemplars,
  apChemistryEquilibriumFrqExemplars,
  apChemistryPropertiesMixturesFrqExemplars,
  apChemistryChemicalReactionsFrqExemplars,
  apChemistryKineticsFrqExemplars,
  apChemistryThermochemistryFrqExemplars,
  apChemistryThermodynamicsElectrochemistryFrqExemplars,
  apChemistryAtomicStructurePropertiesFrqExemplars,
  apChemistryCompoundStructurePropertiesFrqExemplars,
} from './apChemistryFrqExemplars.js'
import { createApChemistryUnitReadinessReport, createUnit7ReadinessReport } from './apChemistryReadiness.js'
import {
  apChemistryAssessmentBlueprints,
  UNIT3_DIAGNOSTIC_ID,
} from './apChemistryAssessmentsValidated.js'

test('Unit 7 readiness reports exact draft-volume deficits without claiming launch readiness', () => {
  const report = createUnit7ReadinessReport({
    questions: apChemistryEquilibriumQuestions,
    resources: apChemistryEquilibriumResources,
    exemplars: apChemistryEquilibriumFrqExemplars,
    assessments: apChemistryAssessmentBlueprints,
  })
  assert.equal(report.ready, false)
  assert.deepEqual(report.counts, {
    questions: 62,
    resources: 27,
    discreteMultipleChoice: 35,
    linkedMultipleChoice: 16,
    validStimulusSets: 5,
    shortFreeResponse: 8,
    longFreeResponse: 3,
    frqExemplarSets: 11,
    freeResponsesWithExemplars: 11,
    reviewedContentRecords: 0,
    reviewRequiredContentRecords: 100,
    questionsWithReferenceCoverage: 62,
    referencedFormulaEntries: 6,
    reviewedFormulaEntries: 0,
    fixedAssessmentBlueprints: 3,
    pilotEvidenceRecords: 0,
    timingCalibrationsAccepted: 0,
  })
  assert.deepEqual(report.gates.filter((item) => !item.pass).map(({ id, remaining }) => ({ id, remaining })), [
    { id: 'two-reviewer-approval', remaining: 100 },
    { id: 'reference-entry-review', remaining: 6 },
    { id: 'aggregate-pilot-evidence', remaining: 3 },
    { id: 'timing-calibration-approval', remaining: 3 },
  ])
})

test('readiness rejects unbacked or incorrectly sized stimulus groups', () => {
  const sample = apChemistryEquilibriumQuestions.find((question) => question.renderer === 'multiple-choice')
  const questions = Array.from({ length: 5 }, (_, index) => ({ ...sample, id: `invalid-linked-${index}`, stimulusId: 'missing-stimulus' }))
  const report = createUnit7ReadinessReport({ questions, resources: [] })
  assert.equal(report.counts.validStimulusSets, 0)
  assert.equal(report.gates.find((item) => item.id === 'stimulus-set-volume').pass, false)
})

test('readiness reports exact Unit 8 starter progress and remaining production targets', () => {
  const report = createApChemistryUnitReadinessReport({
    unitId: 'acids-bases',
    questions: apChemistryAcidsBasesQuestions,
    resources: apChemistryAcidsBasesResources,
    exemplars: apChemistryAcidsBasesFrqExemplars,
    assessments: apChemistryAssessmentBlueprints,
  })
  assert.equal(report.ready, false)
  assert.equal(report.unitNumber, '8')
  assert.equal(report.counts.questions, 66)
  assert.equal(report.counts.discreteMultipleChoice, 35)
  assert.equal(report.counts.linkedMultipleChoice, 20)
  assert.equal(report.counts.validStimulusSets, 5)
  assert.equal(report.counts.shortFreeResponse, 8)
  assert.equal(report.counts.longFreeResponse, 3)
  assert.equal(report.counts.frqExemplarSets, 11)
  assert.equal(report.counts.freeResponsesWithExemplars, 11)
  assert.equal(report.counts.questionsWithReferenceCoverage, 66)
  assert.deepEqual(report.gates.filter((item) => !item.pass).map(({ id, remaining }) => ({ id, remaining })), [
    { id: 'two-reviewer-approval', remaining: 104 },
    { id: 'reference-entry-review', remaining: 5 },
    { id: 'aggregate-pilot-evidence', remaining: 3 },
    { id: 'timing-calibration-approval', remaining: 3 },
  ])
})

test('Unit 3 readiness reports the exact starter slice without hiding remaining production work', () => {
  const report = createApChemistryUnitReadinessReport({
    unitId: 'properties-substances-mixtures',
    questions: apChemistryPropertiesMixturesQuestions,
    resources: apChemistryPropertiesMixturesResources,
    exemplars: apChemistryPropertiesMixturesFrqExemplars,
    assessments: apChemistryAssessmentBlueprints,
  })
  assert.equal(report.ready, false)
  assert.equal(report.counts.questions, 66)
  assert.equal(report.counts.resources, 27)
  assert.equal(report.counts.reviewRequiredContentRecords, 104)
  assert.deepEqual(report.gates.filter((item) => !item.pass).map(({ id, remaining }) => ({ id, remaining })), [
    { id: 'two-reviewer-approval', remaining: 104 },
    { id: 'reference-entry-review', remaining: 6 },
    { id: 'aggregate-pilot-evidence', remaining: 3 },
    { id: 'timing-calibration-approval', remaining: 3 },
  ])
})

test('Unit 4 readiness reports a complete thin skeleton without implying pilot volume', () => {
  const report = createApChemistryUnitReadinessReport({
    unitId: 'chemical-reactions',
    questions: apChemistryChemicalReactionsQuestions,
    resources: apChemistryChemicalReactionsResources,
    exemplars: apChemistryChemicalReactionsFrqExemplars,
    assessments: apChemistryAssessmentBlueprints,
  })
  assert.equal(report.ready, false)
  assert.equal(report.unitNumber, '4')
  assert.deepEqual(report.counts, {
    questions: 28,
    resources: 9,
    discreteMultipleChoice: 18,
    linkedMultipleChoice: 8,
    validStimulusSets: 2,
    shortFreeResponse: 1,
    longFreeResponse: 1,
    frqExemplarSets: 2,
    freeResponsesWithExemplars: 2,
    reviewedContentRecords: 0,
    reviewRequiredContentRecords: 39,
    questionsWithReferenceCoverage: 28,
    referencedFormulaEntries: 3,
    reviewedFormulaEntries: 0,
    fixedAssessmentBlueprints: 3,
    pilotEvidenceRecords: 0,
    timingCalibrationsAccepted: 0,
  })
  assert.deepEqual(report.gates.filter((item) => !item.pass).map(({ id, remaining }) => ({ id, remaining })), [
    { id: 'discrete-multiple-choice-volume', remaining: 17 },
    { id: 'stimulus-set-volume', remaining: 3 },
    { id: 'short-free-response-volume', remaining: 7 },
    { id: 'long-free-response-volume', remaining: 2 },
    { id: 'two-reviewer-approval', remaining: 39 },
    { id: 'reference-entry-review', remaining: 3 },
    { id: 'aggregate-pilot-evidence', remaining: 3 },
    { id: 'timing-calibration-approval', remaining: 3 },
  ])
})

test('Unit 5 readiness reports a complete thin skeleton without implying pilot volume', () => {
  const report = createApChemistryUnitReadinessReport({
    unitId: 'kinetics',
    questions: apChemistryKineticsQuestions,
    resources: apChemistryKineticsResources,
    exemplars: apChemistryKineticsFrqExemplars,
    assessments: apChemistryAssessmentBlueprints,
  })
  assert.equal(report.ready, false)
  assert.equal(report.unitNumber, '5')
  assert.deepEqual(report.counts, {
    questions: 30,
    resources: 9,
    discreteMultipleChoice: 20,
    linkedMultipleChoice: 8,
    validStimulusSets: 2,
    shortFreeResponse: 1,
    longFreeResponse: 1,
    frqExemplarSets: 2,
    freeResponsesWithExemplars: 2,
    reviewedContentRecords: 0,
    reviewRequiredContentRecords: 41,
    questionsWithReferenceCoverage: 30,
    referencedFormulaEntries: 3,
    reviewedFormulaEntries: 0,
    fixedAssessmentBlueprints: 3,
    pilotEvidenceRecords: 0,
    timingCalibrationsAccepted: 0,
  })
  assert.deepEqual(report.gates.filter((item) => !item.pass).map(({ id, remaining }) => ({ id, remaining })), [
    { id: 'discrete-multiple-choice-volume', remaining: 15 },
    { id: 'stimulus-set-volume', remaining: 3 },
    { id: 'short-free-response-volume', remaining: 7 },
    { id: 'long-free-response-volume', remaining: 2 },
    { id: 'two-reviewer-approval', remaining: 41 },
    { id: 'reference-entry-review', remaining: 3 },
    { id: 'aggregate-pilot-evidence', remaining: 3 },
    { id: 'timing-calibration-approval', remaining: 3 },
  ])
})

test('Unit 6 readiness reports a complete thin skeleton without implying pilot volume', () => {
  const report = createApChemistryUnitReadinessReport({
    unitId: 'thermochemistry',
    questions: apChemistryThermochemistryQuestions,
    resources: apChemistryThermochemistryResources,
    exemplars: apChemistryThermochemistryFrqExemplars,
    assessments: apChemistryAssessmentBlueprints,
  })
  assert.equal(report.ready, false)
  assert.equal(report.unitNumber, '6')
  assert.deepEqual(report.counts, {
    questions: 28, resources: 9, discreteMultipleChoice: 18, linkedMultipleChoice: 8,
    validStimulusSets: 2, shortFreeResponse: 1, longFreeResponse: 1,
    frqExemplarSets: 2, freeResponsesWithExemplars: 2,
    reviewedContentRecords: 0, reviewRequiredContentRecords: 39,
    questionsWithReferenceCoverage: 28, referencedFormulaEntries: 3, reviewedFormulaEntries: 0,
    fixedAssessmentBlueprints: 3, pilotEvidenceRecords: 0, timingCalibrationsAccepted: 0,
  })
  assert.deepEqual(report.gates.filter((item) => !item.pass).map(({ id, remaining }) => ({ id, remaining })), [
    { id: 'discrete-multiple-choice-volume', remaining: 17 },
    { id: 'stimulus-set-volume', remaining: 3 },
    { id: 'short-free-response-volume', remaining: 7 },
    { id: 'long-free-response-volume', remaining: 2 },
    { id: 'two-reviewer-approval', remaining: 39 },
    { id: 'reference-entry-review', remaining: 3 },
    { id: 'aggregate-pilot-evidence', remaining: 3 },
    { id: 'timing-calibration-approval', remaining: 3 },
  ])
})

test('Unit 9 readiness reports a complete thin skeleton without implying pilot volume', () => {
  const report = createApChemistryUnitReadinessReport({
    unitId: 'thermodynamics-electrochemistry',
    questions: apChemistryThermodynamicsElectrochemistryQuestions,
    resources: apChemistryThermodynamicsElectrochemistryResources,
    exemplars: apChemistryThermodynamicsElectrochemistryFrqExemplars,
    assessments: apChemistryAssessmentBlueprints,
  })
  assert.equal(report.ready, false)
  assert.equal(report.unitNumber, '9')
  assert.deepEqual(report.counts, {
    questions: 30, resources: 9, discreteMultipleChoice: 20, linkedMultipleChoice: 8,
    validStimulusSets: 2, shortFreeResponse: 1, longFreeResponse: 1,
    frqExemplarSets: 2, freeResponsesWithExemplars: 2,
    reviewedContentRecords: 0, reviewRequiredContentRecords: 41,
    questionsWithReferenceCoverage: 30, referencedFormulaEntries: 3, reviewedFormulaEntries: 0,
    fixedAssessmentBlueprints: 3, pilotEvidenceRecords: 0, timingCalibrationsAccepted: 0,
  })
  assert.deepEqual(report.gates.filter((item) => !item.pass).map(({ id, remaining }) => ({ id, remaining })), [
    { id: 'discrete-multiple-choice-volume', remaining: 15 },
    { id: 'stimulus-set-volume', remaining: 3 },
    { id: 'short-free-response-volume', remaining: 7 },
    { id: 'long-free-response-volume', remaining: 2 },
    { id: 'two-reviewer-approval', remaining: 41 },
    { id: 'reference-entry-review', remaining: 3 },
    { id: 'aggregate-pilot-evidence', remaining: 3 },
    { id: 'timing-calibration-approval', remaining: 3 },
  ])
})

test('Unit 1 readiness reports a complete thin skeleton without implying pilot volume', () => {
  const report = createApChemistryUnitReadinessReport({
    unitId: 'atomic-structure-properties',
    questions: apChemistryAtomicStructurePropertiesQuestions,
    resources: apChemistryAtomicStructurePropertiesResources,
    exemplars: apChemistryAtomicStructurePropertiesFrqExemplars,
    assessments: apChemistryAssessmentBlueprints,
  })
  assert.equal(report.ready, false)
  assert.equal(report.unitNumber, '1')
  assert.deepEqual(report.counts, {
    questions: 30, resources: 10, discreteMultipleChoice: 20, linkedMultipleChoice: 8,
    validStimulusSets: 2, shortFreeResponse: 1, longFreeResponse: 1,
    frqExemplarSets: 2, freeResponsesWithExemplars: 2,
    reviewedContentRecords: 0, reviewRequiredContentRecords: 42,
    questionsWithReferenceCoverage: 30, referencedFormulaEntries: 4, reviewedFormulaEntries: 0,
    fixedAssessmentBlueprints: 3, pilotEvidenceRecords: 0, timingCalibrationsAccepted: 0,
  })
  assert.deepEqual(report.gates.filter((item) => !item.pass).map(({ id, remaining }) => ({ id, remaining })), [
    { id: 'discrete-multiple-choice-volume', remaining: 15 },
    { id: 'stimulus-set-volume', remaining: 3 },
    { id: 'short-free-response-volume', remaining: 7 },
    { id: 'long-free-response-volume', remaining: 2 },
    { id: 'two-reviewer-approval', remaining: 42 },
    { id: 'reference-entry-review', remaining: 4 },
    { id: 'aggregate-pilot-evidence', remaining: 3 },
    { id: 'timing-calibration-approval', remaining: 3 },
  ])
})

test('Unit 2 readiness reports a complete thin skeleton without implying pilot volume', () => {
  const report = createApChemistryUnitReadinessReport({
    unitId: 'compound-structure-properties',
    questions: apChemistryCompoundStructurePropertiesQuestions,
    resources: apChemistryCompoundStructurePropertiesResources,
    exemplars: apChemistryCompoundStructurePropertiesFrqExemplars,
    assessments: apChemistryAssessmentBlueprints,
  })
  assert.equal(report.ready, false)
  assert.equal(report.unitNumber, '2')
  assert.deepEqual(report.counts, {
    questions: 30, resources: 9, discreteMultipleChoice: 20, linkedMultipleChoice: 8,
    validStimulusSets: 2, shortFreeResponse: 1, longFreeResponse: 1,
    frqExemplarSets: 2, freeResponsesWithExemplars: 2,
    reviewedContentRecords: 0, reviewRequiredContentRecords: 41,
    questionsWithReferenceCoverage: 30, referencedFormulaEntries: 3, reviewedFormulaEntries: 0,
    fixedAssessmentBlueprints: 3, pilotEvidenceRecords: 0, timingCalibrationsAccepted: 0,
  })
  assert.deepEqual(report.gates.filter((item) => !item.pass).map(({ id, remaining }) => ({ id, remaining })), [
    { id: 'discrete-multiple-choice-volume', remaining: 15 },
    { id: 'stimulus-set-volume', remaining: 3 },
    { id: 'short-free-response-volume', remaining: 7 },
    { id: 'long-free-response-volume', remaining: 2 },
    { id: 'two-reviewer-approval', remaining: 41 },
    { id: 'reference-entry-review', remaining: 3 },
    { id: 'aggregate-pilot-evidence', remaining: 3 },
    { id: 'timing-calibration-approval', remaining: 3 },
  ])
})

test('readiness distinguishes aggregate pilot evidence from accepted timing calibration', () => {
  const collecting = {
    subjectId: 'ap-chemistry',
    unitId: 'properties-substances-mixtures',
    assessmentId: UNIT3_DIAGNOSTIC_ID,
    calibrationDecision: { status: 'collecting', reviewers: [] },
  }
  const report = createApChemistryUnitReadinessReport({
    unitId: 'properties-substances-mixtures',
    questions: apChemistryPropertiesMixturesQuestions,
    resources: apChemistryPropertiesMixturesResources,
    exemplars: apChemistryPropertiesMixturesFrqExemplars,
    assessments: apChemistryAssessmentBlueprints,
    pilotEvidence: [collecting],
  })
  assert.equal(report.gates.find(({ id }) => id === 'fixed-assessment-coverage').pass, true)
  assert.equal(report.gates.find(({ id }) => id === 'aggregate-pilot-evidence').actual, 1)
  assert.equal(report.gates.find(({ id }) => id === 'timing-calibration-approval').actual, 0)
})
