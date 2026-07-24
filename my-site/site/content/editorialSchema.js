import {
  AP_CHEMISTRY_FRAMEWORK_ID,
} from '../taxonomy/apChemistryFramework.js'
import { apChemistrySources } from '../taxonomy/apChemistrySources.js'
import {
  getDomain,
  getSciencePracticeSubskill,
  getSkill,
} from '../taxonomy/contentTaxonomy.js'
import {
  apChemistryFormulaConceptGroups,
  getApChemistryFormulaConceptGroup,
} from './apChemistryFormulaConcepts.js'

export const EDITORIAL_SCHEMA_VERSION = 1
export const REVIEW_STATUSES = Object.freeze(['draft', 'in-review', 'approved', 'published', 'retired'])
export const RESOURCE_KINDS = Object.freeze(['lesson', 'formula', 'stimulus', 'rubric'])
export const DIFFICULTIES = Object.freeze(['introductory', 'developing', 'exam-ready'])
export const MISCONCEPTION_SCHEMA_VERSION = 1
export const FORMULA_CONCEPT_GROUPS = Object.freeze(apChemistryFormulaConceptGroups.map(({ id }) => id))
export const EXAM_REFERENCE_STATUSES = Object.freeze([
  'provided',
  'partly-provided',
  'not-provided',
])

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const sourceIds = new Set(apChemistrySources.map((source) => source.id))

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function uniqueNonEmptyStrings(value) {
  return Array.isArray(value)
    && value.length > 0
    && value.every(nonEmpty)
    && new Set(value).size === value.length
}

function validateReview(review, errors) {
  if (!review || typeof review !== 'object' || Array.isArray(review)) {
    errors.push('review metadata is required')
    return
  }
  if (!REVIEW_STATUSES.includes(review.status)) errors.push(`unsupported review status: ${review.status || '(missing)'}`)
  if (!Number.isInteger(review.revision) || review.revision < 1) errors.push('review.revision must be a positive integer')
  if (!nonEmpty(review.authoredBy)) errors.push('review.authoredBy is required')
  if (!DATE_PATTERN.test(review.updatedAt || '')) errors.push('review.updatedAt must be YYYY-MM-DD')
  if (!Array.isArray(review.reviewers) || review.reviewers.some((reviewer) => !nonEmpty(reviewer))) {
    errors.push('review.reviewers must be an array of non-empty reviewer identifiers')
  }
  if (!Array.isArray(review.history) || !review.history.length) {
    errors.push('review.history is required')
  } else {
    review.history.forEach((entry) => {
      if (!REVIEW_STATUSES.includes(entry?.status) || !DATE_PATTERN.test(entry?.date || '') || !nonEmpty(entry?.actor)) {
        errors.push('each review history entry requires a valid status, date, and actor')
      }
    })
  }
  if (['approved', 'published'].includes(review.status) && review.reviewers.length < 2) {
    errors.push(`${review.status} resources require at least two reviewers`)
  }
}

function validateProvenance(provenance, errors) {
  if (!provenance || typeof provenance !== 'object' || Array.isArray(provenance)) {
    errors.push('provenance is required')
    return
  }
  if (!['editorial', 'ai-generated'].includes(provenance.kind)) {
    errors.push('first-party resources require editorial or ai-generated provenance')
  }
  if (!nonEmpty(provenance.name)) errors.push('provenance.name is required')
  if (!uniqueNonEmptyStrings(provenance.sourceIds)) errors.push('provenance.sourceIds must contain unique source registry IDs')
  else provenance.sourceIds.forEach((id) => {
    if (!sourceIds.has(id)) errors.push(`unknown provenance source id: ${id}`)
  })
  if (!nonEmpty(provenance.originalityNote)) errors.push('provenance.originalityNote is required')
}

export function validateReviewMetadata(review) {
  const errors = []
  validateReview(review, errors)
  return { valid: errors.length === 0, errors }
}

