'use client';
import React from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MovieRowProps {
  title: string;
  emoji?: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  variant?: 'portrait' | 'landscape';
  showProgress?: boolean;
  onRemove?: (id: string) => void;
  accentColor?: string;
  genre?: string;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title, emoji, movies, onMovieClick, variant = 'portrait',
  showProgress, onRemove, accentColor = 'var(--red)', genre
}) => {
  const router = useRouter();
  if (!movies.length) return null;

  return (
    <section className="mb-1 mt-1">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2.5">
          {/* Accent line */}
          <div className="w-[3px] h-5 rounded-full" style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
          <h2 style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--text-1)',
          }}>
            {emoji && <span className="mr-1.5">{emoji}</span>}
            {title}
          </h2>
          <div className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-3)' }}>{movies.length}</span>
          </div>
        </div>
        {genre && (
          <button onClick={() => router.push(`/category/${genre}`)}
            className="flex items-center gap-1 active:scale-95 transition-transform"
            style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            All <ChevronRight size={11} />
          </button>
        )}
      </div>

      {/* Cards scroll */}
      <div className={`flex overflow-x-auto no-scrollbar pb-3 pl-4 pr-2 ${variant === 'portrait' ? 'gap-2.5' : 'gap-3'}`}>
        {movies.map(movie => (
          <div key={movie.movie_id} className={`flex-shrink-0 relative ${variant === 'landscape' ? 'w-[176px]' : 'w-[108px]'}`}>
            {onRemove && (
              <button
                onClick={e => { e.stopPropagation(); onRemove(movie.movie_id); }}
                className="absolute -top-1.5 -right-1.5 z-20 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.15)', zIndex: 20 }}>
                <X size={9} color="rgba(255,255,255,0.7)" />
              </button>
            )}
            <MovieCard movie={movie} onClick={onMovieClick} variant={variant}
              progress={showProgress ? Math.floor(Math.random() * 70 + 15) : undefined}
              timeLeft={showProgress ? 'Resume' : undefined} />
          </div>
        ))}
        <div className="flex-shrink-0 w-3" />
      </div>
    </section>
  );
};
