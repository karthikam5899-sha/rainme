# Rain Me — India Weather App

A responsive weather dashboard built with React, Vite, Tailwind CSS and JavaScript. Designed around Indian cities and local time, with Rain Me branding.

## Features

- Live current conditions and 7-day forecast from Open-Meteo
- City search with Indian-city suggestions and invalid-city errors
- Current location detection (browser permission required; HTTPS or localhost)
- Hourly forecast, humidity, wind speed, pressure, sunrise and sunset
- Celsius/Fahrenheit display toggle
- Recent city searches, persisted in the browser
- Weather-aware sunny/cloudy/rain/snow animations
- Dark/light theme toggle, responsive layout, loading and empty states
- No API key required

Condition-based dashboard backgrounds use locally bundled Unsplash photos:

- Sunny: [photo](https://images.unsplash.com/photo-1500530855697-b586d89ba3ee)
- Cloudy: [photo](https://images.unsplash.com/photo-1534088568595-a066f410bcda)
- Rainy: [photo](https://images.unsplash.com/photo-1519692933481-e162a57d6721)
- Thunderstorm: [photo](https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28)
- Snowy: [photo](https://images.unsplash.com/photo-1491002052546-bf38f186af56)

The downloaded assets are served from `public/`, so weather backgrounds do not require a third-party request at runtime.

## Requirements

- Node.js 18+ (Node.js 20 LTS recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production website is generated in `dist/`.

## API used

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`

Open-Meteo's free API is used without an API key. Check its current terms and attribution requirements before deploying commercially: https://open-meteo.com/

## Notes

- Recent searches are stored locally in the browser and are not sent to the weather service.
- Geolocation is supported on `localhost` and secure HTTPS origins in most browsers.
- The light/dark button toggles the theme state; dashboard cards are intentionally designed with a dark weather-focused palette for contrast.