export function validateProvenanceMetadata(provenance) {
  const errors = []
  validateProvenance(provenance, errors)
  return { valid: errors.length === 0, errors }
}

function validateAlignment(alignment, errors) {
  if (!alignment || typeof alignment !== 'object' || Array.isArray(alignment)) {
    errors.push('alignment is required')
    return
  }
  if (alignment.frameworkId !== AP_CHEMISTRY_FRAMEWORK_ID) errors.push(`alignment.frameworkId must be ${AP_CHEMISTRY_FRAMEWORK_ID}`)
  if (alignment.subjectId !== 'ap-chemistry') errors.push('alignment.subjectId must be ap-chemistry')
  const domain = getDomain('ap-chemistry', alignment.domainId)
  if (!domain) errors.push(`unknown AP Chemistry unit: ${alignment.domainId || '(missing)'}`)
  if (!uniqueNonEmptyStrings(alignment.skillIds)) {
    errors.push('alignment.skillIds must contain unique topic IDs')
    return
  }
  const skills = alignment.skillIds.map((id) => getSkill('ap-chemistry', id))
  if (skills.some((skill) => !skill || skill.domainId !== alignment.domainId)) {
    errors.push('all alignment topics must belong to the selected unit')
  }
  const objectiveIds = new Set(skills.flatMap((skill) => skill?.learningObjectives?.map((objective) => objective.id) || []))
  if (!uniqueNonEmptyStrings(alignment.learningObjectiveIds)
    || alignment.learningObjectiveIds.some((id) => !objectiveIds.has(id))) {
    errors.push('alignment.learningObjectiveIds must belong to the selected topics')
  }
  if (!uniqueNonEmptyStrings(alignment.sciencePracticeIds)
    || alignment.sciencePracticeIds.some((id) => !getSciencePracticeSubskill(id))) {
    errors.push('alignment.sciencePracticeIds must contain valid subskill IDs')
  }
}

function validateCommon(resource, errors) {
  if (!ID_PATTERN.test(resource.id || '')) errors.push('id must be lowercase kebab-case')
  if (!RESOURCE_KINDS.includes(resource.kind)) errors.push(`unsupported resource kind: ${resource.kind || '(missing)'}`)
  if (resource.schemaVersion !== EDITORIAL_SCHEMA_VERSION) errors.push(`schemaVersion must be ${EDITORIAL_SCHEMA_VERSION}`)
  if (!nonEmpty(resource.title)) errors.push('title is required')
  if (!nonEmpty(resource.summary)) errors.push('summary is required')
  validateAlignment(resource.alignment, errors)
  validateReview(resource.review, errors)
  validateProvenance(resource.provenance, errors)
}

function validateLesson(resource, errors) {
  if (!uniqueNonEmptyStrings(resource.prerequisites)) errors.push('lessons require prerequisites')
  if (!Array.isArray(resource.sections) || resource.sections.length < 2
    || resource.sections.some((section) => !nonEmpty(section?.heading) || !nonEmpty(section?.body))) {
    errors.push('lessons require at least two sections with heading and body')
  }
  if (!Array.isArray(resource.workedExamples) || !resource.workedExamples.length
    || resource.workedExamples.some((example) => !nonEmpty(example?.prompt) || !uniqueNonEmptyStrings(example?.steps) || !nonEmpty(example?.answer))) {
    errors.push('lessons require worked examples with prompt, steps, and answer')
  }
  if (!Array.isArray(resource.misconceptions) || !resource.misconceptions.length
    || resource.misconceptions.some((item) => !ID_PATTERN.test(item?.id || '') || !nonEmpty(item?.claim) || !nonEmpty(item?.correction))) {
    errors.push('lessons require stable misconception records')
  }
  if (!Array.isArray(resource.retrievalChecks) || !resource.retrievalChecks.length
    || resource.retrievalChecks.some((item) => !nonEmpty(item?.prompt) || !nonEmpty(item?.answer))) {
    errors.push('lessons require retrieval checks with answers')
  }
  if (!uniqueNonEmptyStrings(resource.formulaIds)) errors.push('lessons require formulaIds')
}

