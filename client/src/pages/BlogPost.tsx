import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, Clock, Eye, Share2, User } from "lucide-react";
import { useRoute, Link } from "wouter";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug }, {
    enabled: !!slug,
  });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      tips: "Tips & Tricks",
      guides: "Guider",
      news: "Nyheter",
      "case-studies": "Case Studies",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      tips: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      guides: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      news: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "case-studies": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("no-NO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artikkel ikke funnet</h1>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbake til blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container py-6">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbake til blog
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-12">
        <article className="max-w-4xl mx-auto">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Category Badge */}
          <div className="mb-4">
            <span className={`text-sm px-3 py-1 rounded-full ${getCategoryColor(post.category)}`}>
              {getCategoryLabel(post.category)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{post.authorName}</span>
              {post.authorRole && <span className="text-sm">• {post.authorRole}</span>}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} min lesing</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount} visninger</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(post.tags).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Likte du denne artikkelen?</h3>
                <p className="text-sm text-muted-foreground">Del den med ditt nettverk!</p>
              </div>
              <Button>
                <Share2 className="h-4 w-4 mr-2" />
                Del
              </Button>
            </div>
          </Card>

          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Klar til å lage profesjonelt innhold?</h2>
            <p className="mb-6 text-blue-100">
              Prøv Innlegg gratis i 14 dager og oppdag hvor enkelt det er å lage engasjerende innhold.
            </p>
            <Link href="/landing">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Kom i gang gratis
              </Button>
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
