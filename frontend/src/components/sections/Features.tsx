export function Features() {
  const features = [
    { title: "Breach exposure", desc: "Discover if your email is part of any public data leaks." },
    { title: "Exposed data categories", desc: "See exactly what information was compromised." },
    { title: "Breach timeline", desc: "Understand when the breaches occurred historically." },
    { title: "Password exposure", desc: "Check if your passwords were leaked in plain text." },
    { title: "Security recommendations", desc: "Get actionable steps to secure your digital identity." }
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-background border-t border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <div className="font-mono text-[10px] text-accent tracking-widest uppercase mb-4">
            Analysis
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
            What LeakLens checks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300">
              <div className="w-10 h-10 rounded-lg bg-accent/20 text-accent flex items-center justify-center mb-6 font-mono text-sm font-bold">
                0{idx + 1}
              </div>
              <h3 className="text-lg text-white font-heading font-semibold mb-3">{feature.title}</h3>
              <p className="text-sm font-sans text-white/60 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