function validateFormula(resource, errors) {
  const conceptGroup = getApChemistryFormulaConceptGroup(resource.conceptGroup)
  if (!conceptGroup) {
    errors.push('formula.conceptGroup must be a supported concept group')
  } else if (!conceptGroup.domainIds.includes(resource.alignment?.domainId)) {
    errors.push('formula.conceptGroup must support the aligned AP Chemistry unit')
  }
  if (!resource.examReference || !EXAM_REFERENCE_STATUSES.includes(resource.examReference.status)) {
    errors.push('formula.examReference.status must classify exam availability')
  } else {
    if (!sourceIds.has(resource.examReference.sourceId)) errors.push('formula.examReference.sourceId must reference the source registry')
    if (!nonEmpty(resource.examReference.note)) errors.push('formula.examReference.note is required')
  }
  if (!nonEmpty(resource.expression)) errors.push('formula.expression is required')
  if (!Array.isArray(resource.variables) || !resource.variables.length
    || resource.variables.some((variable) => !nonEmpty(variable?.symbol) || !nonEmpty(variable?.meaning) || !nonEmpty(variable?.units))) {
    errors.push('formulas require variables with symbol, meaning, and units')
  }
  for (const field of ['assumptions', 'appliesWhen', 'doesNotApplyWhen', 'rearrangements']) {
    if (!uniqueNonEmptyStrings(resource[field])) errors.push(`formula.${field} is required`)
  }
  if (!nonEmpty(resource.workedExample?.prompt) || !uniqueNonEmptyStrings(resource.workedExample?.steps)
    || !nonEmpty(resource.workedExample?.answer)) errors.push('formulas require one complete worked example')
  if (!nonEmpty(resource.commonMistake)) errors.push('formula.commonMistake is required')
}

function validateStimulus(resource, errors) {
  if (!nonEmpty(resource.context)) errors.push('stimulus.context is required')
  const representation = resource.representation
  if (!representation || !['table', 'line-graph', 'graph-description', 'particle-description'].includes(representation.type)) {
    errors.push('stimulus requires a supported representation')
    return
  }
  if (!nonEmpty(representation.caption) || !nonEmpty(representation.accessibleDescription)) {
    errors.push('stimulus representation requires a caption and accessible description')
  }
  if (representation.type === 'table') {
    if (!uniqueNonEmptyStrings(representation.columns)
      || !Array.isArray(representation.rows) || !representation.rows.length
      || representation.rows.some((row) => !Array.isArray(row) || row.length !== representation.columns.length)) {
      errors.push('table stimuli require columns and rectangular rows')
    }
  }
  if (representation.type === 'line-graph') {
    if (!nonEmpty(representation.xLabel) || !nonEmpty(representation.yLabel)
      || !Array.isArray(representation.series) || representation.series.length < 1
      || representation.series.some((series) => !nonEmpty(series?.label)
        || !Array.isArray(series?.points) || series.points.length < 2
        || series.points.some((point) => !Array.isArray(point) || point.length !== 2
          || point.some((value) => !Number.isFinite(value))))) {
      errors.push('line-graph stimuli require axis labels and numeric series points')
    }
  }
}

function validateRubric(resource, errors) {
  if (!nonEmpty(resource.questionId)) errors.push('rubric.questionId is required')
  if (!Array.isArray(resource.parts) || !resource.parts.length) {
    errors.push('rubric.parts is required')
    return
  }
  let calculatedPoints = 0
  const pointIds = new Set()
  resource.parts.forEach((part) => {
    if (!ID_PATTERN.test(part?.id || '') || !nonEmpty(part?.prompt)) errors.push('each rubric part requires an id and prompt')
    if (!Array.isArray(part?.points) || !part.points.length) errors.push('each rubric part requires points')
    part?.points?.forEach((point) => {
      calculatedPoints += 1
      if (!ID_PATTERN.test(point?.id || '') || pointIds.has(point.id) || !nonEmpty(point?.criterion) || !nonEmpty(point?.acceptableEvidence)) {
        errors.push('rubric points require unique ids, criteria, and acceptable evidence')
      }
      pointIds.add(point?.id)
    })
  })
  if (resource.maxPoints !== calculatedPoints) errors.push(`rubric.maxPoints must equal ${calculatedPoints}`)
}

