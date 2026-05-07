# Component Architecture - MindMirror AI

## Component Organization Strategy
**Hybrid Approach**: Top-level features with type-based subfolders within each feature

```
src/
├── features/
│   ├── analysis/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── dashboard/
│   │   ├── components/
│   │   └── hooks/
│   ├── charts/
│   │   ├── components/
│   │   └── utils/
│   └── journal/
│       ├── components/
│       └── hooks/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── contexts/
└── data/
    └── mocks/
```

---

## Core Components

### 1. Layout Components

#### App
- **Purpose**: Root application component
- **Responsibilities**:
  - Render main application structure
  - Provide global context providers (AppContext, PerformanceContext)
  - Wrap with ErrorBoundary
  - Initialize application state
- **Location**: `src/App.tsx`

#### MainLayout
- **Purpose**: Main application layout structure
- **Responsibilities**:
  - Render header, sidebar, and main content area
  - Handle responsive layout adjustments
  - Manage layout state (sidebar collapsed/expanded)
- **Location**: `src/shared/components/MainLayout.tsx`

#### Header
- **Purpose**: Application header with branding and navigation
- **Responsibilities**:
  - Display app logo and title
  - Show user profile (mock data)
  - Render theme toggle (if applicable)
  - Display notifications icon
- **Location**: `src/shared/components/Header.tsx`

#### Sidebar
- **Purpose**: Navigation sidebar
- **Responsibilities**:
  - Display navigation menu items
  - Highlight active section
  - Handle responsive collapse/expand
  - Show quick stats or achievements
- **Location**: `src/shared/components/Sidebar.tsx`

---

### 2. Journal/Input Components

#### JournalInput
- **Purpose**: Main text input area for user feelings
- **Responsibilities**:
  - Render futuristic textarea with glassmorphism styling
  - Handle user text input
  - Trigger analysis (manual or auto)
  - Display character count
  - Show input validation errors
- **Location**: `src/features/journal/components/JournalInput.tsx`

#### AnalyzeButton
- **Purpose**: Animated analyze button
- **Responsibilities**:
  - Trigger sentiment analysis on click
  - Display loading state during analysis
  - Show glow effects and animations
  - Disable when input is empty
- **Location**: `src/features/journal/components/AnalyzeButton.tsx`

#### AnalysisModeToggle
- **Purpose**: Toggle between manual and auto-analyze modes
- **Responsibilities**:
  - Switch between manual and auto-analyze
  - Persist user preference to localStorage
  - Display current mode visually
- **Location**: `src/features/journal/components/AnalysisModeToggle.tsx`

---

### 3. Dashboard Components

#### Dashboard
- **Purpose**: Main dashboard container
- **Responsibilities**:
  - Orchestrate dashboard layout
  - Display metric cards, charts, and insights
  - Handle responsive grid layout
  - Show loading states
- **Location**: `src/features/dashboard/components/Dashboard.tsx`

#### MetricCard
- **Purpose**: Reusable card for displaying emotional metrics
- **Responsibilities**:
  - Display metric name and score (0-100)
  - Render animated progress bar
  - Apply neon glow effects
  - Handle smooth transitions on score updates
- **Location**: `src/features/dashboard/components/MetricCard.tsx`

#### MetricsGrid
- **Purpose**: Grid container for all metric cards
- **Responsibilities**:
  - Layout 6 metric cards in responsive grid
  - Handle animations when metrics update
  - Apply consistent spacing and styling
- **Location**: `src/features/dashboard/components/MetricsGrid.tsx`

#### MoodDisplay
- **Purpose**: Display overall detected mood
- **Responsibilities**:
  - Show mood name (Happy, Stressed, Motivated, etc.)
  - Display mood icon or emoji
  - Apply mood-specific styling and colors
  - Animate mood transitions
- **Location**: `src/features/dashboard/components/MoodDisplay.tsx`

#### SuggestionsPanel
- **Purpose**: Display AI-generated suggestions
- **Responsibilities**:
  - Render 3-5 contextual suggestions
  - Apply card styling with icons
  - Handle suggestion animations
  - Support suggestion actions (optional)
- **Location**: `src/features/dashboard/components/SuggestionsPanel.tsx`

#### InsightsPanel
- **Purpose**: Display AI-generated insights summary
- **Responsibilities**:
  - Show analysis summary text
  - Display wellness score
  - Show emotional balance indicator
  - Render trend indicators
- **Location**: `src/features/dashboard/components/InsightsPanel.tsx`

---

### 4. Chart Components

#### MoodTrendChart
- **Purpose**: Line chart showing mood progression over time
- **Responsibilities**:
  - Transform historical data for Recharts
  - Render line chart with mood scores
  - Apply custom styling (neon colors, gradients)
  - Handle responsive sizing
  - Animate chart updates
