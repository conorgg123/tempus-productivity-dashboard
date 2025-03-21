import '../styles/globals.css'

// Add global polyfill at the top level
if (typeof window !== 'undefined' && typeof global === 'undefined') {
  window.global = window;
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp 