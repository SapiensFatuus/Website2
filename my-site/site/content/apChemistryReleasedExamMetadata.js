import { validateReleasedExamMetadataCatalog } from './editorialPipeline.js'

// Intentionally empty until a human editor records high-level facts from
// public released materials. Never add protected prompt, rubric, diagram, or
// student-response content to this registry.
const records = []
const validation = validateReleasedExamMetadataCatalog(records)
if (!validation.valid) throw new Error(`Released-exam metadata invalid:\n- ${validation.errors.join('\n- ')}`)

export const apChemistryReleasedExamMetadata = Object.freeze(records)
