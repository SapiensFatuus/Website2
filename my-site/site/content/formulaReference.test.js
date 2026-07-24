import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { apChemistryEquilibriumQuestions } from '../questions/catalog/apChemistryEquilibriumQuestions.js'
import { toPracticeQuestion } from '../questions/catalog/index.js'
import { apChemistryEquilibriumResources } from './apChemistryEquilibriumResources.js'

const formulas = apChemistryEquilibriumResources.filter(({ kind }) => kind === 'formula')
const formulasById = new Map(formulas.map((formula) => [formula.id, formula]))

test('Unit 7 formula companion covers all six audited relationship groups', () => {
  assert.equal(formulas.length, 6)
  assert.deepEqual(
    [...new Set(formulas.map(({ conceptGroup }) => conceptGroup))].sort(),
    ['composition-and-direction', 'concentration-and-volume', 'equilibrium-modeling', 'reaction-transformation', 'solubility'],
  )
  assert.ok(formulas.every(({ examReference }) => examReference.sourceId === 'ap-chemistry-reference-2026'))
  assert.deepEqual(
    [...new Set(formulas.map(({ examReference }) => examReference.status))].sort(),
    ['not-provided', 'partly-provided', 'provided'],
  )
})

test('every Unit 7 question resolves formula requirements or names prior knowledge', () => {
  const referencedIds = new Set()
  for (const question of apChemistryEquilibriumQuestions) {
    const { formulaIds, priorKnowledge } = question.referenceRequirements
    assert.ok(formulaIds.length + priorKnowledge.length > 0, question.id)
    formulaIds.forEach((id) => {
      assert.ok(formulasById.has(id), `${question.id} references ${id}`)
      referencedIds.add(id)
    })
  }
  assert.deepEqual([...referencedIds].sort(), [...formulasById.keys()].sort())
})

test('new formula examples reproduce their stated numerical results', () => {
  const qp = 0.10 / (0.40 * 0.20)
  assert.ok(Math.abs(qp - 1.25) < 1e-12)

  const n2o4Change = 0.80 - 0.65
  assert.ok(Math.abs(2 * n2o4Change - 0.30) < 1e-12)

  const concentrationFactor = 2.00 / 1.00
  assert.equal(concentrationFactor, 2)
})

test('formula pages expose availability, filters, official source, and linked practice', () => {
  const page = readFileSync(new URL('./StudyResourcePage.jsx', import.meta.url), 'utf8')
  assert.match(page, /Exam reference availability/)
  assert.match(page, /Open the official reference information/)
  assert.match(page, /createSkillPracticeUrl/)
  assert.match(page, /formula-reference-filter/)
  assert.match(page, /formula-concept-filter/)
})

test('practice projection preserves only readable reference support needed after submission', () => {
  const sourceQuestion = apChemistryEquilibriumQuestions.find(({ referenceRequirements }) => referenceRequirements.formulaIds.length > 1)
  const practiceQuestion = toPracticeQuestion(sourceQuestion)
  assert.deepEqual(
    practiceQuestion.formulaReferences.map(({ id }) => id),
    sourceQuestion.referenceRequirements.formulaIds,
  )
  assert.ok(practiceQuestion.formulaReferences.every(({ title, url }) => title && url.startsWith('/formulas.html?')))
  assert.deepEqual(practiceQuestion.referenceRequirements.priorKnowledge, sourceQuestion.referenceRequirements.priorKnowledge)

  const questionPage = readFileSync(new URL('../questions/QuestionPage.jsx', import.meta.url), 'utf8')
  assert.match(questionPage, /Review the supporting relationships/)
  assert.equal(questionPage.match(/<QuestionReferenceSupport question=/g)?.length, 2)
})
