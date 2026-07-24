import test from 'node:test'
import assert from 'node:assert/strict'
import {
  EDITORIAL_CHECKLIST, createCoverageBrief, findSimilarInternalDrafts,
  validateEditorialAudit, validateReleasedExamMetadata, validateReleasedExamMetadataCatalog,
} from './editorialPipeline.js'

function metadata(overrides = {}) {
  return {
    schemaVersion: 1, id: 'released-2025-frq-1', year: 2025, publicQuestionNumber: 'FRQ 1',
    sourceId: 'ap-chemistry-released-frqs', observedAt: '2026-07-20', recordedBy: 'metadata-reviewer',
    topicIds: ['reaction-quotient-equilibrium-constant'], sciencePracticeIds: ['5.F'],
    taskVerbs: ['calculate', 'justify'], representationTypes: ['concentration-table'],
    calculationTypes: ['reaction-quotient'], misconceptionCategoryIds: ['q-versus-k-direction'],
    ...overrides,
  }
}

test('editorial checklist covers chemistry, assessment, accessibility, originality, and rights gates', () => {
  assert.deepEqual(EDITORIAL_CHECKLIST.map(({ id }) => id), [
    'chemistry-correctness', 'solvability', 'originality', 'distractors', 'units-significant-figures',
    'accessibility', 'rubric-consistency', 'source-rights',
  ])
})

test('released-exam records accept metadata but reject protected content fields at any depth', () => {
  assert.equal(validateReleasedExamMetadata(metadata()).valid, true)
  assert.match(validateReleasedExamMetadata(metadata({ questionText: 'copied wording' })).errors.join('\n'), /protected content field/)
  assert.match(validateReleasedExamMetadata(metadata({ notes: { rubricText: 'copied scoring language' } })).errors.join('\n'), /protected content field/)
  assert.match(validateReleasedExamMetadata(metadata({ copiedOfficialText: 'renamed protected wording' })).errors.join('\n'), /unknown metadata field is forbidden/)
  assert.match(validateReleasedExamMetadata(metadata({ taskVerbs: ['calculate the value using the wording from the source'] })).errors.join('\n'), /lowercase kebab-case metadata IDs/)
  assert.match(validateReleasedExamMetadata(metadata({ topicIds: ['invented-topic'] })).errors.join('\n'), /unknown AP Chemistry topic/)
})

test('released-exam catalog rejects duplicate public references', () => {
  const duplicate = metadata({ id: 'released-2025-frq-duplicate' })
  assert.match(validateReleasedExamMetadataCatalog([metadata(), duplicate]).errors.join('\n'), /duplicate public exam question reference/)
  const normalizedDuplicate = metadata({ id: 'released-2025-frq-normalized', publicQuestionNumber: 'frq  1' })
  assert.match(validateReleasedExamMetadataCatalog([metadata(), normalizedDuplicate]).errors.join('\n'), /duplicate public exam question reference/)
})

test('coverage briefs deterministically turn metadata gaps into original-content requirements', () => {
  const brief = createCoverageBrief([metadata()], {
    id: 'unit-7-pilot-brief', title: 'Unit 7 pilot', unitId: 'equilibrium', createdAt: '2026-07-20', createdBy: 'editor',
    desiredTopicCounts: { 'reaction-quotient-equilibrium-constant': 2, 'calculating-equilibrium-constant': 1 },
    desiredPracticeCounts: { '5.F': 2, '6.D': 1 },
  })
  assert.deepEqual(brief.topicRequirements, [
    { targetId: 'calculating-equilibrium-constant', desiredCount: 1, observedCount: 0, neededCount: 1 },
    { targetId: 'reaction-quotient-equilibrium-constant', desiredCount: 2, observedCount: 1, neededCount: 1 },
  ])
  assert.match(brief.originalityRequirement, /independently written/)
})

test('similarity tooling compares only internal drafts and produces deterministic review flags', () => {
  const flags = findSimilarInternalDrafts([
    { id: 'draft-b', text: 'Calculate the reaction quotient from each concentration and compare the quotient with the equilibrium constant.' },
    { id: 'draft-a', text: 'Calculate the reaction quotient from each concentration, then compare the quotient with the equilibrium constant.' },
    { id: 'draft-c', text: 'Explain why a catalyst changes the time required to reach equilibrium.' },
  ], { threshold: 0.5 })
  assert.equal(flags.length, 1)
  assert.deepEqual(flags[0].leftId, 'draft-a')
  assert.deepEqual(flags[0].rightId, 'draft-b')
  assert.ok(flags[0].score >= 0.5)
})

test('version and approval audit requires sequential hashes, attribution, and completed review gates', () => {
  const passingChecklist = EDITORIAL_CHECKLIST.map(({ id }) => ({ id, passed: true, note: `Checked ${id}.` }))
  const audit = {
    schemaVersion: 1, contentId: 'ap-chem-equilibrium-mcq-001', authoredBy: 'author-one',
    revisions: [{ revision: 1, date: '2026-07-20', actor: 'author-one', summary: 'Initial original draft.', contentHash: 'a'.repeat(64) }],
    decisions: [
      { from: 'draft', to: 'in-review', date: '2026-07-21', reviewerId: 'editor-one', checklistResults: [] },
      { from: 'in-review', to: 'approved', date: '2026-07-22', reviewerId: 'chemist-one', checklistResults: passingChecklist },
    ],
  }
  assert.equal(validateEditorialAudit(audit).valid, true)
  const selfApproved = structuredClone(audit)
  selfApproved.decisions[1].reviewerId = 'author-one'
  assert.match(validateEditorialAudit(selfApproved).errors.join('\n'), /reviewer other than the author/)
  const unchecked = structuredClone(audit)
  unchecked.decisions[1].checklistResults = []
  assert.match(validateEditorialAudit(unchecked).errors.join('\n'), /requires a passing chemistry-correctness/)
})
