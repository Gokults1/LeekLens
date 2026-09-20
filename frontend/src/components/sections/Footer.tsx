export function Footer() {
  return (
    <footer className="w-full py-12 bg-[#050608] border-t border-white/5 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-2xl font-heading font-bold tracking-wide">
          <span className="text-accent">L</span>eakLens
        </div>
        
        <div className="text-center md:text-right font-sans text-xs text-white/40 max-w-md">
          <p>
            Exposure data powered by <a href="https://xposedornot.com" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white underline underline-offset-2 transition-colors">XposedOrNot</a>. 
            LeakLens is a portfolio project built for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
