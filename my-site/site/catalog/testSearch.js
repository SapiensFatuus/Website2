import { normalizeSearchText } from './skillSearch.js'

export function searchTests(tests, query) {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return []

  const queryTokens = normalizedQuery.split(' ')
  return tests.filter((test) => {
    const searchableTitle = normalizeSearchText(test.title)
    return queryTokens.every((token) => searchableTitle.includes(token))
  })
}
