import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { 
  TrendingUp, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Zap,
  Target,
  Lightbulb,
  Clock,
  Globe
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

// Simulated trending topics for MVP
const TRENDING_TOPICS = [
  {
    id: 1,
    title: "AI i arbeidslivet: Hvordan forberede seg på fremtiden",
    description: "Kunstig intelligens endrer måten vi jobber på. Lær hvordan du kan tilpasse deg og dra nytte av AI-verktøy.",
    category: "tech",
    source: "LinkedIn",
    trendScore: 95,
    suggestedPlatforms: ["linkedin", "twitter"],
    tags: ["AI", "fremtid", "karriere", "teknologi"]
  },
  {
    id: 2,
    title: "Bærekraftig forretningsdrift i 2026",
    description: "Norske bedrifter satser stort på bærekraft. Se hvordan du kan kommunisere din miljøinnsats.",
    category: "business",
    source: "Google Trends",
    trendScore: 88,
    suggestedPlatforms: ["linkedin", "instagram"],
    tags: ["bærekraft", "ESG", "grønn", "miljø"]
  },
  {
    id: 3,
    title: "Remote work: Beste praksis for hybridkontoret",
    description: "Hybridarbeid er her for å bli. Del dine erfaringer og tips for effektivt fjernarbeid.",
    category: "work",
    source: "Reddit",
    trendScore: 82,
    suggestedPlatforms: ["linkedin", "twitter"],
    tags: ["hjemmekontor", "hybrid", "produktivitet", "arbeidsliv"]
  },
  {
    id: 4,
    title: "Personlig merkevarebygging på LinkedIn",
    description: "Bygg din profesjonelle profil og bli en tankeleder i din bransje.",
    category: "marketing",
    source: "LinkedIn",
    trendScore: 91,
    suggestedPlatforms: ["linkedin"],
    tags: ["personal branding", "LinkedIn", "karriere", "nettverk"]
  },
  {
    id: 5,
    title: "Norsk startup-scene: Suksesshistorier fra 2026",
    description: "Norske gründere gjør det stort. Inspirer andre med historier om innovasjon og vekst.",
    category: "startup",
    source: "Shifter",
    trendScore: 79,
    suggestedPlatforms: ["linkedin", "twitter", "instagram"],
    tags: ["startup", "gründer", "innovasjon", "Norge"]
  },
  {
    id: 6,
    title: "Mental helse på arbeidsplassen",
    description: "Åpenhet om mental helse blir stadig viktigere. Del dine tanker om trivsel og balanse.",
    category: "wellness",
    source: "Google Trends",
    trendScore: 86,
    suggestedPlatforms: ["linkedin", "instagram"],
    tags: ["mental helse", "trivsel", "balanse", "arbeidsmiljø"]
  },
  {
    id: 7,
    title: "Generativ AI for innholdsproduksjon",
    description: "ChatGPT, Claude og andre AI-verktøy revolusjonerer innholdsproduksjon. Del dine erfaringer.",
    category: "tech",
    source: "Twitter/X",
    trendScore: 94,
    suggestedPlatforms: ["twitter", "linkedin"],
    tags: ["ChatGPT", "AI", "innhold", "produktivitet"]
  },
  {
    id: 8,
    title: "Kundeopplevelse i den digitale tidsalderen",
    description: "Hvordan skape minneverdige kundeopplevelser når alt blir digitalt?",
    category: "marketing",
    source: "Medium",
    trendScore: 77,
    suggestedPlatforms: ["linkedin", "facebook"],
    tags: ["CX", "kundeservice", "digital", "opplevelse"]
  },
  {
    id: 9,
    title: "Lederskap i usikre tider",
    description: "Gode ledere skinner i utfordrende perioder. Del dine ledertips og erfaringer.",
    category: "leadership",
    source: "LinkedIn",
    trendScore: 85,
    suggestedPlatforms: ["linkedin"],
    tags: ["lederskap", "ledelse", "team", "motivasjon"]
  },
  {
    id: 10,
    title: "Sosiale medier-trender for 2026",
    description: "Kortvideo, autentisitet og community-bygging dominerer. Hva er din strategi?",
    category: "marketing",
    source: "Hootsuite",
    trendScore: 90,
    suggestedPlatforms: ["instagram", "twitter", "linkedin"],
    tags: ["sosiale medier", "trender", "video", "strategi"]
  }
];

const CATEGORIES = [
  { value: "all", label: "Alle kategorier" },
  { value: "tech", label: "🖥️ Teknologi" },
  { value: "business", label: "💼 Business" },
  { value: "marketing", label: "📣 Markedsføring" },
  { value: "leadership", label: "👔 Lederskap" },
  { value: "startup", label: "🚀 Startup" },
  { value: "work", label: "🏢 Arbeidsliv" },
  { value: "wellness", label: "🧘 Trivsel" }
];

const PLATFORMS = [
  { value: "all", label: "Alle plattformer" },
  { value: "linkedin", label: "💼 LinkedIn" },
  { value: "twitter", label: "🐦 Twitter/X" },
  { value: "instagram", label: "📸 Instagram" },
  { value: "facebook", label: "👥 Facebook" }
];

export default function Trends() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const { data: subscription } = trpc.user.getSubscription.useQuery();

  if (authLoading || !isAuthenticated) {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
      return null;
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isPro = subscription?.status === "active";

  // Filter topics
  const filteredTopics = TRENDING_TOPICS.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || topic.category === selectedCategory;
    const matchesPlatform = selectedPlatform === "all" || topic.suggestedPlatforms.includes(selectedPlatform);
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const handleUseTopic = (topic: typeof TRENDING_TOPICS[0]) => {
    if (!isPro) {
      toast.error("Trend og Inspirasjon krever Pro-abonnement");
      return;
    }
    // Navigate to generate page with topic pre-filled
    setLocation(`/generate?topic=${encodeURIComponent(topic.title)}&platform=${topic.suggestedPlatforms[0]}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-red-500";
    if (score >= 80) return "text-orange-500";
    if (score >= 70) return "text-yellow-500";
    return "text-green-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "🔥 Veldig populært";
    if (score >= 80) return "📈 Stigende";
    if (score >= 70) return "✨ Aktuelt";
    return "💡 Interessant";
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Trend og Inspirasjon
              </h1>
              <p className="text-muted-foreground">
                Oppdag hva som trender akkurat nå og skap engasjerende innhold
              </p>
            </div>
          </div>

          {!isPro && (
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mb-6">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800">Oppgrader til Pro for full tilgang</p>
                      <p className="text-sm text-amber-700">Se alle trender og bruk dem direkte i innholdsgenerering</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90">
                    Oppgrader nå
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Søk etter emner, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Plattform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map(plat => (
                    <SelectItem key={plat.value} value={plat.value}>{plat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-100">
            <CardContent className="pt-4 pb-4 text-center">
              <Flame className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{TRENDING_TOPICS.filter(t => t.trendScore >= 90).length}</p>
              <p className="text-xs text-muted-foreground">Veldig populære</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-100">
            <CardContent className="pt-4 pb-4 text-center">
              <TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{TRENDING_TOPICS.filter(t => t.trendScore >= 80 && t.trendScore < 90).length}</p>
              <p className="text-xs text-muted-foreground">Stigende</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
            <CardContent className="pt-4 pb-4 text-center">
              <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{CATEGORIES.length - 1}</p>
              <p className="text-xs text-muted-foreground">Kategorier</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <CardContent className="pt-4 pb-4 text-center">
              <Clock className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">Nå</p>
              <p className="text-xs text-muted-foreground">Sist oppdatert</p>
            </CardContent>
          </Card>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Viser {filteredTopics.length} av {TRENDING_TOPICS.length} trender
          </p>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <RefreshCw className="h-4 w-4 mr-2" />
            Oppdater
          </Button>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredTopics.map((topic) => (
            <Card 
              key={topic.id} 
              className={`hover:shadow-lg transition-all hover:-translate-y-1 ${!isPro ? 'opacity-75' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {CATEGORIES.find(c => c.value === topic.category)?.label || topic.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {topic.source}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{topic.title}</CardTitle>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`text-2xl font-bold ${getScoreColor(topic.trendScore)}`}>
                      {topic.trendScore}
                    </div>
                    <p className="text-xs text-muted-foreground">{getScoreLabel(topic.trendScore)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{topic.description}</CardDescription>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {topic.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-gray-50">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Suggested platforms */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Best for:</span>
                    {topic.suggestedPlatforms.map((platform, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {platform === "linkedin" && "💼"}
                        {platform === "twitter" && "🐦"}
                        {platform === "instagram" && "📸"}
                        {platform === "facebook" && "👥"}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleUseTopic(topic)}
                    disabled={!isPro}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Bruk dette
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ingen trender funnet</h3>
              <p className="text-muted-foreground mb-4">
                Prøv å justere filtrene eller søkeordet ditt
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedPlatform("all");
              }}>
                Nullstill filtre
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pro Feature Banner */}
        {!isPro && (
          <Card className="mt-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="pt-6 text-center">
              <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Få tilgang til alle trender</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Med Pro-abonnement får du full tilgang til alle trender, personaliserte forslag basert på din bransje, og muligheten til å bruke trender direkte i innholdsgenerering.
              </p>
              <Button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
                Oppgrader til Pro - 199 kr/mnd
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
