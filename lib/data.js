import { supabase } from './supabase'

/* ================= HELPERS ================= */

function cleanUsername(name) {
  return (name || '')
    .toString()
    .replace('@', '')
    .toLowerCase()
    .trim()
}

function num(v) {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

/* ================= GAME ENGINE ================= */

function enrich(list) {
  const sorted = [...list].sort((a, b) => b.diamonds - a.diamonds)
  const total = sorted.length

  /* 🔥 FIND MAX GAP (FOR LEADERBOARD BARS) */
  const maxGap = Math.max(
    ...sorted.map((c, i) => {
      const below = sorted[i + 1]
      return below ? (c.diamonds - below.diamonds) : 0
    }),
    1
  )

  return sorted.map((c, i) => {
    const rank = i + 1

    const above = sorted[i - 1]
    const below = sorted[i + 1]

    const gapUp = above ? Math.max(above.diamonds - c.diamonds, 0) : 0
    const gapDown = below ? Math.max(c.diamonds - below.diamonds, 0) : 0

    /* 🔥 GAP % (FOR LEADERBOARD) */
    const gapPercent = Math.min((gapDown / maxGap) * 100, 100)

    /* 🎮 XP SYSTEM (FOR DASHBOARD) */
    const level = Math.floor(c.diamonds / 20000) + 1
    const xp = c.diamonds % 20000
    const xpPercent = Math.min((xp / 20000) * 100, 100)

    /* 🔥 STREAK */
    const streak = Math.min(Math.floor(c.live_days / 3), 5)

    /* 🏆 TIERS */
    let tier = "BRONZE"
    if (c.diamonds >= 150000) tier = "ELITE"
    else if (c.diamonds >= 100000) tier = "DIAMOND"
    else if (c.diamonds >= 50000) tier = "GOLD"
    else if (c.diamonds >= 10000) tier = "SILVER"

    return {
      ...c,
      rank,
      total,
      gapUp,
      gapDown,
      gapPercent,   // ✅ leaderboard bars
      level,
      xp,
      xpPercent,    // ✅ dashboard bars
      streak,
      tier
    }
  })
}

/* ================= DATA ================= */

/* 🔮 GET ALL */
export async function getCreators() {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .order('diamonds', { ascending: false })

    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No data in DB')
      return []
    }

    const cleaned = data.map(row => ({
      username: cleanUsername(row.username),
      diamonds: num(row.diamonds),
      live_days: num(row.live_days),
      live_hours: num(row.live_hours),
      avatar:
        row.avatar ||
        `https://unavatar.io/tiktok/${cleanUsername(row.username)}`
    }))

    return enrich(cleaned)

  } catch (err) {
    console.error('❌ getCreators failed:', err)
    return []
  }
}

/* 🔮 GET ONE */
export async function getCreator(username) {
  try {
    const target = cleanUsername(username)
    const list = await getCreators()
    return list.find(c => c.username === target) || null
  } catch (err) {
    console.error('❌ getCreator failed:', err)
    return null
  }
}