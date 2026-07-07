import {
  TAXONOMY_VERSION,
  answeringMethods,
  createContextTarget,
  getQuestionType,
  getSubject,
} from '../../taxonomy/contentTaxonomy.js'

export const QUESTION_SCHEMA_VERSION = 1
export const SOURCE_KINDS = Object.freeze(['official', 'editorial', 'ai-generated', 'third-party'])
export const CONTENT_STATUSES = Object.freeze(['draft', 'review', 'published', 'archived'])

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const questionContracts = Object.freeze({
  'multiple-choice': Object.freeze({ answeringMethodId: 'select-option', renderer: 'multiple-choice', answerKind: 'selected-response' }),
  'student-produced-response': Object.freeze({ answeringMethodId: 'enter-answer', renderer: 'grid-in', answerKind: 'student-produced-response' }),
  'free-response': Object.freeze({ answeringMethodId: 'write-response', renderer: 'free-response', answerKind: 'free-response' }),
})

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function validateAnswer(question, errors) {
  const { answer } = question
  const contract = questionContracts[question.taxonomy?.questionTypeId]
  if (!answer || typeof answer !== 'object' || Array.isArray(answer)) {
    errors.push('answer must be an object')
    return
  }
  if (contract && answer.kind !== contract.answerKind) errors.push(`answer.kind must be ${contract.answerKind}`)

  if (answer.kind === 'selected-response') {
    if (!Array.isArray(answer.options) || answer.options.length < 2) {
      errors.push('selected-response answers require at least two options')
      return
    }
    const optionIds = new Set()
    for (const option of answer.options) {
      if (!option || !ID_PATTERN.test(option.id || '') || !nonEmptyString(option.text)) {
        errors.push('each option requires a stable id and non-empty text')
        continue
      }
      if (optionIds.has(option.id)) errors.push(`duplicate option id: ${option.id}`)
      optionIds.add(option.id)
    }
    if (!nonEmptyString(answer.correctOptionId) || !optionIds.has(answer.correctOptionId)) {
      errors.push('correctOptionId must reference an existing option')
    }
  }

  if (answer.kind === 'student-produced-response') {
    if (!Array.isArray(answer.acceptedAnswers) || !answer.acceptedAnswers.length
      || answer.acceptedAnswers.some((value) => !nonEmptyString(value))) {
      errors.push('student-produced responses require non-empty acceptedAnswers')
    } else if (new Set(answer.acceptedAnswers.map((value) => value.trim())).size !== answer.acceptedAnswers.length) {
      errors.push('student-produced acceptedAnswers must be unique')
    }
    if (answer.matching !== 'exact-trimmed') errors.push('student-produced response matching must be exact-trimmed')
  }

  if (answer.kind === 'free-response' && !['manual', 'placeholder'].includes(answer.grading)) {
    errors.push('free-response answers require a supported grading mode')
  }
}

function validateSource(source, errors) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    errors.push('source provenance is required')
    return
  }
  if (!SOURCE_KINDS.includes(source.kind)) errors.push(`unsupported source kind: ${source.kind || '(missing)'}`)
  if (!nonEmptyString(source.name)) errors.push('source.name is required')
  if (source.externalId !== null && source.externalId !== undefined && !nonEmptyString(source.externalId)) {
    errors.push('source.externalId must be null or a non-empty string')
  }
  if (source.kind === 'official' && !nonEmptyString(source.externalId)) {
    errors.push('official sources require an externalId')
  }
  if (source.kind === 'third-party') {
    if (!source.license || !nonEmptyString(source.license.name)) errors.push('third-party sources require license metadata')
  } else if (source.license !== null && source.license !== undefined) {
    errors.push('license metadata is only valid for third-party sources')
  }
}

function validateContentMetadata(content, errors) {
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    errors.push('content metadata is required')
    return
  }
  if (!CONTENT_STATUSES.includes(content.status)) errors.push(`unsupported content status: ${content.status || '(missing)'}`)
  if (content.version !== QUESTION_SCHEMA_VERSION) errors.push(`content.version must be ${QUESTION_SCHEMA_VERSION}`)
  if (!Number.isInteger(content.revision) || content.revision < 1) errors.push('content.revision must be a positive integer')
}

