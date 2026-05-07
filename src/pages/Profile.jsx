import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Edit2, Save, Camera, Award, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

export function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar: ''
  });
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageMood: 0
  });

  useEffect(() => {
    loadProfile();
    calculateStats();
  }, [user]);

  const loadProfile = () => {
    const key = `profile_${user?.email || 'guest'}`;
    const data = localStorage.getItem(key);
    if (data) {
      const profile = JSON.parse(data);
      setFormData({
        username: profile.username || user?.email?.split('@')[0] || 'User',
        bio: profile.bio || '',
        avatar: profile.avatar || ''
      });
    } else {
      setFormData({
        username: user?.email?.split('@')[0] || 'User',
        bio: '',
        avatar: ''
      });
    }
  };

  const calculateStats = () => {
    const key = `journal_${user?.email || 'guest'}`;
    const data = localStorage.getItem(key);
    const entries = data ? JSON.parse(data) : [];

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

    // Average mood score
    const moodScores = entries
      .filter(e => e.analysis?.scores?.emotionalBalance)
      .map(e => e.analysis.scores.emotionalBalance);
    const averageMood = moodScores.length > 0
      ? Math.round(moodScores.reduce((a, b) => a + b, 0) / moodScores.length)
      : 0;

    setStats({
      totalEntries,
      currentStreak,
      longestStreak,
      averageMood
    });
  };

  const handleSave = () => {
    const key = `profile_${user?.email || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(formData));
    setIsEditing(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (stats.totalEntries >= 1) {
      achievements.push({ icon: '🎯', title: 'First Entry', description: 'Created your first journal entry' });
    }
    if (stats.totalEntries >= 10) {
      achievements.push({ icon: '📝', title: 'Dedicated Writer', description: 'Created 10 journal entries' });
    }
    if (stats.totalEntries >= 50) {
      achievements.push({ icon: '🏆', title: 'Journal Master', description: 'Created 50 journal entries' });
    }
    if (stats.currentStreak >= 3) {
      achievements.push({ icon: '🔥', title: '3-Day Streak', description: 'Journaled for 3 days in a row' });
    }
    if (stats.currentStreak >= 7) {
      achievements.push({ icon: '⭐', title: 'Week Warrior', description: 'Journaled for 7 days in a row' });
    }
    if (stats.longestStreak >= 30) {
      achievements.push({ icon: '💎', title: 'Monthly Champion', description: 'Journaled for 30 days in a row' });
    }
    if (stats.averageMood >= 70) {
      achievements.push({ icon: '😊', title: 'Positive Mindset', description: 'Maintained high emotional balance' });
    }

    return achievements;
  };

  const achievements = getAchievements();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-purple-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Profile
        </h1>
      </div>

      {/* Profile Card */}
      <Card glow>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center overflow-hidden">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Camera className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="w-full h-24 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      loadProfile();
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formData.username}
                  </h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                {formData.bio && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {formData.bio}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Your Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
          >
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalEntries}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Entries</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
          >
            <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.longestStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
          >
            <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.averageMood}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Balance</div>
          </motion.div>
        </div>
      </Card>

      {/* Achievements */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Achievements
        </h3>
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg"
              >
                <div className="text-4xl">{achievement.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Start journaling to unlock achievements!</p>
          </div>
        )}
      </Card>
    </div>
  );
}
