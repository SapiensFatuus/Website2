export const DEFAULT_REASSESSMENT_DELAY_HOURS = 48

function timestampMilliseconds(value) {
  if (Number.isFinite(value)) return value
  if (value instanceof Date) return value.getTime()
  if (value && typeof value.toMillis === 'function') return value.toMillis()
  if (value && typeof value.toDate === 'function') return value.toDate().getTime()
  return Number.NaN
}

export function createReassessmentReadiness({ snapshotsBySkillId = {}, now = Date.now(), delayHours = DEFAULT_REASSESSMENT_DELAY_HOURS } = {}) {
  if (!Number.isFinite(now)) throw new TypeError('now must be a finite timestamp')
  if (!Number.isFinite(delayHours) || delayHours <= 0 || delayHours > 24 * 30) {
    throw new TypeError('delayHours must be greater than zero and no more than 30 days')
  }
  const practicedAt = Object.values(snapshotsBySkillId || {})
    .map((snapshot) => timestampMilliseconds(snapshot?.lastPracticedAt))
    .filter(Number.isFinite)
  if (!practicedAt.length) {
    return Object.freeze({ status: 'no-evidence', latestPracticedAt: null, eligibleAt: null, remainingHours: null })
  }

  const latestPracticedAt = Math.max(...practicedAt)
  const eligibleAt = latestPracticedAt + delayHours * 60 * 60 * 1000
  if (now < eligibleAt) {
    return Object.freeze({
      status: 'waiting', latestPracticedAt, eligibleAt,
      remainingHours: Math.max(1, Math.ceil((eligibleAt - now) / (60 * 60 * 1000))),
    })
  }
  return Object.freeze({ status: 'ready', latestPracticedAt, eligibleAt, remainingHours: 0 })
}
