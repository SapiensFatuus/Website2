import test from 'node:test'
import assert from 'node:assert/strict'
import { topics } from '../siteData.js'
import { searchTests } from './testSearch.js'

test('test search ignores punctuation and matches all query words', () => {
  assert.equal(searchTests(topics, 'SAT Math')[0]?.slug, 'sat-math')
  assert.equal(searchTests(topics, 'AP Chemistry')[0]?.slug, 'ap-chemistry')
  assert.equal(searchTests(topics, '  sat: math  ')[0]?.slug, 'sat-math')
})

test('test search returns no results for empty or unrelated queries', () => {
  assert.deepEqual(searchTests(topics, '   '), [])
  assert.deepEqual(searchTests(topics, 'marine navigation'), [])
})
