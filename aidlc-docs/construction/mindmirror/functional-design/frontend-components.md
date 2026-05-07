# Frontend Components Logic - MindMirror AI

## Overview

This document defines the detailed logic, behavior, and interactions for all frontend React components in the MindMirror AI application.

---

## 1. JournalInput Component

### Purpose
Main text input area for user to enter feelings and thoughts

### Props
```typescript
interface JournalInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  maxLength: number;
  autoAnalyzeEnabled: boolean;
}
```

### State
```typescript
const [charCount, setCharCount] = useState(0);
const [validationError, setValidationError] = useState<string | null>(null);
```

### Behavior Logic

**On Text Change**:
```
1. Update value via onChange prop
2. Update character count
3. Clear validation error if text becomes valid
4. IF autoAnalyzeEnabled:
   Debounce and trigger analysis after 500ms of no typing
```

**On Analyze Button Click**:
```
1. Validate input (length, content)
2. IF invalid:
   Show validation error
   Do NOT call onAnalyze
3. ELSE:
   Clear validation error
   Call onAnalyze prop
```

**Validation**:
```
- Empty input → "Please enter your thoughts"
- Length < 3 → "Input too short (minimum 3 characters)"
- Length > maxLength → "Input too long (maximum 10,000 characters)"
```

### User Interactions
- **Type**: Update text, trigger auto-analyze if enabled
- **Ctrl+Enter**: Trigger manual analyze
- **Paste**: Validate pasted content length
- **Focus**: Show character count
- **Blur**: Hide character count (optional)

---

## 2. AnalyzeButton Component

### Purpose
Animated button to trigger sentiment analysis

### Props
```typescript
interface AnalyzeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}
```

### Behavior Logic

**On Click**:
```
IF NOT disabled AND NOT isLoading:
  1. Call onClick prop
  2. Show loading animation
```

**Loading State**:
```
IF isLoading:
  - Show spinner icon
  - Disable button
  - Apply pulsing glow animation
ELSE:
  - Show "Analyze" text
  - Enable button (if not disabled)
  - Apply hover glow effect
```

**Disabled State**:
```
IF disabled:
  - Reduce opacity to 50%
  - Remove hover effects
  - Show cursor: not-allowed
```

### Animations
- **Idle**: Subtle glow pulse (2s loop)
- **Hover**: Increased glow intensity
- **Click**: Scale down (0.95) then spring back
- **Loading**: Rotating spinner + pulsing glow

---

## 3. AnalysisModeToggle Component

### Purpose
Toggle between manual and auto-analyze modes

### Props
```typescript
interface AnalysisModeToggleProps {
  mode: 'manual' | 'auto';
  onToggle: (mode: 'manual' | 'auto') => void;
}
```

### Behavior Logic

**On Toggle**:
```
1. Determine new mode (manual ↔ auto)
2. Call onToggle prop with new mode
3. Save preference to localStorage via useSettings hook
4. Show toast notification: "Auto-analyze enabled/disabled"
```

**Visual State**:
```
IF mode === 'auto':
  - Toggle switch to right
  - Apply cyan glow
  - Show "Auto" label
ELSE:
  - Toggle switch to left
  - Apply gray color
  - Show "Manual" label
```

---

## 4. MetricCard Component

### Purpose
Display single emotional metric with animated progress bar

### Props
```typescript
interface MetricCardProps {
  name: string;
  score: number;
  icon: ReactNode;
  color: string;
  previousScore?: number;
}
```

### State
```typescript
const [displayScore, setDisplayScore] = useState(0);
const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
```

### Behavior Logic

**On Score Update**:
```
1. Calculate trend:
   IF score > previousScore: trend = 'up'
   ELSE IF score < previousScore: trend = 'down'
   ELSE: trend = 'neutral'

2. Animate score from displayScore to new score:
   - Duration: 1000ms
   - Easing: ease-out
   - Update displayScore incrementally

3. Animate progress bar:
   - Width from previousScore% to score%
   - Duration: 1000ms
   - Apply glow effect
```

**Progress Bar Color**:
```
IF score >= 70: green (#00FF88)
ELSE IF score >= 40: yellow (#FFD700)
ELSE: red (#FF006E)
```

