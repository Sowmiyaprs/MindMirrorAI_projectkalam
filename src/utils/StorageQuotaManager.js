/**
 * StorageQuotaManager
 * 
 * Automatic localStorage quota management:
 * - Detect quota exceeded errors
 * - Automatically delete oldest entries
 * - Maintain minimum retention
 * - Provide storage statistics
 */

class StorageQuotaManager {
  static MIN_RETENTION = 20; // Minimum entries to keep

  /**
   * Save data with automatic quota management
   */
  static async saveWithQuotaManagement(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return { success: true };
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        return await this.handleQuotaExceeded(key, data);
      } else {
        throw error;
      }
    }
  }

  /**
   * Handle quota exceeded by deleting oldest entries
   */
  static async handleQuotaExceeded(key, data) {
    // Only handle array data (entries)
    if (!Array.isArray(data)) {
      throw new Error('Cannot manage quota for non-array data');
    }

    // Check minimum retention
    if (data.length <= this.MIN_RETENTION) {
      return {
        success: false,
        error: `Cannot save: minimum retention (${this.MIN_RETENTION} entries) reached. Please export and delete old entries.`,
      };
    }

    // Delete oldest 10%
    const deleteCount = Math.ceil(data.length * 0.1);
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
    const remainingData = sortedData.slice(deleteCount);

    // Retry save
    try {
      localStorage.setItem(key, JSON.stringify(remainingData));
      
      return {
        success: true,
        deletedCount: deleteCount,
        remainingCount: remainingData.length,
        message: `Deleted ${deleteCount} old entries to free space`,
      };
    } catch (retryError) {
      // If still fails, try deleting more
      if (retryError.name === 'QuotaExceededError' && remainingData.length > this.MIN_RETENTION) {
        return await this.handleQuotaExceeded(key, remainingData);
      } else {
        return {
          success: false,
          error: 'Failed to save even after cleanup. Storage quota critically low.',
        };
      }
    }
  }

  /**
   * Get storage usage statistics
   */
  static getStorageStats() {
    try {
      let totalSize = 0;
      const items = {};

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;
        
        items[key] = {
          size: this.formatBytes(size),
          sizeBytes: size,
        };
        
        totalSize += size;
      }

      // Estimate quota (usually 5-10 MB)
      const estimatedQuota = 10 * 1024 * 1024; // 10 MB
      const usagePercentage = (totalSize / estimatedQuota) * 100;

      return {
        totalSize: this.formatBytes(totalSize),
        totalSizeBytes: totalSize,
        estimatedQuota: this.formatBytes(estimatedQuota),
        usagePercentage: Math.round(usagePercentage),
        items,
        itemCount: localStorage.length,
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

  /**
   * Check if storage is near quota
   */
  static isNearQuota(threshold = 80) {
    const stats = this.getStorageStats();
    return stats && stats.usagePercentage >= threshold;
  }

  /**
   * Clear old entries to free space
   */
  static clearOldEntries(key, keepCount = 50) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      
      if (!Array.isArray(data)) {
        throw new Error('Data is not an array');
      }

      if (data.length <= keepCount) {
        return {
          success: true,
          message: 'No entries to delete',
          deletedCount: 0,
        };
      }

      // Sort by timestamp and keep newest entries
      const sortedData = [...data].sort((a, b) => b.timestamp - a.timestamp);
      const keptData = sortedData.slice(0, keepCount);
      const deletedCount = data.length - keepCount;

      localStorage.setItem(key, JSON.stringify(keptData));

      return {
        success: true,
        deletedCount,
        remainingCount: keptData.length,
        message: `Deleted ${deletedCount} old entries`,
      };
    } catch (error) {
      console.error('Failed to clear old entries:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Estimate remaining storage capacity
   */
  static estimateRemainingCapacity() {
    const stats = this.getStorageStats();
    if (!stats) return null;

    const estimatedQuota = 10 * 1024 * 1024; // 10 MB
    const remaining = estimatedQuota - stats.totalSizeBytes;

    return {
      remaining: this.formatBytes(remaining),
      remainingBytes: remaining,
      percentage: Math.round((remaining / estimatedQuota) * 100),
    };
  }
}

export default StorageQuotaManager;
