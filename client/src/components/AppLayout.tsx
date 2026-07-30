import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import {
  Anchor, Map, BookOpen, Wrench, Fuel, CloudSun, Users, Ship, Heart,
  Settings, LogOut, Menu, X, ChevronRight, Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const navItems = [
  { href: '/trips',       label: 'My Trips',       icon: Compass },
  { href: '/planner',     label: 'Route Planner',  icon: Map },
  { href: '/logbook',     label: 'Logbook',        icon: BookOpen },
  { href: '/marinas',     label: 'Marinas',        icon: Anchor },
  { href: '/fuel',        label: 'Fuel Calculator',icon: Fuel },
  { href: '/maintenance', label: 'Maintenance',    icon: Wrench },
  { href: '/weather',     label: 'Weather',        icon: CloudSun },
  { href: '/dream-boat',  label: 'Dream Boat',     icon: Ship },
  { href: '/wishlist',    label: 'Wishlist',       icon: Heart },
  { href: '/community',   label: 'Community',      icon: Users },
];

export default function AppLayout({ children, fullHeight = false }: { children: React.ReactNode; fullHeight?: boolean }) {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Captain';

  return (
    <div className={`${fullHeight ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-[#f9f9f9] flex`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-[#002b49] flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/trips" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <Anchor className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-serif text-white font-semibold text-sm leading-tight">Great Loop</div>
              <div className="text-white/50 text-xs">Planner</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location === href || (href !== '/trips' && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <a onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                  {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: settings + user */}
        <div className="p-4 border-t border-white/10 space-y-0.5">
          <Link href="/settings">
            <a className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location === '/settings' ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}>
              <Settings className="w-4 h-4" />
              Settings
            </a>
          </Link>
          <div className="px-3 py-2.5 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              {displayName[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{displayName}</div>
              <div className="text-white/40 text-xs truncate">{user?.email}</div>
            </div>
            <button onClick={handleSignOut} className="text-white/40 hover:text-white transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 lg:ml-64 flex flex-col ${fullHeight ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#002b49] border-b border-white/10">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif text-white font-semibold">Great Loop Planner</span>
        </div>
        <main className={`flex-1 ${fullHeight ? 'overflow-hidden h-full' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
