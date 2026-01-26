import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { SavedExamplesSection } from "@/components/SavedExamplesSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Copy, Loader2, Zap } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function Generate() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const [rawInput, setRawInput] = useState("");
  const [platform, setPlatform] = useState<"linkedin" | "twitter" | "instagram" | "facebook">("linkedin");
  const [tone, setTone] = useState<"professional" | "friendly" | "motivational" | "educational">("professional");
  const [generatedContent, setGeneratedContent] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const generateMutation = trpc.content.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedContent(data.post.generatedContent);
      setAnalysis(data.analysis);
      toast.success(t("postGenerated"));
    },
    onError: (error) => {
      if (error.message.includes("Trial limit reached")) {
        toast.error(t("errorLimit"));
        setLocation("/subscription");
      } else {
        toast.error(error.message || t("errorGeneral"));
      }
    },
  });

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

  const handleGenerate = () => {
    if (!rawInput.trim()) {
      toast.error(language === "no" ? "Vennligst skriv inn en idé" : "Please enter an idea");
      return;
    }

    generateMutation.mutate({
      rawInput,
      platform,
      tone,
      language,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success(t("copiedSuccess"));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/dashboard")}>
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Innlegg</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
              {t("dashboard")}
            </Button>
            <Button variant="ghost" onClick={() => setLocation("/posts")}>
              {t("myPosts")}
            </Button>
            <Button variant="ghost" onClick={() => setLocation("/settings")}>
              {t("settings")}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("generateTitle")}</h1>
          <p className="text-muted-foreground">
            {language === "no" 
              ? "Skriv inn ideen din, velg plattform og tone, og la AI gjøre resten."
              : "Enter your idea, select platform and tone, and let AI do the rest."}
          </p>
        </div>
        
        {/* Saved Examples Section */}
        <SavedExamplesSection 
          language={language} 
          onUseExample={(example: any) => {
            setRawInput(example.rawInput);
            setPlatform(example.platform as any);
            setTone(example.tone as any);
            toast.success(language === "no" ? "Eksempel lastet!" : "Example loaded!");
          }}
        />

        <div className="grid gap-6">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("rawIdea")}</CardTitle>
              <CardDescription>
                {language === "no"
                  ? "Skriv inn ideen din eller råteksten som du vil konvertere til et innlegg."
                  : "Enter your idea or raw text that you want to convert into a post."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={t("rawIdeaPlaceholder")}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                rows={6}
                className="resize-none"
              />
              
              {/* Example Prompts */}
              {!rawInput && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {language === "no" ? "Trenger du inspirasjon? Prøv disse:" : "Need inspiration? Try these:"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRawInput(language === "no" 
                        ? "Vi har nettopp lansert vårt nye produkt som hjelper bedrifter med digital transformasjon"
                        : "We just launched our new product that helps businesses with digital transformation")}
                    >
                      {language === "no" ? "🚀 Produktlansering" : "🚀 Product launch"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRawInput(language === "no" 
                        ? "5 tips for å øke produktiviteten i teamet ditt"
                        : "5 tips to increase your team's productivity")}
                    >
                      {language === "no" ? "💡 Tips og råd" : "💡 Tips & advice"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRawInput(language === "no" 
                        ? "Vi søker etter en dyktig utvikler til vårt team i Oslo"
                        : "We're looking for a talented developer to join our team in Oslo")}
                    >
                      {language === "no" ? "👥 Jobbmulighet" : "👥 Job opportunity"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRawInput(language === "no" 
                        ? "Takk til alle som deltok på vårt webinar i dag! Her er hovedpunktene"
                        : "Thanks to everyone who attended our webinar today! Here are the key takeaways")}
                    >
                      {language === "no" ? "🎯 Event oppsummering" : "🎯 Event recap"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRawInput(language === "no" 
                        ? "Hvordan kunstig intelligens endrer måten vi jobber på"
                        : "How artificial intelligence is changing the way we work")}
                    >
                      {language === "no" ? "🤖 Teknologi trend" : "🤖 Tech trend"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRawInput(language === "no" 
                        ? "Feirer 5 år i business! Takk til alle våre kunder og partnere"
                        : "Celebrating 5 years in business! Thanks to all our customers and partners")}
                    >
                      {language === "no" ? "🎉 Milepæl" : "🎉 Milestone"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("selectPlatform")}</Label>
                  <Select value={platform} onValueChange={(v: any) => setPlatform(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">{t("linkedin")}</SelectItem>
                      <SelectItem value="twitter">{t("twitter")}</SelectItem>
                      <SelectItem value="instagram">{t("instagram")}</SelectItem>
                      <SelectItem value="facebook">{t("facebook")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("selectTone")}</Label>
                  <Select value={tone} onValueChange={(v: any) => setTone(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">{t("professional")}</SelectItem>
                      <SelectItem value="friendly">{t("friendly")}</SelectItem>
                      <SelectItem value="motivational">{t("motivational")}</SelectItem>
                      <SelectItem value="educational">{t("educational")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === "no" ? "Genererer..." : "Generating..."}
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    {t("generateButton")}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Card */}
          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle>{t("generatedContent")}</CardTitle>
                <CardDescription>
                  {language === "no"
                    ? "Ditt genererte innlegg er klart! Kopier det og lim det inn på sosiale medier."
                    : "Your generated post is ready! Copy it and paste it on social media."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                  {generatedContent}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCopy} className="flex-1">
                    <Copy className="mr-2 h-4 w-4" />
                    {t("copyToClipboard")}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setRawInput("");
                      setGeneratedContent("");
                      setAnalysis(null);
                    }}
                  >
                    {language === "no" ? "Generer ny" : "Generate new"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Content Coach Analysis */}
          {analysis && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  {language === "no" ? "AI Innholdscoach Analyse" : "AI Content Coach Analysis"}
                </CardTitle>
                <CardDescription>
                  {language === "no"
                    ? "Lær hvordan du kan forbedre innholdet ditt"
                    : "Learn how to improve your content"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Score */}
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "no" ? "Samlet poengsum" : "Overall Score"}
                    </p>
                    <p className="text-3xl font-bold text-primary">{analysis.overallScore}/100</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{language === "no" ? "Lengde" : "Length"}:</span>
                      <span className="font-medium">{analysis.lengthScore}/100</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{language === "no" ? "Engasjement" : "Engagement"}:</span>
                      <span className="font-medium">{analysis.engagementScore}/100</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{language === "no" ? "Lesbarhet" : "Readability"}:</span>
                      <span className="font-medium">{analysis.readabilityScore}/100</span>
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                {analysis.strengths && analysis.strengths.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      {language === "no" ? "Styrker" : "Strengths"}
                    </h4>
                    <ul className="space-y-1">
                      {analysis.strengths.map((strength: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground pl-6">
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {analysis.improvements && analysis.improvements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="text-orange-600">⚠️</span>
                      {language === "no" ? "Forbedringsområder" : "Areas for Improvement"}
                    </h4>
                    <ul className="space-y-1">
                      {analysis.improvements.map((improvement: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground pl-6">
                          • {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tips */}
                {analysis.tips && analysis.tips.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="text-blue-600">💡</span>
                      {language === "no" ? "Pro-tips" : "Pro Tips"}
                    </h4>
                    <ul className="space-y-1">
                      {analysis.tips.map((tip: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground pl-6">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{analysis.wordCount}</p>
                    <p className="text-xs text-muted-foreground">{language === "no" ? "Ord" : "Words"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{analysis.emojiCount}</p>
                    <p className="text-xs text-muted-foreground">{language === "no" ? "Emojier" : "Emojis"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{analysis.hashtagCount}</p>
                    <p className="text-xs text-muted-foreground">Hashtags</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{analysis.questionCount}</p>
                    <p className="text-xs text-muted-foreground">{language === "no" ? "Spørsmål" : "Questions"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
