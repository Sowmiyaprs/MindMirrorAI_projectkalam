/**
 * ErrorHandlingService
 * 
 * Centralized error handling with:
 * - Error logging
 * - Toast notifications
 * - Error categorization
 */

import toast from 'react-hot-toast';

const ERROR_CATEGORIES = {
  VALIDATION: 'validation',
  STORAGE: 'storage',
  ANALYSIS: 'analysis',
  NETWORK: 'network',
  UNKNOWN: 'unknown',
};

class ErrorHandlingService {
  static errors = [];

  /**
   * Log error
   */
  static logError(error) {
    const errorEntry = {
      ...error,
      timestamp: Date.now(),
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    this.errors.push(errorEntry);

    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }

    // Log to console in development
    if (import.meta.env.MODE === 'development') {
      console.error('[ErrorHandlingService]', errorEntry);
    }

    return errorEntry;
  }

  /**
   * Show error toast
   */
  static showErrorToast(message, options = {}) {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#1E293B',
        color: '#fff',
        border: '1px solid #FF006E',
      },
      ...options,
    });
  }

  /**
   * Show success toast
   */
  static showSuccessToast(message, options = {}) {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#1E293B',
        color: '#fff',
        border: '1px solid #00D9FF',
      },
      ...options,
    });
  }

  /**
   * Show info toast
   */
  static showInfoToast(message, options = {}) {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#1E293B',
        color: '#fff',
        border: '1px solid #7B2CBF',
      },
      ...options,
    });
  }

  /**
   * Show warning toast
   */
  static showWarningToast(message, options = {}) {
    toast(message, {
      duration: 3500,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#1E293B',
        color: '#fff',
        border: '1px solid #FFA500',
      },
      ...options,
    });
  }

  /**
   * Handle validation error
   */
  static handleValidationError(error, showToast = true) {
    const logged = this.logError({
      category: ERROR_CATEGORIES.VALIDATION,
      message: error.message || error,
      component: error.component || 'Unknown',
    });

    if (showToast) {
      this.showErrorToast(error.message || error);
    }

    return logged;
  }

  /**
   * Handle storage error
   */
  static handleStorageError(error, showToast = true) {
    const logged = this.logError({
      category: ERROR_CATEGORIES.STORAGE,
      message: error.message || error,
      component: error.component || 'StorageService',
    });

    if (showToast) {
      this.showErrorToast('Failed to save data. Please try again.');
    }

    return logged;
  }

  /**
   * Handle analysis error
   */
  static handleAnalysisError(error, showToast = true) {
    const logged = this.logError({
      category: ERROR_CATEGORIES.ANALYSIS,
      message: error.message || error,
      component: error.component || 'SentimentAnalysisService',
    });

    if (showToast) {
      this.showErrorToast('Analysis failed. Please try again.');
    }

    return logged;
  }

  /**
   * Get all errors
   */
  static getAllErrors() {
    return [...this.errors];
  }

  /**
   * Get errors by category
   */
  static getErrorsByCategory(category) {
    return this.errors.filter(e => e.category === category);
  }

  /**
   * Clear all errors
   */
  static clearErrors() {
    this.errors = [];
  }

  /**
   * Get error statistics
   */
  static getErrorStats() {
    const stats = {
      total: this.errors.length,
      byCategory: {},
    };

    Object.values(ERROR_CATEGORIES).forEach(category => {
      stats.byCategory[category] = this.errors.filter(e => e.category === category).length;
    });

    return stats;
  }
}

export default ErrorHandlingService;
