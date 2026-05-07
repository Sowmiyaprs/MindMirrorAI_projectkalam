# Service Layer Design - MindMirror AI

## Service Architecture Overview

The application uses a **modular service architecture** with separate services for each major concern. Services are accessed through custom hooks that provide clean APIs and encapsulate service logic.

---

## Core Services

### 1. SentimentAnalysisService

**Purpose**: Core sentiment analysis engine that processes user text and generates emotional insights

**Responsibilities**:
- Keyword matching against emotion dictionaries
- Negation detection and handling
- Intensity modifier detection
- Emotional score calculation (0-100 for 6 metrics)
- Overall mood detection
- Contextual suggestion generation

**Architecture**: Modular service with separate functions for each analysis step

**Key Methods**:
- `analyze(text: string): AnalysisResult` - Main entry point
- `matchKeywords(text: string): KeywordMatches` - Find emotion keywords
- `handleNegations(text: string, keywords: KeywordMatches): KeywordMatches` - Process negations
- `detectIntensity(text: string): IntensityMap` - Find intensity modifiers
- `calculateScores(keywords: KeywordMatches, intensity: IntensityMap): EmotionalScores` - Compute scores
- `detectMood(scores: EmotionalScores): string` - Determine overall mood
- `generateSuggestions(scores: EmotionalScores, mood: string): string[]` - Create suggestions

**Dependencies**: None (pure logic service)

**Location**: `src/features/analysis/services/SentimentAnalysisService.ts`

---

### 2. StorageService

**Purpose**: Centralized localStorage management with type-safe operations

**Responsibilities**:
- Journal entry persistence (save, retrieve, delete)
- History management (recent entries, date ranges)
- User settings persistence
- Storage quota management
- Error handling for storage operations

**Architecture**: Service layer with methods for all storage operations + custom hooks for React integration

**Key Methods**:
- `saveEntry(entry: JournalEntry): void` - Persist journal entry
- `getAllEntries(): JournalEntry[]` - Retrieve all entries
- `getRecentEntries(count: number): JournalEntry[]` - Get recent N entries
- `deleteEntry(id: string): void` - Remove entry
- `clearAllEntries(): void` - Clear all data
- `saveSettings(settings: UserSettings): void` - Persist settings
- `getSettings(): UserSettings` - Retrieve settings
- `isStorageAvailable(): boolean` - Check localStorage availability
- `handleStorageQuotaExceeded(): void` - Handle quota errors

**Dependencies**: ErrorHandlingService (for error notifications)

**Location**: `src/shared/services/StorageService.ts`

**Custom Hooks**:
- `useLocalStorage<T>(key, initialValue)` - Generic localStorage hook
- `useHistory()` - Journal entry management
- `useSettings()` - Settings management

---

### 3. ErrorHandlingService

**Purpose**: Centralized error handling and user notification system

**Responsibilities**:
- Error logging (development mode)
- Toast notification management
- Error recovery strategies
- Global error handler setup
- Context-aware error messages

**Architecture**: Service with toast integration + error handling hooks

**Key Methods**:
- `logError(context: ErrorContext): void` - Log errors in dev mode
- `showErrorToast(message: string, options?: ToastOptions): void` - Display error notification
- `showSuccessToast(message: string, options?: ToastOptions): void` - Display success notification
- `showInfoToast(message: string, options?: ToastOptions): void` - Display info notification
- `handleStorageError(error: Error): void` - Handle localStorage errors
- `handleAnalysisError(error: Error): void` - Handle analysis errors
- `handleRenderError(error: Error): void` - Handle React render errors
- `setupGlobalErrorHandler(): void` - Initialize global error handling

**Dependencies**: react-hot-toast library

**Location**: `src/shared/services/ErrorHandlingService.ts`

**Integration**: Used by ErrorBoundary component and throughout application

---

### 4. PerformanceDetectionService

**Purpose**: Device performance detection and animation optimization

**Responsibilities**:
- Detect device performance capabilities
- Measure FPS, memory, hardware concurrency
- Determine optimal animation settings
- Provide performance-adjusted animation durations
- Persist performance preferences

**Architecture**: Service with performance metrics collection + PerformanceContext provider

**Key Methods**:
- `detectPerformance(): 'high' | 'low'` - Determine device performance level
- `measureFPS(): number` - Measure current FPS
- `getDeviceMemory(): number` - Get device memory (if available)
- `getHardwareConcurrency(): number` - Get CPU core count
- `getConnectionType(): string` - Get network connection type
- `shouldReduceAnimations(): boolean` - Check if animations should be reduced
- `getAnimationDuration(baseMs: number): number` - Get adjusted animation duration

**Dependencies**: StorageService (for preference persistence)

**Location**: `src/shared/services/PerformanceDetectionService.ts`

**Context Provider**: `PerformanceContext` wraps app and provides performance state

---

### 5. MockDataService

**Purpose**: Provide realistic mock data for non-dynamic features

**Responsibilities**:
- Generate realistic achievements data
- Provide user profile information
- Generate historical analytics (older entries)
- Provide chatbot conversation history
- Generate weekly reports
- Provide calendar entries

