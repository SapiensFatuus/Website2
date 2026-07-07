import { canonicalQuestions } from '../site/questions/catalog/index.js'
import { createCatalogCoverage, formatCatalogCoverage } from '../site/questions/catalog/coverage.js'

const minimumArgument = globalThis.process.argv.find((argument) => argument.startsWith('--minimum='))
const minimumPerSkill = minimumArgument ? Number(minimumArgument.slice('--minimum='.length)) : 5
const coverage = createCatalogCoverage(canonicalQuestions, { minimumPerSkill })

console.log(formatCatalogCoverage(coverage))
