import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { ScanResult } from '../../App';
import { useApp } from '../../context/AppProvider';

interface HeroProps {
  onScanComplete: (result: ScanResult) => void;
}

export function Hero({ onScanComplete }: HeroProps) {
  const [email, setEmail] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const { t, lang, setLang } = useApp();
  const rightVisRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Subtle float animation for the data fragments
    gsap.to('.data-fragment', {
      y: 'random(-20, 20)',
      x: 'random(-10, 10)',
      rotation: 'random(-5, 5)',
      duration: 'random(3, 6)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2
    });
  }, { scope: rightVisRef });

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setScanning(true);
    setError('');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || t.error_server);
      }
      
      const data: ScanResult = await response.json();
      onScanComplete(data);
      
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || t.error_server);
    } finally {
      setScanning(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen pt-32 pb-20 px-6 lg:px-12 flex items-center justify-center bg-[var(--bg)] overflow-hidden">
      {/* Language Selector */}
      <div className="absolute top-24 right-6 md:right-12 flex gap-4 z-20">
        <button onClick={() => setLang('en')} className={`text-xs font-mono tracking-widest ${lang === 'en' ? 'text-accent' : 'text-white/50 hover:text-white'}`}>EN</button>
        <button onClick={() => setLang('ta')} className={`text-xs font-sans tracking-widest ${lang === 'ta' ? 'text-accent' : 'text-white/50 hover:text-white'}`}>தமிழ்</button>
        <button onClick={() => setLang('hi')} className={`text-xs font-sans tracking-widest ${lang === 'hi' ? 'text-accent' : 'text-white/50 hover:text-white'}`}>हिन्दी</button>
        <button onClick={() => setLang('kn')} className={`text-xs font-sans tracking-widest ${lang === 'kn' ? 'text-accent' : 'text-white/50 hover:text-white'}`}>ಕನ್ನಡ</button>
      </div>
      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* LEFT: Editorial Typography & Scanner */}
        <div className="lg:col-span-6 flex flex-col z-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-6 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-accent"></span>
            LeakLens Security
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] mb-6 text-[var(--fg)]">
            {t.hero_title_1} <span className="text-accent italic">{t.hero_title_2}</span>
          </h1>
          
          <p className="font-sans text-lg text-white/60 mb-12 max-w-lg leading-relaxed">
            {t.hero_subtitle}
          </p>

          <form onSubmit={handleScan} className="w-full max-w-md relative group flex flex-col gap-4">
            <div className="relative">
              <input 
                type="email" 
                placeholder={t.scan_placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 pb-4 pt-2 text-xl font-sans text-[var(--fg)] outline-none focus:border-accent transition-colors placeholder:text-white/30"
                required
                disabled={scanning}
              />
              {/* Optional elegant icon right inside the input area */}
              <div className="absolute right-0 bottom-4 text-white/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button 
                type="submit" 
                disabled={scanning}
                className="flex items-center gap-4 px-6 py-3 bg-[var(--fg)] text-[var(--bg)] rounded hover:bg-white/80 transition-colors font-sans font-semibold text-sm disabled:opacity-50"
              >
                {scanning ? t.scanning : t.scan_button} <span className="font-mono">&rarr;</span>
              </button>
            </div>
            
            {error && <p className="text-accent text-xs font-mono mt-4">{error}</p>}
          </form>
        </div>

        {/* RIGHT: Visual Scene (Digital Life) */}
        <div ref={rightVisRef} className="lg:col-span-6 relative h-[500px] lg:h-[700px] flex items-center justify-center">
          
          {/* Abstract Cyber/Tech Representation instead of an image */}
          <div className="relative z-0 w-[80%] h-[80%] rounded-2xl overflow-hidden border border-white/5 bg-black/40 flex items-center justify-center">
            {/* Glowing orb */}
            <div className="absolute w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-pulse"></div>
            
            {/* Concentric rings */}
            <div className="absolute w-full h-full flex items-center justify-center opacity-20">
              <div className="w-[40%] h-[40%] rounded-full border border-accent animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute w-[60%] h-[60%] rounded-full border border-white/50 animate-[spin_30s_linear_infinite_reverse]"></div>
              <div className="absolute w-[80%] h-[80%] rounded-full border border-white/20 border-dashed animate-[spin_40s_linear_infinite]"></div>
            </div>

            {/* Central node text */}
            <div className="z-10 font-mono text-xs text-white/50 tracking-widest text-center">
              <div className="text-accent mb-2">TARGET_ID: INDIA_NODE_01</div>
              <div>SCANNING DIGITAL FOOTPRINT...</div>
            </div>
            
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--bg)] via-transparent to-transparent opacity-80"></div>
          </div>

          {/* Floating Data Fragments */}
          <div className="data-fragment absolute top-[15%] left-[5%] bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] px-4 py-2 rounded text-[10px] font-mono text-white/80 shadow-2xl">
            [DATA: EMAIL]
          </div>
          <div className="data-fragment absolute top-[40%] -right-[5%] bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] px-4 py-2 rounded text-[10px] font-mono text-accent shadow-2xl">
            [DATA: PASSWORD]
          </div>
          <div className="data-fragment absolute bottom-[25%] left-[10%] bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] px-4 py-2 rounded text-[10px] font-mono text-white/80 shadow-2xl">
            [DATA: PHONE]
          </div>
          <div className="data-fragment absolute bottom-[10%] right-[15%] bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] px-4 py-2 rounded text-[10px] font-mono text-white/60 shadow-2xl">
            [DATA: LOCATION]
          </div>
          
          {/* Subtle network connection line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M10,20 Q50,50 90,80" stroke="var(--accent)" strokeWidth="0.2" fill="none" />
            <path d="M20,80 Q50,50 80,20" stroke="white" strokeWidth="0.1" fill="none" />
          </svg>
        </div>

      </div>
    </section>
  );
}
