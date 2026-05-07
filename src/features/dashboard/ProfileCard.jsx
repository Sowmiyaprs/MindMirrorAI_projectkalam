/**
 * ProfileCard Component
 * 
 * User profile card with mock data
 */

import { User, Calendar, Flame } from 'lucide-react';
import { Card } from '../../components/Card';
import MockDataService from '../../services/MockDataService';

export function ProfileCard() {
  const profile = MockDataService.getUserProfile();

  return (
    <Card>
      <div className="flex items-center space-x-2 mb-4">
        <User className="w-5 h-5 text-primary-cyan" />
        <h3 className="text-lg font-bold text-white">Profile</h3>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-2xl font-bold text-white">
          {profile.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h4 className="text-white font-semibold">{profile.name}</h4>
          <p className="text-gray-400 text-sm">{profile.email}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Total Entries</span>
          </div>
          <span className="text-white font-semibold">{profile.totalEntries}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-300">Current Streak</span>
          </div>
          <span className="text-white font-semibold">{profile.currentStreak} days</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-primary-cyan" />
            <span className="text-sm text-gray-300">Longest Streak</span>
          </div>
          <span className="text-white font-semibold">{profile.longestStreak} days</span>
        </div>
      </div>
    </Card>
  );
}
