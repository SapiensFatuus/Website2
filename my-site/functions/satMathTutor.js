import { vertexAI } from '@genkit-ai/google-genai'
import { genkit, z } from 'genkit'
import {
  buildTutorPrompt,
  createInsufficientContextResponse,
  sanitizeTutorOutput,
  selectRelevantMaterials,
  validateTutorRequest,
} from './satMathTutorCore.js'

export const TutorInputSchema = z.object({
  target: z.object({
    examId: z.string(),
    subjectId: z.string(),
    domainId: z.string(),
    skillId: z.string(),
  }),
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
})

export const TutorOutputSchema = z.object({
  answer: z.string(),
  sourceIds: z.array(z.string()),
  insufficient: z.boolean(),
})

const ai = genkit({ plugins: [vertexAI({ location: 'us-central1' })] })

export const satMathTutorFlow = ai.defineFlow(
  {
    name: 'satMathTutorFlow',
    inputSchema: TutorInputSchema,
    outputSchema: TutorOutputSchema,
  },
  async (input) => {
    const validation = validateTutorRequest(input)
    if (!validation.valid) throw new Error(validation.error)
    const { contextPack } = validation
    const materials = selectRelevantMaterials(contextPack, validation.value.message, validation.value.history)
    if (!materials.length) return createInsufficientContextResponse(contextPack)

    const response = await ai.generate({
      model: vertexAI.model('gemini-2.5-flash'),
      prompt: buildTutorPrompt({ ...validation.value, contextPack, materials }),
      output: { schema: TutorOutputSchema },
      config: { temperature: 0.2, maxOutputTokens: 900 },
    })
    const output = response.output
    if (!output) throw new Error('Gemini returned no structured response.')
    return sanitizeTutorOutput(output, materials, contextPack)
  },
)
