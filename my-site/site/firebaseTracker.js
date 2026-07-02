const VISITOR_STORAGE_KEY = 'studyAiVisitorId'
const VISIT_SESSION_KEY = 'studyAiVisitRecorded'
const API_BASE_PATH = '/api'

export const ACTIVE_USER_TIMEOUT_MS = 30_000
export const PING_INTERVAL_MS = 5_000
export const REFRESH_INTERVAL_MS = 5_000

function createVisitorId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function getOrCreateVisitorId() {
  try {
    const savedId = window.localStorage.getItem(VISITOR_STORAGE_KEY)
    if (savedId) {
      return savedId
    }

    const visitorId = createVisitorId()
    window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId)
    return visitorId
  } catch {
    return createVisitorId()
  }
}

function hasRecordedVisit() {
  try {
    return window.sessionStorage.getItem(VISIT_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markVisitRecorded() {
  try {
    window.sessionStorage.setItem(VISIT_SESSION_KEY, '1')
  } catch {
    // Ignore browsers that block session storage.
  }
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_PATH}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Tracker request failed with status ${response.status}.`)
  }

  return response.json()
}

export function recordPing(visitorId) {
  if (!visitorId) {
    throw new Error('A visitor ID is required to record presence.')
  }

  return requestJson('/ping', {
    method: 'POST',
    body: JSON.stringify({ visitorId }),
  })
}

export async function recordVisit() {
  if (hasRecordedVisit()) {
    return getTrackerStats()
  }

  const stats = await requestJson('/visit', {
    method: 'POST',
    body: JSON.stringify({}),
  })
  markVisitRecorded()
  return stats
}

export function getTrackerStats() {
  return requestJson('/stats')
}

export function startTracker(onUpdate, onError) {
  const visitorId = getOrCreateVisitorId()
  let disposed = false

  async function refreshStats() {
    try {
      const stats = await getTrackerStats()
      if (!disposed) {
        onUpdate(stats)
      }
    } catch (error) {
      if (!disposed) {
        onError?.(error)
      }
    }
  }

  async function pingAndRefresh() {
    try {
      const stats = await recordPing(visitorId)
      if (!disposed) {
        onUpdate(stats)
      }
    } catch (error) {
      if (!disposed) {
        onError?.(error)
      }
    }
  }

  void pingAndRefresh()
  void recordVisit().then(refreshStats).catch((error) => {
    if (!disposed) {
      onError?.(error)
    }
  })

  const pingTimer = window.setInterval(() => {
    void pingAndRefresh()
  }, PING_INTERVAL_MS)

  const refreshTimer = window.setInterval(() => {
    void refreshStats()
  }, REFRESH_INTERVAL_MS)

  return () => {
    disposed = true
    window.clearInterval(pingTimer)
    window.clearInterval(refreshTimer)
  }
}
