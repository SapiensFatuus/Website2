import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockTutorResponse } from './mockTutor.js'

const skillTarget = {
  scope: 'skill', examId: 'sat', subjectId: 'sat-math', domainId: 'algebra', skillId: 'linear-functions',
}

function ask(target, message, history = []) {
  return createMockTutorResponse({ target, message, history })
}

test('mock preserves focused skill tutoring with useful guidance', () => {
  const response = ask(skillTarget, 'How do I find the slope?')
  assert.equal(response.insufficient, false)
  assert.equal(response.effectiveTarget.skillId, 'linear-functions')
  assert.equal('sourceIds' in response, false)
  assert.match(response.answer, /verify/i)
})

test('mock automatically adjusts from one SAT Math skill to another', () => {
  const response = ask(skillTarget, 'How do I find the radius of a circle?')
  assert.equal(response.classification, 'adjusted-within-subject')
  assert.equal(response.effectiveTarget.skillId, 'circles')
  assert.match(response.scopeNotice, /Circles/)
  assert.match(response.answer, /center/i)
})

test('mock recognizes a quadratic before the generic linear-equation branch', () => {
  const response = ask({ scope: 'subject', examId: 'sat', subjectId: 'sat-math' }, 'How do I solve x^2 - 5x + 6 = 0?')
  assert.equal(response.effectiveTarget.skillId, 'nonlinear-equations-one-variable')
  assert.match(response.answer, /x=2.*x=3/i)
  assert.doesNotMatch(response.answer, /3x=15/)
})

test('generated nonlinear skill prompts stay in their selected skill', () => {
  const target = {
    scope: 'skill',
    examId: 'sat',
    subjectId: 'sat-math',
    domainId: 'advanced-math',
    skillId: 'nonlinear-equations-one-variable',
  }
  const response = ask(target, 'Teach me nonlinear equations in one variable for SAT Math. Start by checking what I already understand.')
  assert.equal(response.effectiveTarget.skillId, 'nonlinear-equations-one-variable')
  assert.match(response.answer, /what do you already know/i)
  assert.doesNotMatch(response.answer, /3x=15/)
})

test('generated skill prompts start focused tutoring automatically', () => {
  const response = ask(skillTarget, 'Teach me linear functions for SAT Math. Start by checking what I already understand, then explain the concept with a test-style example and guide me through practice.')
  assert.equal(response.effectiveTarget.skillId, 'linear-functions')
  assert.match(response.answer, /slope|already understand/i)
})

test('mock supports unit-level and whole-test tutoring', () => {
  const unit = ask({ scope: 'domain', examId: 'sat', subjectId: 'sat-math', domainId: 'algebra' }, 'Review algebra with me.')
  assert.equal(unit.insufficient, false)
  assert.equal(unit.effectiveTarget.subjectId, 'sat-math')

  const wholeTest = ask(skillTarget, 'Build a study plan for the whole test.')
  assert.equal(wholeTest.effectiveTarget.scope, 'subject')
  assert.equal(wholeTest.classification, 'broadened')
  assert.match(wholeTest.answer, /diagnostic/i)
})

test('mock supports AP Chemistry unit adjustment from whole-test scope', () => {
  const response = ask({ scope: 'subject', examId: 'ap', subjectId: 'ap-chemistry' }, 'Explain Le Chatelier and equilibrium.')
  assert.equal(response.effectiveTarget.scope, 'domain')
  assert.equal(response.effectiveTarget.domainId, 'equilibrium')
  assert.match(response.answer, /Q < K/)
})

test('mock provides useful general tutoring for tests without detailed taxonomy', () => {
  const target = { scope: 'subject', examId: 'ap', subjectId: 'ap-biology' }
  const plan = ask(target, 'Build me a study plan for the whole test.')
  assert.match(plan.answer, /AP Biology study plan/i)
  assert.match(plan.answer, /diagnostic|mistakes/i)

  const questionHelp = ask(target, 'Help me work through this question.', [
    { role: 'assistant', content: 'Share the question when ready.' },
  ])
  assert.match(questionHelp.answer, /full question|answer choices/i)
  assert.equal(questionHelp.effectiveTarget.subjectId, 'ap-biology')

  const conceptHelp = ask(target, 'How does photosynthesis store energy?')
  assert.match(conceptHelp.answer, /ATP and NADPH/i)
  assert.match(conceptHelp.answer, /chemical bonds/i)
})

test('mock answers outside-subject questions and clearly marks the boundary', () => {
  const response = ask(skillTarget, 'Explain photosynthesis.')
  assert.equal(response.insufficient, false)
  assert.equal(response.classification, 'outside-subject')
  assert.match(response.scopeNotice, /outside SAT Math/)
  assert.match(response.answer, /outside SAT Math/)
  assert.match(response.answer, /light energy/i)
})

test('mock asks a focused follow-up only when the request lacks detail', () => {
  const response = ask(skillTarget, 'Help')
  assert.equal(response.insufficient, true)
  assert.match(response.answer, /concept explanation|specific question/i)
})

test('mock rejects malformed and unsupported requests', () => {
  assert.throws(() => ask({ scope: 'subject', examId: 'sat', subjectId: 'sat-reading' }, 'Help'), /not supported/)
  assert.throws(() => createMockTutorResponse({ target: skillTarget, message: '', history: [] }), /valid message/)
})
