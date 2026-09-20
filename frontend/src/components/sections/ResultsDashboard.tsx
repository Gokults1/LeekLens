import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import type { ScanResult } from '../../App';
import { useApp } from '../../context/AppProvider';

interface ResultsDashboardProps {
  result: ScanResult;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const container = useRef<HTMLDivElement>(null);
  const { t } = useApp();

  useEffect(() => {
    if (container.current) {
      gsap.fromTo(container.current.querySelectorAll('.result-anim'), 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.05,
          duration: 0.6,
          ease: "power2.out"
        }
      );
    }
  }, [result]);

  return (
    <section id="results-section" ref={container} className="relative w-full py-24 bg-[var(--bg)] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Editorial Header */}
        <div className="result-anim border-b border-white/10 pb-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 mb-4">
              {t.editorial.security_report} / {result.email}
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-[var(--fg)]">
              {result.found ? `${result.breach_count} ${t.editorial.exposures}` : t.editorial.no_exposures}
            </h2>
          </div>
          <div className="flex flex-col md:items-end">
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-2">{t.editorial.risk_score}</div>
            <div className={`text-6xl font-sans font-light tracking-tighter ${result.risk.level === 'LOW' ? 'text-green-500' : 'text-accent'}`}>
              {result.risk.score}<span className="text-xl text-white/20">/100</span>
            </div>
            <div className={`mt-2 font-mono text-xs px-3 py-1 border ${result.risk.level === 'LOW' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 'border-accent/30 text-accent bg-accent/5'}`}>
              {result.risk.level} {t.editorial.risk}
            </div>
          </div>
        </div>

        {!result.found && (
          <div className="result-anim py-12 text-center text-white/50 font-sans text-lg">
            {t.results_no_breaches}
          </div>
        )}

        {result.found && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Timeline Column */}
            <div className="lg:col-span-8">
              <h3 className="result-anim font-mono text-xs uppercase tracking-widest text-white/40 mb-8 pb-4 border-b border-white/5">
                {t.results_timeline}
              </h3>
              
              <div className="flex flex-col gap-8">
                {result.breaches.map((breach, idx) => (
                  <div key={idx} className="result-anim group flex flex-col md:flex-row gap-6 md:gap-12 pb-8 border-b border-white/5">
                    {/* Metadata Left */}
                    <div className="w-full md:w-32 flex-shrink-0 font-mono">
                      <div className="text-accent text-sm">{breach.breach_date}</div>
                      <div className="text-white/30 text-[10px] mt-1">{breach.domain}</div>
                    </div>
                    {/* Content Right */}
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between mb-2">
                        <h4 className="font-heading text-2xl text-[var(--fg)]">{breach.name}</h4>
                        <span className="font-mono text-[10px] text-white/40">{breach.affected_accounts.toLocaleString()} {t.editorial.accounts}</span>
                      </div>
                      
                      {breach.description && (
                        <p className="font-sans text-sm text-white/60 leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all" dangerouslySetInnerHTML={{ __html: breach.description }}></p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {breach.data_classes.map((cls, i) => {
                          const clsKey = cls.toLowerCase().replace(/ /g, '_') as keyof typeof t.dynamic;
                          const translatedCls = t.dynamic[clsKey] || cls;
                          return (
                            <span key={i} className="font-mono text-[9px] px-2 py-1 bg-white/5 border border-white/10 text-white/70">
                              {translatedCls}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations Column */}
            <div className="lg:col-span-4">
              <h3 className="result-anim font-mono text-xs uppercase tracking-widest text-white/40 mb-8 pb-4 border-b border-white/5">
                {t.results_recommendations}
              </h3>
              <div className="flex flex-col gap-4">
                {result.recommendations.map((rec, idx) => {
                  let recKey = '';
                  if (rec.includes('passwords')) recKey = 'rec_pass';
                  else if (rec.includes('Two-Factor')) recKey = 'rec_2fa';
                  else if (rec.includes('suspicious')) recKey = 'rec_mon';
                  else if (rec.includes('phishing')) recKey = 'rec_phish';
                  else if (rec.includes('bank')) recKey = 'rec_fin';
                  
                  const translatedRec = recKey ? t.dynamic[recKey as keyof typeof t.dynamic] : rec;
                  
                  return (
                    <div key={idx} className="result-anim flex gap-4 p-5 bg-[var(--card-bg)] border border-[var(--card-border)]">
                      <div className="font-mono text-accent text-sm opacity-50">
                        {(idx + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="font-sans text-sm text-[var(--fg)] leading-relaxed">
                        {translatedRec}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
