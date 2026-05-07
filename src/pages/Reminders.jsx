import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, Clock, Save, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_REMINDERS = [
  { time: '09:00', message: 'Good morning! Take a moment to check in with yourself.', enabled: true },
  { time: '12:00', message: 'Midday check-in: How are you feeling?', enabled: true },
  { time: '18:00', message: 'Evening reflection: Journal about your day.', enabled: true },
  { time: '21:00', message: 'Wind down: Practice gratitude before bed.', enabled: true }
];

export function Reminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ time: '09:00', message: '', enabled: true });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadReminders();
    checkNotificationPermission();
  }, [user]);

  const loadReminders = () => {
    const key = `reminders_${user?.email || 'guest'}`;
    const data = localStorage.getItem(key);
    if (data) {
      setReminders(JSON.parse(data));
    } else {
      setReminders(DEFAULT_REMINDERS);
      saveReminders(DEFAULT_REMINDERS);
    }
  };

  const saveReminders = (newReminders) => {
    const key = `reminders_${user?.email || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(newReminders));
    setReminders(newReminders);
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      if (permission === 'granted') {
        alert('Notifications enabled! You will receive reminders at the scheduled times.');
      } else {
        alert('Notifications blocked. Please enable them in your browser settings.');
      }
    } else {
      alert('Your browser does not support notifications.');
    }
  };

  const handleCreate = () => {
    if (!formData.message.trim()) {
      alert('Please enter a reminder message');
      return;
    }

    const newReminder = {
      id: Date.now().toString(),
      ...formData
    };

    saveReminders([...reminders, newReminder]);
    setFormData({ time: '09:00', message: '', enabled: true });
    setIsCreating(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      saveReminders(reminders.filter(r => r.id !== id));
    }
  };

  const handleToggle = (id) => {
    const updated = reminders.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    saveReminders(updated);
  };

  const testNotification = () => {
    if (notificationsEnabled) {
      new Notification('MindMirror AI', {
        body: 'This is a test reminder! Your reminders are working.',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    } else {
      alert('Please enable notifications first.');
    }
  };

  // Schedule notifications (simplified - in production, use service workers)
  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      reminders.forEach(reminder => {
        if (reminder.enabled && reminder.time === currentTime) {
          new Notification('MindMirror AI Reminder', {
            body: reminder.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders, notificationsEnabled]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reminders
          </h1>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="w-5 h-5 mr-2" />
          New Reminder
        </Button>
      </div>

      {/* Notification Settings */}
      <Card glow>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Browser Notifications
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {notificationsEnabled 
                ? 'Notifications are enabled. You will receive reminders at scheduled times.'
                : 'Enable notifications to receive wellness reminders.'}
            </p>
          </div>
          <div className="flex gap-2">
            {!notificationsEnabled && (
              <Button onClick={requestNotificationPermission}>
                Enable
              </Button>
            )}
            {notificationsEnabled && (
              <button
                onClick={testNotification}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Test
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Create Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                New Reminder
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    placeholder="Enter reminder message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full h-24 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreate}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setFormData({ time: '09:00', message: '', enabled: true });
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2 inline" />
                    Cancel
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.length === 0 ? (
          <Card className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No reminders yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your first reminder to stay on track
            </p>
          </Card>
        ) : (
          reminders.map((reminder, index) => (
            <motion.div
              key={reminder.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${
                      reminder.enabled 
                        ? 'bg-purple-100 dark:bg-purple-900/30' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <Clock className={`w-6 h-6 ${
                        reminder.enabled 
                          ? 'text-purple-500' 
                          : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-lg font-bold ${
                          reminder.enabled 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-400 dark:text-gray-600'
                        }`}>
                          {reminder.time}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reminder.enabled
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {reminder.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        reminder.enabled 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-400 dark:text-gray-600'
                      }`}>
                        {reminder.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reminder.enabled}
                        onChange={() => handleToggle(reminder.id || index)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
                    </label>
                    <button
                      onClick={() => handleDelete(reminder.id || index)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Info Card */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Reminders help you maintain a consistent wellness routine</li>
          <li>• Enable browser notifications to receive alerts</li>
          <li>• Toggle reminders on/off without deleting them</li>
          <li>• Set reminders for morning check-ins, journaling, and evening reflection</li>
        </ul>
      </Card>
    </div>
  );
}
