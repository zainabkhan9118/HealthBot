// Journal.jsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getJournalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } from "@/api/journal";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash, X, Check } from "lucide-react";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState("Neutral");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const [editMood, setEditMood] = useState("");
  const [editText, setEditText] = useState("");
  const navigate = useNavigate();
  
  const moodOptions = ["Very Happy", "Happy", "Neutral", "Sad", "Depressed"];
  
  // Fetch journal entries when component mounts
  useEffect(() => {
    const fetchEntries = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        setIsLoading(true);
        const res = await getJournalEntries(token);
        if (res.success) {
          setEntries(res.data);
        } else {
          setError(res.message || 'Failed to load journal entries');
        }
      } catch (err) {
        setError('Error loading journal entries');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [navigate]);
  
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
  const handleAddEntry = async () => {
    if (text.trim() !== "") {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        setIsLoading(true);
        const res = await addJournalEntry({ mood, text }, token);
        if (res.success) {
          // Add the new entry to our local state
          setEntries([res.data, ...entries]);
          setText("");
          setMood("Neutral");
        } else {
          setError(res.message || 'Failed to add journal entry');
        }
      } catch (err) {
        setError('Error adding journal entry');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleEditEntry = (entry) => {
    setEditingEntry(entry._id);
    setEditMood(entry.mood);
    setEditText(entry.text);
  };
  
  const handleCancelEdit = () => {
    setEditingEntry(null);
    setEditMood("");
    setEditText("");
  };
  
  const handleUpdateEntry = async (entryId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await updateJournalEntry(entryId, { mood: editMood, text: editText }, token);
      if (res.success) {
        // Update the entry in our local state
        setEntries(entries.map(entry => 
          entry._id === entryId ? res.data : entry
        ));
        setEditingEntry(null);
      } else {
        setError(res.message || 'Failed to update journal entry');
      }
    } catch (err) {
      setError('Error updating journal entry');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteEntry = async (entryId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await deleteJournalEntry(entryId, token);
      if (res.success) {
        // Remove the deleted entry from our local state
        setEntries(entries.filter(entry => entry._id !== entryId));
      } else {
        setError(res.message || 'Failed to delete journal entry');
      }
    } catch (err) {
      setError('Error deleting journal entry');
    } finally {
      setIsLoading(false);
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
          <Button 
          onClick={handleAddEntry} 
          className="w-full mt-2" 
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Add Entry'}
        </Button>
        </CardContent>
      </Card>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      <div className="mt-8 space-y-4">
        {isLoading && entries.length === 0 && <p className="text-center">Loading entries...</p>}
        {!isLoading && entries.length === 0 && <p className="text-center text-muted-foreground">No entries yet.</p>}
        {entries.map((entry) => (
          <Card key={entry._id || Math.random()}>
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle>{new Date(entry.date).toLocaleDateString()}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span>Mood:</span> 
                  <span className={`px-2 py-0.5 rounded-full text-sm ${getMoodBadgeColor(entry.mood)}`}>
                    {entry.mood}
                  </span>
                </CardDescription>
              </div>
              {editingEntry !== entry._id ? (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => handleEditEntry(entry)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => entry._id && handleDeleteEntry(entry._id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-green-500 hover:bg-green-50 hover:text-green-600"
                    onClick={() => entry._id && handleUpdateEntry(entry._id)}
                    disabled={isLoading}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 hover:bg-gray-50 hover:text-gray-600"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {editingEntry !== entry._id ? (
                <p>{entry.text}</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium mb-2 block">Edit Mood</Label>
                    <RadioGroup 
                      value={editMood} 
                      onValueChange={setEditMood} 
                      className="flex flex-wrap gap-2"
                    >
                      {moodOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-1">
                          <RadioGroupItem value={option} id={`edit-${option}`} />
                          <Label htmlFor={`edit-${option}`} className="cursor-pointer text-sm">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="edit-text" className="text-base font-medium mb-2 block">Edit Entry</Label>
                    <textarea
                      id="edit-text"
                      className="w-full border rounded p-2"
                      rows={3}
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
