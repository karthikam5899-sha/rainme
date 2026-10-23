import React from 'react'
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Moon, Sun } from 'lucide-react'

export default function WeatherIcon({ code = 1, isDay = true, size = 28, className = '' }) {
  const props = { size, strokeWidth: 1.65, className: `shrink-0 ${className}` }
  if (code === 0) return isDay ? <Sun {...props} /> : <Moon {...props} />
  if ([1, 2].includes(code)) return <span className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size, fontSize: size * .88 }}>{isDay ? '🌤️' : '☁️'}</span>
  if ([45, 48].includes(code)) return <CloudFog {...props} />
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle {...props} />
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain {...props} />
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow {...props} />
  if ([95, 96, 99].includes(code)) return <CloudLightning {...props} />
  return <Cloud {...props} />
}