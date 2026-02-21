'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { Movie } from '../types';
import { useRouter } from 'next/navigation';

interface Props { movies: Movie[]; onClose: () => void; }

export const SearchOverlay: React.FC<Props> = ({ movies, onClose }) => {
  const [q, setQ] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    ref.current?.focus();
    try { const s = localStorage.getItem('mflix_searches'); if (s) setRecent(JSON.parse(s)); } catch {}
  }, []);

  const results = q.trim().length > 1
    ? movies.filter(m => [m.title, m.genre, m.cast, m.director].some(f => f?.toLowerCase().includes(q.toLowerCase()))).slice(0, 18)
    : [];

  const select = (movie: Movie) => {
    const u = [movie.title, ...recent.filter(s => s !== movie.title)].slice(0, 8);
    setRecent(u);
    try { localStorage.setItem('mflix_searches', JSON.stringify(u)); } catch {}
    onClose(); router.push(`/player/${movie.movie_id}`);
  };

  const trending = ['Action', 'Comedy', 'Bollywood', 'Horror', '4K', 'Drama', 'Romance', 'Thriller'];

  return (
    <div className="fixed inset-0 z-[300] flex flex-col anim-fade-in" style={{ background: 'rgba(3,6,15,0.97)', backdropFilter: 'blur(20px)' }}>
      {/* Top search bar */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex-1 flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={17} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
          <input
            ref={ref} value={q} onChange={e => setQ(e.target.value)}
            placeholder="Movies, genres, actors..."
            className="flex-1 bg-transparent outline-none text-base font-medium placeholder:font-normal"
            style={{ color: 'var(--text-1)', fontSize: 15 }}
          />
          {q && (
            <button onClick={() => setQ('')} className="active:scale-90 transition-transform">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <X size={11} style={{ color: 'var(--text-2)' }} />
              </div>
            </button>
          )}
        </div>
        <button onClick={onClose} className="text-sm font-bold active:scale-95 transition-transform px-2" style={{ color: 'var(--text-2)' }}>
          Cancel
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-7 no-scrollbar">
        {/* Results */}
        {q.trim().length > 1 && (
          results.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {results.map(movie => (
                <div key={movie.movie_id} onClick={() => select(movie)} className="cursor-pointer active:scale-95 transition-transform">
                  <div className="relative rounded-xl overflow-hidden" style={{ paddingBottom: '150%', background: 'var(--card)' }}>
                    <img src={movie.poster} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/srch/300/450'; }} />
                    <div className="absolute inset-0 grad-card" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white font-bold line-clamp-2" style={{ fontSize: 10 }}>{movie.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--card)' }}>
                <Search size={30} style={{ color: 'var(--text-3)' }} />
              </div>
              <p className="font-bold" style={{ color: 'var(--text-2)' }}>No results for "{q}"</p>
              <p className="text-sm text-center" style={{ color: 'var(--text-3)' }}>Try different keywords or browse categories</p>
            </div>
          )
        )}

        {q.trim().length <= 1 && (
          <>
            {/* Recent */}
            {recent.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={13} style={{ color: 'var(--text-3)' }} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Recent</span>
                  </div>
                  <button onClick={() => { setRecent([]); try { localStorage.removeItem('mflix_searches'); } catch {} }}
                    style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)' }}>Clear</button>
                </div>
                <div className="space-y-1">
                  {recent.map(term => (
                    <button key={term} onClick={() => setQ(term)}
                      className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl active:bg-white/5 transition-colors text-left"
                      style={{ color: 'var(--text-2)' }}>
                      <Clock size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                      <span className="text-sm font-medium">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={13} style={{ color: 'var(--red)' }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Trending</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trending.map(tag => (
                  <button key={tag} onClick={() => setQ(tag)}
                    className="px-4 py-2 rounded-full font-bold text-sm active:scale-95 transition-all"
                    style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-2)', fontSize: 13 }}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
