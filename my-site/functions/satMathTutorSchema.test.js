import test from 'node:test'
import assert from 'node:assert/strict'
import { TutorInputSchema } from './satMathTutor.js'

const baseTarget = { examId: 'sat', subjectId: 'sat-math', domainId: 'algebra' }

test('the callable input schema accepts skill, unit, and whole-test targets', () => {
  for (const skillId of ['linear-equations-one-variable', 'linear-functions']) {
    const parsed = TutorInputSchema.safeParse({
      target: { ...baseTarget, skillId },
      message: 'Help me with this skill.',
      history: [],
    })
    assert.equal(parsed.success, true)
  }
  for (const target of [
    { scope: 'domain', ...baseTarget },
    { scope: 'subject', examId: 'sat', subjectId: 'sat-math' },
    { scope: 'subject', examId: 'ap', subjectId: 'ap-chemistry' },
    { scope: 'subject', examId: 'ap', subjectId: 'ap-biology' },
  ]) {
    const parsed = TutorInputSchema.safeParse({ target, message: 'Help me study.', history: [] })
    assert.equal(parsed.success, true)
  }
})
