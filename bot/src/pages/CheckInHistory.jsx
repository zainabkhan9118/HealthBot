import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Moon,
  Zap,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Calendar,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCheckIns, deleteCheckIn } from '@/api/checkIns';
import { Separator } from '@/components/ui/separator';

export default function CheckInHistory() {
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  useEffect(() => {
    const fetchCheckIns = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        const response = await getCheckIns(token);
        if (response.success) {
          setCheckIns(response.data);
        } else {
          setError(response.message || 'Failed to load check-ins');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckIns();
  }, [navigate]);

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'Very Happy': return '😄';
      case 'Happy': return '🙂';
      case 'Neutral': return '😐';
      case 'Sad': return '😔';
      case 'Depressed': return '😢';
      default: return '❓';
    }
  };

  const handleDeleteCheckIn = async (id) => {
    if (!window.confirm('Are you sure you want to delete this check-in?')) {
      return;
    }

    try {
      setDeleteInProgress(true);
      const token = localStorage.getItem('token');
      const response = await deleteCheckIn(id, token);

      if (response.success) {
        setCheckIns(checkIns.filter(checkIn => checkIn._id !== id));
      } else {
        setError(response.message || 'Failed to delete check-in');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while deleting the check-in.');
    } finally {
      setDeleteInProgress(false);
    }
  };

  const groupCheckInsByDate = () => {
    const grouped = {};

    checkIns.forEach(checkIn => {
      const date = new Date(checkIn.date).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(checkIn);
    });

    return Object.entries(grouped).map(([date, items]) => ({
      date,
      items,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6E6FA]/30 to-white text-[#9B7EDC] font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm p-6 flex justify-between items-center sticky top-0 z-10 border-b border-[#E6E6FA]">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#7C5DC7]">Check-In History</h1>
        </div>
        <Button 
          onClick={() => navigate('/check-in')} 
          size="sm" 
          className="bg-[#9B7EDC] hover:bg-[#8B6AD1] text-white"
        >
          <Heart className="h-4 w-4 mr-2" />
          New Check-In
        </Button>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 max-w-3xl mx-auto space-y-6">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-[#9B7EDC] border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <Card className="border border-red-200 bg-red-50 text-red-600">
            <CardContent className="p-6">
              <p>{error}</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : checkIns.length === 0 ? (
          <Card className="border border-[#E6E6FA] text-center">
            <CardContent className="p-8">
              <div className="flex flex-col items-center">
                <Heart className="h-12 w-12 text-[#9B7EDC] mb-4" />
                <h2 className="text-xl font-semibold text-[#8B6AD1] mb-2">No Check-Ins Yet</h2>
                <p className="text-[#9B7EDC] mb-6">Start tracking your mental health journey with daily check-ins.</p>
                <Button 
                  onClick={() => navigate('/check-in')} 
                  className="bg-[#9B7EDC] hover:bg-[#8B6AD1]"
                >
                  Create Your First Check-In
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {groupCheckInsByDate().map((group) => (
              <div key={group.date} className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-[#8B6AD1] mr-2" />
                  <h2 className="text-lg font-medium text-[#8B6AD1]">
                    {new Date(group.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h2>
                </div>
                <div className="space-y-3">
                  {group.items.map((checkIn) => (
                    <Card 
                      key={checkIn._id} 
                      className={`border border-[#E6E6FA] transition-all ${expandedId === checkIn._id ? 'shadow-md' : ''}`}
                    >
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleExpand(checkIn._id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getMoodEmoji(checkIn.mood)}</div>
                          <div>
                            <p className="font-medium text-[#8B6AD1]">{checkIn.mood}</p>
                            <p className="text-xs text-[#9B7EDC]">{formatTime(checkIn.date)}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          {expandedId === checkIn._id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </Button>
                      </div>

                      {expandedId === checkIn._id && (
                        <div className="px-4 pb-4">
                          <Separator className="my-2 bg-[#E6E6FA]" />
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-[#E6E6FA]/30 rounded-lg">
                              <Moon className="h-4 w-4 mx-auto mb-1 text-[#9B7EDC]" />
                              <p className="text-xs text-[#9B7EDC]">Sleep</p>
                              <p className="font-medium text-[#8B6AD1]">{checkIn.metrics?.sleep || 'N/A'} hrs</p>
                            </div>
                            
                            <div className="text-center p-3 bg-[#E6E6FA]/30 rounded-lg">
                              <Zap className="h-4 w-4 mx-auto mb-1 text-[#9B7EDC]" />
                              <p className="text-xs text-[#9B7EDC]">Energy</p>
                              <p className="font-medium text-[#8B6AD1]">{checkIn.metrics?.energy || 'N/A'}/10</p>
                            </div>
                            
                            <div className="text-center p-3 bg-[#E6E6FA]/30 rounded-lg">
                              <AlertCircle className="h-4 w-4 mx-auto mb-1 text-[#9B7EDC]" />
                              <p className="text-xs text-[#9B7EDC]">Anxiety</p>
                              <p className="font-medium text-[#8B6AD1]">{checkIn.metrics?.anxiety || 'N/A'}/10</p>
                            </div>
                          </div>
                          
                          {checkIn.notes && (
                            <div className="mb-4">
                              <p className="text-sm text-[#9B7EDC] mb-1">Notes</p>
                              <p className="bg-[#E6E6FA]/20 p-3 rounded-lg text-sm">{checkIn.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCheckIn(checkIn._id);
                              }}
                              disabled={deleteInProgress}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
