import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { 
  Zap, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  MessageSquare,
  Star,
  Shield,
  Award,
  Image,
  Mic,
  Calendar,
  RefreshCw,
  Send,
  Brain,
  Flame,
  MousePointer,
  Layers
} from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Nexify AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              Hvordan det virker
            </a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Funksjoner
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Priser
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href={getLoginUrl()}>Logg inn</a>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90" asChild>
              <a href={getLoginUrl()}>
                Prøv gratis <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Focus on Simplicity */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Simple Value Proposition */}
            <Badge className="mb-6 bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border-primary/20 px-4 py-2">
              <MousePointer className="h-4 w-4 mr-2" />
              Ett klikk = Ferdig innlegg med bilde
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Skap innhold for sosiale medier
              <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                på 30 sekunder
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Velg plattform, velg tone, klikk. Få profesjonelt innlegg + bilde generert automatisk. 
              <span className="font-semibold text-foreground"> AI som lærer din stemme.</span>
            </p>

            {/* Simple 3-Step Process */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-sm font-medium">Velg plattform</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-sm font-medium">Skriv emne</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-sm font-medium">Få innlegg + bilde</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
                asChild
              >
                <a href={getLoginUrl()}>
                  <Zap className="mr-2 h-5 w-5" />
                  Prøv 5 innlegg gratis
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              ✅ Ingen kredittkort &nbsp;·&nbsp; ✅ Klar på 30 sekunder &nbsp;·&nbsp; ✅ Avbryt når som helst
            </p>
          </div>

          {/* Preview Image/Demo */}
          <div className="mt-16 max-w-5xl mx-auto">
            <Card className="border-2 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 border-b flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-sm text-muted-foreground ml-2">Nexify AI Dashboard</span>
              </div>
              <CardContent className="p-8 bg-white">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: Input */}
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">LinkedIn</Badge>
                      <Badge variant="outline" className="bg-gray-50">Twitter</Badge>
                      <Badge variant="outline" className="bg-gray-50">Instagram</Badge>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <p className="text-sm text-muted-foreground mb-2">Emne:</p>
                      <p className="font-medium">Hvordan AI endrer markedsføring i 2026</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-primary/10 text-primary">Profesjonell</Badge>
                      <Badge variant="outline">Uformell</Badge>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generer innlegg + bilde
                    </Button>
                  </div>
                  {/* Right: Output */}
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                      <p className="text-sm font-medium mb-3">🚀 AI revolusjonerer markedsføring!</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        I 2026 ser vi en dramatisk endring i hvordan bedrifter kommuniserer med kunder...
                      </p>
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <Image className="h-8 w-8 text-primary/50" />
                        <span className="ml-2 text-sm text-primary/70">AI-generert bilde</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <RefreshCw className="mr-1 h-3 w-3" /> Regenerer
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        Kopier
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works - Super Simple */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Enkelt som 1-2-3</Badge>
            <h2 className="text-4xl font-bold mb-4">Hvordan det virker</h2>
            <p className="text-xl text-muted-foreground">Ingen læringskurve. Bare resultater.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 text-center hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="pt-8 pb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Velg plattform & tone</h3>
                <p className="text-muted-foreground">
                  LinkedIn, Twitter, Instagram eller Facebook. Profesjonell, uformell eller vennlig tone.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 text-center hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="pt-8 pb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Skriv emne eller idé</h3>
                <p className="text-muted-foreground">
                  Bare noen ord er nok. AI forstår konteksten og utvider ideen din.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 text-center hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="pt-8 pb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Få innlegg + bilde</h3>
                <p className="text-muted-foreground">
                  Profesjonelt innlegg med AI-generert bilde. Klar til å publisere på sekunder.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Unique Features - What Makes Us Different */}
      <section id="features" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 text-white">
              Unike funksjoner
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Mer enn bare en AI-generator
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Alt du trenger for å dominere sosiale medier - i én enkel app.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1: Trend og Inspirasjon */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl group">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trend og Inspirasjon</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Få daglige trending-emner tilpasset ditt felt. Aldri mer "hva skal jeg skrive om?"
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Google Trends</Badge>
                  <Badge variant="outline" className="text-xs">Reddit</Badge>
                  <Badge variant="outline" className="text-xs">LinkedIn</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2: Stemmetrening */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl group">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lærer din stemme</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  AI analyserer dine tidligere innlegg og skriver i din unike stil. Ingen generisk AI-tekst.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Din stil</Badge>
                  <Badge variant="outline" className="text-xs">Dine ord</Badge>
                  <Badge variant="outline" className="text-xs">Din tone</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3: AI-bilder */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl group">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Image className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-genererte bilder</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Hvert innlegg kommer med et profesjonelt AI-generert bilde. Perfekt for engagement.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">DALL-E 3</Badge>
                  <Badge variant="outline" className="text-xs">Nano Banana</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4: Innholdskalender */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl group">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innholdskalender</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Norske og internasjonale merkedager. Aldri gå glipp av en relevant anledning.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">17. mai</Badge>
                  <Badge variant="outline" className="text-xs">Jul</Badge>
                  <Badge variant="outline" className="text-xs">Black Friday</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Feature 5: Gjenbruk */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl group">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Gjenbruk-maskin</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Gjør gamle suksessinnlegg om til nye formater: threads, carousels, video-scripts.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Thread</Badge>
                  <Badge variant="outline" className="text-xs">Carousel</Badge>
                  <Badge variant="outline" className="text-xs">Video</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Feature 6: Dashboard */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl group">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Alt på ett sted</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Alle innlegg, statistikk, og historikk samlet. Filtrer, søk, og organiser enkelt.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Statistikk</Badge>
                  <Badge variant="outline" className="text-xs">Søk</Badge>
                  <Badge variant="outline" className="text-xs">Filter</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon: WhatsApp Bot */}
          <div className="mt-12 max-w-3xl mx-auto">
            <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-purple-500/5">
              <CardContent className="pt-6 text-center">
                <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-300">
                  Kommer snart
                </Badge>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Send className="h-8 w-8 text-green-600" />
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">WhatsApp & Telegram Bot</h3>
                <p className="text-muted-foreground">
                  Send en melding eller talemelding → Få ferdig innlegg tilbake. Skap innhold mens du er på farten.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">1000+</div>
              <div className="text-sm text-muted-foreground">Fornøyde brukere</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">50,000+</div>
              <div className="text-sm text-muted-foreground">Innlegg generert</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">10 timer</div>
              <div className="text-sm text-muted-foreground">Spart per uke</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">4.9/5 vurdering</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Simple */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Enkel prising</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Start gratis, oppgrader når du er klar
            </h2>
            <p className="text-xl text-muted-foreground">
              Mindre enn en kaffe per dag. Spar 10+ timer hver uke.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Free Trial */}
            <Card className="border-2">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-2">Gratis prøve</h3>
                <div className="text-4xl font-bold mb-6">
                  0 kr
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>5 innlegg (kun tekst)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Alle plattformer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Grunnleggende dashboard</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-5 w-5 flex-shrink-0">—</span>
                    <span>Ingen AI-bilder</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-5 w-5 flex-shrink-0">—</span>
                    <span>Ingen stemmetrening</span>
                  </li>
                </ul>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <a href={getLoginUrl()}>Start gratis</a>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-4 border-primary relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 text-sm font-bold">
                ANBEFALT
              </div>
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-2">
                  199 kr
                  <span className="text-lg font-normal text-muted-foreground"> / måned</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  = 6,60 kr/dag ☕
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="font-semibold">100 innlegg per måned</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="font-semibold">AI-genererte bilder inkludert</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Stemmetrening (din stil)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Trend og Inspirasjon</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Innholdskalender</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Gjenbruk-maskin</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>AI Coach & analyse</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Prioritert support</span>
                  </li>
                </ul>
                <Button size="lg" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90" asChild>
                  <a href={getLoginUrl()}>
                    Start Pro nå <ArrowRight className="ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Guarantee */}
          <div className="mt-12 text-center">
            <Card className="max-w-xl mx-auto border-2 border-green-200 bg-green-50/50">
              <CardContent className="pt-6">
                <Shield className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">30-dagers pengene-tilbake-garanti</h3>
                <p className="text-muted-foreground text-sm">
                  Ikke fornøyd? Full refusjon, ingen spørsmål.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klar til å spare 10+ timer hver uke?
          </h2>
          <p className="text-xl mb-8 max-w-xl mx-auto opacity-90">
            Prøv 5 innlegg gratis. Ingen kredittkort. Klar på 30 sekunder.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6 shadow-xl"
            asChild
          >
            <a href={getLoginUrl()}>
              <Zap className="mr-2 h-5 w-5" />
              Start gratis nå
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-6 w-6" />
                <span className="text-xl font-bold">Nexify AI</span>
              </div>
              <p className="text-sm text-gray-400">
                Din AI-assistent for profesjonelt innhold på sosiale medier.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Hvordan det virker</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Funksjoner</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Priser</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Juridisk</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Personvern</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Vilkår</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="mailto:support@nexify.ai" className="hover:text-white transition-colors">support@nexify.ai</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Nexify AI. Alle rettigheter reservert.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
