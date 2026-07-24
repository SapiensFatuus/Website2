import test from 'node:test'
import assert from 'node:assert/strict'
import { apChemistryAcidsBasesResources } from './apChemistryAcidsBasesResources.js'
import { apChemistryEquilibriumResources } from './apChemistryEquilibriumResources.js'
import { apChemistryPropertiesMixturesResources } from './apChemistryPropertiesMixturesResources.js'
import { apChemistryChemicalReactionsResources } from './apChemistryChemicalReactionsResources.js'
import { apChemistryKineticsResources } from './apChemistryKineticsResources.js'
import { apChemistryThermochemistryResources } from './apChemistryThermochemistryResources.js'
import { apChemistryThermodynamicsElectrochemistryResources } from './apChemistryThermodynamicsElectrochemistryResources.js'
import { apChemistryAtomicStructurePropertiesResources } from './apChemistryAtomicStructurePropertiesResources.js'
import { apChemistryCompoundStructurePropertiesResources } from './apChemistryCompoundStructurePropertiesResources.js'
import { createEditorialCoverage, formatEditorialCoverage } from './coverage.js'

test('editorial coverage is deterministic and preserves draft provenance', () => {
  const coverage = createEditorialCoverage(apChemistryEquilibriumResources)
  assert.equal(coverage.totalResources, 27)
  assert.deepEqual(coverage.kinds, [
    { id: 'formula', count: 6 },
    { id: 'lesson', count: 5 },
    { id: 'rubric', count: 11 },
    { id: 'stimulus', count: 5 },
  ])
  assert.deepEqual(coverage.reviewStatuses, [{ id: 'draft', count: 27 }])
  assert.deepEqual(coverage.provenanceKinds, [{ id: 'ai-generated', count: 27 }])
  assert.ok(coverage.topics.some(({ id, count }) => id === 'reaction-quotient-equilibrium-constant' && count > 0))
  assert.equal(coverage.zeroCoverageTopics.filter(({ domainId }) => domainId === 'equilibrium').length, 0)
  assert.equal(formatEditorialCoverage(coverage), formatEditorialCoverage(createEditorialCoverage(apChemistryEquilibriumResources)))
})

