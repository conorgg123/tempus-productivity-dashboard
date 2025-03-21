import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Productivity Dashboard</title>
        <meta name="description" content="Next.js Productivity Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Productivity Dashboard
        </h1>

        <p className={styles.description}>
          Your personal productivity tool
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Tasks</h2>
            <p>View and manage your daily tasks</p>
          </div>

          <div className={styles.card}>
            <h2>Calendar</h2>
            <p>Schedule your upcoming events</p>
          </div>

          <div className={styles.card}>
            <h2>Notes</h2>
            <p>Keep track of important information</p>
          </div>

          <div className={styles.card}>
            <h2>Settings</h2>
            <p>Customize your dashboard</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Next.js
        </a>
      </footer>
    </div>
  )
} 
