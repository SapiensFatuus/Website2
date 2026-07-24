import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function source(relativeUrl) {
  return readFileSync(new URL(relativeUrl, import.meta.url), 'utf8')
}

test('initial navigation avoids draft catalogs and route-specific Firebase services', () => {
  const skillSearch = source('../catalog/skillSearch.js')
  const app = source('../App.jsx')
  const components = source('../components.jsx')
  const firebase = source('../firebase.js')

  assert.doesNotMatch(skillSearch, /questions\/catalog\/index/)
  assert.match(skillSearch, /publishedQuestionCounts/)
  assert.doesNotMatch(app, /^import .*unit7LearningLoop/m)
  assert.match(components, /import\('\.\/content\/resourceCatalog\.js'\)/)
  assert.doesNotMatch(firebase, /firebase\/(?:auth|firestore|storage)/)
})
