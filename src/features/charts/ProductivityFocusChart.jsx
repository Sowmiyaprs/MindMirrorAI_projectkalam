/**
 * ProductivityFocusChart Component
 * 
 * Bar chart showing productivity and focus over time
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { ChartContainer } from './ChartContainer';
import { useHistory } from '../../hooks/useHistory';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';
import { transformForProductivityFocus } from '../../utils/chartTransformers';
import MockDataService from '../../services/MockDataService';

export function ProductivityFocusChart() {
  const { entries } = useHistory();
  const { performanceMode } = usePerformanceMode();

  // Use real entries if available, otherwise use mock data
  const dataSource = entries.length > 0 ? entries : MockDataService.getHistoricalData(30).map(d => ({
    timestamp: d.timestamp,
    analysis: { scores: d }
  }));

  const data = transformForProductivityFocus(dataSource, performanceMode);

  return (
    <ChartContainer title="Productivity & Focus" icon={BarChart3}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
          <Bar dataKey="productivity" fill="#FFA500" radius={[8, 8, 0, 0]} />
          <Bar dataKey="focus" fill="#00FF88" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
