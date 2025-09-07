import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMe } from '@/api/auth';
import { getJournalEntries } from '@/api/journal';
import {
  MessageSquareHeart,
  BookOpen,
  Activity,
  Smile,
  Settings,
  Calendar,
  LineChart,
  HeartPulse,
  BrainCircuit,
  MoonStar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltip } from '@/components/ui/chart';
import { Line, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);
  const [moodStats, setMoodStats] = useState({
    positive: 0,
    neutral: 0,
    challenging: 0
  });
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await getMe(token);
        if (res.success && res.data && res.data.name) {
          setUserName(res.data.name);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoading(true);
        try {
          const response = await getJournalEntries(token);
          if (response.success && Array.isArray(response.data)) {
            setJournalEntries(response.data);
            processJournalData(response.data);
          }
        } catch (error) {
          console.error("Error fetching journal entries:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchJournalEntries();
  }, []);

  const processJournalData = (entries) => {
    // Process mood statistics
    const positiveCount = entries.filter(entry => 
      ["Very Happy", "Happy"].includes(entry.mood)
    ).length;
    
    const neutralCount = entries.filter(entry => 
      entry.mood === "Neutral"
    ).length;
    
    const challengingCount = entries.filter(entry => 
      ["Sad", "Depressed"].includes(entry.mood)
    ).length;
    
    const total = entries.length;
    
    // Calculate percentages
    const positive = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
    const neutral = total > 0 ? Math.round((neutralCount / total) * 100) : 0;
    const challenging = total > 0 ? Math.round((challengingCount / total) * 100) : 0;
    
    setMoodStats({ positive, neutral, challenging });
    
    // Prepare chart data - last 7 entries or fewer
    const last7Entries = entries
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7)
      .reverse();
    
    const chartData = last7Entries.map(entry => {
      // Convert mood to numeric value for chart
      let moodValue = 0;
      switch(entry.mood) {
        case "Very Happy": moodValue = 5; break;
        case "Happy": moodValue = 4; break;
        case "Neutral": moodValue = 3; break;
        case "Sad": moodValue = 2; break;
        case "Depressed": moodValue = 1; break;
        default: moodValue = 3;
      }
      
      const date = new Date(entry.date);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: moodValue,
        moodText: entry.mood
      };
    });
    
    setChartData(chartData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6E6FA]/30 to-white text-[#9B7EDC] font-sans">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm p-6 flex justify-between items-center sticky top-0 z-10 border-b border-[#E6E6FA]">
        <div>
          <h1 className="text-2xl font-bold text-[#7C5DC7]">
            Welcome back, {userName || 'User'}
          </h1>
          <p className="text-sm text-[#9B7EDC]">How are you feeling today?</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/dashboard/settings">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-[#9B7EDC] hover:bg-[#E6E6FA]/50 hover:text-[#8B6AD1]"
            >
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
          </Link>
          <Link to="/check-in">
            <Button 
              size="sm" 
              className="bg-[#9B7EDC] hover:bg-[#8B6AD1] text-white shadow-md shadow-[#E6E6FA]"
            >
              <HeartPulse className="h-4 w-4 mr-2" /> Check-in
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 max-w-7xl mx-auto space-y-8">

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-all border border-[#E6E6FA] hover:border-[#9B7EDC] group">
            <Link to="/chat">
              <CardContent className="p-6 hover:text-[#9B7EDC]">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-[#E6E6FA]/50 group-hover:bg-[#E6E6FA] transition-colors">
                    <MessageSquareHeart className="h-6 w-6 text-[#9B7EDC]" />
                  </div>
                </div>
                <CardTitle className="text-lg mb-1 text-[#8B6AD1]">Chat with MIND</CardTitle>
                <CardDescription className="text-[#9B7EDC]">Share your thoughts with our compassionate AI</CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-all border border-[#E6E6FA] hover:border-[#9B7EDC] group">
            <Link to="/self-help">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-[#E6E6FA]/50 group-hover:bg-[#E6E6FA] transition-colors">
                    <BookOpen className="h-6 w-6 text-[#9B7EDC]" />
                  </div>
                </div>                <CardTitle className="text-lg mb-1 text-[#8B6AD1]">Self-Help Resources</CardTitle>
                <CardDescription className="text-[#9B7EDC]">Guided exercises & wellness tools</CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-all border border-[#E6E6FA] hover:border-[#9B7EDC] group">
            <Link to="/sentiment">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-[#E6E6FA]/50 group-hover:bg-[#E6E6FA] transition-colors">
                    <Activity className="h-6 w-6 text-[#9B7EDC]" />
                  </div>
                </div>                <CardTitle className="text-lg mb-1 text-[#8B6AD1]">Mood Insights</CardTitle>
                <CardDescription className="text-[#9B7EDC]">Track your emotional patterns</CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-all border border-[#E6E6FA] hover:border-[#9B7EDC] group">
            <Link to="/sleep">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-[#E6E6FA]/50 group-hover:bg-[#E6E6FA] transition-colors">
                    <MoonStar className="h-6 w-6 text-[#9B7EDC]" />
                  </div>
                </div>                <CardTitle className="text-lg mb-1 text-[#8B6AD1]">Sleep Analysis</CardTitle>
                <CardDescription className="text-[#9B7EDC]">Improve your sleep quality</CardDescription>
              </CardContent>
            </Link>
          </Card>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">

            {/* Mood Summary Card */}
            <Card className="border border-[#E6E6FA]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-[#8B6AD1]">Your Emotional Journey</CardTitle>
                  <Button variant="ghost" size="sm" className="text-[#9B7EDC] hover:bg-[#E6E6FA]">
                    View History <LineChart className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <BrainCircuit className="h-12 w-12 text-[#9B7EDC] mx-auto mb-3 animate-pulse" />
                      <p className="text-[#9B7EDC]">Loading your mood data...</p>
                    </div>
                  </div>
                ) : chartData.length === 0 ? (
                  <div className="h-64 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <BrainCircuit className="h-12 w-12 text-[#9B7EDC] mx-auto mb-3" />
                      <p className="text-[#9B7EDC]">No mood data available yet</p>
                      <Link to="/journal">
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-[#9B7EDC] hover:text-[#8B6AD1] px-0 mt-2"
                        >
                          Add a journal entry →
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 bg-[#E6E6FA]/50 rounded-lg">
                    <div style={{ width: '100%', height: '100%' }}>
                      <Line
                        width={800}
                        height={256}
                        data={chartData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        type="monotone"
                        dataKey="mood"
                        stroke="#9B7EDC"
                        strokeWidth={3}
                        activeDot={{ r: 6, fill: '#9B7EDC' }}
                      >
                        <CartesianGrid vertical={false} opacity={0.2} />
                        <XAxis 
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#9B7EDC' }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#9B7EDC' }}
                          domain={[1, 5]}
                          ticks={[1, 2, 3, 4, 5]}
                          tickFormatter={(value) => {
                            const labels = {
                              1: 'Depressed',
                              2: 'Sad',
                              3: 'Neutral',
                              4: 'Happy',
                              5: 'Very Happy'
                            };
                            return labels[value] || '';
                          }}
                        />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white/90 dark:bg-gray-900/90 border border-[#E6E6FA] p-2 rounded-lg shadow-sm">
                                  <p className="text-[#9B7EDC] font-medium">{payload[0].payload.date}</p>
                                  <p className="text-[#8B6AD1]">Mood: {payload[0].payload.moodText}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </Line>
                    </div>
                  </div>
                )}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-[#E6E6FA]/50">
                    <p className="text-sm text-[#9B7EDC]">Positive</p>
                    <p className="text-xl font-medium text-[#8B6AD1]">{moodStats.positive}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#E6E6FA]/50">
                    <p className="text-sm text-[#9B7EDC]">Neutral</p>
                    <p className="text-xl font-medium text-[#9B7EDC]">{moodStats.neutral}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#E6E6FA]/50">
                    <p className="text-sm text-[#9B7EDC]">Challenging</p>
                    <p className="text-xl font-medium text-[#9B7EDC]">{moodStats.challenging}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wellness Suggestions */}
            <Card className="border border-[#E6E6FA]">
              <CardHeader>
                <CardTitle className="text-[#8B6AD1]">Personalized Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start p-4 rounded-lg bg-[#E6E6FA]/50 hover:bg-[#E6E6FA]/70 transition-colors cursor-pointer">
                  <div className="p-2 rounded-md bg-[#E6E6FA] mr-4">
                    <HeartPulse className="h-5 w-5 text-[#9B7EDC]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#8B6AD1]">Breathing Exercise</h3>
                    <CardDescription className="text-[#9B7EDC]">5-minute session to reduce stress</CardDescription>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-[#9B7EDC] hover:text-[#8B6AD1] px-0 mt-2"
                    >
                      Start Now →
                    </Button>
                  </div>
                </div>
                <div className="flex items-start p-4 rounded-lg bg-[#E6E6FA]/50 hover:bg-[#E6E6FA]/70 transition-colors cursor-pointer">
                  <div className="p-2 rounded-md bg-[#E6E6FA] mr-4">
                    <BookOpen className="h-5 w-5 text-[#9B7EDC]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#8B6AD1]">Gratitude Journaling</h3>
                    <CardDescription className="text-[#9B7EDC]">Boost positivity with daily practice</CardDescription>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-[#9B7EDC] hover:text-[#8B6AD1] px-0 mt-2"
                    >
                      Begin Journal →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Wellness Tip */}
            <Card className="bg-gradient-to-br from-[#9B7EDC] to-[#E6E6FA] text-white">
              <CardHeader>
                <div className="flex items-center">
                  <Smile className="h-5 w-5 mr-2" />
                  <CardTitle>Daily Wellness Tip</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/90 mb-4">
                  "Take 3 deep breaths before responding in stressful situations. This creates space for mindful responses."
                </CardDescription>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-[#9B7EDC] bg-white hover:bg-white/90 border-white"
                >
                  Save Tip
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border border-[#E6E6FA]">
              <CardHeader>
                <CardTitle className="text-[#8B6AD1]">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-[#E6E6FA]/50 mr-3">
                    <MessageSquareHeart className="h-4 w-4 text-[#9B7EDC]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#8B6AD1]">Chat Session</p>
                    <CardDescription className="text-[#9B7EDC]">Yesterday, 3:42 PM</CardDescription>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-[#E6E6FA]/50 mr-3">
                    <BookOpen className="h-4 w-4 text-[#9B7EDC]" />
                  </div>
                  <div>                    <p className="text-sm font-medium text-[#8B6AD1]">Completed Exercise</p>
                    <CardDescription className="text-[#9B7EDC]">2 days ago</CardDescription>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-[#E6E6FA]/50 mr-3">
                    <Activity className="h-4 w-4 text-[#9B7EDC]" />
                  </div>
                  <div>                    <p className="text-sm font-medium text-[#8B6AD1]">Mood Check-in</p>
                    <CardDescription className="text-[#9B7EDC]">3 days ago</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#9B7EDC] hover:bg-[#E6E6FA] w-full mt-4"
                >
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card className="border border-[#E6E6FA]">
              <CardHeader>
                <div className="flex justify-between items-center">                  <CardTitle className="text-[#8B6AD1]">Upcoming</CardTitle>
                  <Button variant="ghost" size="sm" className="text-[#9B7EDC] hover:bg-[#E6E6FA]">
                    <Calendar className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-lavender-50/50">
                  <p className="text-sm font-medium text-[#8B6AD1]">Therapist Appointment</p>
                  <CardDescription>Tomorrow, 10:30 AM</CardDescription>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}