/**
 * PerformanceDetectionService
 * 
 * Detects device performance capabilities using:
 * - FPS measurement
 * - Device memory detection
 * - Hardware concurrency (CPU cores)
 * - Multi-factor scoring
 */

class PerformanceDetectionService {
  static cachedMode = null;

  /**
   * Detect performance mode
   * @returns {Promise<string>} 'high' or 'low'
   */
  static async detectPerformanceMode() {
    // Return cached result if available
    if (this.cachedMode) {
      return this.cachedMode;
    }

    try {
      // Measure FPS
      const fps = await this.measureFPS();

      // Get device memory (if available)
      const memory = this.getDeviceMemory();

      // Get hardware concurrency (CPU cores)
      const cores = this.getHardwareConcurrency();

      // Calculate performance score
      const score = this.calculatePerformanceScore(fps, memory, cores);

      // Determine mode
      const mode = score >= 70 ? 'high' : 'low';

      // Cache result
      this.cachedMode = mode;

      if (import.meta.env.MODE === 'development') {
        console.log('[PerformanceDetection]', {
          fps,
          memory,
          cores,
          score,
          mode,
        });
      }

      return mode;
    } catch (error) {
      console.error('Performance detection failed:', error);
      // Default to high performance on error
      return 'high';
    }
  }

  /**
   * Measure FPS over 1 second
   */
  static measureFPS() {
    return new Promise(resolve => {
      let frames = 0;
      const startTime = performance.now();
      const duration = 1000; // 1 second

      const countFrame = () => {
        frames++;
        const elapsed = performance.now() - startTime;

        if (elapsed < duration) {
          requestAnimationFrame(countFrame);
        } else {
          const fps = Math.round((frames * 1000) / elapsed);
          resolve(fps);
        }
      };

      requestAnimationFrame(countFrame);
    });
  }

  /**
   * Get device memory in GB
   */
  static getDeviceMemory() {
    // navigator.deviceMemory is only available in some browsers
    if ('deviceMemory' in navigator) {
      return navigator.deviceMemory; // Returns GB
    }
    // Default to 4GB if not available
    return 4;
  }

  /**
   * Get hardware concurrency (CPU cores)
   */
  static getHardwareConcurrency() {
    if ('hardwareConcurrency' in navigator) {
      return navigator.hardwareConcurrency;
    }
    // Default to 4 cores if not available
    return 4;
  }

  /**
   * Calculate performance score (0-100)
   */
  static calculatePerformanceScore(fps, memory, cores) {
    // FPS score (max 30 points)
    let fpsScore = 10;
    if (fps >= 50) fpsScore = 30;
    else if (fps >= 30) fpsScore = 20;

    // Memory score (max 30 points)
    let memoryScore = 10;
    if (memory >= 8) memoryScore = 30;
    else if (memory >= 4) memoryScore = 20;

    // Cores score (max 40 points)
    let coresScore = 10;
    if (cores >= 4) coresScore = 40;
    else if (cores >= 2) coresScore = 20;

    const totalScore = fpsScore + memoryScore + coresScore;
    return totalScore;
  }

  /**
   * Check if animations should be reduced
   */
  static shouldReduceAnimations(mode) {
    return mode === 'low';
  }

  /**
   * Get animation duration based on performance mode
   */
  static getAnimationDuration(mode, defaultDuration = 300) {
    return mode === 'low' ? defaultDuration * 0.5 : defaultDuration;
  }

  /**
   * Get chart data point limit based on performance mode
   */
  static getChartDataPointLimit(mode) {
    return mode === 'low' ? 30 : 90;
  }

  /**
   * Reset cached mode (for testing)
   */
  static resetCache() {
    this.cachedMode = null;
  }
}

export default PerformanceDetectionService;
