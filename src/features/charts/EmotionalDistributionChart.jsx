/**
 * EmotionalDistributionChart Component
 * 
 * Pie chart showing emotional distribution
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { ChartContainer } from './ChartContainer';
import { transformForEmotionalDistribution } from '../../utils/chartTransformers';

export function EmotionalDistributionChart({ analysis }) {
  const data = transformForEmotionalDistribution(analysis);

  return (
    <ChartContainer title="Emotional Distribution" icon={PieIcon}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
