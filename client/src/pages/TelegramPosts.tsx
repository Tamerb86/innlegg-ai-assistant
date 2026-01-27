import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { PageHeader } from "@/components/PageHeader";
import { PAGE_DESCRIPTIONS } from "@/lib/pageDescriptions";
import { Loader2, MessageSquare, Sparkles, Copy, Check, Save, Lightbulb, Trash2, Edit, CheckSquare, Square } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function TelegramPosts() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<{ id: number; content: string } | null>(null);
  const [editedContent, setEditedContent] = useState("");
  
  // Fetch Telegram-generated posts (last 10)
  const { data: telegramPosts, isLoading, refetch } = trpc.telegram.getRecentPosts.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  // Filter posts by platform
  const filteredPosts = useMemo(() => {
    if (!telegramPosts) return [];
    if (platformFilter === "all") return telegramPosts;
    return telegramPosts.filter((post: any) => post.platform === platformFilter);
  }, [telegramPosts, platformFilter]);

  // Generate 3 alternatives mutation
  const generateAlternatives = trpc.telegram.generateAlternatives.useMutation({
    onSuccess: () => {
      toast.success("3 alternativer generert!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Kunne ikke generere alternativer");
    },
  });

  // Save post mutation
  const savePost = trpc.telegram.savePost.useMutation({
    onSuccess: () => {
      toast.success("Innlegget er lagret i Mine innlegg!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Kunne ikke lagre innlegg");
    },
  });

  // Delete post mutation
  const deletePost = trpc.telegram.deletePost.useMutation({
    onSuccess: () => {
      toast.success("Innlegget er slettet!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Kunne ikke slette innlegg");
    },
  });

  // Move to idea bank mutation
  const moveToIdeaBank = trpc.telegram.moveToIdeaBank.useMutation({
    onSuccess: () => {
      toast.success("Idé flyttet til Idé-Bank!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Kunne ikke flytte til Idé-Bank");
    },
  });

  // Bulk delete mutation
  const bulkDelete = trpc.telegram.bulkDeletePosts.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.count} innlegg slettet!`);
      setSelectedPosts([]);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Kunne ikke slette innlegg");
    },
  });

  // Bulk move to idea bank mutation
  const bulkMoveToIdeaBank = trpc.telegram.bulkMoveToIdeaBank.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.count} ideer flyttet til Idé-Bank!`);
      setSelectedPosts([]);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Kunne ikke flytte til Idé-Bank");
    },
  });

  // Edit post mutation
  const editPost = trpc.telegram.editPost.useMutation({
    onSuccess: () => {
      toast.success("Innlegget er oppdatert!");
      setEditDialogOpen(false);
      setEditingPost(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Kunne ikke oppdatere innlegg");
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

  const handleSave = (postId: number) => {
    savePost.mutate({ postId });
  };

  const handleDeleteClick = (postId: number) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      deletePost.mutate({ postId: postToDelete });
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleMoveToIdeaBank = (postId: number, rawInput: string) => {
    moveToIdeaBank.mutate({ postId, rawInput });
  };

  const handleEditClick = (postId: number, content: string) => {
    setEditingPost({ id: postId, content });
    setEditedContent(content);
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (editingPost) {
      editPost.mutate({ postId: editingPost.id, newContent: editedContent });
    }
  };

  const handleSelectPost = (postId: number, checked: boolean) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, postId]);
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    }
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map((post: any) => post.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedPosts.length === 0) {
      toast.error("Ingen innlegg valgt");
      return;
    }
    bulkDelete.mutate({ postIds: selectedPosts });
  };

  const handleBulkMoveToIdeaBank = () => {
    if (selectedPosts.length === 0) {
      toast.error("Ingen innlegg valgt");
      return;
    }
    const items = filteredPosts
      .filter((post: any) => selectedPosts.includes(post.id))
      .map((post: any) => ({ postId: post.id, rawInput: post.rawInput }));
    bulkMoveToIdeaBank.mutate({ items });
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

      {/* Filter and bulk actions bar */}
      {telegramPosts && telegramPosts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Platform filter */}
              <div className="flex items-center gap-2">
                <Label htmlFor="platform-filter">Plattform:</Label>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger id="platform-filter" className="w-[180px]">
                    <SelectValue placeholder="Velg plattform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Select all button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedPosts.length === filteredPosts.length ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Avmerk alle
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Velg alle
                  </>
                )}
              </Button>

              {/* Bulk actions */}
              {selectedPosts.length > 0 && (
                <>
                  <div className="text-sm text-muted-foreground">
                    {selectedPosts.length} valgt
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkMoveToIdeaBank}
                    disabled={bulkMoveToIdeaBank.isPending}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Flytt valgte til Idé-Bank
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={bulkDelete.isPending}
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Slett valgte
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!filteredPosts || filteredPosts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {platformFilter === "all" 
                ? "Ingen Telegram-innlegg ennå"
                : `Ingen ${platformFilter}-innlegg ennå`
              }
            </CardTitle>
            <CardDescription>
              {platformFilter === "all"
                ? "Send en idé til @Nexifynorgebot på Telegram for å generere innlegg!"
                : "Prøv et annet filter eller send en idé til @Nexifynorgebot på Telegram."
              }
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post: any) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={(checked) => handleSelectPost(post.id, checked as boolean)}
                      className="mt-1"
                    />
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

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => handleEditClick(post.id, post.generatedContent)}
                    disabled={editPost.isPending}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Rediger
                  </Button>

                  <Button
                    onClick={() => handleSave(post.id)}
                    disabled={savePost.isPending}
                    variant="outline"
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Lagre
                  </Button>
                  
                  <Button
                    onClick={() => handleMoveToIdeaBank(post.id, post.rawInput)}
                    disabled={moveToIdeaBank.isPending}
                    variant="outline"
                    size="sm"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Til Idé-Bank
                  </Button>
                  
                  <Button
                    onClick={() => handleDeleteClick(post.id)}
                    disabled={deletePost.isPending}
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Slett
                  </Button>
                  
                  <Button
                    onClick={() => handleGenerateAlternatives(post.id, post.rawInput)}
                    disabled={generateAlternatives.isPending && expandedPostId === post.id}
                    size="sm"
                    className="ml-auto"
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Dette vil permanent slette innlegget. Denne handlingen kan ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rediger innlegg</DialogTitle>
            <DialogDescription>
              Gjør endringer i innlegget ditt. Klikk lagre når du er ferdig.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-content">Innhold</Label>
              <Textarea
                id="edit-content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={10}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={handleEditSave} disabled={editPost.isPending}>
              {editPost.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Lagrer...
                </>
              ) : (
                "Lagre endringer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
