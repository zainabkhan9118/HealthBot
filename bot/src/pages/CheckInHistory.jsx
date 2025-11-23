import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Moon,
  Zap,
  AlertCircle,
  Calendar,
  Trash2,
  TrendingUp,
  Sparkles,
  Clock,
  Plus,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCheckIns, deleteCheckIn } from '@/api/checkIns';
import { Badge } from '@/components/ui/badge';

const moodConfig = {
  'Very Happy': { emoji: '😄', color: '#10b981', bgColor: '#d1fae5', borderColor: '#10b981' },
  'Happy': { emoji: '🙂', color: '#3b82f6', bgColor: '#dbeafe', borderColor: '#3b82f6' },
  'Neutral': { emoji: '😐', color: '#8b5cf6', bgColor: '#ede9fe', borderColor: '#8b5cf6' },
  'Sad': { emoji: '😔', color: '#f59e0b', bgColor: '#fef3c7', borderColor: '#f59e0b' },
  'Depressed': { emoji: '😢', color: '#ef4444', bgColor: '#fee2e2', borderColor: '#ef4444' }
};

export default function CheckInHistory() {
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [filterMood, setFilterMood] = useState('all');

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  // Filter check-ins and sort by date (most recent first)
  const filteredCheckIns = (filterMood === 'all' 
    ? checkIns 
    : checkIns.filter(c => c.mood === filterMood)
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Check-In History
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {checkIns.length} {checkIns.length === 1 ? 'entry' : 'entries'} recorded
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/check-in')} 
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Check-In
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 max-w-7xl mx-auto space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16">
            <div className="h-12 w-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your check-ins...</p>
          </div>
        ) : error ? (
          <Card className="border border-red-200 shadow-sm bg-red-50">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="border-red-300 hover:bg-red-100"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : checkIns.length === 0 ? (
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-6">
                <Heart className="h-10 w-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Start Your Journey</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Begin tracking your mental wellness with daily check-ins and watch your progress grow.
              </p>
              <Button 
                onClick={() => navigate('/check-in')} 
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Check-In
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filter by mood:</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={filterMood === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterMood('all')}
                    className={filterMood === 'all' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-300 hover:bg-gray-100'}
                  >
                    All Moods
                  </Button>
                  {Object.keys(moodConfig).map((mood) => {
                    const config = moodConfig[mood];
                    return (
                      <Button
                        key={mood}
                        variant="outline"
                        size="sm"
                        onClick={() => setFilterMood(mood)}
                        className={`border-2 transition-all ${
                          filterMood === mood 
                            ? 'border-current shadow-sm' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        style={filterMood === mood ? { 
                          borderColor: config.color,
                          backgroundColor: config.bgColor,
                          color: config.color
                        } : {}}
                      >
                        <span className="mr-1.5">{config.emoji}</span>
                        {mood}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Check-ins List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCheckIns.map((checkIn) => {
                const config = moodConfig[checkIn.mood] || moodConfig['Neutral'];
                return (
                  <Card 
                    key={checkIn._id} 
                    className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white overflow-hidden group"
                  >
                    {/* Colored Top Bar */}
                    <div 
                      className="h-1" 
                      style={{ backgroundColor: config.color }}
                    ></div>
                    
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="text-3xl p-2.5 rounded-xl group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: config.bgColor }}
                          >
                            {config.emoji}
                          </div>
                          <div>
                            <h3 
                              className="font-bold text-lg"
                              style={{ color: config.color }}
                            >
                              {checkIn.mood}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(checkIn.date)}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {formatTime(checkIn.date)}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteCheckIn(checkIn._id)}
                          disabled={deleteInProgress}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 text-center">
                          <Moon className="h-4 w-4 mx-auto mb-1 text-indigo-600" />
                          <p className="text-xs text-gray-600">Sleep</p>
                          <p className="font-bold text-sm text-indigo-700">
                            {checkIn.metrics?.sleep || 'N/A'}h
                          </p>
                        </div>
                        
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 text-center">
                          <Zap className="h-4 w-4 mx-auto mb-1 text-amber-600" />
                          <p className="text-xs text-gray-600">Energy</p>
                          <p className="font-bold text-sm text-amber-700">
                            {checkIn.metrics?.energy || 'N/A'}/10
                          </p>
                        </div>
                        
                        <div className="bg-rose-50 border border-rose-100 rounded-lg p-2.5 text-center">
                          <AlertCircle className="h-4 w-4 mx-auto mb-1 text-rose-600" />
                          <p className="text-xs text-gray-600">Anxiety</p>
                          <p className="font-bold text-sm text-rose-700">
                            {checkIn.metrics?.anxiety || 'N/A'}/10
                          </p>
                        </div>
                      </div>

                      {/* Notes */}
                      {checkIn.notes && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1 font-medium">Notes</p>
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {checkIn.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
