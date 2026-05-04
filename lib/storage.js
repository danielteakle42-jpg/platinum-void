import { getCreators } from './data'

/* ================= CACHE ================= */

// 🔥 global cache (safe across hot reloads)
const globalForCache = globalThis

if (!globalForCache.__dataCache) {
  globalForCache.__dataCache = {
    data: null,
    lastFetch: 0
  }
}

const CACHE_TIME = 5000 // 5 seconds

/* ================= GET DATA ================= */

export async function getData() {
  try {
    const now = Date.now()

    const cache = globalForCache.__dataCache

    // return cached data if still fresh
    if (cache.data && now - cache.lastFetch < CACHE_TIME) {
      return cache.data
    }

    const users = await getCreators()

    const result = { users }

    // update cache
    cache.data = result
    cache.lastFetch = now

    return result

  } catch (err) {
    console.error('getData error:', err)
    return { users: [] }
  }
}

/* ================= CLEAR CACHE ================= */

export function clearCache() {
  if (globalForCache.__dataCache) {
    globalForCache.__dataCache.data = null
    globalForCache.__dataCache.lastFetch = 0
  }
}