import { createClient } from '@supabase/supabase-js'

/* ================= ENV ================= */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Supabase environment variables')
}

/* ================= SINGLETON CLIENT ================= */

// Prevent multiple clients in dev (Next.js hot reload)
let supabase

if (process.env.NODE_ENV === 'production') {
  supabase = createClient(supabaseUrl, supabaseKey)
} else {
  if (!globalThis.__supabase) {
    globalThis.__supabase = createClient(supabaseUrl, supabaseKey)
  }
  supabase = globalThis.__supabase
}

export { supabase }