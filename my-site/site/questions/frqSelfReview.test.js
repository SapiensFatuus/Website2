import test from 'node:test'
import assert from 'node:assert/strict'
import { createFrqSelfReview, getRubricPoints } from './frqSelfReview.js'

const rubric = {
  maxPoints: 3,
  parts: [
    { id: 'part-a', points: [{ id: 'a-calc', criterion: 'Calculate Q.', acceptableEvidence: 'Shows Q = 0.32.' }] },
    { id: 'part-b', points: [
      { id: 'b-direction', criterion: 'State the direction.', acceptableEvidence: 'Toward products.' },
      { id: 'b-reason', criterion: 'Justify with Q and K.', acceptableEvidence: 'Q is less than K.' },
    ] },
  ],
}

test('FRQ self-review flattens point-level rubrics without losing part ownership', () => {
  assert.deepEqual(getRubricPoints(rubric).map(({ id, partId }) => ({ id, partId })), [
    { id: 'a-calc', partId: 'part-a' },
    { id: 'b-direction', partId: 'part-b' },
    { id: 'b-reason', partId: 'part-b' },
  ])
})

test('FRQ self-review counts only unique known point IDs and prioritizes missed criteria', () => {
  const result = createFrqSelfReview(rubric, ['a-calc', 'a-calc', 'not-a-point'])
  assert.equal(result.earnedPoints, 1)
  assert.equal(result.maxPoints, 3)
  assert.deepEqual(result.earnedPointIds, ['a-calc'])
  assert.deepEqual(result.missedPointIds, ['b-direction', 'b-reason'])
  assert.match(result.message, /State the direction/)
  assert.match(result.disclaimer, /not automated scoring or an official AP score/)
})

test('a complete FRQ self-review gives a bounded success message without predicting a score', () => {
  const result = createFrqSelfReview(rubric, ['a-calc', 'b-direction', 'b-reason'])
  assert.equal(result.earnedPoints, 3)
  assert.deepEqual(result.missedPointIds, [])
  assert.match(result.message, /every draft rubric point/)
  assert.doesNotMatch(result.message, /AP score of|predicted AP score/i)
})
