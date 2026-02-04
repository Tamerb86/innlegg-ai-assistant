import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import Posts from "./pages/Posts";
import Settings from "./pages/Settings";
import Coach from "./pages/Coach";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/CookiePolicy";
import AboutUs from "./pages/AboutUs";
import FAQ from "@/pages/FAQ";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import CookieConsent from "@/components/CookieConsent";
import OpenAIConsentBanner from "@/components/OpenAIConsentBanner";
import AccountSettings from "@/pages/AccountSettings";
import Contact from "@/pages/Contact";
import BlogAdmin from "@/pages/BlogAdmin";
import PageLayout from "@/components/PageLayout";
import Trends from "@/pages/Trends";
import VoiceTraining from "@/pages/VoiceTraining";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import SubscriptionCancel from "@/pages/SubscriptionCancel";
import AdminAnalytics from "@/pages/AdminAnalytics";
import Examples from "@/pages/Examples";
import ContentCalendar from "@/pages/ContentCalendar";
import BestTime from "@/pages/BestTime";
import ContentRepurpose from "@/pages/ContentRepurpose";
import TelegramBot from "@/pages/TelegramBot";
import TelegramPosts from "@/pages/TelegramPosts";
import CompetitorRadar from "@/pages/CompetitorRadar";
import ContentSeries from "@/pages/ContentSeries";
import ABTesting from "@/pages/ABTesting";
import WeeklyReport from "@/pages/WeeklyReport";
import EngagementHelper from "@/pages/EngagementHelper";
import IdeaBank from "@/pages/IdeaBank";
import Calendar from "@/pages/Calendar";
import { Pricing } from "@/pages/Pricing";


function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/landing"} component={Landing} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/generate"} component={Generate} />
      <Route path={"/posts"} component={Posts} />
      <Route path={"/coach"} component={Coach} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/privacy-policy"} component={PrivacyPolicy} />
      <Route path={"/terms-of-service"} component={TermsOfService} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/cookie-policy"} component={CookiePolicy} />
      <Route path={"/about-us"} component={AboutUs} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/account-settings"} component={AccountSettings} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/admin/blog"} component={BlogAdmin} />
      <Route path={"/trends"} component={Trends} />
      <Route path={"/voice-training"} component={VoiceTraining} />
      <Route path={"/subscription/success"} component={SubscriptionSuccess} />
      <Route path={"/subscription/cancel"} component={SubscriptionCancel} />
      <Route path={"/admin/analytics"} component={AdminAnalytics} />
      <Route path={"/examples"} component={Examples} />
      <Route path="/kalender" component={Calendar} />
      <Route path="/kalender-old" component={ContentCalendar} />
      <Route path={"/@/best-time"} component={BestTime} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/repurpose"} component={ContentRepurpose} />
      <Route path={"/telegram-bot"} component={TelegramBot} />
      <Route path={"/telegram-posts"} component={TelegramPosts} />
      <Route path={"/competitor-radar"} component={CompetitorRadar} />
      <Route path={"/content-series"} component={ContentSeries} />
      <Route path={"/ab-testing"} component={ABTesting} />
      <Route path={"/weekly-report"} component={WeeklyReport} />
      <Route path={"/engagement-helper"} component={EngagementHelper} />
      <Route path={"/idea-bank"} component={IdeaBank} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <CookieConsent />
          <OpenAIConsentBanner />
          <PageLayout>
            <Router />
          </PageLayout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
