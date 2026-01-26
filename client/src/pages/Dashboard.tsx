import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const { data: subscription, isLoading: subLoading } = trpc.user.getSubscription.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: posts, isLoading: postsLoading } = trpc.content.list.useQuery(undefined, {
    enabled: isAuthenticated,
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

  const postsRemaining = subscription?.status === "trial" 
    ? (subscription.trialPostsLimit - subscription.postsGenerated)
    : (100 - (subscription?.postsGenerated || 0));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Innlegg</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/generate")}>
              {t("generate")}
            </Button>
            <Button variant="ghost" onClick={() => setLocation("/posts")}>
              {t("myPosts")}
            </Button>
            <Button variant="ghost" onClick={() => setLocation("/coach")}>
              {language === "no" ? "Coach" : "Coach"}
            </Button>
            <Button variant="ghost" onClick={() => setLocation("/settings")}>
              {t("settings")}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t("dashboardTitle")}, {user?.name || user?.email}!
          </h1>
          <p className="text-muted-foreground">
            {subscription?.status === "trial" ? t("trialStatus") : t("activeStatus")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("postsGenerated")}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subLoading ? "..." : subscription?.postsGenerated || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("postsRemaining")}
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subLoading ? "..." : postsRemaining}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("subscriptionTitle")}
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subscription?.status === "trial" ? t("trialStatus") : t("activeStatus")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/generate")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {t("generateTitle")}
              </CardTitle>
              <CardDescription>
                {t("rawIdea")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">{t("generateButton")}</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/posts")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t("myPosts")}
              </CardTitle>
              <CardDescription>
                {postsLoading ? t("loading") : `${posts?.length || 0} ${t("postsGenerated").toLowerCase()}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">{t("myPosts")}</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>{t("recentPosts")}</CardTitle>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <p className="text-muted-foreground">{t("loading")}</p>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium capitalize">{post.platform}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground capitalize">{post.tone}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.generatedContent}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setLocation(`/posts`)}>
                      {t("edit")}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Zap className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">{t("noPostsYet")}</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {language === "no" 
                    ? "Begynn å lage profesjonelt innhold på sekunder! Skriv bare en idé, velg plattform og tone, og la AI gjøre resten."
                    : "Start creating professional content in seconds! Just write an idea, choose platform and tone, and let AI do the rest."}
                </p>
                <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto mb-6 text-left">
                  <div className="p-4 border rounded-lg">
                    <Zap className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-medium mb-1">
                      {language === "no" ? "Rask generering" : "Fast generation"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === "no" 
                        ? "Fra idé til ferdig innlegg på 30 sekunder"
                        : "From idea to finished post in 30 seconds"}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-medium mb-1">
                      {language === "no" ? "4 plattformer" : "4 platforms"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === "no" 
                        ? "LinkedIn, Twitter, Instagram, Facebook"
                        : "LinkedIn, Twitter, Instagram, Facebook"}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Zap className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-medium mb-1">
                      {language === "no" ? "Din stemme" : "Your voice"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === "no" 
                        ? "AI lærer din unike skrivest" : "AI learns your unique writing style"}
                    </p>
                  </div>
                </div>
                <Button size="lg" onClick={() => setLocation("/generate")}>{t("createFirstPost")}</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upgrade CTA if on trial */}
        {subscription?.status === "trial" && postsRemaining <= 2 && (
          <Card className="mt-8 border-primary">
            <CardHeader>
              <CardTitle>{t("upgradeNow")}</CardTitle>
              <CardDescription>
                {t("errorLimit")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setLocation("/subscription")}>
                {t("subscribe")} - 199 kr/måned
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
