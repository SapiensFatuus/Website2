import test from 'node:test'
import assert from 'node:assert/strict'
import { getDomain } from '../taxonomy/contentTaxonomy.js'
import { apChemistryAcidsBasesResources } from './apChemistryAcidsBasesResources.js'
import { apChemistryAcidsBasesMisconceptions } from './apChemistryAcidsBasesMisconceptions.js'
import { apChemistryAcidsBasesQuestions } from '../questions/catalog/apChemistryAcidsBasesQuestions.js'
import { validateContentBundle } from './contentBundle.js'
import { getEditorialResource, getEditorialResourcesForDomain } from './resourceCatalog.js'
import { createResourceUrl, resolveResourceRoute } from './resourceRoutes.js'

test('Unit 8 starter resources are original unreviewed drafts covering every canonical topic', () => {
  const formulas = apChemistryAcidsBasesResources.filter(({ kind }) => kind === 'formula')
  const lessons = apChemistryAcidsBasesResources.filter(({ kind }) => kind === 'lesson')
  const stimuli = apChemistryAcidsBasesResources.filter(({ kind }) => kind === 'stimulus')
  const rubrics = apChemistryAcidsBasesResources.filter(({ kind }) => kind === 'rubric')
  assert.equal(formulas.length, 6)
  assert.equal(lessons.length, 5)
  assert.equal(stimuli.length, 5)
  assert.equal(rubrics.length, 11)
  assert.equal(rubrics.find(({ id }) => id === 'acids-bases-measured-weak-acid-short-frq-rubric').maxPoints, 4)
  assert.equal(rubrics.find(({ id }) => id === 'acids-bases-ph-solubility-short-frq-rubric').maxPoints, 3)
  assert.equal(rubrics.find(({ id }) => id === 'acids-bases-strong-neutralization-short-frq-rubric').maxPoints, 3)
  assert.equal(rubrics.find(({ id }) => id === 'acids-bases-buffer-capacity-experiment-short-frq-rubric').maxPoints, 4)
  assert.equal(rubrics.find(({ id }) => id === 'acids-bases-weak-base-equilibrium-short-frq-rubric').maxPoints, 4)
  assert.equal(rubrics.find(({ id }) => id === 'acids-bases-oxoacid-structure-short-frq-rubric').maxPoints, 3)
  assert.equal(rubrics.find(({ id }) => id === 'acids-bases-titration-data-short-frq-rubric').maxPoints, 5)
  assert.equal(rubrics.find(({ id }) => id === 'acids-bases-buffer-design-long-frq-rubric').maxPoints, 7)
  assert.equal(rubrics.find(({ id }) => id === 'acids-bases-unknown-acid-investigation-long-frq-rubric').maxPoints, 8)
  assert.equal(rubrics.find(({ id }) => id === 'acids-bases-titration-long-frq-rubric').maxPoints, 7)
  assert.ok(apChemistryAcidsBasesResources.every(({ review, provenance }) => (
    review.status === 'draft'
    && review.reviewers.length === 0
    && provenance.kind === 'ai-generated'
    && /no past-exam wording/.test(provenance.originalityNote)
  )))

  const expectedTopics = new Set(getDomain('ap-chemistry', 'acids-bases').skills.map(({ id }) => id))
  const lessonTopics = new Set(lessons.flatMap(({ alignment }) => alignment.skillIds))
  assert.deepEqual([...lessonTopics].sort(), [...expectedTopics].sort())
})

test('Unit 8 formula examples reproduce their stated numerical results', () => {
  assert.ok(Math.abs(-Math.log10(2.5e-3) - 2.60206) < 1e-5)
  assert.ok(Math.abs((1e-14 / 1.8e-5) - 5.555555555555556e-10) < 1e-20)
  assert.ok(Math.abs((4.76 + Math.log10(0.5)) - 4.45897) < 1e-5)
  assert.ok(Math.abs(((0.030 - 0.0050) / (0.020 + 0.0050)) - 1) < 1e-12)
  assert.ok(Math.abs(((0.0800 * 0.02500) / 0.100) - 0.0200) < 1e-12)
  assert.ok(Math.abs(((0.0042 / 0.100) * 100) - 4.2) < 1e-12)
})

test('Unit 8 resources use generic canonical routes and remain hidden outside preview', () => {
  const lesson = getEditorialResource('acids-bases-buffer-reasoning', { includeDrafts: true })
  const formula = getEditorialResource('acids-bases-henderson-hasselbalch', { includeDrafts: true })
  assert.equal(createResourceUrl(lesson), '/learn.html?test=ap-chemistry&unit=acids-bases&lesson=acids-bases-buffer-reasoning')
  assert.equal(createResourceUrl(formula), '/formulas.html?test=ap-chemistry&unit=acids-bases&formula=acids-bases-henderson-hasselbalch')
  assert.equal(resolveResourceRoute({ pathname: '/learn.html', search: createResourceUrl(lesson).split('?')[1] }, { includeDrafts: true }).resource.id, lesson.id)
  assert.equal(resolveResourceRoute({ pathname: '/formulas.html', search: '?test=ap-chemistry&unit=acids-bases' }, { includeDrafts: true }).status, 'index')
  assert.equal(getEditorialResourcesForDomain('ap-chemistry', 'acids-bases', { includeDrafts: true, kinds: ['formula'] }).length, 6)
  assert.equal(getEditorialResource(formula.id), null)
})

test('Unit 8 questions, resources, and misconceptions form a closed draft bundle', () => {
  assert.deepEqual(validateContentBundle({
    resources: apChemistryAcidsBasesResources,
    questions: apChemistryAcidsBasesQuestions,
    misconceptions: apChemistryAcidsBasesMisconceptions,
  }), { valid: true, errors: [] })
  assert.equal(apChemistryAcidsBasesQuestions.length, 66)
  assert.equal(apChemistryAcidsBasesQuestions.filter(({ renderer, stimulusId }) => renderer === 'multiple-choice' && !stimulusId).length, 35)
  assert.equal(apChemistryAcidsBasesQuestions.filter(({ stimulusId }) => stimulusId).length, 20)
  assert.equal(apChemistryAcidsBasesQuestions.filter(({ responseFormat }) => responseFormat === 'short-frq').length, 8)
  assert.equal(apChemistryAcidsBasesQuestions.filter(({ responseFormat }) => responseFormat === 'long-frq').length, 3)
  assert.equal(new Set(apChemistryAcidsBasesQuestions.map(({ taxonomy }) => taxonomy.skillId)).size, 11)
  assert.ok(apChemistryAcidsBasesQuestions.every(({ content, source }) => (
    content.status === 'draft'
    && content.reviewers.length === 0
    && source.kind === 'ai-generated'
  )))
})
