/**
 * HybridCache
 * 
 * Implements hybrid LRU + TTL caching strategy:
 * - LRU (Least Recently Used) eviction when at capacity
 * - TTL (Time To Live) expiration for stale data
 * - Optimizes localStorage access
 */

class HybridCache {
  constructor(maxSize = 50, ttl = 300000) { // 5 min TTL default
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.accessOrder = [];
  }

  /**
   * Set cache entry
   */
  set(key, value) {
    const entry = {
      value,
      timestamp: Date.now(),
      lastAccess: Date.now(),
    };

    // Remove if exists (to update position)
    if (this.cache.has(key)) {
      this.remove(key);
    }

    // Evict LRU if at capacity
    if (this.cache.size >= this.maxSize) {
      const lruKey = this.accessOrder.shift();
      this.cache.delete(lruKey);
    }

    this.cache.set(key, entry);
    this.accessOrder.push(key);
  }

  /**
   * Get cache entry
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check TTL expiration
    if (Date.now() - entry.timestamp > this.ttl) {
      this.remove(key);
      return null;
    }

    // Update access time and order (LRU)
    entry.lastAccess = Date.now();
    this.updateAccessOrder(key);

    return entry.value;
  }

  /**
   * Remove cache entry
   */
  remove(key) {
    this.cache.delete(key);
    this.accessOrder = this.accessOrder.filter(k => k !== key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }

  /**
   * Update access order for LRU
   */
  updateAccessOrder(key) {
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }

  /**
   * Check if key exists
   */
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check TTL expiration
    if (Date.now() - entry.timestamp > this.ttl) {
      this.remove(key);
      return false;
    }

    return true;
  }

  /**
   * Get all keys
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    const stats = {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
      oldestEntry: null,
      newestEntry: null,
      averageAge: 0,
    };

    if (entries.length > 0) {
      const ages = entries.map(([_, entry]) => now - entry.timestamp);
      stats.oldestEntry = Math.max(...ages);
      stats.newestEntry = Math.min(...ages);
      stats.averageAge = ages.reduce((a, b) => a + b, 0) / ages.length;
    }

    return stats;
  }
}

export default HybridCache;
