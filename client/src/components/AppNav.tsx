import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { Anchor, Bell, ChevronDown, LogOut, Map, Settings, User } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const NAV_LINKS = [
  { href: "/trips",       label: "Route" },
  { href: "/weather",     label: "Weather" },
  { href: "/marinas",     label: "Marinas" },
  { href: "/logbook",     label: "Logbook" },
];

export function AppNav() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [location] = useLocation();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    window.location.href = "/";
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Looper";

  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-50 h-14">
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Anchor className="w-4 h-4 text-[#002b49]" strokeWidth={2.5} />
            <span className="text-[13px] font-semibold tracking-wide text-[#002b49]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Great Loop Planner
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = location.startsWith(href);
            return (
              <Link key={href} href={href}>
                <a className={`px-4 py-1.5 text-[11px] tracking-widest uppercase transition-colors cursor-pointer ${
                  isActive ? "text-[#002b49] border-b-2 border-[#00e3fd] font-medium" : "text-[#42474d] hover:text-[#002b49]"
                }`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {label}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button className="p-1.5 text-[#42474d] hover:text-[#002b49] transition-colors"><Bell className="w-4 h-4" /></button>
          <Link href="/settings">
            <button className="p-1.5 text-[#42474d] hover:text-[#002b49] transition-colors"><Settings className="w-4 h-4" /></button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 ml-1 cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-[#002b49] flex items-center justify-center">
                    <span className="text-white text-[10px] font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#42474d]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-[#e2e2e2] shadow-[0_4px_16px_rgba(0,43,73,0.08)]">
                <div className="px-3 py-2 border-b border-[#e2e2e2]">
                  <p className="text-[11px] font-medium text-[#002b49] truncate" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{displayName}</p>
                  <p className="text-[10px] text-[#42474d] truncate" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{user?.email ?? ""}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/trips"><a className="flex items-center gap-2 cursor-pointer"><Map className="w-3.5 h-3.5" /><span className="text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>My Trips</span></a></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings"><a className="flex items-center gap-2 cursor-pointer"><User className="w-3.5 h-3.5" /><span className="text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Vessel Profile</span></a></Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={handleSignOut}>
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  <span className="text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <button className="btn-primary text-[10px] py-1.5 px-4 ml-1">Sign In</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
