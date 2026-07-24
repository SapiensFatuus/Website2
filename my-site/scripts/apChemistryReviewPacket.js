import process from 'node:process'
import { readFileSync, writeFileSync } from 'node:fs'
import { extname, isAbsolute, relative, resolve } from 'node:path'
import { canonicalQuestions } from '../site/questions/catalog/index.js'
import { editorialResources } from '../site/content/resourceCatalog.js'
import { apChemistryFrqExemplars } from '../site/content/apChemistryFrqExemplars.js'
import {
  aggregateReviewPackets,
  createBlankReviewPacket,
  validateReviewPacket,
} from '../site/content/editorialReviewPackets.js'

function bundleForUnit(unitId) {
  return {
    questions: canonicalQuestions.filter((question) => (
      question.taxonomy.subjectId === 'ap-chemistry'
      && question.taxonomy.domainId === unitId
      && question.content.status !== 'published'
      && question.content.status !== 'retired'
    )),
    resources: editorialResources.filter((resource) => (
      resource.alignment.subjectId === 'ap-chemistry'
      && resource.alignment.domainId === unitId
      && resource.review.status !== 'published'
      && resource.review.status !== 'retired'
    )),
    exemplars: apChemistryFrqExemplars.filter((record) => (
      record.alignment.subjectId === 'ap-chemistry'
      && record.alignment.domainId === unitId
      && record.review.status !== 'published'
      && record.review.status !== 'retired'
    )),
  }
}

function option(name) {
  const prefix = `--${name}=`
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length) || null
}

function fail(message) {
  console.error(message)
  process.exitCode = 1
}

function writePrivatePacket(path, packet) {
  const allowedRoot = resolve('review-packets')
  const outputPath = resolve(path)
  const relativePath = relative(allowedRoot, outputPath)
  if (!relativePath || relativePath.startsWith('..') || isAbsolute(relativePath) || extname(outputPath).toLowerCase() !== '.json') {
    throw new TypeError('Review packet output must be a .json file inside the local review-packets directory.')
  }
  writeFileSync(outputPath, `${JSON.stringify(packet, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' })
  return outputPath
}

const command = process.argv[2]
const unitId = option('unit') || 'equilibrium'
const bundle = bundleForUnit(unitId)

if (command === 'template') {
  const reviewerId = option('reviewer')
  const createdAt = option('date') || new Date().toISOString().slice(0, 10)
  const output = option('output')
  if (!reviewerId) {
    fail('Usage: npm run catalog:review-template -- --unit=equilibrium --reviewer=reviewer-id [--date=YYYY-MM-DD] [--output=review-packets/file.json]')
  } else {
    try {
      const packet = createBlankReviewPacket(bundle, { reviewerId, createdAt })
      if (output) console.log(`Created ${writePrivatePacket(output, packet)}`)
      else process.stdout.write(`${JSON.stringify(packet, null, 2)}\n`)
    } catch (error) {
      fail(error.message)
    }
  }
} else if (command === 'validate') {
  const paths = process.argv.slice(3).filter((argument) => !argument.startsWith('--'))
  if (!paths.length) {
    fail('Usage: npm run catalog:review-validate -- --unit=equilibrium packet-one.json [packet-two.json]')
  } else {
    try {
      const packets = paths.map((path) => JSON.parse(readFileSync(path, 'utf8')))
      const invalid = packets.flatMap((packet, index) => validateReviewPacket(packet, bundle, { requireCompleteDecisions: true }).errors
        .map((error) => `${paths[index]}: ${error}`))
      if (invalid.length) {
        fail(`Review packet validation failed:\n- ${invalid.join('\n- ')}`)
      } else if (packets.length >= 2) {
        const aggregate = aggregateReviewPackets(packets, bundle)
        console.log(`Review packets valid: ${aggregate.reviewerIds.length} reviewers, ${aggregate.readyCount}/${aggregate.itemCount} items ready for a deliberate status transition, ${aggregate.changeRequestedCount} with change requests.`)
        console.log('No content status was changed.')
      } else {
        console.log(`Review packet valid: ${packets[0].reviewerId}, ${packets[0].items.length} completed decisions.`)
        console.log('A second independent reviewer packet is still required. No content status was changed.')
      }
    } catch (error) {
      fail(error.message)
    }
  }
} else {
  fail('Use either the template or validate command.')
}
