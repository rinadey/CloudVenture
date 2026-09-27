import React, { useEffect, useRef, useState } from 'react';
import { RealPlace } from '../types';
import { MapPin, X, ExternalLink, Compass } from 'lucide-react';

interface GoogleMapExplorerProps {
  lat: number;
  lng: number;
  cityName: string;
  countryName?: string;
  places?: RealPlace[];
  darkMode?: boolean;
  onClose?: () => void;
  height?: string;
  showCloseButton?: boolean;
}

export const GoogleMapExplorer: React.FC<GoogleMapExplorerProps> = ({
  lat,
  lng,
  cityName,
  countryName,
  places = [],
  darkMode = false,
  onClose,
  height = '340px',
  showCloseButton = false,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [activePlace, setActivePlace] = useState<RealPlace | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const checkGoogle = () => {
      if ((window as any).google && (window as any).google.maps) {
        initMap();
      } else {
        setTimeout(checkGoogle, 200);
      }
    };

    const initMap = () => {
      try {
        const google = (window as any).google;
        const center = { lat, lng };

        // Whimsical pastel styles for light mode, sleek charcoal styles for dark mode
        const styles = darkMode
          ? [
              { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
              {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }],
              },
              {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }],
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#38414e' }],
              },
              {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#212a37' }],
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }],
              },
            ]
          : [
              { elementType: 'geometry', stylers: [{ color: '#f5f7fa' }] },
              { featureType: 'water', stylers: [{ color: '#cce5ff' }] },
              { featureType: 'landscape', stylers: [{ color: '#fef6ee' }] },
              { featureType: 'road', stylers: [{ color: '#ffffff' }] },
              { featureType: 'poi.park', stylers: [{ color: '#d8f3dc' }] },
            ];

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
          styles,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });

        // City Center Marker
        new google.maps.Marker({
          position: center,
          map,
          title: cityName,
          label: {
            text: '📍 ' + cityName,
            color: darkMode ? '#ffffff' : '#be123c',
            fontWeight: 'bold',
            fontSize: '12px',
          },
        });

        // Markers for Real Places
        places.forEach((p) => {
          if (p.location?.latitude && p.location?.longitude) {
            const marker = new google.maps.Marker({
              position: { lat: p.location.latitude, lng: p.location.longitude },
              map,
              title: p.displayName.text,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: darkMode ? '#38bdf8' : '#f43f5e',
                fillOpacity: 0.9,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              },
            });

            marker.addListener('click', () => {
              setActivePlace(p);
            });
          }
        });

        setMapInstance(map);
      } catch (err) {
        console.error('Failed to initialize Google Map:', err);
      }
    };

    checkGoogle();
  }, [lat, lng, darkMode, places, cityName]);

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border-2 shadow-lg transition-colors ${
        darkMode
          ? 'bg-slate-900 border-slate-700 shadow-slate-950/60'
          : 'bg-white border-rose-200/80 shadow-rose-100/50'
      }`}
    >
      {/* Map Header Bar */}
      <div
        className={`px-4 py-2.5 flex items-center justify-between border-b ${
          darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-rose-50/70 border-rose-100 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <Compass className={`w-4 h-4 ${darkMode ? 'text-sky-400' : 'text-rose-500'}`} />
          <span className="font-whimsical font-bold text-xs sm:text-sm">
            Interactive City Map · {cityName} {countryName ? `(${countryName})` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            darkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-500 border border-rose-100'
          }`}>
            Powered by Google Maps
          </span>
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-black/5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} style={{ width: '100%', height }} className="relative z-0" />

      {/* Place Preview Card Popup on Marker Click */}
      {activePlace && (
        <div
          className={`absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-xs p-3.5 rounded-2xl border shadow-xl z-10 animate-in fade-in slide-in-from-bottom-2 ${
            darkMode ? 'bg-slate-800/95 border-slate-600 text-slate-100' : 'bg-white/95 border-rose-200 text-slate-800'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-whimsical font-bold text-xs sm:text-sm">
                {activePlace.displayName.text}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                {activePlace.formattedAddress}
              </div>
              {activePlace.rating && (
                <div className="text-[11px] text-amber-500 font-semibold mt-1">
                  ⭐ {activePlace.rating} ({activePlace.userRatingCount?.toLocaleString() || 0} reviews)
                </div>
              )}
            </div>
            <button
              onClick={() => setActivePlace(null)}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {activePlace.googleMapsUri && (
            <a
              href={activePlace.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-2 inline-flex items-center gap-1 text-[11px] font-semibold underline ${
                darkMode ? 'text-sky-400' : 'text-rose-600'
              }`}
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
