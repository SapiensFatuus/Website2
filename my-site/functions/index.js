import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore'
import { onRequest } from 'firebase-functions/v2/https'
import { logger } from 'firebase-functions'

initializeApp()

const db = getFirestore()
const ACTIVE_USER_TIMEOUT_MS = 30_000
const TRACKER_DOC_PATH = 'tracker/stats'
const VISITORS_COLLECTION_PATH = 'tracker/stats/visitors'
const API_BASE_PATH = '/api'

function json(response, statusCode, payload) {
  response.status(statusCode).set('Content-Type', 'application/json').send(payload)
}

function getVisitorId(request) {
  const visitorId = request.body?.visitorId

  if (typeof visitorId !== 'string') {
    return null
  }

  const normalizedVisitorId = visitorId.trim()
  return normalizedVisitorId || null
}

function getRoutePath(request) {
  if (!request.path) {
    return '/'
  }

  return request.path.startsWith(API_BASE_PATH)
    ? request.path.slice(API_BASE_PATH.length) || '/'
    : request.path
}

async function getTrackerStats() {
  const trackerRef = db.doc(TRACKER_DOC_PATH)
  const trackerSnapshot = await trackerRef.get()
  const trackerData = trackerSnapshot.exists ? trackerSnapshot.data() : {}
  const activeCutoff = Timestamp.fromMillis(Date.now() - ACTIVE_USER_TIMEOUT_MS)
  const activeVisitorsSnapshot = await db
    .collection(VISITORS_COLLECTION_PATH)
    .where('lastSeenAt', '>=', activeCutoff)
    .count()
    .get()

  return {
    activeUsers: activeVisitorsSnapshot.data().count,
    peakActiveUsers: trackerData?.peakActiveUsers ?? 0,
    totalUsers: trackerData?.totalUsers ?? 0,
    totalVisits: trackerData?.totalVisits ?? 0,
    timeoutSeconds: trackerData?.timeoutSeconds ?? ACTIVE_USER_TIMEOUT_MS / 1000,
  }
}

async function recordPing(visitorId) {
  const trackerRef = db.doc(TRACKER_DOC_PATH)
  const visitorRef = db.doc(`${VISITORS_COLLECTION_PATH}/${visitorId}`)
  const now = Timestamp.now()

  await db.runTransaction(async (transaction) => {
    const [trackerSnapshot, visitorSnapshot] = await Promise.all([
      transaction.get(trackerRef),
      transaction.get(visitorRef),
    ])
    const trackerData = trackerSnapshot.exists ? trackerSnapshot.data() : {}

    transaction.set(
      visitorRef,
      {
        firstSeenAt: visitorSnapshot.exists ? visitorSnapshot.data().firstSeenAt ?? now : now,
        lastSeenAt: now,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    transaction.set(
      trackerRef,
      {
        totalUsers: visitorSnapshot.exists ? trackerData.totalUsers ?? 0 : (trackerData.totalUsers ?? 0) + 1,
        totalVisits: trackerData.totalVisits ?? 0,
        peakActiveUsers: trackerData.peakActiveUsers ?? 0,
        timeoutSeconds: ACTIVE_USER_TIMEOUT_MS / 1000,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
  })

  const stats = await getTrackerStats()

  if (stats.activeUsers > stats.peakActiveUsers) {
    await trackerRef.set(
      {
        peakActiveUsers: stats.activeUsers,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
    stats.peakActiveUsers = stats.activeUsers
  }

  return stats
}

async function recordVisit() {
  const trackerRef = db.doc(TRACKER_DOC_PATH)

  await db.runTransaction(async (transaction) => {
    const trackerSnapshot = await transaction.get(trackerRef)
    const trackerData = trackerSnapshot.exists ? trackerSnapshot.data() : {}

    transaction.set(
      trackerRef,
      {
        totalUsers: trackerData.totalUsers ?? 0,
        totalVisits: (trackerData.totalVisits ?? 0) + 1,
        peakActiveUsers: trackerData.peakActiveUsers ?? 0,
        timeoutSeconds: ACTIVE_USER_TIMEOUT_MS / 1000,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
  })

  return getTrackerStats()
}

async function trackerHandler(request, response) {
  response.set('Cache-Control', 'no-store')
  const routePath = getRoutePath(request)

  if (request.method === 'OPTIONS') {
    response.status(204).send('')
    return
  }

  try {
    if (routePath === '/stats' && request.method === 'GET') {
      json(response, 200, await getTrackerStats())
      return
    }

    if (routePath === '/ping' && request.method === 'POST') {
      const visitorId = getVisitorId(request)

      if (!visitorId) {
        json(response, 400, { error: 'A visitor ID is required.' })
        return
      }

      json(response, 200, await recordPing(visitorId))
      return
    }

    if (routePath === '/visit' && request.method === 'POST') {
      json(response, 200, await recordVisit())
      return
    }

    json(response, 404, { error: 'Not found.' })
  } catch (error) {
    logger.error('Tracker request failed', error)
    json(response, 500, { error: 'Internal server error.' })
  }
}

export const api = onRequest(
  {
    cors: true,
    invoker: 'public',
  },
  trackerHandler,
)
