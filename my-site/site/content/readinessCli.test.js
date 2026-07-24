import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('../../scripts/apChemistryReadiness.js', import.meta.url))

test('readiness CLI reports every AP Chemistry unit in canonical order with --all', () => {
  const result = spawnSync(process.execPath, [script, '--all'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const unitNumbers = [...result.stdout.matchAll(/AP Chemistry Unit (\d+) /g)].map((match) => match[1])
  assert.deepEqual(unitNumbers, ['1', '2', '3', '4', '5', '6', '7', '8', '9'])
  assert.equal((result.stdout.match(/launch readiness:/g) || []).length, 9)
})

test('readiness CLI applies require-ready across all units', () => {
  const result = spawnSync(process.execPath, [script, '--all', '--require-ready'], { encoding: 'utf8' })
  assert.equal(result.status, 1)
  assert.match(result.stdout, /AP Chemistry Unit 1/)
  assert.match(result.stdout, /AP Chemistry Unit 9/)
})

test('readiness CLI rejects conflicting unit selectors', () => {
  const result = spawnSync(process.execPath, [script, '--all', '--unit=equilibrium'], { encoding: 'utf8' })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /either --all or --unit/)
  assert.equal(result.stdout, '')
})
