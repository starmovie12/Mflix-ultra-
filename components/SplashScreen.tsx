'use client';
import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [phase, setPhase] = useState(0);
  // 0=hidden 1=logo-in 2=tagline 3=out
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(onDone, 2750),
    ];
    return () => t.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${phase === 3 ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: 'var(--black)' }}>
      {/* Cinematic scan lines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
      }} />

      {/* Radial glow burst */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-96 h-96 rounded-full transition-all duration-1000 ease-out ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          style={{ background: 'radial-gradient(circle, rgba(255,23,68,0.18) 0%, transparent 70%)' }} />
      </div>

      {/* Logo block */}
      <div className={`relative flex flex-col items-center gap-4 transition-all duration-700 ease-out ${phase >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-75'}`}>
        {/* Icon */}
        <div className="relative" style={{ filter: phase >= 1 ? 'drop-shadow(0 0 30px rgba(255,23,68,0.6))' : 'none', transition: 'filter 0.8s ease' }}>
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{ background: 'linear-gradient(145deg, #ff1744 0%, #880e1f 100%)', boxShadow: '0 8px 40px rgba(255,23,68,0.5), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
            <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 8H2v12c0 1.1.9 2 2 2h12v-2H4V8zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 5v3.13L17.5 13l-2.5 1 .63-2.5L13 9.63V9h3v.5z" />
            </svg>
          </div>
        </div>

        {/* Wordmark */}
        <div className="flex items-center gap-1">
          {'MFLIX'.split('').map((char, i) => (
            <span key={i} className="text-[52px] text-white"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.05em',
                opacity: phase >= 1 ? 1 : 0,
                transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${0.1 + i * 0.06}s, transform 0.5s ease ${0.1 + i * 0.06}s`,
                textShadow: '0 0 40px rgba(255,23,68,0.4)',
              }}>
              {char}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <p className={`text-xs tracking-[0.4em] uppercase font-bold transition-all duration-500 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ color: 'var(--text-3)', transitionDelay: '0.1s' }}>
          Cinema &nbsp;·&nbsp; Redefined
        </p>
      </div>

      {/* Progress line */}
      <div className="absolute bottom-14 w-40 rounded-full overflow-hidden" style={{ height: 2, background: 'rgba(255,255,255,0.07)' }}>
        <div className="h-full rounded-full" style={{
          background: 'linear-gradient(to right, var(--red), #ff6d8a)',
          width: phase >= 1 ? '100%' : '0%',
          transition: 'width 2.2s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 10px var(--red-glow)',
        }} />
      </div>
    </div>
  );
};
