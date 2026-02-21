'use client';
import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
export const NetworkStatus = () => {
  const [online, setOnline]   = useState(true);
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    const on  = () => { setOnline(true);  setRestored(true);  setTimeout(()=>setRestored(false),3000); };
    const off = () => { setOnline(false); setRestored(false); };
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online',on); window.removeEventListener('offline',off); };
  }, []);
  if (online && !restored) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[600] flex items-center justify-center gap-2 py-2 text-xs font-bold tracking-widest uppercase anim-slide-down"
      style={{ background: !online ? 'var(--red)' : 'var(--green)', boxShadow:`0 2px 20px ${!online?'var(--red-glow)':'rgba(0,230,118,0.3)'}` }}>
      {!online ? <WifiOff size={13} /> : <Wifi size={13} />}
      {!online ? 'You are offline' : 'Connection restored'}
    </div>
  );
};
