import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'

function clean(u) {
  return (u || '').toString().replace('@', '').toLowerCase().trim()
}

function num(v) {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

export default function CreatorDashboard() {
  const router = useRouter()
  const { user: routeUser } = router.query

  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!router.isReady) return

    let u = routeUser

    if (!u && typeof window !== 'undefined') {
      u = localStorage.getItem('user')
    }

    if (!u) {
      setCreator(false)
      setLoading(false)
      return
    }

    fetchData(clean(u))
  }, [router.isReady, routeUser])

  async function fetchData(targetUser) {
    try {
      const res = await fetch('/api/get-creators')
      const data = await res.json()

      const list = (data?.creators || []).filter(c =>
        c?.username &&
        typeof c.username === 'string' &&
        c.username.length > 2
      )

      const found = list.find(
        c => clean(c.username) === targetUser
      )

      setCreator(found || false)

    } catch (err) {
      console.error(err)
      setCreator(false)
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
        <div className="center">User not found</div>
      </>
    )
  }

  const diamonds = num(creator.diamonds)
  const days = num(creator.live_days)
  const hours = num(creator.live_hours)

  const avatar =
    creator.avatar ||
    `https://ui-avatars.com/api/?name=${creator.username}`

  return (
    <>
      <Navbar />

      <div className="wrap">

        {/* HERO */}
        <div className="hero">
          <div className="left">
            <img src={avatar} alt="avatar" />
            <div>
              <span className="tag">platinumXvoid</span>
              <h2>@{creator.username}</h2>
              <p>Live Performance System</p>
            </div>
          </div>

          <div className="right">
            <div className="big">{diamonds.toLocaleString()}</div>
            <span>Total Diamonds</span>
          </div>
        </div>

        {/* STATS */}
        <div className="grid">
          <Stat title="Diamonds" value={diamonds} max={100000} />
          <Stat title="LIVE Days" value={days} max={15} />
          <Stat title="LIVE Hours" value={hours} max={40} />
        </div>

        {/* GOALS */}
        <div className="grid">
          <Goal title="Diamonds Goal" value={diamonds} max={100000} />
          <Goal title="Days Goal" value={days} max={15} />
          <Goal title="Hours Goal" value={hours} max={40} />
        </div>

        {/* TIERS */}
        <h3 className="section">🎯 Incentive System</h3>

        <div className="grid">
          <Tier title="Starter" progress={100} active />
          <Tier title="Tier 1" progress={(diamonds / 50000) * 100} />
          <Tier title="Tier 2" progress={(diamonds / 100000) * 100} />
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

        .hero {
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:24px;
          border-radius:16px;
          background:#0a0a14;
          border:1px solid rgba(124,58,237,0.25);
          margin-bottom:24px;
        }

        .left {
          display:flex;
          align-items:center;
          gap:14px;
        }

        .left img {
          width:65px;
          height:65px;
          border-radius:14px;
          object-fit:cover;
        }

        .tag {
          font-size:11px;
          opacity:0.6;
        }

        .right {
          text-align:right;
        }

        .big {
          font-size:26px;
          font-weight:900;
        }

        .grid {
          display:grid;
          grid-template-columns:repeat(auto-fit, minmax(220px,1fr));
          gap:14px;
          margin-bottom:20px;
        }

        .card {
          padding:16px;
          border-radius:14px;
          background:#0a0a14;
          border:1px solid rgba(255,255,255,0.05);
        }

        .title {
          font-size:12px;
          opacity:0.6;
        }

        .value {
          font-size:20px;
          font-weight:900;
          margin-top:6px;
        }

        .bar {
          height:8px;
          margin-top:10px;
          border-radius:999px;
          background:rgba(255,255,255,0.15);
          overflow:hidden;
        }

        .fill {
          height:100%;
          min-width:8px;
          background:linear-gradient(90deg,#7c3aed,#06b6d4);
        }

        .section {
          margin:20px 0 10px;
        }

        .tier {
          padding:16px;
          border-radius:14px;
          background:#0a0a14;
          border:1px solid rgba(255,255,255,0.05);
        }

        .tier.active {
          border:1px solid #22c55e;
        }

        /* MOBILE */
        @media (max-width:768px){
          .wrap {
            padding:60px 16px;
          }

          .hero {
            flex-direction:column;
            align-items:flex-start;
            gap:16px;
          }

          .right {
            text-align:left;
          }

          .big {
            font-size:22px;
          }
        }
      `}</style>
    </>
  )
}

/* COMPONENTS */

function Stat({ title, value, max }) {
  const percent = Math.max(6, Math.min((value / max) * 100, 100))

  return (
    <div className="card">
      <div className="title">{title}</div>
      <div className="value">{value.toLocaleString()}</div>
      <div className="bar">
        <div className="fill" style={{ width: percent + '%' }} />
      </div>
    </div>
  )
}

function Goal({ title, value, max }) {
  const percent = Math.max(6, Math.min((value / max) * 100, 100))

  return (
    <div className="card">
      <div className="title">{title}</div>
      <div>{value} / {max}</div>
      <div className="bar">
        <div className="fill" style={{ width: percent + '%' }} />
      </div>
    </div>
  )
}

function Tier({ title, progress, active }) {
  const safe = Math.max(6, Math.min(progress, 100))

  return (
    <div className={`tier ${active ? 'active' : ''}`}>
      <div className="title">{title}</div>
      <div className="bar">
        <div className="fill" style={{ width: safe + '%' }} />
      </div>
    </div>
  )
}