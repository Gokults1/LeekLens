import { useState } from 'react';
import type { ScanResult } from '../../App';
import { useApp } from '../../context/AppProvider';

interface BottomScannerProps {
  onScanComplete: (result: ScanResult) => void;
}

export function BottomScanner({ onScanComplete }: BottomScannerProps) {
  const [email, setEmail] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanState, setScanState] = useState('');
  const [error, setError] = useState('');
  const { t } = useApp();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setScanning(true);
    setError('');
    
    // Simulate UI progress states
    setScanState('ANALYZING EMAIL...');
    
    setTimeout(() => setScanState('CHECKING EXPOSURE...'), 800);
    setTimeout(() => setScanState('MATCHING BREACH DATA...'), 1600);
    setTimeout(() => setScanState('BUILDING RISK PROFILE...'), 2400);

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
      setScanState('');
    }
  };

  return (
    <section className="relative w-full py-32 px-6 lg:px-12 bg-black/40 border-t border-white/5 flex flex-col items-center text-center">
      <div className="max-w-3xl w-full">
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12">
          {t.editorial.bottom_title_1} <br/>
          <span className="text-white/40 italic">{t.editorial.bottom_title_2}</span>
        </h2>
        
        <form onSubmit={handleScan} className="w-full max-w-xl mx-auto flex flex-col gap-8">
          <input 
            type="email" 
            placeholder={t.scan_placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b-2 border-white/20 pb-4 text-2xl font-sans text-center outline-none focus:border-accent transition-colors placeholder:text-white/20"
            required
            disabled={scanning}
          />
          
          <button 
            type="submit" 
            disabled={scanning}
            className="mx-auto flex items-center justify-center px-8 py-4 bg-accent text-[var(--bg)] font-sans font-bold text-sm tracking-wide rounded hover:bg-white transition-colors disabled:opacity-50"
          >
            {scanning ? 'SCANNING...' : 'SCAN EXPOSURE'} <span className="ml-3 font-mono">&rarr;</span>
          </button>
        </form>

        {error && <p className="text-accent text-xs font-mono mt-8">{error}</p>}

        {scanning && (
          <div className="mt-12 w-full max-w-sm mx-auto flex flex-col items-center">
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-accent animate-[slide_1s_ease-in-out_infinite_alternate]" />
            </div>
            <div className="font-mono text-xs tracking-widest text-white/50 mt-4 animate-pulse">
              {scanState}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
