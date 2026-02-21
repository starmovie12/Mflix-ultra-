'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Movie } from '../types';
import { fetchAllMovies } from '../services/firebaseService';
import { HeroBanner }     from '../components/HeroBanner';
import { MovieRow }       from '../components/MovieRow';
import { BottomNav }      from '../components/BottomNav';
import { SearchOverlay }  from '../components/SearchOverlay';
import { SplashScreen }   from '../components/SplashScreen';
import { ScrollToTop }    from '../components/ScrollToTop';
import { HomePageSkeleton } from '../components/SkeletonLoader';
import { useWatchlist }   from '../context/WatchlistContext';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { Search, Bell }   from 'lucide-react';

export default function Home() {
  const [movies, setMovies]       = useState<Movie[]>([]);
  const [loading, setLoading]     = useState(true);
  const [splash, setSplash]       = useState(false);
  const [searchOpen, setSearch]   = useState(false);
  const router = useRouter();
  const { watchlist } = useWatchlist();
  const { history, removeFromHistory } = useWatchHistory();

  useEffect(() => {
    if (!sessionStorage.getItem('mflix_seen')) { setSplash(true); sessionStorage.setItem('mflix_seen', '1'); }
    fetchAllMovies().then(d => { setMovies(d); setLoading(false); });
  }, []);

  const go = useCallback((m: Movie) => router.push(`/player/${m.movie_id}`), [router]);

  const feat     = useMemo(() => { const f = movies.filter(m => m.is_featured === 'Yes').slice(0,8); return f.length ? f : movies.slice(0,8); }, [movies]);
  const trending = useMemo(() => movies.filter(m => m.is_trending_now === 'Yes').slice(0,15), [movies]);
  const latest   = useMemo(() => [...movies].sort((a,b) => Number(b.year||0)-Number(a.year||0)).slice(0,15), [movies]);
  const bollywood= useMemo(() => movies.filter(m => m.industry?.toLowerCase().includes('bollywood')).slice(0,15), [movies]);
  const action   = useMemo(() => movies.filter(m => m.genre?.toLowerCase().includes('action')).slice(0,15), [movies]);
  const comedy   = useMemo(() => movies.filter(m => m.genre?.toLowerCase().includes('comedy')).slice(0,15), [movies]);
  const horror   = useMemo(() => movies.filter(m => m.genre?.toLowerCase().includes('horror')||m.genre?.toLowerCase().includes('thriller')).slice(0,15), [movies]);
  const romance  = useMemo(() => movies.filter(m => m.genre?.toLowerCase().includes('romance')).slice(0,15), [movies]);
  const uhd      = useMemo(() => movies.filter(m => m.quality_name?.includes('4K')||m.quality?.includes('4K')).slice(0,15), [movies]);
  const continueW= useMemo(() => history.map(h => h.movie), [history]);

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}
      {searchOpen && <SearchOverlay movies={movies} onClose={() => setSearch(false)} />}

      <div className="relative min-h-screen pb-28" style={{ background: 'var(--black)' }}>
        {/* ─── HEADER ─── */}
        <header className="fixed top-0 left-0 right-0 z-[60] px-4 py-3 flex items-center justify-between header-blur pointer-events-none">
          {/* Logo */}
          <div className="pointer-events-auto flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(145deg,#ff1744,#880e1f)', boxShadow: '0 4px 16px var(--red-glow)' }}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 8H2v12c0 1.1.9 2 2 2h12v-2H4V8zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 5v3.13L17.5 13l-2.5 1 .63-2.5L13 9.63V9h3v.5z" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '0.04em', color: 'var(--text-1)', textShadow: '0 0 20px rgba(255,23,68,0.3)' }}>
              MFLIX
            </span>
          </div>

          {/* Actions */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button onClick={() => setSearch(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Search size={17} style={{ color: 'var(--text-2)' }} />
            </button>
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Bell size={17} style={{ color: 'var(--text-2)' }} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full anim-pulse-glow" style={{ background: 'var(--red)' }} />
            </button>
            <button onClick={() => router.push('/profile')}
              className="w-9 h-9 rounded-full overflow-hidden active:scale-90 transition-transform"
              style={{ border: '2px solid rgba(255,23,68,0.5)', boxShadow: '0 0 12px rgba(255,23,68,0.2)' }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=mflix" className="w-full h-full object-cover" style={{ background: 'var(--card)' }} alt="P" />
            </button>
          </div>
        </header>

        {/* ─── CONTENT ─── */}
        {loading ? <HomePageSkeleton /> : (
          <main>
            <HeroBanner movies={feat} onMovieClick={go} />

            {/* Divider */}
            <div className="h-px mx-4 my-1" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />

            <div className="space-y-5 pt-4">
              {continueW.length > 0 && <MovieRow title="Continue Watching" emoji="▶" movies={continueW} onMovieClick={go} variant="landscape" showProgress accentColor="var(--cyan)" onRemove={removeFromHistory} />}
              {watchlist.length > 0  && <MovieRow title="My List" emoji="❤" movies={watchlist} onMovieClick={go} accentColor="var(--purple)" />}
              {trending.length > 0   && <MovieRow title="Trending Now" emoji="🔥" movies={trending} onMovieClick={go} genre="trending" accentColor="var(--red)" />}
                                         <MovieRow title="Latest Releases" emoji="⚡" movies={latest} onMovieClick={go} genre="latest" accentColor="var(--cyan)" />
              {bollywood.length > 0  && <MovieRow title="Bollywood" emoji="🎬" movies={bollywood} onMovieClick={go} genre="bollywood" accentColor="var(--gold)" />}
              {action.length > 0     && <MovieRow title="Action" emoji="💥" movies={action} onMovieClick={go} genre="action" accentColor="var(--red)" />}
              {comedy.length > 0     && <MovieRow title="Comedy" emoji="😂" movies={comedy} onMovieClick={go} genre="comedy" accentColor="var(--gold)" />}
              {horror.length > 0     && <MovieRow title="Horror & Thriller" emoji="👻" movies={horror} onMovieClick={go} genre="horror" accentColor="var(--purple)" />}
              {romance.length > 0    && <MovieRow title="Romance" emoji="💕" movies={romance} onMovieClick={go} genre="romance" accentColor="#ec4899" />}
              {uhd.length > 0        && <MovieRow title="4K Ultra HD" emoji="🎥" movies={uhd} onMovieClick={go} genre="4k" accentColor="var(--cyan)" />}
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center py-10 gap-2 opacity-30">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.06em' }}>MFLIX</span>
              <p style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Cinema · Redefined · v3.0</p>
            </div>
          </main>
        )}

        <ScrollToTop />
        <BottomNav onSearchOpen={() => setSearch(true)} />
      </div>
    </>
  );
}
