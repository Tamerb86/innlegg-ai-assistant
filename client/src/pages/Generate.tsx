import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
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

  const generateMutation = trpc.content.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedContent(data.generatedContent);
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
                    }}
                  >
                    {language === "no" ? "Generer ny" : "Generate new"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
