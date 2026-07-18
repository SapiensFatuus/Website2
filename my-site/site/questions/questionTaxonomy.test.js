import test from 'node:test'
import assert from 'node:assert/strict'
import { findTopicBySlug } from '../siteData.js'
import {
  createContextTarget,
  createSkillBrowserUrl,
  createSkillChatUrl,
  createSkillPracticeUrl,
  getDomain,
  getPracticeFilters,
  getSkill,
  getSubject,
  resolveSubjectLocation,
  validateQuestionTaxonomy,
} from '../taxonomy/contentTaxonomy.js'
import {
  demoQuestions,
  getAvailableFilterGroups,
  getDefaultFilterSelections,
  getQuestions,
  isFilterGroupVisible,
  matchesFilters,
  reconcileFilterSelections,
  sanitizeFilterSelections,
} from './questionData.js'

test('topics define independent filter taxonomies', () => {
  const satMath = findTopicBySlug('sat-math')
  const chemistry = findTopicBySlug('ap-chemistry')
  const satTypes = satMath.questionFilters.find((group) => group.id === 'questionType')
  const chemistryTypes = chemistry.questionFilters.find((group) => group.id === 'questionType')
  const responseFormats = chemistry.questionFilters.find((group) => group.id === 'responseFormat')

  assert.deepEqual(satTypes.options.map((option) => option.id), ['multiple-choice', 'student-produced-response'])
  assert.equal(satTypes.selection, 'multi')
  assert.deepEqual(chemistryTypes.options.map((option) => option.id), ['multiple-choice', 'free-response'])
  assert.equal(chemistryTypes.selection, 'multi')
  assert.equal(responseFormats.selection, 'multi')
  assert.deepEqual(responseFormats.options.map((option) => option.id), ['essay', 'grid-in'])
})

test('available groups surface supported renderers with seeded questions', () => {
  const satMath = findTopicBySlug('sat-math')
  const groups = getAvailableFilterGroups(satMath)
  const types = groups.find((group) => group.id === 'questionType')
  const domains = groups.find((group) => group.id === 'domain')

  assert.deepEqual(types.options.map((option) => option.id), ['multiple-choice', 'student-produced-response'])
  assert.deepEqual(domains.options.map((option) => option.id), ['algebra', 'advanced-math', 'problem-solving-data-analysis', 'geometry-trigonometry'])
  assert.deepEqual(getDefaultFilterSelections(satMath), {})

  const chemistryGroups = getAvailableFilterGroups(findTopicBySlug('ap-chemistry'), { questionType: ['free-response'] })
  assert.deepEqual(chemistryGroups.find((group) => group.id === 'questionType').options.map((option) => option.id), ['multiple-choice', 'free-response'])
  assert.deepEqual(chemistryGroups.find((group) => group.id === 'responseFormat').options.map((option) => option.id), ['essay', 'grid-in'])
  assert.deepEqual(chemistryGroups.find((group) => group.id === 'domain').options.map((option) => option.id), [
    'atomic-structure-properties',
    'compound-structure-properties',
    'properties-substances-mixtures',
    'chemical-reactions',
    'kinetics',
    'thermochemistry',
    'equilibrium',
    'acids-bases',
    'thermodynamics-electrochemistry',
  ])
})

test('conditional groups follow parent selections and hidden values are cleared', () => {
  const chemistry = findTopicBySlug('ap-chemistry')
  const responseFormat = chemistry.questionFilters.find((group) => group.id === 'responseFormat')

  assert.equal(isFilterGroupVisible(responseFormat, { questionType: ['free-response'] }), true)
  assert.equal(isFilterGroupVisible(responseFormat, { questionType: ['multiple-choice'] }), false)
  assert.deepEqual(
    sanitizeFilterSelections(chemistry, { questionType: ['multiple-choice'], responseFormat: ['essay'] }),
    { questionType: ['multiple-choice'] },
  )
  assert.equal(
    getAvailableFilterGroups(chemistry, { questionType: ['multiple-choice'] }).some((group) => group.id === 'responseFormat'),
    false,
  )
  assert.deepEqual(
    reconcileFilterSelections(chemistry, { questionType: ['multiple-choice'], responseFormat: ['essay', 'grid-in'] }),
    { questionType: ['multiple-choice'] },
  )
})

test('free-response formats can be selected independently or together', () => {
  const baseFilters = { questionType: ['free-response'] }
  const essays = getQuestions({
    topic: 'ap-chemistry',
    filters: { ...baseFilters, responseFormat: ['essay'] },
  })
  const gridIns = getQuestions({
    topic: 'ap-chemistry',
    filters: { ...baseFilters, responseFormat: ['grid-in'] },
  })
  const both = getQuestions({
    topic: 'ap-chemistry',
    filters: { ...baseFilters, responseFormat: ['essay', 'grid-in'] },
  })

  assert.equal(essays.length, 2)
  assert.equal(gridIns.length, 1)
  assert.equal(both.length, 3)
})

