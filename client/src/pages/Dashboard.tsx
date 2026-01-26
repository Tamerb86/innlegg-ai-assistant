import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Zap, TrendingUp, Clock, Target, Sparkles } from "lucide-react";
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
            <span className="text-xl font-bold">Nexify AI</span>
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

        {/* Enhanced Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("postsGenerated")}
              </CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {subLoading ? "..." : subscription?.postsGenerated || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "no" ? "Totalt generert" : "Total generated"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("postsRemaining")}
              </CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {subLoading ? "..." : postsRemaining}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "no" ? "Gjenstående denne måneden" : "Remaining this month"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "no" ? "Tid spart" : "Time Saved"}
              </CardTitle>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {subLoading ? "..." : Math.round((subscription?.postsGenerated || 0) * 15)} min
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "no" ? "≈15 min per innlegg" : "≈15 min per post"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("subscriptionTitle")}
              </CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {subscription?.status === "trial" ? t("trialStatus") : t("activeStatus")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {subscription?.status === "trial" 
                  ? (language === "no" ? "14 dagers prøveperiode" : "14-day trial period")
                  : (language === "no" ? "Aktiv abonnement" : "Active subscription")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{language === "no" ? "Aktivitet siste 7 dager" : "Activity last 7 days"}</CardTitle>
              <CardDescription>
                {language === "no" ? "Oversikt over dine genererte innlegg" : "Overview of your generated posts"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { day: 'Man', posts: 0 },
                  { day: 'Tir', posts: 0 },
                  { day: 'Ons', posts: 0 },
                  { day: 'Tor', posts: 0 },
                  { day: 'Fre', posts: 0 },
                  { day: 'Lør', posts: 0 },
                  { day: 'Søn', posts: 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="posts" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground text-center mt-4">
                {language === "no" 
                  ? "Ingen aktivitet ennå. Start med å generere ditt første innlegg!"
                  : "No activity yet. Start by generating your first post!"}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0" onClick={() => setLocation("/generate")}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle className="text-white">{t("generateTitle")}</CardTitle>
              </div>
              <CardDescription className="text-blue-100">
                {t("rawIdea")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">{t("generateButton")}</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all hover:scale-105" onClick={() => setLocation("/posts")}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>{t("myPosts")}</CardTitle>
              </div>
              <CardDescription>
                {postsLoading ? t("loading") : `${posts?.length || 0} ${t("postsGenerated").toLowerCase()}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">{t("myPosts")}</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all hover:scale-105" onClick={() => setLocation("/coach")}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>{language === "no" ? "AI Coach" : "AI Coach"}</CardTitle>
              </div>
              <CardDescription>
                {language === "no" ? "Få personlig veiledning" : "Get personal guidance"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">{language === "no" ? "Start coaching" : "Start coaching"}</Button>
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
