# Component Dependencies and Data Flow - MindMirror AI

## Dependency Overview

This document maps the relationships between components, services, hooks, and contexts, showing how data flows through the application.

---

## Dependency Matrix

### Component → Service Dependencies

| Component | Services Used | Purpose |
|---|---|---|
| App | PerformanceDetectionService | Initialize performance detection |
| App | ErrorHandlingService | Setup global error handler |
| JournalInput | - | Uses hooks only |
| AnalyzeButton | - | Pure UI component |
| Dashboard | - | Uses context and hooks |
| MetricCard | - | Pure UI component |
| MoodTrendChart | - | Data transformation in component |
| EmotionalDistributionChart | - | Data transformation in component |
| ProductivityFocusChart | - | Data transformation in component |
| ErrorBoundary | ErrorHandlingService | Log and display errors |
| AchievementsPanel | MockDataService | Get achievements data |
| ProfileCard | MockDataService | Get profile data |

### Hook → Service Dependencies

| Hook | Services Used | Purpose |
|---|---|---|
| useAnalysis | SentimentAnalysisService | Perform sentiment analysis |
| useHistory | StorageService | Manage journal entries |
| useSettings | StorageService | Manage user settings |
| useLocalStorage | StorageService | Generic storage operations |
| usePerformanceMode | PerformanceDetectionService | Get performance state |
| useAutoAnalyze | SentimentAnalysisService | Auto-trigger analysis |

### Context → Service Dependencies

| Context | Services Used | Purpose |
|---|---|---|
| AppContext | StorageService | Load/save history and settings |
| PerformanceContext | PerformanceDetectionService | Detect and manage performance mode |

---

## Component Hierarchy

```
App (Root)
├── ErrorBoundary
│   └── AppContext.Provider
│       └── PerformanceContext.Provider
│           └── MainLayout
│               ├── Header
│               │   └── ProfileCard (uses MockDataService)
│               ├── Sidebar
│               │   └── AchievementsPanel (uses MockDataService)
│               └── MainContent
│                   ├── JournalInput (uses useAnalysis, useAutoAnalyze)
│                   │   ├── AnalysisModeToggle (uses useSettings)
│                   │   └── AnalyzeButton
│                   └── Dashboard (uses useAppContext)
│                       ├── MetricsGrid
│                       │   └── MetricCard (x6)
│                       ├── MoodDisplay
│                       ├── SuggestionsPanel
│                       ├── InsightsPanel
│                       └── ChartsSection
│                           ├── MoodTrendChart (uses useHistory)
│                           ├── EmotionalDistributionChart (uses useAppContext)
│                           └── ProductivityFocusChart (uses useHistory)
├── FloatingChatButton
└── Toast (react-hot-toast Toaster)
```

---

## Data Flow Diagrams

### Analysis Flow

```
User Input (JournalInput)
    ↓
useAnalysis hook
    ↓
SentimentAnalysisService.analyze()
    ↓
AnalysisResult
    ↓
AppContext.setAnalysis()
    ↓
Dashboard components re-render
    ↓
StorageService.saveEntry()
    ↓
localStorage
    ↓
useHistory hook updates
    ↓
Chart components re-render
```

### State Management Flow

```
AppContext (Global State)
    ├── currentAnalysis: AnalysisResult | null
    ├── history: JournalEntry[]
    └── settings: UserSettings
        ↓
Consumed by:
    ├── Dashboard (currentAnalysis)
    ├── Charts (history)
    ├── JournalInput (settings.analysisMode)
    └── All components (via useAppContext)
```

### Performance Detection Flow

```
App Mount
    ↓
PerformanceContext initialization
    ↓
PerformanceDetectionService.detectPerformance()
    ↓
Measure: FPS, memory, hardware
    ↓
Determine: 'high' | 'low'
    ↓
PerformanceContext.performanceMode
    ↓
Components use usePerformanceMode()
    ↓
Adjust animations conditionally
```

### Error Handling Flow

```
Error occurs in component
    ↓
Try-catch block or ErrorBoundary
    ↓
ErrorHandlingService.handleError()
    ↓
├── Log error (dev mode)
├── Show toast notification
└── Recover gracefully
```

---

## Communication Patterns

### Pattern 1: Context-Based Communication

**Used for**: Global state sharing (analysis results, history, settings)

```
AppContext (Provider)
    ↓
useAppContext() hook
    ↓
Components access shared state
```

**Benefits**:
- No prop drilling
- Centralized state
- Easy updates

**Components using this pattern**:
- Dashboard
- JournalInput
- Charts
- MetricsGrid

### Pattern 2: Hook-Based Communication

**Used for**: Service access and local state management

```
Component
    ↓
Custom Hook (useAnalysis, useHistory, etc.)
    ↓
Service Layer
    ↓
Return state and methods
```

**Benefits**:
- Encapsulated logic
- Reusable
- Testable

**Hooks using this pattern**:
- useAnalysis
- useHistory
- useSettings
- usePerformanceMode

### Pattern 3: Props-Based Communication

**Used for**: Parent-child component communication

```
Parent Component
    ↓
Props (data + callbacks)
    ↓
Child Component
```

**Benefits**:
- Explicit dependencies
- Type-safe
- Simple

**Components using this pattern**:
- MetricCard (receives score, name, color)
- AnalyzeButton (receives onClick, isLoading)
- ChartContainer (receives data, config)

