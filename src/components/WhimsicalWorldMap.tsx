import React, { useState, useRef, useEffect, useMemo } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import worldAtlasData from 'world-atlas/countries-110m.json';
import { CountryInfo } from '../types';
import { COUNTRIES_MAP, getCountryByNumericId } from '../data/countries';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Compass,
  Search,
  ChevronRight,
  X,
  MapPin,
} from 'lucide-react';

interface WhimsicalWorldMapProps {
  onSelectLocation: (city: string, country?: string, coords?: [number, number]) => void;
  isLoadingWeather?: boolean;
  darkMode?: boolean;
}

// Playful candy pastel palette for Light Mode
const PLAYFUL_LAND_COLORS = [
  '#fed7aa', // warm peach
  '#fecdd3', // bubblegum rose
  '#bbf7d0', // fresh mint
  '#ddd6fe', // soft lavender
  '#fef08a', // buttercup yellow
  '#bae6fd', // cheerful sky blue
];

// Sleek aesthetic grey palette for Dark Mode ("just grey instead")
const GREY_LAND_COLORS = [
  '#334155', // slate 700
  '#3f3f46', // zinc 700
  '#475569', // slate 600
  '#3b4252', // cool dark grey
  '#44403c', // stone 700
  '#52525b', // zinc 600
];

