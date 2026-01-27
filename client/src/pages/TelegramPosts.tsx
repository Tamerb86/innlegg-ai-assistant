import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { PageHeader } from "@/components/PageHeader";
import { PAGE_DESCRIPTIONS } from "@/lib/pageDescriptions";
import { Loader2, MessageSquare, Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

export default function TelegramPosts() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  // Fetch Telegram-generated posts (last 10)
  const { data: telegramPosts, isLoading } = trpc.telegram.getRecentPosts.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  // Generate 3 alternatives mutation
  const generateAlternatives = trpc.telegram.generateAlternatives.useMutation({
    onSuccess: () => {
      toast.success("3 alternativer generert!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Kunne ikke generere alternativer");
    },
  });

  const handleCopy = (content: string, postId: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(postId);
    toast.success("Kopiert til utklippstavle!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateAlternatives = (postId: number, rawInput: string) => {
    setExpandedPostId(postId);
    generateAlternatives.mutate({ postId, rawInput });
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Logg inn</CardTitle>
            <CardDescription>Du må være logget inn for å se Telegram-innlegg</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <PageHeader 
        title="Telegram Innlegg" 
        description={PAGE_DESCRIPTIONS.telegramPosts} 
      />

      {!telegramPosts || telegramPosts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Ingen Telegram-innlegg ennå
            </CardTitle>
            <CardDescription>
              Send en idé til @Nexifynorgebot på Telegram for å generere innlegg!
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {telegramPosts.map((post: any) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      {post.rawInput}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {formatDistanceToNow(new Date(post.createdAt), { 
                        addSuffix: true, 
                        locale: nb 
                      })}
                      {" • "}
                      <span className="capitalize">{post.platform}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-4">
                {/* Original generated content */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Generert innlegg:
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(post.generatedContent, post.id)}
                    >
                      {copiedId === post.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {post.generatedContent}
                  </p>
                </div>

                {/* Generate alternatives button */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleGenerateAlternatives(post.id, post.rawInput)}
                    disabled={generateAlternatives.isPending && expandedPostId === post.id}
                    className="flex-1"
                  >
                    {generateAlternatives.isPending && expandedPostId === post.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Genererer...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generer 3 alternativer
                      </>
                    )}
                  </Button>
                </div>

                {/* Show alternatives if generated */}
                {expandedPostId === post.id && generateAlternatives.data && (
                  <div className="space-y-3 pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground">
                      3 alternativer:
                    </p>
                    
                    {generateAlternatives.data.alternatives.map((alt: string, idx: number) => (
                      <div key={idx} className="bg-background border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-primary">
                            Alternativ {idx + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(alt, post.id * 10 + idx)}
                          >
                            {copiedId === post.id * 10 + idx ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {alt}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
