/**
 * AchievementsPanel Component
 * 
 * Achievements panel with mock data
 */

import { Award } from 'lucide-react';
import { Card } from '../../components/Card';
import MockDataService from '../../services/MockDataService';

export function AchievementsPanel() {
  const achievements = MockDataService.getAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-primary-pink" />
          <h3 className="text-lg font-bold text-white">Achievements</h3>
        </div>
        <span className="text-sm text-gray-400">
          {unlockedCount}/{achievements.length}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`
              p-3 rounded-lg border text-center transition-all
              ${achievement.unlocked
                ? 'bg-dark-bg border-primary-cyan'
                : 'bg-dark-bg border-gray-700 opacity-50'
              }
            `}
          >
            <div className="text-3xl mb-2">{achievement.icon}</div>
            <p className="text-xs text-gray-300 font-semibold mb-1">{achievement.title}</p>
            <p className="text-xs text-gray-500">{achievement.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