export function validateEditorialResource(resource) {
  if (!resource || typeof resource !== 'object' || Array.isArray(resource)) {
    return { valid: false, errors: ['resource must be an object'] }
  }
  const errors = []
  validateCommon(resource, errors)
  if (resource.kind === 'lesson') validateLesson(resource, errors)
  if (resource.kind === 'formula') validateFormula(resource, errors)
  if (resource.kind === 'stimulus') validateStimulus(resource, errors)
  if (resource.kind === 'rubric') validateRubric(resource, errors)
  return { valid: errors.length === 0, errors }
}

export function validateEditorialCatalog(resources) {
  if (!Array.isArray(resources)) return { valid: false, errors: ['catalog must be an array'] }
  const errors = []
  const ids = new Set()
  resources.forEach((resource) => {
    const result = validateEditorialResource(resource)
    result.errors.forEach((error) => errors.push(`${resource?.id || '(missing id)'}: ${error}`))
    if (ids.has(resource?.id)) errors.push(`${resource.id}: duplicate resource id`)
    ids.add(resource?.id)
  })
  const formulaIds = new Set(resources.filter((resource) => resource.kind === 'formula').map((resource) => resource.id))
  resources.filter((resource) => resource.kind === 'lesson').forEach((lesson) => {
    lesson.formulaIds?.forEach((id) => {
      if (!formulaIds.has(id)) errors.push(`${lesson.id}: unknown formula id ${id}`)
    })
  })
  return { valid: errors.length === 0, errors }
}

export function assertValidEditorialCatalog(resources) {
  const result = validateEditorialCatalog(resources)
  if (!result.valid) throw new Error(`Editorial catalog validation failed:\n- ${result.errors.join('\n- ')}`)
  return resources
}

export function validateMisconception(misconception) {
  if (!misconception || typeof misconception !== 'object' || Array.isArray(misconception)) {
    return { valid: false, errors: ['misconception must be an object'] }
  }
  const errors = []
  if (!ID_PATTERN.test(misconception.id || '')) errors.push('id must be lowercase kebab-case')
  if (misconception.schemaVersion !== MISCONCEPTION_SCHEMA_VERSION) errors.push(`schemaVersion must be ${MISCONCEPTION_SCHEMA_VERSION}`)
  for (const field of ['title', 'incorrectIdea', 'correction', 'diagnosticCue']) {
    if (!nonEmpty(misconception[field])) errors.push(`${field} is required`)
  }
  validateAlignment(misconception.alignment, errors)
  validateReview(misconception.review, errors)
  validateProvenance(misconception.provenance, errors)
  return { valid: errors.length === 0, errors }
}

export function validateMisconceptionCatalog(misconceptions) {
  if (!Array.isArray(misconceptions)) return { valid: false, errors: ['misconception catalog must be an array'] }
  const errors = []
  const ids = new Set()
  misconceptions.forEach((item) => {
    const result = validateMisconception(item)
    result.errors.forEach((error) => errors.push(`${item?.id || '(missing id)'}: ${error}`))
    if (ids.has(item?.id)) errors.push(`${item.id}: duplicate misconception id`)
    ids.add(item?.id)
  })
  return { valid: errors.length === 0, errors }
}

export function canTransitionReviewStatus(from, to) {
  const allowed = {
    draft: ['in-review', 'retired'],
    'in-review': ['draft', 'approved', 'retired'],
    approved: ['in-review', 'published', 'retired'],
    published: ['in-review', 'retired'],
    retired: ['draft'],
  }
  return REVIEW_STATUSES.includes(from) && allowed[from].includes(to)
}
