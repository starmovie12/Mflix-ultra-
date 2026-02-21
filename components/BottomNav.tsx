'use client';
import React from 'react';
import { Home, Search, Grid2X2, Heart, User } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useRouter, usePathname } from 'next/navigation';

interface BottomNavProps { onSearchOpen: () => void; }

export const BottomNav: React.FC<BottomNavProps> = ({ onSearchOpen }) => {
  const { watchlist } = useWatchlist();
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: 'home',       Icon: Home,      label: 'Home',    action: () => router.push('/') },
    { id: 'search',     Icon: Search,    label: 'Search',  action: onSearchOpen },
    { id: 'categories', Icon: Grid2X2,   label: 'Browse',  action: () => router.push('/category/all') },
    { id: 'list',       Icon: Heart,     label: 'My List', action: () => router.push('/profile'), badge: watchlist.length },
    { id: 'profile',    Icon: User,      label: 'Profile', action: () => router.push('/profile') },
  ];

  const active = pathname === '/' ? 'home' : pathname.startsWith('/category') ? 'categories' : pathname.startsWith('/profile') ? 'profile' : '';

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md" style={{ transform: 'translateX(-50%)' }}>
      <nav className="bottom-nav flex items-center justify-around px-1 py-2">
        {tabs.map(({ id, Icon, label, action, badge }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={action}
              className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-250 active:scale-88"
              style={{
                background: isActive ? 'rgba(255,23,68,0.12)' : 'transparent',
                transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
              }}>
              <div className="relative">
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.2 : 1.6}
                  style={{
                    color: isActive ? 'var(--red)' : 'var(--text-3)',
                    filter: isActive ? 'drop-shadow(0 0 6px var(--red-glow))' : 'none',
                    transition: 'all 0.25s ease',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
                {badge && badge > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{ background: 'var(--red)', fontSize: 8, fontWeight: 900, boxShadow: '0 0 8px var(--red-glow)' }}>
                    {badge > 9 ? '9+' : badge}
                  </span>
                ) : null}
              </div>
              {isActive && (
                <span style={{ fontSize: 8, fontWeight: 800, color: 'var(--red)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
