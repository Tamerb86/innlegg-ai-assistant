import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

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
