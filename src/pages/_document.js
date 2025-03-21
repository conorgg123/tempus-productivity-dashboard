import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument 