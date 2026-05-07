/**
 * Sidebar Component
 * 
 * Navigation sidebar (simplified for single-page app)
 */

import { Home, TrendingUp, Settings, Download } from 'lucide-react';
import { useHistory } from '../hooks/useHistory';

export function Sidebar() {
  const { exportAsJSON, exportAsCSV } = useHistory();

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: TrendingUp, label: 'Analytics', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <aside className="hidden lg:block w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-800 min-h-screen p-6">
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
              ${item.active 
                ? 'bg-gradient-primary text-white shadow-glow-cyan' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-hover'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Export Data</h3>
        <div className="space-y-2">
          <button
            onClick={exportAsJSON}
            className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-hover transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={exportAsCSV}
            className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-hover transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
