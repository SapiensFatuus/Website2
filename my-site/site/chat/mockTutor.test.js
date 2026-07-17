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
