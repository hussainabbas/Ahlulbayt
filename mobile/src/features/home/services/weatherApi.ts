import type { WeatherInfo } from '../types';

const WMO_CODES: Record<number, string> = {
  0: 'clear',
  1: 'mainlyClear',
  2: 'partlyCloudy',
  3: 'overcast',
  45: 'fog',
  48: 'fog',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  61: 'rain',
  63: 'rain',
  65: 'heavyRain',
  71: 'snow',
  73: 'snow',
  75: 'heavySnow',
  80: 'showers',
  81: 'showers',
  82: 'heavyShowers',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
};

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherInfo> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  const data = (await res.json()) as OpenMeteoResponse;
  const code = data.current.weather_code;
  return {
    temperature: Math.round(data.current.temperature_2m),
    condition: WMO_CODES[code] ?? 'clear',
    conditionCode: code,
    unit: 'C',
  };
}

export function weatherEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  return '⛈️';
}