**Trend Indicator**:
```
IF trend === 'up': Show ↑ icon (green)
ELSE IF trend === 'down': Show ↓ icon (red)
ELSE: Show — icon (gray)
```

---

## 5. Dashboard Component

### Purpose
Orchestrate dashboard layout and data flow

### Props
```typescript
interface DashboardProps {
  analysis: AnalysisResult | null;
  history: JournalEntry[];
}
```

### State
```typescript
const [isLoading, setIsLoading] = useState(false);
```

### Behavior Logic

**On Mount**:
```
1. Load latest analysis from AppContext
2. Load history from useHistory hook
3. IF no analysis:
   Show empty state message
```

**On Analysis Update**:
```
1. Update all metric cards with new scores
2. Update mood display
3. Update suggestions panel
4. Update insights panel
5. Trigger chart re-render with new data
6. Animate transitions (fade in)
```

**Layout**:
```
Grid Layout (responsive):
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

Sections:
1. Metrics Grid (6 cards)
2. Mood Display
3. Suggestions Panel
4. Insights Panel
5. Charts Section (3 charts)
```

---

## 6. MoodTrendChart Component

### Purpose
Line chart showing mood progression over time

### Props
```typescript
interface MoodTrendChartProps {
  data: ChartDataPoint[];
  height: number;
  width?: number;
}
```

### Behavior Logic

**Data Transformation**:
```
1. Load history from useHistory hook
2. Apply adaptive aggregation (daily/weekly/monthly)
3. Limit data points based on performance mode:
   - High performance: 90 points
   - Low performance: 30 points
4. Transform to ChartDataPoint format
5. Sort by timestamp (oldest first)
```

**Chart Configuration**:
```
- X-Axis: Date labels (formatted)
- Y-Axis: Score (0-100)
- Lines: Mood, Stress, Motivation
- Colors: Cyan (#00D9FF), Pink (#FF006E), Purple (#7B2CBF)
- Stroke width: 2px
- Dot size: 4px
- Tooltip: Show all values on hover
```

**Responsive Behavior**:
```
IF screen width < 768px:
  - Reduce chart height
  - Show fewer X-axis labels
  - Simplify tooltip
```

---

## 7. EmotionalDistributionChart Component

### Purpose
Pie chart showing emotional state distribution

### Props
```typescript
interface EmotionalDistributionChartProps {
  data: EmotionDistribution[];
  height: number;
  width?: number;
}
```

### Behavior Logic

**Data Calculation**:
```
1. Get current analysis from AppContext
2. Extract EmotionalScores
3. Normalize scores to percentages:
   total = sum of all 6 scores
   each_percent = (score / total) × 100
4. Group into categories:
   - Positive: (mood + confidence) / 2
   - Stress: stress
   - Motivation: (motivation + productivity) / 2
   - Focus: focus
5. Assign colors to each category
```

**Chart Configuration**:
```
- Inner radius: 60% (donut chart)
- Outer radius: 90%
- Label: Show percentage
- Colors: Match emotion categories
- Animation: Fade in + rotate
```

---

## 8. ProductivityFocusChart Component

### Purpose
Bar chart comparing productivity and focus metrics

### Props
```typescript
interface ProductivityFocusChartProps {
  data: ProductivityData[];
  height: number;
  width?: number;
}
```

### Behavior Logic

**Data Transformation**:
```
1. Load recent entries (last 7 days)
2. Extract productivity and focus scores
3. Group by date
4. Format date labels (e.g., "May 7")
```

**Chart Configuration**:
```
- X-Axis: Date labels
- Y-Axis: Score (0-100)
- Bars: Productivity (purple), Focus (cyan)
- Bar width: 20px
- Gap: 10px
- Gradient fill
```

---

## 9. Form Validation Logic

### Input Validation Flow

