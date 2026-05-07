# Component Methods and Interfaces - MindMirror AI

**Note**: This document defines method signatures and interfaces. Detailed business rules and implementation logic will be defined in the Functional Design stage (CONSTRUCTION phase).

---

## Service Interfaces

### SentimentAnalysisService

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

class SentimentAnalysisService {
  // Main analysis method
  analyze(text: string): AnalysisResult
  
  // Keyword matching
  matchKeywords(text: string): KeywordMatches
  
  // Negation handling
  handleNegations(text: string, keywords: KeywordMatches): KeywordMatches
  
  // Intensity modifier detection
  detectIntensity(text: string): IntensityMap
  
  // Score calculation
  calculateScores(keywords: KeywordMatches, intensity: IntensityMap): EmotionalScores
  
  // Mood detection
  detectMood(scores: EmotionalScores): string
  
  // Suggestion generation
  generateSuggestions(scores: EmotionalScores, mood: string): string[]
}
```

### StorageService

```typescript
interface JournalEntry {
  id: string;
  text: string;
  analysis: AnalysisResult;
  timestamp: number;
}

interface UserSettings {
  analysisMode: 'manual' | 'auto';
  performanceMode: 'high' | 'low' | 'auto';
  theme: 'dark' | 'light';
}

class StorageService {
  // Entry management
  saveEntry(entry: JournalEntry): void
  getEntry(id: string): JournalEntry | null
  getAllEntries(): JournalEntry[]
  deleteEntry(id: string): void
  clearAllEntries(): void
  
  // History management
  getRecentEntries(count: number): JournalEntry[]
  getEntriesByDateRange(startDate: Date, endDate: Date): JournalEntry[]
  
  // Settings management
  saveSettings(settings: UserSettings): void
  getSettings(): UserSettings
  
  // Storage utilities
  getStorageSize(): number
  isStorageAvailable(): boolean
  handleStorageQuotaExceeded(): void
}
```

### ErrorHandlingService

```typescript
interface ErrorContext {
  component: string;
  action: string;
  error: Error;
  timestamp: number;
}

class ErrorHandlingService {
  // Error logging
  logError(context: ErrorContext): void
  
  // Toast notifications
  showErrorToast(message: string, options?: ToastOptions): void
  showSuccessToast(message: string, options?: ToastOptions): void
  showInfoToast(message: string, options?: ToastOptions): void
  
  // Error recovery
  handleStorageError(error: Error): void
  handleAnalysisError(error: Error): void
  handleRenderError(error: Error): void
  
  // Global error handler
  setupGlobalErrorHandler(): void
}
```

### PerformanceDetectionService

```typescript
interface PerformanceMetrics {
  fps: number;
  deviceMemory: number;
  hardwareConcurrency: number;
  connectionType: string;
}

class PerformanceDetectionService {
  // Performance detection
  detectPerformance(): 'high' | 'low'
  
  // Metrics collection
  measureFPS(): number
  getDeviceMemory(): number
  getHardwareConcurrency(): number
  getConnectionType(): string
  
  // Performance mode
  shouldReduceAnimations(): boolean
  getAnimationDuration(baseMs: number): number
}
```

### MockDataService

```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  completed: boolean;
}

interface UserProfile {
  name: string;
  avatar: string;
  streak: number;
  totalEntries: number;
  joinDate: string;
}

class MockDataService {
  // Achievements
  getAchievements(): Achievement[]
  
  // Profile
  getUserProfile(): UserProfile
  
  // Analytics history (older entries)
  getHistoricalAnalytics(): AnalysisResult[]
  
  // Chatbot memory
  getChatbotHistory(): ChatMessage[]
  
  // Weekly reports
  getWeeklyReport(): WeeklyReport
  
  // Calendar entries
  getCalendarEntries(): CalendarEntry[]
}
```

---

## Custom Hooks

### useAnalysis

```typescript
interface UseAnalysisReturn {
  analyze: (text: string) => Promise<AnalysisResult>;
  isAnalyzing: boolean;
  currentAnalysis: AnalysisResult | null;
  error: Error | null;
}

function useAnalysis(): UseAnalysisReturn
```

### useHistory

```typescript
interface UseHistoryReturn {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  deleteEntry: (id: string) => void;
  clearHistory: () => void;
  getRecentEntries: (count: number) => JournalEntry[];
}

