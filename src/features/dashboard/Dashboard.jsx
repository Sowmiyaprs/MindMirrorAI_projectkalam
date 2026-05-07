/**
 * Dashboard Component
 * 
 * Main dashboard with metrics, charts, and insights
 */

import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { MetricsGrid } from './MetricsGrid';
import { MoodDisplay } from './MoodDisplay';
import { SuggestionsPanel } from './SuggestionsPanel';
import { InsightsPanel } from './InsightsPanel';
import { AchievementsPanel } from './AchievementsPanel';
import { ProfileCard } from './ProfileCard';
import { MoodTrendChart } from '../charts/MoodTrendChart';
import { EmotionalDistributionChart } from '../charts/EmotionalDistributionChart';
import { ProductivityFocusChart } from '../charts/ProductivityFocusChart';
import { Card } from '../../components/Card';

export function Dashboard() {
  const { currentAnalysis, isLoading } = useContext(AppContext);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <Card className="text-center py-12">
        <div className="text-6xl mb-4">🧠</div>
        <h3 className="text-xl font-bold text-white mb-2">No Analysis Yet</h3>
        <p className="text-gray-400">
          Start by sharing your thoughts in the journal above
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Section: Mood + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MoodDisplay mood={currentAnalysis.mood} />
        </div>
        <div className="lg:col-span-2">
          <MetricsGrid scores={currentAnalysis.scores} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodTrendChart />
        <EmotionalDistributionChart analysis={currentAnalysis} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ProductivityFocusChart />
      </div>

      {/* Suggestions + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SuggestionsPanel suggestions={currentAnalysis.suggestions} />
        <InsightsPanel />
      </div>

      {/* Achievements + Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AchievementsPanel />
        <ProfileCard />
      </div>
    </div>
  );
}
