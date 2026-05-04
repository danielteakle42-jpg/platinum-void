import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // 🔥 SAFE BODY PARSE (prevents crash)
    const body = req.body || {}
    const admin = body.admin

    /* 🔒 AUTH */
    if (!admin || !['ppn777', 'ppm1'].includes(admin)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      })
    }

    /* 🔥 DELETE EVERYTHING */
    const { data, error } = await supabase
      .from('creators')
      .delete()
      .neq('username', '') // safe universal match

    if (error) {
      console.error('SUPABASE DELETE ERROR:', error)
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }

    return res.status(200).json({
      success: true,
      deleted: data?.length || 0
    })

  } catch (err) {
    console.error('API CRASH:', err)

    // 🔥 ALWAYS RETURN JSON (never HTML)
    return res.status(500).json({
      success: false,
      error: 'Server crashed',
      details: err.message
    })
  }
}