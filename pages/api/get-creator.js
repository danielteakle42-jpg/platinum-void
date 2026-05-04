import { getCreators } from '../../lib/data'

export default async function handler(req, res) {
  try {
    /* ===== METHOD CHECK ===== */
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
    }

    /* ===== FETCH DATA ===== */
    let creators = []

    try {
      creators = await getCreators()
    } catch (err) {
      console.error('DATA FETCH ERROR:', err)
      creators = []
    }

    /* ===== SAFETY ===== */
    if (!Array.isArray(creators)) {
      console.warn('INVALID FORMAT:', creators)
      creators = []
    }

    /* ===== SORT ===== */
    const sorted = [...creators].sort(
      (a, b) => (Number(b?.diamonds) || 0) - (Number(a?.diamonds) || 0)
    )

    const total = sorted.length

    /* ===== NORMALIZE ===== */
    const safe = sorted.map((c, i) => {
      const diamonds = Number(c?.diamonds) || 0

      const below = sorted[i + 1]
      const above = sorted[i - 1]

      const belowDiamonds = Number(below?.diamonds) || 0
      const aboveDiamonds = Number(above?.diamonds) || 0

      const gapDown = Math.max(diamonds - belowDiamonds, 0)
      const gapUp = Math.max(aboveDiamonds - diamonds, 0)

      const gapPercent =
        diamonds > 0
          ? Math.min((gapDown / diamonds) * 100, 100)
          : 0

      return {
        username: c?.username || '',
        diamonds,
        live_days: Number(c?.live_days) || 0,
        live_hours: Number(c?.live_hours) || 0,

        avatar:
          c?.avatar ||
          `https://unavatar.io/tiktok/${c?.username || 'user'}`,

        /* CORE */
        rank: i + 1,
        total,

        /* GAME DATA */
        level: Number(c?.level) || 1,
        xp: Number(c?.xp) || 0,
        xpPercent: Math.min(Number(c?.xpPercent) || 0, 100),
        streak: Number(c?.streak) || 0,
        tier: c?.tier || 'BRONZE',

        /* GAP SYSTEM */
        gapUp,
        gapDown,
        gapPercent,

        percentile: total
          ? Math.round((1 - i / total) * 100)
          : 0
      }
    })

    console.log('✅ API OUTPUT:', safe.length)

    return res.status(200).json({
      success: true,
      creators: safe
    })

  } catch (err) {
    console.error('❌ GET CREATORS CRASH:', err)

    /* 🔥 ALWAYS RETURN JSON (NEVER HTML) */
    return res.status(500).json({
      success: false,
      error: 'Server crashed',
      details: err.message
    })
  }
}