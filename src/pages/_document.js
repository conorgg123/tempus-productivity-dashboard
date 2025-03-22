import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Productivity Dashboard Application" />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Fix for "global is not defined"
            if (typeof global === "undefined") {
              window.global = window;
            }
          `
        }} />
        <link 
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 