import process from 'node:process'
import { readFileSync, writeFileSync } from 'node:fs'
import { extname, isAbsolute, relative, resolve } from 'node:path'
import {
  RELEASED_EXAM_METADATA_SCHEMA_VERSION,
  validateReleasedExamMetadataCatalog,
} from '../site/content/editorialPipeline.js'

function option(name) {
  const prefix = `--${name}=`
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length) || null
}

function fail(message) {
  console.error(message)
  process.exitCode = 1
}

function safeId(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function writeMetadataTemplate(path, record) {
  const allowedRoot = resolve('metadata-intake')
  const outputPath = resolve(path)
  const relativePath = relative(allowedRoot, outputPath)
  if (!relativePath || relativePath.startsWith('..') || isAbsolute(relativePath) || extname(outputPath).toLowerCase() !== '.json') {
    throw new TypeError('Released-exam metadata output must be a .json file inside the local metadata-intake directory.')
  }
  writeFileSync(outputPath, `${JSON.stringify(record, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' })
  return outputPath
}

function flattenInput(value) {
  return Array.isArray(value) ? value : [value]
}

const command = process.argv[2]

if (command === 'template') {
  const year = Number(option('year'))
  const publicQuestionNumber = option('question')
  const recordedBy = option('recorded-by')
  const observedAt = option('date') || new Date().toISOString().slice(0, 10)
  const output = option('output')
  if (!Number.isInteger(year) || !publicQuestionNumber || !recordedBy || !output) {
    fail('Usage: npm run catalog:metadata-template -- --year=2026 --question=FRQ-1 --recorded-by=editor-id --date=YYYY-MM-DD --output=metadata-intake/file.json')
  } else {
    try {
      const record = {
        schemaVersion: RELEASED_EXAM_METADATA_SCHEMA_VERSION,
        id: `released-${year}-${safeId(publicQuestionNumber)}`,
        year,
        publicQuestionNumber,
        sourceId: 'ap-chemistry-released-frqs',
        observedAt,
        recordedBy,
        topicIds: [],
        sciencePracticeIds: [],
        taskVerbs: [],
        representationTypes: [],
        calculationTypes: [],
        misconceptionCategoryIds: [],
      }
      const created = writeMetadataTemplate(output, record)
      console.log(`Created incomplete metadata template ${created}`)
      console.log('Complete every metadata array, then run catalog:metadata-validate. Do not add prompt, rubric, answer, diagram, or student-response text.')
    } catch (error) {
      fail(error.message)
    }
  }
} else if (command === 'validate') {
  const paths = process.argv.slice(3).filter((argument) => !argument.startsWith('--'))
  if (!paths.length) {
    fail('Usage: npm run catalog:metadata-validate -- metadata-intake/file.json [second-file.json]')
  } else {
    try {
      const records = paths.flatMap((path) => flattenInput(JSON.parse(readFileSync(path, 'utf8'))))
      const result = validateReleasedExamMetadataCatalog(records)
      if (!result.valid) fail(`Released-exam metadata validation failed:\n- ${result.errors.join('\n- ')}`)
      else console.log(`Released-exam metadata valid: ${records.length} factual record${records.length === 1 ? '' : 's'}; no protected source content retained.`)
    } catch (error) {
      fail(error.message)
    }
  }
} else {
  fail('Use either the template or validate command.')
}
