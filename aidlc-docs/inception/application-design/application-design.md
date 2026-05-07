# Application Design - MindMirror AI

## Executive Summary

This document consolidates the complete application design for MindMirror AI, a production-ready emotional intelligence platform. The design follows a **hybrid feature-based architecture** with modular services, custom hooks for state management, and Context API for global state.

**Key Design Decisions**:
- **Component Organization**: Hybrid approach (feature-based with type subfolders)
- **State Management**: Context API + Custom Hooks
- **Sentiment Analysis**: Modular service with composable functions
- **Charts**: Wrapper components with data transformation
- **Storage**: Service layer + custom hooks for type-safe operations
- **Error Handling**: Error boundaries + centralized service + toast notifications
- **Performance**: Context provider with device detection
- **Dependencies**: Custom hooks encapsulate service access
- **Dev/Prod Modes**: Centralized config object
- **Mock Data**: Service-based with realistic data

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  (React Components with Tailwind CSS + Glassmorphism)       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Custom Hooks Layer                      │
│  (useAnalysis, useHistory, useSettings, usePerformanceMode) │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       Service Layer                          │
│  (SentimentAnalysis, Storage, ErrorHandling, Performance)   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Persistence                        │
│                    (localStorage API)                        │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 8.x
- **Styling**: Tailwind CSS 3.3.0
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Storage**: localStorage API
- **Language**: TypeScript (recommended) or JavaScript with PropTypes

---

## Component Architecture

### Component Organization

```
src/
├── features/
│   ├── analysis/
│   │   ├── components/
│   │   ├── hooks/
│   │   │   ├── useAnalysis.ts
│   │   │   └── useAutoAnalyze.ts
│   │   └── services/
│   │       └── SentimentAnalysisService.ts
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── MetricsGrid.tsx
│   │   │   ├── MoodDisplay.tsx
│   │   │   ├── SuggestionsPanel.tsx
│   │   │   ├── InsightsPanel.tsx
│   │   │   ├── AchievementsPanel.tsx
│   │   │   └── ProfileCard.tsx
│   │   └── hooks/
│   ├── charts/
│   │   ├── components/
│   │   │   ├── MoodTrendChart.tsx
│   │   │   ├── EmotionalDistributionChart.tsx
│   │   │   ├── ProductivityFocusChart.tsx
│   │   │   └── ChartContainer.tsx
│   │   └── utils/
│   │       └── chartTransformers.ts
│   └── journal/
│       ├── components/
│       │   ├── JournalInput.tsx
│       │   ├── AnalyzeButton.tsx
│       │   └── AnalysisModeToggle.tsx
│       └── hooks/
├── shared/
│   ├── components/
│   │   ├── MainLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Toast.tsx
│   │   ├── FloatingChatButton.tsx
│   │   └── Card.tsx
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useHistory.ts
│   │   ├── useSettings.ts
│   │   ├── usePerformanceMode.ts
│   │   └── useDebounce.ts
│   ├── services/
│   │   ├── StorageService.ts
│   │   ├── ErrorHandlingService.ts
│   │   └── PerformanceDetectionService.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   └── config.ts
│   └── contexts/
│       ├── AppContext.tsx
│       └── PerformanceContext.tsx
├── data/
│   └── mocks/
│       └── MockDataService.ts
├── App.tsx
└── main.tsx
```

### Component Count

- **Layout Components**: 4 (App, MainLayout, Header, Sidebar)
- **Journal Components**: 3 (JournalInput, AnalyzeButton, AnalysisModeToggle)
- **Dashboard Components**: 6 (Dashboard, MetricCard, MetricsGrid, MoodDisplay, SuggestionsPanel, InsightsPanel)
- **Chart Components**: 4 (MoodTrendChart, EmotionalDistributionChart, ProductivityFocusChart, ChartContainer)
- **Shared Components**: 6 (ErrorBoundary, LoadingSpinner, Toast, FloatingChatButton, Card)
- **Mock Data Components**: 2 (AchievementsPanel, ProfileCard)
- **Total**: 25+ components

---

## Service Layer Design

### Core Services

#### 1. SentimentAnalysisService
**Purpose**: Core sentiment analysis engine

