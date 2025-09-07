import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Moon,
  Zap,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { createCheckIn } from '@/api/checkIns';
import { Slider } from '@/components/ui/slider';

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
    <div className="min-h-screen bg-gradient-to-br from-[#E6E6FA]/30 to-white text-[#9B7EDC] font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm p-6 flex justify-between items-center sticky top-0 z-10 border-b border-[#E6E6FA]">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#7C5DC7]">Daily Check-In</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 max-w-2xl mx-auto space-y-8">
        <Card className="border border-[#E6E6FA]">
          <CardHeader>
            <CardTitle className="text-[#8B6AD1]">How are you feeling today?</CardTitle>
            <CardDescription>Your check-in helps us understand your mental health journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mood Selection */}
              <div className="space-y-2">
                <Label className="text-[#9B7EDC] text-lg">Select your mood</Label>
                <RadioGroup 
                  value={mood} 
                  onValueChange={setMood}
                  className="grid grid-cols-1 md:grid-cols-5 gap-2"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`p-3 rounded-full ${mood === "Very Happy" ? "bg-[#9B7EDC] text-white" : "bg-[#E6E6FA]/50 text-[#9B7EDC]"} transition-colors`}>
                      <Heart className="h-6 w-6" fill={mood === "Very Happy" ? "#9B7EDC" : "none"} />
                    </div>
                    <RadioGroupItem 
                      value="Very Happy" 
                      id="very-happy" 
                      className="sr-only" 
                    />
                    <Label htmlFor="very-happy" className="cursor-pointer">Very Happy</Label>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`p-3 rounded-full ${mood === "Happy" ? "bg-[#9B7EDC] text-white" : "bg-[#E6E6FA]/50 text-[#9B7EDC]"} transition-colors`}>
                      <Heart className="h-6 w-6" fill={mood === "Happy" ? "#9B7EDC" : "none"} />
                    </div>
                    <RadioGroupItem 
                      value="Happy" 
                      id="happy" 
                      className="sr-only" 
                    />
                    <Label htmlFor="happy" className="cursor-pointer">Happy</Label>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`p-3 rounded-full ${mood === "Neutral" ? "bg-[#9B7EDC] text-white" : "bg-[#E6E6FA]/50 text-[#9B7EDC]"} transition-colors`}>
                      <Heart className="h-6 w-6" fill={mood === "Neutral" ? "#9B7EDC" : "none"} />
                    </div>
                    <RadioGroupItem 
                      value="Neutral" 
                      id="neutral" 
                      className="sr-only" 
                    />
                    <Label htmlFor="neutral" className="cursor-pointer">Neutral</Label>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`p-3 rounded-full ${mood === "Sad" ? "bg-[#9B7EDC] text-white" : "bg-[#E6E6FA]/50 text-[#9B7EDC]"} transition-colors`}>
                      <Heart className="h-6 w-6" fill={mood === "Sad" ? "#9B7EDC" : "none"} />
                    </div>
                    <RadioGroupItem 
                      value="Sad" 
                      id="sad" 
                      className="sr-only" 
                    />
                    <Label htmlFor="sad" className="cursor-pointer">Sad</Label>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`p-3 rounded-full ${mood === "Depressed" ? "bg-[#9B7EDC] text-white" : "bg-[#E6E6FA]/50 text-[#9B7EDC]"} transition-colors`}>
                      <Heart className="h-6 w-6" fill={mood === "Depressed" ? "#9B7EDC" : "none"} />
                    </div>
                    <RadioGroupItem 
                      value="Depressed" 
                      id="depressed" 
                      className="sr-only" 
                    />
                    <Label htmlFor="depressed" className="cursor-pointer">Depressed</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Metrics */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-[#9B7EDC]">
                      <Moon className="inline-block mr-2 h-4 w-4" />
                      Hours of Sleep
                    </Label>
                    <span className="text-[#8B6AD1] font-medium">{sleepHours} hours</span>
                  </div>
                  <Slider 
                    value={[sleepHours]} 
                    min={0}
                    max={12}
                    step={0.5}
                    onValueChange={(value) => setSleepHours(value[0])}
                    className="[&>span]:bg-[#9B7EDC]" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-[#9B7EDC]">
                      <Zap className="inline-block mr-2 h-4 w-4" />
                      Energy Level
                    </Label>
                    <span className="text-[#8B6AD1] font-medium">{energyLevel}/10</span>
                  </div>
                  <Slider 
                    value={[energyLevel]} 
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setEnergyLevel(value[0])}
                    className="[&>span]:bg-[#9B7EDC]" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-[#9B7EDC]">
                      <AlertCircle className="inline-block mr-2 h-4 w-4" />
                      Anxiety Level
                    </Label>
                    <span className="text-[#8B6AD1] font-medium">{anxietyLevel}/10</span>
                  </div>
                  <Slider 
                    value={[anxietyLevel]} 
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setAnxietyLevel(value[0])}
                    className="[&>span]:bg-[#9B7EDC]" 
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-[#9B7EDC]">Notes (Optional)</Label>
                <Textarea
                  placeholder="How are you feeling? What's on your mind?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none h-32 border-[#E6E6FA] focus:border-[#9B7EDC]"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 p-3 rounded-md text-red-500 text-sm">
                  {error}
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmit}
              className="w-full bg-[#9B7EDC] hover:bg-[#8B6AD1]"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Check-In'}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