test('multiple-choice and free-response can be mixed in one question pool', () => {
  const chemistry = findTopicBySlug('ap-chemistry')
  const questions = getQuestions({
    topic: 'ap-chemistry',
    filters: { questionType: ['multiple-choice', 'free-response'] },
    filterGroups: chemistry.questionFilters,
  })

  assert.equal(questions.length, 4)
  assert.ok(questions.some((question) => question.classifications.questionType.includes('multiple-choice')))
  assert.ok(questions.some((question) => question.classifications.questionType.includes('free-response')))
})

test('chemistry question types stay selectable and response formats only narrow free responses', () => {
  const chemistry = findTopicBySlug('ap-chemistry')
  const equilibriumFilters = { domain: ['equilibrium'] }
  const availableTypes = getAvailableFilterGroups(chemistry, equilibriumFilters)
    .find((group) => group.id === 'questionType')

  assert.deepEqual(availableTypes.options.map((option) => option.id), ['multiple-choice', 'free-response'])
  assert.deepEqual(reconcileFilterSelections(chemistry, {
    ...equilibriumFilters,
    questionType: ['multiple-choice', 'free-response'],
  }), {
    ...equilibriumFilters,
    questionType: ['multiple-choice', 'free-response'],
  })

  const questions = getQuestions({
    topic: 'ap-chemistry',
    filters: {
      questionType: ['multiple-choice', 'free-response'],
      responseFormat: ['essay'],
    },
    filterGroups: chemistry.questionFilters,
  })
  assert.equal(questions.length, 3)
  assert.ok(questions.some((question) => question.classifications.questionType.includes('multiple-choice')))
  assert.ok(questions.every((question) => (
    question.classifications.questionType.includes('multiple-choice')
    || question.classifications.responseFormat.includes('essay')
  )))
})

test('SAT selected-response and student-produced responses can be mixed', () => {
  const questions = getQuestions({
    topic: 'sat-math',
    filters: { questionType: ['multiple-choice', 'student-produced-response'] },
  })

  assert.equal(questions.length, 11)
  assert.ok(questions.some((question) => question.renderer === 'multiple-choice'))
  assert.ok(questions.some((question) => question.renderer === 'grid-in'))
})

test('generic filters use OR within a group and AND across groups', () => {
  const question = {
    classifications: {
      questionType: ['multiple-choice'],
      material: ['geometry', 'algebra'],
      module: ['module-1'],
    },
  }

  assert.equal(matchesFilters(question, { material: ['statistics', 'geometry'] }), true)
  assert.equal(matchesFilters(question, { material: ['geometry'], module: ['module-1'] }), true)
  assert.equal(matchesFilters(question, { material: ['geometry'], module: ['module-2'] }), false)
})

test('repository applies generic selections and reconciles impossible values', () => {
  const satMath = findTopicBySlug('sat-math')
  const geometry = getQuestions({
    topic: satMath.slug,
    filters: { questionType: ['multiple-choice'], domain: ['geometry-trigonometry'] },
  })
  const reconciled = reconcileFilterSelections(satMath, {
    questionType: ['multiple-choice'],
    domain: ['not-a-real-domain'],
  })

  assert.equal(geometry.length, 3)
  assert.deepEqual(reconciled, { questionType: ['multiple-choice'] })
})

test('SAT Math defines a complete domain and skill hierarchy', () => {
  const subject = getSubject('sat-math')
  assert.equal(subject.examId, 'sat')
  assert.deepEqual(subject.domains.map((domain) => domain.id), [
    'algebra', 'advanced-math', 'problem-solving-data-analysis', 'geometry-trigonometry',
  ])
  assert.equal(subject.domains.flatMap((domain) => domain.skills).length, 20)
  assert.ok(subject.domains.every((domain) => domain.description))
  assert.ok(subject.domains.flatMap((domain) => domain.skills).every((skill) => skill.description))
  assert.equal(getDomain('sat-math', 'advanced-math').label, 'Advanced Math')
  assert.equal(getSkill('sat-math', 'circles').domainId, 'geometry-trigonometry')
})

test('skill browser URLs use stable taxonomy IDs and resolve direct targets', () => {
  assert.equal(
    createSkillBrowserUrl('sat-math', 'linear-functions'),
    '/topics.html?topic=sat-math&domain=algebra&skill=linear-functions',
  )
  assert.equal(
    createSkillPracticeUrl('sat-math', 'linear-functions'),
    '/questions.html?topic=sat-math&domain=algebra&skill=linear-functions',
  )
  const target = resolveSubjectLocation('sat-math', {
    domainId: 'algebra', skillId: 'linear-functions',
  })
  assert.equal(target.status, 'valid')
  assert.equal(target.domain.label, 'Algebra')
  assert.equal(target.skill.label, 'Linear functions')
  assert.equal(
    createSkillChatUrl('sat-math', 'linear-equations-one-variable'),
    '/chat.html?exam=sat&test=sat-math&unit=algebra&skill=linear-equations-one-variable',
  )
  assert.equal(
    createSkillChatUrl('sat-math', 'linear-functions'),
    '/chat.html?exam=sat&test=sat-math&unit=algebra&skill=linear-functions',
  )
  assert.equal(getSkill('sat-math', 'linear-equations-one-variable').tutor.provider, 'sat-math-tutor')
  assert.equal(getSkill('sat-math', 'linear-functions').tutor.provider, 'sat-math-tutor')
  assert.equal(getSkill('sat-math', 'circles').tutor.provider, 'sat-math-tutor')
  assert.equal(getSubject('sat-math').domains.flatMap((domain) => domain.skills).every((skill) => skill.tutor), true)
})

