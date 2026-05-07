/**
 * InsightsPanel Component
 * 
 * Insights panel with mock data
 */

import { TrendingUp } from 'lucide-react';
import { Card } from '../../components/Card';
import MockDataService from '../../services/MockDataService';

export function InsightsPanel() {
  const insights = MockDataService.getInsights();

  return (
    <Card>
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary-purple" />
        <h3 className="text-lg font-bold text-white">Recent Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-3 bg-dark-bg rounded-lg border border-gray-700"
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{insight.icon}</span>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm mb-1">{insight.title}</h4>
                <p className="text-gray-400 text-xs">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
