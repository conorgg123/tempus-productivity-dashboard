// Define global at the top level
if (typeof window !== 'undefined' && typeof global === 'undefined') {
  window.global = window;
}

export default function Home() {
  return (
    <div className="container">
      <main>
        <h1>Productivity Dashboard</h1>
        <p>Your productivity tools in one place</p>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        h1 {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }
        p {
          line-height: 1.5;
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  )
} 
