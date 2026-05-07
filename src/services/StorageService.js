/**
 * StorageService
 * 
 * Manages localStorage operations with:
 * - Single array structure for entries
 * - Automatic quota management
 * - Caching support
 * - Error handling
 */

import { v4 as uuidv4 } from './uuid.js';

const STORAGE_KEYS = {
  ENTRIES: 'mindmirror_entries',
  SETTINGS: 'mindmirror_settings',
  PERFORMANCE_MODE: 'mindmirror_performance_mode',
};

const DEFAULT_SETTINGS = {
  analysisMode: 'auto', // 'auto' or 'manual'
  performanceMode: 'high', // 'high' or 'low'
  theme: 'dark',
};

class StorageService {
  /**
   * Save a new journal entry with analysis
   */
  static saveEntry(text, analysis) {
    const entry = {
      id: uuidv4(),
      text,
      analysis,
      timestamp: Date.now(),
    };

    try {
      const entries = this.getAllEntries();
      entries.push(entry);
      
      // Try to save
      this.saveWithQuotaManagement(STORAGE_KEYS.ENTRIES, entries);
      
      return { success: true, entry };
    } catch (error) {
      console.error('Failed to save entry:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all journal entries
   */
  static getAllEntries() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load entries:', error);
      return [];
    }
  }

  /**
   * Get entry by ID
   */
  static getEntry(id) {
    const entries = this.getAllEntries();
    return entries.find(e => e.id === id) || null;
  }

  /**
   * Get recent entries (last N)
   */
  static getRecentEntries(count = 10) {
    const entries = this.getAllEntries();
    return entries
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }

  /**
   * Get entries within date range
   */
  static getEntriesByDateRange(startDate, endDate) {
    const entries = this.getAllEntries();
    return entries.filter(e => 
      e.timestamp >= startDate && e.timestamp <= endDate
    );
  }

  /**
   * Delete entry by ID
   */
  static deleteEntry(id) {
    try {
      const entries = this.getAllEntries();
      const filtered = entries.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete entry:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Clear all entries
   */
  static clearAllEntries() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ENTRIES);
      return { success: true };
    } catch (error) {
      console.error('Failed to clear entries:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get settings
   */
  static getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Save settings
   */
  static saveSettings(settings) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return { success: true, settings: updated };
    } catch (error) {
      console.error('Failed to save settings:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get performance mode
   */
  static getPerformanceMode() {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.PERFORMANCE_MODE);
      return mode || 'high';
    } catch (error) {
      console.error('Failed to load performance mode:', error);
      return 'high';
    }
  }

  /**
   * Save performance mode
   */
  static savePerformanceMode(mode) {
    try {
      localStorage.setItem(STORAGE_KEYS.PERFORMANCE_MODE, mode);
      return { success: true, mode };
    } catch (error) {
      console.error('Failed to save performance mode:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Save with automatic quota management
   */
  static saveWithQuotaManagement(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded(key, data);
      } else {
        throw error;
      }
    }
  }

  /**
   * Handle quota exceeded by deleting oldest entries
   */
  static handleQuotaExceeded(key, data) {
    if (key !== STORAGE_KEYS.ENTRIES) {
      throw new Error('Cannot manage quota for non-entry data');
    }

    const entries = Array.isArray(data) ? data : this.getAllEntries();

    // Minimum retention: 20 entries
    if (entries.length <= 20) {
      throw new Error('Cannot save: minimum retention (20 entries) reached. Please export and delete old entries.');
    }

    // Delete oldest 10%
    const deleteCount = Math.ceil(entries.length * 0.1);
    const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
    const remainingEntries = sortedEntries.slice(deleteCount);

    // Retry save
    try {
      localStorage.setItem(key, JSON.stringify(remainingEntries));
      console.warn(`Deleted ${deleteCount} old entries to free space`);
    } catch (retryError) {
      // If still fails, try deleting more
      if (retryError.name === 'QuotaExceededError' && remainingEntries.length > 20) {
        this.handleQuotaExceeded(key, remainingEntries);
      } else {
        throw retryError;
      }
    }
  }

  /**
   * Export entries as JSON
   */
  static exportAsJSON() {
    const entries = this.getAllEntries();
    const settings = this.getSettings();
    
    const exportData = {
      entries,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export entries as CSV
   */
  static exportAsCSV() {
    const entries = this.getAllEntries();
    
    const headers = ['ID', 'Date', 'Text', 'Mood', 'Stress', 'Motivation', 'Confidence', 'Productivity', 'Focus', 'Overall Mood'];
    const rows = entries.map(e => [
      e.id,
      new Date(e.timestamp).toISOString(),
      `"${e.text.replace(/"/g, '""')}"`, // Escape quotes
      e.analysis.scores.mood,
      e.analysis.scores.stress,
      e.analysis.scores.motivation,
      e.analysis.scores.confidence,
      e.analysis.scores.productivity,
      e.analysis.scores.focus,
      e.analysis.mood,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }

  /**
   * Get storage usage statistics
   */
  static getStorageStats() {
    try {
      const entries = this.getAllEntries();
      const entriesSize = new Blob([JSON.stringify(entries)]).size;
      const settingsSize = new Blob([JSON.stringify(this.getSettings())]).size;
      const totalSize = entriesSize + settingsSize;

      return {
        entryCount: entries.length,
        entriesSize: this.formatBytes(entriesSize),
        settingsSize: this.formatBytes(settingsSize),
        totalSize: this.formatBytes(totalSize),
        totalSizeBytes: totalSize,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return null;
    }
  }

  /**
   * Format bytes to human-readable string
   */
  static formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

export default StorageService;
