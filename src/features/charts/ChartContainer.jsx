/**
 * ChartContainer Component
 * 
 * Wrapper for chart components
 */

import { Card } from '../../components/Card';

export function ChartContainer({ title, icon: Icon, children }) {
  return (
    <Card>
      <div className="flex items-center space-x-2 mb-4">
        {Icon && <Icon className="w-5 h-5 text-primary-cyan" />}
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="h-64">
        {children}
      </div>
    </Card>
  );
}
