import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, TrendingUp, Target, Zap, Heart, Calendar } from 'lucide-react';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

const ALL_ACHIEVEMENTS = [
  {
    id: 'first_entry',
    icon: '🎯',
    title: 'First Steps',
    description: 'Create your first journal entry',
    requirement: 1,
    type: 'entries',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'entries_10',
    icon: '📝',
    title: 'Dedicated Writer',
    description: 'Create 10 journal entries',
    requirement: 10,
    type: 'entries',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'entries_50',
    icon: '📚',
    title: 'Prolific Journaler',
    description: 'Create 50 journal entries',
    requirement: 50,
    type: 'entries',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'entries_100',
    icon: '🏆',
    title: 'Journal Master',
    description: 'Create 100 journal entries',
    requirement: 100,
    type: 'entries',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'streak_3',
    icon: '🔥',
    title: '3-Day Streak',
    description: 'Journal for 3 consecutive days',
    requirement: 3,
    type: 'streak',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'streak_7',
    icon: '⭐',
    title: 'Week Warrior',
    description: 'Journal for 7 consecutive days',
    requirement: 7,
    type: 'streak',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'streak_30',
    icon: '💎',
    title: 'Monthly Champion',
    description: 'Journal for 30 consecutive days',
    requirement: 30,
    type: 'streak',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'streak_100',
    icon: '👑',
    title: 'Centurion',
    description: 'Journal for 100 consecutive days',
    requirement: 100,
    type: 'streak',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'mood_positive',
    icon: '😊',
    title: 'Positive Mindset',
    description: 'Maintain 70%+ emotional balance average',
    requirement: 70,
    type: 'mood',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'mood_excellent',
    icon: '🌟',
    title: 'Emotional Excellence',
    description: 'Maintain 85%+ emotional balance average',
    requirement: 85,
    type: 'mood',
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'early_bird',
    icon: '🌅',
    title: 'Early Bird',
    description: 'Journal before 8 AM five times',
    requirement: 5,
    type: 'early',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'night_owl',
    icon: '🌙',
    title: 'Night Owl',
    description: 'Journal after 10 PM five times',
    requirement: 5,
    type: 'late',
    color: 'from-indigo-600 to-purple-700'
  },
  {
    id: 'chatbot_user',
    icon: '💬',
    title: 'Conversationalist',
    description: 'Send 20 messages to the AI chatbot',
    requirement: 20,
    type: 'chat',
    color: 'from-blue-400 to-purple-500'
  },
  {
    id: 'self_care',
    icon: '💆',
    title: 'Self-Care Champion',
    description: 'Complete 10 wellness activities',
    requirement: 10,
    type: 'wellness',
    color: 'from-pink-400 to-rose-500'
  }
];

