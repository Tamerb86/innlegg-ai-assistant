import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Copy, Loader2, Sparkles, Wand2, Upload, X, Image as ImageIcon, Mic, Flame, Save, Cloud } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function Generate() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();

  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<"linkedin" | "twitter" | "instagram" | "facebook">("linkedin");
  const [tone, setTone] = useState<"professional" | "casual" | "friendly" | "formal" | "humorous">("professional");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [keywords, setKeywords] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [postsRemaining, setPostsRemaining] = useState<number | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [generateAIImage, setGenerateAIImage] = useState(false);
  const [imageGenerationType, setImageGenerationType] = useState<"dalle" | "nanoBanana">("nanoBanana");
  const [imageStyle, setImageStyle] = useState<"minimalist" | "bold" | "professional" | "creative">("professional");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImagePrompt, setGeneratedImagePrompt] = useState<string | null>(null);

  const { data: subscription } = trpc.user.getSubscription.useQuery();
  const { data: voiceProfile } = trpc.voice.getProfile.useQuery();
  const [useVoiceProfile, setUseVoiceProfile] = useState(false);

  // State for idea tracking
  const [currentIdeaId, setCurrentIdeaId] = useState<number | null>(null);
  const markIdeaAsUsed = trpc.ideas.markAsUsed.useMutation();

  // Auto-save draft functionality
  const [draftSaved, setDraftSaved] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { data: existingDraft } = trpc.drafts.get.useQuery({ pageType: "generate" });
  const saveDraftMutation = trpc.drafts.save.useMutation({
    onSuccess: () => {
      setDraftSaved(true);
      setLastSavedAt(new Date());
    },
  });
  const deleteDraftMutation = trpc.drafts.delete.useMutation();

  // Restore draft on load
  useEffect(() => {
    if (existingDraft && !topic) {
      try {
        const formData = JSON.parse(existingDraft.formData);
        if (formData.topic) setTopic(formData.topic);
        if (formData.platform) setPlatform(formData.platform);
        if (formData.tone) setTone(formData.tone);
        if (formData.length) setLength(formData.length);
        if (formData.keywords) setKeywords(formData.keywords);
        if (formData.useVoiceProfile !== undefined) setUseVoiceProfile(formData.useVoiceProfile);
        if (formData.generateAIImage !== undefined) setGenerateAIImage(formData.generateAIImage);
        if (formData.imageStyle) setImageStyle(formData.imageStyle);
        toast.info("Utkast gjenopprettet", { duration: 2000 });
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, [existingDraft]);

  // Auto-save with debounce
  const autoSaveDraft = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      const formData = JSON.stringify({
        topic,
        platform,
        tone,
        length,
        keywords,
        useVoiceProfile,
        generateAIImage,
        imageStyle,
      });
      
      // Only save if there's content
      if (topic.trim()) {
        saveDraftMutation.mutate({
          pageType: "generate",
          formData,
          title: topic.substring(0, 50) || "Utkast",
        });
      }
    }, 1500); // 1.5 second debounce
  }, [topic, platform, tone, length, keywords, useVoiceProfile, generateAIImage, imageStyle]);

  // Trigger auto-save when form changes
  useEffect(() => {
    if (topic) {
      setDraftSaved(false);
      autoSaveDraft();
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [topic, platform, tone, length, keywords, useVoiceProfile, generateAIImage, imageStyle, autoSaveDraft]);

  // Clear draft after successful generation
  const clearDraft = () => {
    deleteDraftMutation.mutate({ pageType: "generate" });
    setDraftSaved(false);
    setLastSavedAt(null);
  };

  // Handle URL parameters from Trends page or Idea Bank
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const topicParam = urlParams.get('topic');
    const ideaParam = urlParams.get('idea');
    const ideaIdParam = urlParams.get('ideaId');
    const platformParam = urlParams.get('platform');
    
    if (ideaParam) {
      setTopic(decodeURIComponent(ideaParam));
      toast.success('Idé lastet inn! Klar til å generere innhold.');
      if (ideaIdParam) {
        setCurrentIdeaId(parseInt(ideaIdParam));
      }
    } else if (topicParam) {
      setTopic(decodeURIComponent(topicParam));
      toast.success('Trend lastet inn! Klar til å generere innhold.');
    }
    if (platformParam && ['linkedin', 'twitter', 'instagram', 'facebook'].includes(platformParam)) {
      setPlatform(platformParam as any);
    }
  }, []);

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

  const generateImageDallEMutation = trpc.content.generateImageDallE.useMutation({
    onSuccess: (data) => {
      setUploadedImage(data.url);
      setGeneratedImagePrompt(data.prompt);
      setIsGeneratingImage(false);
      toast.success("Bilde generert med DALL-E 3!");
    },
    onError: (error) => {
      setIsGeneratingImage(false);
      toast.error(error.message || "Kunne ikke generere bilde");
    },
  });

  const generateImageNanoBananaMutation = trpc.content.generateImageNanoBanana.useMutation({
    onSuccess: (data) => {
      setUploadedImage(data.url);
      setGeneratedImagePrompt(data.prompt);
      setIsGeneratingImage(false);
      toast.success("Bilde generert med Nano Banana!");
    },
    onError: (error) => {
      setIsGeneratingImage(false);
      toast.error(error.message || "Kunne ikke generere bilde");
    },
  });

  const generateMutation = trpc.content.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      setPostsRemaining(data.postsRemaining);
      toast.success("Innhold generert!");
      
      // Clear draft after successful generation
      clearDraft();
      
      // Mark idea as used if this came from Idea Bank
      if (currentIdeaId && data.postId) {
        markIdeaAsUsed.mutate({ id: currentIdeaId, postId: data.postId });
        setCurrentIdeaId(null);
      }
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
    setGeneratedImagePrompt(null);
    toast.success("Bilde fjernet");
  };

  const handleGenerateAIImage = () => {
    if (!topic.trim()) {
      toast.error("Vennligst skriv inn et emne først");
      return;
    }

    const keywordsArray = keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    setIsGeneratingImage(true);

    const imageInput = {
      topic,
      platform,
      tone,
      keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
    };

    if (imageGenerationType === "dalle") {
      generateImageDallEMutation.mutate(imageInput);
    } else {
      generateImageNanoBananaMutation.mutate(imageInput);
    }
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
          {/* Auto-save indicator */}
          {topic && (
            <div className="flex items-center gap-2 mt-2 text-sm">
              {saveDraftMutation.isPending ? (
                <span className="text-muted-foreground flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Lagrer...
                </span>
              ) : draftSaved ? (
                <span className="text-green-600 flex items-center gap-1">
                  <Cloud className="h-3 w-3" />
                  Utkast lagret {lastSavedAt && `kl. ${lastSavedAt.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}`}
                </span>
              ) : (
                <span className="text-muted-foreground flex items-center gap-1">
                  <Save className="h-3 w-3" />
                  Endringer vil bli lagret automatisk
                </span>
              )}
            </div>
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

                {/* Voice Profile Toggle */}
                {voiceProfile?.trainingStatus === "trained" && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="use-voice-profile"
                        checked={useVoiceProfile}
                        onChange={(e) => setUseVoiceProfile(e.target.checked)}
                        className="h-4 w-4 rounded border-purple-300"
                      />
                      <div className="flex-1">
                        <Label htmlFor="use-voice-profile" className="cursor-pointer font-medium flex items-center gap-2">
                          <Mic className="h-4 w-4 text-purple-600" />
                          Bruk din stemme
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          AI vil skrive i din personlige stil basert på stemmetrening
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!voiceProfile?.trainingStatus && subscription?.status === "active" && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mic className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Tren din stemme</p>
                        <p className="text-xs text-muted-foreground">
                          Lær AI å skrive som deg for mer personlig innhold
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setLocation("/voice-training")}>
                        Start trening
                      </Button>
                    </div>
                  </div>
                )}

                {/* AI Image Generation */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="generate-ai-image"
                      checked={generateAIImage}
                      onChange={(e) => setGenerateAIImage(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="generate-ai-image" className="cursor-pointer font-medium">
                      🎨 Generer bilde med AI
                    </Label>
                  </div>

                  {generateAIImage && (
                    <div className="space-y-3 pl-6 border-l-2 border-primary/30">
                      <div className="space-y-2">
                        <Label>Velg AI-modell</Label>
                        {subscription?.status === "trial" ? (
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm font-medium text-amber-800 mb-2">🔒 AI-bilder krever Pro-abonnement</p>
                            <p className="text-xs text-amber-700 mb-3">Oppgrader til Pro for å generere bilder med AI (Nano Banana eller DALL-E 3).</p>
                            <Button variant="outline" size="sm" className="w-full border-amber-300 text-amber-800 hover:bg-amber-100">
                              Oppgrader til Pro - 199 kr/mnd
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {/* Image Style Selection */}
                            <div className="space-y-2">
                              <Label>Bildestil</Label>
                              <Select value={imageStyle} onValueChange={(value: typeof imageStyle) => setImageStyle(value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="minimalist">
                                    <div className="flex items-center gap-2">
                                      <span>🎯</span>
                                      <span>Minimalistisk - Ren og enkel</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="bold">
                                    <div className="flex items-center gap-2">
                                      <span>💥</span>
                                      <span>Modig - Sterke farger og kontraster</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="professional">
                                    <div className="flex items-center gap-2">
                                      <span>💼</span>
                                      <span>Profesjonell - Elegant og seriøs</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="creative">
                                    <div className="flex items-center gap-2">
                                      <span>🎨</span>
                                      <span>Kreativ - Kunstnerisk og unik</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Model Selection */}
                            <div className="space-y-2">
                              <Label>AI-modell</Label>
                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                              <input
                                type="radio"
                                name="image-type"
                                value="nanoBanana"
                                checked={imageGenerationType === "nanoBanana"}
                                onChange={(e) => setImageGenerationType(e.target.value as "dalle" | "nanoBanana")}
                                className="h-4 w-4"
                              />
                              <div className="flex-1">
                                <div className="font-medium flex items-center gap-2">
                                  🍌 Nano Banana (Gemini)
                                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">PRO</span>
                                </div>
                                <p className="text-xs text-muted-foreground">God kvalitet, rask generering</p>
                              </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                              <input
                                type="radio"
                                name="image-type"
                                value="dalle"
                                checked={imageGenerationType === "dalle"}
                                onChange={(e) => setImageGenerationType(e.target.value as "dalle" | "nanoBanana")}
                                className="h-4 w-4"
                              />
                              <div className="flex-1">
                                <div className="font-medium flex items-center gap-2">
                                  ✨ DALL-E 3
                                  <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">PRO</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Høyeste kvalitet, profesjonell</p>
                              </div>
                            </label>
                            </div>
                          </div>
                        )}
                      </div>

                      {subscription?.status !== "trial" && (
                        <Button
                          onClick={handleGenerateAIImage}
                          disabled={isGeneratingImage || !topic.trim()}
                          variant="outline"
                          className="w-full"
                        >
                        {isGeneratingImage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Genererer bilde...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Generer bilde
                          </>
                        )}
                      </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Image Upload or Display */}
                {!generateAIImage && (
                  <div className="space-y-2">
                    <Label htmlFor="image">Eller last opp bilde manuelt</Label>
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
                        {generatedImagePrompt && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                            🤖 AI-generert
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Show uploaded/generated image when AI generation is enabled */}
                {generateAIImage && uploadedImage && (
                  <div className="space-y-2">
                    <Label>Generert bilde</Label>
                    <div className="relative border rounded-lg overflow-hidden">
                      <img
                        src={uploadedImage}
                        alt="AI Generated"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                        aria-label="Fjern bilde"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-3">
                        <p className="text-xs font-medium">
                          🤖 Generert med {imageGenerationType === "dalle" ? "DALL-E 3" : "Nano Banana"}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleGenerateAIImage}
                      disabled={isGeneratingImage}
                      variant="ghost"
                      size="sm"
                      className="w-full"
                    >
                      🔄 Regenerer bilde
                    </Button>
                  </div>
                )}

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
