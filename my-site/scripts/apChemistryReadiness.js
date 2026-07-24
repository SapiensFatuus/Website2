import process from 'node:process'
import { canonicalQuestions } from '../site/questions/catalog/index.js'
import { editorialResources } from '../site/content/resourceCatalog.js'
import { apChemistryFrqExemplars } from '../site/content/apChemistryFrqExemplars.js'
import { apChemistryAssessmentBlueprints } from '../site/content/apChemistryAssessmentsValidated.js'
import { apChemistryAssessmentPilotEvidence } from '../site/content/assessmentPilotEvidence.js'
import { createApChemistryUnitReadinessReport } from '../site/content/apChemistryReadiness.js'
import { getSubject } from '../site/taxonomy/contentTaxonomy.js'

const unitArgument = process.argv.find((argument) => argument.startsWith('--unit='))
const includeAllUnits = process.argv.includes('--all')

if (includeAllUnits && unitArgument) {
  console.error('Use either --all or --unit=<unit-id>, not both.')
  process.exitCode = 1
} else {
  const unitIds = includeAllUnits
    ? getSubject('ap-chemistry').domains.map(({ id }) => id)
    : [unitArgument?.slice('--unit='.length) || 'equilibrium']

  const reports = unitIds.map((unitId) => createApChemistryUnitReadinessReport({
    unitId,
    questions: canonicalQuestions,
    resources: editorialResources,
    exemplars: apChemistryFrqExemplars,
    assessments: apChemistryAssessmentBlueprints,
    pilotEvidence: apChemistryAssessmentPilotEvidence,
  }))

  reports.forEach((report, index) => {
    if (index > 0) console.log('')
    console.log(`AP Chemistry Unit ${report.unitNumber} ${report.unitLabel} launch readiness: ${report.ready ? 'READY' : 'NOT READY'}`)
    report.gates.forEach((item) => {
      const progress = `${item.actual}/${item.target}`
      console.log(`${item.pass ? 'PASS' : 'PENDING'}  ${item.id}  ${progress}${item.remaining ? `  (${item.remaining} remaining)` : ''}`)
    })
  })

  if (process.argv.includes('--require-ready') && reports.some(({ ready }) => !ready)) process.exitCode = 1
}
