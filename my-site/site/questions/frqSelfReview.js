export function getRubricPoints(rubric) {
  return (rubric?.parts || []).flatMap((part) => (
    (part.points || []).map((point) => ({
      ...point,
      partId: part.id,
    }))
  ))
}

export function createFrqSelfReview(rubric, selectedPointIds = []) {
  const points = getRubricPoints(rubric)
  const knownIds = new Set(points.map(({ id }) => id))
  const earnedIds = [...new Set(selectedPointIds)].filter((id) => knownIds.has(id))
  const earnedSet = new Set(earnedIds)
  const missedPoints = points.filter(({ id }) => !earnedSet.has(id))
  const maxPoints = rubric?.maxPoints ?? points.length
  const earnedPoints = earnedIds.length

  let message = 'Use the acceptable evidence below to decide which specific idea to revise first.'
  if (earnedPoints === maxPoints && maxPoints > 0) {
    message = 'Your self-check found evidence for every draft rubric point. Compare wording and units once more before moving on.'
  } else if (earnedPoints > 0) {
    message = `Focus next on: ${missedPoints.slice(0, 2).map(({ criterion }) => criterion).join(' ')}`
  }

  return Object.freeze({
    earnedPointIds: Object.freeze(earnedIds),
    earnedPoints,
    maxPoints,
    missedPointIds: Object.freeze(missedPoints.map(({ id }) => id)),
    message,
    disclaimer: 'Student self-check only — this is not automated scoring or an official AP score.',
  })
}
