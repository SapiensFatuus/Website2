import test from 'node:test'
import assert from 'node:assert/strict'
import { canonicalQuestions, canonicalPracticeQuestions } from './catalog/index.js'
import { createCatalogCoverage, formatCatalogCoverage } from './catalog/coverage.js'
import {
  SOURCE_KINDS,
  assertValidQuestionCatalog,
  validateCanonicalQuestion,
  validateQuestionCatalog,
} from './catalog/questionSchema.js'

function cloneQuestion(question = canonicalQuestions[0]) {
  return structuredClone(question)
}

function errorsFor(question) {
  return validateCanonicalQuestion(question).errors.join('\n')
}

test('all 11 SAT Math questions are explicit canonical records and practice-compatible', () => {
  assert.equal(canonicalQuestions.length, 11)
  assert.equal(canonicalPracticeQuestions.length, 11)
  assert.equal(validateQuestionCatalog(canonicalQuestions).valid, true)
  assert.deepEqual(canonicalQuestions.map((question) => question.id), [
    'sat-math-geometry-001',
    'sat-math-geometry-002',
    'sat-math-geometry-003',
    'sat-math-algebra-001',
    'sat-math-algebra-002',
    'sat-math-algebra-003',
    'sat-math-statistics-001',
    'sat-math-statistics-002',
    'sat-math-statistics-003',
    'sat-math-grid-in-algebra-001',
    'sat-math-grid-in-geometry-001',
  ])
  assert.ok(canonicalQuestions.every((question) => question.taxonomy.subjectId === 'sat-math'))
  assert.ok(canonicalQuestions.every((question) => question.answer && question.content && question.source))
  assert.deepEqual(
    canonicalPracticeQuestions.map((question) => question.id),
    canonicalQuestions.map((question) => question.id),
  )
})

test('catalog rejects duplicate and unstable question IDs', () => {
  const duplicate = validateQuestionCatalog([canonicalQuestions[0], canonicalQuestions[0]])
  assert.equal(duplicate.valid, false)
  assert.match(duplicate.errors.join('\n'), /duplicate question id/)

  const unstable = cloneQuestion()
  unstable.id = 'SAT Math Question 1'
  assert.match(errorsFor(unstable), /stable lowercase kebab-case/)
})

test('catalog rejects invalid taxonomy versions, references, and domain-skill mismatches', () => {
  const invalidVersion = cloneQuestion()
  invalidVersion.taxonomy.version = 999
  assert.match(errorsFor(invalidVersion), /taxonomy.version/)

  const unknownSubject = cloneQuestion()
  unknownSubject.taxonomy.subjectId = 'unknown-subject'
  assert.match(errorsFor(unknownSubject), /unknown subject/)

  const unknownExam = cloneQuestion()
  unknownExam.taxonomy.examId = 'act'
  assert.match(errorsFor(unknownExam), /exam\/subject pairing/)

  const mismatch = cloneQuestion()
  mismatch.taxonomy.domainId = 'algebra'
  assert.match(errorsFor(mismatch), /domain\/skill pairing/)

  const unknownDomain = cloneQuestion()
  unknownDomain.taxonomy.domainId = 'unknown-domain'
  assert.match(errorsFor(unknownDomain), /domain\/skill pairing/)

  const unknownSkill = cloneQuestion()
  unknownSkill.taxonomy.skillId = 'unknown-skill'
  assert.match(errorsFor(unknownSkill), /domain\/skill pairing/)
})

test('catalog rejects renderer, type, and answering-method mismatches', () => {
  const renderer = cloneQuestion()
  renderer.renderer = 'grid-in'
  assert.match(errorsFor(renderer), /requires renderer multiple-choice/)

  const method = cloneQuestion()
  method.taxonomy.answeringMethodId = 'enter-answer'
  assert.match(errorsFor(method), /requires answering method select-option/)

  const unsupportedType = cloneQuestion()
  unsupportedType.taxonomy.questionTypeId = 'free-response'
  unsupportedType.taxonomy.answeringMethodId = 'write-response'
  unsupportedType.renderer = 'free-response'
  unsupportedType.answer = { kind: 'free-response', grading: 'manual' }
  assert.match(errorsFor(unsupportedType), /does not support question type free-response/)
})

test('catalog validates selected-response options and correct answers', () => {
  const missingOptions = cloneQuestion()
  missingOptions.answer.options = []
  assert.match(errorsFor(missingOptions), /at least two options/)

  const duplicateOption = cloneQuestion()
  duplicateOption.answer.options[1].id = duplicateOption.answer.options[0].id
  assert.match(errorsFor(duplicateOption), /duplicate option id/)

  const missingCorrectOption = cloneQuestion()
  missingCorrectOption.answer.correctOptionId = 'missing'
  assert.match(errorsFor(missingCorrectOption), /reference an existing option/)
})

