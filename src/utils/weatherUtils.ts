import { WeatherCategory, ForecastItem, DailyForecastAggregated } from '../types';

export function getWeatherCategory(conditionId: number, main: string): WeatherCategory {
  const m = main.toLowerCase();
  if (conditionId < 300 || m.includes('thunder')) return 'thunderstorm';
  if (conditionId < 600 || m.includes('rain') || m.includes('drizzle')) return 'rain';
  if (conditionId >= 600 && conditionId < 700 || m.includes('snow')) return 'snow';
  if (conditionId >= 700 && conditionId < 800) return 'mist';
  if (conditionId === 800 || m.includes('clear')) return 'sunny';
  return 'cloudy';
}

export function formatTemp(celsius: number, isFahrenheit = false): string {
  if (isFahrenheit) {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTimeFromTimestamp(timestampSeconds: number, timezoneOffsetSeconds = 0): string {
  // Convert using target location offset
  const date = new Date((timestampSeconds + timezoneOffsetSeconds) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

export function formatHourlyHour(timestampSeconds: number, timezoneOffsetSeconds = 0): string {
  const date = new Date((timestampSeconds + timezoneOffsetSeconds) * 1000);
  const hours = date.getUTCHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours} ${ampm}`;
}

export function getCuteWeatherIcon(main: string, conditionId: number, isNight = false): string {
  const category = getWeatherCategory(conditionId, main);
  switch (category) {
    case 'sunny':
      return isNight ? '🌙' : '☀️';
    case 'cloudy':
      if (conditionId === 801 || conditionId === 802) {
        return isNight ? '☁️' : '🌤️';
      }
      return '☁️';
    case 'rain':
      if (conditionId >= 520) return '🌧️';
      return '🌦️';
    case 'thunderstorm':
      return '⛈️';
    case 'snow':
      return '❄️';
    case 'mist':
      return '🌫️';
    default:
      return '🌤️';
  }
}

export function aggregateDailyForecast(items: ForecastItem[], timezoneOffsetSeconds = 0): DailyForecastAggregated[] {
  const dayGroups: Record<string, ForecastItem[]> = {};

  for (const item of items) {
    const date = new Date((item.dt + timezoneOffsetSeconds) * 1000);
    const dayKey = date.toISOString().split('T')[0];
    if (!dayGroups[dayKey]) {
      dayGroups[dayKey] = [];
    }
    dayGroups[dayKey].push(item);
  }

  const days: DailyForecastAggregated[] = [];
  const entries = Object.entries(dayGroups);

  for (const [dayKey, dayItems] of entries) {
    const date = new Date(dayKey + 'T12:00:00Z');
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    let tempMax = -999;
    let tempMin = 999;
    let maxPop = 0;
    let totalHum = 0;
    let totalWind = 0;

    // Pick midday item for representative icon and description
    const midIndex = Math.floor(dayItems.length / 2);
    const repItem = dayItems[midIndex] || dayItems[0];

    for (const item of dayItems) {
      if (item.main.temp_max > tempMax) tempMax = item.main.temp_max;
      if (item.main.temp_min < tempMin) tempMin = item.main.temp_min;
      if (item.pop > maxPop) maxPop = item.pop;
      totalHum += item.main.humidity;
      totalWind += item.wind.speed;
    }

    days.push({
      dayName,
      dateStr,
      icon: getCuteWeatherIcon(repItem.weather[0]?.main || 'Clear', repItem.weather[0]?.id || 800),
      main: repItem.weather[0]?.main || 'Clear',
      description: repItem.weather[0]?.description || 'Clear sky',
      tempMax,
      tempMin,
      pop: Math.round(maxPop * 100),
      humidity: Math.round(totalHum / dayItems.length),
      windSpeed: Number((totalWind / dayItems.length).toFixed(1))
    });
  }

  // Return up to 6 days
  return days.slice(0, 7);
}

export function getAtmosphereStyles(category: WeatherCategory): {
  bgGradient: string;
  badgeBg: string;
  accentBorder: string;
  particleType: 'none' | 'sun' | 'clouds' | 'rain' | 'thunder' | 'snow';
  postcardTone: string;
} {
  switch (category) {
    case 'sunny':
      return {
        bgGradient: 'from-[#fff8f0] via-[#fef4ea] to-[#fceee5]',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
        accentBorder: 'border-amber-200/70',
        particleType: 'sun',
        postcardTone: 'from-amber-50 to-orange-50 border-amber-200'
      };
    case 'cloudy':
      return {
        bgGradient: 'from-[#f4f7fa] via-[#eef3f8] to-[#e6edf4]',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        accentBorder: 'border-slate-200/70',
        particleType: 'clouds',
        postcardTone: 'from-slate-50 to-sky-50 border-slate-200'
      };
    case 'rain':
      return {
        bgGradient: 'from-[#ebf4fa] via-[#e2eef7] to-[#d8e8f4]',
        badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
        accentBorder: 'border-sky-200/70',
        particleType: 'rain',
        postcardTone: 'from-sky-50 to-blue-50 border-sky-200'
      };
    case 'thunderstorm':
      return {
        bgGradient: 'from-[#ede9f5] via-[#e4ddf0] to-[#dbd0ea]',
        badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
        accentBorder: 'border-purple-200/70',
        particleType: 'thunder',
        postcardTone: 'from-purple-50 to-indigo-50 border-purple-200'
      };
    case 'snow':
      return {
        bgGradient: 'from-[#f5f9fc] via-[#edf4fa] to-[#e4eef7]',
        badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        accentBorder: 'border-indigo-200/70',
        particleType: 'snow',
        postcardTone: 'from-blue-50 to-indigo-50 border-indigo-200'
      };
    case 'mist':
    default:
      return {
        bgGradient: 'from-[#f5f6f8] via-[#eef0f3] to-[#e6e9ee]',
        badgeBg: 'bg-stone-100 text-stone-700 border-stone-200',
        accentBorder: 'border-stone-200/70',
        particleType: 'clouds',
        postcardTone: 'from-stone-50 to-zinc-50 border-stone-200'
      };
  }
}
