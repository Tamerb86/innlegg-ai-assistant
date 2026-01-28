import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, LayoutDashboard, Sparkles, FileText, MessageSquare, Settings as SettingsIcon, LogOut, Flame, Mic, BarChart3, Lightbulb, Calendar, Clock, Recycle, Send, Target, List, FlaskConical, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import FloatingIdeaButton from "./FloatingIdeaButton";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

export default function DashboardNav() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Logget ut");
      window.location.href = "/";
    },
  });

  // Primary navigation items
  const primaryNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Generer", href: "/generate", icon: Sparkles },
    { label: "Mine innlegg", href: "/posts", icon: FileText },
  ];

  // Sidebar navigation items (previously in Flere dropdown)
  const sidebarSections = [
    {
      title: "Planlegging",
      items: [
        { label: "Kalender", href: "/kalender", icon: Calendar },
        { label: "Beste Tid", href: "/best-time", icon: Clock },
        { label: "Gjenbruk", href: "/repurpose", icon: Recycle },
        { label: "Innholds-Serier", href: "/content-series", icon: List },
        { label: "Idé-Bank", href: "/idea-bank", icon: Lightbulb },
      ]
    },
    {
      title: "Inspirasjon",
      items: [
        { label: "Trender", href: "/trends", icon: Flame },
        { label: "Eksempler", href: "/examples", icon: Lightbulb },
      ]
    },
    {
      title: "Tilpasning",
      items: [
        { label: "Stemme", href: "/voice-training", icon: Mic },
        { label: "Coach", href: "/coach", icon: MessageSquare },
      ]
    },
    {
      title: "Avansert",
      items: [
        { label: "Telegram Bot", href: "/telegram-bot", icon: Send },
        { label: "Telegram Innlegg", href: "/telegram-posts", icon: MessageSquare },
        { label: "Konkurrent-Radar", href: "/competitor-radar", icon: Target },
        { label: "A/B Testing", href: "/ab-testing", icon: FlaskConical },
        { label: "Ukentlig Rapport", href: "/weekly-report", icon: Mail },
        { label: "Engasjement-Hjelper", href: "/engagement-helper", icon: MessageSquare },
      ]
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return location === "/dashboard";
    return location.startsWith(href);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const NavItem = ({ item, collapsed }: { item: { label: string; href: string; icon: any }; collapsed: boolean }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    
    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link href={item.href}>
              <Button
                variant={active ? "secondary" : "ghost"}
                size="icon"
                className={cn(
                  "w-10 h-10",
                  active && "bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link href={item.href}>
        <Button
          variant={active ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-3",
            active && "bg-primary/10 text-primary font-medium"
          )}
        >
          <Icon className="h-5 w-5" />
          {item.label}
        </Button>
      </Link>
    );
  };

  return (
    <>
      {/* Fixed Sidebar - Desktop */}
      <aside className={cn(
        "hidden md:flex flex-col fixed left-0 top-0 h-screen bg-background border-r z-40 transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className={cn(
          "h-16 flex items-center border-b px-4",
          sidebarCollapsed ? "justify-center" : "justify-between"
        )}>
          {!sidebarCollapsed && (
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
          )}
          {sidebarCollapsed && (
            <Link href="/dashboard">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center cursor-pointer">
                <Zap className="h-5 w-5 text-white" />
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", sidebarCollapsed && "hidden")}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Expand button when collapsed */}
        {sidebarCollapsed && (
          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSidebarCollapsed(false)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Primary Navigation */}
        <div className={cn("p-2 space-y-1", sidebarCollapsed && "flex flex-col items-center")}>
          {primaryNavItems.map((item) => (
            <NavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}
        </div>

        {/* Scrollable Sidebar Content */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {sidebarSections.map((section, idx) => (
            <div key={section.title} className={cn("mt-4", sidebarCollapsed && "flex flex-col items-center")}>
              {!sidebarCollapsed && (
                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
              )}
              {sidebarCollapsed && idx > 0 && (
                <div className="w-8 h-px bg-border my-2" />
              )}
              <div className={cn("space-y-1", sidebarCollapsed && "flex flex-col items-center")}>
                {section.items.map((item) => (
                  <NavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className={cn("border-t p-2 space-y-1", sidebarCollapsed && "flex flex-col items-center")}>
          <NavItem 
            item={{ label: "Innstillinger", href: "/settings", icon: SettingsIcon }} 
            collapsed={sidebarCollapsed} 
          />
          {user?.role === "admin" && (
            <NavItem 
              item={{ label: "Analytics", href: "/admin/analytics", icon: BarChart3 }} 
              collapsed={sidebarCollapsed} 
            />
          )}
          
          {/* User Info & Logout */}
          <div className={cn(
            "pt-2 mt-2 border-t",
            sidebarCollapsed ? "flex flex-col items-center" : ""
          )}>
            {!sidebarCollapsed && user && (
              <div className="px-3 py-2">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
            {sidebarCollapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Logg ut</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-5 w-5" />
                Logg ut
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={cn(
        "md:transition-all md:duration-300",
        sidebarCollapsed ? "md:ml-16" : "md:ml-64"
      )}>
        {/* Mobile Top Navigation */}
        <nav className="md:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
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
            <div className="md:hidden border-t bg-background max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="container py-4 space-y-2">
                {primaryNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive(item.href) ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-2",
                          isActive(item.href) && "bg-primary/10 text-primary"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
                
                {sidebarSections.map((section) => (
                  <div key={section.title} className="pt-2">
                    <div className="text-xs font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider">
                      {section.title}
                    </div>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant={isActive(item.href) ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start gap-2",
                              isActive(item.href) && "bg-primary/10 text-primary"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                ))}

                <div className="pt-2 border-t">
                  <Link href="/settings">
                    <Button
                      variant={isActive("/settings") ? "secondary" : "ghost"}
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
                        variant={isActive("/admin/analytics") ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="pt-2 border-t">
                  {user && (
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="h-4 w-4" />
                    Logg ut
                  </Button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>

      <FloatingIdeaButton />
    </>
  );
}
