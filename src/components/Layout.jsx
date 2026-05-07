import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, History, Moon, Sun, Brain, Menu, X, LogOut, BookOpen, MessageCircle, User, Bell, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout({ children }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Analysis' },
    { path: '/journal', icon: BookOpen, label: 'Journal' },
    { path: '/chatbot', icon: MessageCircle, label: 'Chatbot' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/reminders', icon: Bell, label: 'Reminders' },
    { path: '/achievements', icon: Trophy, label: 'Achievements' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-gradient-lavender p-2.5 rounded-xl shadow-md border-2 border-lavender-100 dark:border-transparent">
                <Brain className="w-6 h-6 text-lavender-600 dark:text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                MindMirror AI
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2 max-w-4xl overflow-x-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap font-medium text-sm
                    ${location.pathname === item.path
                      ? 'bg-gradient-lavender text-white shadow-lavender' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-lavender-50 dark:hover:bg-gray-700 hover:text-lavender-700 dark:hover:text-white'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex-shrink-0"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-lavender-600" />
                )}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex-shrink-0 font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-medium
                      ${location.pathname === item.path
                        ? 'bg-gradient-lavender text-white shadow-lavender'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-lavender-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all font-medium"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-5 h-5 text-yellow-500" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 text-lavender-600" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
