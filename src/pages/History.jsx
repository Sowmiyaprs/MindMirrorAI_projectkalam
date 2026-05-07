import { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Download, Clock } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { getHistory, exportHistory } from '../services/sentimentService';

export function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const chartData = history.slice(-10).map((item, index) => ({
    name: `Entry ${index + 1}`,
    mood: item.scores.mood,
    stress: item.scores.stress,
    motivation: item.scores.motivation
  }));

  const pieData = history.length > 0 ? [
    { name: 'Positive', value: history[history.length - 1].scores.mood, color: '#00D9FF' },
    { name: 'Stress', value: history[history.length - 1].scores.stress, color: '#FF006E' },
    { name: 'Motivation', value: history[history.length - 1].scores.motivation, color: '#7B2CBF' }
  ] : [];

  const barData = history.slice(-5).map((item, index) => ({
    name: `Entry ${index + 1}`,
    productivity: item.scores.productivity,
    focus: item.scores.focus
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analysis History
        </h1>
        <Button onClick={exportHistory} variant="outline">
          <Download className="w-5 h-5 mr-2" />
          Export JSON
        </Button>
      </div>

      {history.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No History Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your analysis history will appear here
          </p>
        </Card>
      ) : (
        <>
          {/* Mood Trend Chart */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Mood Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="mood" stroke="#00D9FF" strokeWidth={2} />
                <Line type="monotone" dataKey="stress" stroke="#FF006E" strokeWidth={2} />
                <Line type="monotone" dataKey="motivation" stroke="#7B2CBF" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Emotional Distribution */}
          {pieData.length > 0 && (
            <Card>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Latest Emotional Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${Math.round(value)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Productivity & Focus */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Productivity & Focus
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="productivity" fill="#FFA500" radius={[8, 8, 0, 0]} />
                <Bar dataKey="focus" fill="#00FF88" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Entries */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Entries
            </h3>
            <div className="space-y-3">
              {history.slice(-5).reverse().map((item) => (
                <div 
                  key={item.id}
                  className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                    <span className="ml-auto text-sm font-semibold text-cyan-500">
                      {item.mood}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
