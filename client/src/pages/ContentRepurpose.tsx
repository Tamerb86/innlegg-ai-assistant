import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Recycle, ArrowRight, Sparkles, TrendingUp, Copy, Cloud, Save, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function ContentRepurpose() {
  const [, setLocation] = useLocation();
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [targetPlatform, setTargetPlatform] = useState<string>("");
  const [repurposeType, setRepurposeType] = useState<string>("");

  const { data: posts, isLoading } = trpc.content.list.useQuery();
  const { data: subscription } = trpc.user.getSubscription.useQuery();

  // Auto-save draft functionality
  const [draftSaved, setDraftSaved] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { data: existingDraft } = trpc.drafts.get.useQuery({ pageType: "repurpose" });
  const saveDraftMutation = trpc.drafts.save.useMutation({
    onSuccess: () => {
      setDraftSaved(true);
      setLastSavedAt(new Date());
    },
  });
  const deleteDraftMutation = trpc.drafts.delete.useMutation();

  // Restore draft on load
  useEffect(() => {
    if (existingDraft && !selectedPost) {
      try {
        const formData = JSON.parse(existingDraft.formData);
        if (formData.selectedPost) setSelectedPost(formData.selectedPost);
        if (formData.targetPlatform) setTargetPlatform(formData.targetPlatform);
        if (formData.repurposeType) setRepurposeType(formData.repurposeType);
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
        selectedPost,
        targetPlatform,
        repurposeType,
      });
      
      if (selectedPost || targetPlatform || repurposeType) {
        saveDraftMutation.mutate({
          pageType: "repurpose",
          formData,
          title: "Gjenbruk utkast",
        });
      }
    }, 1500);
  }, [selectedPost, targetPlatform, repurposeType]);

  // Trigger auto-save when form changes
  useEffect(() => {
    if (selectedPost || targetPlatform || repurposeType) {
      setDraftSaved(false);
      autoSaveDraft();
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [selectedPost, targetPlatform, repurposeType, autoSaveDraft]);

  // Clear draft after successful repurpose
  const clearDraft = () => {
    deleteDraftMutation.mutate({ pageType: "repurpose" });
    setDraftSaved(false);
    setLastSavedAt(null);
  };

  const repurposeMutation = trpc.content.repurpose.useMutation({
    onSuccess: (data: any) => {
      toast.success("Innhold gjenbrukt!");
      clearDraft();
      setLocation(`/generate?content=${encodeURIComponent(data.content)}`);
    },
    onError: () => {
      toast.error("Kunne ikke gjenbruke innhold");
    },
  });

  const isPro = subscription?.status === "active";

  const repurposeTypes = [
    { value: "platform_adapt", label: "Tilpass til annen plattform", description: "Juster lengde og tone" },
    { value: "format_change", label: "Endre format", description: "Fra liste til fortelling, etc." },
    { value: "audience_shift", label: "Bytt målgruppe", description: "Fra B2B til B2C, etc." },
    { value: "update", label: "Oppdater med ny info", description: "Legg til nye data/insights" },
  ];

  const handleRepurpose = () => {
    if (!selectedPost || !targetPlatform || !repurposeType) {
      toast.error("Vennligst fyll ut alle feltene");
      return;
    }

    if (!isPro) {
      toast.error("Gjenbruk-Maskin krever Pro-abonnement");
      return;
    }

    repurposeMutation.mutate({
      postId: selectedPost,
      targetPlatform,
      repurposeType: repurposeType as "platform_adapt" | "format_change" | "audience_shift" | "update",
    });
  };

  // Sample successful repurpose examples
  const examples = [
    {
      original: { platform: "LinkedIn", content: "Lang artikkel om AI-trender (500 ord)" },
      repurposed: { platform: "Twitter", content: "5 tweets med key takeaways" },
      type: "platform_adapt",
      engagement: "+45%",
    },
    {
      original: { platform: "Instagram", content: "Visuell guide til produktivitet" },
      repurposed: { platform: "LinkedIn", content: "Profesjonell artikkel med data" },
      type: "audience_shift",
      engagement: "+67%",
    },
    {
      original: { platform: "Facebook", content: "Kundehistorie fra 2025" },
      repurposed: { platform: "LinkedIn", content: "Oppdatert case study 2026" },
      type: "update",
      engagement: "+89%",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Recycle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Gjenbruk-Maskin
              </h1>
              <p className="text-muted-foreground">
                Få mer ut av eksisterende innhold - tilpass og gjenbruk smart
              </p>
            </div>
          </div>

          {!isPro && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 mb-6">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-800">Gjenbruk-Maskin krever Pro-abonnement</p>
                      <p className="text-sm text-purple-700">Oppgrader for å maksimere verdien av ditt innhold</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                    Oppgrader nå
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Repurpose Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Gjenbruk innhold</CardTitle>
                <CardDescription>
                  Velg et innlegg og hvordan du vil gjenbruke det
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Select Post */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Velg innlegg å gjenbruke
                    </label>
                    <Select
                      value={selectedPost?.toString() || ""}
                      onValueChange={(value) => setSelectedPost(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Velg et innlegg..." />
                      </SelectTrigger>
                      <SelectContent>
                        {posts?.map((post: any) => (
                          <SelectItem key={post.id} value={post.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{post.platform}</Badge>
                              <span className="truncate max-w-xs">
                                {post.generatedContent.substring(0, 50)}...
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Repurpose Type */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Hvordan vil du gjenbruke?
                    </label>
                    <div className="grid gap-2">
                      {repurposeTypes.map((type) => (
                        <Card
                          key={type.value}
                          className={`cursor-pointer transition-all ${
                            repurposeType === type.value
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setRepurposeType(type.value)}
                        >
                          <CardContent className="pt-4 pb-4">
                            <div className="flex items-start gap-3">
                              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                                repurposeType === type.value
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                              }`}>
                                {repurposeType === type.value && (
                                  <div className="h-2 w-2 bg-white rounded-full" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{type.label}</p>
                                <p className="text-sm text-muted-foreground">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Target Platform */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Målplattform
                    </label>
                    <Select value={targetPlatform} onValueChange={setTargetPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg plattform..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleRepurpose}
                    disabled={!selectedPost || !targetPlatform || !repurposeType || repurposeMutation.isPending}
                  >
                    {repurposeMutation.isPending ? (
                      <>Gjenbruker...</>
                    ) : (
                      <>
                        <Recycle className="h-4 w-4 mr-2" />
                        Gjenbruk innhold
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Success Examples */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5" />
                  Suksesshistorier
                </CardTitle>
                <CardDescription>
                  Eksempler på vellykket gjenbruk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examples.map((example, index) => (
                    <Card key={index} className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {example.original.platform}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {example.original.content}
                            </p>
                          </div>
                          <div className="flex items-center justify-center">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {example.repurposed.platform}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {example.repurposed.content}
                            </p>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground capitalize">
                                {example.type.replace('_', ' ')}
                              </span>
                              <Badge className="bg-green-100 text-green-700">
                                {example.engagement}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="mt-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-sm">💡 Tips for gjenbruk</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Gjenbruk high-performing innhold</li>
                  <li>• Tilpass tone til hver plattform</li>
                  <li>• Oppdater med fersk data</li>
                  <li>• Test forskjellige formater</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