function useHistory(): UseHistoryReturn
```

### useSettings

```typescript
interface UseSettingsReturn {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

function useSettings(): UseSettingsReturn
```

### useLocalStorage

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void]
```

### usePerformanceMode

```typescript
interface UsePerformanceModeReturn {
  performanceMode: 'high' | 'low';
  shouldReduceAnimations: boolean;
  getAnimationDuration: (baseMs: number) => number;
}

function usePerformanceMode(): UsePerformanceModeReturn
```

### useDebounce

```typescript
function useDebounce<T>(value: T, delay: number): T
```

### useAutoAnalyze

```typescript
interface UseAutoAnalyzeReturn {
  isEnabled: boolean;
  toggle: () => void;
}

function useAutoAnalyze(
  text: string,
  onAnalyze: (text: string) => void,
  delay: number
): UseAutoAnalyzeReturn
```

---

## Component Props and Methods

### JournalInput

```typescript
interface JournalInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  maxLength: number;
  autoAnalyzeEnabled: boolean;
}

// Component methods (internal)
- handleTextChange(e: ChangeEvent<HTMLTextAreaElement>): void
- handleKeyPress(e: KeyboardEvent): void
- validateInput(text: string): boolean
```

### AnalyzeButton

```typescript
interface AnalyzeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

// Component methods (internal)
- handleClick(): void
- renderLoadingState(): ReactNode
```

### MetricCard

```typescript
interface MetricCardProps {
  name: string;
  score: number;
  icon: ReactNode;
  color: string;
  previousScore?: number;
}

// Component methods (internal)
- calculateProgress(): number
- renderProgressBar(): ReactNode
- renderTrendIndicator(): ReactNode
```

### MoodTrendChart

```typescript
interface MoodTrendChartProps {
  data: ChartDataPoint[];
  height: number;
  width?: number;
}

interface ChartDataPoint {
  timestamp: number;
  mood: number;
  stress: number;
  motivation: number;
}

// Component methods (internal)
- transformData(entries: JournalEntry[]): ChartDataPoint[]
- formatXAxis(timestamp: number): string
- formatTooltip(value: number): string
```

### EmotionalDistributionChart

```typescript
interface EmotionalDistributionChartProps {
  data: EmotionDistribution[];
  height: number;
  width?: number;
}

interface EmotionDistribution {
  emotion: string;
  value: number;
  color: string;
}

// Component methods (internal)
- calculateDistribution(analysis: AnalysisResult): EmotionDistribution[]
- renderCustomLabel(entry: any): ReactNode
```

### ProductivityFocusChart

```typescript
interface ProductivityFocusChartProps {
  data: ProductivityData[];
  height: number;
  width?: number;
}

interface ProductivityData {
  date: string;
  productivity: number;
  focus: number;
}

// Component methods (internal)
- transformHistoryData(entries: JournalEntry[]): ProductivityData[]
- renderCustomBar(props: any): ReactNode
```

### Dashboard

```typescript
interface DashboardProps {
  analysis: AnalysisResult | null;
  history: JournalEntry[];
}

// Component methods (internal)
- renderMetrics(): ReactNode
- renderCharts(): ReactNode
- renderInsights(): ReactNode
- handleRefresh(): void
```

### ErrorBoundary

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Component methods
- static getDerivedStateFromError(error: Error): ErrorBoundaryState
- componentDidCatch(error: Error, errorInfo: ErrorInfo): void
- resetError(): void
```

---

## Context Interfaces

### AppContext

```typescript
interface AppContextValue {
  // State
  currentAnalysis: AnalysisResult | null;
  history: JournalEntry[];
  settings: UserSettings;
  
  // Actions
  setAnalysis: (analysis: AnalysisResult) => void;
  addToHistory: (entry: JournalEntry) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  clearHistory: () => void;
}

function useAppContext(): AppContextValue
```

### PerformanceContext

```typescript
interface PerformanceContextValue {
  performanceMode: 'high' | 'low';
  shouldReduceAnimations: boolean;
  setPerformanceMode: (mode: 'high' | 'low' | 'auto') => void;
  getAnimationDuration: (baseMs: number) => number;
}

function usePerformance(): PerformanceContextValue
```

---

## Utility Functions

### Chart Data Transformers

```typescript
// Transform journal entries to chart data
function transformToMoodTrend(entries: JournalEntry[]): ChartDataPoint[]

// Calculate emotional distribution
function calculateEmotionDistribution(analysis: AnalysisResult): EmotionDistribution[]

// Transform to productivity data
function transformToProductivityData(entries: JournalEntry[]): ProductivityData[]
```

### Validation Utilities

```typescript
// Validate journal input
function validateJournalInput(text: string): ValidationResult

// Validate localStorage availability
function isLocalStorageAvailable(): boolean

// Sanitize user input
function sanitizeInput(text: string): string
```

### Configuration

```typescript
interface AppConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  enableLogging: boolean;
  enableDebugTools: boolean;
  apiEndpoint: string | null;
}

function getConfig(): AppConfig
```

---

## Summary

**Services**: 5 core services (SentimentAnalysis, Storage, ErrorHandling, PerformanceDetection, MockData)
**Custom Hooks**: 7 hooks (useAnalysis, useHistory, useSettings, useLocalStorage, usePerformanceMode, useDebounce, useAutoAnalyze)
**Component Props**: Defined for all major components
**Context Interfaces**: 2 contexts (AppContext, PerformanceContext)
**Utility Functions**: Data transformers, validators, configuration

**Note**: Detailed implementation logic, business rules, and algorithms will be specified in the Functional Design stage.
