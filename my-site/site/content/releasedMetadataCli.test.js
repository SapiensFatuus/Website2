import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

test('released-exam metadata CLI creates a confined template and validates only completed factual records', () => {
  const script = fileURLToPath(new URL('../../scripts/apChemistryReleasedMetadata.js', import.meta.url))
  const workingDirectory = mkdtempSync(join(tmpdir(), 'ap-chem-metadata-'))
  const intakeDirectory = join(workingDirectory, 'metadata-intake')
  const relativeOutput = 'metadata-intake/released-2026-frq-1.json'
  const output = join(intakeDirectory, 'released-2026-frq-1.json')
  mkdirSync(intakeDirectory)

  try {
    const templateArgs = [
      script,
      'template',
      '--year=2026',
      '--question=FRQ-1',
      '--recorded-by=metadata-reviewer',
      '--date=2026-07-20',
      `--output=${relativeOutput}`,
    ]
    const generated = spawnSync(process.execPath, templateArgs, { cwd: workingDirectory, encoding: 'utf8' })
    assert.equal(generated.status, 0, generated.stderr)
    assert.match(generated.stdout, /Created incomplete metadata template/)

    const record = JSON.parse(readFileSync(output, 'utf8'))
    assert.equal(record.id, 'released-2026-frq-1')
    assert.equal(record.publicQuestionNumber, 'FRQ-1')
    assert.deepEqual(record.topicIds, [])
    assert.equal(Object.hasOwn(record, 'prompt'), false)

    const incomplete = spawnSync(process.execPath, [script, 'validate', relativeOutput], { cwd: workingDirectory, encoding: 'utf8' })
    assert.equal(incomplete.status, 1)
    assert.match(incomplete.stderr, /topicIds must contain|sciencePracticeIds must contain/)

    Object.assign(record, {
      topicIds: ['reaction-quotient-equilibrium-constant'],
      sciencePracticeIds: ['5.F'],
      taskVerbs: ['calculate'],
      representationTypes: ['concentration-table'],
      calculationTypes: ['reaction-quotient'],
      misconceptionCategoryIds: ['q-versus-k-direction'],
    })
    writeFileSync(output, `${JSON.stringify(record, null, 2)}\n`, 'utf8')
    const valid = spawnSync(process.execPath, [script, 'validate', relativeOutput], { cwd: workingDirectory, encoding: 'utf8' })
    assert.equal(valid.status, 0, valid.stderr)
    assert.match(valid.stdout, /1 factual record; no protected source content retained/)

    const overwrite = spawnSync(process.execPath, templateArgs, { cwd: workingDirectory, encoding: 'utf8' })
    assert.equal(overwrite.status, 1)
    assert.match(overwrite.stderr, /EEXIST|file already exists/i)

    const outside = spawnSync(process.execPath, [
      script,
      'template',
      '--year=2026',
      '--question=FRQ-2',
      '--recorded-by=metadata-reviewer',
      '--output=outside.json',
    ], { cwd: workingDirectory, encoding: 'utf8' })
    assert.equal(outside.status, 1)
    assert.match(outside.stderr, /inside the local metadata-intake directory/)

    record.questionText = 'Protected wording must never be retained.'
    writeFileSync(output, `${JSON.stringify(record, null, 2)}\n`, 'utf8')
    const protectedContent = spawnSync(process.execPath, [script, 'validate', relativeOutput], { cwd: workingDirectory, encoding: 'utf8' })
    assert.equal(protectedContent.status, 1)
    assert.match(protectedContent.stderr, /protected content field is forbidden/)
  } finally {
    rmSync(workingDirectory, { recursive: true, force: true })
  }
})
