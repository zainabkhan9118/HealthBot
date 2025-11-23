const ChatMessage = require('../models/ChatMessage');
const JournalEntry = require('../models/JournalEntry');
const CheckIn = require('../models/CheckIn');
const RecommendationCache = require('../models/RecommendationCache');
const { generateRecommendations } = require('../services/mindClient');

const POSITIVE_MOODS = ['Very Happy', 'Happy'];
const NEUTRAL_MOODS = ['Neutral'];
const CHALLENGING_MOODS = ['Sad', 'Depressed'];

const DEFAULT_WEEKLY_SUMMARY =
  'Keep leaning into the small habits that help you reset throughout the day.';
const CACHE_TTL_MS = Number(process.env.RECOMMENDATION_CACHE_TTL_MS || 1000 * 60 * 30); // 30 minutes

const deriveMoodSegments = (checkIns = []) => {
  if (!checkIns.length) {
    return { positive: 0, neutral: 0, challenging: 0 };
  }

  const total = checkIns.length;
  const counts = checkIns.reduce(
    (acc, entry) => {
      if (POSITIVE_MOODS.includes(entry.mood)) acc.positive += 1;
      else if (NEUTRAL_MOODS.includes(entry.mood)) acc.neutral += 1;
      else acc.challenging += 1;
      return acc;
    },
    { positive: 0, neutral: 0, challenging: 0 }
  );

  return {
    positive: Math.round((counts.positive / total) * 100),
    neutral: Math.round((counts.neutral / total) * 100),
    challenging: Math.round((counts.challenging / total) * 100)
  };
};

