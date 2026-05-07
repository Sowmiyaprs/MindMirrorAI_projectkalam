/**
 * RetryHandler
 * 
 * Auto-retry with exponential backoff:
 * - Configurable max retries
 * - Exponential backoff delay
 * - Configurable max delay
 */

class RetryHandler {
  /**
   * Execute function with retry logic
   * @param {Function} fn - Function to execute
   * @param {Object} options - Retry options
   * @returns {Promise} Result of function execution
   */
  static async withRetry(fn, options = {}) {
    const {
      maxRetries = 1,
      initialDelay = 1000,
      maxDelay = 5000,
      backoffMultiplier = 2,
      onRetry = null,
    } = options;

    let lastError;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (attempt < maxRetries) {
          // Call onRetry callback if provided
          if (onRetry) {
            onRetry(attempt + 1, maxRetries, delay, error);
          }

          // Wait before retrying
          await this.sleep(delay);

          // Increase delay with exponential backoff
          delay = Math.min(delay * backoffMultiplier, maxDelay);
        }
      }
    }

    // All retries failed
    throw lastError;
  }

  /**
   * Sleep for specified milliseconds
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Execute function with single retry
   */
  static async withSingleRetry(fn, delay = 1000) {
    return this.withRetry(fn, { maxRetries: 1, initialDelay: delay });
  }

  /**
   * Execute function with timeout
   */
  static async withTimeout(fn, timeoutMs = 5000) {
    return Promise.race([
      fn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
      ),
    ]);
  }

  /**
   * Execute function with retry and timeout
   */
  static async withRetryAndTimeout(fn, options = {}) {
    const { timeout = 5000, ...retryOptions } = options;

    return this.withRetry(
      () => this.withTimeout(fn, timeout),
      retryOptions
    );
  }

  /**
   * Execute multiple functions in parallel with retry
   */
  static async parallelWithRetry(functions, options = {}) {
    const promises = functions.map(fn => this.withRetry(fn, options));
    return Promise.all(promises);
  }

  /**
   * Execute multiple functions in sequence with retry
   */
  static async sequenceWithRetry(functions, options = {}) {
    const results = [];

    for (const fn of functions) {
      const result = await this.withRetry(fn, options);
      results.push(result);
    }

    return results;
  }
}

export default RetryHandler;
