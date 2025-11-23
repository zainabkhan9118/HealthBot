import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BrainCircuit,
  Dumbbell,
  ListChecks,
  MessageSquareHeart,
  Loader2,
  Sparkles,
  Timer,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardOverview } from '@/api/dashboard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip
} from 'recharts';

const containerClass = 'mx-auto w-full px-4 sm:px-6 lg:px-8';

const moodLabelMap = {
  1: 'Depressed',
  2: 'Sad',
  3: 'Neutral',
  4: 'Happy',
  5: 'Very Happy'
};

const suggestionConfig = [
  { key: 'exercises', title: 'Movement practice', icon: Dumbbell, accent: 'bg-primary/5 border-primary/20' },
  { key: 'breathing', title: 'Breathing reset', icon: Wind, accent: 'bg-emerald-50 border-emerald-100 text-emerald-900' },
  { key: 'moodTips', title: 'Mood tip', icon: Sparkles, accent: 'bg-amber-50 border-amber-100 text-amber-900' },
  { key: 'stressRelief', title: 'Stress relief', icon: Timer, accent: 'bg-sky-50 border-sky-100 text-sky-900' }
];

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((item) => (
      <div key={item} className="rounded-xl border border-border bg-card p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-4 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
    ))}
  </div>
);

const InsightList = ({ items, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-border/60 p-4">
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-11/12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed border-border/80 p-4 text-sm text-muted-foreground">
        Insights arrive once you log a few chats, check-ins, or journal entries.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border border-border/60 p-4">
          <p className="font-medium text-foreground">{item.title}</p>
          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          {item.duration && (
            <p className="text-xs text-muted-foreground mt-2">Duration: {item.duration}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadOverview = useCallback(async (withSpinner = true) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please sign in to view your dashboard.');
      setLoading(false);
      return;
    }
    if (withSpinner) setLoading(true);
    try {
      const response = await getDashboardOverview(token);
      if (response.success) {
        setOverview(response.data);
        setError('');
      } else {
        setError(response.message || 'Unable to load dashboard data.');
      }
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data.');
    } finally {
      if (withSpinner) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const timelineData = useMemo(() => {
    if (!overview?.moodSummary?.timeline?.length) {
      return [];
    }
    return overview.moodSummary.timeline.map((item) => ({
      name: item.dateLabel,
      value: item.value,
      mood: item.mood
    }));
  }, [overview]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className={`${containerClass} flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between`}>
          <div>
            <p className="text-sm text-muted-foreground">Dashboard</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back, {overview?.user?.name || 'friend'}
            </h1>
            {overview?.weeklySummary && (
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                {overview.weeklySummary}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/dashboard/chat">
                <MessageSquareHeart className="mr-2 h-4 w-4" />
                Open Chat
              </Link>
            </Button>
            <Button asChild>
              <Link to="/check-in">
                <ListChecks className="mr-2 h-4 w-4" />
                Log Check-in
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setRefreshing(true);
                loadOverview(false);
              }}
              disabled={refreshing || loading}
              className="flex items-center gap-2"
            >
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className={`${containerClass} py-10 space-y-8`}>
        {loading && (
          <LoadingSkeleton />
        )}

        {!loading && error && (
          <Card className="border border-destructive/30 bg-destructive/5">
            <CardContent className="py-6">
              <p className="text-destructive font-medium">{error}</p>
              <p className="text-sm text-muted-foreground mt-1">Try refreshing the page or signing back in.</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && overview && (
          <>
            <section className="grid gap-6 lg:grid-cols-2">
              <Card className="lg:col-span-2">
                <CardHeader className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>Today's action plan</CardTitle>
                    <CardDescription>Steps tailored to your current mood trends.</CardDescription>
                  </div>
                  <Link to="/dashboard/journal" className="text-sm font-medium text-primary hover:underline inline-flex items-center">
                    Review journal
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(overview.actionPlan && overview.actionPlan.length > 0) ? (
                    overview.actionPlan.map((item, index) => (
                      <div key={`${item.title}-${index}`} className="flex items-start gap-4 rounded-lg border border-border/60 p-4">
                        <div className="mt-1 rounded-full border border-border px-2 py-0.5 text-xs uppercase tracking-wide text-muted-foreground">
                          {item.timeOfDay || 'anytime'}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Add a check-in or journal entry to generate an action plan.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent moods</CardTitle>
                  <CardDescription>Latest check-ins at a glance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {overview?.moodSummary?.recentMoods?.length ? (
                    overview.moodSummary.recentMoods.map((entry) => (
                      <div key={entry.id} className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{entry.mood}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                          </p>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground max-w-[180px] text-right">{entry.notes}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent moods logged yet.</p>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/check-in-history">View check-in history</Link>
                  </Button>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Mood trend</CardTitle>
                    <CardDescription>Recent check-ins mapped over time.</CardDescription>
                  </div>
                  <Link to="/dashboard/progress" className="text-sm text-primary hover:underline inline-flex items-center">
                    Open full analytics
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardHeader>
                <CardContent>
                  {timelineData.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/80 p-10 text-center">
                      <BrainCircuit className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        Your mood timeline appears when you add check-ins.
                      </p>
                    </div>
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                          <XAxis dataKey="name" tickLine={false} axisLine={false} />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            ticks={[1, 2, 3, 4, 5]}
                            tickFormatter={(value) => moodLabelMap[value] || ''}
                          />
                          <RechartsTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const { name, mood } = payload[0].payload;
                                return (
                                  <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
                                    <p className="font-medium">{name}</p>
                                    <p className="text-muted-foreground">{mood}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {['positive', 'neutral', 'challenging'].map((key) => (
                      <div key={key} className="rounded-lg border border-border/60 p-4">
                        <p className="text-sm uppercase tracking-wider text-muted-foreground">{key}</p>
                        <p className="text-2xl font-semibold">
                          {overview?.moodSummary?.percentages?.[key] ?? 0}%
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              {suggestionConfig.map(({ key, title, icon: Icon, accent }) => (
                <Card key={key} className={`border ${accent || ''}`}>
                  <CardHeader className="flex items-center justify-between">
                    <div>
                      <CardTitle>{title}</CardTitle>
                      <CardDescription>
                        Suggestions from your latest sessions.
                      </CardDescription>
                    </div>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <InsightList
                      loading={loading || refreshing}
                      items={overview?.suggestions?.[key] || []}
                    />
                  </CardContent>
                </Card>
              ))}
            </section>

            <section>
              <Card>
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Recommended resources</CardTitle>
                    <CardDescription>Hand-picked content aligned with your current mood.</CardDescription>
                  </div>
                  <Link to="/resources" className="text-sm text-primary hover:underline inline-flex items-center">
                    Explore library
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading || refreshing ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-lg border border-border/60 p-4">
                          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                          <div className="mt-2 h-3 w-full animate-pulse rounded bg-muted" />
                        </div>
                      ))}
                    </div>
                  ) : (overview?.suggestions?.resources?.length ?? 0) === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/80 p-6 text-sm text-muted-foreground">
                      Resources will be recommended after a few check-ins or journal entries. Explore the full library to get started.
                    </div>
                  ) : (
                    overview.suggestions.resources.map((resource) => (
                      <div key={resource.id} className="flex flex-col gap-2 rounded-lg border border-border/60 p-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                          {resource.tags?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {resource.tags.map((tag) => (
                                <span key={tag} className="rounded-full border border-border/80 px-2 py-0.5 text-xs text-muted-foreground">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {resource.url && (
                          <Button asChild variant="outline" size="sm" className="mt-2 md:mt-0">
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              Open
                            </a>
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </main>
    </div>
  );
}