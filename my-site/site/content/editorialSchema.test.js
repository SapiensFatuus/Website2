import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canTransitionReviewStatus,
  validateEditorialCatalog,
  validateEditorialResource,
} from './editorialSchema.js'

const base = {
  id: 'test-resource',
  kind: 'formula',
  schemaVersion: 1,
  title: 'Test relationship',
  summary: 'An original test record.',
  alignment: {
    frameworkId: 'ap-chemistry-fall-2024',
    subjectId: 'ap-chemistry',
    domainId: 'equilibrium',
    skillIds: ['reaction-quotient-equilibrium-constant'],
    learningObjectiveIds: ['7.3.A'],
    sciencePracticeIds: ['5.B'],
  },
  review: {
    status: 'draft', revision: 1, authoredBy: 'test-author', updatedAt: '2026-07-20', reviewers: [],
    history: [{ status: 'draft', date: '2026-07-20', actor: 'test-author' }],
  },
  provenance: {
    kind: 'ai-generated', name: 'Original test fixture', sourceIds: ['ap-chemistry-ced-fall-2024'],
    originalityNote: 'Created only for schema testing.',
  },
  conceptGroup: 'composition-and-direction',
  examReference: {
    status: 'partly-provided',
    sourceId: 'ap-chemistry-reference-2026',
    note: 'The printed constant form supports, but does not fully state, this use.',
  },
  expression: 'Q = products / reactants',
  variables: [{ symbol: 'Q', meaning: 'reaction quotient', units: 'unitless under the activity convention' }],
  assumptions: ['Activities are represented consistently.'],
  appliesWhen: ['Comparing a current mixture with equilibrium.'],
  doesNotApplyWhen: ['The reaction is not specified.'],
  rearrangements: ['Use the stated reaction coefficients as exponents.'],
  workedExample: { prompt: 'Evaluate a quotient.', steps: ['Substitute the values.'], answer: 'A quotient is obtained.' },
  commonMistake: 'Including a pure solid in the expression.',
}

test('editorial resources validate canonical alignment and review metadata', () => {
  assert.deepEqual(validateEditorialResource(base), { valid: true, errors: [] })
  const invalid = structuredClone(base)
  invalid.alignment.learningObjectiveIds = ['7.9.A']
  assert.match(validateEditorialResource(invalid).errors.join(' '), /selected topics/)
})

test('published resources require two real reviewer identifiers', () => {
  const published = structuredClone(base)
  published.review.status = 'published'
  assert.match(validateEditorialResource(published).errors.join(' '), /two reviewers/)
})

test('formula resources classify concept and exam-reference availability', () => {
  const invalid = structuredClone(base)
  invalid.examReference.status = 'probably-on-sheet'
  assert.match(validateEditorialResource(invalid).errors.join(' '), /exam availability/)
  invalid.examReference.status = 'provided'
  invalid.examReference.sourceId = 'unknown-source'
  assert.match(validateEditorialResource(invalid).errors.join(' '), /source registry/)
  invalid.examReference.sourceId = 'ap-chemistry-reference-2026'
  invalid.conceptGroup = 'miscellaneous'
  assert.match(validateEditorialResource(invalid).errors.join(' '), /concept group/)

  const wrongUnit = structuredClone(base)
  wrongUnit.conceptGroup = 'electrochemistry'
  assert.match(validateEditorialResource(wrongUnit).errors.join(' '), /aligned AP Chemistry unit/)
})

test('catalog validation catches duplicates and missing formula links', () => {
  const lesson = {
    ...structuredClone(base), id: 'test-lesson', kind: 'lesson', formulaIds: ['missing-formula'],
    prerequisites: ['Concentration notation.'], sections: [{ heading: 'One', body: 'First.' }, { heading: 'Two', body: 'Second.' }],
    workedExamples: [{ prompt: 'Prompt', steps: ['Step'], answer: 'Answer' }],
    misconceptions: [{ id: 'same-rates', claim: 'Incorrect claim.', correction: 'Correction.' }],
    retrievalChecks: [{ prompt: 'Check?', answer: 'Answer.' }],
  }
  delete lesson.expression
  delete lesson.variables
  delete lesson.assumptions
  delete lesson.appliesWhen
  delete lesson.doesNotApplyWhen
  delete lesson.rearrangements
  delete lesson.commonMistake
  const result = validateEditorialCatalog([base, lesson, structuredClone(base)])
  assert.match(result.errors.join(' '), /duplicate resource id/)
  assert.match(result.errors.join(' '), /unknown formula id/)
})

test('line-graph stimuli require accessible labels and finite coordinate pairs', () => {
  const graph = {
    ...structuredClone(base),
    id: 'test-line-graph',
    kind: 'stimulus',
    context: 'A reversible system is monitored over time.',
    representation: {
      type: 'line-graph', caption: 'Concentration history', xLabel: 'Time (s)', yLabel: 'Concentration (mol/L)',
      accessibleDescription: 'The concentration rises from 0.1 molar to 0.2 molar.',
      series: [{ label: '[A]', points: [[0, 0.1], [10, 0.2]] }],
    },
  }
  assert.deepEqual(validateEditorialResource(graph), { valid: true, errors: [] })
  graph.representation.series[0].points[1] = [10, Number.NaN]
  assert.match(validateEditorialResource(graph).errors.join(' '), /numeric series points/)
  graph.representation.series[0].points[1] = [10, 0.2]
  graph.representation.accessibleDescription = ''
  assert.match(validateEditorialResource(graph).errors.join(' '), /accessible description/)
})

test('review transitions enforce the editorial workflow', () => {
  assert.equal(canTransitionReviewStatus('draft', 'in-review'), true)
  assert.equal(canTransitionReviewStatus('draft', 'published'), false)
  assert.equal(canTransitionReviewStatus('published', 'retired'), true)
})
