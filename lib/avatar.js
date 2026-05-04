export async function fetchAvatar(username) {
  try {
    if (!username) return null

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(
      `/api/fetch-avatar?username=${encodeURIComponent(username)}`,
      { signal: controller.signal }
    )

    clearTimeout(timeout)

    if (!res.ok) {
      return fallbackAvatar(username)
    }

    const json = await res.json()

    return json?.avatar || fallbackAvatar(username)

  } catch (err) {
    console.warn('fetchAvatar error:', err)
    return fallbackAvatar(username)
  }
}

/* 🔥 CENTRAL FALLBACK SYSTEM */
function fallbackAvatar(username) {
  // always return FIRST valid one
  return `https://unavatar.io/tiktok/${username}`
}