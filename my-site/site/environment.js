const TRUE = 'true'

function enabled(value) {
  return value === TRUE
}

export function resolveClientEnvironment(environment = {}) {
  const useFirebaseEmulators = enabled(environment.VITE_USE_FIREBASE_EMULATORS)
  const requestedChatMode = environment.VITE_CHAT_MODE
  const chatMode = requestedChatMode === 'firebase' || useFirebaseEmulators ? 'firebase' : 'mock'
  const trackerMode = environment.VITE_TRACKER_MODE === 'firebase'
    || useFirebaseEmulators
    || environment.PROD
    ? 'firebase'
    : 'mock'

  return Object.freeze({
    chatMode,
    trackerMode,
    useAuthEmulator: useFirebaseEmulators || enabled(environment.VITE_USE_AUTH_EMULATOR),
    useFirestoreEmulator: useFirebaseEmulators || enabled(environment.VITE_USE_FIRESTORE_EMULATOR),
    useFunctionsEmulator: useFirebaseEmulators || enabled(environment.VITE_USE_FUNCTIONS_EMULATOR),
    useStorageEmulator: useFirebaseEmulators || enabled(environment.VITE_USE_STORAGE_EMULATOR),
    appCheckSiteKey: environment.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY || '',
    appCheckDebugToken: environment.DEV ? environment.VITE_APPCHECK_DEBUG_TOKEN || '' : '',
    editorialPreview: Boolean(environment.DEV) && enabled(environment.VITE_EDITORIAL_PREVIEW),
  })
}

export const clientEnvironment = resolveClientEnvironment(import.meta.env ?? {})
