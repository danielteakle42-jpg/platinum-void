import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" data-scroll-behavior="smooth">
      <Head>
        {/* charset */}
        <meta charSet="utf-8" />

        {/* BRAND COLOR (matches neon theme) */}
        <meta name="theme-color" content="#00cfff" />

        {/* PRELOAD LOGO (helps performance + glow render) */}
        <link rel="preload" href="/logo.png" as="image" />

        {/* OPTIONAL: background preload */}
        <link rel="preload" href="/background.png" as="image" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}