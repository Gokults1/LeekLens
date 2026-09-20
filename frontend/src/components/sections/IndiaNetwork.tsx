import { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import India from '@svg-maps/india';

gsap.registerPlugin(ScrollTrigger);

export function IndiaNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Map nodes matching the requested cities based on estimated 612x696 viewBox
  const nodes = useMemo(() => [
    { id: 'delhi', name: 'DELHI', cx: 193, cy: 199, important: true },
    { id: 'mumbai', name: 'MUMBAI', cx: 100, cy: 432, important: true },
    { id: 'pune', name: 'PUNE', cx: 121, cy: 444, important: false },
    { id: 'hyderabad', name: 'HYDERABAD', cx: 218, cy: 472, important: true },
    { id: 'bengaluru', name: 'BENGALURU', cx: 199, cy: 578, important: true },
    { id: 'chennai', name: 'CHENNAI', cx: 256, cy: 576, important: true },
    { id: 'coimbatore', name: 'COIMBATORE', cx: 186, cy: 624, important: false },
    { id: 'kolkata', name: 'KOLKATA', cx: 426, cy: 348, important: true },
  ], []);

  // Network connections
  const connections = useMemo(() => [
    { from: 'delhi', to: 'mumbai' },
    { from: 'mumbai', to: 'pune' },
    { from: 'pune', to: 'bengaluru' },
    { from: 'mumbai', to: 'hyderabad' },
    { from: 'delhi', to: 'hyderabad' },
    { from: 'hyderabad', to: 'bengaluru' },
    { from: 'bengaluru', to: 'coimbatore' },
    { from: 'bengaluru', to: 'chennai' },
    { from: 'chennai', to: 'hyderabad' },
    { from: 'hyderabad', to: 'kolkata' },
    { from: 'kolkata', to: 'delhi' },
  ], []);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        end: 'center center',
        scrub: true,
      }
    });

    // 1. Map outline fades in
    tl.fromTo('.in-map-path', 
      { opacity: 0, strokeDasharray: 2000, strokeDashoffset: 2000 },
      { opacity: 0.15, strokeDashoffset: 0, duration: 2 }
    );

    // 2. Nodes appear
    tl.fromTo('.in-node-dot', 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, stagger: 0.1 },
      '-=1'
    );
    tl.fromTo('.in-node-label',
      { opacity: 0, x: -5 },
      { opacity: 1, x: 0, duration: 1, stagger: 0.1 },
      '-=1'
    );

    // 3. Connections draw
    tl.fromTo('.in-connection', 
      { strokeDasharray: 1000, strokeDashoffset: 1000 },
      { strokeDashoffset: 0, duration: 1.5, stagger: 0.1 },
      '-=0.5'
    );

    // Constant pulsing of important nodes (not scroll dependent)
    gsap.to('.in-node-pulse', {
      scale: 2.5,
      opacity: 0,
      duration: 2,
      repeat: -1,
      ease: 'power2.out',
      stagger: 0.5
    });

    // Constant data flow along lines
    gsap.to('.in-data-particle', {
      strokeDashoffset: -204, // Multiple of dash array (4+200=204)
      duration: 'random(3, 6)',
      repeat: -1,
      ease: 'none',
      stagger: 0.2
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      <svg 
        viewBox={India.viewBox} 
        className="w-full h-full max-h-[70vh] filter drop-shadow-[0_0_15px_rgba(var(--accent-rgb),0.1)]"
        style={{ overflow: 'visible' }}
      >
        {/* Draw the India Map outline */}
        <g className="india-outline pointer-events-none">
          {India.locations.map((loc: any) => (
            <path
              key={loc.id}
              d={loc.path}
              className="in-map-path fill-black/40 stroke-white/20 hover:fill-black/60 transition-colors"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Draw connections */}
        <g className="india-connections pointer-events-none">
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={idx}>
                {/* Base line */}
                <line
                  x1={fromNode.cx} y1={fromNode.cy}
                  x2={toNode.cx} y2={toNode.cy}
                  className="in-connection stroke-white/10"
                  strokeWidth="1"
                />
                {/* Flowing particle line overlay (dashed) */}
                <line
                  x1={fromNode.cx} y1={fromNode.cy}
                  x2={toNode.cx} y2={toNode.cy}
                  className="in-data-particle stroke-accent/40"
                  strokeWidth="1.5"
                  strokeDasharray="4 200"
                />
              </g>
            );
          })}
        </g>

        {/* Draw nodes */}
        <g className="india-nodes">
          {nodes.map(node => (
            <g key={node.id}>
              {/* Pulse effect for important nodes */}
              {node.important && (
                <circle 
                  cx={node.cx} cy={node.cy} 
                  r="4" 
                  className="in-node-pulse fill-accent opacity-50 origin-center pointer-events-none" 
                  style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
                />
              )}
              
              {/* Core dot */}
              <circle 
                cx={node.cx} cy={node.cy} 
                r={node.important ? "3.5" : "2"} 
                className={`in-node-dot ${node.important ? 'fill-accent' : 'fill-white/60'}`}
              />
              
              {/* Label */}
              <text 
                x={node.cx + 8} y={node.cy + 3} 
                className={`in-node-label font-mono text-[8px] tracking-wider ${node.important ? 'fill-white/80 font-bold' : 'fill-white/40'}`}
              >
                {node.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
