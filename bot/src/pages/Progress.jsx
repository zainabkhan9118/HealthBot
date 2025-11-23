// Progress.jsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { getProgressData } from "@/api/progress";
import { Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Progress() {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'

  useEffect(() => {
    const loadProgressData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please sign in to view your progress.');
        setLoading(false);
        return;
      }

      try {
        const response = await getProgressData(token);
        if (response.success) {
          setProgressData(response.data);
          setError('');
        } else {
          setError(response.message || 'Unable to load progress data.');
        }
      } catch (err) {
        setError(err.message || 'Unable to load progress data.');
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, []);

  const moodData = viewMode === 'week' 
    ? (progressData?.weeklyMoodData || []).filter(d => d.mood !== null)
    : (progressData?.monthlyMoodData || []).filter(d => d.mood !== null);

  const chartConfig = {
    mood: {
      label: "Mood Level",
      color: "#9B7EDC",
      theme: {
        light: "#9B7EDC",
        dark: "#9B7EDC"
      }
    }
  };

  const getMoodLabel = (value) => {
    if (value >= 9) return 'Very Happy';
    if (value >= 7) return 'Happy';
    if (value >= 4) return 'Neutral';
    if (value >= 2) return 'Sad';
    return 'Depressed';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading your progress...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mx-auto p-6">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-6">
            <p className="text-destructive font-medium">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your Progress</h1>
          <p className="text-muted-foreground mt-1">Track your mood and journaling journey over time</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            onClick={() => setViewMode('week')}
            size="sm"
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            onClick={() => setViewMode('month')}
            size="sm"
          >
            Month
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mood Trend</CardTitle>
              <CardDescription>
                {viewMode === 'week' ? 'Last 7 days' : 'Last 30 days'} of mood tracking
              </CardDescription>
            </div>
            {progressData?.stats?.averageMood && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-medium">Avg: {progressData.stats.averageMood}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {moodData.length === 0 ? (
            <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
              <p className="text-muted-foreground">No mood data available for this period. Start logging check-ins!</p>
            </div>
          ) : (
            <div className="mb-6">
              <ChartContainer config={chartConfig}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={viewMode === 'week' ? 'day' : 'date'} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    label={{ value: "Mood", angle: -90, position: 'insideLeft' }}
                    ticks={[1, 3, 5, 8, 10]}
                    tickFormatter={(value) => getMoodLabel(value).slice(0, 3)}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-md border border-border bg-card px-3 py-2 text-sm shadow-md">
                            <p className="font-medium">{getMoodLabel(payload[0].value)}</p>
                            <p className="text-muted-foreground text-xs">Level: {payload[0].value}/10</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="var(--color-mood, #9B7EDC)" 
                    strokeWidth={2} 
                    activeDot={{ r: 6 }}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Your activity overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg border border-border/60">
              <span className="font-medium">Journaling Streak</span>
              <span className="text-2xl font-bold text-primary">
                {progressData?.stats?.journalingStreak || 0} days
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border border-border/60">
              <span className="font-medium">Entries This Week</span>
              <span className="text-2xl font-bold text-primary">
                {progressData?.stats?.entriesThisWeek || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border border-border/60">
              <span className="font-medium">Total Check-ins</span>
              <span className="text-2xl font-bold text-primary">
                {progressData?.stats?.totalCheckIns || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border border-border/60">
              <span className="font-medium">Total Journal Entries</span>
              <span className="text-2xl font-bold text-primary">
                {progressData?.stats?.totalJournalEntries || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your milestones and wins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progressData?.achievements?.map((achievement, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg border border-border/60 bg-primary/5"
                >
                  <p className="text-center font-medium">{achievement}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
