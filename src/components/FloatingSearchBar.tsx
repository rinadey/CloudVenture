import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Sparkles, X, Loader2 } from 'lucide-react';
import { GeocodedLocation } from '../types';

interface FloatingSearchBarProps {
  onSelectLocation: (city: string, country?: string, coords?: [number, number]) => void;
  isLoading?: boolean;
  darkMode?: boolean;
}

const POPULAR_QUICK_PICKS = [
  { name: 'Jeddah', country: 'Saudi Arabia', flag: '🇸🇦', icon: '🏖️' },
  { name: 'Paris', country: 'France', flag: '🇫🇷', icon: '🥐' },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵', icon: '🌸' },
  { name: 'New York', country: 'United States', flag: '🇺🇸', icon: '🗽' },
  { name: 'London', country: 'United Kingdom', flag: '🇬🇧', icon: '☕' },
  { name: 'Reykjavik', country: 'Iceland', flag: '🇮🇸', icon: '❄️' },
  { name: 'Sydney', country: 'Australia', flag: '🇦🇺', icon: '🌊' },
];

export const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({
  onSelectLocation,
  isLoading = false,
  darkMode = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced geocoding search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Deduplicate results
            const unique: GeocodedLocation[] = [];
            const seen = new Set();
            for (const item of data) {
              const key = `${item.name}-${item.country}-${item.state || ''}`;
              if (!seen.has(key)) {
                seen.add(key);
                unique.push(item);
              }
            }
            setSuggestions(unique);
          }
        }
      } catch (err) {
        console.error('Failed to geocode query:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: string, country?: string, coords?: [number, number]) => {
    setIsOpen(false);
    setQuery('');
    setSuggestions([]);
    onSelectLocation(city, country, coords);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      const s = suggestions[selectedIndex];
      handleSelect(s.name, s.country, [s.lon, s.lat]);
    } else if (query.trim()) {
      handleSelect(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    }
  };

  return (
    <div
      ref={searchContainerRef}
      id="floating-search-bar"
      className="relative w-full max-w-2xl mx-auto z-40"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative flex items-center rounded-3xl border-2 backdrop-blur-md shadow-xl transition-all ${
            darkMode
              ? 'bg-slate-800/95 border-slate-700 shadow-slate-950/60 focus-within:border-sky-400'
              : 'bg-white/95 border-rose-300 shadow-rose-200/50 focus-within:border-pink-500'
          }`}
        >
          <div className="pl-4.5 pr-2 flex items-center">
            {isSearching || isLoading ? (
              <Loader2 className={`w-5 h-5 animate-spin ${darkMode ? 'text-sky-400' : 'text-rose-500'}`} />
            ) : (
              <Search className={`w-5 h-5 ${darkMode ? 'text-sky-400' : 'text-rose-400'}`} />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Where are we going? ✈️"
            className={`w-full py-3.5 pr-12 text-sm sm:text-base font-medium bg-transparent focus:outline-none font-whimsical ${
              darkMode ? 'text-slate-100 placeholder:text-slate-400' : 'text-slate-800 placeholder:text-slate-400'
            }`}
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className={`p-2 mr-2 rounded-full transition-colors ${
                darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={!query.trim()}
            className={`mr-2 px-4.5 py-2 rounded-2xl font-whimsical font-bold text-xs sm:text-sm text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 ${
              darkMode
                ? 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 shadow-sky-950/50'
                : 'bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 hover:from-rose-500 hover:to-amber-500 shadow-rose-200/60'
            }`}
          >
            Explore
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown Suggestions */}
      {isOpen && (suggestions.length > 0 || query.length >= 2) && (
        <div
          className={`absolute left-0 right-0 mt-2 rounded-3xl border shadow-2xl backdrop-blur-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
            darkMode ? 'bg-slate-800/98 border-slate-700 shadow-slate-950/80 text-slate-100' : 'bg-white/98 border-rose-200 shadow-rose-200/60 text-slate-800'
          }`}
        >
          {suggestions.length > 0 ? (
            <div className={`p-2 divide-y max-h-72 overflow-y-auto ${darkMode ? 'divide-slate-700' : 'divide-rose-50'}`}>
              {suggestions.map((loc, idx) => (
                <button
                  key={`${loc.name}-${loc.lat}-${loc.lon}-${idx}`}
                  onClick={() => handleSelect(loc.name, loc.country, [loc.lon, loc.lat])}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all ${
                    selectedIndex === idx
                      ? darkMode ? 'bg-slate-700 text-sky-400' : 'bg-rose-50 text-rose-800'
                      : darkMode ? 'hover:bg-slate-700/60 text-slate-200' : 'hover:bg-rose-50/60 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        darkMode ? 'bg-slate-700 text-sky-400' : 'bg-rose-100 text-rose-500'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-whimsical font-semibold text-sm">
                        {loc.name}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                        {loc.state ? `${loc.state}, ` : ''}{loc.country}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${darkMode ? 'text-sky-400' : 'text-rose-500'}`}>
                    Travel ✈️
                  </span>
                </button>
              ))}
            </div>
          ) : !isSearching && query.length >= 2 ? (
            <div className="p-4 text-center">
              <button
                onClick={() => handleSelect(query.trim())}
                className={`w-full py-2.5 px-4 rounded-2xl font-whimsical text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  darkMode ? 'bg-slate-700 hover:bg-slate-600 text-sky-300' : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Search anywhere for &ldquo;{query}&rdquo;</span>
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Quick Picks / Popular Destinations Pills */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 flex-wrap">
        <span className={`text-[11px] font-semibold uppercase tracking-wider px-1 flex items-center gap-1 ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <span>Popular:</span>
        </span>
        {POPULAR_QUICK_PICKS.map((pick) => (
          <button
            key={pick.name}
            onClick={() => handleSelect(pick.name, pick.country)}
            className={`text-xs font-whimsical font-medium px-3 py-1.5 rounded-full border shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
              darkMode
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600 border-rose-100 hover:border-rose-300'
            }`}
          >
            <span>{pick.flag}</span>
            <span>{pick.name}</span>
            <span className="text-xs">{pick.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
