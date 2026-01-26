import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function Settings() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [, setLocation] = useLocation();

  const updateLanguageMutation = trpc.user.updateLanguage.useMutation({
    onSuccess: () => {
      toast.success(t("settingsUpdated"));
    },
    onError: (error) => {
      toast.error(error.message || t("errorGeneral"));
    },
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
      window.location.href = "/";
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

  const handleLanguageChange = (newLang: "no" | "en") => {
    setLanguage(newLang);
    updateLanguageMutation.mutate({ language: newLang });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("settingsTitle")}</h1>
          <p className="text-muted-foreground">
            {language === "no"
              ? "Administrer kontoinnstillingene dine."
              : "Manage your account settings."}
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profile")}</CardTitle>
              <CardDescription>
                {language === "no"
                  ? "Din profilinformasjon."
                  : "Your profile information."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("name")}</Label>
                <div className="text-sm text-muted-foreground">
                  {user?.name || language === "no" ? "Ikke angitt" : "Not set"}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("email")}</Label>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle>{t("language")}</CardTitle>
              <CardDescription>
                {language === "no"
                  ? "Velg ditt foretrukne språk."
                  : "Select your preferred language."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>{t("language")}</Label>
                <Select value={language} onValueChange={(v: any) => handleLanguageChange(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">🇳🇴 {t("norwegian")}</SelectItem>
                    <SelectItem value="en">🇬🇧 {t("english")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>{t("subscriptionTitle")}</CardTitle>
              <CardDescription>
                {language === "no"
                  ? "Administrer ditt abonnement."
                  : "Manage your subscription."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/subscription")}>
                {t("manageSubscription")}
              </Button>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "no" ? "Logg ut" : "Log out"}
              </CardTitle>
              <CardDescription>
                {language === "no"
                  ? "Logg ut av kontoen din."
                  : "Log out of your account."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                {t("logout")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
