import { linearEquationsOneVariableContextPack } from './tutorContextPacks/linearEquationsOneVariable.js'
import { linearFunctionsContextPack } from './tutorContextPacks/linearFunctions.js'

const contextPacks = [linearEquationsOneVariableContextPack, linearFunctionsContextPack]

export function createTutorTargetKey({ examId, subjectId, domainId, skillId } = {}) {
  return [examId, subjectId, domainId, skillId].join(':')
}

export function validateTutorContextPacks(packs) {
  const targetKeys = new Set()
  const sourceIds = new Set()

  for (const pack of packs) {
    const targetKey = createTutorTargetKey(pack.target)
    if (targetKey.split(':').some((part) => !part)) throw new Error('Tutor context packs require a complete canonical target.')
    if (targetKeys.has(targetKey)) throw new Error(`Duplicate tutor target: ${targetKey}`)
    if (!pack.label || !pack.materialNotice || !pack.materials?.length) throw new Error(`Incomplete tutor context pack: ${targetKey}`)
    targetKeys.add(targetKey)

    for (const material of pack.materials) {
      if (!material.id || sourceIds.has(material.id)) throw new Error(`Duplicate or missing tutor source ID: ${material.id || '(missing)'}`)
      if (!material.label || !material.problem || !material.explanation || !material.alternativeMethod || !material.keywords?.length) {
        throw new Error(`Incomplete tutor material: ${material.id}`)
      }
      sourceIds.add(material.id)
    }
  }
}

validateTutorContextPacks(contextPacks)

const registryByKey = new Map(contextPacks.map((pack) => [createTutorTargetKey(pack.target), pack]))

export const tutorRegistry = Object.freeze(contextPacks.reduce((exams, pack) => {
  const { examId, subjectId, domainId, skillId } = pack.target
  exams[examId] ??= {}
  exams[examId][subjectId] ??= {}
  exams[examId][subjectId][domainId] ??= {}
  exams[examId][subjectId][domainId][skillId] = pack
  return exams
}, {}))

export function getTutorContextPack(target) {
  return registryByKey.get(createTutorTargetKey(target)) || null
}

export function getSupportedTutorTargets() {
  return contextPacks.map((pack) => ({ ...pack.target }))
}
