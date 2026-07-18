import { vertexAI } from '@genkit-ai/google-genai'
import { genkit, z } from 'genkit'
import {
  buildTutorPrompt,
  buildTutorPromptParts,
  prepareTutorRequest,
  sanitizeTutorOutput,
  validateTutorRequest,
} from './satMathTutorCore.js'

const TutorTargetSchema = z.object({
  scope: z.enum(['skill', 'domain', 'subject']).optional(),
  examId: z.string(),
  subjectId: z.string(),
  domainId: z.string().optional(),
  skillId: z.string().optional(),
})

export const TutorInputSchema = z.object({
  target: TutorTargetSchema,
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
})

export const TutorModelOutputSchema = z.object({
  answer: z.string(),
  sourceIds: z.array(z.string()),
  insufficient: z.boolean(),
  scopeNotice: z.string(),
  classification: z.enum(['same-scope', 'adjusted-within-subject', 'broadened', 'outside-subject']),
})

export const TutorOutputSchema = TutorModelOutputSchema.extend({
  effectiveTarget: TutorTargetSchema,
  sources: z.array(z.object({ id: z.string(), label: z.string() })),
})

const ai = genkit({ plugins: [vertexAI({ location: 'us-central1' })] })

export async function runTutorRequest(input, attachment = null) {
  const validation = validateTutorRequest(input)
  if (!validation.valid) throw new Error(validation.error)
  const prepared = prepareTutorRequest(validation.value)
  if (!prepared) throw new Error('The tutor could not resolve this request scope.')

  const prompt = buildTutorPrompt({ ...validation.value, ...prepared })
  const response = await ai.generate({
    model: vertexAI.model('gemini-2.5-flash'),
    prompt: buildTutorPromptParts(prompt, attachment),
    output: { schema: TutorModelOutputSchema },
    config: { temperature: 0.3, maxOutputTokens: 1400 },
  })
  const output = response.output
  if (!output) throw new Error('Gemini returned no structured response.')
  return sanitizeTutorOutput(output, prepared.materials, prepared.resolution)
}

export const satMathTutorFlow = ai.defineFlow(
  {
    name: 'satMathTutorFlow',
    inputSchema: TutorInputSchema,
    outputSchema: TutorOutputSchema,
  },
  (input) => runTutorRequest(input),
)