test('cross-unit resource coverage exposes every implemented starter without hiding empty units', () => {
  const coverage = createEditorialCoverage([
    ...apChemistryEquilibriumResources,
    ...apChemistryAcidsBasesResources,
    ...apChemistryPropertiesMixturesResources,
    ...apChemistryChemicalReactionsResources,
    ...apChemistryKineticsResources,
    ...apChemistryThermochemistryResources,
    ...apChemistryThermodynamicsElectrochemistryResources,
    ...apChemistryAtomicStructurePropertiesResources,
    ...apChemistryCompoundStructurePropertiesResources,
  ])
  assert.equal(coverage.totalResources, 136)
  assert.equal(coverage.domainCoverage.length, 9)

  const unitSeven = coverage.domainCoverage.find(({ id }) => id === 'equilibrium')
  assert.deepEqual(
    { resources: unitSeven.resourceCount, lessons: unitSeven.lessonCount, formulas: unitSeven.formulaCount, topics: `${unitSeven.coveredTopicCount}/${unitSeven.topicCount}` },
    { resources: 27, lessons: 5, formulas: 6, topics: '12/12' },
  )

  const unitEight = coverage.domainCoverage.find(({ id }) => id === 'acids-bases')
  assert.deepEqual(
    { resources: unitEight.resourceCount, lessons: unitEight.lessonCount, formulas: unitEight.formulaCount, topics: `${unitEight.coveredTopicCount}/${unitEight.topicCount}` },
    { resources: 27, lessons: 5, formulas: 6, topics: '11/11' },
  )

  const unitThree = coverage.domainCoverage.find(({ id }) => id === 'properties-substances-mixtures')
  assert.deepEqual(
    { resources: unitThree.resourceCount, lessons: unitThree.lessonCount, formulas: unitThree.formulaCount, topics: `${unitThree.coveredTopicCount}/${unitThree.topicCount}` },
    { resources: 27, lessons: 5, formulas: 6, topics: '13/13' },
  )

  const unitFour = coverage.domainCoverage.find(({ id }) => id === 'chemical-reactions')
  assert.deepEqual(
    { resources: unitFour.resourceCount, lessons: unitFour.lessonCount, formulas: unitFour.formulaCount, stimuli: unitFour.stimulusCount, rubrics: unitFour.rubricCount, topics: `${unitFour.coveredTopicCount}/${unitFour.topicCount}` },
    { resources: 9, lessons: 2, formulas: 3, stimuli: 2, rubrics: 2, topics: '9/9' },
  )

  const unitFive = coverage.domainCoverage.find(({ id }) => id === 'kinetics')
  assert.deepEqual(
    { resources: unitFive.resourceCount, lessons: unitFive.lessonCount, formulas: unitFive.formulaCount, stimuli: unitFive.stimulusCount, rubrics: unitFive.rubricCount, topics: `${unitFive.coveredTopicCount}/${unitFive.topicCount}` },
    { resources: 9, lessons: 2, formulas: 3, stimuli: 2, rubrics: 2, topics: '11/11' },
  )

  const unitSix = coverage.domainCoverage.find(({ id }) => id === 'thermochemistry')
  assert.deepEqual(
    { resources: unitSix.resourceCount, lessons: unitSix.lessonCount, formulas: unitSix.formulaCount, stimuli: unitSix.stimulusCount, rubrics: unitSix.rubricCount, topics: `${unitSix.coveredTopicCount}/${unitSix.topicCount}` },
    { resources: 9, lessons: 2, formulas: 3, stimuli: 2, rubrics: 2, topics: '9/9' },
  )

  const unitNine = coverage.domainCoverage.find(({ id }) => id === 'thermodynamics-electrochemistry')
  assert.deepEqual(
    { resources: unitNine.resourceCount, lessons: unitNine.lessonCount, formulas: unitNine.formulaCount, stimuli: unitNine.stimulusCount, rubrics: unitNine.rubricCount, topics: `${unitNine.coveredTopicCount}/${unitNine.topicCount}` },
    { resources: 9, lessons: 2, formulas: 3, stimuli: 2, rubrics: 2, topics: '8/8' },
  )

  const unitOne = coverage.domainCoverage.find(({ id }) => id === 'atomic-structure-properties')
  assert.deepEqual(
    { resources: unitOne.resourceCount, lessons: unitOne.lessonCount, formulas: unitOne.formulaCount, stimuli: unitOne.stimulusCount, rubrics: unitOne.rubricCount, topics: `${unitOne.coveredTopicCount}/${unitOne.topicCount}` },
    { resources: 10, lessons: 2, formulas: 4, stimuli: 2, rubrics: 2, topics: '8/8' },
  )

  const unitTwo = coverage.domainCoverage.find(({ id }) => id === 'compound-structure-properties')
  assert.deepEqual(
    { resources: unitTwo.resourceCount, lessons: unitTwo.lessonCount, formulas: unitTwo.formulaCount, stimuli: unitTwo.stimulusCount, rubrics: unitTwo.rubricCount, topics: `${unitTwo.coveredTopicCount}/${unitTwo.topicCount}` },
    { resources: 9, lessons: 2, formulas: 3, stimuli: 2, rubrics: 2, topics: '7/7' },
  )
  assert.match(formatEditorialCoverage(coverage), /Unit 8 acids-bases: 27; 5; 6; 5; 11; 11\/11/)
  assert.match(formatEditorialCoverage(coverage), /Unit 3 properties-substances-mixtures: 27; 5; 6; 5; 11; 13\/13/)
  assert.match(formatEditorialCoverage(coverage), /Unit 4 chemical-reactions: 9; 2; 3; 2; 2; 9\/9/)
  assert.match(formatEditorialCoverage(coverage), /Unit 5 kinetics: 9; 2; 3; 2; 2; 11\/11/)
  assert.match(formatEditorialCoverage(coverage), /Unit 6 thermochemistry: 9; 2; 3; 2; 2; 9\/9/)
  assert.match(formatEditorialCoverage(coverage), /Unit 9 thermodynamics-electrochemistry: 9; 2; 3; 2; 2; 8\/8/)
  assert.match(formatEditorialCoverage(coverage), /Unit 1 atomic-structure-properties: 10; 2; 4; 2; 2; 8\/8/)
  assert.match(formatEditorialCoverage(coverage), /Unit 2 compound-structure-properties: 9; 2; 3; 2; 2; 7\/7/)
})
