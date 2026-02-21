'use client';
import React, { useState } from 'react';
import { Movie } from '../types';
import { Star, Plus, Check, Play } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  variant?: 'portrait' | 'landscape';
  progress?: number;
  timeLeft?: string;
}

const FB = 'https://picsum.photos/seed/mflixfb/300/450';

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, variant = 'portrait', progress, timeLeft }) => {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const { showToast } = useToast();
  const [imgErr, setImgErr] = useState(false);
  const inList = isInWatchlist(movie.movie_id);

  const poster = imgErr ? FB : (movie.poster || movie.original_poster_url || FB);
  const rating = movie.rating ? parseFloat(String(movie.rating)).toFixed(1) : '—';
  const quality = (movie.quality_name || movie.quality || 'HD');
  const qLabel = quality.includes('4K') ? '4K' : quality.includes('1080') ? 'FHD' : quality.includes('720') ? 'HD' : 'SD';
  const lang = ((movie.languages || movie.audio_type || movie.original_language || 'HI').toString().split(/[\s,]/)[0].substring(0, 3)).toUpperCase();

  if (variant === 'landscape') {
    return (
      <article className="movie-card flex-shrink-0 w-full cursor-pointer" onClick={() => onClick(movie)}>
        <div className="relative" style={{ aspectRatio: '16/9' }}>
          <img src={poster} alt={movie.title} className="w-full h-full object-cover" loading="lazy" onError={() => setImgErr(true)} style={{ filter: 'brightness(0.8)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,23,68,0.9)', boxShadow: '0 0 20px var(--red-glow)' }}>
              <Play size={18} fill="white" className="text-white ml-0.5" />
            </div>
          </div>
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 progress-bar rounded-none" style={{ borderRadius: 0 }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <div className="p-2.5">
          <p className="text-sm font-bold line-clamp-1" style={{ color: 'var(--text-1)' }}>{movie.title}</p>
          {timeLeft && <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-3)' }}>{timeLeft}</p>}
        </div>
      </article>
    );
  }

  return (
    <article className="movie-card group relative w-full" onClick={() => onClick(movie)}>
      {/* Poster */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '150%', borderRadius: 12 }}>
        <img
          src={poster} alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          loading="lazy" onError={() => setImgErr(true)}
          style={{ transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 grad-card opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* Lang badge */}
        <div className="absolute top-0 left-0 px-1.5 py-0.5 rounded-br-lg" style={{ background: 'var(--red)', fontSize: 8, fontWeight: 900, letterSpacing: '0.05em', color: 'white' }}>
          {lang}
        </div>

        {/* Quality badge */}
        <div className="absolute top-0 right-0 px-1.5 py-0.5 rounded-bl-lg" style={{ background: 'rgba(0,0,0,0.75)', fontSize: 8, fontWeight: 900, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>
          {qLabel}
        </div>

        {/* Play overlay on hover */}
        <div className="absolute inset-0 items-center justify-center hidden group-hover:flex transition-all">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,23,68,0.9)', boxShadow: '0 0 24px var(--red-glow)' }}>
            <Play size={16} fill="white" className="text-white ml-0.5" />
          </div>
        </div>

        {/* Watchlist btn */}
        <button
          onClick={e => { e.stopPropagation(); toggleWatchlist(movie); showToast(inList ? 'Removed from My List' : '✓ Added', inList ? 'info' : 'success'); }}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90"
          style={{
            background: inList ? 'var(--red)' : 'rgba(0,0,0,0.7)',
            border: `1px solid ${inList ? 'var(--red)' : 'rgba(255,255,255,0.25)'}`,
            backdropFilter: 'blur(8px)',
            boxShadow: inList ? '0 0 12px var(--red-glow)' : 'none',
          }}>
          {inList ? <Check size={12} strokeWidth={3} color="white" /> : <Plus size={12} strokeWidth={2.5} color="white" />}
        </button>
      </div>

      {/* Info */}
      <div className="mt-2 px-0.5">
        <p className="text-xs font-bold line-clamp-1" style={{ color: 'var(--text-1)' }}>{movie.title}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs" style={{ color: 'var(--text-3)', fontWeight: 600 }}>{movie.year}</span>
          <div className="badge-rating" style={{ padding: '1px 5px', fontSize: 9 }}>
            <Star size={8} fill="var(--gold)" style={{ color: 'var(--gold)' }} />
            {rating}
          </div>
        </div>
      </div>
    </article>
  );
};