test('direct practice targets preselect domain and skill filters', () => {
  const filters = getPracticeFilters('sat-math', {
    domainId: 'geometry-trigonometry', skillId: 'area-volume',
  })
  assert.deepEqual(filters, {
    domain: ['geometry-trigonometry'], skill: ['area-volume'],
  })
  const questions = getQuestions({ topic: 'sat-math', filters })
  assert.equal(questions.length, 1)
  assert.equal(questions[0].id, 'sat-math-grid-in-geometry-001')
})

test('valid direct skill selections remain visible when questions are not seeded yet', () => {
  const satMath = findTopicBySlug('sat-math')
  const filters = getPracticeFilters('sat-math', {
    domainId: 'algebra', skillId: 'linear-functions',
  })
  assert.deepEqual(reconcileFilterSelections(satMath, filters), filters)
  const skillGroup = getAvailableFilterGroups(satMath, filters).find((group) => group.id === 'skill')
  assert.ok(skillGroup.options.some((option) => option.id === 'linear-functions'))
  assert.equal(getQuestions({ topic: 'sat-math', filters }).length, 0)
})

test('invalid direct taxonomy targets fail safely', () => {
  assert.equal(resolveSubjectLocation('sat-math', { skillId: 'unknown-skill' }).status, 'invalid-target')
  assert.equal(resolveSubjectLocation('sat-math', {
    domainId: 'algebra', skillId: 'circles',
  }).status, 'invalid-target')
  assert.deepEqual(getPracticeFilters('sat-math', { skillId: 'unknown-skill' }), {})
  assert.equal(createSkillPracticeUrl('sat-math', 'unknown-skill'), null)
})

test('skills progressively disclose under selected domains', () => {
  const satMath = findTopicBySlug('sat-math')
  assert.equal(getAvailableFilterGroups(satMath).some((group) => group.id === 'skill'), false)
  const groups = getAvailableFilterGroups(satMath, { domain: ['geometry-trigonometry'] })
  assert.deepEqual(groups.find((group) => group.id === 'skill').options.map((option) => option.id), [
    'area-volume', 'lines-angles-triangles',
  ])
})

test('AP Chemistry topics progressively disclose under canonical units', () => {
  const chemistry = findTopicBySlug('ap-chemistry')
  assert.equal(getAvailableFilterGroups(chemistry).some((group) => group.id === 'skill'), false)
  const groups = getAvailableFilterGroups(chemistry, { domain: ['equilibrium'] })
  assert.deepEqual(groups.find((group) => group.id === 'skill').options.map((option) => option.id), [
    'introduction-equilibrium',
    'direction-reversible-reactions',
    'reaction-quotient-equilibrium-constant',
    'calculating-equilibrium-constant',
    'magnitude-equilibrium-constant',
    'properties-equilibrium-constant',
    'calculating-equilibrium-concentrations',
    'representations-equilibrium',
    'introduction-le-chatelier-principle',
    'reaction-quotient-le-chatelier-principle',
    'introduction-solubility-equilibria',
    'common-ion-effect',
  ])
})

test('AP Chemistry direct topic URLs use canonical taxonomy ids', () => {
  assert.equal(
    createSkillBrowserUrl('ap-chemistry', 'introduction-equilibrium'),
    '/topics.html?topic=ap-chemistry&domain=equilibrium&skill=introduction-equilibrium',
  )
  assert.equal(
    createSkillPracticeUrl('ap-chemistry', 'introduction-equilibrium'),
    '/questions.html?topic=ap-chemistry&domain=equilibrium&skill=introduction-equilibrium',
  )
  assert.equal(
    createSkillChatUrl('ap-chemistry', 'introduction-equilibrium'),
    '/chat.html?exam=ap&test=ap-chemistry&unit=equilibrium&skill=introduction-equilibrium',
  )
})

test('SAT questions carry valid taxonomy, provenance, and context targets', () => {
  const questions = demoQuestions.filter((question) => question.topic === 'sat-math')
  assert.ok(questions.every(validateQuestionTaxonomy))
  assert.ok(questions.every((question) => question.source.kind === 'ai-generated'))
  assert.deepEqual(createContextTarget({
    examId: 'sat', subjectId: 'sat-math', domainId: 'algebra', skillId: 'linear-functions',
  }), {
    level: 'skill', examId: 'sat', subjectId: 'sat-math', domainId: 'algebra', skillId: 'linear-functions',
  })
  assert.equal(createContextTarget({
    examId: 'sat', subjectId: 'sat-math', domainId: 'algebra', skillId: 'circles',
  }), null)
})
