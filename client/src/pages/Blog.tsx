import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, Clock, Eye, Tag } from "lucide-react";
import { Link } from "wouter";

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-8 w-8" />
              <h1 className="text-4xl font-bold">Innlegg Blog</h1>
            </div>
            <p className="text-xl text-blue-100">
              Tips, guider og innsikt om innholdsproduksjon med AI
            </p>
          </div>
        </div>
      </header>

      <main className="container py-12">
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full cursor-pointer hover:shadow-xl transition-all hover:scale-105">
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                        {getCategoryLabel(post.category)}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readingTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.viewCount}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">Les mer</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Ingen artikler ennå</h3>
            <p className="text-muted-foreground">Kom tilbake snart for spennende innhold!</p>
          </div>
        )}
      </main>
    </div>
  );
}
