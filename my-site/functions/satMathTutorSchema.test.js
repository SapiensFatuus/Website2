import test from 'node:test'
import assert from 'node:assert/strict'
import { TutorInputSchema } from './satMathTutor.js'

const baseTarget = { examId: 'sat', subjectId: 'sat-math', domainId: 'algebra' }

test('the callable input schema accepts both registry-backed skills through one contract', () => {
  for (const skillId of ['linear-equations-one-variable', 'linear-functions']) {
    const parsed = TutorInputSchema.safeParse({
      target: { ...baseTarget, skillId },
      message: 'Help me with this skill.',
      history: [],
    })
    assert.equal(parsed.success, true)
  }
})
