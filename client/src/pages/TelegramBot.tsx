import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function TelegramBot() {
  const [botToken, setBotToken] = useState("");
  const { data: subscription } = trpc.user.getSubscription.useQuery();
  const { data: botStatus } = trpc.telegram.getStatus.useQuery();

  const setupMutation = trpc.telegram.setup.useMutation({
    onSuccess: () => {
      toast.success("Telegram Bot aktivert!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Kunne ikke aktivere bot");
    },
  });

  const isPro = subscription?.status === "active";

  const handleSetup = () => {
    if (!botToken.trim()) {
      toast.error("Vennligst skriv inn Bot Token");
      return;
    }
    setupMutation.mutate({ token: botToken });
  };

  const copyBotUsername = () => {
    if (botStatus?.username) {
      navigator.clipboard.writeText(`@${botStatus.username}`);
      toast.success("Bot-brukernavn kopiert!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Send className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Telegram Bot
              </h1>
              <p className="text-muted-foreground">
                Send idé → Få ferdig innlegg direkte i Telegram
              </p>
            </div>
          </div>

          {!isPro && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 mb-6">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bot className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-800">Telegram Bot krever Pro-abonnement</p>
                      <p className="text-sm text-purple-700">Oppgrader for å aktivere din personlige innlegg-bot</p>
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
          {/* Setup */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sett opp din Telegram Bot</CardTitle>
                <CardDescription>
                  Følg stegene under for å koble til din egen bot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Opprett Telegram Bot</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Gå til <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                          @BotFather <ExternalLink className="h-3 w-3" />
                        </a> på Telegram og send kommandoen <code className="bg-muted px-2 py-1 rounded">/newbot</code>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Følg instruksjonene for å gi boten et navn og brukernavn.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Kopier Bot Token</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        BotFather vil gi deg en <strong>token</strong> som ser slik ut:
                      </p>
                      <code className="block bg-muted px-3 py-2 rounded text-sm">
                        123456789:ABCdefGHIjklMNOpqrsTUVwxyz
                      </code>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Lim inn Token her</h3>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          placeholder="Lim inn Bot Token..."
                          value={botToken}
                          onChange={(e) => setBotToken(e.target.value)}
                          disabled={!isPro || setupMutation.isPending}
                        />
                        <Button
                          onClick={handleSetup}
                          disabled={!isPro || !botToken.trim() || setupMutation.isPending}
                        >
                          {setupMutation.isPending ? "Aktiverer..." : "Aktiver"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  {botStatus?.active && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium text-green-900">Bot er aktiv!</p>
                          <p className="text-sm text-green-700">
                            Start en chat med{" "}
                            <button
                              onClick={copyBotUsername}
                              className="inline-flex items-center gap-1 text-green-800 font-medium hover:underline"
                            >
                              @{botStatus.username}
                              <Copy className="h-3 w-3" />
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How it works */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Slik fungerer det</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Send className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Send idé</p>
                      <p className="text-xs text-muted-foreground">
                        Skriv tema eller idé til boten
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Velg plattform</p>
                      <p className="text-xs text-muted-foreground">
                        LinkedIn, Twitter, Instagram eller Facebook
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Få innlegg</p>
                      <p className="text-xs text-muted-foreground">
                        Ferdig innlegg på sekunder!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example */}
            <Card className="mt-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">💬 Eksempel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-muted-foreground">Du:</p>
                    <p className="font-medium">"Viktigheten av AI i moderne business"</p>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-3 border border-blue-200">
                    <p className="text-blue-700 font-medium">Bot:</p>
                    <p className="text-xs text-blue-600">Velg plattform: LinkedIn | Twitter | Instagram | Facebook</p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3 border border-green-200">
                    <p className="text-green-700 font-medium">Bot:</p>
                    <p className="text-xs text-green-600">✅ Her er ditt LinkedIn-innlegg: [Ferdig innhold]</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