const buildTimeline = (checkIns = []) =>
  checkIns
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-10)
    .map((entry) => ({
      dateLabel: new Date(entry.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      mood: entry.mood,
      value:
        POSITIVE_MOODS.includes(entry.mood) ? 4 :
        NEUTRAL_MOODS.includes(entry.mood) ? 3 :
        CHALLENGING_MOODS.includes(entry.mood) ? 2 : 3
    }));

const buildRecentMoods = (checkIns = []) =>
  checkIns.slice(0, 5).map((entry) => ({
    id: entry._id,
    mood: entry.mood,
    notes: entry.notes,
    date: entry.date
  }));

const normalizeSuggestions = (rawSuggestions = {}) => {
  const formatList = (list = []) =>
    list
      .filter(Boolean)
      .map((item, idx) => ({
        id: item.id || `${item.title || 'item'}-${idx}`,
        title: item.title || item.name || 'Suggestion',
        description: item.description || item.detail || '',
        duration: item.duration || '',
        type: item.type || item.category || '',
        url: item.url || '',
        tags: item.tags || [],
        moodMatch: item.moodMatch || item.mood_match || ''
      }));

  return {
    exercises: formatList(rawSuggestions.exercises),
    breathing: formatList(rawSuggestions.breathing),
    moodTips: formatList(rawSuggestions.moodTips || rawSuggestions.mood_tips),
    stressRelief: formatList(rawSuggestions.stressRelief || rawSuggestions.stress_relief),
    resources: formatList(rawSuggestions.resources)
  };
};

const loadUserInsights = async (userId) => {
  const [checkIns, journalEntries, chatMessages] = await Promise.all([
    CheckIn.find({ userId }).sort({ date: -1 }).limit(30),
    JournalEntry.find({ userId }).sort({ date: -1 }).limit(20),
    ChatMessage.find({ userId }).sort({ timestamp: -1 }).limit(40)
  ]);

  return { checkIns, journalEntries, chatMessages };
};

const buildAiPayload = ({ checkIns = [], journalEntries = [], chatMessages = [] }) => ({
  chat_history: chatMessages.slice(0, 10).map((msg) => ({
    role: msg.role,
    content: msg.content,
    sentiment: msg.sentiment?.sentiment,
    timestamp: msg.timestamp
  })),
  journal_entries: journalEntries.slice(0, 5).map((entry) => ({
    mood: entry.mood,
    text: entry.text,
    date: entry.date
  })),
  check_ins: checkIns.slice(0, 7).map((entry) => ({
    mood: entry.mood,
    notes: entry.notes,
    date: entry.date
  }))
});

const latestTimestamp = (items = [], accessor = (item) => item?.date || item?.timestamp) => {
  if (!items.length) return null;
  const ts = accessor(items[0]);
  if (!ts) return null;
  return new Date(ts).getTime();
};

const getLatestActivityTimestamp = (insights) => {
  const candidates = [
    latestTimestamp(insights.checkIns, (item) => item?.date),
    latestTimestamp(insights.journalEntries, (item) => item?.date),
    latestTimestamp(insights.chatMessages, (item) => item?.timestamp)
  ].filter(Boolean);

  if (!candidates.length) return null;
  return Math.max(...candidates);
};

const shouldRefreshCache = (cache, latestActivityTs) => {
  if (!cache) return true;
  const cacheTs = new Date(cache.updatedAt).getTime();
  const isStale = Date.now() - cacheTs > CACHE_TTL_MS;
  const isOlderThanActivity = latestActivityTs && cacheTs < latestActivityTs;
  return isStale || isOlderThanActivity;
};

const persistRecommendations = async (userId, payload) =>
  RecommendationCache.findOneAndUpdate(
    { userId },
    payload,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

const getCachedRecommendations = async (userId) =>
  RecommendationCache.findOne({ userId });

const buildRecommendationPayload = (aiResponse, suggestions) => ({
  suggestions,
  actionPlan: aiResponse?.action_plan || [],
  weeklySummary: aiResponse?.weekly_summary || DEFAULT_WEEKLY_SUMMARY,
  resourceSummary: aiResponse?.resource_summary || aiResponse?.weekly_summary || ''
});

const getRecommendationsForUser = async (userId, userInsights) => {
  const cache = await getCachedRecommendations(userId);
  const latestActivityTs = getLatestActivityTimestamp(userInsights);
  const needsRefresh = shouldRefreshCache(cache, latestActivityTs);

  if (!needsRefresh && cache) {
    return { ...cache.toObject(), source: 'cache' };
  }

  const aiPayload = buildAiPayload(userInsights);
  
  try {
    const aiResponse = await generateRecommendations(aiPayload);

    if (aiResponse) {
      const suggestions = normalizeSuggestions(aiResponse?.suggestions || {});
      const payload = buildRecommendationPayload(aiResponse, suggestions);
      const updatedCache = await persistRecommendations(userId, payload);
      return { ...updatedCache.toObject(), source: 'fresh' };
    }
  } catch (error) {
    console.error('AI recommendation generation failed:', error.message);
  }

  // If AI fails but we have cache, use it
  if (cache) {
    console.log('Using stale cache due to AI failure');
    return { ...cache.toObject(), source: 'stale-cache' };
  }

  // If no cache and AI failed, provide basic fallback
  console.log('Using fallback recommendations');
  const fallbackRecommendations = {
    suggestions: {
      exercises: [
        { id: 'ex-1', title: 'Gentle stretching', description: 'Take 5 minutes to stretch your body', duration: '5 min' }
      ],
      breathing: [
        { id: 'br-1', title: 'Deep breathing', description: 'Practice 4-4-4-4 box breathing', duration: '3 min' }
      ],
      moodTips: [
        { id: 'mt-1', title: 'Daily gratitude', description: 'Write down three things you\'re grateful for today' }
      ],
      stressRelief: [
        { id: 'sr-1', title: 'Take a break', description: 'Step away from your screen for 10 minutes', duration: '10 min' }
      ],
      resources: [
        { id: 'rs-1', title: 'Mindfulness basics', type: 'article', description: 'Learn about mindfulness practice', url: '', tags: ['mindfulness'] }
      ]
    },
    actionPlan: [
      { title: 'Morning check-in', detail: 'Take a moment to note how you\'re feeling', timeOfDay: 'morning' },
      { title: 'Midday reset', detail: 'Practice deep breathing for 3 minutes', timeOfDay: 'afternoon' },
      { title: 'Evening reflection', detail: 'Journal about your day', timeOfDay: 'evening' }
    ],
    weeklySummary: DEFAULT_WEEKLY_SUMMARY,
    resourceSummary: 'Start with small wellness habits and build from there.'
  };
  
  // Save fallback to cache for future use
  try {
    await persistRecommendations(userId, fallbackRecommendations);
  } catch (cacheError) {
    console.error('Failed to cache fallback recommendations:', cacheError.message);
  }
  
  return { ...fallbackRecommendations, source: 'fallback' };
};

exports.getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const userInsights = await loadUserInsights(userId);
    const { checkIns } = userInsights;

    const moodPercentages = deriveMoodSegments(checkIns);
    const moodTimeline = buildTimeline(checkIns);
    const recentMoods = buildRecentMoods(checkIns);
    const recommendationBundle = await getRecommendationsForUser(userId, userInsights);

    const overview = {
      user: {
        name: req.user?.name || 'Friend'
      },
      moodSummary: {
        percentages: moodPercentages,
        timeline: moodTimeline,
        recentMoods
      },
      weeklySummary: recommendationBundle.weeklySummary || DEFAULT_WEEKLY_SUMMARY,
      actionPlan: recommendationBundle.actionPlan || [],
      suggestions: recommendationBundle.suggestions || {}
    };

    return res.json({ success: true, data: overview });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to load dashboard data',
      error: error.message
    });
  }
};

exports.getResourceRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userInsights = await loadUserInsights(userId);
    const recommendationBundle = await getRecommendationsForUser(userId, userInsights);

    return res.json({
      success: true,
      data: {
        resources: recommendationBundle.suggestions?.resources || [],
        summary: recommendationBundle.resourceSummary || recommendationBundle.weeklySummary || ''
      }
    });
  } catch (error) {
    console.error('Resource recommendation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to load resources',
      error: error.message
    });
  }
};

