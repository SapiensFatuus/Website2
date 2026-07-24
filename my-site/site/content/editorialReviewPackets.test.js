import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { apChemistryAcidsBasesQuestions } from '../questions/catalog/apChemistryAcidsBasesQuestions.js'
import { apChemistryEquilibriumQuestions } from '../questions/catalog/apChemistryEquilibriumQuestions.js'
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
import {
  aggregateReviewPackets,
  createBlankReviewPacket,
  createEditorialContentHash,
  getReviewBundleTarget,
  validateReviewPacket,
} from './editorialReviewPackets.js'

const bundle = {
  questions: apChemistryEquilibriumQuestions,
  resources: apChemistryEquilibriumResources,
  exemplars: apChemistryEquilibriumFrqExemplars,
}

function completedPacket(reviewerId, date = '2026-07-20') {
  const packet = createBlankReviewPacket(bundle, { reviewerId, createdAt: date })
  packet.items.forEach((item) => {
    item.decision = 'approve'
    item.overallNote = 'Independently reviewed against the current draft and all required gates.'
    item.checklistResults.forEach((result) => {
      result.passed = true
      result.note = `Checked ${result.id} for this revision.`
    })
  })
  return packet
}

test('blank review packets cover every current draft with immutable revision evidence', () => {
  const packet = createBlankReviewPacket(bundle, { reviewerId: 'reviewer-one', createdAt: '2026-07-20' })
  assert.equal(packet.schemaVersion, 2)
  assert.equal(packet.items.length, 100)
  assert.equal(packet.items.filter(({ itemType }) => itemType === 'exemplar').length, 11)
  assert.ok(packet.items.every((item) => item.decision === 'pending' && item.checklistResults.length === 8))
  assert.ok(packet.items.every((item) => /^[a-f0-9]{64}$/.test(item.contentHash)))
  assert.deepEqual(validateReviewPacket(packet, bundle), { valid: true, errors: [] })
  assert.equal(
    createEditorialContentHash(apChemistryEquilibriumQuestions[0]),
    createEditorialContentHash(structuredClone(apChemistryEquilibriumQuestions[0])),
  )
})

test('packet validation rejects missing, stale, malformed, and self-approved decisions', () => {
  const missing = createBlankReviewPacket(bundle, { reviewerId: 'reviewer-one', createdAt: '2026-07-20' })
  missing.items.pop()
  assert.match(validateReviewPacket(missing, bundle).errors.join('\n'), /include every current question, resource, and exemplar/)

  const stale = createBlankReviewPacket(bundle, { reviewerId: 'reviewer-one', createdAt: '2026-07-20' })
  stale.items[0].sourceRevision += 1
  stale.items[1].contentHash = '0'.repeat(64)
  assert.match(validateReviewPacket(stale, bundle).errors.join('\n'), /stale sourceRevision/)
  assert.match(validateReviewPacket(stale, bundle).errors.join('\n'), /stale contentHash/)

  const incomplete = completedPacket('reviewer-one')
  incomplete.items[0].checklistResults[0].passed = false
  incomplete.items[0].checklistResults[0].note = ''
  assert.match(validateReviewPacket(incomplete, bundle, { requireCompleteDecisions: true }).errors.join('\n'), /completed checklist results require notes|approval requires every checklist/)

  const selfApproved = completedPacket('codex-ai-assisted-draft')
  assert.match(validateReviewPacket(selfApproved, bundle, { requireCompleteDecisions: true }).errors.join('\n'), /author cannot approve/)
})

test('completed review packets require an explicit decision for every item', () => {
  const packet = createBlankReviewPacket(bundle, { reviewerId: 'reviewer-one', createdAt: '2026-07-20' })
  const result = validateReviewPacket(packet, bundle, { requireCompleteDecisions: true })
  assert.equal(result.valid, false)
  assert.equal(result.errors.filter((error) => /pending decisions/.test(error)).length, 100)
})

test('two independent approving packets aggregate readiness without mutating content', () => {
  const before = createEditorialContentHash(apChemistryEquilibriumQuestions[0])
  const first = completedPacket('reviewer-one')
  const second = completedPacket('reviewer-two')
  const aggregate = aggregateReviewPackets([first, second], bundle)
  assert.equal(aggregate.itemCount, 100)
  assert.equal(aggregate.readyCount, 100)
  assert.equal(aggregate.changeRequestedCount, 0)
  assert.equal(aggregate.appliesChanges, false)
  assert.ok(aggregate.items.every(({ approvalCount, readyForStatusTransition }) => approvalCount === 2 && readyForStatusTransition))
  assert.equal(createEditorialContentHash(apChemistryEquilibriumQuestions[0]), before)
})