```
User types in JournalInput
    ↓
Validate on change (real-time):
  - Check length
  - Check content
    ↓
IF invalid:
  - Show inline error message
  - Disable Analyze button
    ↓
IF valid:
  - Clear error message
  - Enable Analyze button
    ↓
User clicks Analyze
    ↓
Final validation:
  - Re-validate input
  - Sanitize text
    ↓
IF valid:
  - Trigger analysis
  - Show loading state
    ↓
IF invalid:
  - Show error toast
  - Keep input focused
```

---

## 10. User Interaction Flows

### Flow 1: Manual Analysis

```
1. User types in JournalInput
2. User clicks AnalyzeButton
3. JournalInput validates input
4. IF valid:
   a. Call useAnalysis().analyze(text)
   b. Show loading spinner
   c. SentimentAnalysisService processes text
   d. Analysis result returned
   e. AppContext updated
   f. Dashboard components re-render
   g. Success toast shown
   h. Input cleared (optional)
5. IF invalid:
   Show validation error
```

### Flow 2: Auto Analysis

```
1. User enables auto-analyze mode via AnalysisModeToggle
2. User types in JournalInput
3. After 500ms of no typing (debounce):
   a. Validate input
   b. IF valid AND length >= 10 characters:
      - Trigger analysis automatically
      - Show subtle loading indicator
      - Update dashboard in background
   c. IF invalid:
      - Do nothing, wait for more input
```

### Flow 3: View Historical Data

```
1. User scrolls to charts section
2. Charts load historical data from useHistory hook
3. Data transformed and aggregated
4. Charts render with animations
5. User hovers over data points:
   - Show tooltip with details
   - Highlight corresponding data
6. User clicks chart legend:
   - Toggle data series visibility
```

### Flow 4: Error Recovery

```
1. Error occurs during analysis
2. ErrorBoundary catches error
3. ErrorHandlingService logs error (dev mode)
4. Show error toast to user
5. Provide recovery options:
   - "Try Again" button
   - "Clear Input" button
6. User clicks "Try Again":
   - Retry analysis
   - IF succeeds: proceed normally
   - IF fails again: suggest refresh
```

---

## 11. State Management Integration

### AppContext Usage

```typescript
// In Dashboard component
const { currentAnalysis, history, settings } = useAppContext();

// Update analysis
const handleAnalysisComplete = (result: AnalysisResult) => {
  setAnalysis(result);
  addToHistory({
    id: generateUUID(),
    text: inputText,
    analysis: result,
    timestamp: Date.now()
  });
};
```

### Custom Hooks Usage

```typescript
// In JournalInput component
const { analyze, isAnalyzing, error } = useAnalysis();
const { settings, updateSettings } = useSettings();
const debouncedText = useDebounce(text, 500);

// Auto-analyze effect
useEffect(() => {
  if (settings.analysisMode === 'auto' && debouncedText.length >= 10) {
    analyze(debouncedText);
  }
}, [debouncedText, settings.analysisMode]);
```

---

## 12. Performance Optimization

### Component Memoization

```typescript
// Memoize expensive components
const MetricCard = React.memo(MetricCardComponent);
const MoodTrendChart = React.memo(MoodTrendChartComponent);

// Memoize expensive calculations
const chartData = useMemo(() => {
  return transformHistoryToChartData(history);
}, [history]);

// Memoize callbacks
const handleAnalyze = useCallback(() => {
  analyze(text);
}, [text, analyze]);
```

### Conditional Rendering

```typescript
// Only render charts when data available
{history.length > 0 && (
  <MoodTrendChart data={chartData} />
)}

// Lazy load heavy components
const ChartsSection = lazy(() => import('./ChartsSection'));
```

---

## Summary

**Components Defined**: 9 major components with detailed logic
- **Input Components**: JournalInput, AnalyzeButton, AnalysisModeToggle
- **Display Components**: MetricCard, Dashboard, MoodDisplay
- **Chart Components**: MoodTrendChart, EmotionalDistributionChart, ProductivityFocusChart

**Interaction Flows**: 4 complete user flows documented
- Manual analysis flow
- Auto analysis flow
- Historical data viewing
- Error recovery flow

**State Management**: Integration with AppContext and custom hooks
**Performance**: Memoization and conditional rendering strategies
**Validation**: Real-time and final validation logic
**Animations**: Smooth transitions and loading states
