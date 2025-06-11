// Journal.jsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState("Neutral");
  const [text, setText] = useState("");
  
  const moodOptions = ["Very Happy", "Happy", "Neutral", "Sad", "Depressed"];
  
  // Helper function to get color based on mood
  const getMoodBadgeColor = (mood) => {
    switch(mood) {
      case "Very Happy": 
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Happy": 
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Neutral": 
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Sad": 
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "Depressed": 
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400";
      default: 
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300";
    }
  };
  const handleAddEntry = () => {
    if (text.trim() !== "") {
      setEntries([
        { date: new Date().toLocaleDateString(), mood, text },
        ...entries,
      ]);
      setText("");
      setMood("Neutral");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-3xl from-[#E6E6FA]/30 to-white dark:from-[#1A1A1A] dark:to-black">
      <Card>
        <CardHeader>
          <CardTitle>Daily Journal</CardTitle>
          <CardDescription>How are you feeling today?</CardDescription>
        </CardHeader>
        <CardContent>          <div className="mb-6">
            <Label className="text-base font-medium mb-3 block">How are you feeling today?</Label>
            <RadioGroup 
              value={mood} 
              onValueChange={setMood} 
              className="flex flex-wrap gap-3"
            >
              {moodOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={3}
            placeholder="Write your thoughts, gratitude, or reflections..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <Button onClick={handleAddEntry} className="w-full mt-2">Add Entry</Button>
        </CardContent>
      </Card>
      <div className="mt-8 space-y-4">
        {entries.length === 0 && <p className="text-center text-muted-foreground">No entries yet.</p>}
        {entries.map((entry, idx) => (
          <Card key={idx}>            <CardHeader>
              <CardTitle>{entry.date}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>Mood:</span> 
                <span className={`px-2 py-0.5 rounded-full text-sm ${getMoodBadgeColor(entry.mood)}`}>
                  {entry.mood}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{entry.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
