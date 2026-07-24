import test from 'node:test'
import assert from 'node:assert/strict'
import { createReassessmentReadiness, DEFAULT_REASSESSMENT_DELAY_HOURS } from './reassessmentReadiness.js'

const HOUR = 60 * 60 * 1000
const START = Date.parse('2026-07-20T12:00:00.000Z')

test('reassessment readiness requires recorded practice evidence', () => {
  assert.deepEqual(createReassessmentReadiness({ snapshotsBySkillId: {}, now: START }), {
    status: 'no-evidence', latestPracticedAt: null, eligibleAt: null, remainingHours: null,
  })
})

test('reassessment readiness waits 48 hours after the latest practice across topics', () => {
  const snapshotsBySkillId = {
    first: { lastPracticedAt: new Date(START - 10 * HOUR) },
    second: { lastPracticedAt: { toMillis: () => START } },
  }
  const readiness = createReassessmentReadiness({ snapshotsBySkillId, now: START + 47.25 * HOUR })
  assert.equal(DEFAULT_REASSESSMENT_DELAY_HOURS, 48)
  assert.equal(readiness.status, 'waiting')
  assert.equal(readiness.latestPracticedAt, START)
  assert.equal(readiness.eligibleAt, START + 48 * HOUR)
  assert.equal(readiness.remainingHours, 1)
})

test('reassessment readiness becomes eligible without claiming retention', () => {
  const readiness = createReassessmentReadiness({
    snapshotsBySkillId: { topic: { lastPracticedAt: { toDate: () => new Date(START) } } },
    now: START + 72 * HOUR,
  })
  assert.equal(readiness.status, 'ready')
  assert.equal(readiness.remainingHours, 0)
})

test('reassessment readiness rejects nonsensical scheduling inputs', () => {
  assert.throws(() => createReassessmentReadiness({ now: Number.NaN }), /finite timestamp/)
  assert.throws(() => createReassessmentReadiness({ delayHours: 0 }), /greater than zero/)
})