- **Location**: `src/features/charts/components/MoodTrendChart.tsx`

#### EmotionalDistributionChart
- **Purpose**: Pie chart showing emotional state distribution
- **Responsibilities**:
  - Transform analysis data for pie chart
  - Render pie chart with emotion categories
  - Apply custom colors per emotion
  - Show percentages and labels
  - Animate chart transitions
- **Location**: `src/features/charts/components/EmotionalDistributionChart.tsx`

#### ProductivityFocusChart
- **Purpose**: Bar chart comparing productivity and focus metrics
- **Responsibilities**:
  - Transform productivity/focus data for bar chart
  - Render bar chart with two metrics
  - Apply gradient fills
  - Show value labels
  - Animate bar transitions
- **Location**: `src/features/charts/components/ProductivityFocusChart.tsx`

#### ChartContainer
- **Purpose**: Wrapper component for all charts
- **Responsibilities**:
  - Provide consistent chart styling
  - Handle responsive chart sizing
  - Apply glassmorphism card styling
  - Show chart titles and legends
- **Location**: `src/features/charts/components/ChartContainer.tsx`

---

### 5. Shared UI Components

#### ErrorBoundary
- **Purpose**: React error boundary for graceful error handling
- **Responsibilities**:
  - Catch React component errors
  - Display fallback UI on error
  - Log errors in development mode
  - Provide error recovery options
- **Location**: `src/shared/components/ErrorBoundary.tsx`

#### LoadingSpinner
- **Purpose**: Animated loading indicator
- **Responsibilities**:
  - Display futuristic loading animation
  - Support different sizes
  - Apply neon glow effects
- **Location**: `src/shared/components/LoadingSpinner.tsx`

#### Toast
- **Purpose**: Toast notification component (using react-hot-toast)
- **Responsibilities**:
  - Display success, error, info notifications
  - Auto-dismiss after timeout
  - Apply custom styling to match theme
  - Support action buttons (optional)
- **Location**: `src/shared/components/Toast.tsx`

#### FloatingChatButton
- **Purpose**: Decorative floating chatbot button
- **Responsibilities**:
  - Display floating button with icon
  - Apply pulse animation
  - Show tooltip on hover
  - Handle click (show mock chat interface or message)
- **Location**: `src/shared/components/FloatingChatButton.tsx`

#### Card
- **Purpose**: Reusable glassmorphism card component
- **Responsibilities**:
  - Provide consistent card styling
  - Support different sizes and variants
  - Apply glassmorphism effects
  - Handle hover animations
- **Location**: `src/shared/components/Card.tsx`

---

### 6. Mock Data Components

#### AchievementsPanel
- **Purpose**: Display user achievements (mock data)
- **Responsibilities**:
  - Render achievement cards
  - Show achievement icons and descriptions
  - Display progress bars for incomplete achievements
  - Apply animations
- **Location**: `src/features/dashboard/components/AchievementsPanel.tsx`

#### ProfileCard
- **Purpose**: Display user profile information (mock data)
- **Responsibilities**:
  - Show user avatar, name, and stats
  - Display streak information
  - Show total entries count
  - Apply card styling
- **Location**: `src/features/dashboard/components/ProfileCard.tsx`

---

## Context Providers

### AppContext
- **Purpose**: Global application state
- **Responsibilities**:
  - Provide analysis results state
  - Provide history state
  - Provide settings state
  - Expose state update methods
- **Location**: `src/shared/contexts/AppContext.tsx`

### PerformanceContext
- **Purpose**: Performance mode detection and state
- **Responsibilities**:
  - Detect device performance on mount
  - Provide performance mode flag (high/low)
  - Allow manual performance mode override
  - Persist preference to localStorage
- **Location**: `src/shared/contexts/PerformanceContext.tsx`

---

## Summary

**Total Components**: 25+
- **Layout**: 4 components (App, MainLayout, Header, Sidebar)
- **Journal/Input**: 3 components (JournalInput, AnalyzeButton, AnalysisModeToggle)
- **Dashboard**: 6 components (Dashboard, MetricCard, MetricsGrid, MoodDisplay, SuggestionsPanel, InsightsPanel)
- **Charts**: 4 components (MoodTrendChart, EmotionalDistributionChart, ProductivityFocusChart, ChartContainer)
- **Shared UI**: 6 components (ErrorBoundary, LoadingSpinner, Toast, FloatingChatButton, Card)
- **Mock Data**: 2 components (AchievementsPanel, ProfileCard)
- **Contexts**: 2 providers (AppContext, PerformanceContext)

**Organization**: Hybrid feature-based with type-based subfolders
**State Management**: Context API + Custom Hooks
**Styling**: Tailwind CSS with custom glassmorphism and neon effects
