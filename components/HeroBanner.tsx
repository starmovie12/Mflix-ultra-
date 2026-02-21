'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Movie } from '../types';
import { Play, Plus, Info, Star, Clock, Check } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from 'next/navigation';

interface HeroBannerProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movies, onMovieClick }) => {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const { showToast } = useToast();
  const router = useRouter();
  const featured = movies.slice(0, 6);

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setAnimKey(k => k + 1);
  }, []);

  useEffect(() => {
    if (featured.length <= 1) return;
    const t = setInterval(() => goTo((current + 1) % featured.length), 7000);
    return () => clearInterval(t);
  }, [current, featured.length, goTo]);

  if (!featured.length) return null;
  const movie = featured[current];
  const bg = movie.original_backdrop_url || movie.poster;
  const rating = movie.rating ? parseFloat(String(movie.rating)).toFixed(1) : '—';
  const inList = isInWatchlist(movie.movie_id);
  const genres = (movie.genre || '').split(',').slice(0, 3).map(g => g.trim()).filter(Boolean);
  const quality = (movie.quality_name || movie.quality || 'HD').includes('4K') ? '4K' : (movie.quality_name || '').includes('1080') ? 'FHD' : 'HD';

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'min(78vw, 500px)' }}>
      {/* BG Image */}
      <div key={`bg-${current}`} className="absolute inset-0 anim-fade-in">
        <img src={bg} alt="" className="w-full h-full object-cover object-top" style={{ filter: 'brightness(0.65) saturate(1.2)' }} />
      </div>

      {/* Gradient layers */}
      <div className="absolute inset-0 grad-hero" />
      <div className="absolute inset-0 grad-hero-side" />

      {/* Scan line texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)' }} />

      {/* Content */}
      <div key={`c-${animKey}`} className="absolute bottom-0 left-0 right-0 px-5 pb-7">
        {/* Genre row */}
        <div className="flex items-center gap-2 mb-3 opacity-0 anim-fade-up" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
          {genres.map((g, i) => (
            <React.Fragment key={g}>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-2)' }}>{g}</span>
              {i < genres.length - 1 && <span style={{ color: 'var(--text-3)', fontSize: 6 }}>●</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Title */}
        <h1 className="opacity-0 anim-fade-up delay-1 line-clamp-2 mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 9vw, 3.5rem)',
            lineHeight: 1,
            letterSpacing: '0.02em',
            textShadow: '0 2px 20px rgba(0,0,0,0.7)',
            animationFillMode: 'forwards',
          }}>
          {movie.title}
        </h1>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-5 opacity-0 anim-fade-up delay-2" style={{ animationFillMode: 'forwards' }}>
          <div className="badge-rating">
            <Star size={9} fill="var(--gold)" style={{ color: 'var(--gold)' }} />
            {rating}
          </div>
          <span style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 600 }}>{movie.year}</span>
          {movie.runtime && (
            <span className="flex items-center gap-1" style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 600 }}>
              <Clock size={10} />{movie.runtime}
            </span>
          )}
          <span className="badge-quality">{quality}</span>
        </div>

        {/* CTA row */}
        <div className="flex gap-3 opacity-0 anim-fade-up delay-3" style={{ animationFillMode: 'forwards' }}>
          {/* Play */}
          <button className="btn-primary flex-1 h-12 rounded-2xl text-sm"
            onClick={() => onMovieClick(movie)}
            style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em' }}>
            <Play size={16} fill="white" />
            PLAY NOW
          </button>

          {/* My List */}
          <button
            onClick={() => { toggleWatchlist(movie); showToast(inList ? 'Removed from list' : '✓ Added to My List', inList ? 'info' : 'success'); }}
            className="btn-glass w-12 h-12 rounded-2xl"
            style={{ borderColor: inList ? 'rgba(255,23,68,0.5)' : undefined, background: inList ? 'rgba(255,23,68,0.15)' : undefined }}>
            {inList ? <Check size={18} style={{ color: 'var(--red)' }} /> : <Plus size={18} />}
          </button>

          {/* Info */}
          <button className="btn-glass w-12 h-12 rounded-2xl" onClick={() => router.push(`/player/${movie.movie_id}`)}>
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Slide indicators */}
      {featured.length > 1 && (
        <div className="absolute right-5 bottom-8 flex flex-col gap-1.5">
          {featured.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="rounded-full transition-all duration-400"
              style={{
                width: i === current ? 3 : 3,
                height: i === current ? 18 : 6,
                background: i === current ? 'var(--red)' : 'rgba(255,255,255,0.2)',
                boxShadow: i === current ? '0 0 8px var(--red-glow)' : 'none',
              }} />
          ))}
        </div>
      )}
    </div>
  );
};
