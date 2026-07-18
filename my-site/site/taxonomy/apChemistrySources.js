const SOURCE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PERIOD_PATTERN = /^\d{4}(?:-(?:\d{2}(?:-\d{2})?|SPRING|SUMMER|FALL|WINTER))?$/
const USAGE_STATUSES = new Set(['link-only', 'metadata-only', 'licensed-content'])

export const AP_CHEMISTRY_SOURCE_POLICY = Object.freeze({
  defaultUsage: 'link-only',
  localMirroringRequiresPermission: true,
  policy: 'College Board materials remain external references unless a source record documents redistribution permission.',
})

export const apChemistrySources = Object.freeze([
  {
    id: 'ap-chemistry-ced-fall-2024',
    title: 'AP Chemistry Course and Exam Description',
    owner: 'College Board',
    canonicalUrl: 'https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf',
    documentVersion: 'V.1, effective Fall 2024',
    effectiveDate: '2024-FALL',
    accessDate: '2026-07-18',
    frameworkId: 'ap-chemistry-fall-2024',
    usageStatus: 'metadata-only',
    annualReviewDate: '2027-07-01',
    notes: 'Authoritative framework for unit, topic, learning-objective, science-practice, and weighting metadata. Explanatory summaries in the product are independently written.',
  },
  {
    id: 'ap-chemistry-exam-2026',
    title: 'AP Chemistry Exam',
    owner: 'College Board',
    canonicalUrl: 'https://apcentral.collegeboard.org/courses/ap-chemistry/exam',
    documentVersion: '2026 exam administration',
    effectiveDate: '2026-05-05',
    accessDate: '2026-07-18',
    frameworkId: 'ap-chemistry-fall-2024',
    usageStatus: 'metadata-only',
    annualReviewDate: '2027-07-01',
    notes: 'Rolling exam-format page. Recheck dates, timing, delivery mode, and section structure every school year.',
  },
  {
    id: 'ap-chemistry-reference-2026',
    title: 'AP Chemistry 2026 Exam Reference Information',
    owner: 'College Board',
    canonicalUrl: 'https://apcentral.collegeboard.org/media/pdf/ap-chemistry-equations-sheet.pdf',
    documentVersion: '2026 exam reference information',
    effectiveDate: '2026',
    accessDate: '2026-07-18',
    frameworkId: 'ap-chemistry-fall-2024',
    usageStatus: 'link-only',
    annualReviewDate: '2027-07-01',
    notes: 'Link to the official reference booklet. Do not mirror or reproduce it without documented permission.',
  },
  {
    id: 'ap-chemistry-released-frqs',
    title: 'AP Chemistry Exam Questions and Scoring Information',
    owner: 'College Board',
    canonicalUrl: 'https://apcentral.collegeboard.org/courses/ap-chemistry/exam/past-exam-questions',
    documentVersion: 'Rolling public archive',
    effectiveDate: '2026',
    accessDate: '2026-07-18',
    frameworkId: 'ap-chemistry-fall-2024',
    usageStatus: 'link-only',
    annualReviewDate: '2027-07-01',
    notes: 'Use public materials for external links and original coverage analysis. Do not copy questions, scoring language, diagrams, or student responses by default.',
  },
  {
    id: 'ap-course-exam-change-log',
    title: 'AP Course and Exam Changes',
    owner: 'College Board',
    canonicalUrl: 'https://apcentral.collegeboard.org/courses/how-ap-develops-courses-and-exams/course-changes-overview',
    documentVersion: 'Rolling change log',
    effectiveDate: '2026',
    accessDate: '2026-07-18',
    frameworkId: 'ap-chemistry-fall-2024',
    usageStatus: 'metadata-only',
    annualReviewDate: '2027-07-01',
    notes: 'Check before each school year to confirm the active CED and any announced revisions.',
  },
])

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function parseDate(value) {
  const parsed = new Date(`${value}T00:00:00Z`)
  return Number.isNaN(parsed.valueOf()) ? null : parsed
}

export function validateSourceRegistry(sources = apChemistrySources) {
  const errors = []
  const ids = new Set()
  const urls = new Set()

  if (!Array.isArray(sources) || !sources.length) return { valid: false, errors: ['source registry must be a non-empty array'] }

  for (const source of sources) {
    const prefix = source?.id || '(missing source id)'
    if (!SOURCE_ID_PATTERN.test(source?.id || '')) errors.push(`${prefix}: id must be lowercase kebab-case`)
    if (ids.has(source?.id)) errors.push(`${prefix}: duplicate source id`)
    ids.add(source?.id)

    for (const field of ['title', 'owner', 'documentVersion', 'frameworkId', 'notes']) {
      if (!nonEmpty(source?.[field])) errors.push(`${prefix}: ${field} is required`)
    }
    if (!PERIOD_PATTERN.test(source?.effectiveDate || '')) errors.push(`${prefix}: effectiveDate must be a documented year, date, month, or season`)
    if (!USAGE_STATUSES.has(source?.usageStatus)) errors.push(`${prefix}: unsupported usageStatus`)

    let parsedUrl = null
    try {
      parsedUrl = new URL(source?.canonicalUrl)
    } catch {
      errors.push(`${prefix}: canonicalUrl must be a valid URL`)
    }
    if (parsedUrl?.protocol !== 'https:') errors.push(`${prefix}: canonicalUrl must use https`)
    if (urls.has(source?.canonicalUrl)) errors.push(`${prefix}: duplicate canonicalUrl`)
    urls.add(source?.canonicalUrl)

    const accessDate = parseDate(source?.accessDate)
    const annualReviewDate = parseDate(source?.annualReviewDate)
    if (!accessDate) errors.push(`${prefix}: accessDate must be an ISO date`)
    if (!annualReviewDate) errors.push(`${prefix}: annualReviewDate must be an ISO date`)
    if (accessDate && annualReviewDate) {
      const reviewWindowDays = (annualReviewDate - accessDate) / 86400000
      if (reviewWindowDays <= 0 || reviewWindowDays > 366) errors.push(`${prefix}: annual review must occur within one year of access`)
    }
  }

  return { valid: errors.length === 0, errors }
}

export function assertValidSourceRegistry(sources = apChemistrySources) {
  const result = validateSourceRegistry(sources)
  if (!result.valid) throw new Error(`AP Chemistry source registry validation failed:\n- ${result.errors.join('\n- ')}`)
  return sources
}

export function getApChemistrySource(sourceId) {
  return apChemistrySources.find((source) => source.id === sourceId) || null
}
