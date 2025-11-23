import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardResources } from "@/api/dashboard";

const ResourceSkeleton = () => (
  <Card>
    <CardHeader className="space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-5/6" />
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

const EmptyState = ({ message }) => (
  <Card className="border-dashed">
    <CardContent className="py-10 text-center text-muted-foreground text-sm">
      {message}
    </CardContent>
  </Card>
);

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");

  const loadResources = useCallback(async (withSpinner = true) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please sign in to view personalized resources.");
      setLoading(false);
      return;
    }
    if (withSpinner) setLoading(true);
    try {
      const response = await getDashboardResources(token);
      if (response.success) {
        setResources(response.data.resources || []);
        setSummary(response.data.summary || "");
        setError("");
      } else {
        setError(response.message || "Unable to load resources right now.");
      }
    } catch (err) {
      setError(err.message || "Unable to load resources right now.");
    } finally {
      if (withSpinner) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const groupedResources = useMemo(() => {
    if (!resources.length) return {};
    return resources.reduce((acc, resource) => {
      const key = resource.moodMatch || resource.type || "general";
      if (!acc[key]) acc[key] = [];
      acc[key].push(resource);
      return acc;
    }, {});
  }, [resources]);

  const hasGroups = Object.keys(groupedResources).length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex  flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest">Library</p>
            <h1 className="text-3xl font-semibold tracking-tight">Recommended resources</h1>
            {summary && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{summary}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              disabled={loading || refreshing}
              onClick={() => {
                setRefreshing(true);
                loadResources(false);
              }}
            >
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full  px-6 py-8 space-y-8">
        {error && (
          <Card className="border border-destructive/30 bg-destructive/5">
            <CardContent className="py-6">
              <p className="font-medium text-destructive">{error}</p>
              <p className="mt-1 text-sm text-muted-foreground">Try refreshing the page or signing back in.</p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ResourceSkeleton key={idx} />
            ))}
          </div>
        ) : !resources.length ? (
          <EmptyState message="Resources will appear after a few check-ins, journal entries, or chats. Visit the dashboard to log your first entry." />
        ) : (
          <div className="space-y-8">
            {hasGroups
              ? Object.entries(groupedResources).map(([group, items]) => (
                  <section key={group} className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">{group}</p>
                      <h2 className="text-xl font-semibold text-foreground">Curated picks</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {items.map((resource) => (
                        <Card key={resource.id}>
                          <CardHeader>
                            <CardTitle>{resource.title}</CardTitle>
                            <CardDescription>{resource.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {resource.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {resource.tags.map((tag) => (
                                  <span
                                    key={`${resource.id}-${tag}`}
                                    className="rounded-full border border-border/80 px-2 py-0.5 text-xs text-muted-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            {resource.url && (
                              <Button asChild variant="link" className="px-0 text-primary hover:text-primary/80">
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                                  Open resource
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                ))
              : (
                <div className="grid gap-4 md:grid-cols-2">
                  {resources.map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader>
                        <CardTitle>{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {resource.url && (
                          <Button asChild variant="link" className="px-0 text-primary hover:text-primary/80">
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                              Open resource
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  );
}