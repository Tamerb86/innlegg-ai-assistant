import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Copy, Loader2, Sparkles, Wand2, Upload, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function Generate() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<"linkedin" | "twitter" | "instagram" | "facebook">("linkedin");
  const [tone, setTone] = useState<"professional" | "casual" | "friendly" | "formal" | "humorous">("professional");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [keywords, setKeywords] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [postsRemaining, setPostsRemaining] = useState<number | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const uploadImageMutation = trpc.blog.uploadImage.useMutation({
    onSuccess: (data) => {
      setUploadedImage(data.url);
      setIsUploadingImage(false);
      toast.success("Bilde lastet opp!");
    },
    onError: (error) => {
      setIsUploadingImage(false);
      toast.error(error.message || "Kunne ikke laste opp bilde");
    },
  });

  const generateMutation = trpc.content.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      setPostsRemaining(data.postsRemaining);
      toast.success("Innhold generert!");
    },
    onError: (error) => {
      if (error.message.includes("Trial limit reached")) {
        toast.error("Prøveperiode brukt opp. Oppgrader for å fortsette.");
      } else {
        toast.error(error.message || "Noe gikk galt. Prøv igjen.");
      }
    },
  });

  const improveMutation = trpc.content.improve.useMutation({
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      toast.success("Innhold forbedret!");
    },
    onError: (error) => {
      toast.error(error.message || "Kunne ikke forbedre innholdet.");
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
    if (!topic.trim()) {
      toast.error("Vennligst skriv inn et emne");
      return;
    }

    const keywordsArray = keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    generateMutation.mutate({
      topic,
      platform,
      tone,
      length,
      keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
    });
  };

  const handleImprove = (improvementType: "grammar" | "engagement" | "clarity" | "tone") => {
    if (!generatedContent) {
      toast.error("Ingen innhold å forbedre");
      return;
    }

    improveMutation.mutate({
      content: generatedContent,
      platform,
      improvementType,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Kopiert til utklippstavlen!");
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vennligst last opp et bilde");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Bildet er for stort. Maks 5MB.");
      return;
    }

    setIsUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        uploadImageMutation.mutate({
          fileData: base64String,
          fileName: file.name,
          contentType: file.type,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploadingImage(false);
      toast.error("Kunne ikke laste opp bilde");
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    toast.success("Bilde fjernet");
  };

  const platformInfo = {
    linkedin: { icon: "💼", name: "LinkedIn", maxChars: 3000 },
    twitter: { icon: "🐦", name: "Twitter/X", maxChars: 280 },
    instagram: { icon: "📸", name: "Instagram", maxChars: 2200 },
    facebook: { icon: "👥", name: "Facebook", maxChars: 63206 },
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Generer Innhold med AI
          </h1>
          <p className="text-muted-foreground text-lg">
            Skriv inn emnet ditt, velg plattform og tone, og la AI lage profesjonelt innhold på sekunder.
          </p>
          {postsRemaining !== null && (
            <p className="text-sm text-muted-foreground mt-2">
              📊 Du har {postsRemaining} innlegg igjen i prøveperioden
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Innstillinger
                </CardTitle>
                <CardDescription>
                  Konfigurer innholdet ditt for optimal engasjement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic">Emne / Idé *</Label>
                  <Textarea
                    id="topic"
                    placeholder="F.eks: 'Hvordan AI endrer fremtiden for markedsføring' eller 'Vi lanserer et nytt produkt som...'"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Platform Selection */}
                <div className="space-y-2">
                  <Label htmlFor="platform">Plattform *</Label>
                  <Select value={platform} onValueChange={(value: any) => setPlatform(value)}>
                    <SelectTrigger id="platform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(platformInfo).map(([key, info]) => (
                        <SelectItem key={key} value={key}>
                          {info.icon} {info.name} (maks {info.maxChars} tegn)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tone Selection */}
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={(value: any) => setTone(value)}>
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Profesjonell</SelectItem>
                      <SelectItem value="casual">Uformell</SelectItem>
                      <SelectItem value="friendly">Vennlig</SelectItem>
                      <SelectItem value="formal">Formell</SelectItem>
                      <SelectItem value="humorous">Humoristisk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Length Selection */}
                <div className="space-y-2">
                  <Label htmlFor="length">Lengde</Label>
                  <Select value={length} onValueChange={(value: any) => setLength(value)}>
                    <SelectTrigger id="length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Kort (rask og konsis)</SelectItem>
                      <SelectItem value="medium">Medium (balansert)</SelectItem>
                      <SelectItem value="long">Lang (detaljert)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Keywords Input */}
                <div className="space-y-2">
                  <Label htmlFor="keywords">Nøkkelord (valgfritt)</Label>
                  <Input
                    id="keywords"
                    placeholder="AI, markedsføring, innovasjon (skill med komma)"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Legg til nøkkelord du vil inkludere i innholdet, skill med komma
                  </p>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Bilde (valgfritt)</Label>
                  {!uploadedImage ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploadingImage}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          {isUploadingImage ? (
                            <>
                              <Loader2 className="h-8 w-8 text-primary animate-spin" />
                              <p className="text-sm text-muted-foreground">Laster opp...</p>
                            </>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <p className="text-sm font-medium">Klikk for å laste opp bilde</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG, GIF opptil 5MB</p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative border rounded-lg overflow-hidden">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                        aria-label="Fjern bilde"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Last opp et bilde som skal følge med innlegget ditt
                  </p>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending || !topic.trim()}
                  className="w-full"
                  size="lg"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Genererer...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      Generer Innhold
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generert Innhold</CardTitle>
                <CardDescription>
                  Ditt AI-genererte innhold vises her
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedContent ? (
                  <>
                    <div className="relative">
                      <Textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        rows={12}
                        className="resize-none font-mono text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleCopy}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Character Count */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {generatedContent.length} / {platformInfo[platform].maxChars} tegn
                      </span>
                      {generatedContent.length > platformInfo[platform].maxChars && (
                        <span className="text-destructive font-medium">
                          ⚠️ Over grensen!
                        </span>
                      )}
                    </div>

                    {/* Improvement Buttons */}
                    <div className="space-y-2">
                      <Label>Forbedre innholdet:</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImprove("grammar")}
                          disabled={improveMutation.isPending}
                        >
                          ✍️ Grammatikk
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImprove("engagement")}
                          disabled={improveMutation.isPending}
                        >
                          🔥 Engasjement
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImprove("clarity")}
                          disabled={improveMutation.isPending}
                        >
                          💡 Klarhet
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImprove("tone")}
                          disabled={improveMutation.isPending}
                        >
                          🎭 Tone
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Sparkles className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      Fyll ut skjemaet og klikk "Generer Innhold" for å starte
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
