import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { ScanResult } from '../../App';
import { useApp } from '../../context/AppProvider';

interface HeroProps {
  onScanComplete: (result: ScanResult) => void;
}

// Synthetic Sound Generator
const playSound = (type: 'scan' | 'safe' | 'alert') => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'scan') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'safe') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.5);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.5);
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(155, audioCtx.currentTime);
      osc2.connect(gain);
      osc2.start();
      osc2.stop(audioCtx.currentTime + 0.5);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    }
  } catch (e) {
    console.error("Audio not supported or blocked", e);
  }
};

export function Hero({ onScanComplete }: HeroProps) {
  const [email, setEmail] = useState('');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'safe' | 'breached'>('idle');
  const [error, setError] = useState('');
  const { t } = useApp();

  // Scroll animations
  const { scrollY } = useScroll();
  // As user scrolls from 0 to 400px down:
  const textY = useTransform(scrollY, [0, 400], [0, -100]); // Text moves up slightly (Parallax)
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]); // Text fades out early
  
  // Prism flies massively towards the camera and disappears
  const prismScale = useTransform(scrollY, [0, 400], [1, 5]);
  const prismOpacity = useTransform(scrollY, [200, 500], [1, 0]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setScanStatus('scanning');
    setError('');
    
    playSound('scan');
    const scanInterval = setInterval(() => playSound('scan'), 800);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify({ email }),
      });
      
      clearInterval(scanInterval);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || t.error_server);
      }
      
      const data: ScanResult = await response.json();
      
      const isBreached = data.breach_count > 0 || data.found === true;
      
      if (isBreached) {
        setScanStatus('breached');
        playSound('alert');
      } else {
        setScanStatus('safe');
        playSound('safe');
        
        // Trigger Confetti Explosion!
        confetti({
          particleCount: 200,
          spread: 160,
          origin: { y: 0.6 },
          colors: ['#4ade80', '#22c55e', '#ffffff', '#10b981'],
          disableForReducedMotion: true,
          zIndex: 9999
        });
      }
      
      onScanComplete(data);
      
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setScanStatus('idle'), 2000);
      }, 1500);
      
    } catch (err: any) {
      clearInterval(scanInterval);
      setError(err.message || t.error_server);
      setScanStatus('idle');
    }
  };

  const getGradientColors = () => {
    if (scanStatus === 'safe') return 'rgba(34,197,94,0.8), rgba(167,243,208,0.9), rgba(52,211,153,0.8)';
    if (scanStatus === 'breached') return 'rgba(239,68,68,0.8), rgba(220,38,38,0.9), rgba(153,27,27,0.8)';
    return 'rgba(255,50,50,0.8), rgba(255,150,0,0.9), rgba(0,200,255,0.8)';
  };

  return (
    <section className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black z-10 opacity-60"></div>
        
        <motion.div 
          animate={{ 
            rotate: scanStatus === 'scanning' ? [0, 360] : [15, 20, 15],
            scale: scanStatus === 'safe' ? [1, 1.5, 1] : scanStatus === 'breached' ? [1, 1.2, 0.9, 1.1] : [1, 1.1, 1]
          }}
          transition={{ 
            duration: scanStatus === 'scanning' ? 2 : 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[300px] blur-[120px] opacity-70 transition-colors duration-1000"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${getGradientColors()}, transparent 100%)`
          }}
        />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>



      {/* Main Content Container - Affected by Scroll */}
      <motion.div 
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-20 flex flex-col items-center w-full max-w-5xl px-6 text-center mt-20"
      >
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-mono text-xs uppercase tracking-[0.4em] text-white/50 mb-8"
        >
          AI-Powered Security
        </motion.p>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[110px] leading-[1.1] text-white tracking-tight font-['Playfair_Display']"
        >
          {t.hero_title_1}<br />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-white transition-colors duration-500" style={{
            backgroundImage: scanStatus === 'safe' ? 'linear-gradient(to right, #4ade80, #ffffff)' : 
                             scanStatus === 'breached' ? 'linear-gradient(to right, #f87171, #ffffff)' : 
                             'linear-gradient(to right, #fed7aa, #ffffff)'
          }}>
            {t.hero_title_2}
          </span>
        </motion.h1>

        {/* Center 3D Prism Object - Scaled heavily on scroll */}
        <motion.div 
          style={{ scale: prismScale, opacity: prismOpacity }}
          className="relative my-20 w-32 h-32 md:w-48 md:h-48 flex items-center justify-center z-40 pointer-events-none"
        >
          <AnimatePresence>
            {scanStatus === 'safe' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0, scale: 2 }}
                className="absolute text-green-400 font-mono font-bold text-2xl z-50 drop-shadow-[0_0_20px_rgba(74,222,128,1)]"
              >
                SECURE
              </motion.div>
            )}
            {scanStatus === 'breached' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0, scale: 2 }}
                className="absolute text-red-500 font-mono font-bold text-2xl z-50 drop-shadow-[0_0_20px_rgba(248,113,113,1)]"
              >
                BREACHED
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            animate={
              scanStatus === 'scanning' ? { rotateX: 360, rotateY: 360, rotateZ: 360 } :
              scanStatus === 'safe' ? { scale: [1, 1.2, 1], rotateZ: [0, 180] } :
              scanStatus === 'breached' ? { x: [-10, 10, -10, 10, 0], filter: "hue-rotate(90deg)" } :
              { rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, 180] }
            }
            transition={{ 
              duration: scanStatus === 'scanning' ? 1 : scanStatus === 'safe' ? 1 : scanStatus === 'breached' ? 0.4 : 20, 
              repeat: scanStatus === 'breached' ? 3 : Infinity, 
              ease: "linear" 
            }}
            className="absolute inset-0 w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className={`absolute inset-0 border backdrop-blur-2xl transition-colors duration-500 ${
              scanStatus === 'safe' ? 'border-green-400/80 bg-green-500/20 shadow-[0_0_80px_rgba(74,222,128,0.5)]' :
              scanStatus === 'breached' ? 'border-red-500/80 bg-red-600/20 shadow-[0_0_80px_rgba(248,113,113,0.5)]' :
              'border-white/40 bg-white/5 shadow-[0_0_50px_rgba(255,255,255,0.2)]'
            }`} style={{ transform: 'rotateZ(45deg)' }}></div>
            <div className="absolute inset-4 border border-white/20 bg-black/40 backdrop-blur-xl" style={{ transform: 'rotateZ(45deg) translateZ(20px)' }}></div>
          </motion.div>
          <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_20px_10px_rgba(255,255,255,0.8)] z-10 animate-pulse"></div>
        </motion.div>

        {/* Sleek Scanner Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={scanStatus === 'breached' ? { x: [-15, 15, -15, 15, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0, x: 0 }}
          transition={{ duration: scanStatus === 'breached' ? 0.4 : 1, delay: scanStatus === 'breached' ? 0 : 1 }}
          onSubmit={handleScan} 
          className="w-full max-w-md relative z-30"
        >
          <div className={`relative flex items-center p-2 rounded-full border bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-500 ${
            scanStatus === 'safe' ? 'border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.3)]' :
            scanStatus === 'breached' ? 'border-red-500 shadow-[0_0_30px_rgba(248,113,113,0.3)]' :
            'border-white/20 focus-within:border-white/50 focus-within:bg-white/10'
          }`}>
            <input 
              type="email" 
              placeholder={t.scan_placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent px-6 py-3 text-white font-sans text-lg outline-none placeholder:text-white/40"
              required
              disabled={scanStatus === 'scanning'}
            />
            <button 
              type="submit" 
              disabled={scanStatus === 'scanning'}
              className="ml-2 px-8 py-3 bg-white text-black rounded-full font-semibold text-sm tracking-wide hover:bg-gray-200 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {scanStatus === 'scanning' ? t.scanning : t.scan_button}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs font-mono mt-4 absolute w-full text-center">{error}</p>}
        </motion.form>

      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 z-20 flex flex-col items-center gap-2 opacity-50 pointer-events-none"
      >
        <span className="text-[10px] uppercase font-mono tracking-widest text-white">Scroll Down</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
}
