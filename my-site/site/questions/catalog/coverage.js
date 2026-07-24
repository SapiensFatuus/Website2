import { exams } from '../../taxonomy/contentTaxonomy.js'

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1)
}

function sortedCounts(map) {
  return [...map].sort(([left], [right]) => left.localeCompare(right)).map(([id, count]) => ({ id, count }))
}

export function createCatalogCoverage(questions, { minimumPerSkill = 5 } = {}) {
  if (!Number.isInteger(minimumPerSkill) || minimumPerSkill < 1) {
    throw new TypeError('minimumPerSkill must be a positive integer.')
  }

  const examCounts = new Map()
  const subjectCounts = new Map()
  const domainCounts = new Map()
  const skillCounts = new Map()
  const questionTypeCounts = new Map()
  const sourceKindCounts = new Map()
  const learningObjectiveCounts = new Map()
  const sciencePracticeCounts = new Map()
  const responseFormatCounts = new Map()
  const difficultyCounts = new Map()
  const reviewStatusCounts = new Map()

  for (const question of questions) {
    const taxonomy = question.taxonomy
    increment(examCounts, taxonomy.examId)
    increment(subjectCounts, `${taxonomy.examId}:${taxonomy.subjectId}`)
    increment(domainCounts, `${taxonomy.examId}:${taxonomy.subjectId}:${taxonomy.domainId}`)
    increment(skillCounts, `${taxonomy.examId}:${taxonomy.subjectId}:${taxonomy.domainId}:${taxonomy.skillId}`)
    increment(questionTypeCounts, taxonomy.questionTypeId)
    increment(sourceKindCounts, question.source.kind)
    taxonomy.learningObjectiveIds?.forEach((id) => increment(learningObjectiveCounts, id))
    taxonomy.sciencePracticeIds?.forEach((id) => increment(sciencePracticeCounts, id))
    if (question.responseFormat) increment(responseFormatCounts, question.responseFormat)
    if (question.difficulty) increment(difficultyCounts, question.difficulty)
    if (question.content?.status) increment(reviewStatusCounts, question.content.status)
  }

  const taxonomySkills = exams.flatMap((exam) => exam.subjects.flatMap((subject) => (
    subject.domains.flatMap((domain) => domain.skills.map((skill) => ({
      id: `${exam.id}:${subject.id}:${domain.id}:${skill.id}`,
      label: `${exam.label} / ${subject.label} / ${domain.label} / ${skill.label}`,
      count: skillCounts.get(`${exam.id}:${subject.id}:${domain.id}:${skill.id}`) || 0,
    })))
  )))

  return {
    totalQuestions: questions.length,
    minimumPerSkill,
    exams: sortedCounts(examCounts),
    subjects: sortedCounts(subjectCounts),
    domains: sortedCounts(domainCounts),
    skills: taxonomySkills,
    questionTypes: sortedCounts(questionTypeCounts),
    sourceKinds: sortedCounts(sourceKindCounts),
    learningObjectives: sortedCounts(learningObjectiveCounts),
    sciencePractices: sortedCounts(sciencePracticeCounts),
    responseFormats: sortedCounts(responseFormatCounts),
    difficulties: sortedCounts(difficultyCounts),
    reviewStatuses: sortedCounts(reviewStatusCounts),
    zeroCoverageSkills: taxonomySkills.filter((skill) => skill.count === 0),
    belowMinimumSkills: taxonomySkills.filter((skill) => skill.count < minimumPerSkill),
  }
}

function formatCountSection(title, rows) {
  return [title, ...rows.map((row) => `  ${row.id}: ${row.count}`)].join('\n')
}

export function formatCatalogCoverage(coverage) {
  const zeroCoverage = coverage.zeroCoverageSkills.length
    ? coverage.zeroCoverageSkills.map((skill) => `  ${skill.id}`).join('\n')
    : '  (none)'
  const belowMinimum = coverage.belowMinimumSkills.length
    ? coverage.belowMinimumSkills.map((skill) => `  ${skill.id}: ${skill.count}`).join('\n')
    : '  (none)'

  return [
    'Question catalog coverage',
    `Total questions: ${coverage.totalQuestions}`,
    `Minimum questions per skill: ${coverage.minimumPerSkill}`,
    '',
    formatCountSection('By exam', coverage.exams),
    '',
    formatCountSection('By subject', coverage.subjects),
    '',
    formatCountSection('By domain', coverage.domains),
    '',
    formatCountSection('By skill', coverage.skills),
    '',
    formatCountSection('By question type', coverage.questionTypes),
    '',
    formatCountSection('By source kind', coverage.sourceKinds),
    '',
    formatCountSection('By learning objective', coverage.learningObjectives),
    '',
    formatCountSection('By science practice', coverage.sciencePractices),
    '',
    formatCountSection('By response format', coverage.responseFormats),
    '',
    formatCountSection('By difficulty', coverage.difficulties),
    '',
    formatCountSection('By review status', coverage.reviewStatuses),
    '',
    `Skills with zero questions (${coverage.zeroCoverageSkills.length})`,
    zeroCoverage,
    '',
    `Skills below minimum (${coverage.belowMinimumSkills.length})`,
    belowMinimum,
  ].join('\n')
}
