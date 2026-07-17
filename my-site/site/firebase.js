import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCxBAijhhqy9V6VFgz6rudUMTecsOj8NxU',
  authDomain: 'website2-c8d1e.firebaseapp.com',
  projectId: 'website2-c8d1e',
  storageBucket: 'website2-c8d1e.firebasestorage.app',
  messagingSenderId: '280628917991',
  appId: '1:280628917991:web:ee6dc4a0ce66a098f79442',
  measurementId: 'G-T02FEBDSQ8',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const environment = import.meta.env ?? {}
const appCheckSiteKey = environment.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY
const useFirestoreEmulator = environment.VITE_USE_FIRESTORE_EMULATOR === 'true'

if (typeof window !== 'undefined' && useFirestoreEmulator) {
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}

if (typeof window !== 'undefined' && appCheckSiteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  })
}
const analyticsPromise =
  typeof window === 'undefined'
    ? Promise.resolve(null)
    : isSupported()
        .then((supported) => (supported ? getAnalytics(app) : null))
        .catch(() => null)

export { analyticsPromise, app, auth, db }

export async function trackEvent(eventName, eventParams = {}) {
  const analytics = await analyticsPromise
  if (analytics) {
    logEvent(analytics, eventName, eventParams)
  }
}
