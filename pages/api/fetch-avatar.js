export default async function handler(req, res) {
  try {
    const usernameRaw = req.query?.username

    if (!usernameRaw) {
      return res.status(400).json({
        success: false,
        error: "Username is required"
      })
    }

    const username = usernameRaw
      .toString()
      .replace('@', '')
      .trim()
      .toLowerCase()

    const primary = `https://unavatar.io/tiktok/${username}`
    const fallback = `https://api.dicebear.com/7.x/initials/png?seed=${username}`

    // 🔥 HEAD request to check if avatar exists
    const check = await fetch(primary, { method: 'HEAD' })

    const avatar = check.ok ? primary : fallback

    return res.status(200).json({
      success: true,
      avatar
    })

  } catch (err) {
    console.error('❌ Avatar fetch failed:', err)

    const username = req.query?.username || 'user'

    return res.status(200).json({
      success: true,
      avatar: `https://api.dicebear.com/7.x/initials/png?seed=${username}`
    })
  }
}