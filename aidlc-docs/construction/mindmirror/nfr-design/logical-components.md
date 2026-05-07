# Logical Components - MindMirror AI

## Overview

This document defines logical components that implement NFR patterns in the MindMirror AI application.

---

## 1. CacheManager Component

**Purpose**: Manage in-memory caching for localStorage operations

**Type**: Utility Service

**Implementation**:
```javascript
// src/shared/services/CacheManager.js
import { HybridCache } from './HybridCache';

class CacheManager {
  constructor() {
    this.entryCache = new HybridCache(50, 300000); // 50 entries, 5 min TTL
    this.settingsCache = new HybridCache(1, 600000); // 1 entry, 10 min TTL
  }
  
  // Entry cache operations
  getEntry(id) {
    return this.entryCache.get(id);
  }
  
  setEntry(id, entry) {
    this.entryCache.set(id, entry);
  }
  
  invalidateEntry(id) {
    this.entryCache.remove(id);
  }
  
  // Settings cache operations
  getSettings() {
    return this.settingsCache.get('settings');
  }
  
  setSettings(settings) {
    this.settingsCache.set('settings', settings);
  }
  
  // Clear all caches
  clearAll() {
    this.entryCache.clear();
    this.settingsCache.clear();
  }
}

export const cacheManager = new CacheManager();
```

**Integration**: Used by StorageService for all localStorage operations

---

## 2. PerformanceMonitor Component

**Purpose**: Monitor and report performance metrics

**Type**: Monitoring Service

**Features**:
- Measure analysis duration
- Measure chart render duration
- Measure FPS
- Track localStorage operations
- Visual dashboard (dev mode only)

**Implementation**: See nfr-design-patterns.md Pattern 1.3

**Integration**: Integrated into all performance-critical operations

---

## 3. ErrorBoundaryManager Component

**Purpose**: Manage hierarchical error boundaries

**Type**: React Component System

**Structure**:
```
GlobalErrorBoundary (App level)
├── FeatureErrorBoundary (Journal)
├── FeatureErrorBoundary (Dashboard)
└── FeatureErrorBoundary (Charts)
```

**Features**:
- Global error catching
- Feature-level isolation
- Error logging
- Recovery mechanisms
- User-friendly error messages

**Implementation**: See nfr-design-patterns.md Pattern 3.1

---

## 4. InputValidator Component

**Purpose**: Validate and sanitize all user input

**Type**: Utility Service

**Features**:
- HTML tag removal
- Special character escaping
- Length validation
- Whitespace normalization
- XSS prevention

**Implementation**: See nfr-design-patterns.md Pattern 2.1

**Integration**: Used by JournalInput component before analysis

---

## 5. RetryHandler Component

**Purpose**: Handle automatic retries with exponential backoff

**Type**: Utility Service

**Features**:
- Configurable retry count
- Exponential backoff
- Maximum delay cap
- Error propagation

**Implementation**: See nfr-design-patterns.md Pattern 3.2

**Integration**: Used by useAnalysis hook and StorageService

---

## 6. StorageQuotaManager Component

**Purpose**: Manage localStorage quota automatically

**Type**: Utility Service

**Features**:
- Quota exceeded detection
- Automatic old data eviction
- Minimum retention enforcement
- User notifications

**Implementation**: See nfr-design-patterns.md Pattern 4.1

**Integration**: Used by StorageService for all write operations

---

## 7. AnimationController Component

**Purpose**: Control animations based on device performance

**Type**: React Context + Hook

**Features**:
- Performance mode detection
- Animation strategy selection (CSS vs Framer Motion)
- Duration adjustment
- Animation disabling on low-end devices

**Implementation**:
```javascript
// src/shared/contexts/AnimationContext.js
const AnimationContext = createContext();

export function AnimationProvider({ children }) {
  const { performanceMode } = usePerformanceMode();
  
  const shouldUseFramerMotion = (complexity) => {
    if (performanceMode === 'low') return false;
    if (complexity === 'simple') return false;
    return true;
  };
  
  const getAnimationDuration = (baseDuration) => {
    return performanceMode === 'high' ? baseDuration : baseDuration * 0.5;
  };
  
  return (
    <AnimationContext.Provider value={{ 
      shouldUseFramerMotion, 
      getAnimationDuration,
      performanceMode
    }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  return useContext(AnimationContext);
}
```

**Integration**: Used by all animated components

---

## 8. CSPEnforcer Component

**Purpose**: Enforce Content Security Policy

**Type**: HTML Meta Tag

**Implementation**:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:;">
```

**Integration**: Included in index.html head section

---

## Component Interaction Diagram

```
User Input
    ↓
InputValidator → Sanitize & Validate
    ↓
SentimentAnalysisService
    ↓
RetryHandler → Auto-retry on failure
    ↓
AnalysisResult
    ↓
StorageService
    ↓
CacheManager → Cache result
    ↓
StorageQuotaManager → Manage quota
    ↓
localStorage
    ↓
Dashboard Components
    ↓
AnimationController → Control animations
    ↓
PerformanceMonitor → Track metrics
    ↓
ErrorBoundaryManager → Catch errors
```

---

## Summary

**Total Logical Components**: 8

**Categories**:
- **Performance**: CacheManager, PerformanceMonitor, AnimationController
- **Security**: InputValidator, CSPEnforcer
- **Reliability**: ErrorBoundaryManager, RetryHandler
- **Scalability**: StorageQuotaManager

**Integration Points**:
- All components integrate with existing services
- No circular dependencies
- Clear separation of concerns
- Testable in isolation

All components support the NFR requirements and implement the design patterns defined in nfr-design-patterns.md.
