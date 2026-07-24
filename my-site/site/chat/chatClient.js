import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '../firebaseApp.js'
import { clientEnvironment } from '../environment.js'
import { createMockTutorResponse } from './mockTutor.js'

export const CHAT_MODE = clientEnvironment.chatMode
const callableTutors = new Map()
const functionsClient = getFunctions(app, 'us-central1')

if (clientEnvironment.useFunctionsEmulator) {
  connectFunctionsEmulator(functionsClient, '127.0.0.1', 5001)
}

function getTutorCallable(name) {
  if (callableTutors.has(name)) return callableTutors.get(name)
  const callableTutor = httpsCallable(functionsClient, name, { timeout: 60_000 })
  callableTutors.set(name, callableTutor)
  return callableTutor
}

export async function requestTutorReply(request) {
  if (CHAT_MODE === 'mock') {
    await new Promise((resolve) => window.setTimeout(resolve, 450))
    const response = createMockTutorResponse(request)
    if (request.mockAttachment) {
      return {
        ...response,
        answer: `Local photo preview is working, but mock mode did not upload or analyze ${request.mockAttachment.name}. Start the Firebase emulators or use the deployed tutor for real image analysis.\n\n${response.answer}`,
        mode: 'mock',
      }
    }
    return { ...response, mode: 'mock' }
  }

  const callableName = request.target?.subjectId === 'ap-chemistry' ? 'studyTutor' : 'satMathTutor'
  const result = await getTutorCallable(callableName)(request)
  return { ...result.data, mode: 'firebase' }
}

export function getChatErrorMessage(error) {
  if (error?.code === 'functions/resource-exhausted') return "You have reached today's limit of 10 photo analyses. Please try again tomorrow."
  if (error?.code === 'functions/invalid-argument') return 'That request was not accepted. Check the message and try again.'
  if (error?.code === 'functions/failed-precondition') return 'The tutor is not configured yet.'
  if (error?.code === 'functions/unauthenticated') return 'Sign in with Google to attach a homework photo.'
  if (error?.code === 'functions/permission-denied') return 'That homework photo is not available for this account. Attach it again and retry.'
  return error?.message || 'The tutor could not answer. Please retry.'
}
