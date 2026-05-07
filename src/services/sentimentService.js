// Advanced Sentiment Analysis Engine

const EMOTION_KEYWORDS = {
  happiness: ['happy', 'joyful', 'excited', 'cheerful', 'delighted', 'pleased', 'content', 'glad'],
  sadness: ['sad', 'unhappy', 'depressed', 'down', 'miserable', 'sorrowful', 'gloomy'],
  stress: ['stressed', 'pressure', 'overwhelmed', 'tense', 'anxious', 'worried'],
  anxiety: ['anxious', 'nervous', 'worried', 'uneasy', 'fearful', 'panicked'],
  confidence: ['confident', 'assured', 'certain', 'strong', 'capable', 'empowered'],
  excitement: ['excited', 'thrilled', 'enthusiastic', 'eager', 'pumped'],
  loneliness: ['lonely', 'alone', 'isolated', 'abandoned', 'disconnected'],
  burnout: ['burnout', 'exhausted', 'drained', 'depleted', 'worn out'],
  calmness: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'composed'],
  anger: ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'annoyed'],
  fatigue: ['tired', 'fatigued', 'weary', 'exhausted', 'drained', 'sleepy']
};

const NEGATIONS = ['not', 'no', 'never', "don't", "can't", "won't", "isn't", "aren't"];
const INTENSIFIERS = ['very', 'extremely', 'really', 'super', 'highly', 'incredibly'];

export function analyzeText(text) {
  if (!text || text.trim().length < 3) {
    return null;
  }

  const words = text.toLowerCase().split(/\W+/);
  const emotions = detectEmotions(words);
  const scores = calculateScores(emotions);
  const state = determineEmotionalState(scores);
  const recommendations = generateRecommendations(scores, state);

  return {
    id: Date.now(),
    text,
    timestamp: new Date().toISOString(),
    emotions,
    scores,
    state,
    recommendations
  };
}

function detectEmotions(words) {
  const detected = {};
  
  words.forEach((word, index) => {
    const prevWord = index > 0 ? words[index - 1] : '';
    const isNegated = NEGATIONS.includes(prevWord);
    const isIntensified = INTENSIFIERS.includes(prevWord);
    const multiplier = isIntensified ? 1.5 : 1;

    Object.keys(EMOTION_KEYWORDS).forEach(emotion => {
      if (EMOTION_KEYWORDS[emotion].includes(word)) {
        if (!detected[emotion]) detected[emotion] = 0;
        detected[emotion] += (isNegated ? -1 : 1) * multiplier;
      }
    });
  });

  return detected;
}

function calculateScores(emotions) {
  const positive = (emotions.happiness || 0) + (emotions.excitement || 0) + (emotions.confidence || 0) + (emotions.calmness || 0);
  const negative = (emotions.sadness || 0) + (emotions.stress || 0) + (emotions.anxiety || 0) + (emotions.anger || 0) + (emotions.loneliness || 0) + (emotions.burnout || 0) + (emotions.fatigue || 0);

  const stressLevel = Math.max(0, Math.min(100, 50 + (emotions.stress || 0) * 10 + (emotions.anxiety || 0) * 8));
  const motivationLevel = Math.max(0, Math.min(100, 50 + (emotions.excitement || 0) * 10 + (emotions.confidence || 0) * 8 - (emotions.burnout || 0) * 10));
  const confidenceLevel = Math.max(0, Math.min(100, 50 + (emotions.confidence || 0) * 12 + positive * 3 - negative * 2));
  const emotionalBalance = Math.max(0, Math.min(100, 50 + positive * 5 - negative * 5));

  return {
    stressLevel: Math.round(stressLevel),
    motivationLevel: Math.round(motivationLevel),
    confidenceLevel: Math.round(confidenceLevel),
    emotionalBalance: Math.round(emotionalBalance)
  };
}

function determineEmotionalState(scores) {
  if (scores.stressLevel > 70 && scores.motivationLevel < 30) {
    return 'Burnout';
  } else if (scores.stressLevel > 60) {
    return 'Stressed';
  } else if (scores.emotionalBalance < 40) {
    return 'Low Mood';
  } else if (scores.motivationLevel > 70 && scores.confidenceLevel > 70) {
    return 'Thriving';
  } else if (scores.emotionalBalance > 70) {
    return 'Positive';
  } else if (scores.emotionalBalance > 50) {
    return 'Balanced';
  } else {
    return 'Neutral';
  }
}

function generateRecommendations(scores, state) {
  const recommendations = [];

  if (scores.stressLevel > 60) {
    recommendations.push('Practice deep breathing exercises');
    recommendations.push('Take regular breaks throughout the day');
  }

  if (scores.motivationLevel < 40) {
    recommendations.push('Set small, achievable goals');
    recommendations.push('Celebrate your small wins');
  }

  if (scores.confidenceLevel < 40) {
    recommendations.push('Reflect on your past successes');
    recommendations.push('Practice positive self-affirmations');
  }

  if (scores.emotionalBalance < 50) {
    recommendations.push('Connect with supportive friends or family');
    recommendations.push('Engage in activities you enjoy');
  }

  if (state === 'Burnout') {
    recommendations.push('Consider taking time off to recharge');
    recommendations.push('Seek professional support if needed');
  }

  if (recommendations.length === 0) {
    recommendations.push('Keep maintaining your positive habits');
    recommendations.push('Stay connected with your support system');
  }

  return recommendations.slice(0, 4);
}

// Journal Service
export const journalService = {
  getEntries(userId) {
    const key = `journal_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  addEntry(userId, entry) {
    const entries = this.getEntries(userId);
    const newEntry = {
      id: Date.now().toString(),
      ...entry,
      createdAt: new Date().toISOString()
    };
    entries.push(newEntry);
    localStorage.setItem(`journal_${userId}`, JSON.stringify(entries));
    return newEntry;
  },

  updateEntry(userId, entryId, updates) {
    const entries = this.getEntries(userId);
    const index = entries.findIndex(e => e.id === entryId);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(`journal_${userId}`, JSON.stringify(entries));
    }
    return entries[index];
  },

  deleteEntry(userId, entryId) {
    const entries = this.getEntries(userId);
    const filtered = entries.filter(e => e.id !== entryId);
    localStorage.setItem(`journal_${userId}`, JSON.stringify(filtered));
  },

  searchEntries(userId, query) {
    const entries = this.getEntries(userId);
    return entries.filter(e => 
      e.text.toLowerCase().includes(query.toLowerCase()) ||
      e.mood?.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Mood Calendar Service
export const calendarService = {
  getMoodData(userId, year, month) {
    const entries = journalService.getEntries(userId);
    const moodData = {};

    entries.forEach(entry => {
      const date = new Date(entry.createdAt);
      if (date.getFullYear() === year && date.getMonth() === month) {
        const day = date.getDate();
        if (!moodData[day]) {
          moodData[day] = [];
        }
        moodData[day].push({
          mood: entry.analysis?.state || 'Neutral',
          score: entry.analysis?.scores.emotionalBalance || 50
        });
      }
    });

    return moodData;
  }
};

// Simple storage for non-authenticated use
export function saveAnalysis(analysis) {
  const history = getHistory();
  history.push(analysis);
  localStorage.setItem('mindmirror_history', JSON.stringify(history));
}

export function getHistory() {
  const data = localStorage.getItem('mindmirror_history');
  return data ? JSON.parse(data) : [];
}

// Export history
export function exportHistory(userId) {
  const entries = userId ? journalService.getEntries(userId) : getHistory();
  const dataStr = JSON.stringify(entries, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mindmirror-export-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
}
