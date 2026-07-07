// AP Chemistry remains prototype-only legacy content. Keep this adapter isolated
// until that subject receives a canonical taxonomy and content migration.
const legacyApChemistryQuestions = [
  {
    id: 'ap-chemistry-mc-atomic-structure-001',
    topic: 'ap-chemistry',
    type: 'multiple-choice',
    material: 'Atomic Structure',
    prompt: 'Which subatomic particle determines the identity of an element?',
    options: [
      { id: 'a', text: 'Electron' },
      { id: 'b', text: 'Neutron' },
      { id: 'c', text: 'Proton' },
      { id: 'd', text: 'Photon' },
    ],
    correctOptionId: 'c',
    explanation: 'An element is defined by its number of protons, also called its atomic number.',
  },
  {
    id: 'ap-chemistry-frq-reactions-001',
    topic: 'ap-chemistry',
    type: 'free-response',
    material: 'Reactions',
    responseFormat: 'essay',
    prompt: 'Explain, at the particle level, why increasing the concentration of a reactant can increase the initial reaction rate.',
    placeholderGrading: 'always-incorrect',
    explanation: 'Free-response grading is not available yet. Your response was saved and is shown below for review.',
  },
  {
    id: 'ap-chemistry-frq-equilibrium-001',
    topic: 'ap-chemistry',
    type: 'free-response',
    material: 'Equilibrium',
    responseFormat: 'essay',
    prompt: 'A system at equilibrium is disturbed by adding more reactant. Describe how the system responds and justify your answer using Le Chatelier\'s principle.',
    placeholderGrading: 'always-incorrect',
    explanation: 'Free-response grading is not available yet. Your response was saved and is shown below for review.',
  },
  {
    id: 'ap-chemistry-frq-grid-in-001',
    topic: 'ap-chemistry',
    renderer: 'grid-in',
    prompt: 'A 2.0 mol sample of an ideal gas occupies 10.0 L. What is the molar concentration of the gas, in mol/L?',
    correctAnswer: '0.2',
    explanation: 'Molar concentration is moles divided by volume: 2.0 mol divided by 10.0 L equals 0.2 mol/L.',
    classifications: {
      questionType: ['free-response'],
      responseFormat: ['grid-in'],
      material: ['thermodynamics'],
    },
  },
]

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function adaptLegacyQuestion(question) {
  if (question.renderer && question.classifications) return question
  const { type = 'multiple-choice', material = 'Unknown', responseFormat, ...rest } = question
  return {
    ...rest,
    renderer: type,
    classifications: {
      questionType: [type],
      material: [slugify(material)],
      ...(responseFormat ? { responseFormat: [responseFormat] } : {}),
    },
  }
}

export const legacyApChemistryPracticeQuestions = Object.freeze(legacyApChemistryQuestions.map(adaptLegacyQuestion))
