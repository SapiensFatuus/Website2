import { createSubjectFilters } from './taxonomy/contentTaxonomy.js'

const defaultActions = [
  {
    label: 'Ask Questions',
    helpText: 'Ask the test tutor for explanations, step-by-step help, strategy, or a study plan.',
  },
  {
    label: 'Practice Questions',
    helpText: 'Try sample questions to check your understanding and spot weak areas.',
  },
  {
    label: 'View Topics',
    helpText: 'Browse the test’s units and skills when you want more focused help.',
  },
]

const defaultOverviewCards = [
  { label: 'Sections', value: 'N/A' },
  { label: 'Pass Rate', value: 'N/A' },
  { label: '5 Rate', value: 'N/A' },
]

const defaultSections = [
  { name: 'Section details coming soon', format: 'TBD', duration: 'TBD' },
]

const commonMaterials = {
  'sat-math': [
    { id: 'algebra', label: 'Algebra' },
    { id: 'geometry', label: 'Geometry' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'advanced-math', label: 'Advanced Math' },
  ],
  'ap-chemistry': [
    { id: 'atomic-structure', label: 'Atomic Structure' },
    { id: 'reactions', label: 'Chemical Reactions' },
    { id: 'thermodynamics', label: 'Thermodynamics' },
    { id: 'equilibrium', label: 'Equilibrium' },
  ],
}

function createQuestionFilters(topic) {
  const isSatMath = topic.slug === 'sat-math'
  if (isSatMath) return createSubjectFilters('sat-math')
  const questionTypeOptions = isSatMath
    ? [
        { id: 'multiple-choice', label: 'Multiple Choice', renderer: 'multiple-choice' },
        { id: 'grid-in', label: 'Grid-In', renderer: 'grid-in' },
      ]
    : [
        { id: 'multiple-choice', label: 'Multiple Choice', renderer: 'multiple-choice' },
        { id: 'free-response', label: 'Free Response', renderer: 'free-response' },
      ]
  const groups = [
    {
      id: 'questionType',
      label: 'Question type',
      selection: 'multi',
      options: questionTypeOptions,
    },
  ]

  if (topic.freeResponseFormats?.length) {
    groups.push({
      id: 'responseFormat',
      label: 'Response format',
      selection: 'multi',
      visibleWhen: { groupId: 'questionType', includesAny: ['free-response'] },
      options: topic.freeResponseFormats,
    })
  }

  groups.push({
    id: 'material',
    label: 'Material',
    selection: 'multi',
    reporting: true,
    options: commonMaterials[topic.slug] || [],
  })

  return groups
}

function createTopic(topic) {
  return {
    ...topic,
    overviewCards: topic.overviewCards || defaultOverviewCards,
    sections: topic.sections || defaultSections,
    actions: topic.actions || defaultActions,
    questionFilters: topic.questionFilters || createQuestionFilters(topic),
  }
}