### Pattern 4: Event-Based Communication

**Used for**: User interactions and async operations

```
User Action (click, type, etc.)
    ↓
Event Handler
    ↓
Hook or Service
    ↓
State Update
    ↓
Re-render
```

**Benefits**:
- Reactive
- Decoupled
- Async-friendly

**Components using this pattern**:
- JournalInput (onChange, onAnalyze)
- AnalyzeButton (onClick)
- AnalysisModeToggle (onToggle)

---

## Dependency Graph

### Core Dependencies

```
App
├── Depends on: ErrorHandlingService, PerformanceDetectionService
├── Provides: AppContext, PerformanceContext
└── Renders: MainLayout, ErrorBoundary, Toast

MainLayout
├── Depends on: None
├── Uses: useAppContext (optional)
└── Renders: Header, Sidebar, MainContent

JournalInput
├── Depends on: useAnalysis, useAutoAnalyze, useSettings
├── Uses: AppContext (via hooks)
└── Renders: AnalyzeButton, AnalysisModeToggle

Dashboard
├── Depends on: useAppContext, useHistory
├── Uses: AppContext, PerformanceContext
└── Renders: MetricsGrid, Charts, Insights

Charts
├── Depends on: useHistory, useAppContext
├── Uses: Data transformation utilities
└── Renders: Recharts components
```

### Service Dependencies

```
SentimentAnalysisService
└── No dependencies (pure logic)

StorageService
└── Depends on: ErrorHandlingService

ErrorHandlingService
└── Depends on: react-hot-toast

PerformanceDetectionService
└── Depends on: StorageService

MockDataService
└── No dependencies (static data)
```

---

## Circular Dependency Prevention

### Potential Circular Dependencies

1. **AppContext ↔ StorageService**
   - **Risk**: AppContext loads from StorageService, StorageService might need AppContext
   - **Solution**: StorageService is stateless, only AppContext depends on it (one-way)

2. **Hooks ↔ Services**
   - **Risk**: Hooks use services, services might need hooks
   - **Solution**: Services are pure/stateless, hooks wrap services (one-way)

3. **Components ↔ Contexts**
   - **Risk**: Components use contexts, contexts might render components
   - **Solution**: Contexts only provide data, never render components (one-way)

### Dependency Rules

1. **Services never import components or hooks**
2. **Hooks can import services but not other hooks (except utility hooks)**
3. **Components can import hooks and services**
4. **Contexts can import services but not components**
5. **Utilities never import components, hooks, or contexts**

---

## Data Flow Patterns

### Pattern 1: Top-Down Data Flow

```
AppContext (source of truth)
    ↓
Dashboard (consumer)
    ↓
MetricsGrid (consumer)
    ↓
MetricCard (consumer)
```

**Characteristics**:
- Unidirectional
- Predictable
- Easy to debug

### Pattern 2: Bottom-Up Event Flow

```
User types in JournalInput
    ↓
onChange handler
    ↓
useAnalysis hook
    ↓
SentimentAnalysisService
    ↓
AppContext.setAnalysis
    ↓
Dashboard re-renders
```

**Characteristics**:
- Event-driven
- Async-friendly
- Decoupled

### Pattern 3: Sibling Communication via Context

```
JournalInput (updates analysis)
    ↓
AppContext.setAnalysis
    ↓
Dashboard (reads analysis)
```

**Characteristics**:
- No direct dependency
- Mediated by context
- Scalable

---

## Performance Considerations

### Optimization Strategies

1. **Memoization**
   - Use `React.memo` for pure components (MetricCard, ChartContainer)
   - Use `useMemo` for expensive calculations (chart data transformation)
   - Use `useCallback` for event handlers passed as props

2. **Code Splitting**
   - Lazy load chart components (not critical for initial render)
   - Lazy load mock data service (only needed for specific panels)

3. **Context Optimization**
   - Split contexts by update frequency (AppContext vs PerformanceContext)
   - Use context selectors to prevent unnecessary re-renders

4. **Debouncing**
   - Debounce auto-analyze input (useDebounce hook)
   - Debounce localStorage writes (batch updates)

---

## Testing Strategy

### Unit Testing

**Services**:
- Test each service method independently
- Mock dependencies (localStorage, toast)
- Test error paths

**Hooks**:
- Test with @testing-library/react-hooks
- Mock service dependencies
- Test state updates

**Components**:
- Test with @testing-library/react
- Mock hooks and contexts
- Test user interactions

### Integration Testing

**Service Integration**:
- Test StorageService + ErrorHandlingService
- Test useAnalysis + SentimentAnalysisService

**Component Integration**:
- Test JournalInput + Dashboard flow
- Test AppContext + components

**End-to-End**:
- Test complete user flow (input → analyze → display)

---

## Summary

**Dependency Patterns**:
- Context-based for global state
- Hook-based for service access
- Props-based for parent-child communication
- Event-based for user interactions

**Data Flow**:
- Top-down for state distribution
- Bottom-up for event handling
- Sibling communication via context

**Circular Dependency Prevention**:
- Services are stateless
- One-way dependencies enforced
- Clear dependency rules

**Performance**:
- Memoization for expensive operations
- Context splitting for optimization
- Debouncing for frequent updates

**Testing**:
- Unit tests for services and hooks
- Integration tests for service composition
- E2E tests for user flows
