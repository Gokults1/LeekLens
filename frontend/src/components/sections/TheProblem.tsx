import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function TheProblem() {
  const container = useRef<HTMLDivElement>(null);
  const dataCardsRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Parallax on the 3D data cards container
    gsap.fromTo(dataCardsRef.current, 
      { y: 100, rotateX: 10, rotateY: -15 },
      {
        y: -50,
        rotateX: 5,
        rotateY: -20,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );

    // Staggered fade in for text elements
    gsap.fromTo('.problem-text',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 60%",
        }
      }
    )

  }, { scope: container });

  return (
    <section ref={container} className="relative w-full min-h-screen bg-background text-foreground overflow-hidden flex items-center pt-24 pb-32">
      
      {/* Background abstract world map/grid placeholder */}
      <div className="absolute inset-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #ff4a5a 0%, transparent 40%)' }} />

      <div className="max-w-[1400px] w-full mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center max-w-lg">
          <div className="problem-text font-mono text-[10px] text-white/50 tracking-widest uppercase mb-8 flex items-center gap-4">
            <div className="w-0.5 h-3 bg-accent" /> THE PROBLEM
          </div>
          
          <h2 className="problem-text text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] mb-8">
            Your Data<br/>
            Travels Farther<br/>
            <span className="text-accent">Than You Think.</span>
          </h2>
          
          <p className="problem-text font-sans text-white/70 mb-10 leading-relaxed text-sm md:text-base">
            From social media to shopping, education to banking — your information leaves a digital trail. Sometimes, it ends up in the <span className="text-white font-semibold">wrong</span> hands.
          </p>
          
          <div className="problem-text">
            <button className="px-6 py-3 rounded-full border border-white/20 text-white text-xs font-sans font-semibold tracking-wide hover:bg-white hover:text-black transition-colors flex items-center gap-4">
              See the Risks <span className="font-mono text-lg leading-none">&rarr;</span>
            </button>
          </div>

          {/* Bottom Left phone overlay */}
          <div className="mt-24 relative w-64 h-32 border-t-4 border-l-4 border-r-4 border-white/10 rounded-t-3xl bg-gradient-to-t from-background to-white/5 flex items-end p-6">
             <div className="font-mono text-accent text-xs">
                <span className="opacity-70">Different apps.</span><br/>
                <span className="font-bold">Same risk.</span>
             </div>
          </div>
        </div>

        {/* Right Column - 3D Data Cards Graphic */}
        <div className="relative flex items-center justify-center lg:justify-end h-full min-h-[500px]">
          
          {/* Handwritten text */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 font-handwriting text-3xl text-white/50 rotate-[-5deg] z-20">
            Data<br/>has no<br/>borders.
          </div>

          {/* 3D Container */}
          <div 
            ref={dataCardsRef}
            className="relative w-full max-w-md h-96 flex flex-col gap-3"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            {/* We create multiple translucent stacked panels to simulate the graphic */}
            
            {/* Back ambient panel */}
            <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg -translate-z-12 blur-sm" />
            
            {/* The List of Data Points */}
            <div className="relative z-10 w-4/5 ml-auto bg-background/80 backdrop-blur-xl border border-white/10 rounded-lg p-6 flex flex-col gap-4 shadow-2xl" style={{ transform: 'translateZ(50px)' }}>
              
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/50">@</div>
                <span className="font-sans text-sm text-white/80">Email addresses</span>
              </div>
              
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/50">*</div>
                <span className="font-sans text-sm text-white/80">Passwords</span>
              </div>
              
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/50">#</div>
                <span className="font-sans text-sm text-white/80">Phone numbers</span>
              </div>
              
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/50">?</div>
                <span className="font-sans text-sm text-white/80">Personal details</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/50">$</div>
                <span className="font-sans text-sm text-white/80">Financial information</span>
              </div>

            </div>

            {/* Floating abstract decorative panels */}
            <div className="absolute -left-12 top-1/4 w-32 h-48 bg-accent/5 border border-accent/20 rounded-lg backdrop-blur-md" style={{ transform: 'translateZ(100px)' }} />
            <div className="absolute -bottom-8 right-12 w-48 h-24 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md" style={{ transform: 'translateZ(80px)' }} />

          </div>
        </div>

      </div>

      <div className="absolute bottom-8 right-12 text-right">
         <p className="font-sans text-[10px] text-white/40 leading-relaxed">
           Be aware.<br/>Stay in control.<br/>A safer you. A safer India.
         </p>
      </div>
    </section>
  );
}
