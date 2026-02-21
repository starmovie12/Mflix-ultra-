'use client';
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
export const ScrollToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 350);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({top:0,behavior:'smooth'})}
      className="fixed bottom-24 right-4 z-40 w-11 h-11 rounded-2xl flex items-center justify-center active:scale-90 transition-all anim-scale-in"
      style={{ background:'linear-gradient(145deg,#ff1744,#880e1f)', boxShadow:'0 4px 20px var(--red-glow)', border:'1px solid rgba(255,255,255,0.12)' }}>
      <ChevronUp size={20} color="white" strokeWidth={2.5} />
    </button>
  );
};
