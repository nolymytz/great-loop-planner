import { useState } from 'react';
import { Anchor, MapPin, Wind, Waves, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#f0f4f8',
        backgroundImage: 'radial-gradient(circle, #002b4918 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        color: '#002b49',
        fontFamily: "'Playfair Display', Georgia, serif",
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-[#002b49]/10 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#002b49] flex items-center justify-center shadow-md">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <span className="text-[#002b49] font-bold text-lg tracking-wide">Great Loop Planner</span>
        </div>
        <a
          href="/auth"
          className="flex items-center gap-1.5 text-sm font-medium text-[#002b49]/70 hover:text-[#002b49] transition-colors duration-200 group"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Early access
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </a>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 border border-[#002b49]/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[#002b49]/60 mb-8 bg-white/70"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#002b49]/40 animate-pulse" />
          Coming Soon
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl mb-6 text-[#002b49]">
          Navigate the
          <br />
          <span className="italic text-[#1a6fa8]">Great Loop</span>
          <br />
          with Confidence
        </h1>

        <p
          className="text-[#002b49]/65 text-lg md:text-xl max-w-xl mb-12 leading-relaxed"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          A precision planning suite for the modern mariner. Route mapping, marina discovery,
          fuel planning, maintenance tracking — everything for your 6,000-mile voyage.
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
              className="flex-1 bg-white border border-[#002b49]/20 rounded-lg px-4 py-3 text-[#002b49] placeholder-[#002b49]/35 focus:outline-none focus:border-[#002b49]/60 focus:ring-2 focus:ring-[#002b49]/10 transition-all duration-200 text-sm shadow-sm"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            />
            <button
              type="submit"
              className="bg-[#002b49] hover:bg-[#003d6b] text-white font-semibold rounded-lg px-6 py-3 text-sm transition-all duration-200 whitespace-nowrap active:scale-[0.97] shadow-md"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              Notify Me
            </button>
          </form>
        ) : (
          <div
            className="flex items-center gap-2 bg-white border border-[#002b49]/20 rounded-lg px-6 py-3 mb-16 text-[#002b49] text-sm font-medium shadow-sm"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>You're on the list — we'll be in touch.</span>
          </div>
        )}

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          {[
            { icon: MapPin, label: 'Interactive Route Map', desc: 'Plan every waypoint on your 6,000-mile journey' },
            { icon: Wind,   label: 'Weather & Tides',       desc: 'Real-time conditions along your route' },
            { icon: Waves,  label: 'Marina Discovery',      desc: '1,400+ marinas with fuel, amenities & reviews' },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="bg-white border border-[#002b49]/12 rounded-xl p-5 text-left shadow-sm hover:shadow-md hover:border-[#002b49]/25 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-[#002b49]/8 flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-[#002b49]" />
              </div>
              <div className="font-bold text-sm text-[#002b49] mb-1">{label}</div>
              <div
                className="text-[#002b49]/55 text-xs leading-relaxed"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {desc}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="text-center py-6 text-[#002b49]/40 text-xs border-t border-[#002b49]/8"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        © {new Date().getFullYear()} Great Loop Planner · Built for loopers, by loopers
      </footer>
    </div>
  );
}
