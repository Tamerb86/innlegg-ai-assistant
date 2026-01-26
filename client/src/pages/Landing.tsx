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
  Award
} from "lucide-react";

export default function Landing() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary animate-pulse" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Innlegg
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Funksjoner
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Priser
            </a>
            <Button variant="outline" size="sm" asChild>
              <a href={getLoginUrl()}>Logg inn</a>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90" asChild>
              <a href={getLoginUrl()}>
                Start gratis <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Urgency */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Urgency Banner */}
          <div className="flex justify-center mb-8 animate-bounce">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 text-sm">
              🔥 Tidsbegrenset tilbud: 5 gratis innlegg!
            </Badge>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
              Skap profesjonelt innhold på 30 sekunder
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Din AI-assistent som forvandler ideer til <span className="text-primary font-semibold">engasjerende innlegg</span> for LinkedIn, Twitter, Instagram og Facebook
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-6 mb-10 flex-wrap">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">1000+ fornøyde brukere</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">4.9/5 vurdering</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">50,000+ innlegg generert</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                asChild
              >
                <a href={getLoginUrl()}>
                  <Zap className="mr-2 h-5 w-5" />
                  Start gratis nå
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-2 hover:bg-primary/5"
                asChild
              >
                <a href="#demo">
                  Se hvordan det virker
                </a>
              </Button>
            </div>

            {/* Trust Signals */}
            <p className="text-sm text-muted-foreground">
              ✅ Ingen kredittkort påkrevd &nbsp;|&nbsp; ✅ 5 gratis innlegg &nbsp;|&nbsp; ✅ Avbryt når som helst
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl transform hover:-translate-y-2">
              <CardContent className="pt-6 text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">10 timer</div>
                <p className="text-muted-foreground">spart hver uke</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl transform hover:-translate-y-2">
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">3x</div>
                <p className="text-muted-foreground">mer engasjement</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl transform hover:-translate-y-2">
              <CardContent className="pt-6 text-center">
                <Target className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">100%</div>
                <p className="text-muted-foreground">din egen stemme</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4">Problemet</Badge>
              <h2 className="text-4xl font-bold mb-6">Sliter du med å lage innhold?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4 text-red-700">Uten Innlegg:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span>Bruker 2-3 timer per uke på innhold</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span>Skriver samme type innlegg om igjen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span>Usikker på hva som fungerer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span>Mister muligheter for engasjement</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4 text-green-700">Med Innlegg:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>Lag innhold på 30 sekunder</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>Gjenbruk vellykkede maler</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>Få AI-analyse og tips</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>Øk engasjement med 3x</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 text-white">
              Unike funksjoner
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Hvorfor Innlegg er <span className="text-primary">annerledes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ikke bare en AI-generator. En komplett løsning for innholdsskaping.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1: AI Content Coach */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-2xl transform hover:-translate-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-purple-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                EKSKLUSIVT
              </div>
              <CardContent className="pt-8">
                <div className="h-16 w-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI Content Coach</h3>
                <p className="text-muted-foreground mb-6">
                  Få detaljert analyse av hvert innlegg med poengsum, styrker, og personlige forbedringstips. Lær mens du lager innhold!
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Poengsum 0-10</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Styrker & svakheter</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Personlige tips</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2: Saved Examples */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-2xl transform hover:-translate-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                TIDSBESPARENDE
              </div>
              <CardContent className="pt-8">
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Lagrede eksempler</h3>
                <p className="text-muted-foreground mb-6">
                  Lagre vellykkede innlegg som maler og gjenbruk dem med ett klikk. Bygg ditt eget bibliotek av vinnende innhold.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Ubegrenset lagring</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Ett-klikk gjenbruk</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Brukstelling</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3: AI Coach Chat */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-2xl transform hover:-translate-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-orange-500 to-red-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                INNOVATIVT
              </div>
              <CardContent className="pt-8">
                <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI Coach Chat</h3>
                <p className="text-muted-foreground mb-6">
                  Chat med din personlige AI-trener. Få svar på spørsmål, sammenlign innlegg, og motta utfordringer for å forbedre ferdighetene dine.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Spør hva som helst</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Sammenlign innlegg</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Daglige utfordringer</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Note */}
          <div className="mt-16 text-center">
            <Card className="max-w-3xl mx-auto border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Ingen andre verktøy har dette!</h3>
                <p className="text-muted-foreground mb-4">
                  ChatGPT, Jasper, Copy.ai - ingen tilbyr AI Coach, lagrede eksempler, og personlig chat i ett verktøy.
                </p>
                <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white">
                  Innlegg = Generator + Trener + Bibliotek
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section with FOMO */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Enkel prising</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Invester i din <span className="text-primary">produktivitet</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mindre enn prisen på en kaffe per dag. Spar 10+ timer hver uke.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Free Trial */}
            <Card className="border-2">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-2">Gratis prøveperiode</h3>
                <div className="text-4xl font-bold mb-6">
                  0 kr
                  <span className="text-lg font-normal text-muted-foreground"> / alltid</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>5 gratis innlegg</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Alle plattformer (LinkedIn, Twitter, etc)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>AI Content Coach</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Ingen kredittkort påkrevd</span>
                  </li>
                </ul>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <a href={getLoginUrl()}>Start gratis</a>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-4 border-primary relative overflow-hidden shadow-2xl transform scale-105">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 text-sm font-bold">
                MEST POPULÆR
              </div>
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-5xl font-bold mb-2">
                  199 kr
                  <span className="text-lg font-normal text-muted-foreground"> / måned</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Kun 6,60 kr per dag - mindre enn en kaffe! ☕
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">100 innlegg per måned</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Alle plattformer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>AI Content Coach</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Ubegrensede lagrede eksempler</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>AI Coach Chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Personlig stemmetrening</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Prioritert support</span>
                  </li>
                </ul>
                <Button size="lg" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-lg py-6" asChild>
                  <a href={getLoginUrl()}>
                    Oppgrader nå <ArrowRight className="ml-2" />
                  </a>
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  💰 Spar 10+ timer/uke = 3000+ kr i verdi
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto border-2 border-green-200 bg-green-50/50">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">30-dagers pengene-tilbake-garanti</h3>
                <p className="text-muted-foreground">
                  Ikke fornøyd? Få full refusjon, ingen spørsmål stilt. Vi tar all risiko.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Hva brukerne sier</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Bli med 1000+ fornøyde brukere
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Innlegg har spart meg 10 timer hver uke. AI Coach gir meg tips jeg aldri ville tenkt på selv!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                    KH
                  </div>
                  <div>
                    <div className="font-semibold">Kari Hansen</div>
                    <div className="text-sm text-muted-foreground">Markedssjef, Oslo</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Endelig et verktøy som lærer min skrivestil! Lagrede eksempler er genialt."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                    LJ
                  </div>
                  <div>
                    <div className="font-semibold">Lars Johansen</div>
                    <div className="text-sm text-muted-foreground">Gründer, Bergen</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Engasjementet mitt på LinkedIn har økt med 300% siden jeg begynte å bruke Innlegg!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
                    SA
                  </div>
                  <div>
                    <div className="font-semibold">Sofie Andersen</div>
                    <div className="text-sm text-muted-foreground">Konsulent, Trondheim</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="h-16 w-16 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Klar til å transformere innholdsproduksjonen din?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Bli med 1000+ profesjonelle som allerede sparer timer hver uke
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              asChild
            >
              <a href={getLoginUrl()}>
                <Zap className="mr-2 h-5 w-5" />
                Start gratis nå - 5 innlegg gratis
              </a>
            </Button>
          </div>
          <p className="text-sm opacity-75">
            ⏰ Tilbudet utløper snart! Ikke gå glipp av sjansen.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-6 w-6" />
                <span className="text-xl font-bold">Innlegg</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Din AI-assistent for profesjonelt innhold på sosiale medier.
              </p>
              <div className="text-sm text-gray-400">
                <p className="font-semibold text-white mb-2">Nexify CRM Systems AS</p>
                <p>E-post: support@nexify.no</p>
                <p>Nettside: www.nexify.no</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Funksjoner</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Priser</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Hvordan det virker</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Selskap</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about-us" className="hover:text-white transition-colors">Om oss</a></li>
                <li><a href="/privacy-policy" className="hover:text-white transition-colors">Personvernerklæring</a></li>
                <li><a href="/terms-of-service" className="hover:text-white transition-colors">Vilkår for bruk</a></li>
                <li><a href="/cookie-policy" className="hover:text-white transition-colors">Informasjonskapsler</a></li>
                <li>
                  <button
                    onClick={() => {
                      const { reopenCookieSettings } = require('@/components/CookieConsent');
                      reopenCookieSettings();
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    Administrer informasjonskapsler
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Støtte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">Ofte stilte spørsmål (FAQ)</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Kontakt oss</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hjelp</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Nexify CRM Systems AS. Alle rettigheter reservert.</p>
            <p className="mt-2">Innlegg - AI-drevet innholdsgenerator for sosiale medier</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
