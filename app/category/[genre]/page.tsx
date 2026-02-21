'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAllMovies } from '../../../services/firebaseService';
import { Movie } from '../../../types';
import { ArrowLeft } from 'lucide-react';
import { MovieCard } from '../../../components/MovieCard';
import { BottomNav } from '../../../components/BottomNav';
import { SearchOverlay } from '../../../components/SearchOverlay';

const GENRES = [
  { id:'all',       label:'All',        emoji:'🎬', a:'#ff1744', b:'#880e1f' },
  { id:'trending',  label:'Trending',   emoji:'🔥', a:'#ff6d00', b:'#b71c1c' },
  { id:'latest',    label:'Latest',     emoji:'⚡', a:'#00b0ff', b:'#0d47a1' },
  { id:'bollywood', label:'Bollywood',  emoji:'🌟', a:'#ffb300', b:'#e65100' },
  { id:'action',    label:'Action',     emoji:'💥', a:'#ff1744', b:'#880e1f' },
  { id:'comedy',    label:'Comedy',     emoji:'😂', a:'#ffb300', b:'#f57f17' },
  { id:'romance',   label:'Romance',    emoji:'💕', a:'#f06292', b:'#880e4f' },
  { id:'horror',    label:'Horror',     emoji:'👻', a:'#aa00ff', b:'#1a0033' },
  { id:'thriller',  label:'Thriller',   emoji:'🔪', a:'#546e7a', b:'#102027' },
  { id:'drama',     label:'Drama',      emoji:'🎭', a:'#00bcd4', b:'#006064' },
  { id:'4k',        label:'4K Ultra',   emoji:'🎥', a:'#00e5ff', b:'#006064' },
  { id:'hollywood', label:'Hollywood',  emoji:'🌍', a:'#7c4dff', b:'#1a0077' },
];

export default function CategoryPage() {
  const { genre } = useParams();
  const router = useRouter();
  const [movies, setMovies]     = useState<Movie[]>([]);
  const [loading, setLoading]   = useState(true);
  const [searchOpen, setSearch] = useState(false);
  const [active, setActive]     = useState((genre as string) || 'all');

  useEffect(() => { fetchAllMovies().then(d => { setMovies(d); setLoading(false); }); }, []);
  useEffect(() => { setActive((genre as string) || 'all'); }, [genre]);

  const filtered = useMemo(() => {
    switch (active) {
      case 'all':       return movies;
      case 'trending':  return movies.filter(m => m.is_trending_now === 'Yes');
      case 'bollywood': return movies.filter(m => m.industry?.toLowerCase().includes('bollywood'));
      case 'hollywood': return movies.filter(m => m.industry?.toLowerCase().includes('hollywood'));
      case '4k':        return movies.filter(m => m.quality_name?.includes('4K') || m.quality?.includes('4K'));
      case 'latest':    return [...movies].sort((a,b) => Number(b.year||0)-Number(a.year||0));
      default:          return movies.filter(m => m.genre?.toLowerCase().includes(active));
    }
  }, [movies, active]);

  const cur = GENRES.find(g => g.id === active) || GENRES[0];

  return (
    <>
      {searchOpen && <SearchOverlay movies={movies} onClose={() => setSearch(false)} />}
      <div className="min-h-screen pb-28" style={{ background:'var(--black)' }}>

        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 header-blur px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
            style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={18} style={{ color:'var(--text-1)' }} />
          </button>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:22, letterSpacing:'0.04em' }}>
              {cur.emoji} {cur.label}
            </h1>
            <p style={{ fontSize:11, color:'var(--text-3)', fontWeight:600 }}>{filtered.length} titles</p>
          </div>
        </div>

        {/* Genre tabs */}
        <div className="pt-20 pb-3 px-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {GENRES.map(g => {
              const isA = active === g.id;
              return (
                <button key={g.id}
                  onClick={() => { setActive(g.id); router.replace(`/category/${g.id}`); }}
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold active:scale-95 transition-all"
                  style={{
                    background: isA ? `linear-gradient(135deg,${g.a},${g.b})` : 'var(--card)',
                    border: isA ? 'none' : '1px solid rgba(255,255,255,0.07)',
                    color: isA ? 'white' : 'var(--text-3)',
                    boxShadow: isA ? `0 4px 16px ${g.a}44` : 'none',
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                  }}>
                  <span>{g.emoji}</span>
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-3 gap-3 px-4 pt-2">
            {Array.from({length:15}).map((_,i) => (
              <div key={i} className="skeleton rounded-xl" style={{ paddingBottom:'150%' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-28 gap-4">
            <div className="text-6xl anim-float">{cur.emoji}</div>
            <p className="font-bold text-lg" style={{color:'var(--text-2)'}}>No {cur.label} movies</p>
            <p className="text-sm" style={{color:'var(--text-3)'}}>Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 px-4 pt-1 pb-4">
            {filtered.map((m,i) => (
              <div key={m.movie_id} className="anim-fade-up opacity-0" style={{ animationDelay:`${Math.min(i*25,400)}ms`, animationFillMode:'forwards' }}>
                <MovieCard movie={m} onClick={() => router.push(`/player/${m.movie_id}`)} />
              </div>
            ))}
          </div>
        )}

        <BottomNav onSearchOpen={() => setSearch(true)} />
      </div>
    </>
  );
}
