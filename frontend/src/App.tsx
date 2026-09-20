import { useState } from 'react'
import { Hero } from './components/sections/Hero'
import { EditorialStory } from './components/sections/EditorialStory'
import { BottomScanner } from './components/sections/BottomScanner'
import { ResultsDashboard } from './components/sections/ResultsDashboard'
import { Footer } from './components/sections/Footer'
import { useApp } from './context/AppProvider'

export interface ScanResult {
  email: string
  found: boolean
  risk: { level: string, score: number }
  breach_count: number
  breaches: Array<{
    name: string
    title: string
    domain: string
    breach_date: string
    added_date: string
    affected_accounts: number
    data_classes: string[]
    description: string
    verified: boolean
  }>
  exposed_data_summary: string[]
  recommendations: string[]
}

function App() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const { t, theme, setTheme } = useApp()

  const toggleTheme = () => {
    if (theme === 'india') setTheme('night');
    else if (theme === 'night') setTheme('terminal');
    else setTheme('india');
  };

  return (
    <>
      <div className="noise-overlay" />
      
      {/* Global Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 lg:px-12 py-6 flex justify-between items-center text-foreground bg-transparent pointer-events-auto mix-blend-difference">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="text-xl md:text-2xl font-heading font-bold tracking-widest uppercase">
            LEAKLENS
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-12 text-[10px] font-mono uppercase tracking-[0.2em] text-white/70">
          <a href="#" className="hover:text-white transition-colors">{t.nav_how_it_works}</a>
          <a href="#" className="hover:text-white transition-colors">{t.nav_security}</a>
          <a href="#" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('bottom-scanner')?.scrollIntoView({ behavior: 'smooth' }) }}>{t.nav_scan_now}</a>
        </div>

        {/* CTA & Theme */}
        <div className="flex items-center gap-6">
          <button onClick={toggleTheme} className="text-xs hover:opacity-80 transition-opacity">
            {theme === 'india' ? '🇮🇳' : theme === 'night' ? '🌙' : '💻'}
          </button>
        </div>
      </nav>

      <main className="relative w-full flex flex-col min-h-screen">
        <Hero onScanComplete={setScanResult} />
        
        {scanResult && <ResultsDashboard result={scanResult} />}
        
        <EditorialStory />

        <div id="bottom-scanner">
          <BottomScanner onScanComplete={setScanResult} />
        </div>
      </main>

      <Footer />
    </>
  )
}

export default App
