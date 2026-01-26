import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, Globe, Sparkles, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Innlegg</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "no" ? "en" : "no")}
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === "no" ? "English" : "Norsk"}
            </Button>
            
            <Button asChild>
              <a href={getLoginUrl()}>{t("login")}</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            {t("heroTitle")}
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            {t("heroSubtitle")}
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            {t("heroDescription")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href={getLoginUrl()}>{t("getStarted")}</a>
            </Button>
            <Button size="lg" variant="outline" onClick={() => {
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}>
              {t("learnMore")}
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            {t("freeTrialDescription")}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-20 bg-background">
        <h2 className="text-3xl font-bold text-center mb-12">{t("featuresTitle")}</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-4" />
              <CardTitle>{t("feature1Title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {t("feature1Description")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary mb-4" />
              <CardTitle>{t("feature2Title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {t("feature2Description")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <svg className="h-10 w-10 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <CardTitle>{t("feature3Title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {t("feature3Description")}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-20">
        <h2 className="text-3xl font-bold text-center mb-12">{t("pricingTitle")}</h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Trial */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t("freeTrial")}</CardTitle>
              <CardDescription className="text-lg">
                {t("freeTrialDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>5 {t("postsGenerated").toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{t("selectPlatform")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{t("selectTone")}</span>
                </div>
                
                <Button className="w-full mt-6" asChild>
                  <a href={getLoginUrl()}>{t("getStarted")}</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Plan */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-2xl">{t("monthlyPlan")}</CardTitle>
              <CardDescription className="text-lg">
                <span className="text-3xl font-bold text-foreground">199 kr</span>
                {language === "no" ? "/måned" : "/month"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>100 {t("postsGenerated").toLowerCase()}/{language === "no" ? "måned" : "month"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{t("selectPlatform")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{t("voiceTraining")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{language === "no" ? "Ubegrenset lagring" : "Unlimited storage"}</span>
                </div>
                
                <Button className="w-full mt-6" asChild>
                  <a href={getLoginUrl()}>{t("subscribe")}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Innlegg. {language === "no" ? "Alle rettigheter reservert." : "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
}
