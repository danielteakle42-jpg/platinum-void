import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

function clean(u) {
  return (u || '').toString().replace('@', '').toLowerCase().trim()
}

function safeNum(v) {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

export default function Leaderboard() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const currentUser =
    typeof window !== 'undefined'
      ? clean(localStorage.getItem('user'))
      : null

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const res = await fetch('/api/get-creators')
      const data = await res.json()

      let list = data?.creators || []

      list = list
        .filter(c => c?.username && typeof c.username === 'string')
        .sort((a, b) => safeNum(b.diamonds) - safeNum(a.diamonds))
        .map((c, i) => ({
          ...c,
          rank: i + 1,
          diamonds: safeNum(c.diamonds),
          live_hours: safeNum(c.live_hours),
          live_days: safeNum(c.live_days)
        }))

      setCreators(list)

    } catch (err) {
      console.error(err)
      setCreators([])
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

  const top = creators[0]
  const rest = creators.slice(1)

  return (
    <>
      <Navbar />

      <div className="wrap">

        <h1 className="title">💎 Monthly Leaderboard</h1>

        {/* 🥇 TOP */}
        {top && (
          <div className="top-card">

            <div className="left">
              <div className="medal">🥇</div>

              <img src={top.avatar} className="avatar big" />

              <div>
                <div className="name">@{top.username}</div>

                <div className="stats">
                  <span>💎 {top.diamonds.toLocaleString()}</span>
                  <span>⚡ {top.live_hours.toFixed(1)}h</span>
                  <span>📅 {top.live_days}d</span>
                </div>
              </div>
            </div>

            <div className="right">
              <div className={`tier ${top.tier?.toLowerCase()}`}>
                {top.tier || 'ELITE'}
              </div>
              <div className="status">Top Performer</div>
            </div>

          </div>
        )}

        {/* LIST */}
        <div className="list">
          {rest.map(c => {
            const isYou = clean(c.username) === currentUser

            return (
              <div
                key={c.username}
                className={`row ${isYou ? 'you' : ''}`}
                onClick={() => router.push(`/dashboard/${c.username}`)}
              >

                <div className="left">

                  <div className="rank">
                    {c.rank <= 3
                      ? ["🥇","🥈","🥉"][c.rank - 1]
                      : `#${c.rank}`}
                  </div>

                  <img src={c.avatar} className="avatar" />

                  <div className="info">

                    <div className="name">
                      @{c.username}
                      {isYou && <span className="you-tag">YOU</span>}
                    </div>

                    <div className="stats">
                      <span>💎 {c.diamonds.toLocaleString()}</span>
                      <span>⚡ {c.live_hours.toFixed(1)}h</span>
                      <span>📅 {c.live_days}d</span>
                    </div>

                  </div>
                </div>

                <div className="right">
                  <div className={`tier ${c.tier?.toLowerCase()}`}>
                    {c.tier || 'BRONZE'}
                  </div>
                </div>

              </div>
            )
          })}
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

        .title {
          text-align:center;
          font-size:44px;
          font-weight:900;
          margin-bottom:40px;
          background:linear-gradient(90deg,#7c3aed,#06b6d4);
          -webkit-background-clip:text;
          color:transparent;
        }

        /* TOP CARD */
        .top-card {
          display:flex;
          justify-content:space-between;
          align-items:center;

          padding:28px;
          border-radius:20px;

          background:linear-gradient(
            135deg,
            rgba(124,58,237,0.15),
            rgba(6,182,212,0.1)
          );

          border:1px solid rgba(124,58,237,0.4);
          margin-bottom:24px;
        }

        .left {
          display:flex;
          align-items:center;
          gap:16px;
        }

        .medal {
          font-size:24px;
        }

        .avatar {
          width:48px;
          height:48px;
          border-radius:12px;
        }

        .avatar.big {
          width:70px;
          height:70px;
        }

        .rank {
          width:40px;
          font-weight:800;
          opacity:0.8;
        }

        .info {
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .name {
          font-weight:700;
          font-size:15px;
        }

        .stats {
          display:flex;
          gap:10px;
          font-size:12px;
          opacity:0.75;
        }

        .stats span {
          background:rgba(255,255,255,0.05);
          padding:4px 8px;
          border-radius:8px;
        }

        .list {
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        .row {
          display:flex;
          justify-content:space-between;
          align-items:center;

          padding:16px;
          border-radius:14px;

          background:#0a0a14;
          border:1px solid rgba(255,255,255,0.05);

          cursor:pointer;

          transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        .row:hover {
          border:1px solid rgba(124,58,237,0.4);
          box-shadow:0 8px 24px rgba(124,58,237,0.15);
        }

        .row.you {
          border:1px solid #06b6d4;
          box-shadow:0 0 20px rgba(6,182,212,0.3);
        }

        .tier {
          padding:6px 12px;
          border-radius:999px;
          font-size:11px;
          font-weight:700;
          background:#1f2937;
        }

        .tier.elite { background:#22c55e }
        .tier.diamond { background:#06b6d4 }
        .tier.gold { background:#facc15 }
        .tier.silver { background:#94a3b8 }
        .tier.bronze { background:#a16207 }

        .status {
          font-size:12px;
          opacity:0.6;
        }

        .you-tag {
          margin-left:6px;
          font-size:10px;
          background:#06b6d4;
          padding:2px 6px;
          border-radius:6px;
        }

      `}</style>
    </>
  )
}