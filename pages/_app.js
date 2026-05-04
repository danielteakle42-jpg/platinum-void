import '../styles/globals.css'
import Head from 'next/head'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap'
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* BRAND NAME */}
        <title>platinumXvoid 💎⚡🔮</title>

        {/* DESCRIPTION */}
        <meta name="description" content="platinumXvoid Creator Dashboard 💎⚡🔮" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* MATCH NEW COLOR THEME */}
        <meta name="theme-color" content="#00cfff" />

        {/* OPTIONAL ICON (safe if logo exists) */}
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </>
  )
}