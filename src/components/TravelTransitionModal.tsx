import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Sparkles, MapPin, Compass } from 'lucide-react';

interface TravelTransitionModalProps {
  cityName: string;
  countryName?: string;
  onComplete: () => void;
  darkMode?: boolean;
}

export const TravelTransitionModal: React.FC<TravelTransitionModalProps> = ({
  cityName,
  countryName,
  onComplete,
  darkMode = false,
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence of travel journal steps
    const timer1 = setTimeout(() => setStep(1), 450);
    const timer2 = setTimeout(() => setStep(2), 1100);
    const timer3 = setTimeout(() => {
      onComplete();
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div
      id="travel-transition-overlay"
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md px-4 ${
        darkMode ? 'bg-black/75' : 'bg-[#fdfbf7]/90'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border-2 shadow-2xl text-center relative overflow-hidden ${
          darkMode
            ? 'bg-slate-800 border-slate-700 shadow-slate-950/80 text-slate-100'
            : 'bg-white border-rose-200 shadow-rose-200/50 text-slate-800'
        }`}
      >
        {/* Whimsical travel journal background accents */}
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />

        {/* Travel Journal Header badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-whimsical font-semibold mb-5 border shadow-xs ${
            darkMode
              ? 'bg-slate-700 border-slate-600 text-sky-400'
              : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Cloudventure Travel Journal</span>
        </div>

        {/* Flight path curve with animated airplane */}
        <div className="relative h-28 flex items-center justify-center my-2">
          {/* Animated SVG dotted flight path */}
          <svg className="w-full h-full" viewBox="0 0 320 90">
            <defs>
              <linearGradient id="planeTrail" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Dotted Arch Flight Trail */}
            <path
              d="M 20 70 Q 160 5 300 65"
              fill="none"
              stroke="url(#planeTrail)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="animate-[flightDash_3s_linear_infinite]"
            />

            {/* Origin marker */}
            <circle cx="20" cy="70" r="5" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />

            {/* Destination pin marker */}
            <circle cx="300" cy="65" r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
          </svg>

          {/* Flying Airplane along the curve */}
          <motion.div
            initial={{ left: '8%', top: '65%', rotate: -25 }}
            animate={{
              left: step >= 1 ? (step >= 2 ? '88%' : '50%') : '15%',
              top: step >= 1 ? (step >= 2 ? '60%' : '15%') : '65%',
              rotate: step >= 1 ? (step >= 2 ? 18 : -5) : -25,
            }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-lg shadow-rose-300/60 border border-rose-200 flex items-center justify-center text-rose-500">
              <Plane className="w-5 h-5 fill-rose-500 transform rotate-45" />
            </div>
          </motion.div>

          {/* Drifting whimsical cloud puffs */}
          <div className="absolute top-2 left-10 text-slate-300/70 text-xl animate-float">☁️</div>
          <div className="absolute bottom-2 right-12 text-slate-300/70 text-2xl animate-float-delayed">☁️</div>
        </div>

        {/* Traveling Breadcrumb Flow: 🌍 World → 🇫🇷 Country → 📍 City */}
        <div className="flex items-center justify-center gap-2 font-whimsical text-sm sm:text-base font-semibold text-slate-700 my-4 flex-wrap">
          <span className="flex items-center gap-1 text-slate-500">
            <span>🌍</span>
            <span>World</span>
          </span>

          <span className="text-rose-300">→</span>

          {countryName && (
            <>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 text-slate-600 bg-rose-50/70 px-2.5 py-1 rounded-xl border border-rose-100"
              >
                <span>🗺️</span>
                <span>{countryName}</span>
              </motion.span>
              <span className="text-rose-300">→</span>
            </>
          )}

          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 text-rose-600 bg-rose-100/70 px-3 py-1 rounded-xl border border-rose-200 shadow-xs"
          >
            <MapPin className="w-4 h-4 fill-rose-500 text-white" />
            <span>{cityName}</span>
          </motion.span>
        </div>

        {/* Dynamic Status Text */}
        <div className="text-xs text-slate-500 tracking-wide mt-2">
          {step === 0 && 'Consulting whimsy weather charts...'}
          {step === 1 && `Boarding flight to ${cityName}...`}
          {step === 2 && `Touching down in ${cityName}! ✨`}
        </div>
      </motion.div>
    </div>
  );
};
