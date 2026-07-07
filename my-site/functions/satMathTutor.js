import { vertexAI } from '@genkit-ai/google-genai'
import { genkit, z } from 'genkit'
import {
  buildTutorPrompt,
  createInsufficientContextResponse,
  selectRelevantMaterials,
  validateTutorRequest,
} from './satMathTutorCore.js'

export const TutorInputSchema = z.object({
  target: z.object({
    examId: z.literal('sat'),
    subjectId: z.literal('sat-math'),
    domainId: z.literal('algebra'),
    skillId: z.literal('linear-equations-one-variable'),
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
    const materials = selectRelevantMaterials(validation.value.message, validation.value.history)
    if (!materials.length) return createInsufficientContextResponse()

    const response = await ai.generate({
      model: vertexAI.model('gemini-2.5-flash'),
      prompt: buildTutorPrompt({ ...validation.value, materials }),
      output: { schema: TutorOutputSchema },
      config: { temperature: 0.2, maxOutputTokens: 900 },
    })
    const output = response.output
    if (!output) throw new Error('Gemini returned no structured response.')
    const allowedIds = new Set(materials.map((material) => material.id))
    const sourceIds = output.sourceIds.filter((id) => allowedIds.has(id))
    if (output.insufficient || !sourceIds.length) return createInsufficientContextResponse()
    return { ...output, sourceIds, insufficient: false }
  },
)
