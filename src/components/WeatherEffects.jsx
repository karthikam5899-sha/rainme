import React from 'react'

export default function WeatherEffects({ kind, scene = false }) {
  const containerClass = scene
    ? 'weather-effects weather-effects-scene pointer-events-none absolute inset-0 overflow-hidden'
    : 'weather-effects pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]'
  if (kind === 'sunny') return (
    <div className={containerClass} aria-hidden="true">
      <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="weather-sun absolute right-[10%] top-[12%] h-24 w-24 rounded-full bg-amber-200/20 blur-xl sm:h-36 sm:w-36" />
      <div className="sun-rays absolute right-[10%] top-[12%] h-24 w-24 rounded-full border border-amber-100/15 sm:h-36 sm:w-36" />
    </div>
  )
  if (kind === 'rainy' || kind === 'stormy') return (
    <div className={`${containerClass} weather-${kind}`} aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => <span key={i} className="rain-drop" style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 8) * -.65}s`, animationDuration: `${2.4 + (i % 4) * .35}s` }} />)}
      {!scene && <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-sky-300/10 blur-3xl" />}
      {kind === 'stormy' && !scene && <svg className="lightning-bolt absolute right-[24%] top-[24%] h-20 w-16 text-cyan-50 sm:right-[27%] sm:h-28 sm:w-20" viewBox="0 0 64 96" fill="none"><path d="M37 3 10 51h19l-5 42 31-54H36l1-36Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/></svg>}
    </div>
  )
  if (kind === 'snowy') return (
    <div className={containerClass} aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => <span key={i} className="snowflake absolute h-1.5 w-1.5 rounded-full bg-white/65" style={{ left: `${(i * 41) % 100}%`, animationDelay: `${(i % 8) * -.9}s`, animationDuration: `${6 + (i % 4)}s` }} />)}
    </div>
  )
  return (
    <div className={containerClass} aria-hidden="true">
      <div className="weather-cloud absolute -right-8 top-8 h-28 w-44 rounded-full bg-white/5 blur-2xl" />
      <div className="weather-cloud absolute right-[30%] top-[45%] h-20 w-36 rounded-full bg-sky-200/5 blur-2xl" style={{ animationDelay: '-3s' }} />
    </div>
  )
}