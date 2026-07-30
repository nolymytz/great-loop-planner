import { useState } from 'react';
import { Anchor, MapPin, Compass, Wind, Waves, ArrowRight } from 'lucide-react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#002b49] text-white overflow-hidden relative flex flex-col">

      {/* Animated wave background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute bottom-0 left-0 w-full opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#ffffff" fillOpacity="1" d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,186.7C672,181,768,139,864,138.7C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full opacity-5" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{transform: 'translateY(-40px)'}}>
          <path fill="#7dd3fc" fillOpacity="1" d="M0,256L60,240C120,224,240,192,360,197.3C480,203,600,245,720,245.3C840,245,960,203,1080,192C1200,181,1320,203,1380,213.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
        {/* Compass rose watermark */}
        <div className="absolute top-1/2 right-[-100px] -translate-y-1/2 opacity-[0.03]">
          <Compass className="w-[500px] h-[500px]" />
        </div>
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif text-lg font-semibold tracking-wide">Great Loop Planner</span>
        </div>
        <a
          href="/app"
          className="text-sm text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
        >
          Early access
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </a>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center py-16">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-[#7dd3fc] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7dd3fc] animate-pulse" />
          Coming Soon
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight max-w-4xl mb-6">
          Navigate the
          <br />
          <span className="text-[#7dd3fc]">Great Loop</span>
          <br />
          with Confidence
        </h1>

        <p className="text-white/60 text-lg md:text-xl max-w-xl mb-12 leading-relaxed">
          A precision planning suite for the modern mariner. Route mapping, marina discovery, fuel planning, maintenance tracking — everything for your 6,000-mile voyage.
        </p>

        {/* Email capture */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-16">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#7dd3fc] focus:bg-white/15 transition-all duration-200 text-sm"
            />
            <button
              type="submit"
              className="bg-[#7dd3fc] hover:bg-[#38bdf8] text-[#002b49] font-semibold rounded-lg px-6 py-3 text-sm transition-all duration-200 whitespace-nowrap active:scale-[0.97]"
            >
              Notify Me
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 bg-[#7dd3fc]/10 border border-[#7dd3fc]/30 rounded-lg px-6 py-3 mb-16 text-[#7dd3fc] text-sm font-medium">
            <span>✓</span>
            <span>You're on the list — we'll be in touch.</span>
          </div>
        )}

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          {[
            { icon: MapPin, label: 'Interactive Route Map', desc: 'Plan every waypoint on your 6,000-mile journey' },
            { icon: Wind, label: 'Weather & Tides', desc: 'Real-time conditions along your route' },
            { icon: Waves, label: 'Marina Discovery', desc: '1,400+ marinas with fuel, amenities & reviews' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-5 text-left hover:bg-white/8 transition-colors duration-200">
              <Icon className="w-5 h-5 text-[#7dd3fc] mb-3" />
              <div className="font-medium text-sm mb-1">{label}</div>
              <div className="text-white/50 text-xs leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-white/30 text-xs">
        © {new Date().getFullYear()} Great Loop Planner · Built for loopers, by loopers
      </footer>
    </div>
  );
}
