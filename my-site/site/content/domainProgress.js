function safeCount(value) {
  return Number.isInteger(value) && value >= 0 ? value : 0
}

function safePercent(value, fallback = 0) {
  return Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value) : fallback
}

export function classifyProgressSnapshot(snapshot) {
  const attemptCount = safeCount(snapshot?.attemptCount)
  const correctCount = Math.min(attemptCount, safeCount(snapshot?.correctCount))
  const overallAccuracyPercent = attemptCount ? Math.round((correctCount / attemptCount) * 100) : 0
  const recentAccuracyPercent = safePercent(snapshot?.recentAccuracyPercent, overallAccuracyPercent)

  if (!attemptCount) return Object.freeze({ status: 'not-started', label: 'Not started', attemptCount, correctCount, overallAccuracyPercent, recentAccuracyPercent })
  if (attemptCount < 3) return Object.freeze({ status: 'early-data', label: 'Early data', attemptCount, correctCount, overallAccuracyPercent, recentAccuracyPercent })
  if (recentAccuracyPercent >= 80) return Object.freeze({ status: 'strong', label: 'Strong recent work', attemptCount, correctCount, overallAccuracyPercent, recentAccuracyPercent })
  if (recentAccuracyPercent >= 60) return Object.freeze({ status: 'developing', label: 'Developing', attemptCount, correctCount, overallAccuracyPercent, recentAccuracyPercent })
  return Object.freeze({ status: 'review', label: 'Review recommended', attemptCount, correctCount, overallAccuracyPercent, recentAccuracyPercent })
}

export function createDomainProgressSummary({ domain, snapshotsBySkillId = {} }) {
  const skills = (domain?.skills || []).map((skill) => ({
    skill,
    progress: classifyProgressSnapshot(snapshotsBySkillId[skill.id]),
  }))
  const practiced = skills.filter(({ progress }) => progress.attemptCount > 0)
  const coveragePercent = skills.length ? Math.round((practiced.length / skills.length) * 100) : 0
  const weakestPracticed = [...practiced].sort((left, right) => (
    left.progress.recentAccuracyPercent - right.progress.recentAccuracyPercent
    || left.progress.attemptCount - right.progress.attemptCount
    || left.skill.order - right.skill.order
  ))[0] || null
  const firstUnpracticed = skills.find(({ progress }) => progress.status === 'not-started') || null
  const recommended = weakestPracticed?.progress.status === 'review'
    ? weakestPracticed
    : firstUnpracticed || weakestPracticed

  return Object.freeze({
    domainId: domain?.id || null,
    skillCount: skills.length,
    practicedSkillCount: practiced.length,
    coveragePercent,
    skills: Object.freeze(skills),
    recommendedSkillId: recommended?.skill.id || null,
    recommendationReason: recommended
      ? recommended.progress.status === 'not-started'
        ? 'Build coverage by starting the next unpracticed topic.'
        : recommended.progress.status === 'review'
          ? 'Recent accuracy suggests reviewing this topic before reassessment.'
          : 'Continue this topic to collect enough evidence for a stable progress signal.'
      : 'No next topic is available.',
  })
}