export function validateCanonicalQuestion(question) {
  const errors = []
  if (!question || typeof question !== 'object' || Array.isArray(question)) {
    return { valid: false, errors: ['question must be an object'] }
  }
  if (!ID_PATTERN.test(question.id || '') || question.id.length > 120) errors.push('id must be a stable lowercase kebab-case identifier')
  if (!nonEmptyString(question.prompt)) errors.push('prompt is required')
  if (!nonEmptyString(question.explanation)) errors.push('explanation is required')

  const taxonomy = question.taxonomy
  if (!taxonomy || typeof taxonomy !== 'object' || Array.isArray(taxonomy)) {
    errors.push('taxonomy is required')
  } else {
    if (taxonomy.version !== TAXONOMY_VERSION) errors.push(`taxonomy.version must be ${TAXONOMY_VERSION}`)
    const subject = getSubject(taxonomy.subjectId)
    if (!subject) errors.push(`unknown subject: ${taxonomy.subjectId || '(missing)'}`)
    else {
      if (subject.examId !== taxonomy.examId) errors.push(`unknown exam/subject pairing: ${taxonomy.examId}:${taxonomy.subjectId}`)
      if (!subject.questionTypeIds.includes(taxonomy.questionTypeId)) {
        errors.push(`${taxonomy.subjectId} does not support question type ${taxonomy.questionTypeId}`)
      }
      if (!subject.answeringMethodIds.includes(taxonomy.answeringMethodId)) {
        errors.push(`${taxonomy.subjectId} does not support answering method ${taxonomy.answeringMethodId}`)
      }
    }
    const target = createContextTarget(taxonomy)
    if (target?.level !== 'skill') errors.push('taxonomy must reference a valid domain/skill pairing')
    const questionType = getQuestionType(taxonomy.questionTypeId)
    if (!questionType) errors.push(`unknown question type: ${taxonomy.questionTypeId || '(missing)'}`)
    if (!answeringMethods.some((method) => method.id === taxonomy.answeringMethodId)) {
      errors.push(`unknown answering method: ${taxonomy.answeringMethodId || '(missing)'}`)
    }
    const contract = questionContracts[taxonomy.questionTypeId]
    if (contract) {
      if (taxonomy.answeringMethodId !== contract.answeringMethodId) {
        errors.push(`${taxonomy.questionTypeId} requires answering method ${contract.answeringMethodId}`)
      }
      if (question.renderer !== contract.renderer || questionType?.renderer !== question.renderer) {
        errors.push(`${taxonomy.questionTypeId} requires renderer ${contract.renderer}`)
      }
    }
  }

  validateAnswer(question, errors)
  validateSource(question.source, errors)
  validateContentMetadata(question.content, errors)

  if (question.tags !== undefined) {
    if (!Array.isArray(question.tags) || question.tags.some((tag) => !TAG_PATTERN.test(tag))) {
      errors.push('tags must be lowercase kebab-case strings')
    } else if (new Set(question.tags).size !== question.tags.length) {
      errors.push('tags must be unique')
    }
  }

  return { valid: errors.length === 0, errors }
}

export function validateQuestionCatalog(questions) {
  const errors = []
  if (!Array.isArray(questions)) return { valid: false, errors: ['catalog must be an array'] }
  const ids = new Set()
  const externalIds = new Set()

  for (const question of questions) {
    const result = validateCanonicalQuestion(question)
    result.errors.forEach((error) => errors.push(`${question?.id || '(missing id)'}: ${error}`))
    if (ids.has(question?.id)) errors.push(`${question.id}: duplicate question id`)
    ids.add(question?.id)

    if (nonEmptyString(question?.source?.externalId)) {
      const externalKey = `${question.source.kind}:${question.source.name}:${question.source.externalId}`
      if (externalIds.has(externalKey)) errors.push(`${question.id}: duplicate external source id ${question.source.externalId}`)
      externalIds.add(externalKey)
    }
  }

  return { valid: errors.length === 0, errors }
}

export function assertValidQuestionCatalog(questions) {
  const result = validateQuestionCatalog(questions)
  if (!result.valid) throw new Error(`Question catalog validation failed:\n- ${result.errors.join('\n- ')}`)
  return questions
}
