import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowDown, ArrowUp, CalendarDays, Clock3, CloudSun, Compass, Droplets,
  Eye, Gauge, LocateFixed, MapPin, Moon, Search, Sun, Sunrise, Sunset,
  Thermometer, Wind, CloudRain, RefreshCw, SunMedium
} from 'lucide-react'
import WeatherIcon from './components/WeatherIcon'
import WeatherEffects from './components/WeatherEffects'
import PageIntro from './components/PageIntro'
import MetricCard from './components/MetricCard'
import SearchBar from './components/SearchBar'
import { HourlyForecast, WeeklyForecast } from './components/Forecast'
import { displayTemp, formatWind, weatherKind, weatherLabel } from './lib/weather'

const DEFAULT_CITY = 'Tiruchirappalli'
const RECENT_CITIES_STORAGE_KEY = 'monsoon-recent-cities'
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'
const weatherParams = 'current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,pressure_msl,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,is_day,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto&forecast_days=7'

async function findCity(name) {
  const response = await fetch(`${GEO_URL}?name=${encodeURIComponent(name)}&count=8&language=en&format=json`)
  if (!response.ok) throw new Error('Could not search cities right now. Please try again.')
  const data = await response.json()
  if (!data.results?.length) throw new Error(`We couldn't find “${name}”. Check the spelling and try another city.`)
  const results = data.results
  const india = results.find(place => place.country_code === 'IN')
  return india || results[0]
}
async function fetchWeather(place) {
  const response = await fetch(`${WEATHER_URL}?latitude=${place.latitude}&longitude=${place.longitude}&${weatherParams}`)
  if (!response.ok) throw new Error('Weather data is temporarily unavailable. Please try again.')
  const data = await response.json()
  if (!data.current || !data.daily) throw new Error('Weather data was incomplete. Please try again.')
  return data
}
function localClock(timezone, date) {
  return new Intl.DateTimeFormat('en-IN', { timeZone: timezone || 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(date)
}
function timeOnly(value, timezone) {
  return new Intl.DateTimeFormat('en-IN', { timeZone: timezone || 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}
function readRecentCities() {
  try {
    const saved = window.localStorage.getItem(RECENT_CITIES_STORAGE_KEY)
    if (!saved) return []
    const cities = JSON.parse(saved)
    if (!Array.isArray(cities)) return []
    return [...new Set(cities.filter(city => typeof city === 'string' && city.trim()))].slice(0, 6)
  } catch (error) {
    console.warn('Could not read recent cities from local storage.', error)
    return []
  }
}
function Header({ dark, setDark, unit, setUnit, onRefresh, loading }) {
  return <header className="relative z-30 flex flex-wrap items-center justify-between gap-4">
    <a href="#" className="flex items-center gap-3" aria-label="Rain Me home">
      <img src="/Rain%20Me.png" alt="" className="h-11 w-11 rounded-2xl object-cover shadow-lg shadow-cyan-950/30" />
      <span><span className="block font-display text-xl font-extrabold tracking-tight text-white">Rain Me</span><span className="block text-[10px] font-semibold uppercase tracking-[.22em] text-slate-400">India weather</span></span>
    </a>
    <div className="flex items-center gap-2">
      <div className="flex rounded-xl border border-white/10 bg-white/[0.05] p-1">
        {['C', 'F'].map(v => <button key={v} onClick={() => setUnit(v)} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${unit === v ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`} aria-pressed={unit === v}>°{v}</button>)}
      </div>
      <button onClick={onRefresh} disabled={loading} title="Refresh weather" aria-label="Refresh weather" className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"><RefreshCw size={17} className={loading ? 'animate-spin' : ''}/></button>
      <button onClick={() => setDark(!dark)} title="Toggle theme" aria-label="Toggle light or dark mode" className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white">{dark ? <Sun size={17}/> : <Moon size={17}/>}</button>
    </div>
  </header>
}
function SectionTitle({ eyebrow, title, icon: Icon, action }) {
  return <div className="mb-5 flex items-end justify-between gap-3"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[.22em] text-cyan-300">{eyebrow}</p><h2 className="font-display text-lg font-bold text-white sm:text-xl">{title}</h2></div>{action || (Icon && <Icon size={19} className="text-slate-400"/>)}</div>
}
function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [place, setPlace] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unit, setUnit] = useState('C')
  const [dark, setDark] = useState(true)
  const [recent, setRecent] = useState(readRecentCities)
  const [lastQuery, setLastQuery] = useState(DEFAULT_CITY)
  const [locationLoading, setLocationLoading] = useState(false)
  const [clockNow, setClockNow] = useState(() => new Date())

  const loadCity = useCallback(async (name) => {
    setLoading(true); setError('')
    try {
      const found = await findCity(name)
      const data = await fetchWeather(found)
      setPlace(found); setWeather(data); setLastQuery(found.name)
      setRecent(prev => [found.name, ...prev.filter(city => city.toLowerCase() !== found.name.toLowerCase())].slice(0, 6))
    } catch (e) { setError(e.message || 'Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }, [])
  const dismissIntro = useCallback(() => {
    setShowIntro(false)
  }, [])

  useEffect(() => { loadCity(DEFAULT_CITY) }, [loadCity])
  useEffect(() => {
    const interval = setInterval(() => setClockNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    try {
      window.localStorage.setItem(RECENT_CITIES_STORAGE_KEY, JSON.stringify(recent))
    } catch (error) {
      console.warn('Could not save recent cities to local storage.', error)
    }
  }, [recent])
  const current = weather?.current
  const daily = weather?.daily
  const kind = weatherKind(current?.weather_code ?? 1)
  const hourly = useMemo(() => {
    if (!weather?.hourly) return []
    const times = weather.hourly.time
    let start = times.findIndex(t => t >= weather.current.time)
    if (start < 0) start = Math.max(0, times.length - 8)
    return times.slice(start, start + 8).map((time, j) => {
      const i = start + j
      const code = weather.hourly.weather_code[i]
      return { time, temp: weather.hourly.temperature_2m[i], code, summary: weatherLabel(code), isDay: weather.hourly.is_day[i] === 1, rain: weather.hourly.precipitation_probability[i] ?? 0 }
    })
  }, [weather])
  const days = useMemo(() => {
    if (!daily) return []
    return daily.time.map((date, i) => ({ date, max: daily.temperature_2m_max[i], min: daily.temperature_2m_min[i], code: daily.weather_code[i], rain: daily.precipitation_probability_max[i] ?? 0, summary: weatherLabel(daily.weather_code[i]) }))
  }, [daily])
  const refresh = () => loadCity(lastQuery)
  const useLocation = () => {
    setError('')
    if (!navigator.geolocation) { setError('Location detection is not supported by this browser. Search for your city instead.'); return }
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(async position => {
      try {
        const loc = { latitude: position.coords.latitude, longitude: position.coords.longitude, name: 'My location', admin1: 'Current location', country: 'India', country_code: 'IN' }
        const data = await fetchWeather(loc)
        setPlace(loc); setWeather(data); setLastQuery('My location')
        setRecent(prev => ['My location', ...prev.filter(x => x !== 'My location')].slice(0, 6))
      } catch (e) { setError(e.message || 'Could not load weather for your location.') }
      finally { setLocationLoading(false) }
    }, err => {
      setLocationLoading(false)
      setError(err.code === 1 ? 'Location permission was denied. Allow location access or search for a city.' : 'Could not detect your location. Please search for a city.')
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 })
  }
  const timezone = weather?.timezone || 'Asia/Kolkata'
  const sunrise = daily?.sunrise?.[0]
  const sunset = daily?.sunset?.[0]
  const isDay = current?.is_day === 1
  const dateLine = weather ? localClock(timezone, clockNow) : 'Getting local time…'

  return <>
    <main className={`app-shell min-h-screen overflow-hidden ${dark ? 'dark bg-[#080f20] text-white' : 'theme-light bg-slate-100 text-slate-900'}`}>
    <div className={`weather-backdrop weather-${kind} ${dark ? 'weather-theme-dark' : 'weather-theme-light'} relative min-h-screen`}>
      <div key={kind} className={`weather-photo-layer weather-photo-${kind}`} aria-hidden="true" />
      {(kind === 'rainy' || kind === 'stormy') && <WeatherEffects key={`scene-${kind}`} kind={kind} scene />}
      <div className="pointer-events-none absolute -left-40 top-72 h-96 w-96 rounded-full bg-blue-500/[0.06] blur-3xl"/>
      <div className="relative z-20 mx-auto max-w-[1440px] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10 lg:pt-9">
        <Header dark={dark} setDark={setDark} unit={unit} setUnit={setUnit} onRefresh={refresh} loading={loading}/>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,370px)] lg:items-start">
          <section className="min-w-0">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-slate-400">Your daily forecast</p><h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Weather, at a glance<span className="text-cyan-300">.</span></h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">A little more clarity for wherever your day takes you.</p></div>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-400 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"/>{loading ? 'Updating live data' : 'Live weather data'}</div>
            </div>
            <div className="mb-7 max-w-2xl"><SearchBar onSearch={loadCity} loading={loading} locationLoading={locationLoading} recent={recent} onUseLocation={useLocation}/></div>
            {error && <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100"><span className="mt-0.5">⚠️</span><div className="flex-1">{error}</div><button onClick={() => setError('')} aria-label="Dismiss error" className="text-rose-200 hover:text-white">✕</button></div>}
            {loading && !weather && <div role="status" className="flex min-h-[320px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]"><div className="text-center"><div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300"/><p className="text-sm text-slate-300">Fetching live weather…</p></div></div>}
            {weather && current && <div className="space-y-7">
              <section key={`${place?.latitude}-${place?.longitude}-${current.weather_code}`} className="weather-hero card-enter relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#15334d] via-[#152a48] to-[#1d2445] p-5 shadow-2xl shadow-slate-950/20 sm:p-8">
                <WeatherEffects key={kind} kind={kind}/>
                <div className="relative z-10">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><div className="flex items-center gap-2 text-sm text-slate-300"><MapPin size={15} className="text-cyan-300"/>{place?.name || lastQuery}{place?.admin1 ? `, ${place.admin1}` : ''}</div><p className="mt-2 text-xs text-slate-400">{place?.country || 'India'} <span className="mx-1.5">·</span>{dateLine}</p></div>
                    <div className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-xs font-medium text-slate-300"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"/>Now</div>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-5 sm:mt-10">
                    <div><div className="font-display text-[76px] font-extrabold leading-none tracking-[-.07em] text-white sm:text-[100px]">{displayTemp(current.temperature_2m, unit)}<span className="align-top text-4xl font-medium tracking-normal text-cyan-200 sm:text-5xl">{unit}</span></div><p className="mt-4 text-xl font-semibold text-white">{weatherLabel(current.weather_code)}</p><p className="mt-1 text-sm text-slate-300">Feels like {displayTemp(current.apparent_temperature, unit)}{unit}</p></div>
                    <div className="mr-3 flex h-28 w-28 items-center justify-center text-cyan-100 drop-shadow-[0_0_24px_rgba(103,232,249,.25)] sm:mr-8 sm:h-36 sm:w-36"><WeatherIcon code={current.weather_code} isDay={isDay} size={112}/></div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 sm:grid-cols-4">
                    <div><div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><ArrowUp size={14}/> High</div><p className="text-lg font-bold text-white">{displayTemp(daily.temperature_2m_max[0], unit)}</p></div>
                    <div><div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><ArrowDown size={14}/> Low</div><p className="text-lg font-bold text-white">{displayTemp(daily.temperature_2m_min[0], unit)}</p></div>
                    <div><div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><Sunrise size={14}/> Sunrise</div><p className="text-lg font-bold text-white">{timeOnly(sunrise, timezone)}</p></div>
                    <div><div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><Sunset size={14}/> Sunset</div><p className="text-lg font-bold text-white">{timeOnly(sunset, timezone)}</p></div>
                  </div>
                </div>
              </section>
              <section className="card-enter" style={{ animationDelay: '.08s' }}>
                <SectionTitle eyebrow="The details" title="Today's conditions" icon={Compass}/>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <MetricCard icon={Droplets} label="Humidity" value={`${current.relative_humidity_2m}%`} detail="Relative humidity"/>
                  <MetricCard icon={Wind} label="Wind speed" value={formatWind(current.wind_speed_10m, unit)} detail="At 10 metres"/>
                  <MetricCard icon={Eye} label="Visibility" value={weather.hourly?.visibility?.length ? `${(weather.hourly.visibility[Math.max(0, weather.hourly.time.findIndex(t => t >= current.time))] / 1000).toFixed(1)} km` : "—"} detail="Estimated horizontal range"/>
                  <MetricCard icon={Gauge} label="Pressure" value={`${Math.round(current.pressure_msl)} hPa`} detail="Sea-level pressure"/>
                </div>
              </section>
              <section className="card-enter rounded-3xl border border-white/10 bg-white/[0.045] p-4 sm:p-6" style={{ animationDelay: '.14s' }}>
                <SectionTitle eyebrow="Coming up" title="Next hours" icon={Clock3}/>
                <HourlyForecast hours={hourly} unit={unit}/>
              </section>
              <section className="card-enter rounded-3xl border border-white/10 bg-white/[0.045] p-4 sm:p-6" style={{ animationDelay: '.2s' }}>
                <SectionTitle eyebrow="Plan ahead" title="7-day forecast" icon={CalendarDays}/>
                <WeeklyForecast days={days} unit={unit}/>
              </section>
            </div>}
            {!weather && !loading && <div role="status" className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center"><CloudSun className="mx-auto mb-3 text-cyan-200" size={38}/><p className="font-semibold text-white">Weather is waiting</p><p className="mt-1 text-sm text-slate-400">Search for a city to see its forecast.</p><button onClick={() => loadCity(DEFAULT_CITY)} className="mt-4 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950">Try {DEFAULT_CITY}</button></div>}
          </section>
          <aside className="space-y-5">
            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6">
              <SectionTitle eyebrow="Quick access" title="Popular in India" icon={MapPin}/>
              <div className="grid grid-cols-2 gap-2">
                {['Chennai', 'Mumbai', 'New Delhi', 'Bengaluru', 'Hyderabad', 'Kochi', 'Coimbatore', 'Madurai'].map(city => <button key={city} onClick={() => loadCity(city)} className={`rounded-xl border px-3 py-3 text-left text-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200/30 hover:bg-cyan-300/10 ${place?.name === city ? 'border-cyan-200/30 bg-cyan-300/10 text-cyan-100' : 'border-white/[0.07] bg-white/[0.025] text-slate-300'}`}><span className="block truncate font-semibold">{city}</span><span className="mt-1 block text-[10px] text-slate-500">India</span></button>)}
              </div>
            </section>
            <section className="daylight-card relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#173b50] to-[#17243f] p-5 sm:p-6">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl"/>
              <div className="relative"><SectionTitle eyebrow="Daylight" title="Sunrise & sunset" icon={SunMedium}/>
                {weather && <><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="rounded-xl bg-amber-300/10 p-2.5 text-amber-200"><Sunrise size={22}/></div><div><p className="text-xs text-slate-400">Sunrise</p><p className="mt-1 text-lg font-bold text-white">{timeOnly(sunrise, timezone)}</p></div></div><ArrowUp size={17} className="text-amber-200"/></div>
                <div className="my-5 h-px bg-white/10"/>
                <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="rounded-xl bg-orange-300/10 p-2.5 text-orange-200"><Sunset size={22}/></div><div><p className="text-xs text-slate-400">Sunset</p><p className="mt-1 text-lg font-bold text-white">{timeOnly(sunset, timezone)}</p></div></div><ArrowDown size={17} className="text-orange-200"/></div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[64%] rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300"/></div><p className="mt-2 text-[10px] text-slate-500">Sun times are local to the selected city.</p></>}
              </div>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6">
              <SectionTitle eyebrow="Your activity" title="Recent searches" icon={Search}/>
              {recent.length ? <div className="space-y-1">{recent.map((city, i) => <button key={`${city}-${i}`} onClick={() => city === 'My location' ? useLocation() : loadCity(city)} className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-white/[0.06]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-cyan-200"><MapPin size={16}/></span><span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-200">{city}</span><span className="text-xs text-slate-500">View</span></button>)}</div> : <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center"><Clock3 className="mx-auto mb-2 text-slate-500" size={22}/><p className="text-sm text-slate-400">Your searches will appear here.</p><p className="mt-1 text-xs text-slate-500">Try a city to get started.</p></div>}
            </section>
            <p className="px-2 text-center text-[11px] leading-5 text-slate-500">Weather data by Open-Meteo · Built for India 🇮🇳<br/>Forecasts are estimates and may change.</p>
          </aside>
        </div>
        <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/[0.08] pt-5 text-xs text-slate-500 sm:flex-row"><p>© {new Date().getFullYear()} Rain Me. Made for everyday weather.</p><p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>{weather ? `Updated for ${place?.name || 'your location'}` : 'Connecting to forecast service'}</p></footer>
      </div>
    </div>
    </main>
    {showIntro && <PageIntro onComplete={dismissIntro} />}
  </>
}
export default App