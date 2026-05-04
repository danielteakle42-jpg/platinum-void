import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'

function safe(v) {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

export default function Incentives() {
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const raw = localStorage.getItem('user')
      if (!raw) return setLoading(false)

      const user = raw.toLowerCase().replace('@', '').trim()

      const res = await fetch(`/api/get-creator?username=${user}`)
      const data = await res.json()

      setCreator(data?.creator || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="center">Loading...</div>
      </>
    )
  }

  if (!creator) {
    return (
      <>
        <Navbar />
        <div className="center">No user data found</div>
      </>
    )
  }

  const diamonds = safe(creator.diamonds)
  const days = safe(creator.live_days)
  const hours = safe(creator.live_hours)

  const unlocked =
    diamonds >= 100000 &&
    days >= 15 &&
    hours >= 40

  return (
    <>
      <Navbar />

      <div className="wrap">

        {/* HERO */}
        <div className={`hero ${unlocked ? 'unlocked' : ''}`}>
          <h1>🔮 Incentives</h1>

          <p>
            {unlocked
              ? "Tier 1 Unlocked"
              : "Complete all objectives to unlock Tier 1"}
          </p>
        </div>

        {/* GRID PROGRESS */}
        <div className="grid">

          <Progress
            label="Diamonds"
            value={diamonds}
            max={100000}
            icon="💎"
          />

          <Progress
            label="LIVE Days"
            value={days}
            max={15}
            icon="📅"
          />

          <Progress
            label="LIVE Hours"
            value={hours}
            max={40}
            icon="⏱"
          />

        </div>

        {/* STATUS */}
        <div className={`status ${unlocked ? 'yes' : 'no'}`}>
          {unlocked ? "✅ ALL COMPLETE" : "❌ NOT COMPLETE"}
        </div>

      </div>

      <style jsx>{`

        .wrap {
          max-width:1100px;
          margin:0 auto;
          padding:80px 20px;
        }

        .center {
          text-align:center;
          padding:100px;
        }

        /* HERO */
        .hero {
          text-align:center;
          padding:40px;
          border-radius:20px;
          margin-bottom:40px;

          background:#0a0a14;
          border:1px solid rgba(124,58,237,0.3);
        }

        .hero.unlocked {
          border:1px solid #22c55e;
          box-shadow:0 0 40px rgba(34,197,94,0.2);
        }

        h1 {
          font-size:40px;
          font-weight:900;

          background:linear-gradient(90deg,#7c3aed,#06b6d4);
          -webkit-background-clip:text;
          color:transparent;
        }

        .hero p {
          margin-top:10px;
          opacity:0.7;
        }

        /* GRID */
        .grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:16px;
        }

        /* CARD */
        .card {
          padding:20px;
          border-radius:16px;

          background:#0a0a14;
          border:1px solid rgba(255,255,255,0.05);

          transition:border 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          border:1px solid rgba(124,58,237,0.4);
          box-shadow:0 8px 24px rgba(124,58,237,0.15);
        }

        .top {
          display:flex;
          justify-content:space-between;
          margin-bottom:10px;
          font-size:13px;
          opacity:0.8;
        }

        .value {
          font-weight:700;
        }

        /* BAR */
        .bar {
          height:6px;
          border-radius:6px;
          background:rgba(255,255,255,0.08);
          overflow:hidden;
        }

        .fill {
          height:100%;
          background:linear-gradient(90deg,#7c3aed,#06b6d4);
        }

        /* STATUS */
        .status {
          text-align:center;
          margin-top:40px;
          font-weight:700;
          font-size:18px;
        }

        .yes { color:#22c55e }
        .no { color:#f87171 }

      `}</style>
    </>
  )
}

/* COMPONENT */

function Progress({ label, value, max, icon }) {
  const percent = Math.min((value / max) * 100, 100)

  return (
    <div className="card">

      <div className="top">
        <span>{icon} {label}</span>
        <span className="value">{value} / {max}</span>
      </div>

      <div className="bar">
        <div className="fill" style={{ width: percent + '%' }} />
      </div>

    </div>
  )
}