**Key Methods**:
- `analyze(text: string): AnalysisResult` - Main analysis entry point
- `matchKeywords(text: string): KeywordMatches` - Keyword matching
- `handleNegations(text: string, keywords): KeywordMatches` - Negation handling
- `detectIntensity(text: string): IntensityMap` - Intensity modifiers
- `calculateScores(keywords, intensity): EmotionalScores` - Score calculation
- `detectMood(scores): string` - Mood detection
- `generateSuggestions(scores, mood): string[]` - Suggestion generation

**Architecture**: Modular with separate functions for each step

#### 2. StorageService
**Purpose**: localStorage management

**Key Methods**:
- `saveEntry(entry: JournalEntry): void`
- `getAllEntries(): JournalEntry[]`
- `getRecentEntries(count: number): JournalEntry[]`
- `deleteEntry(id: string): void`
- `saveSettings(settings: UserSettings): void`
- `getSettings(): UserSettings`
- `handleStorageQuotaExceeded(): void`

**Architecture**: Service layer + custom hooks

#### 3. ErrorHandlingService
**Purpose**: Centralized error handling

**Key Methods**:
- `logError(context: ErrorContext): void`
- `showErrorToast(message: string): void`
- `showSuccessToast(message: string): void`
- `handleStorageError(error: Error): void`
- `handleAnalysisError(error: Error): void`
- `setupGlobalErrorHandler(): void`

**Architecture**: Service with toast integration

#### 4. PerformanceDetectionService
**Purpose**: Device performance detection

**Key Methods**:
- `detectPerformance(): 'high' | 'low'`
- `measureFPS(): number`
- `shouldReduceAnimations(): boolean`
- `getAnimationDuration(baseMs: number): number`

**Architecture**: Service + PerformanceContext provider

#### 5. MockDataService
**Purpose**: Realistic mock data

**Key Methods**:
- `getAchievements(): Achievement[]`
- `getUserProfile(): UserProfile`
- `getHistoricalAnalytics(): AnalysisResult[]`
- `getChatbotHistory(): ChatMessage[]`

**Architecture**: Static data service

---

## State Management

### Global State (Context API)

#### AppContext
**Provides**:
- `currentAnalysis: AnalysisResult | null`
- `history: JournalEntry[]`
- `settings: UserSettings`
- `setAnalysis(analysis): void`
- `addToHistory(entry): void`
- `updateSettings(settings): void`

**Consumers**: Dashboard, JournalInput, Charts

#### PerformanceContext
**Provides**:
- `performanceMode: 'high' | 'low'`
- `shouldReduceAnimations: boolean`
- `setPerformanceMode(mode): void`
- `getAnimationDuration(baseMs): number`

**Consumers**: All animated components

### Local State (Hooks)

#### useAnalysis
**Returns**:
- `analyze(text): Promise<AnalysisResult>`
- `isAnalyzing: boolean`
- `currentAnalysis: AnalysisResult | null`
- `error: Error | null`

#### useHistory
**Returns**:
- `entries: JournalEntry[]`
- `addEntry(entry): void`
- `deleteEntry(id): void`
- `clearHistory(): void`

#### useSettings
**Returns**:
- `settings: UserSettings`
- `updateSettings(partial): void`
- `resetSettings(): void`

---

## Data Flow

### Analysis Flow

```
1. User types in JournalInput
2. JournalInput calls useAnalysis().analyze(text)
3. useAnalysis → SentimentAnalysisService.analyze(text)
4. Service processes:
   - Match keywords
   - Handle negations
   - Detect intensity
   - Calculate scores
   - Detect mood
   - Generate suggestions
5. Result returned to useAnalysis
6. AppContext.setAnalysis(result)
7. Dashboard components re-render
8. StorageService.saveEntry(entry)
9. Success toast shown
```

### Persistence Flow

```
1. Component calls useHistory().addEntry(entry)
2. useHistory → StorageService.saveEntry(entry)
3. StorageService:
   - Validates entry
   - Serializes to JSON
   - Saves to localStorage
   - Handles quota errors
4. Hook updates local state
5. AppContext updated
6. Components re-render
```

---

## Component Dependencies

### Dependency Rules

1. **Services never import components or hooks**
2. **Hooks can import services but not other hooks (except utility hooks)**
3. **Components can import hooks and services**
4. **Contexts can import services but not components**
5. **Utilities never import components, hooks, or contexts**

### Communication Patterns

1. **Context-Based**: Global state sharing (AppContext, PerformanceContext)
2. **Hook-Based**: Service access and local state (useAnalysis, useHistory)
3. **Props-Based**: Parent-child communication (MetricCard props)
4. **Event-Based**: User interactions (onClick, onChange)

