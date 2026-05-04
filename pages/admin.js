import Navbar from '../components/Navbar'
import { useEffect, useState, useRef } from 'react'
import * as XLSX from 'xlsx'

export default function Admin() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)

  const fileRef = useRef()

  const ADMIN_KEY = 'ppn777'

  useEffect(() => {
    load()
  }, [])

  /* ===== LOAD DATA ===== */
  async function load() {
    try {
      setLoading(true)

      const res = await fetch('/api/get-creators')
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load')
      }

      let list = data.creators || []

      list = list
        .filter(c => c?.username)
        .sort((a, b) => (b.diamonds || 0) - (a.diamonds || 0))

      setCreators(list)

    } catch (err) {
      console.error(err)
      alert(err.message)
      setCreators([])
    } finally {
      setLoading(false)
    }
  }

  /* ===== FILE SELECT ===== */
  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
  }

  /* ===== UPLOAD ===== */
  async function upload() {
    if (!file) return alert("Select an Excel file")

    setBusy(true)

    try {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet)

      const res = await fetch('/api/upload-creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin: ADMIN_KEY,
          data: json
        })
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Upload failed")
      }

      alert(`✅ Uploaded ${result.count} creators`)

      setFile(null)
      fileRef.current.value = '' // 🔥 reset input visually

      await load()

    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setBusy(false)
    }
  }

  /* ===== CLEAR ===== */
  async function clearData() {
    if (!confirm("⚠️ Delete ALL creator data?")) return

    setBusy(true)

    try {
      const res = await fetch('/api/clear-creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin: ADMIN_KEY })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to clear")
      }

      alert("🧹 Data cleared")

      await load()

    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="wrap">Loading...</div>
      </>
    )
  }

  const totalDiamonds = creators.reduce((a,c)=>a+(c.diamonds||0),0)
  const totalHours = creators.reduce((a,c)=>a+(c.live_hours||0),0)
  const totalDays = creators.reduce((a,c)=>a+(c.live_days||0),0)

  const avgDiamonds = creators.length
    ? Math.floor(totalDiamonds / creators.length)
    : 0

  const top3 = creators.slice(0,3)

  return (
    <>
      <Navbar />

      <div className="wrap">

        {/* HERO */}
        <div className="hero">
          <div>
            <div className="sub">VOID Analytics</div>
            <div className="title">⚡ Admin Dashboard</div>
            <div className="sub">Creator performance overview</div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="card actions">

          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFile}
          />

          <div className="btns">
            <button disabled={busy} onClick={upload}>
              {busy ? "Uploading..." : "📥 Import Excel"}
            </button>

            <button disabled={busy} className="danger" onClick={clearData}>
              {busy ? "Processing..." : "🧹 Clear Data"}
            </button>
          </div>

        </div>

        {/* EMPTY STATE */}
        {!creators.length && (
          <div className="card">No creators found</div>
        )}

        {/* STATS */}
        {creators.length > 0 && (
          <>
            <div className="grid">
              <Stat title="💎 Total Diamonds" value={totalDiamonds} />
              <Stat title="⚡ LIVE Hours" value={totalHours} />
              <Stat title="📅 LIVE Days" value={totalDays} />
              <Stat title="👥 Creators" value={creators.length} />
              <Stat title="📊 Avg Diamonds" value={avgDiamonds} />
            </div>

            <h2 className="section">🏆 Top Creators</h2>

            <div className="grid">
              {top3.map((c, i) => (
                <TopCard key={c.username} creator={c} rank={i+1} />
              ))}
            </div>
          </>
        )}

      </div>

      <style jsx>{`
        .grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:16px;
          margin-bottom:30px;
        }

        .section {
          margin:20px 0;
        }

        .actions {
          margin-bottom:30px;
        }

        .btns {
          display:flex;
          gap:12px;
          margin-top:12px;
        }

        .danger {
          background:linear-gradient(90deg,#ef4444,#dc2626);
        }
      `}</style>
    </>
  )
}

/* ===== COMPONENTS ===== */

function Stat({ title, value }) {
  return (
    <div className="card">
      <div className="sub">{title}</div>
      <div className="value">{Number(value).toLocaleString()}</div>

      <style jsx>{`
        .value {
          font-size:28px;
          font-weight:900;
          margin-top:6px;
        }
      `}</style>
    </div>
  )
}

function TopCard({ creator, rank }) {
  const medals = ["🥇","🥈","🥉"]

  return (
    <div className="card top">
      <div className="rank">{medals[rank-1]}</div>

      <img
        src={creator.avatar || `https://ui-avatars.com/api/?name=${creator.username}`}
        className="avatar"
      />

      <div className="name">@{creator.username}</div>

      <div className="chip">
        💎 {creator.diamonds?.toLocaleString() || 0}
      </div>

      <style jsx>{`
        .top { text-align:center; }
        .rank { font-size:22px; margin-bottom:6px; }
        .avatar { width:60px; height:60px; border-radius:14px; margin:10px auto; }
        .name { font-weight:700; margin-top:6px; }
      `}</style>
    </div>
  )
}