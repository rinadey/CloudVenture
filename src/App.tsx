import React, { useState, useCallback, useEffect } from 'react';
import { WhimsicalWorldMap } from './components/WhimsicalWorldMap';
import { FloatingSearchBar } from './components/FloatingSearchBar';
import { TravelTransitionModal } from './components/TravelTransitionModal';
import { WeatherExperience } from './components/WeatherExperience';
import { CurrentWeatherResponse, ForecastResponse } from './types';
import { Sparkles, Compass, AlertCircle, Sun, Moon } from 'lucide-react';

export default function App() {
  // Current view: 'map' or 'weather'
  const [currentView, setCurrentView] = useState<'map' | 'weather'>('map');

  // Dark Mode state: persists in localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cloudventure-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('cloudventure-theme', next ? 'dark' : 'light');
      } catch (e) {
        // ignore
      }
      return next;
    });
  }, []);

  // Update root html class when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Quota exceeded state (Google Maps Platform defense)
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setIsQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Transition state
  const [transitioningTarget, setTransitioningTarget] = useState<{
    cityName: string;
    countryName?: string;
  } | null>(null);

  // Weather data state
  const [weatherData, setWeatherData] = useState<{
    current: CurrentWeatherResponse;
    forecast: ForecastResponse | null;
    cityName: string;
    countryName?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Location selection handler
  const handleSelectLocation = useCallback(
    async (cityName: string, countryName?: string, coords?: [number, number]) => {
      setErrorMessage(null);
      setIsLoading(true);
      setTransitioningTarget({ cityName, countryName });

      try {
        let url = '';
        if (coords && coords.length === 2 && coords[0] !== 0 && coords[1] !== 0) {
          url = `/api/weather?lat=${coords[1]}&lon=${coords[0]}&city=${encodeURIComponent(cityName)}`;
        } else {
          url = `/api/weather?city=${encodeURIComponent(cityName + (countryName ? `, ${countryName}` : ''))}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.details || errData.error || 'Could not fetch weather data');
        }

        const data = await res.json();
        setWeatherData({
          current: data.current,
          forecast: data.forecast,
          cityName: data.current.name || cityName,
          countryName: countryName || data.current.sys?.country,
        });
      } catch (err: any) {
        console.error('Failed to load weather:', err);
        setErrorMessage(
          err.message || 'Unable to reach weather station. Please try another destination!'
        );
        setTransitioningTarget(null);
        setIsLoading(false);
      }
    },
    []
  );

  const handleTransitionComplete = useCallback(() => {
    if (weatherData) {
      setCurrentView('weather');
      setTransitioningTarget(null);
      setIsLoading(false);
    }
  }, [weatherData]);

  const handleBackToMap = useCallback(() => {
    setCurrentView('map');
  }, []);

  return (
    <main
      className={`min-h-screen font-sans antialiased transition-colors duration-500 ${
        darkMode ? 'bg-[#111827] text-slate-100' : 'bg-[#fcf9f5] text-slate-800'
      }`}
    >
      {/* Google Maps Quota Warning Banner (if triggered) */}
      {isQuotaExceeded && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs md:text-sm text-center sticky top-0 z-50 backdrop-blur-md">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:opacity-80"
            >
              maps developer site
            </a>{' '}
            for instructions.
          </span>
        </div>
      )}

      {/* Travel Transition Modal */}
      {transitioningTarget && (
        <TravelTransitionModal
          cityName={transitioningTarget.cityName}
          countryName={transitioningTarget.countryName}
          onComplete={handleTransitionComplete}
          darkMode={darkMode}
        />
      )}

      {/* Main View Switcher */}
      {currentView === 'map' ? (
        <div
          id="map-view-container"
          className="relative min-h-screen flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          {/* Header Title, Whimsical Branding & Dark Mode Toggle */}
          <header className="relative text-center mb-6 pt-2">
            {/* Top Right Dark Mode Toggle Pill */}
            <div className="absolute top-2 right-0 sm:right-2">
              <button
                onClick={toggleDarkMode}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm text-xs font-whimsical font-bold transition-all hover:scale-105 active:scale-95 ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                    : 'bg-white border-rose-200 text-slate-700 hover:text-indigo-600 shadow-rose-100/50'
                }`}
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-whimsical font-bold mb-3 border shadow-xs ${
                darkMode
                  ? 'bg-slate-800/80 border-slate-700 text-sky-400'
                  : 'bg-rose-50 border-rose-200/80 text-rose-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Whimsical Weather & World Travel Journal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-whimsical font-bold tracking-tight flex items-center justify-center gap-3">
              <span>Cloudventure</span>
              <span className="text-3xl sm:text-4xl animate-float">✈️</span>
            </h1>

            <p
              className={`mt-2 font-medium text-sm sm:text-base max-w-lg mx-auto ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Pick a place in the world → discover its weather → discover what you can do there!
            </p>

            {/* Error banner if any */}
            {errorMessage && (
              <div
                className={`mt-4 p-3 rounded-2xl border text-xs sm:text-sm font-medium inline-flex items-center gap-2 max-w-md mx-auto shadow-sm animate-in fade-in duration-200 ${
                  darkMode
                    ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}
          </header>

          {/* Floating Search Bar over Map */}
          <div className="mb-6">
            <FloatingSearchBar
              onSelectLocation={handleSelectLocation}
              isLoading={isLoading}
              darkMode={darkMode}
            />
          </div>

          {/* Opening Experience: The Interactive Whimsical World Map */}
          <section aria-label="Interactive World Map" className="w-full my-auto">
            <WhimsicalWorldMap
              onSelectLocation={handleSelectLocation}
              isLoadingWeather={isLoading}
              darkMode={darkMode}
            />
          </section>

          {/* Soft Whimsical Footer */}
          <footer
            className={`text-center text-xs font-whimsical mt-8 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 ${
              darkMode ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Compass className={`w-3.5 h-3.5 ${darkMode ? 'text-sky-400' : 'text-rose-400'}`} />
              <span>Real-time weather powered by OpenWeather & Google Places</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1">
              <span>Cloudventure • Crafted for dreamers & travelers</span>
              <span>✨</span>
            </div>
          </footer>
        </div>
      ) : weatherData ? (
        <WeatherExperience
          weather={weatherData.current}
          forecast={weatherData.forecast}
          cityName={weatherData.cityName}
          countryName={weatherData.countryName}
          onBackToMap={handleBackToMap}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      ) : null}
    </main>
  );
}
