// Journal.jsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getJournalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } from "@/api/journal";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash, X, Check, Plus, BookOpen, Calendar, Smile, ArrowLeft } from "lucide-react";

const moodConfig = {
  'Very Happy': { emoji: '😄', color: '#10b981', bgColor: '#d1fae5' },
  'Happy': { emoji: '🙂', color: '#3b82f6', bgColor: '#dbeafe' },
  'Neutral': { emoji: '😐', color: '#8b5cf6', bgColor: '#ede9fe' },
  'Sad': { emoji: '😔', color: '#f59e0b', bgColor: '#fef3c7' },
  'Depressed': { emoji: '😢', color: '#ef4444', bgColor: '#fee2e2' }
};

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="hover:bg-gray-100 rounded-lg h-9 w-9 p-0"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-7 w-7 text-purple-600" />
                  Daily Journal
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {entries.length} {entries.length === 1 ? 'entry' : 'entries'} written
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-4 py-8 space-y-6">
        {/* New Entry Card */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-gray-100 bg-white">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-purple-600" />
              New Journal Entry
            </CardTitle>
            <CardDescription className="text-gray-600">Share your thoughts and feelings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 bg-white space-y-6">
            {/* Mood Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block text-gray-900">How are you feeling?</Label>
              <RadioGroup 
                value={mood} 
                onValueChange={setMood} 
                className="grid grid-cols-2 sm:grid-cols-5 gap-3"
              >
                {moodOptions.map((option) => {
                  const config = moodConfig[option];
                  return (
                    <div key={option} className="relative">
                      <RadioGroupItem value={option} id={option} className="sr-only peer" />
                      <Label 
                        htmlFor={option} 
                        className={`
                          flex flex-col items-center justify-center gap-2 p-3 rounded-lg cursor-pointer
                          border-2 transition-all duration-200
                          ${mood === option 
                            ? 'border-current shadow-sm scale-105' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                        style={mood === option ? { 
                          borderColor: config.color,
                          backgroundColor: config.bgColor 
                        } : {}}
                      >
                        <span className="text-2xl">{config.emoji}</span>
                        <span className="text-xs font-medium text-gray-700">{option}</span>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Text Entry */}
            <div>
              <Label className="text-base font-medium mb-2 block text-gray-900">Your Thoughts</Label>
              <Textarea
                className="resize-none min-h-[150px] border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white rounded-lg"
                placeholder="Write your thoughts, gratitude, or reflections..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleAddEntry} 
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md transition-all" 
              disabled={isLoading || !text.trim()}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Entry
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        {/* Journal Entries */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Your Entries
          </h2>
          
          {isLoading && entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-gray-200">
              <div className="h-12 w-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading entries...</p>
            </div>
          ) : !isLoading && entries.length === 0 ? (
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries yet</h3>
                <p className="text-gray-600">Start journaling to track your thoughts and feelings.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {entries.map((entry) => {
                const config = moodConfig[entry.mood] || moodConfig['Neutral'];
                const isEditing = editingEntry === entry._id;
                
                return (
                  <Card 
                    key={entry._id || Math.random()}
                    className="border border-gray-200 shadow-sm hover:shadow-md transition-all bg-white overflow-hidden group"
                  >
                    {/* Colored Top Bar */}
                    <div className="h-1" style={{ backgroundColor: config.color }}></div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="text-2xl p-2 rounded-lg"
                            style={{ backgroundColor: config.bgColor }}
                          >
                            {config.emoji}
                          </div>
                          <div>
                            <CardTitle className="text-sm font-semibold text-gray-900">
                              {new Date(entry.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </CardTitle>
                            <CardDescription 
                              className="text-sm font-medium mt-0.5"
                              style={{ color: config.color }}
                            >
                              {entry.mood}
                            </CardDescription>
                          </div>
                        </div>
                        
                        {!isEditing ? (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleEditEntry(entry)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                              onClick={() => entry._id && handleDeleteEntry(entry._id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                              onClick={() => entry._id && handleUpdateEntry(entry._id)}
                              disabled={isLoading}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {!isEditing ? (
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {entry.text}
                        </p>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block text-gray-900">Edit Mood</Label>
                            <RadioGroup 
                              value={editMood} 
                              onValueChange={setEditMood} 
                              className="grid grid-cols-5 gap-2"
                            >
                              {moodOptions.map((option) => {
                                const config = moodConfig[option];
                                return (
                                  <div key={option} className="relative">
                                    <RadioGroupItem value={option} id={`edit-${option}`} className="sr-only peer" />
                                    <Label 
                                      htmlFor={`edit-${option}`} 
                                      className={`
                                        flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer
                                        border-2 transition-all
                                        ${editMood === option 
                                          ? 'border-current' 
                                          : 'border-gray-200 hover:border-gray-300'
                                        }
                                      `}
                                      style={editMood === option ? { 
                                        borderColor: config.color,
                                        backgroundColor: config.bgColor 
                                      } : {}}
                                    >
                                      <span className="text-xl">{config.emoji}</span>
                                      <span className="text-xs font-medium text-gray-700 hidden xl:block">{option}</span>
                                    </Label>
                                  </div>
                                );
                              })}
                            </RadioGroup>
                          </div>
                          <div>
                            <Label htmlFor="edit-text" className="text-sm font-medium mb-2 block text-gray-900">Edit Entry</Label>
                            <Textarea
                              id="edit-text"
                              className="resize-none min-h-[100px] border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                              value={editText}
                              onChange={e => setEditText(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
