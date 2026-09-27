export type WeatherCategory = 'sunny' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'mist';

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeatherResponse {
  coord: { lon: number; lat: number };
  weather: WeatherCondition[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  rain?: { '1h'?: number; '3h'?: number };
  snow?: { '1h'?: number; '3h'?: number };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  clouds: { all: number };
  wind: { speed: number; deg: number; gust?: number };
  visibility: number;
  pop: number; // Probability of precipitation 0..1
  rain?: { '3h'?: number };
  snow?: { '3h'?: number };
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface GeocodedLocation {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CountryInfo {
  id: string; // ISO numeric code as string (e.g. "250")
  name: string;
  alpha2: string; // "FR"
  flag: string; // "🇫🇷"
  capital: string;
  coordinates: [number, number]; // [lon, lat]
  popularCities: Array<{
    name: string;
    lat: number;
    lon: number;
    description?: string;
  }>;
}

export interface ActivityRecommendation {
  id: string;
  title: string;
  icon?: string;
  tagline: string;
  description: string;
  suitability: 'Perfect match' | 'Cozy choice' | 'Great alternative' | 'Weather proof';
  type: 'Outdoor' | 'Indoor' | 'Semi-sheltered';
  bestTime: string;
  category: 'food' | 'culture' | 'nature' | 'shopping' | 'relaxation' | 'adventure';
  cityHighlight?: boolean;
}

export interface WeatherMood {
  title: string;
  emoji: string;
  quote: string;
  vibe: string;
  vibeRating: number; // 1-100
  color: string;
}

export interface OutfitSuggestion {
  headline: string;
  summary: string;
  items: Array<{
    name: string;
    icon: string;
    badge: string;
  }>;
  quickTip: string;
}

export interface DailyForecastAggregated {
  dayName: string;
  dateStr: string;
  icon: string;
  main: string;
  description: string;
  tempMax: number;
  tempMin: number;
  pop: number; // percentage 0-100
  humidity: number;
  windSpeed: number;
}

export interface RealPlace {
  id: string;
  displayName: { text: string; languageCode?: string };
  formattedAddress: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  primaryTypeDisplayName?: { text: string };
  location?: { latitude: number; longitude: number };
  websiteUri?: string;
}

