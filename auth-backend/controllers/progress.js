const CheckIn = require('../models/CheckIn');
const JournalEntry = require('../models/JournalEntry');

// Helper function to get date X days ago
const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Map mood to numeric value for charting
const moodToValue = (mood) => {
  const moodMap = {
    'Very Happy': 10,
    'Happy': 8,
    'Neutral': 5,
    'Sad': 3,
    'Depressed': 1
  };
  return moodMap[mood] || 5;
};

// Calculate journaling streak
const calculateJournalingStreak = (entries) => {
  if (!entries || entries.length === 0) return 0;

  // Sort entries by date (most recent first)
  const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak) {
      break;
    }
  }

  return streak;
};

// Get day of week label
const getDayLabel = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(date).getDay()];
};

// Generate mood data for the last 7 days
const generateWeeklyMoodData = (checkIns) => {
  const weekData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = getDaysAgo(i);
    const dayLabel = getDayLabel(date);
    
    // Find check-ins for this day
    const dayCheckIns = checkIns.filter(checkIn => {
      const checkInDate = new Date(checkIn.date);
      checkInDate.setHours(0, 0, 0, 0);
      return checkInDate.getTime() === date.getTime();
    });
    
    // Calculate average mood for the day
    let moodValue = null;
    if (dayCheckIns.length > 0) {
      const totalMood = dayCheckIns.reduce((sum, checkIn) => sum + moodToValue(checkIn.mood), 0);
      moodValue = Math.round(totalMood / dayCheckIns.length);
    }
    
    weekData.push({
      day: dayLabel,
      mood: moodValue,
      date: date.toISOString()
    });
  }
  
  return weekData;
};

// Generate monthly mood data (last 30 days)
const generateMonthlyMoodData = (checkIns) => {
  const monthData = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = getDaysAgo(i);
    
    // Find check-ins for this day
    const dayCheckIns = checkIns.filter(checkIn => {
      const checkInDate = new Date(checkIn.date);
      checkInDate.setHours(0, 0, 0, 0);
      return checkInDate.getTime() === date.getTime();
    });
    
    // Calculate average mood for the day
    let moodValue = null;
    if (dayCheckIns.length > 0) {
      const totalMood = dayCheckIns.reduce((sum, checkIn) => sum + moodToValue(checkIn.mood), 0);
      moodValue = Math.round(totalMood / dayCheckIns.length);
    }
    
    monthData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: moodValue,
      fullDate: date.toISOString()
    });
  }
  
  return monthData;
};

// Calculate achievements
const calculateAchievements = (journalStreak, weeklyEntries, checkIns) => {
  const achievements = [];
  
  if (journalStreak >= 7) {
    achievements.push('🌟 1 week journaling streak!');
  }
  if (journalStreak >= 14) {
    achievements.push('🔥 2 week journaling streak!');
  }
  if (journalStreak >= 30) {
    achievements.push('💎 1 month journaling streak!');
  }
  if (weeklyEntries >= 7) {
    achievements.push('📝 Daily journaling this week!');
  }
  if (checkIns.length >= 30) {
    achievements.push('🎯 30 check-ins milestone!');
  }
  
  return achievements.length > 0 ? achievements : ['Keep going! 💪'];
};

exports.getProgressData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch all check-ins and journal entries
    const [allCheckIns, allJournalEntries] = await Promise.all([
      CheckIn.find({ userId }).sort({ date: -1 }),
      JournalEntry.find({ userId }).sort({ date: -1 })
    ]);
    
    // Get check-ins from the last 30 days for charts
    const thirtyDaysAgo = getDaysAgo(30);
    const recentCheckIns = allCheckIns.filter(checkIn => new Date(checkIn.date) >= thirtyDaysAgo);
    
    // Get journal entries from the last 7 days for streak calculation
    const sevenDaysAgo = getDaysAgo(7);
    const weeklyJournalEntries = allJournalEntries.filter(entry => new Date(entry.date) >= sevenDaysAgo);
    
    // Generate mood data
    const weeklyMoodData = generateWeeklyMoodData(recentCheckIns);
    const monthlyMoodData = generateMonthlyMoodData(recentCheckIns);
    
    // Calculate stats
    const journalingStreak = calculateJournalingStreak(allJournalEntries);
    const entriesThisWeek = weeklyJournalEntries.length;
    const achievements = calculateAchievements(journalingStreak, entriesThisWeek, allCheckIns);
    
    // Calculate average mood for the week
    const weeklyCheckIns = recentCheckIns.filter(checkIn => new Date(checkIn.date) >= sevenDaysAgo);
    const averageMood = weeklyCheckIns.length > 0
      ? weeklyCheckIns.reduce((sum, checkIn) => sum + moodToValue(checkIn.mood), 0) / weeklyCheckIns.length
      : null;
    
    const progressData = {
      weeklyMoodData,
      monthlyMoodData,
      stats: {
        journalingStreak,
        entriesThisWeek,
        totalCheckIns: allCheckIns.length,
        totalJournalEntries: allJournalEntries.length,
        averageMood: averageMood ? averageMood.toFixed(1) : null
      },
      achievements
    };
    
    return res.json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error('Progress data error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to load progress data',
      error: error.message
    });
  }
};
