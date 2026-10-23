export const INDIA_CITIES = [
  'Tiruchirappalli', 'Chennai', 'Coimbatore', 'Madurai', 'Bengaluru',
  'Hyderabad', 'Mumbai', 'Pune', 'New Delhi', 'Kolkata', 'Kochi',
  'Thiruvananthapuram', 'Mysuru', 'Ahmedabad', 'Jaipur', 'Lucknow',
]

export function weatherLabel(code) {
  if (code === 0) return 'Clear sky'
  if ([1, 2].includes(code)) return 'Mostly clear'
  if (code === 3) return 'Overcast'
  if ([45, 48].includes(code)) return 'Foggy'
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow'
  if ([95, 96, 99].includes(code)) return 'Thunderstorm'
  return 'Partly cloudy'
}
export function weatherKind(code) {
  if ([0, 1].includes(code)) return 'sunny'
  if ([2, 3, 45, 48].includes(code)) return 'cloudy'
  if ([95, 96, 99].includes(code)) return 'stormy'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rainy'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snowy'
  return 'cloudy'
}
export function weatherEmoji(code, isDay = true) {
  if (code === 0) return isDay ? '☀️' : '🌙'
  if ([1, 2].includes(code)) return isDay ? '🌤️' : '☁️'
  if ([3, 45, 48].includes(code)) return '☁️'
  if ([51, 53, 55, 56, 57].includes(code)) return '🌦️'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️'
  if ([95, 96, 99].includes(code)) return '⛈️'
  return '🌤️'
}
export function formatTime(value, options = { hour: '2-digit', minute: '2-digit' }) {
  return new Intl.DateTimeFormat('en-IN', { ...options, timeZone: undefined }).format(new Date(value))
}
export function celsius(value, unit) {
  return unit === 'F' ? Math.round((value * 9 / 5 + 32) * 10) / 10 : Math.round(value)
}
export function displayTemp(value, unit) { return `${Math.round(celsius(value, unit))}°` }
export function formatWind(value, unit) { return `${Math.round(unit === 'F' ? value * 0.621371 : value)} ${unit === 'F' ? 'mph' : 'km/h'}` }
export function dayName(date, index) {
  if (index === 0) return 'Today'
  if (index === 1) return 'Tomorrow'
  return new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(new Date(`${date}T12:00:00`))
}