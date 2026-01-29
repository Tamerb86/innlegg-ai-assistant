import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap, AlertTriangle, CreditCard, CheckCircle2, Crown, Loader2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { PAGE_DESCRIPTIONS } from "@/lib/pageDescriptions";
import { Linkedin } from "lucide-react";

function RestartTourButton({ language }: { language: "no" | "en" }) {
  const restartMutation = trpc.user.restartOnboarding.useMutation({
    onSuccess: () => {
      toast.success(language === "no" ? "Omvisning startet på nytt! Last inn siden på nytt." : "Tour restarted! Reload the page.");
      setTimeout(() => window.location.reload(), 1500);
    },
    onError: () => {
      toast.error(language === "no" ? "Kunne ikke starte omvisning på nytt" : "Could not restart tour");
    },
  });

  return (
    <Button 
      variant="outline" 
      onClick={() => restartMutation.mutate()}
      disabled={restartMutation.isPending}
    >
      {restartMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : null}
      {language === "no" ? "Start omvisning på nytt" : "Restart Tour"}
    </Button>
  );
}

function SubscriptionCard({ language }: { language: "no" | "en" }) {
  const { data: subscription, isLoading } = trpc.user.getSubscription.useQuery();
  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      // Open Stripe Checkout in new tab
      window.open(data.url, "_blank");
      toast.success(language === "no" ? "Omdirigerer til betaling..." : "Redirecting to payment...");
    },
    onError: (error) => {
      toast.error(error.message || (language === "no" ? "Kunne ikke starte betaling" : "Could not start payment"));
    },
  });

  const getPortalMutation = trpc.stripe.getPortalUrl.useMutation({
    onSuccess: (data) => {
      window.open(data.url, "_blank");
    },
    onError: (error) => {
      toast.error(error.message || (language === "no" ? "Kunne ikke åpne kundeportal" : "Could not open customer portal"));
    },
  });

  const handleUpgrade = (plan: "PRO_MONTHLY" | "PRO_YEARLY") => {
    createCheckoutMutation.mutate({ productKey: plan });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const isPro = subscription?.status === "active";
  const isTrial = subscription?.status === "trial";

  return (
    <Card className={isPro ? "border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isPro ? (
            <>
              <Crown className="h-5 w-5 text-green-600" />
              <span className="text-green-700">
                {language === "no" ? "Pro-abonnement" : "Pro Subscription"}
              </span>
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              {language === "no" ? "Abonnement" : "Subscription"}
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isPro
            ? (language === "no" ? "Du har full tilgang til alle funksjoner" : "You have full access to all features")
            : (language === "no" ? "Oppgrader for å låse opp alle funksjoner" : "Upgrade to unlock all features")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPro ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                {language === "no" ? "Aktiv til: " : "Active until: "}
                {subscription?.subscriptionEndDate
                  ? new Date(subscription.subscriptionEndDate).toLocaleDateString("nb-NO")
                  : "Ubegrenset"}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => getPortalMutation.mutate()}
              disabled={getPortalMutation.isPending}
            >
              {getPortalMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {language === "no" ? "Administrer abonnement" : "Manage Subscription"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {isTrial && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  <Zap className="h-4 w-4 inline mr-1" />
                  {language === "no"
                    ? `Du har ${5 - (subscription?.postsGenerated || 0)} innlegg igjen i prøveperioden`
                    : `You have ${5 - (subscription?.postsGenerated || 0)} posts left in your trial`}
                </p>
              </div>
            )}
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* Monthly Plan */}
              <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                <h4 className="font-semibold mb-1">
                  {language === "no" ? "Månedlig" : "Monthly"}
                </h4>
                <p className="text-2xl font-bold text-primary">199 kr<span className="text-sm font-normal text-muted-foreground">/mnd</span></p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• 100 innlegg/måned</li>
                  <li>• AI-bilder inkludert</li>
                  <li>• Stemmetrening</li>
                </ul>
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-primary to-purple-600"
                  onClick={() => handleUpgrade("PRO_MONTHLY")}
                  disabled={createCheckoutMutation.isPending}
                >
                  {createCheckoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {language === "no" ? "Velg månedlig" : "Choose Monthly"}
                </Button>
              </div>
              
              {/* Yearly Plan */}
              <div className="border-2 border-green-500 rounded-lg p-4 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {language === "no" ? "Spar 20%" : "Save 20%"}
                </div>
                <h4 className="font-semibold mb-1">
                  {language === "no" ? "Årlig" : "Yearly"}
                </h4>
                <p className="text-2xl font-bold text-green-600">1910 kr<span className="text-sm font-normal text-muted-foreground">/år</span></p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• 1200 innlegg/år</li>
                  <li>• Alt i månedlig</li>
                  <li>• Prioritert support</li>
                </ul>
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600"
                  onClick={() => handleUpgrade("PRO_YEARLY")}
                  disabled={createCheckoutMutation.isPending}
                >
                  {createCheckoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {language === "no" ? "Velg årlig" : "Choose Yearly"}
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              {language === "no"
                ? "Sikker betaling med Stripe. Kanseller når som helst."
                : "Secure payment with Stripe. Cancel anytime."}
            </p>
            
            {/* Vipps Coming Soon */}
            <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    {language === "no" ? "Vipps kommer snart!" : "Vipps coming soon!"}
                  </p>
                  <p className="text-xs text-orange-600">
                    {language === "no"
                      ? "Betal enkelt med Vipps - Norges favoritt betalingsapp"
                      : "Pay easily with Vipps - Norway's favorite payment app"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LinkedInConnectionStatus({ language }: { language: "no" | "en" }) {
  const { data: connectionStatus, isLoading, refetch } = trpc.linkedin.getConnectionStatus.useQuery();
  const { data: authUrl } = trpc.linkedin.getAuthUrl.useQuery(undefined, {
    enabled: false, // Don't fetch automatically
  });
  const disconnectMutation = trpc.linkedin.disconnect.useMutation({
    onSuccess: () => {
      toast.success(language === "no" ? "LinkedIn frakoblet!" : "LinkedIn disconnected!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || (language === "no" ? "Kunne ikke koble fra" : "Could not disconnect"));
    },
  });

  const utils = trpc.useUtils();
  
  const handleConnect = async () => {
    try {
      const result = await utils.linkedin.getAuthUrl.fetch();
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error: any) {
      toast.error(error.message || (language === "no" ? "Kunne ikke generere autorisasjons-URL" : "Could not generate authorization URL"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {language === "no" ? "Sjekker tilkobling..." : "Checking connection..."}
      </div>
    );
  }

  if (connectionStatus?.connected) {
    return (
      <div className="space-y-3 p-4 border rounded-lg bg-green-50 dark:bg-green-950">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">
            {language === "no" ? "LinkedIn tilkoblet" : "LinkedIn connected"}
          </span>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>{language === "no" ? "Navn:" : "Name:"}</strong> {connectionStatus.profileName}</p>
          <p><strong>{language === "no" ? "E-post:" : "Email:"}</strong> {connectionStatus.profileEmail}</p>
          <p><strong>{language === "no" ? "Utløper:" : "Expires:"}</strong> {connectionStatus.expiresAt ? new Date(connectionStatus.expiresAt).toLocaleDateString() : "N/A"}</p>
        </div>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => disconnectMutation.mutate()}
          disabled={disconnectMutation.isPending}
        >
          {disconnectMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {language === "no" ? "Kobler fra..." : "Disconnecting..."}
            </>
          ) : (
            language === "no" ? "Koble fra LinkedIn" : "Disconnect LinkedIn"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
        <AlertCircle className="h-5 w-5" />
        <span className="font-medium">
          {language === "no" ? "LinkedIn ikke tilkoblet" : "LinkedIn not connected"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        {language === "no"
          ? "Koble til LinkedIn for å publisere innlegg automatisk."
          : "Connect LinkedIn to publish posts automatically."}
      </p>
      <Button 
        variant="default" 
        size="sm"
        onClick={handleConnect}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Linkedin className="h-4 w-4 mr-2" />
        {language === "no" ? "Koble til LinkedIn" : "Connect LinkedIn"}
      </Button>
    </div>
  );
}

function LinkedInSaveButton({ clientId, clientSecret, language }: { clientId: string; clientSecret: string; language: "no" | "en" }) {
  const saveCredentialsMutation = trpc.linkedin.saveCredentials.useMutation({
    onSuccess: () => {
      toast.success(language === "no" ? "LinkedIn API-legitimasjon lagret!" : "LinkedIn API credentials saved!");
    },
    onError: (error) => {
      toast.error(error.message || (language === "no" ? "Kunne ikke lagre legitimasjon" : "Could not save credentials"));
    },
  });

  const handleSave = () => {
    if (!clientId || !clientSecret) {
      toast.error(language === "no" ? "Fyll inn begge feltene" : "Fill in both fields");
      return;
    }
    saveCredentialsMutation.mutate({ clientId, clientSecret });
  };

  return (
    <Button 
      variant="default" 
      onClick={handleSave}
      disabled={saveCredentialsMutation.isPending || !clientId || !clientSecret}
    >
      {saveCredentialsMutation.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          {language === "no" ? "Lagrer..." : "Saving..."}
        </>
      ) : (
        language === "no" ? "Lagre" : "Save"
      )}
    </Button>
  );
}

function DeleteAccountDialog({ language }: { language: "no" | "en" }) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const deleteAccountMutation = trpc.user.deleteAccount.useMutation({
    onSuccess: () => {
      toast.success(language === "no" ? "Kontoen din er slettet" : "Your account has been deleted");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.message || (language === "no" ? "Kunne ikke slette konto" : "Could not delete account"));
    },
  });

  const handleDelete = () => {
    if (confirmation === "DELETE") {
      deleteAccountMutation.mutate({ confirmation: "DELETE" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          {language === "no" ? "Slett konto" : "Delete Account"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {language === "no" ? "Bekreft sletting av konto" : "Confirm Account Deletion"}
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-4">
            <p className="font-semibold text-foreground">
              {language === "no"
                ? "Dette vil permanent slette:"
                : "This will permanently delete:"}
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>{language === "no" ? "All kontoinformasjon" : "All account information"}</li>
              <li>{language === "no" ? "Alle genererte innlegg" : "All generated posts"}</li>
              <li>{language === "no" ? "Alle opplastede bilder" : "All uploaded images"}</li>
              <li>{language === "no" ? "Abonnementshistorikk" : "Subscription history"}</li>
            </ul>
            <p className="text-red-600 dark:text-red-400 font-semibold pt-2">
              {language === "no"
                ? "⚠️ Denne handlingen kan IKKE angres!"
                : "⚠️ This action CANNOT be undone!"}
            </p>
            <div className="pt-4 space-y-2">
              <Label>
                {language === "no"
                  ? 'Skriv "DELETE" for å bekrefte:'
                  : 'Type "DELETE" to confirm:'}
              </Label>
              <Input
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="DELETE"
                className="font-mono"
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={deleteAccountMutation.isPending}>
            {language === "no" ? "Avbryt" : "Cancel"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmation !== "DELETE" || deleteAccountMutation.isPending}
          >
            {deleteAccountMutation.isPending
              ? (language === "no" ? "Sletter..." : "Deleting...")
              : (language === "no" ? "Slett konto permanent" : "Delete Account Permanently")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Settings() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [, setLocation] = useLocation();
  const [linkedinClientId, setLinkedinClientId] = useState("");
  const [linkedinClientSecret, setLinkedinClientSecret] = useState("");

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
          <PageHeader title="Innstillinger" description={PAGE_DESCRIPTIONS.settings} />
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
          <SubscriptionCard language={language} />

          {/* LinkedIn API Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-blue-600" />
                {language === "no" ? "LinkedIn API" : "LinkedIn API"}
              </CardTitle>
              <CardDescription>
                {language === "no"
                  ? "Konfigurer LinkedIn API for å publisere innlegg automatisk."
                  : "Configure LinkedIn API to publish posts automatically."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin-client-id">
                  {language === "no" ? "Client ID" : "Client ID"}
                </Label>
                <Input
                  id="linkedin-client-id"
                  placeholder="77xxxxxxxxxx"
                  type="text"
                  value={linkedinClientId}
                  onChange={(e) => setLinkedinClientId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin-client-secret">
                  {language === "no" ? "Client Secret" : "Client Secret"}
                </Label>
                <Input
                  id="linkedin-client-secret"
                  placeholder="WPL_AP1.xxxxxxxxxxxx"
                  type="password"
                  value={linkedinClientSecret}
                  onChange={(e) => setLinkedinClientSecret(e.target.value)}
                />
              </div>
              <LinkedInSaveButton 
                clientId={linkedinClientId}
                clientSecret={linkedinClientSecret}
                language={language}
              />
              
              <LinkedInConnectionStatus language={language} />
              
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href="https://www.linkedin.com/developers/" target="_blank" rel="noopener noreferrer">
                    {language === "no" ? "Opprett LinkedIn App" : "Create LinkedIn App"}
                  </a>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">
                  {language === "no" ? "📝 Slik setter du opp:" : "📝 How to setup:"}
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>{language === "no" ? "Gå til LinkedIn Developer Portal" : "Go to LinkedIn Developer Portal"}</li>
                  <li>{language === "no" ? "Opprett ny app" : "Create new app"}</li>
                  <li>{language === "no" ? "Kopier Client ID og Client Secret" : "Copy Client ID and Client Secret"}</li>
                  <li>{language === "no" ? "Lim inn her og lagre" : "Paste here and save"}</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {language === "no" ? "Slett konto" : "Delete Account"}
              </CardTitle>
              <CardDescription>
                {language === "no"
                  ? "Slett kontoen din permanent. Denne handlingen kan ikke angres."
                  : "Permanently delete your account. This action cannot be undone."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteAccountDialog language={language} />
            </CardContent>
          </Card>

          {/* Restart Onboarding Tour */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "no" ? "Omvisning" : "Tour"}
              </CardTitle>
              <CardDescription>
                {language === "no"
                  ? "Start omvisningen på nytt for å lære om plattformen."
                  : "Restart the tour to learn about the platform."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RestartTourButton language={language} />
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
