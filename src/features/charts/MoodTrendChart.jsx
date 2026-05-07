/**
 * MoodTrendChart Component
 * 
 * Line chart showing mood trends over time
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ChartContainer } from './ChartContainer';
import { useHistory } from '../../hooks/useHistory';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';
import { transformForMoodTrend } from '../../utils/chartTransformers';
import MockDataService from '../../services/MockDataService';

export function MoodTrendChart() {
  const { entries } = useHistory();
  const { performanceMode } = usePerformanceMode();

  // Use real entries if available, otherwise use mock data
  const dataSource = entries.length > 0 ? entries : MockDataService.getHistoricalData(30).map(d => ({
    timestamp: d.timestamp,
    analysis: { scores: d }
  }));

  const data = transformForMoodTrend(dataSource, performanceMode);

  return (
    <ChartContainer title="Mood Trends" icon={TrendingUp}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#00D9FF"
            strokeWidth={2}
            dot={{ fill: '#00D9FF', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="stress"
            stroke="#FF006E"
            strokeWidth={2}
            dot={{ fill: '#FF006E', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="motivation"
            stroke="#7B2CBF"
            strokeWidth={2}
            dot={{ fill: '#7B2CBF', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
