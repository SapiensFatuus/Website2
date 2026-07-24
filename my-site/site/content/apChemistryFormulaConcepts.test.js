import test from 'node:test'
import assert from 'node:assert/strict'
import { getSubject } from '../taxonomy/contentTaxonomy.js'
import {
  apChemistryFormulaConceptGroups,
  getApChemistryFormulaConceptGroup,
} from './apChemistryFormulaConcepts.js'

test('formula concept catalog has stable unique IDs and covers every canonical AP Chemistry unit', () => {
  const ids = apChemistryFormulaConceptGroups.map(({ id }) => id)
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(apChemistryFormulaConceptGroups.every(({ id, label, domainIds }) => (
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && label.trim() && domainIds.length
  )))

  const subject = getSubject('ap-chemistry')
  subject.domains.forEach((domain) => {
    assert.ok(
      apChemistryFormulaConceptGroups.some(({ domainIds }) => domainIds.includes(domain.id)),
      `${domain.id} must have an available formula concept group`,
    )
  })
  assert.equal(getApChemistryFormulaConceptGroup('buffers-and-titrations')?.label, 'Buffers and titrations')
  assert.equal(getApChemistryFormulaConceptGroup('missing'), null)
})
