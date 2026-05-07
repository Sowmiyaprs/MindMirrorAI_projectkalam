/**
 * Configuration
 * 
 * Centralized configuration for dev/prod switching
 */

const config = {
  // Environment
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',

  // Performance
  performance: {
    enableMonitoring: import.meta.env.MODE === 'development',
    cacheSize: 50,
    cacheTTL: 300000, // 5 minutes
    fpsMonitoringInterval: 1000, // 1 second
  },

  // Storage
  storage: {
    minRetention: 20,
    quotaThreshold: 80, // percentage
    autoCleanupEnabled: true,
  },

  // Analysis
  analysis: {
    minTextLength: 3,
    maxTextLength: 10000,
    defaultMode: 'auto', // 'auto' or 'manual'
  },

  // Charts
  charts: {
    maxDataPoints: {
      high: 90,
      low: 30,
    },
    animationDuration: {
      high: 500,
      low: 250,
    },
  },

  // Retry
  retry: {
    maxRetries: 1,
    initialDelay: 1000,
    maxDelay: 5000,
    backoffMultiplier: 2,
  },

  // Toast notifications
  toast: {
    duration: {
      success: 3000,
      error: 4000,
      info: 3000,
      warning: 3500,
    },
    position: 'top-right',
  },

  // Mock data
  mockData: {
    enabled: true,
    historicalDays: 30,
  },

  // Feature flags
  features: {
    exportData: true,
    performanceDashboard: import.meta.env.MODE === 'development',
    errorLogging: true,
    autoAnalyze: true,
  },

  // UI
  ui: {
    debounceDelay: 500, // ms
    autoAnalyzeDelay: 1000, // ms
    animationDuration: 300, // ms
  },
};

export default config;
