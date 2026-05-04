import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  function cleanUsername(name) {
    return (name || '')
      .toString()
      .replace('@', '')
      .replace(/\s+/g, '')
      .toLowerCase()
      .trim()
  }

  async function go() {
    if (loading) return

    const u = cleanUsername(username)

    if (!u) {
      setError('Enter a username')
      return
    }

    setError('')
    setLoading(true)

    try {
      // ADMIN ROUTE
      if (u === 'ppn777' || u === 'ppm1') {
        localStorage.setItem('user', u)
        router.push('/admin')
        return
      }

      const res = await fetch('/api/get-creators')
      const data = await res.json()

      const list = data?.creators || []
      const found = list.find(c => c.username === u)

      if (!found) {
        setError('User not found')
        setLoading(false)
        return
      }

      localStorage.setItem('user', u)
      router.push(`/dashboard/${u}`)

    } catch (err) {
      console.error(err)
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="wrapper">

      <div className="bg-image" />
      <div className="bg" />

      <div className="card">

        <img
          src="/logo.png"
          className="logo"
          onError={(e) => {
            e.target.src = "https://api.dicebear.com/7.x/initials/png?seed=platinumXvoid"
          }}
        />

        <h1 className="title">
          <span className="title-text">platinumXvoid</span>
          <span className="emoji"> 💎⚡🔮</span>
        </h1>

        <p className="sub">Enter your creator dashboard</p>

        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            setError('')
          }}
          placeholder="@username"
          onKeyDown={(e) => e.key === 'Enter' && go()}
        />

        {error && <div className="error">{error}</div>}

        <button onClick={go} disabled={loading}>
          {loading ? 'Entering...' : 'Enter Dashboard'}
        </button>

      </div>

      <style jsx>{`
        .wrapper {
          position: relative;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        /* Prevent background blocking clicks */
        .bg-image,
        .bg {
          pointer-events: none;
        }

        .bg-image {
          position: absolute;
          inset: 0;
          background: url("/background.png") center/cover no-repeat;
          opacity: 0.25;
        }

        .bg {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #00cfff, transparent 70%);
          opacity: 0.15;
        }

        .card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 420px;
          padding: 40px 28px;
          border-radius: 20px;
          text-align: center;

          background: rgba(10,10,20,0.9);
          border: 1px solid rgba(0,207,255,0.3);

          box-shadow:
            0 20px 60px rgba(0,0,0,0.9),
            0 0 40px rgba(0,207,255,0.2),
            0 0 60px rgba(168,85,247,0.15);
        }

        .logo {
          width: 70px;
          border-radius: 14px;
          margin-bottom: 18px;
        }

        .title {
          font-size: 34px;
          margin-bottom: 6px;
          font-weight: 900;
          line-height: 1.2;
        }

        .title-text {
          background: linear-gradient(90deg,#00cfff,#a855f7);
          -webkit-background-clip: text;
          color: transparent;
        }

        .emoji {
          font-family:
            "Segoe UI Emoji",
            "Apple Color Emoji",
            "Noto Color Emoji";
          margin-left: 6px;
        }

        .sub {
          opacity: 0.6;
          margin-bottom: 24px;
          font-size: 14px;
        }

        input {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          outline: none;
        }

        input:focus {
          border-color: #00cfff;
          box-shadow: 0 0 10px rgba(0,207,255,0.4);
        }

        .error {
          margin-top: 10px;
          color: #f87171;
          font-size: 13px;
        }

        button {
          width: 100%;
          margin-top: 20px;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;

          background: linear-gradient(90deg,#00cfff,#a855f7);
          color: white;
        }

        button:hover {
          transform: translateY(-2px);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* MOBILE FIX */
        @media (max-width: 768px) {
          .card {
            padding: 30px 20px;
          }

          .title {
            font-size: 28px;
          }

          .logo {
            width: 60px;
          }
        }
      `}</style>
    </div>
  )
}