import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Check, 
  Globe, 
  Zap, 
  Sparkles,
  TrendingUp,
  Target,
  Award,
  MessageSquare,
  BookMarked,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [, setLocation] = useLocation();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const features = [
    {
      icon: Zap,
      title: language === "no" ? "Lynrask generering" : "Lightning Fast",
      description: language === "no" 
        ? "Fra idé til ferdig innlegg på 30 sekunder. Spar timer hver uke."
        : "From idea to finished post in 30 seconds. Save hours every week."
    },
    {
      icon: Target,
      title: language === "no" ? "4 plattformer" : "4 Platforms",
      description: language === "no" 
        ? "LinkedIn, Twitter, Instagram og Facebook. Optimalisert for hver plattform."
        : "LinkedIn, Twitter, Instagram, and Facebook. Optimized for each platform."
    },
    {
      icon: MessageSquare,
      title: language === "no" ? "Din unike stemme" : "Your Unique Voice",
      description: language === "no" 
        ? "AI lærer din skrivest og lager innhold som høres ut som deg."
        : "AI learns your writing style and creates content that sounds like you."
    },
    {
      icon: BarChart3,
      title: language === "no" ? "AI Innholds-Coach" : "AI Content Coach",
      description: language === "no" 
        ? "Få personlig tilbakemelding og tips for å forbedre innholdet ditt."
        : "Get personalized feedback and tips to improve your content."
    },
    {
      icon: BookMarked,
      title: language === "no" ? "Lagrede eksempler" : "Saved Examples",
      description: language === "no" 
        ? "Lagre dine beste innlegg og gjenbruk dem senere med ett klikk."
        : "Save your best posts and reuse them later with one click."
    },
    {
      icon: Award,
      title: language === "no" ? "Profesjonell kvalitet" : "Professional Quality",
      description: language === "no" 
        ? "Innhold som ser ut som det er skrevet av en profesjonell copywriter."
        : "Content that looks like it was written by a professional copywriter."
    }
  ];

  const pricing = {
    trial: {
      title: language === "no" ? "Gratis prøveperiode" : "Free Trial",
      price: language === "no" ? "0 kr" : "0 NOK",
      features: [
        language === "no" ? "5 innlegg gratis" : "5 free posts",
        language === "no" ? "Alle funksjoner" : "All features",
        language === "no" ? "Ingen kredittkort påkrevd" : "No credit card required"
      ]
    },
    pro: {
      title: language === "no" ? "Pro" : "Pro",
      price: language === "no" ? "199 kr/måned" : "199 NOK/month",
      features: [
        language === "no" ? "100 innlegg per måned" : "100 posts per month",
        language === "no" ? "AI Innholds-Coach" : "AI Content Coach",
        language === "no" ? "Lagrede eksempler" : "Saved Examples",
        language === "no" ? "Prioritert support" : "Priority support"
      ]
    }
  };

  const testimonials = [
    {
      name: "Erik Hansen",
      role: language === "no" ? "Markedsføringsleder" : "Marketing Manager",
      content: language === "no"
        ? "Innlegg har spart meg for timer hver uke. Innholdet er alltid profesjonelt og engasjerende."
        : "Innlegg has saved me hours every week. The content is always professional and engaging."
    },
    {
      name: "Sofie Larsen",
      role: language === "no" ? "Gründer" : "Founder",
      content: language === "no"
        ? "AI Coach-funksjonen hjalp meg å forbedre innholdet mitt betydelig. Anbefales på det sterkeste!"
        : "The AI Coach feature helped me improve my content significantly. Highly recommended!"
    },
    {
      name: "Thomas Berg",
      role: language === "no" ? "Selger" : "Sales Representative",
      content: language === "no"
        ? "Endelig et verktøy som forstår min stemme. Innleggene mine får nå mye mer engasjement."
        : "Finally a tool that understands my voice. My posts now get much more engagement."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
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
            <Button variant="outline" onClick={() => window.location.href = getLoginUrl()}>
              {language === "no" ? "Logg inn" : "Log in"}
            </Button>
            <Button onClick={() => window.location.href = getLoginUrl()}>
              {language === "no" ? "Kom i gang gratis" : "Get started free"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {language === "no" ? "Ny: AI Innholds-Coach" : "New: AI Content Coach"}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {language === "no" 
              ? "Skap profesjonelt innhold på sekunder"
              : "Create professional content in seconds"}
            <span className="block text-primary mt-2">
              {language === "no" 
                ? "med din egen stemme"
                : "with your own voice"}
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {language === "no"
              ? "Innlegg bruker AI til å lage engasjerende innhold for LinkedIn, Twitter, Instagram og Facebook. Spar timer og få bedre resultater."
              : "Innlegg uses AI to create engaging content for LinkedIn, Twitter, Instagram, and Facebook. Save hours and get better results."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8" onClick={() => window.location.href = getLoginUrl()}>
              {language === "no" ? "Start gratis prøveperiode" : "Start free trial"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              {language === "no" ? "Se hvordan det fungerer" : "See how it works"}
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{language === "no" ? "5 innlegg gratis" : "5 free posts"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{language === "no" ? "Ingen kredittkort" : "No credit card"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{language === "no" ? "Kanseller når som helst" : "Cancel anytime"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24 bg-secondary/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "no" ? "Alt du trenger for å lykkes" : "Everything you need to succeed"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === "no"
                ? "Innlegg gir deg verktøyene du trenger for å lage engasjerende innhold som konverterer."
                : "Innlegg gives you the tools you need to create engaging content that converts."}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "no" ? "Enkel og transparent prising" : "Simple and transparent pricing"}
            </h2>
            <p className="text-xl text-muted-foreground">
              {language === "no"
                ? "Start gratis, oppgrader når du er klar."
                : "Start free, upgrade when you're ready."}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Trial */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-2">{pricing.trial.title}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{pricing.trial.price}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {pricing.trial.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" onClick={() => window.location.href = getLoginUrl()}>
                  {language === "no" ? "Kom i gang" : "Get started"}
                </Button>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                {language === "no" ? "Mest populær" : "Most popular"}
              </div>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-2">{pricing.pro.title}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{pricing.pro.price}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {pricing.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => window.location.href = getLoginUrl()}>
                  {language === "no" ? "Start gratis prøveperiode" : "Start free trial"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container py-24 bg-secondary/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "no" ? "Hva brukerne våre sier" : "What our users say"}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {language === "no" 
              ? "Klar til å lage bedre innhold?"
              : "Ready to create better content?"}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {language === "no"
              ? "Bli med tusenvis av fornøyde brukere som allerede bruker Innlegg."
              : "Join thousands of satisfied users already using Innlegg."}
          </p>
          <Button size="lg" className="text-lg px-8" onClick={() => window.location.href = getLoginUrl()}>
            {language === "no" ? "Start gratis nå" : "Start free now"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-bold">Innlegg</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Innlegg. {language === "no" ? "Alle rettigheter reservert." : "All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