**Architecture**: Service with methods returning mock data

**Key Methods**:
- `getAchievements(): Achievement[]` - Get user achievements
- `getUserProfile(): UserProfile` - Get user profile data
- `getHistoricalAnalytics(): AnalysisResult[]` - Get older analysis results
- `getChatbotHistory(): ChatMessage[]` - Get chatbot conversation
- `getWeeklyReport(): WeeklyReport` - Get weekly summary
- `getCalendarEntries(): CalendarEntry[]` - Get calendar data

**Dependencies**: None (static data)

**Location**: `src/data/mocks/MockDataService.ts`

---

## Service Orchestration Patterns

### Pattern 1: Hook-Based Service Access

Services are accessed through custom hooks that encapsulate service logic:

```typescript
// Example: useAnalysis hook
function useAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const analyze = async (text: string) => {
    try {
      setIsAnalyzing(true);
      const result = SentimentAnalysisService.analyze(text);
      setCurrentAnalysis(result);
      return result;
    } catch (err) {
      setError(err);
      ErrorHandlingService.handleAnalysisError(err);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return { analyze, isAnalyzing, currentAnalysis, error };
}
```

**Benefits**:
- Clean component APIs
- Reusable service logic
- Automatic state management
- Error handling integration

### Pattern 2: Context-Based Global State

Global state (analysis results, history, settings) is managed through Context API:

```typescript
// AppContext provides global state
<AppContext.Provider value={{ currentAnalysis, history, settings, ... }}>
  <App />
</AppContext.Provider>

// Components access via hook
const { currentAnalysis, addToHistory } = useAppContext();
```

**Benefits**:
- No prop drilling
- Centralized state management
- Easy state updates across components

### Pattern 3: Service Composition

Services can compose other services for complex operations:

```typescript
// StorageService uses ErrorHandlingService
class StorageService {
  saveEntry(entry: JournalEntry): void {
    try {
      // Save logic
    } catch (error) {
      ErrorHandlingService.handleStorageError(error);
      throw error;
    }
  }
}
```

**Benefits**:
- Separation of concerns
- Reusable error handling
- Consistent error UX

---

## Service Interaction Flow

### User Analysis Flow

```
1. User types in JournalInput component
2. JournalInput calls useAnalysis().analyze(text)
3. useAnalysis hook calls SentimentAnalysisService.analyze(text)
4. SentimentAnalysisService:
   - Matches keywords
   - Handles negations
   - Detects intensity
   - Calculates scores
   - Detects mood
   - Generates suggestions
5. Analysis result returned to useAnalysis hook
6. Hook updates AppContext with new analysis
7. Dashboard components re-render with new data
8. StorageService.saveEntry() persists to localStorage
9. Success toast shown via ErrorHandlingService
```

### Data Persistence Flow

```
1. Component calls useHistory().addEntry(entry)
2. useHistory hook calls StorageService.saveEntry(entry)
3. StorageService:
   - Validates entry
   - Serializes to JSON
   - Saves to localStorage
   - Handles quota errors if needed
4. Hook updates local state
5. AppContext updated with new history
6. Components re-render with updated history
```

### Performance Detection Flow

```
1. App initializes PerformanceContext on mount
2. PerformanceContext calls PerformanceDetectionService.detectPerformance()
3. Service measures FPS, memory, hardware
4. Service determines 'high' or 'low' performance mode
5. Mode stored in context and localStorage
6. Components use usePerformanceMode() hook
7. Components adjust animations based on mode
```

---

## Service Configuration

### Development vs Production

Services adapt behavior based on environment:

```typescript
// config.ts
const config = {
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  enableLogging: import.meta.env.MODE === 'development',
  enableDebugTools: import.meta.env.MODE === 'development',
};

// ErrorHandlingService uses config
logError(context: ErrorContext): void {
  if (config.enableLogging) {
    console.error('[Error]', context);
  }
}
```

---

## Service Testing Strategy

### Unit Testing
- Test each service method independently
- Mock dependencies (e.g., localStorage, toast)
- Test error handling paths
- Test edge cases (empty input, quota exceeded, etc.)

### Property-Based Testing (Partial Enforcement)
- Test sentiment analysis pure functions
- Test score calculation algorithms
- Test data serialization/deserialization
- Test keyword matching logic

### Integration Testing
- Test service composition (StorageService + ErrorHandlingService)
- Test hook integration with services
- Test context providers with services

---

## Summary

**Total Services**: 5 core services
- **SentimentAnalysisService**: Core analysis engine (modular, pure logic)
- **StorageService**: localStorage management (service + hooks)
- **ErrorHandlingService**: Error handling and notifications (service + toast integration)
- **PerformanceDetectionService**: Performance detection (service + context)
- **MockDataService**: Mock data provider (static data)

**Service Access Pattern**: Custom hooks encapsulate service logic
**State Management**: Context API for global state + local state for component-specific data
**Error Handling**: Centralized through ErrorHandlingService
**Performance**: Adaptive based on device capabilities

**Design Principles**:
- Separation of concerns
- Single responsibility per service
- Reusable through hooks
- Testable (pure functions where possible)
- Type-safe (TypeScript interfaces)
