// Progress.jsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const dummyData = [
  { day: "Mon", mood: 5 },
  { day: "Tue", mood: 6 },
  { day: "Wed", mood: 7 },
  { day: "Thu", mood: 8 },
  { day: "Fri", mood: 6 },
  { day: "Sat", mood: 7 },
  { day: "Sun", mood: 8 }
];

export default function Progress() {
  // In a real app, fetch mood data from backend or context
  const [moodData] = useState(dummyData);

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

  return (
    <div className="min-h-screen mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>Track your mood and journaling streaks over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <ChartContainer config={chartConfig}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[1, 10]} label={{ value: "Mood", angle: -90, position: 'insideLeft' }} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent 
                      labelKey="day"
                      nameKey="mood"
                    />
                  }
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="var(--color-mood, #9B7EDC)" 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="font-medium">Journaling Streak</span>
              <span>5 days</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Entries This Week</span>
              <span>6</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Achievements</span>
              <span>🌟 1 week streak!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
