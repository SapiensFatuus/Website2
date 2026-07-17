import test from 'node:test'
import assert from 'node:assert/strict'
import {
  claimOpeningPrompt,
  createInitialTutorPrompt,
  createOpeningPromptKey,
  createDomainTutorUrl,
  createSubjectTutorUrl,
  createTutorChatUrl,
  getTutorUiScopeDetails,
  resolveTutorUiTarget,
} from './tutorScopes.js'

test('UI scope resolver supports SAT Math skill, unit, and whole-test targets', () => {
  const skill = resolveTutorUiTarget({ examId: 'sat', subjectId: 'sat-math', scope: 'skill', domainId: 'algebra', skillId: 'linear-functions' })
  assert.equal(getTutorUiScopeDetails(skill).label, 'Linear functions')
  assert.equal(resolveTutorUiTarget({ examId: 'sat', subjectId: 'sat-math', scope: 'domain', domainId: 'algebra' }).scope, 'domain')
  assert.equal(resolveTutorUiTarget({ examId: 'sat', subjectId: 'sat-math', scope: 'subject' }).scope, 'subject')
})

test('UI scope resolver supports AP Chemistry whole-test and unit targets', () => {
  const subjectUrl = createSubjectTutorUrl('ap-chemistry')
  assert.equal(subjectUrl, '/chat.html?exam=ap&test=ap-chemistry')
  const equilibrium = resolveTutorUiTarget({ examId: 'ap', subjectId: 'ap-chemistry', scope: 'domain', domainId: 'equilibrium' })
  assert.equal(getTutorUiScopeDetails(equilibrium).label, 'Equilibrium')
})

test('tutor URLs use test, unit, and skill terminology without exposing scope', () => {
  assert.equal(createSubjectTutorUrl('sat-math'), '/chat.html?exam=sat&test=sat-math')
  assert.equal(createDomainTutorUrl('sat-math', 'algebra'), '/chat.html?exam=sat&test=sat-math&unit=algebra')
  assert.equal(
    createTutorChatUrl({ scope: 'skill', examId: 'sat', subjectId: 'sat-math', domainId: 'algebra', skillId: 'linear-functions' }),
    '/chat.html?exam=sat&test=sat-math&unit=algebra&skill=linear-functions',
  )
})

test('focused entry points generate canonical unit and skill opening prompts', () => {
  const unit = resolveTutorUiTarget({ examId: 'sat', subjectId: 'sat-math', domainId: 'algebra' })
  const skill = resolveTutorUiTarget({ examId: 'sat', subjectId: 'sat-math', domainId: 'algebra', skillId: 'linear-functions' })
  assert.match(createInitialTutorPrompt(unit), /review the Algebra unit for SAT Math/i)
  assert.match(createInitialTutorPrompt(skill), /Teach me linear functions for SAT Math/i)
  assert.equal(createInitialTutorPrompt({ examId: 'sat', subjectId: 'sat-math', scope: 'subject' }), null)
})

test('an opening prompt key can only be claimed once', () => {
  const target = resolveTutorUiTarget({ examId: 'sat', subjectId: 'sat-math', domainId: 'algebra', skillId: 'linear-functions' })
  const key = createOpeningPromptKey(target)
  const seen = new Set()
  assert.equal(claimOpeningPrompt(seen, key), true)
  assert.equal(claimOpeningPrompt(seen, key), false)
})

test('invalid cross-domain and unsupported targets fail safely', () => {
  assert.equal(resolveTutorUiTarget({ examId: 'sat', subjectId: 'sat-math', scope: 'skill', domainId: 'algebra', skillId: 'circles' }), null)
  assert.equal(resolveTutorUiTarget({ examId: 'ap', subjectId: 'ap-biology', scope: 'subject' }), null)
})
