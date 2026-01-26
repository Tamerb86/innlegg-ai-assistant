import { useLocation } from "wouter";
import GlobalNav from "./GlobalNav";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const [location] = useLocation();
  
  // Pages that should NOT show GlobalNav (they have their own navigation)
  const pagesWithoutGlobalNav = [
    "/",
    "/landing",
    "/dashboard",
    "/generate",
    "/posts",
    "/coach",
    "/settings",
    "/account-settings",
    "/admin/blog"
  ];
  
  const shouldShowGlobalNav = !pagesWithoutGlobalNav.some(path => 
    path === "/" ? location === "/" : location.startsWith(path)
  );
  
  return (
    <>
      {shouldShowGlobalNav && <GlobalNav />}
      {children}
    </>
  );
}
