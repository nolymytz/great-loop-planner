import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Anchor,
  Bell,
  BookOpen,
  ChevronDown,
  LogOut,
  Map,
  Settings,
  User,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppNav() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  const navLinks = [
    { href: "/trips", label: "Route" },
    { href: "/settings", label: "Weather" },
    { href: "/trips", label: "Marinas" },
    { href: "/trips", label: "Logbook" },
  ];

  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-50 h-14">
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Anchor className="w-4 h-4 text-[#002b49]" strokeWidth={2.5} />
            <span
              className="text-[13px] font-semibold tracking-wide text-[#002b49]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Great Loop Planner
            </span>
          </div>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }, i) => {
            const isActive =
              i === 0
                ? location.startsWith("/trips") || location.startsWith("/planner")
                : false;
            return (
              <Link key={`${label}-${i}`} href={href}>
                <a
                  className={`px-4 py-1.5 text-[11px] tracking-widest uppercase transition-colors cursor-pointer ${
                    isActive
                      ? "text-[#002b49] border-b-2 border-[#00e3fd] font-medium"
                      : "text-[#42474d] hover:text-[#002b49]"
                  }`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {label}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-[#42474d] hover:text-[#002b49] transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-[#42474d] hover:text-[#002b49] transition-colors">
            <Settings className="w-4 h-4" />
          </button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 ml-1 cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-[#002b49] flex items-center justify-center">
                    <span
                      className="text-white text-[10px] font-semibold"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() ?? "GL"}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#42474d]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 border-[#e2e2e2] shadow-[0_4px_16px_rgba(0,43,73,0.08)]"
              >
                <div className="px-3 py-2 border-b border-[#e2e2e2]">
                  <p
                    className="text-[11px] font-medium text-[#002b49] truncate"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {user?.name ?? "Looper"}
                  </p>
                  <p
                    className="text-[10px] text-[#42474d] truncate"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {user?.email ?? ""}
                  </p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/trips">
                    <a className="flex items-center gap-2 cursor-pointer">
                      <Map className="w-3.5 h-3.5" />
                      <span
                        className="text-[11px]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        My Trips
                      </span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <a className="flex items-center gap-2 cursor-pointer">
                      <User className="w-3.5 h-3.5" />
                      <span
                        className="text-[11px]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        Vessel Profile
                      </span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={() => logout.mutate()}
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  <span
                    className="text-[11px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Sign Out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => startLogin()}
              className="btn-primary text-[10px] py-1.5 px-4 ml-1"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
