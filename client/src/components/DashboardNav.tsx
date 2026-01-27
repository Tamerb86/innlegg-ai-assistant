import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, LayoutDashboard, Sparkles, FileText, MessageSquare, Settings as SettingsIcon, LogOut, Flame, Mic, BarChart3, Lightbulb, Calendar, Clock, Recycle, Send, Target, List, FlaskConical, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function DashboardNav() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Logget ut");
      window.location.href = "/";
    },
  });

  // Primary navigation items (shown in header)
  const primaryNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Generer", href: "/generate", icon: Sparkles },
    { label: "Mine innlegg", href: "/posts", icon: FileText },
  ];

  // Secondary navigation items (in dropdown)
  const secondaryNavItems = [
    { label: "Kalender", href: "/calendar", icon: Calendar, category: "Planlegging" },
    { label: "Beste Tid", href: "/best-time", icon: Clock, category: "Planlegging" },
    { label: "Gjenbruk", href: "/repurpose", icon: Recycle, category: "Planlegging" },
    { label: "Innholds-Serier", href: "/content-series", icon: List, category: "Planlegging" },
    { label: "Trender", href: "/trends", icon: Flame, category: "Inspirasjon" },
    { label: "Eksempler", href: "/examples", icon: Lightbulb, category: "Inspirasjon" },
    { label: "Stemme", href: "/voice-training", icon: Mic, category: "Tilpasning" },
    { label: "Coach", href: "/coach", icon: MessageSquare, category: "Tilpasning" },
    { label: "Telegram Bot", href: "/telegram-bot", icon: Send, category: "Integrasjoner" },
    { label: "Konkurrent-Radar", href: "/competitor-radar", icon: Target, category: "Analyse" },
    { label: "A/B Testing", href: "/ab-testing", icon: FlaskConical, category: "Analyse" },
  ];



  const isActive = (href: string) => {
    if (href === "/dashboard") return location === "/dashboard";
    return location.startsWith(href);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Nexify AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          
          {/* More dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                Flere
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Planlegging</DropdownMenuLabel>
              {secondaryNavItems.filter(i => i.category === "Planlegging").map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>
                      <div className="flex items-center gap-2 w-full cursor-pointer">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Inspirasjon</DropdownMenuLabel>
              {secondaryNavItems.filter(i => i.category === "Inspirasjon").map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>
                      <div className="flex items-center gap-2 w-full cursor-pointer">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tilpasning</DropdownMenuLabel>
              {secondaryNavItems.filter(i => i.category === "Tilpasning").map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>
                      <div className="flex items-center gap-2 w-full cursor-pointer">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Avansert</DropdownMenuLabel>
              {secondaryNavItems.filter(i => i.category === "Integrasjoner" || i.category === "Analyse").map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>
                      <div className="flex items-center gap-2 w-full cursor-pointer">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/settings">
            <Button
              variant={isActive("/settings") ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <SettingsIcon className="h-4 w-4" />
              Innstillinger
            </Button>
          </Link>
          
          {user?.role === "admin" && (
            <Link href="/admin/analytics">
              <Button
                variant={isActive("/admin/analytics") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
            </Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logg ut
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-2">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <div className="pt-2 pb-2">
              <div className="text-xs font-semibold text-muted-foreground px-3 py-2">Planlegging</div>
              {secondaryNavItems.filter(i => i.category === "Planlegging").map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
            <div className="pt-2 pb-2">
              <div className="text-xs font-semibold text-muted-foreground px-3 py-2">Inspirasjon & Tilpasning</div>
              {secondaryNavItems.filter(i => i.category === "Inspirasjon" || i.category === "Tilpasning").map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
            <div className="pt-2 pb-2">
              <div className="text-xs font-semibold text-muted-foreground px-3 py-2">Avansert</div>
              {secondaryNavItems.filter(i => i.category === "Integrasjoner" || i.category === "Analyse").map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
            <Link href="/settings">
              <Button
                variant={isActive("/settings") ? "default" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <SettingsIcon className="h-4 w-4" />
                Innstillinger
              </Button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin/analytics">
                <Button
                  variant={isActive("/admin/analytics") ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
              </Link>
            )}
            <div className="pt-4 border-t">
              {user && (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {user.name}
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="h-4 w-4" />
                    Logg ut
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
