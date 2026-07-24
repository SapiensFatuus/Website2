export const DEPLOYED_STUDY_TUTOR_ORIGINS = Object.freeze([
  'https://website2-c8d1e.web.app',
  'https://website2-c8d1e.firebaseapp.com',
])

const LOCAL_STUDY_TUTOR_ORIGINS = Object.freeze([
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/,
  /^http:\/\/localhost(?::\d+)?$/,
])

export function getStudyTutorCors({ functionsEmulator = globalThis.process?.env?.FUNCTIONS_EMULATOR === 'true' } = {}) {
  return functionsEmulator
    ? [...DEPLOYED_STUDY_TUTOR_ORIGINS, ...LOCAL_STUDY_TUTOR_ORIGINS]
    : [...DEPLOYED_STUDY_TUTOR_ORIGINS]
}