---

## Key Interfaces

### AnalysisResult

```typescript
interface AnalysisResult {
  scores: EmotionalScores;
  mood: string;
  suggestions: string[];
  timestamp: number;
  inputText: string;
}

interface EmotionalScores {
  mood: number;        // 0-100
  stress: number;      // 0-100
  motivation: number;  // 0-100
  confidence: number;  // 0-100
  productivity: number; // 0-100
  focus: number;       // 0-100
}
```

### JournalEntry

```typescript
interface JournalEntry {
  id: string;
  text: string;
  analysis: AnalysisResult;
  timestamp: number;
}
```

### UserSettings

```typescript
interface UserSettings {
  analysisMode: 'manual' | 'auto';
  performanceMode: 'high' | 'low' | 'auto';
  theme: 'dark' | 'light';
}
```

---

## Security Considerations

### Input Validation (SECURITY-05)
- Validate journal input length (max 10,000 characters)
- Sanitize input to prevent XSS
- Validate data types before localStorage operations

### Content Security Policy (SECURITY-04)
- Implement CSP via meta tag in HTML
- Restrict script sources
- Prevent inline script execution

### Error Handling (SECURITY-15)
- Catch all errors gracefully
- Never expose internal details to users
- Global error boundary at app root
- Log errors only in development mode

### Storage Security (SECURITY-01)
- Store only non-sensitive data in localStorage
- Validate data when reading from localStorage
- Handle corrupted data gracefully

---

## Performance Optimization

### Strategies

1. **Memoization**
   - `React.memo` for pure components (MetricCard, ChartContainer)
   - `useMemo` for expensive calculations (chart data transformation)
   - `useCallback` for event handlers

2. **Code Splitting**
   - Lazy load chart components
   - Lazy load mock data service

3. **Context Optimization**
   - Split contexts by update frequency
   - Use context selectors

4. **Debouncing**
   - Debounce auto-analyze input (500ms)
   - Debounce localStorage writes

5. **Animation Optimization**
   - Detect device performance
   - Reduce animations on low-end devices
   - Use CSS transforms for GPU acceleration

---

## Testing Strategy

### Unit Testing
- Test services independently
- Test hooks with @testing-library/react-hooks
- Test components with @testing-library/react
- Mock dependencies (localStorage, toast)

### Property-Based Testing (Partial)
- Test sentiment analysis pure functions
- Test score calculation algorithms
- Test data serialization/deserialization

### Integration Testing
- Test service composition (StorageService + ErrorHandlingService)
- Test hook integration with services
- Test context providers with components

### End-to-End Testing
- Test complete user flow (input → analyze → display)
- Test localStorage persistence
- Test error scenarios

---

## Build Configuration

### Development Mode
- Enable verbose logging
- Enable debug tools
- Source maps enabled
- Hot module replacement

### Production Mode
- Remove console logs
- Minify code
- Inline all CSS and JS into single HTML file
- Optimize bundle size
- Remove source maps

### Build Output
- **Single `index.html` file** with all assets inlined
- No external dependencies
- Deployable via drag-and-drop to Netlify

---

## Design Validation

### Completeness Checklist
- ✅ All functional requirements covered (FR-1 to FR-10)
- ✅ All non-functional requirements addressed (NFR-1 to NFR-9)
- ✅ Security requirements satisfied (SEC-1 to SEC-5)
- ✅ Component architecture defined
- ✅ Service layer designed
- ✅ State management strategy defined
- ✅ Data flow documented
- ✅ Dependencies mapped
- ✅ Testing strategy outlined

### Consistency Checklist
- ✅ No conflicting patterns
- ✅ No circular dependencies
- ✅ Consistent naming conventions
- ✅ Consistent error handling
- ✅ Consistent state management

### Security Checklist
- ✅ Input validation implemented
- ✅ CSP configured
- ✅ Error handling secure
- ✅ Storage operations safe
- ✅ No sensitive data exposure

---

## Next Steps

Upon approval of this application design:
1. Proceed to **Functional Design** stage (CONSTRUCTION phase)
2. Define detailed business logic for sentiment analysis
3. Specify score calculation algorithms
4. Define data transformation logic
5. Continue through NFR Requirements and NFR Design stages

---

**Document Version**: 1.0  
**Created**: 2026-05-07  
**Status**: Awaiting Approval
