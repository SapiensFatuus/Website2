import test from 'node:test'
import assert from 'node:assert/strict'
import { getSubject } from '../site/taxonomy/contentTaxonomy.js'
import { tutorSubjects } from './tutorScopeCatalog.js'

test('server AP Chemistry tutor allow-list matches the canonical client taxonomy', () => {
  const canonical = getSubject('ap-chemistry').domains
  const projected = tutorSubjects['ap:ap-chemistry'].domains
  assert.deepEqual(projected.map(({ id, label }) => ({ id, label })), canonical.map(({ id, label }) => ({ id, label })))
  assert.deepEqual(
    projected.map((unit) => unit.skills.map(([id, label]) => ({ id, label }))),
    canonical.map((unit) => unit.skills.map(({ id, label }) => ({ id, label }))),
  )
})