export function Achievements() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageMood: 0,
    earlyEntries: 0,
    lateEntries: 0,
    chatMessages: 0
  });
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  useEffect(() => {
    calculateStats();
  }, [user]);

  const calculateStats = () => {
    // Journal entries
    const journalKey = `journal_${user?.email || 'guest'}`;
    const journalData = localStorage.getItem(journalKey);
    const entries = journalData ? JSON.parse(journalData) : [];

    // Chat messages
    const chatKey = `chat_${user?.email || 'guest'}`;
    const chatData = localStorage.getItem(chatKey);
    const messages = chatData ? JSON.parse(chatData) : [];
    const userMessages = messages.filter(m => m.sender === 'user');

    // Total entries
    const totalEntries = entries.length;

    // Calculate streaks
    const dates = entries
      .map(e => new Date(e.createdAt).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (dates.length > 0) {
      // Current streak
      if (dates[0] === today || dates[0] === yesterday) {
        currentStreak = 1;
        for (let i = 1; i < dates.length; i++) {
          const prevDate = new Date(dates[i - 1]);
          const currDate = new Date(dates[i]);
          const diffDays = Math.floor((prevDate - currDate) / 86400000);
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Longest streak
      tempStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diffDays = Math.floor((prevDate - currDate) / 86400000);
        if (diffDays === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Average mood
    const moodScores = entries
      .filter(e => e.analysis?.scores?.emotionalBalance)
      .map(e => e.analysis.scores.emotionalBalance);
    const averageMood = moodScores.length > 0
      ? Math.round(moodScores.reduce((a, b) => a + b, 0) / moodScores.length)
      : 0;

    // Early and late entries
    const earlyEntries = entries.filter(e => {
      const hour = new Date(e.createdAt).getHours();
      return hour < 8;
    }).length;

    const lateEntries = entries.filter(e => {
      const hour = new Date(e.createdAt).getHours();
      return hour >= 22;
    }).length;

    setStats({
      totalEntries,
      currentStreak,
      longestStreak,
      averageMood,
      earlyEntries,
      lateEntries,
      chatMessages: userMessages.length
    });

    // Check achievements
    checkAchievements({
      totalEntries,
      currentStreak,
      longestStreak,
      averageMood,
      earlyEntries,
      lateEntries,
      chatMessages: userMessages.length
    });
  };

  const checkAchievements = (stats) => {
    const unlocked = [];

    ALL_ACHIEVEMENTS.forEach(achievement => {
      let isUnlocked = false;

      switch (achievement.type) {
        case 'entries':
          isUnlocked = stats.totalEntries >= achievement.requirement;
          break;
        case 'streak':
          isUnlocked = stats.longestStreak >= achievement.requirement;
          break;
        case 'mood':
          isUnlocked = stats.averageMood >= achievement.requirement;
          break;
        case 'early':
          isUnlocked = stats.earlyEntries >= achievement.requirement;
          break;
        case 'late':
          isUnlocked = stats.lateEntries >= achievement.requirement;
          break;
        case 'chat':
          isUnlocked = stats.chatMessages >= achievement.requirement;
          break;
        case 'wellness':
          // Placeholder for future wellness activities
          isUnlocked = false;
          break;
      }

      if (isUnlocked) {
        unlocked.push(achievement.id);
      }
    });

    setUnlockedAchievements(unlocked);
  };

  const getProgress = (achievement) => {
    let current = 0;

    switch (achievement.type) {
      case 'entries':
        current = stats.totalEntries;
        break;
      case 'streak':
        current = stats.longestStreak;
        break;
      case 'mood':
        current = stats.averageMood;
        break;
      case 'early':
        current = stats.earlyEntries;
        break;
      case 'late':
        current = stats.lateEntries;
        break;
      case 'chat':
        current = stats.chatMessages;
        break;
    }

    return Math.min(100, Math.round((current / achievement.requirement) * 100));
  };

  const lockedCount = ALL_ACHIEVEMENTS.length - unlockedAchievements.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="w-8 h-8 text-purple-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Achievements
        </h1>
      </div>

      {/* Progress Overview */}
      <Card glow>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-500">
              {unlockedAchievements.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-400">
              {lockedCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Locked</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-500">
              {Math.round((unlockedAchievements.length / ALL_ACHIEVEMENTS.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-500">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
          </div>
        </div>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_ACHIEVEMENTS.map((achievement, index) => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          const progress = getProgress(achievement);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`relative overflow-hidden ${isUnlocked ? 'ring-2 ring-purple-500' : ''}`}>
                {/* Background Gradient */}
                {isUnlocked && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-10`} />
                )}

                <div className="relative">
                  {/* Icon */}
                  <div className={`text-6xl mb-3 ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold mb-2 ${
                    isUnlocked 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-600'
                  }`}>
                    {achievement.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm mb-3 ${
                    isUnlocked 
                      ? 'text-gray-700 dark:text-gray-300' 
                      : 'text-gray-500 dark:text-gray-600'
                  }`}>
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  {!isUnlocked && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${achievement.color} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Unlocked Badge */}
                  {isUnlocked && (
                    <div className="flex items-center gap-2 text-purple-500 font-semibold">
                      <Award className="w-5 h-5" />
                      <span>Unlocked!</span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Motivational Message */}
      <Card>
        <div className="text-center py-6">
          <Star className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Keep Going!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {unlockedAchievements.length === 0 
              ? 'Start your wellness journey to unlock achievements!'
              : unlockedAchievements.length === ALL_ACHIEVEMENTS.length
              ? '🎉 Congratulations! You\'ve unlocked all achievements!'
              : `You've unlocked ${unlockedAchievements.length} out of ${ALL_ACHIEVEMENTS.length} achievements. Keep it up!`}
          </p>
        </div>
      </Card>
    </div>
  );
}
