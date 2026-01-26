import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Copy, Zap, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function Posts() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.content.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const deleteMutation = trpc.content.delete.useMutation({
    onSuccess: () => {
      utils.content.list.invalidate();
      toast.success(t("postDeleted"));
    },
    onError: (error) => {
      toast.error(error.message || t("errorGeneral"));
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

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success(t("copiedSuccess"));
  };

  const handleDelete = (postId: number) => {
    if (window.confirm(language === "no" ? "Er du sikker på at du vil slette dette innlegget?" : "Are you sure you want to delete this post?")) {
      deleteMutation.mutate({ postId });
    }
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
            <Button variant="ghost" onClick={() => setLocation("/generate")}>
              {t("generate")}
            </Button>
            <Button variant="ghost" onClick={() => setLocation("/settings")}>
              {t("settings")}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("myPosts")}</h1>
            <p className="text-muted-foreground">
              {isLoading ? t("loading") : `${posts?.length || 0} ${t("postsGenerated").toLowerCase()}`}
            </p>
          </div>
          <Button onClick={() => setLocation("/generate")}>
            <Zap className="mr-2 h-4 w-4" />
            {t("generateButton")}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                          {post.platform}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize">
                          {post.tone}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString(language === "no" ? "no-NO" : "en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">
                          {language === "no" ? "Original idé:" : "Original idea:"}
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                          {post.rawInput}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">
                          {language === "no" ? "Generert innhold:" : "Generated content:"}
                        </p>
                        <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                          {post.generatedContent}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(post.generatedContent)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Zap className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">{t("noPostsYet")}</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {language === "no" 
                  ? "Du har ikke generert noe innhold ennå. Klikk på knappen nedenfor for å lage ditt første profesjonelle innlegg!"
                  : "You haven't generated any content yet. Click the button below to create your first professional post!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="text-sm">
                    {language === "no" ? "30 sekunder" : "30 seconds"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Copy className="h-5 w-5 text-primary" />
                  <span className="text-sm">
                    {language === "no" ? "4 plattformer" : "4 platforms"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="text-sm">
                    {language === "no" ? "Din stemme" : "Your voice"}
                  </span>
                </div>
              </div>
              <Button size="lg" onClick={() => setLocation("/generate")}>
                <Zap className="mr-2 h-4 w-4" />
                {t("createFirstPost")}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
