import React, { useEffect, useRef, useState } from 'react'

export default function PageIntro({ onComplete }) {
  const [exiting, setExiting] = useState(false)
  const completed = useRef(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const exitTimer = window.setTimeout(() => setExiting(true), reducedMotion ? 900 : 3900)
    const completeTimer = window.setTimeout(onComplete, reducedMotion ? 1100 : 4400)
    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete])

  const finishIntro = () => {
    if (completed.current) return
    completed.current = true
    setExiting(true)
    window.setTimeout(onComplete, 450)
  }

  return (
    <div
      className={`page-intro ${exiting ? 'page-intro-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Rain Me weather welcome"
      aria-hidden={exiting}
    >
      <div className="intro-storm-backdrop" />
      <div className="intro-cloud intro-cloud-back" />
      <div className="intro-cloud intro-cloud-front" />
      <div className="intro-rain" aria-hidden="true">
        {Array.from({ length: 30 }, (_, i) => (
          <span
            key={i}
            className="intro-raindrop"
            style={{
              left: `${(i * 37) % 100}%`,
              animationDelay: `${(i % 12) * -0.31}s`,
              animationDuration: `${1.35 + (i % 5) * 0.16}s`,
            }}
          />
        ))}
      </div>
      <div className="intro-lightning-flash" aria-hidden="true" />
      <svg className="intro-lightning-bolt" viewBox="0 0 64 96" fill="none" aria-hidden="true">
        <path d="M37 3 10 51h19l-5 42 31-54H36l1-36Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      </svg>

      <div className="intro-content">
        <img className="intro-logo" src="/Rain%20Me.png" alt="Rain Me" />
        <p className="intro-kicker">Weather, at a glance</p>
        <h1 className="intro-brand">Rain Me</h1>
        <p className="intro-tagline">A little more clarity for wherever your day takes you.</p>
        <div className="intro-loading" role="status" aria-label="Loading weather dashboard">
          <span />
          <span />
          <span />
        </div>
        <button className="intro-skip" onClick={finishIntro}>Skip intro</button>
      </div>
    </div>
  )
}