test('a change request blocks only the affected item and duplicate reviewers are rejected', () => {
  const first = completedPacket('reviewer-one')
  const second = completedPacket('reviewer-two')
  const affected = second.items[0]
  affected.decision = 'request-changes'
  affected.overallNote = 'Revise this item and submit a new revision before approval.'
  affected.checklistResults[0].passed = false
  affected.checklistResults[0].note = 'The chemical direction claim needs correction.'
  const aggregate = aggregateReviewPackets([first, second], bundle)
  assert.equal(aggregate.readyCount, 99)
  assert.equal(aggregate.changeRequestedCount, 1)
  assert.equal(aggregate.items.find(({ contentId }) => contentId === affected.contentId).readyForStatusTransition, false)

  assert.throws(() => aggregateReviewPackets([first, structuredClone(first)], bundle), /distinct reviewers/)
})

test('review template CLI emits machine-readable JSON and requires a reviewer identifier', () => {
  const script = fileURLToPath(new URL('../../scripts/apChemistryReviewPacket.js', import.meta.url))
  const generated = spawnSync(process.execPath, [script, 'template', '--reviewer=reviewer-one', '--date=2026-07-20'], { encoding: 'utf8' })
  assert.equal(generated.status, 0, generated.stderr)
  const packet = JSON.parse(generated.stdout)
  assert.equal(packet.reviewerId, 'reviewer-one')
  assert.equal(packet.items.length, 100)

  const missing = spawnSync(process.execPath, [script, 'template'], { encoding: 'utf8' })
  assert.equal(missing.status, 1)
  assert.match(missing.stderr, /--reviewer=reviewer-id/)

  const unitEight = spawnSync(process.execPath, [script, 'template', '--unit=acids-bases', '--reviewer=reviewer-one', '--date=2026-07-20'], { encoding: 'utf8' })
  assert.equal(unitEight.status, 0, unitEight.stderr)
  const unitEightPacket = JSON.parse(unitEight.stdout)
  assert.equal(unitEightPacket.unitId, 'acids-bases')
  assert.equal(
    unitEightPacket.items.length,
    apChemistryAcidsBasesQuestions.length + apChemistryAcidsBasesResources.length + apChemistryAcidsBasesFrqExemplars.length,
  )

  const unitThree = spawnSync(process.execPath, [script, 'template', '--unit=properties-substances-mixtures', '--reviewer=reviewer-one', '--date=2026-07-20'], { encoding: 'utf8' })
  assert.equal(unitThree.status, 0, unitThree.stderr)
  const unitThreePacket = JSON.parse(unitThree.stdout)
  assert.equal(
    unitThreePacket.items.length,
    apChemistryPropertiesMixturesQuestions.length + apChemistryPropertiesMixturesResources.length + apChemistryPropertiesMixturesFrqExemplars.length,
  )
  assert.equal(unitThreePacket.items.filter(({ itemType }) => itemType === 'question').length, apChemistryPropertiesMixturesQuestions.length)

  const unitFour = spawnSync(process.execPath, [script, 'template', '--unit=chemical-reactions', '--reviewer=reviewer-one', '--date=2026-07-20'], { encoding: 'utf8' })
  assert.equal(unitFour.status, 0, unitFour.stderr)
  const unitFourPacket = JSON.parse(unitFour.stdout)
  assert.equal(unitFourPacket.unitId, 'chemical-reactions')
  assert.equal(
    unitFourPacket.items.length,
    apChemistryChemicalReactionsQuestions.length + apChemistryChemicalReactionsResources.length + apChemistryChemicalReactionsFrqExemplars.length,
  )

  const unitFive = spawnSync(process.execPath, [script, 'template', '--unit=kinetics', '--reviewer=reviewer-one', '--date=2026-07-20'], { encoding: 'utf8' })
  assert.equal(unitFive.status, 0, unitFive.stderr)
  const unitFivePacket = JSON.parse(unitFive.stdout)
  assert.equal(unitFivePacket.unitId, 'kinetics')
  assert.equal(
    unitFivePacket.items.length,
    apChemistryKineticsQuestions.length + apChemistryKineticsResources.length + apChemistryKineticsFrqExemplars.length,
  )

  const unitSix = spawnSync(process.execPath, [script, 'template', '--unit=thermochemistry', '--reviewer=reviewer-one', '--date=2026-07-20'], { encoding: 'utf8' })
  assert.equal(unitSix.status, 0, unitSix.stderr)
  const unitSixPacket = JSON.parse(unitSix.stdout)
  assert.equal(unitSixPacket.unitId, 'thermochemistry')
  assert.equal(
    unitSixPacket.items.length,
    apChemistryThermochemistryQuestions.length + apChemistryThermochemistryResources.length + apChemistryThermochemistryFrqExemplars.length,
  )

  const unitNine = spawnSync(process.execPath, [script, 'template', '--unit=thermodynamics-electrochemistry', '--reviewer=reviewer-one', '--date=2026-07-20'], { encoding: 'utf8' })
  assert.equal(unitNine.status, 0, unitNine.stderr)
  const unitNinePacket = JSON.parse(unitNine.stdout)
  assert.equal(unitNinePacket.unitId, 'thermodynamics-electrochemistry')
  assert.equal(
    unitNinePacket.items.length,
    apChemistryThermodynamicsElectrochemistryQuestions.length + apChemistryThermodynamicsElectrochemistryResources.length + apChemistryThermodynamicsElectrochemistryFrqExemplars.length,
  )

  const unitOne = spawnSync(process.execPath, [script, 'template', '--unit=atomic-structure-properties', '--reviewer=reviewer-one', '--date=2026-07-20'], { encoding: 'utf8' })
  assert.equal(unitOne.status, 0, unitOne.stderr)
  const unitOnePacket = JSON.parse(unitOne.stdout)
  assert.equal(unitOnePacket.unitId, 'atomic-structure-properties')
  assert.equal(
    unitOnePacket.items.length,
    apChemistryAtomicStructurePropertiesQuestions.length + apChemistryAtomicStructurePropertiesResources.length + apChemistryAtomicStructurePropertiesFrqExemplars.length,
  )

  const unitTwo = spawnSync(process.execPath, [script, 'template', '--unit=compound-structure-properties', '--reviewer=reviewer-one', '--date=2026-07-20'], { encoding: 'utf8' })
  assert.equal(unitTwo.status, 0, unitTwo.stderr)
  const unitTwoPacket = JSON.parse(unitTwo.stdout)
  assert.equal(unitTwoPacket.unitId, 'compound-structure-properties')
  assert.equal(
    unitTwoPacket.items.length,
    apChemistryCompoundStructurePropertiesQuestions.length + apChemistryCompoundStructurePropertiesResources.length + apChemistryCompoundStructurePropertiesFrqExemplars.length,
  )
})

