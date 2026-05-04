import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'

function clean(u) {
  return (u || '').toString().replace('@','').toLowerCase().trim()
}

function num(v) {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

export default function Incentives() {
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('user')

    if (!raw) {
      setLoading(false)
      return
    }

    const user = clean(raw)

    fetch(`/api/get-creator?username=${user}`)
      .then(r => r.json())
      .then(d => setCreator(d.creator || null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="center">Loading...</div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div className="container">

        {/* HERO */}
        <div className="hero">
          <h1>🔮 Incentives System</h1>
          <p>Complete all objectives to unlock rewards</p>
        </div>

        {creator && <UserProgress creator={creator} />}

        <Explain />

      </div>

      <style jsx>{`

        .container {
          max-width:1100px;
          margin:0 auto;
          padding:80px 20px;
        }

        .center {
          text-align:center;
          padding:100px;
        }

        .hero {
          text-align:center;
          padding:50px;
          border-radius:20px;
          margin-bottom:40px;

          background:#0a0a14;
          border:1px solid rgba(124,58,237,0.4);
        }

        h1 {
          font-size:44px;
          font-weight:900;
          color:#a78bfa;
        }

        p {
          opacity:0.7;
          margin-top:10px;
        }

      `}</style>
    </>
  )
}

/* ================= USER ================= */

function UserProgress({ creator }) {
  const diamonds = num(creator.diamonds)
  const days = num(creator.live_days)
  const hours = num(creator.live_hours)

  const goals = {
    diamonds: 100000,
    days: 15,
    hours: 40
  }

  const unlocked =
    diamonds >= goals.diamonds &&
    days >= goals.days &&
    hours >= goals.hours

  return (
    <div className="user">

      <h2>Your Progress</h2>

      <Progress label="💎 Diamonds" value={diamonds} max={goals.diamonds} />
      <Progress label="📅 Days" value={days} max={goals.days} />
      <Progress label="⏱ Hours" value={hours} max={goals.hours} />

      <div className={`status ${unlocked ? 'yes' : 'no'}`}>
        {unlocked ? "🏆 Reward Unlocked" : "❌ Not Complete"}
      </div>

      <div className="rule">
        Complete ALL 3 to unlock reward
      </div>

      <style jsx>{`

        .user {
          margin-bottom:50px;
        }

        h2 {
          margin-bottom:20px;
        }

        .status {
          text-align:center;
          margin-top:20px;
          font-size:18px;
          font-weight:700;
        }

        .yes { color:#22c55e }
        .no { color:#f87171 }

        .rule {
          text-align:center;
          margin-top:10px;
          font-size:13px;
          opacity:0.7;
        }

      `}</style>

    </div>
  )
}

/* ================= EXPLAIN ================= */

function Explain() {
  return (
    <div className="grid">

      <Card title="🏆 Tier 1 Requirements">
        <ul>
          <li>💎 100,000 Diamonds</li>
          <li>📅 15 LIVE Days</li>
          <li>⏱ 40 LIVE Hours</li>
        </ul>
      </Card>

      <Card title="⚠️ Rules">
        <ul>
          <li>All 3 required</li>
          <li>Partial = no reward</li>
        </ul>
      </Card>

      <Card title="⚔️ Ranking">
        <p>Earn diamonds to climb leaderboard</p>
      </Card>

      <Card title="📊 Tracking">
        <p>Data updates from your performance</p>
      </Card>

      <style jsx>{`
        .grid {
          display:grid;
          gap:20px;
        }
      `}</style>

    </div>
  )
}

/* ================= CARD ================= */

function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}

      <style jsx>{`

        .card {
          padding:20px;
          border-radius:14px;
          background:#0a0a14;
          border:1px solid rgba(255,255,255,0.05);
        }

        h3 {
          margin-bottom:10px;
        }

      `}</style>
    </div>
  )
}

/* ================= PROGRESS ================= */

function Progress({ label, value, max }) {
  const percent = Math.min((value / max) * 100, 100)

  return (
    <div className="wrap">

      <div className="top">
        <span>{label}</span>
        <span>{value} / {max}</span>
      </div>

      <div className="bar">
        <div
          className="fill"
          style={{ width: percent + '%' }}
        />
      </div>

      <style jsx>{`

        .wrap {
          margin-bottom:20px;
        }

        .top {
          display:flex;
          justify-content:space-between;
          margin-bottom:6px;
        }

        .bar {
          height:8px;
          border-radius:8px;
          background:rgba(255,255,255,0.08);
          overflow:hidden;
        }

        .fill {
          height:100%;
          background:linear-gradient(90deg,#7c3aed,#06b6d4);
          /* ❌ removed glow + animation */
        }

      `}</style>
    </div>
  )
}