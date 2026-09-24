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
  const { lang, setLang, theme, setTheme } = useApp()

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

        {/* Language & Theme Controls */}
        <div className="flex items-center gap-6">
          <div className="flex gap-4 mr-4">
            <button onClick={() => setLang('en')} className={`text-xs font-mono tracking-widest ${theme === 'india' || theme === 'night' ? 'text-white' : 'text-black'} ${lang === 'en' ? 'opacity-100 font-bold' : 'opacity-40 hover:opacity-80'}`}>EN</button>
            <button onClick={() => setLang('ta')} className={`text-xs font-sans tracking-widest ${theme === 'india' || theme === 'night' ? 'text-white' : 'text-black'} ${lang === 'ta' ? 'opacity-100 font-bold' : 'opacity-40 hover:opacity-80'}`}>தமிழ்</button>
            <button onClick={() => setLang('hi')} className={`text-xs font-sans tracking-widest ${theme === 'india' || theme === 'night' ? 'text-white' : 'text-black'} ${lang === 'hi' ? 'opacity-100 font-bold' : 'opacity-40 hover:opacity-80'}`}>हिन्दी</button>
          </div>
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
