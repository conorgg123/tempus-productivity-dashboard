import '@/styles/globals.css';
import Head from 'next/head';

// Add global polyfill at the top level
if (typeof window !== 'undefined' && typeof global === 'undefined') {
  window.global = window;
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
} 