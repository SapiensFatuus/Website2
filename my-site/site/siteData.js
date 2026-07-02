export const topics = [
  {
    title: 'SAT: Math',
    slug: 'sat-math',
    summary:
      'Includes algebra, geometry, and data analysis. Most questions are calculator and non-calculator based, with about 58 questions total.',
  },
  {
    title: 'SAT: Reading & Writing',
    slug: 'sat-reading-writing',
    summary:
      'Tests reading comprehension and grammar. The section includes passage-based reading and writing/editing questions.',
  },
  {
    title: 'AP Chemistry',
    slug: 'ap-chemistry',
    summary:
      'Covers atomic structure, reactions, thermodynamics, and lab-based reasoning. The exam has multiple choice and free response sections.',
  },
  {
    title: 'AP Lang & Composition',
    slug: 'ap-lang-comp',
    summary:
      'Focuses on rhetorical analysis, argument, and synthesis. The exam is mostly essay-based with some multiple-choice reading questions.',
  },
  {
    title: 'AP US History',
    slug: 'ap-us-history',
    summary:
      'Tests U.S. history knowledge from pre-colonial times to the present, including documents and essay writing.',
  },
  {
    title: 'AP Biology',
    slug: 'ap-biology',
    summary:
      'Includes molecules, cells, genetics, evolution, and ecology. The exam combines multiple-choice and free-response questions.',
  },
  {
    title: 'AP Calculus',
    slug: 'ap-calculus',
    summary:
      'Covers limits, derivatives, integrals, and the Fundamental Theorem of Calculus. The test is calculation-heavy and concept-driven.',
  },
  {
    title: 'AP Physics',
    slug: 'ap-physics',
    summary:
      'Covers mechanics, electricity, waves, and thermodynamics. Often split into multiple exam variants depending on the course level.',
  },
  {
    title: 'AP Government & Politics',
    slug: 'ap-government',
    summary:
      'Focuses on U.S. government institutions, political behavior, and public policy. The exam combines multiple choice and free-response questions.',
  },
  {
    title: 'AP Literature',
    slug: 'ap-literature',
    summary:
      'Tests reading and writing skills through poetry, prose, and literary analysis. The exam includes multiple-choice and essay sections.',
  },
]

const topicStats = {
  'sat-math': { sections: '2', passRate: '65%', fiveRate: '-' },
  'sat-reading-writing': { sections: '2', passRate: '58%', fiveRate: '-' },
  'ap-chemistry': { sections: '2', passRate: '65%', fiveRate: '15%' },
  'ap-lang-comp': { sections: '2', passRate: '60%', fiveRate: '10%' },
  'ap-us-history': { sections: '3', passRate: '62%', fiveRate: '12%' },
  'ap-biology': { sections: '2', passRate: '63%', fiveRate: '21%' },
  'ap-calculus': { sections: '2', passRate: '60%', fiveRate: '24%' },
  'ap-physics': { sections: '2', passRate: '58%', fiveRate: '15%' },
  'ap-government': { sections: '2', passRate: '65%', fiveRate: '20%' },
  'ap-literature': { sections: '2', passRate: '62%', fiveRate: '10%' },
}

export function getTopicStats(slug) {
  return topicStats[slug] || { sections: 'N/A', passRate: 'N/A', fiveRate: 'N/A' }
}

export function findTopicBySlug(slug) {
  return topics.find((topic) => topic.slug === slug) || null
}
