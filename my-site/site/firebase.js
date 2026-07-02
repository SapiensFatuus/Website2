import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'

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
const analyticsPromise =
  typeof window === 'undefined'
    ? Promise.resolve(null)
    : isSupported()
        .then((supported) => (supported ? getAnalytics(app) : null))
        .catch(() => null)

export { analyticsPromise }

export async function trackEvent(eventName, eventParams = {}) {
  const analytics = await analyticsPromise
  if (analytics) {
    logEvent(analytics, eventName, eventParams)
  }
}
