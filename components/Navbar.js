import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function clean(u) {
  return (u || '').toString().replace('@', '').toLowerCase().trim()
}

export default function Navbar() {
  const router = useRouter()
  const path = router.pathname

  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('user')
    if (raw) setUser(clean(raw))
  }, [])

  const isAdmin = ['ppn777', 'ppm1'].includes(user)

  const homeRoute = user ? `/dashboard/${user}` : '/'

  const navItems = [
    { route: homeRoute, label: 'Home' },
    { route: '/leaderboard', label: 'Leaderboard' },
    { route: '/incentives', label: 'Incentives' },
    ...(isAdmin ? [{ route: '/admin', label: 'Admin' }] : [])
  ]

  const isActive = (route) => {
    if (route === homeRoute) return path.startsWith('/dashboard')
    return path.startsWith(route)
  }

  return (
    <>
      {/* DESKTOP NAV */}
      <div className="desktop-nav">
        <div className="inner">
          <div onClick={() => router.push(homeRoute)} className="logo">
            platinumXvoid 💎⚡🔮
          </div>

          <div className="links">
            {navItems.map((item) => (
              <div
                key={item.route}
                onClick={() => router.push(item.route)}
                className={isActive(item.route) ? 'active' : ''}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📱 MOBILE APP NAV */}
      <div className="mobile-nav">
        {navItems.map((item) => (
          <div
            key={item.route}
            onClick={() => router.push(item.route)}
            className={`tab ${isActive(item.route) ? 'active' : ''}`}
          >
            {item.label}
          </div>
        ))}
      </div>

      <style jsx>{`

        /* DESKTOP */
        .desktop-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 12px;
        }

        .inner {
          max-width: 1100px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          padding: 12px 20px;
          border-radius: 14px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(10px);
        }

        .logo {
          font-weight: 700;
          cursor: pointer;
        }

        .links {
          display: flex;
          gap: 20px;
        }

        .links div {
          cursor: pointer;
          opacity: 0.6;
        }

        .links .active {
          opacity: 1;
        }

        /* MOBILE NAV */
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          display: none;
          justify-content: space-around;
          padding: 10px 0;
          background: rgba(5,5,15,0.95);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255,255,255,0.05);
          z-index: 999;
        }

        .tab {
          font-size: 12px;
          opacity: 0.6;
        }

        .tab.active {
          opacity: 1;
          font-weight: 600;
        }

        /* SWITCH */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }

          .mobile-nav {
            display: flex;
          }
        }

      `}</style>
    </>
  )
}