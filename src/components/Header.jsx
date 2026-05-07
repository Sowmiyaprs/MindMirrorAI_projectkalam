/**
 * Header Component
 * 
 * Application header with branding
 */

import { Brain, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white dark:bg-gradient-primary p-2 rounded-lg border-2 border-lavender-100 dark:border-transparent">
              <Brain className="w-6 h-6 text-lavender-600 dark:text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MindMirror AI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Emotional Intelligence Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-purple-600" />
              )}
            </button>
            
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
