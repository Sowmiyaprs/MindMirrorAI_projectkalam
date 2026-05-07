# NFR Design Patterns - MindMirror AI

## Overview

This document defines design patterns for implementing non-functional requirements in the MindMirror AI application.

---

## 1. Performance Patterns

### Pattern 1.1: Hybrid LRU + TTL Cache

**Purpose**: Optimize localStorage access with intelligent caching

**Implementation**:
```javascript
class HybridCache {
  constructor(maxSize = 50, ttl = 300000) { // 5 min TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.accessOrder = [];
  }
  
  set(key, value) {
    const entry = {
      value,
      timestamp: Date.now(),
      lastAccess: Date.now()
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
  
  remove(key) {
    this.cache.delete(key);
    this.accessOrder = this.accessOrder.filter(k => k !== key);
  }
  
  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }
  
  updateAccessOrder(key) {
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
  }
}

// Usage in StorageService
const entryCache = new HybridCache(50, 300000);

function getEntry(id) {
  // Try cache first
  const cached = entryCache.get(id);
  if (cached) return cached;
  
  // Fallback to localStorage
  const entries = JSON.parse(localStorage.getItem('mindmirror_entries') || '[]');
  const entry = entries.find(e => e.id === id);
  
  if (entry) {
    entryCache.set(id, entry);
  }
  
  return entry;
}
```

**Benefits**:
- LRU eviction prevents unbounded growth
- TTL ensures fresh data
- Reduces localStorage access by ~80%

---

### Pattern 1.2: Hybrid Animation Strategy

**Purpose**: Optimize animations based on device performance and complexity

**Implementation**:
```javascript
// Animation configuration
const animationConfig = {
  // Simple animations (always use CSS)
  simple: {
    type: 'css',
    duration: 300,
    easing: 'ease-out'
  },
  
  // Complex animations (use Framer Motion with performance detection)
  complex: {
    type: 'framer',
    duration: (performanceMode) => performanceMode === 'high' ? 500 : 250,
    easing: 'easeOut'
  }
};

// CSS animations for simple transitions
.fade-enter {
  opacity: 0;
  transition: opacity 300ms ease-out;
}

.fade-enter-active {
  opacity: 1;
}

// Framer Motion for complex animations
import { motion } from 'framer-motion';
import { usePerformanceMode } from './hooks/usePerformanceMode';

function MetricCard({ score }) {
  const { performanceMode, shouldReduceAnimations } = usePerformanceMode();
  
  // Disable complex animations on low-end devices
  if (shouldReduceAnimations) {
    return <div className="metric-card fade-enter">{score}</div>;
  }
  
  // Use Framer Motion on high-end devices
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: performanceMode === 'high' ? 0.5 : 0.25,
        ease: 'easeOut'
      }}
    >
      {score}
    </motion.div>
  );
}
```

**Decision Matrix**:
| Animation Type | High Performance | Low Performance |
|---|---|---|
| Fade in/out | CSS | CSS |
| Slide | CSS | CSS |
| Scale | Framer Motion | CSS |
| Complex sequences | Framer Motion | Disabled |
| Particle effects | Framer Motion | Disabled |

---

### Pattern 1.3: Performance Monitoring Dashboard

**Purpose**: Monitor and visualize performance metrics in development mode

**Implementation**:
```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      analysisTime: [],
      chartRenderTime: [],
      storageOperations: [],
      fps: []
    };
    this.enabled = import.meta.env.MODE === 'development';
  }
  
  measureAnalysis(fn) {
    if (!this.enabled) return fn();
    
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.metrics.analysisTime.push(duration);
    console.log(`[PERF] Analysis: ${duration.toFixed(2)}ms`);
    
    return result;
  }
  
  measureChartRender(fn) {
    if (!this.enabled) return fn();
    
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.metrics.chartRenderTime.push(duration);
    console.log(`[PERF] Chart Render: ${duration.toFixed(2)}ms`);
    
    return result;
  }
  
  measureFPS() {
    if (!this.enabled) return;
    
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFrame = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        this.metrics.fps.push(fps);
        console.log(`[PERF] FPS: ${fps}`);
        
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFrame);
    };
    
    requestAnimationFrame(measureFrame);
  }
  
  getStats() {
    return {
      analysisAvg: this.average(this.metrics.analysisTime),
      analysisP95: this.percentile(this.metrics.analysisTime, 95),
      chartRenderAvg: this.average(this.metrics.chartRenderTime),
      chartRenderP95: this.percentile(this.metrics.chartRenderTime, 95),
      fpsAvg: this.average(this.metrics.fps)
    };
  }
  
  average(arr) {
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }
  
  percentile(arr, p) {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }
  
  renderDashboard() {
    if (!this.enabled) return null;
    
    const stats = this.getStats();
    
    return (
      <div className="performance-dashboard">
        <h3>Performance Metrics</h3>
        <div>Analysis Avg: {stats.analysisAvg.toFixed(2)}ms</div>
        <div>Analysis P95: {stats.analysisP95.toFixed(2)}ms</div>
        <div>Chart Render Avg: {stats.chartRenderAvg.toFixed(2)}ms</div>
        <div>Chart Render P95: {stats.chartRenderP95.toFixed(2)}ms</div>
        <div>FPS Avg: {stats.fpsAvg.toFixed(0)}</div>
      </div>
    );
  }
}

export const perfMonitor = new PerformanceMonitor();
```

---

## 2. Security Patterns

### Pattern 2.1: Input Sanitization Pipeline

**Purpose**: Prevent XSS attacks through multi-layer sanitization

