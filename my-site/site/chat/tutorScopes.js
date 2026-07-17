import { getSkill, getSubject } from '../taxonomy/contentTaxonomy.js'

const apChemistryUnits = Object.freeze([
  ['atomic-structure', 'Atomic Structure and Properties'],
  ['bonding', 'Molecular and Ionic Structure'],
  ['reactions', 'Chemical Reactions'],
  ['kinetics', 'Kinetics'],
  ['thermodynamics', 'Thermodynamics'],
  ['equilibrium', 'Equilibrium'],
  ['acids-bases', 'Acids and Bases'],
  ['applications', 'Applications of Thermodynamics'],
].map(([id, label]) => Object.freeze({ id, label, skills: Object.freeze([]) })))

export function getTutorSubject(examId, subjectId) {
  if (examId === 'sat' && subjectId === 'sat-math') {
    const subject = getSubject(subjectId)
    return subject ? { ...subject, label: 'SAT Math' } : null
  }
  if (examId === 'ap' && subjectId === 'ap-chemistry') {
    return { examId, id: subjectId, label: 'AP Chemistry', domains: apChemistryUnits }
  }
  return null
}

export function resolveTutorUiTarget({ examId, subjectId, scope, domainId, skillId } = {}) {
  const subject = getTutorSubject(examId, subjectId)
  if (!subject) return null
  const resolvedScope = scope || (skillId ? 'skill' : domainId ? 'domain' : 'subject')
  if (resolvedScope === 'subject') return { scope: 'subject', examId, subjectId }
  const domain = subject.domains.find((item) => item.id === domainId)
  if (!domain) return null
  if (resolvedScope === 'domain') return { scope: 'domain', examId, subjectId, domainId }
  const skill = subjectId === 'sat-math' ? getSkill(subjectId, skillId) : null
  if (!skill || skill.domainId !== domain.id) return null
  return { scope: 'skill', examId, subjectId, domainId, skillId }
}

export function getTutorUiScopeDetails(target) {
  const canonical = resolveTutorUiTarget(target)
  if (!canonical) return null
  const subject = getTutorSubject(canonical.examId, canonical.subjectId)
  const domain = canonical.domainId ? subject.domains.find((item) => item.id === canonical.domainId) : null
  const skill = canonical.skillId ? getSkill(canonical.subjectId, canonical.skillId) : null
  return { target: canonical, subject, domain, skill, label: skill?.label || domain?.label || subject.label }
}

export function createInitialTutorPrompt(target) {
  const details = getTutorUiScopeDetails(target)
  if (!details || details.target.scope === 'subject') return null
  if (details.target.scope === 'skill') {
    return `Teach me ${details.skill.label.toLowerCase()} for ${details.subject.label}. Start by checking what I already understand, then explain the concept with a test-style example and guide me through practice.`
  }
  return `Help me review the ${details.domain.label} unit for ${details.subject.label}. Identify my weak areas, explain the important concepts, and recommend what I should practice.`
}

export function createOpeningPromptKey(target) {
  const canonical = resolveTutorUiTarget(target)
  if (!canonical || canonical.scope === 'subject') return null
  return [canonical.examId, canonical.subjectId, canonical.domainId || '', canonical.skillId || ''].join(':')
}

export function claimOpeningPrompt(seenKeys, key) {
  if (!key || seenKeys.has(key)) return false
  seenKeys.add(key)
  return true
}

export function createTutorChatUrl(target) {
  const canonical = resolveTutorUiTarget(target)
  if (!canonical) return null
  const params = new URLSearchParams({ exam: canonical.examId, test: canonical.subjectId })
  if (canonical.domainId) params.set('unit', canonical.domainId)
  if (canonical.skillId) params.set('skill', canonical.skillId)
  return `/chat.html?${params.toString()}`
}

export function createSubjectTutorUrl(subjectId) {
  const examId = subjectId === 'sat-math' ? 'sat' : subjectId === 'ap-chemistry' ? 'ap' : null
  return examId ? createTutorChatUrl({ examId, subjectId, scope: 'subject' }) : null
}

export function createDomainTutorUrl(subjectId, domainId) {
  const subject = getSubject(subjectId)
  return subject ? createTutorChatUrl({ examId: subject.examId, subjectId, scope: 'domain', domainId }) : null
}
