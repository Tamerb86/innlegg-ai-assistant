import { useLocation } from "wouter";
import GlobalNav from "./GlobalNav";
import DashboardNav from "./DashboardNav";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const [location] = useLocation();
  
  // Pages that show DashboardNav (authenticated internal pages)
  const dashboardPages = [
    "/dashboard",
    "/generate",
    "/posts",
    "/coach",
    "/settings",
    "/account-settings"
  ];
  
  // Pages that show GlobalNav (public pages)
  const publicPages = [
    "/blog",
    "/about-us",
    "/faq",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-policy"
  ];
  
  const shouldShowDashboardNav = dashboardPages.some(path => location.startsWith(path));
  const shouldShowGlobalNav = publicPages.some(path => location.startsWith(path));
  
  return (
    <>
      {shouldShowDashboardNav && <DashboardNav />}
      {shouldShowGlobalNav && <GlobalNav />}
      {children}
    </>
  );
}
