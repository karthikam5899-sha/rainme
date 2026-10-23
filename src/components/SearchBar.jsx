import React, { useState } from 'react'
import { LoaderCircle, MapPin, Search, X } from 'lucide-react'
import { INDIA_CITIES } from '../lib/weather'

export default function SearchBar({ onSearch, loading, locationLoading, recent, onUseLocation }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const suggestions = query.trim()
    ? INDIA_CITIES.filter(city => city.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : []
  const submit = (value = query) => {
    if (value.trim()) { onSearch(value.trim()); setQuery(''); setFocused(false) }
  }
  return (
    <div className="relative z-20 w-full">
      <form onSubmit={e => { e.preventDefault(); submit() }} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition duration-300 ${focused ? 'border-cyan-300/60 bg-white/10 shadow-[0_0_0_4px_rgba(103,232,249,.08)]' : 'border-white/10 bg-white/[0.06]'}`}>
        <Search size={19} className="shrink-0 text-slate-400" />
        <input value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 160)} placeholder="Search by city name..." aria-label="Search city" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400" />
        {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="text-slate-400 hover:text-white"><X size={17} /></button>}
        <button type="submit" disabled={loading || locationLoading || !query.trim()} aria-busy={loading} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50">{loading && <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />}{loading ? 'Loading…' : 'Search'}</button>
      </form>
      {focused && (suggestions.length > 0 || recent.length > 0) && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl glass">
          {suggestions.length > 0 && <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">Suggested cities</p>}
          {suggestions.map(city => <button key={city} onMouseDown={() => submit(city)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/10"><MapPin size={15} className="text-cyan-300" />{city}<span className="ml-auto text-xs text-slate-500">India</span></button>)}
          {recent.length > 0 && <><p className="px-2 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">Recent searches</p>{recent.slice(0, 4).map(city => <button key={city} onMouseDown={() => submit(city)} className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">{city}</button>)}</>}
        </div>
      )}
      <button onClick={onUseLocation} disabled={loading || locationLoading} aria-busy={locationLoading} className="mt-3 inline-flex items-center gap-2 px-1 text-xs font-semibold text-cyan-200 transition hover:text-white disabled:cursor-wait disabled:opacity-60">{locationLoading ? <LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> : <MapPin size={14} />}{locationLoading ? 'Finding your location…' : 'Use my current location'}</button>
    </div>
  )
}