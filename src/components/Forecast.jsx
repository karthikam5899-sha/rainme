import React from 'react'
import { Droplets } from 'lucide-react'
import WeatherIcon from './WeatherIcon'
import { displayTemp, dayName } from '../lib/weather'

function hourLabel(time) {
  const hour = Number(time.slice(11, 13))
  return `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`
}

export function HourlyForecast({ hours, unit }) {
  return <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:#475569_transparent]">
    {hours.map((hour, i) => <div key={hour.time} className={`min-w-[78px] flex-1 rounded-2xl px-2 py-4 text-center transition hover:bg-white/10 ${i === 0 ? 'bg-cyan-300/10 ring-1 ring-cyan-200/20' : 'bg-white/[0.04]'}`}>
      <p className="text-xs text-slate-400">{i === 0 ? 'Now' : hourLabel(hour.time)}</p>
      <div className="my-3 flex justify-center text-cyan-100"><WeatherIcon code={hour.code} isDay={hour.isDay} size={24} /></div>
      <p className="text-lg font-bold text-white">{displayTemp(hour.temp, unit)}</p>
      <p className="mt-1 truncate text-[10px] text-slate-400" title={hour.summary}>{hour.summary}</p>
      <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-sky-200"><Droplets size={11}/>{Math.round(hour.rain)}%</p>
    </div>)}
  </div>
}
export function WeeklyForecast({ days, unit }) {
  return <div className="space-y-1">
    {days.map((day, i) => <div key={day.date} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.06] sm:grid-cols-[1fr_1fr_1fr]">
      <div className="min-w-0"><p className="text-sm font-semibold text-white">{dayName(day.date, i)}</p><p className="mt-0.5 text-xs text-slate-400">{day.summary}</p></div>
      <div className="flex items-center justify-center gap-2 text-cyan-100"><WeatherIcon code={day.code} size={25}/><span className="hidden text-xs text-slate-400 sm:inline">{day.rain}% rain</span></div>
      <div className="flex items-center justify-end gap-3 text-sm"><span className="font-bold text-white">{displayTemp(day.max, unit)}</span><span className="text-slate-400">{displayTemp(day.min, unit)}</span></div>
    </div>)}
  </div>
}