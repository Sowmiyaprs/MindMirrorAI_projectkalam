/**
 * SuggestionsPanel Component
 * 
 * AI-generated suggestions panel
 */

import { Lightbulb, CheckCircle } from 'lucide-react';
import { Card } from '../../components/Card';

export function SuggestionsPanel({ suggestions }) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <Card glow>
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-5 h-5 text-primary-cyan" />
        <h3 className="text-lg font-bold text-white">AI Suggestions</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 bg-dark-bg rounded-lg border border-gray-700 hover:border-primary-cyan transition-all"
          >
            <CheckCircle className="w-5 h-5 text-primary-cyan flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 text-sm">{suggestion}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