export const topics = [
  createTopic({
    title: 'SAT: Math',
    slug: 'sat-math',
    summary:
      'Includes algebra, geometry, advanced math, and data analysis. The digital SAT Math test mixes calculator-friendly questions with student-produced responses.',
    overviewCards: [
      { label: 'Sections', value: '2' },
      {
        label: 'Average Score',
        value: '520',
        helpText: 'This is the approximate average SAT Math section score out of 800.',
      },
      {
        label: 'Question Count',
        value: '44',
        helpText: 'SAT Math includes 44 total questions across both modules.',
      },
    ],
    sections: [
      { name: 'Module 1', format: 'Multiple Choice + Grid-In', duration: '35 min', breakDuration: '10 min' },
      { name: 'Module 2', format: 'Multiple Choice + Grid-In', duration: '35 min' },
    ],
  }),
  createTopic({
    title: 'SAT: Reading & Writing',
    slug: 'sat-reading-writing',
    summary:
      'Tests reading comprehension, grammar, and revision skills through short passages and focused multiple-choice questions.',
    overviewCards: [
      { label: 'Sections', value: '2' },
      {
        label: 'Average Score',
        value: '520',
        helpText: 'This is the approximate average SAT Reading and Writing section score out of 800.',
      },
      {
        label: 'Question Count',
        value: '54',
        helpText: 'SAT Reading and Writing includes 54 total questions across two modules.',
      },
    ],
    sections: [
      { name: 'Module 1', format: 'Multiple Choice', duration: '32 min', breakDuration: '10 min' },
      { name: 'Module 2', format: 'Multiple Choice', duration: '32 min' },
    ],
  }),
  createTopic({
    title: 'AP Chemistry',
    slug: 'ap-chemistry',
    freeResponseFormats: [
      { id: 'essay', label: 'Essay' },
      { id: 'grid-in', label: 'Grid-In' },
    ],
    summary:
      'Covers atomic structure, reactions, thermodynamics, equilibrium, and lab-based reasoning with both selected-response and written work.',
    overviewCards: [
      { label: 'Sections', value: '2' },
      {
        label: 'Pass Rate',
        value: '65%',
        helpText: 'Pass Rate is the share of students who earn a 3, 4, or 5 on the AP exam.',
      },
      {
        label: '5 Rate',
        value: '15%',
        helpText: '5 Rate shows how often students earn the top AP score.',
      },
    ],
    sections: [
      { name: 'Section 1', format: 'Multiple Choice', duration: '90 min', breakDuration: '10 min' },
      { name: 'Section 2', format: 'Free Response', duration: '105 min' },
    ],
  }),
  createTopic({
    title: 'AP Lang & Composition',
    slug: 'ap-lang-comp',
    summary:
      'Focuses on rhetorical analysis, synthesis, and argument writing, combining reading comprehension with essay-based writing tasks.',
    overviewCards: [
      { label: 'Sections', value: '2' },
      {
        label: 'Pass Rate',
        value: '60%',
        helpText: 'Pass Rate is the share of students who earn a 3, 4, or 5 on the AP exam.',
      },
      {
        label: '5 Rate',
        value: '10%',
        helpText: '5 Rate shows how often students earn the top AP score.',
      },
    ],
    sections: [
      { name: 'Section 1', format: 'Multiple Choice', duration: '60 min', breakDuration: '15 min' },
      { name: 'Section 2', format: 'Free Response', duration: '120 min' },
    ],
  }),
  createTopic({
    title: 'AP US History',
    slug: 'ap-us-history',
    summary:
      'Tests historical thinking, document analysis, and argument writing across U.S. history from pre-colonial times to the present.',
    overviewCards: [
      { label: 'Sections', value: '3' },
      {
        label: 'Pass Rate',
        value: '62%',
        helpText: 'Pass Rate is the share of students who earn a 3, 4, or 5 on the AP exam.',
      },
      {
        label: '5 Rate',
        value: '12%',
        helpText: '5 Rate shows how often students earn the top AP score.',
      },
    ],
    sections: [
      { name: 'Part A', format: 'Multiple Choice', duration: '55 min', breakDuration: '10 min' },
      { name: 'Part B', format: 'Short Answer', duration: '40 min', breakDuration: '10 min' },
      { name: 'Part C', format: 'DBQ + Long Essay', duration: '100 min' },
    ],
  }),
  createTopic({
    title: 'AP Biology',
    slug: 'ap-biology',
    summary:
      'Includes molecules, cells, genetics, evolution, and ecology, with a strong focus on scientific reasoning and data interpretation.',
    overviewCards: [
      { label: 'Sections', value: '2' },
      {
        label: 'Pass Rate',
        value: '63%',
        helpText: 'Pass Rate is the share of students who earn a 3, 4, or 5 on the AP exam.',
      },
      {
        label: '5 Rate',
        value: '21%',
        helpText: '5 Rate shows how often students earn the top AP score.',
      },
    ],
    sections: [
      { name: 'Section 1', format: 'Multiple Choice', duration: '90 min', breakDuration: '10 min' },
      { name: 'Section 2', format: 'Free Response', duration: '90 min' },
    ],
  }),
  createTopic({
    title: 'AP Calculus',
    slug: 'ap-calculus',
    summary:
      'Covers limits, derivatives, integrals, and applications of calculus, balancing procedural skill with conceptual understanding.',
    overviewCards: [
      { label: 'Sections', value: '2' },
      {
        label: 'Pass Rate',
        value: '60%',
        helpText: 'Pass Rate is the share of students who earn a 3, 4, or 5 on the AP exam.',
      },
      {
        label: '5 Rate',
        value: '24%',
        helpText: '5 Rate shows how often students earn the top AP score.',
      },
    ],
    sections: [
      { name: 'Section 1', format: 'Multiple Choice', duration: '105 min', breakDuration: '10 min' },
      { name: 'Section 2', format: 'Free Response', duration: '90 min' },
    ],
  }),
  createTopic({
    title: 'AP Physics',
    slug: 'ap-physics',
    summary:
      'Covers mechanics, electricity, waves, and energy transfer with quantitative problem-solving and conceptual reasoning.',
    overviewCards: [
      { label: 'Sections', value: '2' },
      {
        label: 'Pass Rate',
        value: '58%',
        helpText: 'Pass Rate is the share of students who earn a 3, 4, or 5 on the AP exam.',
      },
      {
        label: '5 Rate',
        value: '15%',
        helpText: '5 Rate shows how often students earn the top AP score.',
      },
    ],
    sections: [
      { name: 'Section 1', format: 'Multiple Choice', duration: '90 min', breakDuration: '10 min' },
      { name: 'Section 2', format: 'Free Response', duration: '90 min' },
    ],
  }),
  createTopic({
    title: 'AP Government & Politics',
    slug: 'ap-government',
    summary:
      'Focuses on U.S. political institutions, constitutional principles, public policy, and political behavior.',
    overviewCards: [
      { label: 'Sections', value: '2' },
      {
        label: 'Pass Rate',
        value: '65%',
        helpText: 'Pass Rate is the share of students who earn a 3, 4, or 5 on the AP exam.',
      },
      {
        label: '5 Rate',
        value: '20%',
        helpText: '5 Rate shows how often students earn the top AP score.',
      },
    ],
    sections: [
      { name: 'Section 1', format: 'Multiple Choice', duration: '80 min', breakDuration: '10 min' },
      { name: 'Section 2', format: 'Free Response', duration: '100 min' },
    ],
  }),
  createTopic({
    title: 'AP Literature',
    slug: 'ap-literature',
    summary:
      'Tests close reading, interpretation, and literary analysis through prose, poetry, and essay writing.',
    overviewCards: [
      { label: 'Sections', value: '2' },
      {
        label: 'Pass Rate',
        value: '62%',
        helpText: 'Pass Rate is the share of students who earn a 3, 4, or 5 on the AP exam.',
      },
      {
        label: '5 Rate',
        value: '10%',
        helpText: '5 Rate shows how often students earn the top AP score.',
      },
    ],
    sections: [
      { name: 'Section 1', format: 'Multiple Choice', duration: '60 min', breakDuration: '10 min' },
      { name: 'Section 2', format: 'Free Response', duration: '120 min' },
    ],
  }),
]

export function findTopicBySlug(slug) {
  return topics.find((topic) => topic.slug === slug) || null
}