**Implementation**:
```javascript
class InputSanitizer {
  static sanitize(input) {
    if (!input) return '';
    
    // Step 1: Remove HTML tags
    let sanitized = input.replace(/<[^>]*>/g, '');
    
    // Step 2: Escape special characters
    sanitized = this.escapeHtml(sanitized);
    
    // Step 3: Trim whitespace
    sanitized = sanitized.trim();
    
    // Step 4: Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ');
    
    return sanitized;
  }
  
  static escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
  
  static validate(input) {
    const sanitized = this.sanitize(input);
    
    if (sanitized.length < 3) {
      return { valid: false, error: 'Input too short (minimum 3 characters)' };
    }
    
    if (sanitized.length > 10000) {
      return { valid: false, error: 'Input too long (maximum 10,000 characters)' };
    }
    
    return { valid: true, sanitized };
  }
}
```

---

### Pattern 2.2: CSP Meta Tag Implementation

**Purpose**: Implement Content Security Policy for XSS prevention

**Implementation**:
```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:; 
               font-src 'self' data:;">
```

**Rationale**:
- `default-src 'self'`: Only load resources from same origin
- `script-src 'self' 'unsafe-inline'`: Allow inline scripts (required for single HTML file)
- `style-src 'self' 'unsafe-inline'`: Allow inline styles (required for Tailwind)
- `img-src 'self' data:`: Allow images from same origin and data URIs
- `font-src 'self' data:`: Allow fonts from same origin and data URIs

---

## 3. Reliability Patterns

### Pattern 3.1: Hierarchical Error Boundaries

**Purpose**: Isolate errors and provide granular recovery

**Implementation**:
```javascript
// Global Error Boundary (App level)
class GlobalErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    ErrorHandlingService.logError({
      component: 'GlobalErrorBoundary',
      action: 'render',
      error,
      timestamp: Date.now()
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1>Something went wrong</h1>
          <button onClick={() => window.location.reload()}>
            Reload Application
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Feature Error Boundary (Journal, Dashboard, Charts)
class FeatureErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    ErrorHandlingService.logError({
      component: this.props.feature,
      action: 'render',
      error,
      timestamp: Date.now()
    });
  }
  
  resetError = () => {
    this.setState({ hasError: false, error: null });
  };
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="feature-error">
          <p>Unable to load {this.props.feature}</p>
          <button onClick={this.resetError}>Try Again</button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage
<GlobalErrorBoundary>
  <App>
    <FeatureErrorBoundary feature="Journal">
      <JournalInput />
    </FeatureErrorBoundary>
    
    <FeatureErrorBoundary feature="Dashboard">
      <Dashboard />
    </FeatureErrorBoundary>
    
    <FeatureErrorBoundary feature="Charts">
      <ChartsSection />
    </FeatureErrorBoundary>
  </App>
</GlobalErrorBoundary>
```

---

### Pattern 3.2: Auto-Retry with Exponential Backoff

**Purpose**: Automatically retry failed operations with increasing delays

**Implementation**:
```javascript
class RetryHandler {
  static async withRetry(fn, options = {}) {
    const {
      maxRetries = 1,
      initialDelay = 1000,
      maxDelay = 5000,
      backoffMultiplier = 2
    } = options;
    
    let lastError;
    let delay = initialDelay;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          await this.sleep(delay);
          delay = Math.min(delay * backoffMultiplier, maxDelay);
        }
      }
    }
    
    throw lastError;
  }
  
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
async function analyzeWithRetry(text) {
  try {
    return await RetryHandler.withRetry(
      () => SentimentAnalysisService.analyze(text),
      { maxRetries: 1, initialDelay: 1000 }
    );
  } catch (error) {
    ErrorHandlingService.showErrorToast('Analysis failed. Please try again.');
    throw error;
  }
}
```

---

## 4. Scalability Patterns

### Pattern 4.1: Automatic Storage Quota Management

**Purpose**: Automatically manage localStorage quota by evicting old data

**Implementation**:
```javascript
class StorageQuotaManager {
  static async saveWithQuotaManagement(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        await this.handleQuotaExceeded(key, data);
      } else {
        throw error;
      }
    }
  }
  
  static async handleQuotaExceeded(key, data) {
    const entries = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Minimum retention: 20 entries
    if (entries.length <= 20) {
      throw new Error('Cannot save: minimum retention reached');
    }
    
    // Delete oldest 10%
    const deleteCount = Math.ceil(entries.length * 0.1);
    const sortedEntries = entries.sort((a, b) => a.timestamp - b.timestamp);
    const remainingEntries = sortedEntries.slice(deleteCount);
    
    // Retry save
    try {
      localStorage.setItem(key, JSON.stringify(remainingEntries));
      
      // Now save new data
      const updatedEntries = [...remainingEntries, ...data];
      localStorage.setItem(key, JSON.stringify(updatedEntries));
      
      ErrorHandlingService.showInfoToast(
        `Deleted ${deleteCount} old entries to free space`
      );
    } catch (retryError) {
      // If still fails, try deleting more
      if (retryError.name === 'QuotaExceededError') {
        await this.handleQuotaExceeded(key, data);
      } else {
        throw retryError;
      }
    }
  }
}
```

---

## Summary

**Performance Patterns**: 3 patterns (Hybrid cache, Hybrid animations, Performance monitoring)
**Security Patterns**: 2 patterns (Input sanitization pipeline, CSP implementation)
**Reliability Patterns**: 2 patterns (Hierarchical error boundaries, Auto-retry with backoff)
**Scalability Patterns**: 1 pattern (Automatic storage quota management)

**Total**: 8 design patterns defined

All patterns are implementable with the chosen tech stack and support the NFR requirements.
