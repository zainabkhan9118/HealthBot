import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Smile,
  Meh,
  Frown,
  Moon,
  Zap,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { createCheckIn } from '@/api/checkIns';
import { Slider } from '@/components/ui/slider';

const moodOptions = [
  { value: 'Very Happy', emoji: '😄', color: '#10b981', bgColor: '#d1fae5', hoverColor: '#059669' },
  { value: 'Happy', emoji: '🙂', color: '#3b82f6', bgColor: '#dbeafe', hoverColor: '#2563eb' },
  { value: 'Neutral', emoji: '😐', color: '#8b5cf6', bgColor: '#ede9fe', hoverColor: '#7c3aed' },
  { value: 'Sad', emoji: '😔', color: '#f59e0b', bgColor: '#fef3c7', hoverColor: '#d97706' },
  { value: 'Depressed', emoji: '😢', color: '#ef4444', bgColor: '#fee2e2', hoverColor: '#dc2626' },
];

export default function CheckIn() {
  const navigate = useNavigate();
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [sleepHours, setSleepHours] = useState(7);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [anxietyLevel, setAnxietyLevel] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mood) {
      setError('Please select your mood');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const checkInData = {
        mood,
        notes,
        metrics: {
          sleep: sleepHours,
          energy: energyLevel,
          anxiety: anxietyLevel
        }
      };
      
      const response = await createCheckIn(checkInData, token);
      
      if (response.success) {
        navigate('/check-in-history');
      } else {
        setError(response.message || 'Failed to create check-in');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100 rounded-lg h-9 w-9 p-0"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Daily Check-In
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block mt-0.5">Track your mental wellness</p>
              </div>
            </div>
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 max-w-7xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Selection Card */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-gray-100 bg-white">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Smile className="h-5 w-5 text-purple-600" />
                </div>
                How are you feeling?
              </CardTitle>
              <CardDescription className="text-gray-600">Select the mood that best describes you today</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 bg-white">
              <RadioGroup 
                value={mood} 
                onValueChange={setMood}
                className="grid grid-cols-2 sm:grid-cols-5 gap-3"
              >
                {moodOptions.map((option) => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value} 
                      className="sr-only peer" 
                    />
                    <Label 
                      htmlFor={option.value} 
                      className={`
                        flex flex-col items-center justify-center gap-3 p-4 sm:p-5 rounded-xl cursor-pointer
                        border-2 transition-all duration-200
                        ${mood === option.value 
                          ? 'border-purple-600 bg-purple-50 shadow-md scale-105' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm hover:bg-gray-50'
                        }
                      `}
                      style={mood === option.value ? { 
                        backgroundColor: option.bgColor,
                        borderColor: option.color 
                      } : {}}
                    >
                      <span className="text-4xl transition-transform duration-200 hover:scale-110">
                        {option.emoji}
                      </span>
                      <span className={`text-xs sm:text-sm font-medium ${
                        mood === option.value ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {option.value}
                      </span>
                      {mood === option.value && (
                        <CheckCircle2 
                          className="absolute top-2 right-2 h-5 w-5" 
                          style={{ color: option.color }}
                        />
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Metrics Card */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-gray-100 bg-white">
              <CardTitle className="text-xl font-semibold text-gray-900">Daily Metrics</CardTitle>
              <CardDescription className="text-gray-600">Track your physical and mental state</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 bg-white space-y-8">
              {/* Sleep */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-medium text-gray-900 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Moon className="h-5 w-5 text-indigo-600" />
                    </div>
                    Hours of Sleep
                  </Label>
                  <span className="text-2xl font-bold text-indigo-600">
                    {sleepHours}h
                  </span>
                </div>
                <Slider 
                  value={[sleepHours]} 
                  min={0}
                  max={12}
                  step={0.5}
                  onValueChange={(value) => setSleepHours(value[0])}
                  className="[&>span:first-child]:bg-indigo-600" 
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 hours</span>
                  <span>12 hours</span>
                </div>
              </div>
              
              {/* Energy */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-medium text-gray-900 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-amber-600" />
                    </div>
                    Energy Level
                  </Label>
                  <span className="text-2xl font-bold text-amber-600">
                    {energyLevel}/10
                  </span>
                </div>
                <Slider 
                  value={[energyLevel]} 
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setEnergyLevel(value[0])}
                  className="[&>span:first-child]:bg-amber-600" 
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low energy</span>
                  <span>High energy</span>
                </div>
              </div>
              
              {/* Anxiety */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-medium text-gray-900 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-rose-600" />
                    </div>
                    Anxiety Level
                  </Label>
                  <span className="text-2xl font-bold text-rose-600">
                    {anxietyLevel}/10
                  </span>
                </div>
                <Slider 
                  value={[anxietyLevel]} 
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setAnxietyLevel(value[0])}
                  className="[&>span:first-child]:bg-rose-600" 
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Very calm</span>
                  <span>Very anxious</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-gray-100 bg-white">
              <CardTitle className="text-xl font-semibold text-gray-900">Your Thoughts</CardTitle>
              <CardDescription className="text-gray-600">What's on your mind today? (Optional)</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 bg-white">
              <Textarea
                placeholder="Share how you're feeling, what happened today, or anything you'd like to remember..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none min-h-[150px] border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white rounded-lg"
              />
            </CardContent>
          </Card>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Check-In...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Save Check-In
              </span>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
