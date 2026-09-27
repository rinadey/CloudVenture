import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CurrentWeatherResponse,
  ForecastResponse,
  WeatherCategory,
  RealPlace,
} from '../types';
import {
  getWeatherCategory,
  formatTemp,
  formatTimeFromTimestamp,
  formatHourlyHour,
  getCuteWeatherIcon,
  aggregateDailyForecast,
  getAtmosphereStyles,
} from '../utils/weatherUtils';
import {
  generateCityActivities,
  generateWeatherMood,
  generateOutfitSuggestion,
} from '../data/whimsicalActivities';
import {
  ArrowLeft,
  Droplets,
  Wind,
  Thermometer,
  CloudRain,
  Eye,
  Sunrise,
  Sunset,
  Clock,
  Sparkles,
  Calendar,
  Compass,
  Briefcase,
  Heart,
  Cloud,
  Sun,
  Moon,
  Umbrella,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Star,
  Layers,
  Utensils,
  Coffee,
} from 'lucide-react';

interface WeatherExperienceProps {
  weather: CurrentWeatherResponse;
  forecast: ForecastResponse | null;
  onBackToMap: () => void;
  cityName: string;
  countryName?: string;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const WeatherExperience: React.FC<WeatherExperienceProps> = ({
  weather,
  forecast,
  onBackToMap,
  cityName,
  countryName,
  darkMode = false,
  onToggleDarkMode,
}) => {
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [realPlaces, setRealPlaces] = useState<RealPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  // Compute destination local time from weather.timezone (in seconds)
  const { localHour, localTimeString, currentPeriod } = useMemo(() => {
    const nowUtc = Date.now() + new Date().getTimezoneOffset() * 60 * 1000;
    const destDate = new Date(nowUtc + (weather.timezone || 0) * 1000);
    const hour = destDate.getHours();
    const minutes = destDate.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const timeStr = `${displayHour}:${minutes} ${ampm}`;

    let period: 'morning' | 'lunch' | 'tea' | 'dinner' | 'night' = 'morning';
    if (hour >= 5 && hour < 11.5) {
      period = 'morning';
    } else if (hour >= 11.5 && hour < 16.5) {
      period = 'lunch';
    } else if (hour >= 16.5 && hour < 19) {
      period = 'tea';
    } else if (hour >= 19 && hour < 23) {
      period = 'dinner';
    } else {
      period = 'night';
    }

    return { localHour: hour, localTimeString: timeStr, currentPeriod: period };
  }, [weather.timezone]);

  const [selectedMealPeriod, setSelectedMealPeriod] = useState<'morning' | 'lunch' | 'tea' | 'dinner' | 'night'>(currentPeriod);
  const [foodPlaces, setFoodPlaces] = useState<RealPlace[]>([]);
  const [isLoadingFood, setIsLoadingFood] = useState(false);

  // Keep selected meal period synced when switching destination
  useEffect(() => {
    setSelectedMealPeriod(currentPeriod);
  }, [currentPeriod, cityName]);

  // Fetch food places based on time of day from Google Places API
  useEffect(() => {
    let isMounted = true;
    const fetchFood = async () => {
      setIsLoadingFood(true);
      try {
        const queryParams = new URLSearchParams({
          city: cityName,
          country: countryName || '',
          category: 'food',
          timeOfDay: selectedMealPeriod,
        });
        const res = await fetch(`/api/places?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setFoodPlaces(data);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch food places from Google Places API:', err);
      } finally {
        if (isMounted) setIsLoadingFood(false);
      }
    };

    fetchFood();
    return () => {
      isMounted = false;
    };
  }, [cityName, countryName, selectedMealPeriod]);

  // Derive weather category & conditions
  const conditionId = weather.weather[0]?.id || 800;
  const mainCondition = weather.weather[0]?.main || 'Clear';
  const description = weather.weather[0]?.description || 'Clear sky';
  const category: WeatherCategory = getWeatherCategory(conditionId, mainCondition);
  const atmosphere = getAtmosphereStyles(category);

  // Derive rain chance from next forecast block if available
  const nextHourPop = forecast?.list?.[0]?.pop ? Math.round(forecast.list[0].pop * 100) : 0;

  // Generate activities, mood, outfit (gender-neutral)
  const activities = useMemo(() => {
    return generateCityActivities(weather, cityName, countryName, nextHourPop);
  }, [weather, cityName, countryName, nextHourPop]);

  const mood = useMemo(() => generateWeatherMood(weather), [weather]);
  const outfit = useMemo(() => generateOutfitSuggestion(weather), [weather]);

  // Aggregate forecast into 7 daily cards
  const dailyForecast = useMemo(() => {
    if (!forecast?.list) return [];
    return aggregateDailyForecast(forecast.list, weather.timezone);
  }, [forecast, weather.timezone]);

  // Hourly forecast slice (next 8 3-hour blocks)
  const hourlyList = useMemo(() => {
    if (!forecast?.list) return [];
    return forecast.list.slice(0, 8);
  }, [forecast]);

  // Fetch real places using Google Places API (New) via server proxy (Key 2: AIzaSyBuG8Z1BVICqtC7sfHGxGufVSUejsEG09c)
  useEffect(() => {
    let isMounted = true;
    const fetchRealPlaces = async () => {
      setIsLoadingPlaces(true);
      try {
        const queryParams = new URLSearchParams({
          city: cityName,
          country: countryName || '',
          weather: mainCondition,
        });
        const res = await fetch(`/api/places?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setRealPlaces(data);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch real places from Google Places API:', err);
      } finally {
        if (isMounted) setIsLoadingPlaces(false);
      }
    };

    fetchRealPlaces();
    return () => {
      isMounted = false;
    };
  }, [cityName, countryName, mainCondition]);

  return (
    <div
      id="weather-experience-root"
      className={`relative min-h-screen transition-colors duration-700 py-8 px-4 sm:px-6 lg:px-8 ${
        darkMode
          ? 'bg-slate-900 text-slate-100'
          : `bg-gradient-to-b ${atmosphere.bgGradient} text-slate-800`
      }`}
    >
      {/* Dynamic Animated Atmospheric Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {atmosphere.particleType === 'sun' && (
          <>
            <div
              className={`absolute top-10 right-16 w-96 h-96 rounded-full blur-3xl ${
                darkMode ? 'bg-amber-500/10' : 'bg-amber-300/35'
              }`}
            />
            <div
              className={`absolute top-20 right-28 animate-twinkle text-2xl ${
                darkMode ? 'text-amber-400/50' : 'text-amber-400/70'
              }`}
            >
              ✨
            </div>
            <div
              className={`absolute top-48 right-72 animate-twinkle text-lg ${
                darkMode ? 'text-amber-300/40' : 'text-amber-400/60'
              }`}
            >
              ✦
            </div>
          </>
        )}

        {atmosphere.particleType === 'rain' && (
          <div className="absolute inset-0 opacity-40">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-sky-400 font-bold select-none animate-[gentleRain_2.5s_linear_infinite]"
                style={{
                  left: `${(i * 5 + 3) % 98}%`,
                  top: `${(i * 12) % 60}%`,
                  animationDelay: `${(i * 0.2) % 2.5}s`,
                  fontSize: '12px',
                }}
              >
                💧
              </div>
            ))}
          </div>
        )}

        {atmosphere.particleType === 'snow' && (
          <div className="absolute inset-0 opacity-50">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute text-indigo-300 select-none animate-[gentleSnow_4.5s_linear_infinite]"
                style={{
                  left: `${(i * 4.3) % 96}%`,
                  top: `${(i * 15) % 65}%`,
                  animationDelay: `${(i * 0.3) % 4.5}s`,
                  fontSize: `${14 + (i % 3) * 4}px`,
                }}
              >
                ❄️
              </div>
            ))}
          </div>
        )}

        {atmosphere.particleType === 'clouds' && (
          <>
            <div className={`absolute top-12 left-10 text-7xl animate-float ${darkMode ? 'text-slate-600/30' : 'text-slate-300/50'}`}>☁️</div>
            <div className={`absolute top-40 right-20 text-8xl animate-float-delayed ${darkMode ? 'text-slate-600/25' : 'text-slate-300/40'}`}>☁️</div>
          </>
        )}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Navigation & Header Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            id="btn-back-to-map"
            onClick={onBackToMap}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-md font-whimsical font-bold text-sm transition-all hover:scale-105 active:scale-95 group ${
              darkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700 shadow-slate-950/50'
                : 'bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 border-white shadow-rose-100/60'
            }`}
          >
            <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${darkMode ? 'text-sky-400' : 'text-rose-500'}`} />
            <span>← Explore another place</span>
          </button>

          {/* Unit Switcher & Dark Mode Toggle Controls */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle Button */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`p-2 rounded-2xl border shadow-sm font-whimsical font-semibold text-xs transition-all flex items-center gap-1.5 ${
                  darkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
                    : 'bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600 border-white shadow-xs'
                }`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
              </button>
            )}

            {/* Unit Switcher (°C / °F) */}
            <div
              className={`flex items-center p-1 rounded-2xl border shadow-sm backdrop-blur-sm ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/90 border-white'
              }`}
            >
              <button
                onClick={() => setIsFahrenheit(false)}
                className={`px-3 py-1.5 rounded-xl font-whimsical font-bold text-xs transition-all ${
                  !isFahrenheit
                    ? darkMode
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-xs'
                    : darkMode
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setIsFahrenheit(true)}
                className={`px-3 py-1.5 rounded-xl font-whimsical font-bold text-xs transition-all ${
                  isFahrenheit
                    ? darkMode
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-xs'
                    : darkMode
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {/* 4. LOCATION REVEAL HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors ${
            darkMode
              ? 'bg-slate-800/95 border-slate-700 shadow-slate-950/60 text-slate-100'
              : 'bg-white/95 border-white shadow-rose-100/50 text-slate-800'
          }`}
        >
          <div className="text-center sm:text-left">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-whimsical font-semibold mb-2 border ${
                darkMode
                  ? 'bg-slate-700/80 border-slate-600 text-sky-400'
                  : 'bg-rose-50 border-rose-200/70 text-rose-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Current Destination</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-whimsical font-bold tracking-tight">
              Welcome to {cityName} ✨
            </h1>
            <p className={`text-sm sm:text-base mt-1 flex items-center justify-center sm:justify-start gap-1.5 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <span>📍</span>
              <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{cityName}</span>
              {countryName && <span>· {countryName}</span>}
            </p>
          </div>

          {/* Cute weather hero illustration element */}
          <div className="relative flex items-center justify-center">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-2 shadow-lg flex items-center justify-center text-5xl sm:text-6xl animate-float ${
                darkMode
                  ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 shadow-slate-950/80'
                  : 'bg-gradient-to-br from-rose-100 to-amber-100 border-white'
              }`}
            >
              {getCuteWeatherIcon(mainCondition, conditionId)}
            </div>
            <div
              className={`absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full border shadow-sm text-[11px] font-whimsical font-bold ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-sky-400'
                  : 'bg-white border-rose-200 text-rose-600'
              }`}
            >
              {mainCondition}
            </div>
          </div>
        </motion.div>

        {/* 5. CURRENT WEATHER HERO & METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Temperature Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className={`md:col-span-1 rounded-3xl p-6 sm:p-8 border-2 shadow-xl flex flex-col justify-between backdrop-blur-md ${
              darkMode
                ? 'bg-slate-800/95 border-slate-700 shadow-slate-950/60 text-slate-100'
                : 'bg-white/95 border-white shadow-rose-100/50 text-slate-800'
            }`}
          >
            <div>
              <div className={`text-xs font-semibold uppercase tracking-wider font-whimsical ${
                darkMode ? 'text-slate-400' : 'text-slate-400'
              }`}>
                Temperature Right Now
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-6xl sm:text-7xl font-bold font-whimsical">
                  {formatTemp(weather.main.temp, isFahrenheit)}
                </span>
              </div>
              <div className="mt-2 text-base font-semibold capitalize font-whimsical flex items-center gap-2">
                <span>{description}</span>
              </div>
              <div className={`text-xs font-medium mt-1 ${darkMode ? 'text-sky-400' : 'text-rose-500'}`}>
                Feels like {formatTemp(weather.main.feels_like, isFahrenheit)}
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-medium ${
              darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <span>Low: {formatTemp(weather.main.temp_min, isFahrenheit)}</span>
              <span>•</span>
              <span>High: {formatTemp(weather.main.temp_max, isFahrenheit)}</span>
            </div>
          </motion.div>

          {/* Grid of Cute Weather Metric Cards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
          >
            {/* Humidity */}
            <div
              className={`rounded-2xl p-4 border shadow-md flex flex-col justify-between hover:scale-[1.02] transition-transform ${
                darkMode ? 'bg-slate-800/90 border-slate-700 shadow-slate-950/40 text-slate-100' : 'bg-white/90 border-white shadow-sky-50 text-slate-800'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-sky-900/60 text-sky-400' : 'bg-sky-100 text-sky-600'
              }`}>
                <Droplets className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <div className="text-[11px] text-slate-400 font-medium">Humidity</div>
                <div className="text-xl font-bold font-whimsical mt-0.5">{weather.main.humidity}%</div>
                <div className={`text-[10px] font-medium ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                  {weather.main.humidity > 65 ? 'Balmy moisture' : 'Comfortable air'}
                </div>
              </div>
            </div>

            {/* Wind */}
            <div
              className={`rounded-2xl p-4 border shadow-md flex flex-col justify-between hover:scale-[1.02] transition-transform ${
                darkMode ? 'bg-slate-800/90 border-slate-700 shadow-slate-950/40 text-slate-100' : 'bg-white/90 border-white shadow-slate-50 text-slate-800'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-teal-900/60 text-teal-400' : 'bg-teal-100 text-teal-600'
              }`}>
                <Wind className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <div className="text-[11px] text-slate-400 font-medium">Wind</div>
                <div className="text-xl font-bold font-whimsical mt-0.5">
                  {Math.round(weather.wind.speed * 3.6)} km/h
                </div>
                <div className={`text-[10px] font-medium ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                  {weather.wind.speed > 6 ? 'Playful breeze' : 'Gentle whisper'}
                </div>
              </div>
            </div>

            {/* Rain Probability */}
            <div
              className={`rounded-2xl p-4 border shadow-md flex flex-col justify-between hover:scale-[1.02] transition-transform ${
                darkMode ? 'bg-slate-800/90 border-slate-700 shadow-slate-950/40 text-slate-100' : 'bg-white/90 border-white shadow-rose-50 text-slate-800'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-indigo-900/60 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
              }`}>
                <CloudRain className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <div className="text-[11px] text-slate-400 font-medium">Rain Chance</div>
                <div className="text-xl font-bold font-whimsical mt-0.5">{nextHourPop}%</div>
                <div className={`text-[10px] font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {nextHourPop > 40 ? 'Pack umbrella ☂️' : 'Dry skies'}
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div
              className={`rounded-2xl p-4 border shadow-md flex flex-col justify-between hover:scale-[1.02] transition-transform ${
                darkMode ? 'bg-slate-800/90 border-slate-700 shadow-slate-950/40 text-slate-100' : 'bg-white/90 border-white shadow-rose-50 text-slate-800'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-amber-900/60 text-amber-400' : 'bg-amber-100 text-amber-700'
              }`}>
                <Eye className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <div className="text-[11px] text-slate-400 font-medium">Visibility</div>
                <div className="text-xl font-bold font-whimsical mt-0.5">
                  {(weather.visibility / 1000).toFixed(1)} km
                </div>
                <div className={`text-[10px] font-medium ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                  {weather.visibility > 8000 ? 'Crystal clear' : 'Misty horizon'}
                </div>
              </div>
            </div>

            {/* Sunrise */}
            <div
              className={`rounded-2xl p-4 border shadow-md flex flex-col justify-between hover:scale-[1.02] transition-transform ${
                darkMode ? 'bg-slate-800/90 border-slate-700 shadow-slate-950/40 text-slate-100' : 'bg-white/90 border-white shadow-rose-50 text-slate-800'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-rose-900/60 text-rose-400' : 'bg-rose-100 text-rose-600'
              }`}>
                <Sunrise className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <div className="text-[11px] text-slate-400 font-medium">Sunrise</div>
                <div className="text-base sm:text-lg font-bold font-whimsical mt-0.5">
                  {formatTimeFromTimestamp(weather.sys.sunrise, weather.timezone)}
                </div>
                <div className={`text-[10px] font-medium ${darkMode ? 'text-rose-400' : 'text-rose-500'}`}>
                  Morning glow
                </div>
              </div>
            </div>

            {/* Sunset */}
            <div
              className={`rounded-2xl p-4 border shadow-md flex flex-col justify-between hover:scale-[1.02] transition-transform ${
                darkMode ? 'bg-slate-800/90 border-slate-700 shadow-slate-950/40 text-slate-100' : 'bg-white/90 border-white shadow-rose-50 text-slate-800'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-purple-900/60 text-purple-400' : 'bg-purple-100 text-purple-600'
              }`}>
                <Sunset className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <div className="text-[11px] text-slate-400 font-medium">Sunset</div>
                <div className="text-base sm:text-lg font-bold font-whimsical mt-0.5">
                  {formatTimeFromTimestamp(weather.sys.sunset, weather.timezone)}
                </div>
                <div className={`text-[10px] font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  Golden hour
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 7. “THE SKY RIGHT NOW ☁️” (Illustrated Postcard Section) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          id="the-sky-right-now-section"
          className={`rounded-3xl p-6 sm:p-8 border-2 border-dashed shadow-xl relative overflow-hidden backdrop-blur-md ${
            darkMode
              ? 'bg-slate-800/95 border-slate-600 shadow-slate-950/60 text-slate-100'
              : 'bg-white/95 border-rose-300 shadow-rose-100/50 text-slate-800'
          }`}
        >
          {/* Postcard stamp & cancellation mark in top right */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 pointer-events-none">
            <div
              className={`w-12 h-12 rounded-full border-2 border-dashed flex flex-col items-center justify-center text-[8px] font-mono rotate-12 uppercase ${
                darkMode ? 'border-slate-500 text-slate-400' : 'border-slate-300 text-slate-400'
              }`}
            >
              <span>{cityName.slice(0, 3)}</span>
              <span>POST</span>
            </div>

            <div
              className={`w-12 h-14 rounded-md p-1 border-2 shadow-sm flex flex-col items-center justify-center text-center ${
                darkMode
                  ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 text-sky-400'
                  : 'bg-gradient-to-br from-rose-200 to-amber-200 border-white text-rose-700'
              }`}
            >
              <span className="text-lg">💌</span>
              <span className="text-[8px] font-bold tracking-wider">AIR MAIL</span>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-whimsical mb-2 ${
              darkMode ? 'text-sky-400' : 'text-rose-600'
            }`}
          >
            <span>The sky right now</span>
            <span className="text-base">☁️</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-whimsical font-bold">
                A Postcard from {cityName}
              </h3>
              <p
                className={`text-sm sm:text-base mt-2 leading-relaxed italic ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                &ldquo;Looking up at the sky over {cityName} today, you’ll find {description}.
                The air feels like a gentle {formatTemp(weather.main.feels_like, isFahrenheit)} with {weather.main.humidity}% humidity
                and winds sweeping softly across at {Math.round(weather.wind.speed * 3.6)} km/h.
                It’s an invitation to pause, breathe the atmosphere, and wander.&rdquo;
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
                <span
                  className={`px-3 py-1 rounded-full border ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-slate-200'
                      : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}
                >
                  ☁️ Clouds: {weather.clouds.all}%
                </span>
                <span
                  className={`px-3 py-1 rounded-full border ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-teal-300'
                      : 'bg-teal-50 text-teal-700 border-teal-100'
                  }`}
                >
                  🧭 Barometer: {weather.main.pressure} hPa
                </span>
                <span
                  className={`px-3 py-1 rounded-full border ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-amber-300'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}
                >
                  ✨ Sky Mood: {mainCondition}
                </span>
              </div>
            </div>

            {/* Postcard mini illustration badge */}
            <div
              className={`lg:col-span-1 rounded-2xl p-5 border flex flex-col items-center text-center ${
                darkMode
                  ? 'bg-slate-700/60 border-slate-600'
                  : 'bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 border-rose-100/80'
              }`}
            >
              <div className="text-5xl animate-float">
                {category === 'sunny' ? '☀️' : category === 'rain' ? '🌧️' : category === 'snow' ? '❄️' : '🌤️'}
              </div>
              <div className="mt-3 font-whimsical font-bold text-base">
                {formatTemp(weather.main.temp, isFahrenheit)} · {mainCondition}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Coordinates [{weather.coord.lat.toFixed(2)}°, {weather.coord.lon.toFixed(2)}°]
              </div>
            </div>
          </div>
        </motion.div>

        {/* 8. HOURLY WEATHER — “WHAT'S COMING? ⏰” */}
        {hourlyList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            id="hourly-forecast-section"
            className={`rounded-3xl p-6 sm:p-8 border-2 shadow-xl backdrop-blur-md ${
              darkMode
                ? 'bg-slate-800/95 border-slate-700 shadow-slate-950/60 text-slate-100'
                : 'bg-white/95 border-white shadow-rose-100/50 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${darkMode ? 'text-sky-400' : 'text-rose-500'}`} />
                <h3 className="text-xl font-whimsical font-bold">
                  What&rsquo;s coming? ⏰
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Scroll to explore hours →</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth focus:outline-none">
              {hourlyList.map((hour, idx) => {
                const hourTime = formatHourlyHour(hour.dt, weather.timezone);
                const hourIcon = getCuteWeatherIcon(
                  hour.weather[0]?.main || 'Clear',
                  hour.weather[0]?.id || 800
                );
                const popPct = Math.round(hour.pop * 100);

                return (
                  <div
                    key={hour.dt}
                    className={`flex-shrink-0 w-28 rounded-2xl p-3.5 border text-center flex flex-col items-center justify-between transition-all group ${
                      darkMode
                        ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500 hover:bg-slate-700'
                        : 'bg-gradient-to-b from-white to-slate-50/80 border-rose-100 hover:border-rose-300 hover:shadow-md'
                    }`}
                  >
                    <div
                      className={`text-xs font-semibold font-whimsical ${
                        darkMode ? 'text-slate-300 group-hover:text-sky-400' : 'text-slate-500 group-hover:text-rose-600'
                      }`}
                    >
                      {idx === 0 ? 'Now' : hourTime}
                    </div>

                    <div className="text-3xl my-2 transform group-hover:scale-115 transition-transform">
                      {hourIcon}
                    </div>

                    <div className="text-base font-bold font-whimsical">
                      {formatTemp(hour.main.temp, isFahrenheit)}
                    </div>

                    <div className="text-[11px] text-slate-400 font-medium mt-1 line-clamp-1 capitalize">
                      {hour.weather[0]?.main || 'Clear'}
                    </div>

                    {popPct > 0 ? (
                      <div
                        className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          darkMode
                            ? 'bg-sky-950/60 text-sky-400 border-sky-800'
                            : 'bg-sky-50 text-sky-600 border-sky-200/60'
                        }`}
                      >
                        💧 {popPct}%
                      </div>
                    ) : (
                      <div className="mt-2 text-[10px] text-slate-400">0% rain</div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 9. WEEKLY FORECAST — “A LITTLE PEEK AT THE WEEK ✨” */}
        {dailyForecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            id="weekly-forecast-section"
            className={`rounded-3xl p-6 sm:p-8 border-2 shadow-xl backdrop-blur-md ${
              darkMode
                ? 'bg-slate-800/95 border-slate-700 shadow-slate-950/60 text-slate-100'
                : 'bg-white/95 border-white shadow-rose-100/50 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-6">
              <Calendar className={`w-5 h-5 ${darkMode ? 'text-sky-400' : 'text-rose-500'}`} />
              <h3 className="text-xl font-whimsical font-bold">
                A little peek at the week ✨
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {dailyForecast.map((day, idx) => (
                <div
                  key={day.dateStr}
                  className={`rounded-2xl p-4 border transition-all flex flex-col items-center text-center justify-between ${
                    darkMode
                      ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500 hover:bg-slate-700'
                      : 'bg-gradient-to-b from-white to-slate-50/70 border-rose-100 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/40'
                  }`}
                >
                  <div>
                    <div className="font-whimsical font-bold text-sm">
                      {idx === 0 ? 'Today' : day.dayName}
                    </div>
                    <div className="text-[11px] text-slate-400">{day.dateStr}</div>
                  </div>

                  <div className="text-4xl my-3 transform hover:scale-110 transition-transform">
                    {day.icon}
                  </div>

                  <div className="w-full">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold font-whimsical">
                      <span>{formatTemp(day.tempMax, isFahrenheit)}</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-400">{formatTemp(day.tempMin, isFahrenheit)}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 capitalize line-clamp-1 mt-1 font-medium">
                      {day.description}
                    </div>

                    <div
                      className={`mt-2 text-[10px] px-2 py-0.5 rounded-full inline-block border ${
                        darkMode
                          ? 'bg-sky-950/60 text-sky-400 border-sky-800'
                          : 'bg-sky-50 text-sky-600 border-sky-100'
                      }`}
                    >
                      💧 {day.pop}% rain
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 14 & 15. WEATHER MOOD & OUTFIT SUGGESTIONS (GENDER-NEUTRAL) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 14. Today's Weather Mood */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            id="weather-mood-card"
            className={`rounded-3xl p-6 sm:p-7 border-2 shadow-xl flex flex-col justify-between ${
              darkMode
                ? 'bg-slate-800/95 border-slate-700 shadow-slate-950/60 text-slate-100'
                : `bg-gradient-to-br ${mood.color} shadow-rose-100/40 text-slate-800`
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-whimsical font-bold px-3 py-1 rounded-full border ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-sky-400'
                      : 'bg-white/80 border-white text-rose-600'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                  <span>Today&rsquo;s weather mood</span>
                </div>
                <span className="text-3xl animate-float">{mood.emoji}</span>
              </div>

              <h3 className="text-2xl font-whimsical font-bold">{mood.title}</h3>

              <p className={`mt-2 text-sm italic leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {mood.quote}
              </p>
            </div>

            <div
              className={`mt-6 pt-4 border-t flex items-center justify-between ${
                darkMode ? 'border-slate-700' : 'border-black/5'
              }`}
            >
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Atmospheric Vibe
                </div>
                <div className={`text-xs font-bold font-whimsical mt-0.5 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  {mood.vibe}
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full border text-xs font-bold font-whimsical shadow-xs ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-sky-400'
                    : 'bg-white/90 border-white text-rose-600'
                }`}
              >
                {mood.vibeRating}% vibe match
              </div>
            </div>
          </motion.div>

          {/* 15. Weather Outfit Suggestion (General for both genders) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            id="outfit-suggestion-card"
            className={`rounded-3xl p-6 sm:p-7 border-2 shadow-xl flex flex-col justify-between backdrop-blur-md ${
              darkMode
                ? 'bg-slate-800/95 border-slate-700 shadow-slate-950/60 text-slate-100'
                : 'bg-white/95 border-white shadow-rose-100/40 text-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-whimsical font-bold px-3 py-1 rounded-full border ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-sky-400'
                      : 'bg-rose-50 border-rose-100 text-rose-600'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>What should you wear? 🧳</span>
                </div>
                <span className="text-xs text-slate-400 font-medium font-whimsical">Gender-neutral Guide</span>
              </div>

              <h3 className="text-xl font-whimsical font-bold">{outfit.headline}</h3>

              <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {outfit.summary}
              </p>

              {/* Outfit Item Tags (Gender-neutral items) */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {outfit.items.map((item) => (
                  <div
                    key={item.name}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium ${
                      darkMode
                        ? 'bg-slate-700/60 border-slate-600 text-slate-200'
                        : 'bg-slate-50 border-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="line-clamp-1">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`mt-4 pt-3 border-t text-[11px] flex items-center gap-1.5 ${
                darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-500'
              }`}
            >
              <span className={`font-bold ${darkMode ? 'text-sky-400' : 'text-rose-500'}`}>✨ Tip:</span>
              <span className="italic">{outfit.quickTip}</span>
            </div>
          </motion.div>
        </div>

        {/* 10. “OKAY… WHAT SHOULD WE DO? 🌷” (Weather Activities & Real Places via Google Places API) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          id="activity-recommendations-section"
          className={`rounded-3xl p-6 sm:p-8 border-2 shadow-xl backdrop-blur-md ${
            darkMode
              ? 'bg-slate-800/95 border-slate-700 shadow-slate-950/60 text-slate-100'
              : 'bg-white/95 border-white shadow-rose-100/50 text-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div
                className={`inline-flex items-center gap-1.5 text-xs font-whimsical font-bold uppercase tracking-wider mb-1 ${
                  darkMode ? 'text-sky-400' : 'text-rose-600'
                }`}
              >
                <span>Curated weather recommendations</span>
                <span>✨</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-whimsical font-bold">
                Okay… what should we do? 🌷
              </h3>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Curated for <span className={`font-bold ${darkMode ? 'text-sky-400' : 'text-rose-600'}`}>{cityName}</span> based on today&rsquo;s sky
            </div>
          </div>

          {/* Activity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((act) => (
              <div
                key={act.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between group ${
                  darkMode
                    ? 'bg-slate-700/40 border-slate-600 hover:border-sky-400/80 hover:bg-slate-700/70 text-slate-100'
                    : 'bg-gradient-to-br from-white to-rose-50/30 border-rose-100/80 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        darkMode
                          ? 'bg-slate-700 text-sky-400 border-slate-600'
                          : 'bg-rose-100 text-rose-700 border-rose-200'
                      }`}
                    >
                      {act.suitability}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                        darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {act.type}
                    </span>
                  </div>

                  <h4
                    className={`text-lg font-whimsical font-bold transition-colors ${
                      darkMode ? 'group-hover:text-sky-400' : 'group-hover:text-rose-600'
                    }`}
                  >
                    {act.title}
                  </h4>

                  <div className={`text-xs font-semibold mt-0.5 ${darkMode ? 'text-sky-400' : 'text-rose-500'}`}>
                    {act.tagline}
                  </div>

                  <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {act.description}
                  </p>
                </div>

                <div
                  className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium ${
                    darkMode ? 'border-slate-600/60 text-slate-400' : 'border-rose-100/60 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Clock className={`w-3.5 h-3.5 ${darkMode ? 'text-sky-400' : 'text-rose-400'}`} />
                    <span>{act.bestTime}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.title + ' in ' + cityName + ' ' + (countryName || ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                      darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-rose-600 hover:text-rose-700'
                    }`}
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* 5. TIME-BASED FOOD & DINING SUGGESTIONS (Google Maps Places) */}
          <div className={`mt-8 pt-6 border-t border-dashed ${darkMode ? 'border-slate-700' : 'border-rose-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-whimsical font-bold uppercase tracking-wider ${
                    darkMode ? 'text-amber-400' : 'text-amber-600'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Time-Based Dining & Delights</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-whimsical font-bold mt-0.5">
                  What should we eat right now? 🍽️
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] px-3 py-1 rounded-full border font-semibold flex items-center gap-1 ${
                    darkMode
                      ? 'bg-slate-700/80 border-slate-600 text-sky-400'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>{localTimeString} in {cityName}</span>
                </span>
              </div>
            </div>

            {/* Meal Time Selector Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { id: 'morning', label: 'Breakfast & Coffee 🥐', timeDesc: 'Morning (5 AM – 11:30 AM)' },
                { id: 'lunch', label: 'Lunch & Bistros 🥙', timeDesc: 'Midday (11:30 AM – 4:30 PM)' },
                { id: 'tea', label: 'Afternoon Tea 🍰', timeDesc: 'Late Afternoon (4:30 PM – 7 PM)' },
                { id: 'dinner', label: 'Dinner & Dining 🍽️', timeDesc: 'Evening (7 PM – 11 PM)' },
                { id: 'night', label: 'Late-Night Bites 🌙', timeDesc: 'Late Night (11 PM – 5 AM)' },
              ].map((tab) => {
                const isSelected = selectedMealPeriod === tab.id;
                const isCurrentHour = currentPeriod === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedMealPeriod(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-whimsical font-bold transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? darkMode
                          ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-950/50'
                          : 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-200'
                        : darkMode
                        ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
                        : 'bg-white hover:bg-rose-50 border-rose-100 text-slate-700'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isCurrentHour && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : darkMode
                          ? 'bg-sky-900 text-sky-300'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        Now
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Contextual time insight banner */}
            <div
              className={`p-3.5 rounded-2xl border mb-4 text-xs font-whimsical leading-relaxed ${
                darkMode
                  ? 'bg-slate-700/50 border-slate-600 text-slate-200'
                  : 'bg-amber-50/80 border-amber-200/70 text-amber-900'
              }`}
            >
              {selectedMealPeriod === 'morning' && (
                <p>
                  <span className="font-bold">🌅 Morning in {cityName}:</span> Start your day with warm artisan bakeries, morning breakfast platters, traditional egg dishes, and freshly brewed coffee!
                </p>
              )}
              {selectedMealPeriod === 'lunch' && (
                <p>
                  <span className="font-bold">☀️ Midday in {cityName}:</span> Time for delicious midday culinary exploration — authentic regional specialties, sunny garden bistros, and savory lunch favorites.
                </p>
              )}
              {selectedMealPeriod === 'tea' && (
                <p>
                  <span className="font-bold">☕ Afternoon Golden Hour in {cityName}:</span> Perfect for unwinding with aromatic tea, delicate patisseries, matcha treats, or artisanal gelato.
                </p>
              )}
              {selectedMealPeriod === 'dinner' && (
                <p>
                  <span className="font-bold">✨ Evening Gastronomy in {cityName}:</span> Savor candlelit ambient dining, authentic regional grills, chef specialties, and rich evening flavors.
                </p>
              )}
              {selectedMealPeriod === 'night' && (
                <p>
                  <span className="font-bold">🌙 Late-Night Hours in {cityName}:</span> Cozy up with 24/7 cafes, midnight wraps, sweet crepes, and warm comforting drinks.
                </p>
              )}
            </div>

            {/* Live Food Suggestions Cards Grid (via Google Places API & Google Maps) */}
            {isLoadingFood ? (
              <div className="p-8 text-center text-slate-400 text-sm font-whimsical animate-pulse">
                Finding the best nearby food & dining spots in {cityName}...
              </div>
            ) : foodPlaces.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {foodPlaces.map((place) => (
                  <div
                    key={`food-${place.id}`}
                    className={`rounded-2xl p-4 border flex flex-col justify-between transition-all hover:scale-[1.02] ${
                      darkMode
                        ? 'bg-slate-700/40 border-slate-600 hover:border-sky-400/80 text-slate-100'
                        : 'bg-white border-amber-100 hover:border-amber-300 hover:shadow-md text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h5 className="font-whimsical font-bold text-sm line-clamp-1">
                          {place.displayName.text}
                        </h5>
                        {place.rating && (
                          <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500 flex-shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{place.rating}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {place.formattedAddress}
                      </p>

                      {place.primaryTypeDisplayName?.text && (
                        <span
                          className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            darkMode
                              ? 'bg-slate-800 border-slate-600 text-slate-300'
                              : 'bg-amber-50 border-amber-200 text-amber-800'
                          }`}
                        >
                          {place.primaryTypeDisplayName.text}
                        </span>
                      )}
                    </div>

                    <a
                      href={
                        place.googleMapsUri ||
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          place.displayName.text + ' ' + place.formattedAddress
                        )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-3 pt-2 border-t flex items-center justify-between text-xs font-semibold ${
                        darkMode
                          ? 'border-slate-600/60 text-sky-400 hover:text-sky-300'
                          : 'border-slate-100 text-amber-600 hover:text-amber-700'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <span>View on Google Maps</span>
                        <span>🗺️</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed text-center text-xs text-slate-400 font-whimsical">
                Discovering authentic dining spots for {cityName} in Google Maps.
              </div>
            )}
          </div>

          {/* 6. REAL ATTRACTIONS & DESTINATIONS IN THIS CITY (Google Places API) */}
          <div className={`mt-8 pt-6 border-t border-dashed ${darkMode ? 'border-slate-700' : 'border-rose-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-whimsical font-bold uppercase tracking-wider ${
                    darkMode ? 'text-sky-400' : 'text-rose-500'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Real Local Destinations</span>
                </div>
                <h4 className="text-xl font-whimsical font-bold mt-0.5">
                  Famous Real Places in {cityName} 📍
                </h4>
              </div>
              <span
                className={`text-[11px] px-2.5 py-1 rounded-full border self-start sm:self-auto font-medium ${
                  darkMode ? 'bg-slate-700/60 border-slate-600 text-slate-300' : 'bg-rose-50 border-rose-100 text-rose-700'
                }`}
              >
                Live Google Places
              </span>
            </div>

            {isLoadingPlaces ? (
              <div className="p-8 text-center text-slate-400 text-sm font-whimsical animate-pulse">
                Discovering authentic places in {cityName}...
              </div>
            ) : realPlaces.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {realPlaces.map((place) => (
                  <div
                    key={place.id}
                    className={`rounded-2xl p-4 border flex flex-col justify-between transition-all hover:scale-[1.02] ${
                      darkMode
                        ? 'bg-slate-700/40 border-slate-600 hover:border-sky-400/80 text-slate-100'
                        : 'bg-white border-rose-100 hover:border-rose-300 hover:shadow-md text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h5 className="font-whimsical font-bold text-sm line-clamp-1">
                          {place.displayName.text}
                        </h5>
                        {place.rating && (
                          <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500 flex-shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{place.rating}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {place.formattedAddress}
                      </p>

                      {place.primaryTypeDisplayName?.text && (
                        <span
                          className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            darkMode
                              ? 'bg-slate-800 border-slate-600 text-slate-300'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          {place.primaryTypeDisplayName.text}
                        </span>
                      )}
                    </div>

                    <a
                      href={
                        place.googleMapsUri ||
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          place.displayName.text + ' ' + place.formattedAddress
                        )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-3 pt-2 border-t flex items-center justify-between text-xs font-semibold ${
                        darkMode
                          ? 'border-slate-600/60 text-sky-400 hover:text-sky-300'
                          : 'border-slate-100 text-rose-600 hover:text-rose-700'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <span>View on Google Maps</span>
                        <span>🗺️</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-2">
                Real place suggestions loaded for this destination.
              </div>
            )}
          </div>
        </motion.div>

        {/* Back to map footer callout */}
        <div className="text-center py-6">
          <button
            onClick={onBackToMap}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-whimsical font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all text-white ${
              darkMode
                ? 'bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-500 hover:from-sky-600 hover:to-indigo-600 shadow-sky-950/60'
                : 'bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 hover:from-rose-500 hover:to-pink-500 shadow-rose-200/60'
            }`}
          >
            <span>Ready for another adventure? Open the World Map 🌍</span>
          </button>
        </div>
      </div>
    </div>
  );
};