test('review template CLI writes only new UTF-8 JSON files inside review-packets', () => {
  const script = fileURLToPath(new URL('../../scripts/apChemistryReviewPacket.js', import.meta.url))
  const workingDirectory = mkdtempSync(join(tmpdir(), 'ap-chem-review-packet-'))
  const packetDirectory = join(workingDirectory, 'review-packets')
  mkdirSync(packetDirectory)

  try {
    const args = [
      script,
      'template',
      '--reviewer=reviewer-one',
      '--date=2026-07-20',
      '--output=review-packets/reviewer-one.json',
    ]
    const generated = spawnSync(process.execPath, args, { cwd: workingDirectory, encoding: 'utf8' })
    assert.equal(generated.status, 0, generated.stderr)
    assert.match(generated.stdout, /Created .*reviewer-one\.json/)

    const packet = JSON.parse(readFileSync(join(packetDirectory, 'reviewer-one.json'), 'utf8'))
    assert.equal(packet.reviewerId, 'reviewer-one')
    assert.equal(packet.items.length, 100)

    const overwrite = spawnSync(process.execPath, args, { cwd: workingDirectory, encoding: 'utf8' })
    assert.equal(overwrite.status, 1)
    assert.match(overwrite.stderr, /EEXIST|file already exists/i)

    const outside = spawnSync(process.execPath, [
      script,
      'template',
      '--reviewer=reviewer-two',
      '--output=outside.json',
    ], { cwd: workingDirectory, encoding: 'utf8' })
    assert.equal(outside.status, 1)
    assert.match(outside.stderr, /inside the local review-packets directory/)
  } finally {
    rmSync(workingDirectory, { recursive: true, force: true })
  }
})

test('review packet targeting derives from canonical bundle alignment instead of Unit 7 constants', () => {
  const question = structuredClone(apChemistryEquilibriumQuestions[0])
  question.id = 'ap-chem-acids-bases-review-fixture'
  question.taxonomy.domainId = 'acids-bases'
  question.taxonomy.skillId = 'introduction-acids-bases'
  question.taxonomy.learningObjectiveIds = ['8.1.A']
  const acidsBasesBundle = { questions: [question], resources: [] }
  assert.deepEqual(getReviewBundleTarget(acidsBasesBundle), { subjectId: 'ap-chemistry', unitId: 'acids-bases' })

  const packet = createBlankReviewPacket(acidsBasesBundle, { reviewerId: 'reviewer-one', createdAt: '2026-07-20' })
  assert.equal(packet.packetId, 'acids-bases-reviewer-one-2026-07-20')
  assert.equal(packet.subjectId, 'ap-chemistry')
  assert.equal(packet.unitId, 'acids-bases')
  assert.equal(validateReviewPacket(packet, acidsBasesBundle).valid, true)

  assert.throws(() => getReviewBundleTarget({
    questions: [apChemistryEquilibriumQuestions[0], question],
    resources: [],
  }), /exactly one canonical subject and unit/)
})