export const WhimsicalWorldMap: React.FC<WhimsicalWorldMapProps> = ({
  onSelectLocation,
  isLoadingWeather = false,
  darkMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 560 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMapActive, setIsMapActive] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<{
    info: CountryInfo;
    x: number;
    y: number;
  } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [countryCitySearch, setCountryCitySearch] = useState('');

  // Handle dynamic container sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth || 1000,
          height: clientHeight || 560,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Prepare GeoJSON features from TopoJSON
  const { countriesGeoJson, pathGenerator, projection } = useMemo(() => {
    // @ts-expect-error topojson object typing
    const featureCollection = topojson.feature(worldAtlasData, worldAtlasData.objects.countries) as any;

    const proj = geoNaturalEarth1()
      .scale(dimensions.width / 5.8)
      .translate([dimensions.width / 2, dimensions.height / 1.95]);

    const path = geoPath().projection(proj);

    return {
      countriesGeoJson: featureCollection.features || [],
      pathGenerator: path,
      projection: proj,
    };
  }, [dimensions]);

  // Precompute country label centers for far away view (zoom <= 1.6)
  const countryCentroids = useMemo(() => {
    return countriesGeoJson
      .map((feature: any) => {
        const id = String(feature.id);
        const info = getCountryByNumericId(id);
        if (!info) return null;

        // Try centroid, fallback to info.coordinates
        const centroid = pathGenerator.centroid(feature);
        let x = centroid?.[0];
        let y = centroid?.[1];

        if (!x || !y || isNaN(x) || isNaN(y)) {
          const proj = projection(info.coordinates);
          if (!proj) return null;
          x = proj[0];
          y = proj[1];
        }

        return {
          id,
          name: info.name,
          flag: info.flag,
          x,
          y,
        };
      })
      .filter(Boolean);
  }, [countriesGeoJson, pathGenerator, projection]);

  // Flatten all known cities across countries for zoomed-in rendering
  const allCities = useMemo(() => {
    const list: Array<{
      name: string;
      lat: number;
      lon: number;
      countryName: string;
      countryId: string;
      flag: string;
      description?: string;
    }> = [];

    Object.values(COUNTRIES_MAP).forEach((country) => {
      country.popularCities.forEach((city) => {
        list.push({
          name: city.name,
          lat: city.lat,
          lon: city.lon,
          countryName: country.name,
          countryId: country.id,
          flag: country.flag,
          description: city.description,
        });
      });
    });

    return list;
  }, []);

  // Pan and drag handlers - only activated when user intentionally clicks
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMapActive(true);
    if (
      (e.target as HTMLElement).tagName === 'path' ||
      (e.target as HTMLElement).tagName === 'svg' ||
      (e.target as HTMLElement).tagName === 'rect'
    ) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom only triggers if user clicked to activate map AND holds Ctrl/Cmd, OR explicitly in active map
  // This completely stops accidental scrolling / moving of the map when user is scrolling the webpage!
  const handleWheel = (e: React.WheelEvent) => {
    // If user is just scrolling through the webpage, don't hijack scroll
    if (!isMapActive && !e.ctrlKey && !e.metaKey) {
      return;
    }
    // If active and holding Ctrl/Cmd or map was clicked to explore
    if (e.ctrlKey || e.metaKey || isMapActive) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
      setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.85), 5.5));
    }
  };

  const handleZoomIn = () => {
    setIsMapActive(true);
    setZoom((z) => Math.min(z * 1.35, 5.5));
  };

  const handleZoomOut = () => {
    setIsMapActive(true);
    setZoom((z) => Math.max(z * 0.75, 0.85));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedCountry(null);
  };

  // When clicking a country, smoothly zoom into it and reveal its cities
  const handleCountryClick = (feature: any) => {
    setIsMapActive(true);
    const id = String(feature.id);
    const country = getCountryByNumericId(id);
    if (!country) return;

    setSelectedCountry(country);
    setCountryCitySearch('');

    const coords = country.coordinates;
    const projected = projection(coords);
    if (projected) {
      const [px, py] = projected;
      const targetZoom = 2.6;
      const targetX = dimensions.width / 2 - px * targetZoom;
      const targetY = dimensions.height / 2 - py * targetZoom;
      setZoom(targetZoom);
      setPan({ x: targetX, y: targetY });
    }
  };

  // Filter cities in selected country
  const filteredCities = useMemo(() => {
    if (!selectedCountry) return [];
    if (!countryCitySearch.trim()) return selectedCountry.popularCities;
    return selectedCountry.popularCities.filter((c) =>
      c.name.toLowerCase().includes(countryCitySearch.toLowerCase())
    );
  }, [selectedCountry, countryCitySearch]);

  const activeLandColors = darkMode ? GREY_LAND_COLORS : PLAYFUL_LAND_COLORS;

  return (
    <div
      ref={containerRef}
      id="whimsical-map-container"
      className={`relative w-full h-[620px] md:h-[720px] rounded-3xl overflow-hidden border-4 shadow-xl select-none transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-b from-[#18202c] via-[#1e2736] to-[#253042] border-slate-700 shadow-slate-950/60'
          : 'bg-gradient-to-b from-[#dbeafe] via-[#e0f2fe] to-[#cffafe] border-white shadow-sky-100/70'
      }`}
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Whimsical Dreamy Sea Background Details */}
      <div className="absolute inset-0 pointer-events-none opacity-45 overflow-hidden">
        {/* Decorative waves & ripples */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves-pattern" width="80" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 0 20 Q 20 12 40 20 T 80 20"
                fill="none"
                stroke={darkMode ? '#334155' : '#93c5fd'}
                strokeWidth="1.2"
                strokeDasharray="3 5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves-pattern)" />
        </svg>

        {/* Floating clouds in sky/ocean */}
        <div className={`absolute top-12 left-10 text-5xl animate-float ${darkMode ? 'text-slate-500/30' : 'text-white/80'}`}>☁️</div>
        <div className={`absolute top-32 right-20 text-6xl animate-float-delayed ${darkMode ? 'text-slate-500/25' : 'text-white/70'}`}>☁️</div>
        <div className={`absolute bottom-24 left-1/4 text-4xl animate-float ${darkMode ? 'text-slate-500/25' : 'text-white/70'}`}>☁️</div>
        <div className={`absolute bottom-36 right-1/3 text-5xl animate-float-delayed ${darkMode ? 'text-slate-500/20' : 'text-white/60'}`}>☁️</div>

        {/* Tiny stars & sparkles */}
        <div className={`absolute top-8 left-1/3 text-lg animate-twinkle ${darkMode ? 'text-slate-400/80' : 'text-amber-300'}`}>✦</div>
        <div className={`absolute top-20 right-1/4 text-sm animate-twinkle ${darkMode ? 'text-slate-400/80' : 'text-rose-300'}`}>✦</div>
        <div className={`absolute bottom-16 left-12 text-base animate-twinkle ${darkMode ? 'text-slate-400/80' : 'text-indigo-300'}`}>✦</div>
        <div className={`absolute bottom-28 right-16 text-xl animate-twinkle ${darkMode ? 'text-slate-400/80' : 'text-emerald-300'}`}>✦</div>

        {/* Whimsical travel doodle */}
        <div className={`absolute bottom-12 right-24 text-2xl font-whimsical flex items-center gap-1.5 ${darkMode ? 'text-slate-500/50' : 'text-sky-700/50'}`}>
          <span>⛵</span>
          <span className="text-xs italic tracking-wider">Dreamer Winds</span>
        </div>
      </div>

      {/* Decorative Illustrated Compass Rose (Top Left) */}
      <div
        className={`absolute top-5 left-6 pointer-events-none z-10 flex items-center gap-3 px-3.5 py-2 rounded-2xl border shadow-sm backdrop-blur-md transition-colors ${
          darkMode
            ? 'bg-slate-800/90 border-slate-700 text-slate-100'
            : 'bg-white/85 border-white text-slate-800'
        }`}
      >
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-inner ${
          darkMode ? 'bg-slate-700 text-sky-400' : 'bg-rose-100 text-rose-500'
        }`}>
          <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '40s' }} />
        </div>
        <div>
          <div className="text-xs font-bold tracking-wide font-whimsical flex items-center gap-1">
            Cloudventure Map <span className={darkMode ? 'text-sky-400' : 'text-amber-500'}>✨</span>
          </div>
          <div className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {zoom <= 1.6 ? 'World overview · Zoom in to reveal cities' : 'Zoomed in · Click any city to travel!'}
          </div>
        </div>
      </div>

      {/* Zoom & Reset Controls (Bottom Right) */}
      <div
        className={`absolute bottom-6 right-6 z-20 flex flex-col gap-1.5 backdrop-blur-md p-1.5 rounded-2xl border shadow-md transition-colors ${
          darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-white'
        }`}
      >
        <button
          id="btn-map-zoom-in"
          onClick={handleZoomIn}
          title="Zoom in (reveals cities)"
          className={`w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
            darkMode
              ? 'text-slate-300 hover:text-white hover:bg-slate-700'
              : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50'
          }`}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="btn-map-zoom-out"
          onClick={handleZoomOut}
          title="Zoom out (reveals countries)"
          className={`w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
            darkMode
              ? 'text-slate-300 hover:text-white hover:bg-slate-700'
              : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50'
          }`}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          id="btn-map-reset"
          onClick={handleReset}
          title="Reset world view"
          className={`w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-all border-t ${
            darkMode
              ? 'text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
              : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50 border-slate-100'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* SVG Interactive Map */}
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Graticule latitude-longitude soft dotted lines */}
          <g opacity={darkMode ? 0.2 : 0.35}>
            {[-60, -30, 0, 30, 60].map((lat) => {
              const y = projection([0, lat])?.[1];
              if (!y) return null;
              return (
                <line
                  key={`lat-${lat}`}
                  x1="0"
                  y1={y}
                  x2={dimensions.width}
                  y2={y}
                  stroke={darkMode ? '#475569' : '#93c5fd'}
                  strokeDasharray="4 6"
                  strokeWidth="0.8"
                />
              );
            })}
          </g>

          {/* Render Countries GeoJSON paths */}
          {countriesGeoJson.map((feature: any, index: number) => {
            const countryId = String(feature.id);
            const countryInfo = getCountryByNumericId(countryId);
            const isSelected = selectedCountry?.id === countryId;
            const isHovered = hoveredCountry?.info.id === countryId;

            const colorIndex = (parseInt(countryId, 10) || index) % activeLandColors.length;
            const landColor = activeLandColors[colorIndex];

            const pathD = pathGenerator(feature);
            if (!pathD) return null;

            return (
              <path
                key={`country-${countryId}-${index}`}
                d={pathD}
                fill={
                  isSelected
                    ? darkMode ? '#475569' : '#fed7aa'
                    : isHovered
                    ? darkMode ? '#3f4b5d' : '#fef08a'
                    : landColor
                }
                stroke={
                  isSelected
                    ? darkMode ? '#94a3b8' : '#fb7185'
                    : isHovered
                    ? darkMode ? '#64748b' : '#f43f5e'
                    : darkMode ? '#1e293b' : '#cbd5e1'
                }
                strokeWidth={isSelected ? 1.5 : isHovered ? 1.1 : 0.6}
                strokeLinejoin="round"
                className="transition-colors duration-200 cursor-pointer"
                onMouseEnter={(e) => {
                  if (countryInfo) {
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) {
                      setHoveredCountry({
                        info: countryInfo,
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }
                  }
                }}
                onMouseMove={(e) => {
                  if (hoveredCountry) {
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) {
                      setHoveredCountry((prev) =>
                        prev
                          ? {
                              ...prev,
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            }
                          : null
                      );
                    }
                  }
                }}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={() => handleCountryClick(feature)}
              />
            );
          })}

          {/* 1. FROM FAR AWAY (zoom < 1.9 & no country selected): ONLY COUNTRY NAMES ARE SHOWN */}
          {zoom < 1.9 &&
            !selectedCountry &&
            countryCentroids.map((item: any) => (
              <g
                key={`country-label-${item.id}`}
                transform={`translate(${item.x}, ${item.y})`}
                className="pointer-events-none select-none transition-opacity duration-300"
              >
                <text
                  textAnchor="middle"
                  dy="3.5"
                  fontSize={Math.max(7.5, Math.min(11, 10 / Math.sqrt(zoom)))}
                  fontWeight="700"
                  className="font-whimsical tracking-wider"
                  fill={darkMode ? '#f8fafc' : '#1e293b'}
                  style={{
                    paintOrder: 'stroke',
                    stroke: darkMode ? '#0f172a' : '#ffffff',
                    strokeWidth: '2.8px',
                    strokeLinejoin: 'round',
                  }}
                >
                  {item.name}
                </text>
              </g>
            ))}

          {/* 2. ONLY WHEN ZOOMED IN CLOSELY (zoom >= 1.9 OR country selected): WRITTEN NAMES OF ALL CITIES WITHOUT BIG ICONS */}
          {(zoom >= 1.9 || selectedCountry) &&
            allCities.map((city) => {
              // If a country is selected, emphasize and show only that country's cities
              if (selectedCountry && city.countryId !== selectedCountry.id) {
                return null;
              }

              const projected = projection([city.lon, city.lat]);
              if (!projected) return null;
              const [cx, cy] = projected;

              return (
                <g
                  key={`city-text-${city.name}-${city.countryName}`}
                  transform={`translate(${cx}, ${cy})`}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLocation(city.name, city.countryName, [city.lon, city.lat]);
                  }}
                >
                  {/* Subtle tiny anchor dot (without big icons) */}
                  <circle
                    r="2.2"
                    fill={darkMode ? '#38bdf8' : '#e11d48'}
                    stroke={darkMode ? '#0f172a' : '#ffffff'}
                    strokeWidth="0.8"
                    className="transition-transform group-hover:scale-150"
                  />

                  {/* Clean written city name directly on the map */}
                  <text
                    textAnchor="middle"
                    dy="-6"
                    fontSize={Math.max(8.5, Math.min(11.5, 10.5 / Math.sqrt(zoom / 2.2)))}
                    fontWeight="600"
                    fill={darkMode ? '#f8fafc' : '#1e293b'}
                    className="font-whimsical select-none transition-all duration-150 group-hover:font-bold group-hover:fill-rose-500 dark:group-hover:fill-sky-400"
                    style={{
                      paintOrder: 'stroke',
                      stroke: darkMode ? '#0f172a' : '#ffffff',
                      strokeWidth: '2.5px',
                      strokeLinejoin: 'round',
                    }}
                  >
                    {city.name}
                  </text>
                </g>
              );
            })}
        </g>
      </svg>

      {/* Cute Hover Tooltip */}
      {hoveredCountry && !selectedCountry && (
        <div
          className={`absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2 rounded-2xl border shadow-lg backdrop-blur-md flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150 ${
            darkMode
              ? 'bg-slate-800/95 border-slate-700 shadow-slate-950/80 text-slate-100'
              : 'bg-white/95 border-rose-200/80 shadow-rose-100/50 text-slate-800'
          }`}
          style={{
            left: hoveredCountry.x,
            top: hoveredCountry.y,
          }}
        >
          <span className="text-xl">{hoveredCountry.info.flag || '🌍'}</span>
          <div>
            <div className="text-xs font-bold font-whimsical">{hoveredCountry.info.name}</div>
            <div
              className={`text-[10px] font-medium flex items-center gap-1 ${
                darkMode ? 'text-sky-400' : 'text-rose-500'
              }`}
            >
              <span>Click to zoom in & view cities</span>
              <span>✨</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Country Cities Floating Card (Opens on country click) */}
      {selectedCountry && (
        <div
          id="country-selection-card"
          className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-80 max-w-[calc(100vw-2rem)] rounded-3xl p-4 border shadow-xl backdrop-blur-md animate-in slide-in-from-right-4 duration-300 ${
            darkMode
              ? 'bg-slate-800/95 border-slate-700 shadow-slate-950/80 text-slate-100'
              : 'bg-white/95 border-rose-200 shadow-rose-100/50 text-slate-800'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-2 border-b ${
              darkMode ? 'border-slate-700' : 'border-rose-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedCountry.flag}</span>
              <div>
                <h3 className="font-whimsical font-bold text-sm">{selectedCountry.name}</h3>
                <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Capital: {selectedCountry.capital}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCountry(null)}
              className={`p-1 rounded-full transition-colors ${
                darkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick city search inside selected country */}
          <div className="mt-3 relative">
            <Search
              className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${
                darkMode ? 'text-slate-400' : 'text-slate-400'
              }`}
            />
            <input
              type="text"
              value={countryCitySearch}
              onChange={(e) => setCountryCitySearch(e.target.value)}
              placeholder={`Search city in ${selectedCountry.name}...`}
              className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 font-whimsical transition-all ${
                darkMode
                  ? 'bg-slate-700/60 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:ring-sky-400'
                  : 'bg-rose-50/50 border-rose-200/70 text-slate-700 placeholder:text-slate-400 focus:ring-rose-300'
              }`}
            />
          </div>

          {/* Cities list in selected country */}
          <div className="mt-3">
            <div
              className={`text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1 ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <span>Click a city to discover weather</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>

            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() =>
                      onSelectLocation(city.name, selectedCountry.name, [city.lon, city.lat])
                    }
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all text-left group ${
                      darkMode
                        ? 'bg-slate-700/40 hover:bg-slate-700 border-transparent hover:border-slate-600 text-slate-100'
                        : 'bg-slate-50 hover:bg-rose-50/80 border-transparent hover:border-rose-200 text-slate-800'
                    }`}
                  >
                    <div>
                      <div
                        className={`text-xs font-semibold font-whimsical ${
                          darkMode ? 'group-hover:text-sky-400' : 'group-hover:text-rose-600'
                        }`}
                      >
                        📍 {city.name}
                      </div>
                      {city.description && (
                        <div
                          className={`text-[10px] line-clamp-1 ${
                            darkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {city.description}
                        </div>
                      )}
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-all ${
                        darkMode
                          ? 'text-slate-500 group-hover:text-sky-400'
                          : 'text-slate-300 group-hover:text-rose-400'
                      }`}
                    />
                  </button>
                ))
              ) : (
                <button
                  onClick={() => onSelectLocation(countryCitySearch, selectedCountry.name)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center flex items-center justify-center gap-1.5 ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-sky-400 hover:bg-slate-600'
                      : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Travel to &ldquo;{countryCitySearch}&rdquo;</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
