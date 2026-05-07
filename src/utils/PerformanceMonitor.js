/**
 * PerformanceMonitor
 * 
 * Performance metrics tracking and visualization:
 * - Analysis time measurement
 * - Chart render time measurement
 * - FPS monitoring
 * - Storage operation tracking
 * - Development mode dashboard
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      analysisTime: [],
      chartRenderTime: [],
      storageOperations: [],
      fps: [],
    };
    this.enabled = import.meta.env.MODE === 'development';
    this.maxMetrics = 100; // Keep last 100 measurements
  }

  /**
   * Measure analysis performance
   */
  measureAnalysis(fn) {
    if (!this.enabled) return fn();

    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    this.metrics.analysisTime.push(duration);
    this.trimMetrics('analysisTime');

    console.log(`[PERF] Analysis: ${duration.toFixed(2)}ms`);

    return result;
  }

  /**
   * Measure async analysis performance
   */
  async measureAnalysisAsync(fn) {
    if (!this.enabled) return await fn();

    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    this.metrics.analysisTime.push(duration);
    this.trimMetrics('analysisTime');

    console.log(`[PERF] Analysis: ${duration.toFixed(2)}ms`);

    return result;
  }

  /**
   * Measure chart render performance
   */
  measureChartRender(fn) {
    if (!this.enabled) return fn();

    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    this.metrics.chartRenderTime.push(duration);
    this.trimMetrics('chartRenderTime');

    console.log(`[PERF] Chart Render: ${duration.toFixed(2)}ms`);

    return result;
  }

  /**
   * Measure storage operation performance
   */
  measureStorage(operation, fn) {
    if (!this.enabled) return fn();

    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    this.metrics.storageOperations.push({ operation, duration });
    this.trimMetrics('storageOperations');

    console.log(`[PERF] Storage (${operation}): ${duration.toFixed(2)}ms`);

    return result;
  }

  /**
   * Start FPS monitoring
   */
  startFPSMonitoring() {
    if (!this.enabled) return;

    let lastTime = performance.now();
    let frames = 0;

    const measureFrame = () => {
      frames++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        this.metrics.fps.push(fps);
        this.trimMetrics('fps');

        console.log(`[PERF] FPS: ${fps}`);

        frames = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  }

  /**
   * Trim metrics to max size
   */
  trimMetrics(metricName) {
    if (this.metrics[metricName].length > this.maxMetrics) {
      this.metrics[metricName] = this.metrics[metricName].slice(-this.maxMetrics);
    }
  }

  /**
   * Get statistics for a metric
   */
  getStats() {
    return {
      analysis: this.calculateStats(this.metrics.analysisTime),
      chartRender: this.calculateStats(this.metrics.chartRenderTime),
      fps: this.calculateStats(this.metrics.fps),
      storage: this.calculateStorageStats(),
    };
  }

  /**
   * Calculate statistics for an array of values
   */
  calculateStats(values) {
    if (values.length === 0) {
      return {
        count: 0,
        avg: 0,
        min: 0,
        max: 0,
        p50: 0,
        p95: 0,
        p99: 0,
      };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      count: values.length,
      avg: sum / values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: this.percentile(sorted, 50),
      p95: this.percentile(sorted, 95),
      p99: this.percentile(sorted, 99),
    };
  }

  /**
   * Calculate storage operation statistics
   */
  calculateStorageStats() {
    const operations = this.metrics.storageOperations;
    
    if (operations.length === 0) {
      return { count: 0, byOperation: {} };
    }

    const byOperation = {};
    
    operations.forEach(({ operation, duration }) => {
      if (!byOperation[operation]) {
        byOperation[operation] = [];
      }
      byOperation[operation].push(duration);
    });

    const stats = {};
    Object.keys(byOperation).forEach(operation => {
      stats[operation] = this.calculateStats(byOperation[operation]);
    });

    return {
      count: operations.length,
      byOperation: stats,
    };
  }

  /**
   * Calculate percentile
   */
  percentile(sortedArray, p) {
    if (sortedArray.length === 0) return 0;
    const index = Math.ceil((p / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
  }

  /**
   * Get dashboard data
   */
  getDashboardData() {
    if (!this.enabled) return null;

    const stats = this.getStats();

    return {
      analysis: {
        label: 'Analysis Time',
        avg: `${stats.analysis.avg.toFixed(2)}ms`,
        p95: `${stats.analysis.p95.toFixed(2)}ms`,
        count: stats.analysis.count,
      },
      chartRender: {
        label: 'Chart Render Time',
        avg: `${stats.chartRender.avg.toFixed(2)}ms`,
        p95: `${stats.chartRender.p95.toFixed(2)}ms`,
        count: stats.chartRender.count,
      },
      fps: {
        label: 'FPS',
        avg: `${stats.fps.avg.toFixed(0)}`,
        min: `${stats.fps.min.toFixed(0)}`,
        count: stats.fps.count,
      },
      storage: {
        label: 'Storage Operations',
        count: stats.storage.count,
        operations: Object.keys(stats.storage.byOperation).map(op => ({
          operation: op,
          avg: `${stats.storage.byOperation[op].avg.toFixed(2)}ms`,
          count: stats.storage.byOperation[op].count,
        })),
      },
    };
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = {
      analysisTime: [],
      chartRenderTime: [],
      storageOperations: [],
      fps: [],
    };
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics() {
    return JSON.stringify({
      metrics: this.metrics,
      stats: this.getStats(),
      timestamp: new Date().toISOString(),
    }, null, 2);
  }
}

// Create singleton instance
const perfMonitor = new PerformanceMonitor();

export default perfMonitor;
