import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Save, X, BookOpen, Filter } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { analyzeText } from '../services/sentimentService';

const MOOD_COLORS = {
  'Thriving': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  'Positive': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Balanced': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  'Neutral': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  'Low Mood': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  'Stressed': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  'Burnout': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
};

export function Journal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = () => {
    const key = `journal_${user?.email || 'guest'}`;
    const data = localStorage.getItem(key);
    setEntries(data ? JSON.parse(data) : []);
  };

  const saveEntries = (newEntries) => {
    const key = `journal_${user?.email || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const handleCreate = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const analysis = analyzeText(formData.content);
    const newEntry = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      mood: analysis?.state || 'Neutral',
      analysis: analysis,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveEntries([newEntry, ...entries]);
    setFormData({ title: '', content: '' });
    setIsCreating(false);
  };

  const handleUpdate = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const analysis = analyzeText(formData.content);
    const updated = entries.map(entry =>
      entry.id === editingId
        ? {
            ...entry,
            title: formData.title,
            content: formData.content,
            mood: analysis?.state || entry.mood,
            analysis: analysis,
            updatedAt: new Date().toISOString()
          }
        : entry
    );

    saveEntries(updated);
    setFormData({ title: '', content: '' });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      saveEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const handleEdit = (entry) => {
    setFormData({ title: entry.title, content: entry.content });
    setEditingId(entry.id);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  const uniqueMoods = ['all', ...new Set(entries.map(e => e.mood))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-lavender-500" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            My Journal
          </h1>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || editingId}>
          <Plus className="w-5 h-5 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lavender-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lavender-400"
            >
              {uniqueMoods.map(mood => (
                <option key={mood} value={mood}>
                  {mood === 'all' ? 'All Moods' : mood}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {(isCreating || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card glow>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingId ? 'Edit Entry' : 'New Entry'}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Entry title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lavender-500"
                />
                <textarea
                  placeholder="Write your thoughts..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full h-40 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lavender-500 resize-none"
                />
                <div className="flex gap-2">
                  <Button onClick={editingId ? handleUpdate : handleCreate}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Update' : 'Save'}
                  </Button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
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

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {searchQuery || filterMood !== 'all' ? 'No entries found' : 'No journal entries yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || filterMood !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'Start by creating your first entry'}
            </p>
          </Card>
        ) : (
          filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {entry.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(entry.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${MOOD_COLORS[entry.mood] || MOOD_COLORS['Neutral']}`}>
                      {entry.mood}
                    </span>
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-lavender-600 dark:hover:text-lavender-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {entry.content}
                </p>
                {entry.analysis && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Stress</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-white">
                          {entry.analysis.scores.stressLevel}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Motivation</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-white">
                          {entry.analysis.scores.motivationLevel}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Confidence</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-white">
                          {entry.analysis.scores.confidenceLevel}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Balance</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-white">
                          {entry.analysis.scores.emotionalBalance}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
