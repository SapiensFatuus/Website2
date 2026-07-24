import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { app } from './firebaseApp.js'
import { clientEnvironment } from './environment.js'

if (typeof window !== 'undefined' && clientEnvironment.appCheckDebugToken) {
  globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = clientEnvironment.appCheckDebugToken === 'true'
    ? true
    : clientEnvironment.appCheckDebugToken
}

if (typeof window !== 'undefined' && clientEnvironment.appCheckSiteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(clientEnvironment.appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  })
}
const analyticsPromise =
  typeof window === 'undefined'
    ? Promise.resolve(null)
    : isSupported()
        .then((supported) => (supported ? getAnalytics(app) : null))
        .catch(() => null)

export { analyticsPromise, app }

export async function trackEvent(eventName, eventParams = {}) {
  const analytics = await analyticsPromise
  if (analytics) {
    logEvent(analytics, eventName, eventParams)
  }
}
