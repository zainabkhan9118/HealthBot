import React from 'react';
import { Link } from 'react-router-dom';
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

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6E6FA]/30 to-white text-[#9B7EDC] font-sans">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm p-6 flex justify-between items-center sticky top-0 z-10 border-b border-[#E6E6FA]">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#9B7EDC] to-[#E6E6FA] bg-clip-text text-transparent">
            Welcome back, Zainab
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
          <Button 
            size="sm" 
            className="bg-[#9B7EDC] hover:bg-[#8B6AD1] text-white shadow-md shadow-[#E6E6FA]"
          >
            <HeartPulse className="h-4 w-4 mr-2" /> Check-in
          </Button>
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
                <div className="h-64 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <BrainCircuit className="h-12 w-12 text-[#9B7EDC] mx-auto mb-3" />
                    <p className="text-[#9B7EDC]">Your mood chart will appear here</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-[#E6E6FA]/50">
                    <p className="text-sm text-[#9B7EDC]">Positive</p>
                    <p className="text-xl font-medium text-[#8B6AD1]">42%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#E6E6FA]/50">
                    <p className="text-sm text-[#9B7EDC]">Neutral</p>
                    <p className="text-xl font-medium text-[#9B7EDC]">35%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#E6E6FA]/50">
                    <p className="text-sm text-[#9B7EDC]">Challenging</p>
                    <p className="text-xl font-medium text-[#9B7EDC]">23%</p>
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