test('catalog requires accepted answers for student-produced responses', () => {
  const response = cloneQuestion(canonicalQuestions.find((question) => question.answer.kind === 'student-produced-response'))
  response.answer.acceptedAnswers = []
  assert.match(errorsFor(response), /non-empty acceptedAnswers/)

  const wrongMatching = cloneQuestion(canonicalQuestions.find((question) => question.answer.kind === 'student-produced-response'))
  wrongMatching.answer.matching = 'fuzzy'
  assert.match(errorsFor(wrongMatching), /matching must be exact-trimmed/)
})

test('catalog rejects missing explanations, malformed metadata, and tags', () => {
  const missingExplanation = cloneQuestion()
  missingExplanation.explanation = ''
  assert.match(errorsFor(missingExplanation), /explanation is required/)

  const revision = cloneQuestion()
  revision.content.revision = 0
  assert.match(errorsFor(revision), /positive integer/)

  const version = cloneQuestion()
  version.content.version = 2
  assert.match(errorsFor(version), /content.version/)

  const status = cloneQuestion()
  status.content.status = 'live'
  assert.match(errorsFor(status), /unsupported content status/)

  const tags = cloneQuestion()
  tags.tags = ['Valid Tag']
  assert.match(errorsFor(tags), /lowercase kebab-case/)
})

test('source validation distinguishes all supported provenance kinds', () => {
  const variants = {
    official: { kind: 'official', name: 'Exam provider', externalId: 'official-1', license: null },
    editorial: { kind: 'editorial', name: 'Study Website', externalId: null, license: null },
    'ai-generated': { kind: 'ai-generated', name: 'Study Website', externalId: null, license: null },
    'third-party': {
      kind: 'third-party', name: 'Licensed publisher', externalId: 'licensed-1', license: { name: 'Content license' },
    },
  }
  assert.deepEqual(Object.keys(variants), SOURCE_KINDS)
  for (const source of Object.values(variants)) {
    const question = cloneQuestion()
    question.source = source
    assert.equal(validateCanonicalQuestion(question).valid, true, source.kind)
  }

  const unsupported = cloneQuestion()
  unsupported.source.kind = 'scraped'
  assert.match(errorsFor(unsupported), /unsupported source kind/)

  const missingSourceName = cloneQuestion()
  missingSourceName.source.name = ''
  assert.match(errorsFor(missingSourceName), /source.name is required/)

  const incompleteOfficial = cloneQuestion()
  incompleteOfficial.source = { kind: 'official', name: 'Exam provider', externalId: null, license: null }
  assert.match(errorsFor(incompleteOfficial), /official sources require an externalId/)

  const unlicensedThirdParty = cloneQuestion()
  unlicensedThirdParty.source = { kind: 'third-party', name: 'Publisher', externalId: 'q1', license: null }
  assert.match(errorsFor(unlicensedThirdParty), /license metadata/)
})

test('catalog rejects duplicate external IDs within a source namespace', () => {
  const first = cloneQuestion(canonicalQuestions[0])
  const second = cloneQuestion(canonicalQuestions[1])
  first.source = { kind: 'official', name: 'Exam provider', externalId: 'question-1', license: null }
  second.source = { kind: 'official', name: 'Exam provider', externalId: 'question-1', license: null }
  const result = validateQuestionCatalog([first, second])
  assert.equal(result.valid, false)
  assert.match(result.errors.join('\n'), /duplicate external source id/)
})

test('catalog assertion fails loudly for invalid content', () => {
  const invalid = cloneQuestion()
  invalid.answer = null
  assert.throws(() => assertValidQuestionCatalog([invalid]), /Question catalog validation failed/)
})

test('coverage is deterministic and reports all current catalog gaps', () => {
  const coverage = createCatalogCoverage(canonicalQuestions, { minimumPerSkill: 5 })
  assert.equal(coverage.totalQuestions, 11)
  assert.deepEqual(coverage.exams, [{ id: 'sat', count: 11 }])
  assert.deepEqual(coverage.subjects, [{ id: 'sat:sat-math', count: 11 }])
  assert.deepEqual(coverage.domains, [
    { id: 'sat:sat-math:advanced-math', count: 1 },
    { id: 'sat:sat-math:algebra', count: 3 },
    { id: 'sat:sat-math:geometry-trigonometry', count: 4 },
    { id: 'sat:sat-math:problem-solving-data-analysis', count: 3 },
  ])
  assert.deepEqual(coverage.questionTypes, [
    { id: 'multiple-choice', count: 9 },
    { id: 'student-produced-response', count: 2 },
  ])
  assert.deepEqual(coverage.sourceKinds, [{ id: 'ai-generated', count: 11 }])
  assert.equal(coverage.skills.length, 20)
  assert.equal(coverage.zeroCoverageSkills.length, 14)
  assert.equal(coverage.belowMinimumSkills.length, 20)
  assert.match(formatCatalogCoverage(coverage), /Skills with zero questions \(14\)/)
  assert.equal(
    formatCatalogCoverage(coverage),
    formatCatalogCoverage(createCatalogCoverage(canonicalQuestions, { minimumPerSkill: 5 })),
  )
})
