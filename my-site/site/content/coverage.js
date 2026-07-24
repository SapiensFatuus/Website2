import { getSubject } from '../taxonomy/contentTaxonomy.js'

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1)
}

function rows(map) {
  return [...map].sort(([left], [right]) => left.localeCompare(right)).map(([id, count]) => ({ id, count }))
}

export function createEditorialCoverage(resources, { subjectId = 'ap-chemistry' } = {}) {
  const subject = getSubject(subjectId)
  if (!subject) throw new TypeError(`Unknown subject: ${subjectId}`)
  const subjectResources = resources.filter((resource) => resource.alignment.subjectId === subjectId)
  const counts = {
    kinds: new Map(), domains: new Map(), skills: new Map(), learningObjectives: new Map(),
    sciencePractices: new Map(), provenanceKinds: new Map(), reviewStatuses: new Map(),
  }

  subjectResources.forEach((resource) => {
    increment(counts.kinds, resource.kind)
    increment(counts.domains, resource.alignment.domainId)
    resource.alignment.skillIds.forEach((id) => increment(counts.skills, id))
    resource.alignment.learningObjectiveIds.forEach((id) => increment(counts.learningObjectives, id))
    resource.alignment.sciencePracticeIds.forEach((id) => increment(counts.sciencePractices, id))
    increment(counts.provenanceKinds, resource.provenance.kind)
    increment(counts.reviewStatuses, resource.review.status)
  })

  const topicCoverage = subject.domains.flatMap((domain) => domain.skills.map((skill) => ({
    id: skill.id,
    domainId: domain.id,
    officialNumber: skill.officialNumber,
    count: counts.skills.get(skill.id) || 0,
  })))
  const domainCoverage = subject.domains.map((domain) => {
    const domainResources = subjectResources.filter((resource) => resource.alignment.domainId === domain.id)
    const topicRows = topicCoverage.filter((topic) => topic.domainId === domain.id)
    return Object.freeze({
      id: domain.id,
      officialNumber: domain.officialNumber,
      resourceCount: domainResources.length,
      lessonCount: domainResources.filter(({ kind }) => kind === 'lesson').length,
      formulaCount: domainResources.filter(({ kind }) => kind === 'formula').length,
      stimulusCount: domainResources.filter(({ kind }) => kind === 'stimulus').length,
      rubricCount: domainResources.filter(({ kind }) => kind === 'rubric').length,
      coveredTopicCount: topicRows.filter(({ count }) => count > 0).length,
      topicCount: topicRows.length,
    })
  })

  return Object.freeze({
    totalResources: subjectResources.length,
    subjectId,
    kinds: rows(counts.kinds),
    domains: rows(counts.domains),
    topics: topicCoverage,
    learningObjectives: rows(counts.learningObjectives),
    sciencePractices: rows(counts.sciencePractices),
    provenanceKinds: rows(counts.provenanceKinds),
    reviewStatuses: rows(counts.reviewStatuses),
    domainCoverage: Object.freeze(domainCoverage),
    zeroCoverageTopics: topicCoverage.filter(({ count }) => count === 0),
  })
}

export function formatEditorialCoverage(coverage) {
  const section = (label, values) => [label, ...values.map(({ id, count }) => `  ${id}: ${count}`)].join('\n')
  return [
    'Editorial resource coverage',
    `Total resources: ${coverage.totalResources}`,
    section('By resource kind', coverage.kinds),
    section('By review status', coverage.reviewStatuses),
    section('By provenance', coverage.provenanceKinds),
    section('By unit', coverage.domains),
    'Unit readiness (resources; lessons; formulas; stimuli; rubrics; covered topics)',
    ...coverage.domainCoverage.map((domain) => (
      `  Unit ${domain.officialNumber} ${domain.id}: ${domain.resourceCount}; ${domain.lessonCount}; ${domain.formulaCount}; ${domain.stimulusCount}; ${domain.rubricCount}; ${domain.coveredTopicCount}/${domain.topicCount}`
    )),
    section('By learning objective', coverage.learningObjectives),
    section('By science practice', coverage.sciencePractices),
    `Topics with zero resources (${coverage.zeroCoverageTopics.length})`,
    ...coverage.zeroCoverageTopics.map(({ domainId, id }) => `  ${domainId}:${id}`),
  ].join('\n\n')
}
