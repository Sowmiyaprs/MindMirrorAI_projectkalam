/**
 * MockDataService
 * 
 * Provides realistic mock data for:
 * - User profile
 * - Achievements
 * - Historical analytics
 * - Chatbot memory
 */

class MockDataService {
  /**
   * Get mock user profile
   */
  static getUserProfile() {
    return {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      avatar: null, // Will use initials
      joinDate: new Date('2024-01-15').toISOString(),
      totalEntries: 127,
      currentStreak: 12,
      longestStreak: 45,
      favoriteTime: 'Evening',
    };
  }

  /**
   * Get mock achievements
   */
  static getAchievements() {
    return [
      {
        id: 'first-entry',
        title: 'First Steps',
        description: 'Created your first journal entry',
        icon: '🎯',
        unlocked: true,
        unlockedDate: new Date('2024-01-15').toISOString(),
      },
      {
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Maintained a 7-day streak',
        icon: '🔥',
        unlocked: true,
        unlockedDate: new Date('2024-01-22').toISOString(),
      },
      {
        id: 'month-streak',
        title: 'Monthly Master',
        description: 'Maintained a 30-day streak',
        icon: '⭐',
        unlocked: true,
        unlockedDate: new Date('2024-02-14').toISOString(),
      },
      {
        id: 'hundred-entries',
        title: 'Century Club',
        description: 'Created 100 journal entries',
        icon: '💯',
        unlocked: true,
        unlockedDate: new Date('2024-04-20').toISOString(),
      },
      {
        id: 'positive-week',
        title: 'Positivity Pro',
        description: 'Maintained positive mood for 7 days',
        icon: '😊',
        unlocked: true,
        unlockedDate: new Date('2024-03-10').toISOString(),
      },
      {
        id: 'stress-manager',
        title: 'Stress Manager',
        description: 'Reduced stress levels for 5 consecutive days',
        icon: '🧘',
        unlocked: false,
        unlockedDate: null,
      },
    ];
  }

  /**
   * Get mock weekly summary
   */
  static getWeeklySummary() {
    return {
      weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      weekEnd: new Date().toISOString(),
      entriesCount: 5,
      averageMood: 72,
      averageStress: 45,
      averageMotivation: 68,
      topMood: 'Productive',
      improvementArea: 'Stress Management',
      highlights: [
        'Maintained consistent journaling habit',
        'Improved motivation by 15%',
        'Identified key stress triggers',
      ],
    };
  }

  /**
   * Get mock insights
   */
  static getInsights() {
    return [
      {
        id: 'insight-1',
        type: 'pattern',
        title: 'Evening Productivity Peak',
        description: 'Your productivity scores are highest between 6-9 PM',
        icon: '📊',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'insight-2',
        type: 'trend',
        title: 'Stress Reduction Trend',
        description: 'Your stress levels have decreased by 20% over the past month',
        icon: '📉',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'insight-3',
        type: 'recommendation',
        title: 'Consistency Matters',
        description: 'You journal most effectively when maintaining a daily routine',
        icon: '💡',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  /**
   * Get mock historical data for charts (last 30 days)
   */
  static getHistoricalData(days = 30) {
    const data = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    for (let i = days - 1; i >= 0; i--) {
      const timestamp = now - (i * dayMs);
      const date = new Date(timestamp);

      // Generate realistic fluctuating scores
      const baselineMood = 60 + Math.sin(i / 7) * 15;
      const baselineStress = 50 + Math.cos(i / 5) * 20;
      const baselineMotivation = 65 + Math.sin(i / 10) * 20;

      data.push({
        date: date.toISOString().split('T')[0],
        timestamp,
        mood: Math.round(baselineMood + (Math.random() * 10 - 5)),
        stress: Math.round(baselineStress + (Math.random() * 10 - 5)),
        motivation: Math.round(baselineMotivation + (Math.random() * 10 - 5)),
        confidence: Math.round(60 + (Math.random() * 20)),
        productivity: Math.round(65 + (Math.random() * 20)),
        focus: Math.round(62 + (Math.random() * 20)),
      });
    }

    return data;
  }

  /**
   * Get mock chatbot conversation history
   */
  static getChatbotHistory() {
    return [
      {
        id: 'msg-1',
        role: 'user',
        content: 'How can I reduce my stress levels?',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Based on your recent entries, I recommend taking short breaks every hour and practicing deep breathing exercises. Your stress levels tend to spike during afternoon hours.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 5000).toISOString(),
      },
      {
        id: 'msg-3',
        role: 'user',
        content: 'What are my productivity patterns?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: 'Your productivity peaks in the evening (6-9 PM) and you work best when maintaining a consistent daily routine. Consider scheduling important tasks during your peak hours.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000).toISOString(),
      },
    ];
  }

  /**
   * Get mock calendar events
   */
  static getCalendarEvents() {
    const now = new Date();
    const events = [];

    // Generate events for next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);

      events.push({
        id: `event-${i}`,
        date: date.toISOString().split('T')[0],
        type: 'journal',
        title: 'Daily Journal',
        completed: i === 0,
      });

      if (i % 3 === 0) {
        events.push({
          id: `event-check-${i}`,
          date: date.toISOString().split('T')[0],
          type: 'check-in',
          title: 'Mood Check-in',
          completed: i === 0,
        });
      }
    }

    return events;
  }

  /**
   * Get mock mood distribution
   */
  static getMoodDistribution() {
    return [
      { mood: 'Happy', count: 25, percentage: 20 },
      { mood: 'Productive', count: 35, percentage: 28 },
      { mood: 'Calm', count: 20, percentage: 16 },
      { mood: 'Stressed', count: 18, percentage: 14 },
      { mood: 'Motivated', count: 22, percentage: 17 },
      { mood: 'Other', count: 7, percentage: 5 },
    ];
  }

  /**
   * Get mock statistics
   */
  static getStatistics() {
    return {
      totalEntries: 127,
      averageMood: 68,
      averageStress: 42,
      averageMotivation: 71,
      mostCommonMood: 'Productive',
      improvementRate: 15, // percentage
      consistencyScore: 85, // percentage
    };
  }
}

export default MockDataService;
