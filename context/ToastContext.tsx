'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
type T = 'success'|'error'|'info'|'warning';
interface Toast { id:string; message:string; type:T; }
interface Ctx { showToast:(msg:string,type?:T)=>void; }
const Ctx = createContext<Ctx>({showToast:()=>{}});
export const useToast = () => useContext(Ctx);

export const ToastProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message:string, type:T='success') => {
    const id = Date.now().toString();
    setToasts(p => [...p.slice(-2), {id,message,type}]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);

  const styles: Record<T,{bg:string,border:string,dot:string}> = {
    success: { bg:'rgba(0,230,118,0.1)',  border:'rgba(0,230,118,0.25)',  dot:'var(--green)' },
    error:   { bg:'rgba(255,23,68,0.12)', border:'rgba(255,23,68,0.3)',   dot:'var(--red)' },
    info:    { bg:'rgba(0,229,255,0.1)',  border:'rgba(0,229,255,0.25)',  dot:'var(--cyan)' },
    warning: { bg:'rgba(255,179,0,0.1)', border:'rgba(255,179,0,0.25)',  dot:'var(--gold)' },
  };

  return (
    <Ctx.Provider value={{showToast}}>
      {children}
      <div className="fixed top-16 left-0 right-0 z-[999] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((t,i) => {
          const s = styles[t.type];
          return (
            <div key={t.id} className="anim-slide-down w-full max-w-sm flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: s.bg, border: `1px solid ${s.border}`, backdropFilter:'blur(20px)', boxShadow:'0 8px 32px rgba(0,0,0,0.4)', animationDelay:`${i*40}ms` }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.dot, boxShadow:`0 0 8px ${s.dot}` }} />
              <span style={{ fontSize:13, fontWeight:700, color:'var(--text-1)' }}>{t.message}</span>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
};
