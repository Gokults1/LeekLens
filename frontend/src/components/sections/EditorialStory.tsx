import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useApp } from '../../context/AppProvider';
import { IndiaNetwork } from './IndiaNetwork';

gsap.registerPlugin(ScrollTrigger);

export function EditorialStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useApp();

  useGSAP(() => {
    // Data flow cascade
    gsap.fromTo('.data-node',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.data-flow-section',
          start: 'top 80%',
          end: 'center center',
          scrub: true,
        }
      }
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      
      {/* SECTION 1: DATA FLOW */}
      <section className="data-flow-section relative w-full py-32 px-6 lg:px-12 bg-black/20">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
          <h3 className="font-sans text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed mb-20">
            {t.editorial.data_desc}
          </h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 w-full max-w-4xl font-mono text-xs tracking-widest text-white/60">
            <div className="data-node px-4 py-3 border border-white/10 rounded">EMAIL</div>
            <div className="hidden md:block w-8 h-[1px] bg-white/20"></div>
            <div className="data-node px-4 py-3 border border-white/10 rounded">SOCIAL</div>
            <div className="hidden md:block w-8 h-[1px] bg-white/20"></div>
            <div className="data-node px-4 py-3 border border-white/10 rounded">SHOPPING</div>
            <div className="hidden md:block w-8 h-[1px] bg-white/20"></div>
            <div className="data-node px-4 py-3 border border-white/10 rounded">BANKING</div>
            <div className="hidden md:block w-8 h-[1px] bg-white/20"></div>
            <div className="data-node px-4 py-3 border border-accent/30 text-accent rounded bg-accent/5">UNKNOWN SYSTEM</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INDIA NETWORK */}
      <section className="india-network relative w-full py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Left */}
          <div className="flex flex-col order-2 lg:order-1">
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-8">
              {t.editorial.nation_title_1}<br/>
              <span className="text-white/40">{t.editorial.nation_title_2}</span>
            </h2>
            <p className="font-sans text-lg text-white/60 max-w-md leading-relaxed">
              {t.editorial.nation_desc}
            </p>
          </div>

          {/* Map Right (Real SVG India Network) */}
          <div className="relative w-full aspect-square max-w-[600px] mx-auto lg:mx-0 lg:ml-auto order-1 lg:order-2">
            <IndiaNetwork />
          </div>
          
        </div>
      </section>

    </div>
  );
}
