import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '../firebase.js'
import { createMockTutorResponse } from './mockTutor.js'

export const CHAT_MODE = import.meta.env.VITE_CHAT_MODE === 'firebase' ? 'firebase' : 'mock'
let callableTutor = null

function getTutorCallable() {
  if (callableTutor) return callableTutor
  const functions = getFunctions(app, 'us-central1')
  if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true') {
    connectFunctionsEmulator(functions, '127.0.0.1', 5001)
  }
  callableTutor = httpsCallable(functions, 'satMathTutor', { timeout: 60_000 })
  return callableTutor
}

export async function requestTutorReply(request) {
  if (CHAT_MODE === 'mock') {
    await new Promise((resolve) => window.setTimeout(resolve, 450))
    return { ...createMockTutorResponse(request), mode: 'mock' }
  }

  const result = await getTutorCallable()(request)
  return { ...result.data, mode: 'firebase' }
}

export function getChatErrorMessage(error) {
  if (error?.code === 'functions/resource-exhausted') return 'The tutor is busy right now. Please retry in a moment.'
  if (error?.code === 'functions/invalid-argument') return 'That request was not accepted. Check the message and try again.'
  if (error?.code === 'functions/failed-precondition') return 'The tutor is not configured yet.'
  return error?.message || 'The tutor could not answer. Please retry.'
}
