'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Clock, Film, Settings, Trash2, Info, Star, ChevronRight, Moon, Bell, Globe, Zap } from 'lucide-react';
import { useWatchlist } from '../../context/WatchlistContext';
import { useWatchHistory } from '../../hooks/useWatchHistory';
import { MovieCard } from '../../components/MovieCard';
import { BottomNav } from '../../components/BottomNav';
import { SearchOverlay } from '../../components/SearchOverlay';
import { useToast } from '../../context/ToastContext';
import { fetchAllMovies } from '../../services/firebaseService';

export default function ProfilePage() {
  const router = useRouter();
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { history, clearHistory } = useWatchHistory();
  const { showToast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'history' | 'settings'>('list');
  const [movies, setMovies] = useState<any[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);
  const [quality, setQuality] = useState('Auto');
  const [autoplay, setAutoplay] = useState(true);
  const [language, setLanguage] = useState('Hindi');

  React.useEffect(() => {
    fetchAllMovies().then(setMovies);
  }, []);

  const totalMinutes = history.reduce((acc, h) => {
    const r = h.movie.runtime || '0';
    const match = String(r).match(/(\d+)h\s*(\d+)?m?/);
    if (match) return acc + (parseInt(match[1]) * 60) + (parseInt(match[2] || '0'));
    const mins = parseInt(String(r));
    return acc + (isNaN(mins) ? 0 : mins);
  }, 0);

  const hoursWatched = Math.floor(totalMinutes / 60);

  return (
    <>
      {searchOpen && <SearchOverlay movies={movies} onClose={() => setSearchOpen(false)} />}
      <div className="min-h-screen bg-[#030812] text-white pb-28">

        {/* Header */}
        <div className="px-4 pt-14 pb-6 bg-gradient-to-b from-[#111827] to-transparent">
          <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-white/40 text-sm font-bold active:scale-95 transition-transform">
            <ArrowLeft size={16} /> Back
          </button>

          {/* Profile Card */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-red-600/60 shadow-xl shadow-red-900/30">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=mflix-premium" className="w-full h-full object-cover bg-[#111827]" alt="Avatar" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-[#030812]">
                <Star size={10} fill="white" className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-[900] tracking-tight">Guest User</h2>
              <p className="text-white/40 text-sm font-medium">Premium Member</p>
              <div className="mt-1 px-2 py-0.5 bg-gradient-to-r from-red-600/30 to-purple-600/30 rounded-full border border-red-600/30 inline-block">
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">MFLIX PRO</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: <Film size={18} className="text-red-400" />, value: history.length, label: 'Watched' },
              { icon: <Heart size={18} className="text-pink-400" />, value: watchlist.length, label: 'My List' },
              { icon: <Clock size={18} className="text-cyan-400" />, value: `${hoursWatched}h`, label: 'Hours' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 rounded-2xl p-3 flex flex-col items-center gap-1 border border-white/8">
                {stat.icon}
                <span className="text-lg font-[900] text-white">{stat.value}</span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 mb-4 bg-white/5 mx-4 rounded-2xl p-1">
          {[
            { id: 'list', label: '❤ My List' },
            { id: 'history', label: '▶ History' },
            { id: 'settings', label: '⚙ Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg' : 'text-white/40'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="px-4">

          {/* My List */}
          {activeTab === 'list' && (
            watchlist.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <Heart size={48} className="text-white/10" />
                <p className="text-white/40 font-bold">Your list is empty</p>
                <p className="text-white/20 text-sm text-center">Tap the + button on any movie to add it here</p>
                <button onClick={() => router.push('/')} className="mt-3 bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider active:scale-95 transition-transform">
                  Browse Movies
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {watchlist.map(movie => (
                  <MovieCard key={movie.movie_id} movie={movie} onClick={m => router.push(`/player/${m.movie_id}`)} />
                ))}
              </div>
            )
          )}

          {/* History */}
          {activeTab === 'history' && (
            history.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <Clock size={48} className="text-white/10" />
                <p className="text-white/40 font-bold">No watch history</p>
                <p className="text-white/20 text-sm">Movies you watch will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-end mb-2">
                  <button onClick={() => setConfirmClear(true)} className="text-red-500 text-xs font-bold flex items-center gap-1">
                    <Trash2 size={12} /> Clear All
                  </button>
                </div>
                {history.map(item => (
                  <div key={item.movie.movie_id} onClick={() => router.push(`/player/${item.movie.movie_id}`)} className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/8 cursor-pointer active:scale-[0.98] transition-transform">
                    <img src={item.movie.poster} alt={item.movie.title} className="w-14 h-20 object-cover rounded-xl flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/f/60/80'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-white truncate">{item.movie.title}</p>
                      <p className="text-xs text-white/40 mt-0.5">{item.movie.year} • {item.movie.genre?.split(',')[0]}</p>
                      <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full" style={{ width: `${Math.min(item.progress, 100)}%` }} />
                      </div>
                      <p className="text-[10px] text-white/30 mt-1">{Math.round(item.progress)}% watched</p>
                    </div>
                    <ChevronRight size={16} className="text-white/20 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-2">
              {[
                {
                  icon: <Zap size={18} className="text-cyan-400" />,
                  label: 'Video Quality',
                  value: quality,
                  action: () => {
                    const opts = ['Auto', '4K', '1080p', '720p', '480p'];
                    setQuality(opts[(opts.indexOf(quality) + 1) % opts.length]);
                  },
                  type: 'cycle'
                },
                {
                  icon: <Moon size={18} className="text-purple-400" />,
                  label: 'Autoplay Next',
                  value: autoplay,
                  action: () => setAutoplay(!autoplay),
                  type: 'toggle'
                },
                {
                  icon: <Bell size={18} className="text-yellow-400" />,
                  label: 'Notifications',
                  value: true,
                  action: () => showToast('Notifications setting saved', 'success'),
                  type: 'toggle'
                },
                {
                  icon: <Globe size={18} className="text-green-400" />,
                  label: 'Language',
                  value: language,
                  action: () => setLanguage(language === 'Hindi' ? 'English' : 'Hindi'),
                  type: 'cycle'
                },
              ].map(setting => (
                <button key={setting.label} onClick={setting.action} className="w-full flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/8 active:scale-[0.98] transition-transform">
                  {setting.icon}
                  <span className="flex-1 text-sm font-bold text-left">{setting.label}</span>
                  {setting.type === 'toggle' ? (
                    <div className={`w-11 h-6 rounded-full transition-colors ${setting.value ? 'bg-red-600' : 'bg-white/10'} flex items-center ${setting.value ? 'justify-end' : 'justify-start'} px-1`}>
                      <div className="w-4 h-4 bg-white rounded-full shadow" />
                    </div>
                  ) : (
                    <span className="text-xs font-black text-white/40 bg-white/8 px-3 py-1 rounded-full">{String(setting.value)}</span>
                  )}
                </button>
              ))}

              {/* Danger Zone */}
              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest px-1">Danger Zone</p>
                <button
                  onClick={() => setConfirmClear(true)}
                  className="w-full flex items-center gap-3 bg-red-900/20 rounded-2xl p-4 border border-red-900/30 active:scale-[0.98] transition-transform"
                >
                  <Trash2 size={18} className="text-red-400" />
                  <span className="flex-1 text-sm font-bold text-left text-red-400">Clear Watch History</span>
                  <ChevronRight size={16} className="text-red-400/40" />
                </button>
              </div>

              {/* App Info */}
              <div className="mt-6 flex flex-col items-center gap-1 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-800 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
                  </div>
                  <span className="text-white font-[900] italic uppercase">MFLIX</span>
                </div>
                <p className="text-white/20 text-xs">Version 2.0 • Cinema. Redefined.</p>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Clear Dialog */}
        {confirmClear && (
          <div className="fixed inset-0 z-[300] bg-black/80 flex items-end justify-center pb-10 px-4">
            <div className="w-full max-w-sm bg-[#111827] rounded-3xl p-6 border border-white/10 animate-scaleIn">
              <h3 className="text-lg font-[900] text-white mb-2">Clear History?</h3>
              <p className="text-white/50 text-sm mb-6">This will remove all your watch history. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmClear(false)} className="flex-1 h-12 bg-white/10 rounded-2xl font-bold text-sm active:scale-95 transition-transform">
                  Cancel
                </button>
                <button
                  onClick={() => { clearHistory(); setConfirmClear(false); showToast('Watch history cleared', 'info'); }}
                  className="flex-1 h-12 bg-red-600 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        <BottomNav onSearchOpen={() => setSearchOpen(true)} />
      </div>
    </>
  );
}
