import {
  createSkillBrowserUrl,
  createSkillChatUrl,
  createSkillPracticeUrl,
  exams,
} from '../taxonomy/contentTaxonomy.js'
import { getPublishedQuestionCount } from '../questions/catalog/index.js'

export const MAX_SKILL_SEARCH_LENGTH = 100

export function sanitizeSkillSearchQuery(value) {
  if (typeof value !== 'string') return ''
  return [...value]
    .filter((character) => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127)
    .join('')
    .slice(0, MAX_SKILL_SEARCH_LENGTH)
}

export function normalizeSearchText(value) {
  return sanitizeSkillSearchQuery(String(value ?? ''))
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function matchesTokens(value, tokens) {
  return tokens.every((token) => value.includes(token))
}

function normalizedList(values = []) {
  return values.map(normalizeSearchText).filter(Boolean)
}

function scoreEntry(entry, query) {
  const tokens = query.split(' ')
  if (entry.searchLabel === query) return 0
  if (entry.searchAliases.includes(query)) return 1
  if (entry.searchLabel.startsWith(query)) return 2
  if (entry.searchLabel.includes(query) || matchesTokens(entry.searchLabel, tokens)) return 3
  if (
    entry.searchAliases.some((alias) => alias.includes(query) || matchesTokens(alias, tokens))
    || entry.searchTags.some((tag) => tag.includes(query) || matchesTokens(tag, tokens))
    || entry.searchIdentifiers.some((value) => value.includes(query) || matchesTokens(value, tokens))
    || entry.searchContext.some((value) => value === query || value.startsWith(query) || matchesTokens(value, tokens))
  ) return 4
  if (entry.searchDescriptions.some((description) => description.includes(query) || matchesTokens(description, tokens))) return 5
  return null
}

function compareSortOrder(left, right) {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index]
  }
  return 0
}

export function createSkillSearchIndex(examCatalog = exams) {
  const entries = []
  examCatalog.forEach((exam, examIndex) => {
    exam.subjects.forEach((subject, subjectIndex) => {
      subject.domains.forEach((domain) => {
        domain.skills.forEach((skill) => {
          const target = {
            examId: exam.id,
            subjectId: subject.id,
            domainId: domain.id,
            skillId: skill.id,
          }
          const questionCount = getPublishedQuestionCount(target)
          entries.push(Object.freeze({
            ...target,
            examLabel: exam.label,
            subjectLabel: subject.label,
            domainLabel: domain.label,
            domainDescription: domain.description,
            domainOrder: domain.order,
            skillLabel: skill.label,
            skillDescription: skill.description,
            skillOrder: skill.order,
            aliases: Object.freeze([...(skill.search?.aliases || [])]),
            tags: Object.freeze([...(skill.search?.tags || [])]),
            practiceQuestionCount: questionCount,
            practiceAvailable: questionCount > 0,
            tutorAvailable: Boolean(skill.tutor),
            browserUrl: createSkillBrowserUrl(subject.id, skill.id),
            practiceUrl: createSkillPracticeUrl(subject.id, skill.id),
            tutorUrl: createSkillChatUrl(subject.id, skill.id),
            sortOrder: [examIndex, subjectIndex, domain.order, skill.order],
            searchLabel: normalizeSearchText(skill.label),
            searchAliases: normalizedList(skill.search?.aliases),
            searchTags: normalizedList(skill.search?.tags),
            searchIdentifiers: normalizedList([exam.id, subject.id, domain.id, skill.id]),
            searchContext: normalizedList([exam.label, subject.label, domain.label]),
            searchDescriptions: normalizedList([domain.description, skill.description]),
          }))
        })
      })
    })
  })
  return Object.freeze(entries)
}

export const skillSearchIndex = createSkillSearchIndex()

export function getSkillCatalogEntry(subjectId, skillId, index = skillSearchIndex) {
  return index.find((entry) => entry.subjectId === subjectId && entry.skillId === skillId) || null
}

export function searchSkills(query, { subjectId = null, index = skillSearchIndex } = {}) {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return []

  return index
    .filter((entry) => !subjectId || entry.subjectId === subjectId)
    .map((entry) => ({ entry, score: scoreEntry(entry, normalizedQuery) }))
    .filter((result) => result.score !== null)
    .sort((left, right) => (
      left.score - right.score
      || compareSortOrder(left.entry.sortOrder, right.entry.sortOrder)
      || left.entry.skillLabel.localeCompare(right.entry.skillLabel)
      || left.entry.skillId.localeCompare(right.entry.skillId)
    ))
    .map(({ entry, score }) => ({ ...entry, score }))
}

export function withSkillSearchQuery(url, query) {
  if (!url) return null
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}q=${encodeURIComponent(sanitizeSkillSearchQuery(query).trim())}`
}
