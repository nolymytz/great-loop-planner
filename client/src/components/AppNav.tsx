import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Anchor, BookOpen, Map, Settings, ChevronDown, LogOut, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function AppNav() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const logout = trpc.auth.logout.useMutation({ onSuccess: () => { window.location.href = "/"; } });

  const navLinks = [
    { href: "/trips",   label: "My Trips",  icon: BookOpen },
    { href: "/planner", label: "Planner",   icon: Map },
    { href: "/settings",label: "Settings",  icon: Settings },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-border/60">
      <div className="container h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-nautical-gradient flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Anchor className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-serif font-semibold text-lg text-foreground tracking-tight">
            Great Loop <span className="text-gradient-gold">Planner</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <button className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                location.startsWith(href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm">{user?.name ?? "Account"}</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Profile & Vessel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => logout.mutate()}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => startLogin()} className="bg-primary text-primary-foreground">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
