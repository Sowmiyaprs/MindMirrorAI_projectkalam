# Domain Entities - MindMirror AI

## Overview

This document defines all domain entities, their properties, relationships, and data structures used throughout the MindMirror AI application.

---

## Core Entities

### 1. AnalysisResult

**Purpose**: Represents the complete result of a sentiment analysis operation

**Properties**:
```typescript
interface AnalysisResult {
  scores: EmotionalScores;      // Six emotional metric scores
  mood: string;                  // Overall detected mood
  suggestions: string[];         // 3-5 contextual suggestions
  timestamp: number;             // Unix timestamp (milliseconds)
  inputText: string;             // Original user input
}
```

**Validation Rules**:
- `scores`: Must be valid EmotionalScores object
- `mood`: Must be non-empty string
- `suggestions`: Array with 3-5 elements
- `timestamp`: Must be positive number
- `inputText`: Must be non-empty string (3-10,000 characters)

**Example**:
```json
{
  "scores": {
    "mood": 65,
    "stress": 72,
    "motivation": 58,
    "confidence": 45,
    "productivity": 52,
    "focus": 48
  },
  "mood": "Stressed",
  "suggestions": [
    "Take short breaks every hour",
    "Practice deep breathing exercises",
    "Prioritize your most important tasks"
  ],
  "timestamp": 1715040000000,
  "inputText": "I feel stressed because of deadlines but I am still motivated to finish my work."
}
```

---

### 2. EmotionalScores

**Purpose**: Contains the six emotional metric scores (0-100 scale)

**Properties**:
```typescript
interface EmotionalScores {
  mood: number;          // Overall mood/happiness (0-100)
  stress: number;        // Stress level (0-100)
  motivation: number;    // Motivation level (0-100)
  confidence: number;    // Confidence level (0-100)
  productivity: number;  // Productivity level (0-100)
  focus: number;         // Focus level (0-100)
}
```

**Validation Rules**:
- All scores must be numbers
- All scores must be in range [0, 100]
- All scores must be integers (no decimals)

**Calculation Source**:
- `mood`: Calculated from POSITIVE and NEGATIVE keywords
- `stress`: Calculated from STRESS and NEGATIVE keywords
- `motivation`: Calculated from MOTIVATION and POSITIVE keywords
- `confidence`: Calculated from CONFIDENCE and POSITIVE keywords
- `productivity`: Calculated from MOTIVATION and CONFIDENCE scores
- `focus`: Calculated from MOTIVATION and STRESS scores

---

### 3. JournalEntry

**Purpose**: Represents a single journal entry with analysis results

**Properties**:
```typescript
interface JournalEntry {
  id: string;                    // Unique identifier (UUID v4)
  text: string;                  // User's journal text
  analysis: AnalysisResult;      // Analysis results
  timestamp: number;             // Entry creation time (Unix ms)
}
```

**Validation Rules**:
- `id`: Must be valid UUID v4 format
- `text`: Must be non-empty string (3-10,000 characters)
- `analysis`: Must be valid AnalysisResult object
- `timestamp`: Must be positive number

**Relationships**:
- Contains one AnalysisResult
- Stored in array in localStorage

**Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "text": "I feel stressed because of deadlines...",
  "analysis": { /* AnalysisResult object */ },
  "timestamp": 1715040000000
}
```

---

### 4. UserSettings

**Purpose**: Stores user preferences and application settings

**Properties**:
```typescript
interface UserSettings {
  analysisMode: 'manual' | 'auto';           // Analysis trigger mode
  performanceMode: 'high' | 'low' | 'auto';  // Performance mode
  theme: 'dark' | 'light';                   // UI theme
}
```

**Default Values**:
```typescript
const DEFAULT_SETTINGS: UserSettings = {
  analysisMode: 'manual',
  performanceMode: 'auto',
  theme: 'dark'
};
```

**Validation Rules**:
- `analysisMode`: Must be 'manual' or 'auto'
- `performanceMode`: Must be 'high', 'low', or 'auto'
- `theme`: Must be 'dark' or 'light'

**Storage**:
- Persisted to localStorage key: `mindmirror_settings`
- Loaded on app initialization

---

### 5. KeywordMatch

**Purpose**: Represents a matched keyword during sentiment analysis

**Properties**:
```typescript
interface KeywordMatch {
  word: string;              // The matched word
  category: EmotionCategory; // Emotion category
  position: number;          // Position in text (word index)
  baseScore: number;         // Base score (default: 10)
  isNegated: boolean;        // Whether negation was applied
  intensityMultiplier: number; // Intensity modifier (default: 1.0)
  finalScore: number;        // Calculated final score
}

type EmotionCategory = 
  | 'POSITIVE' 
  | 'NEGATIVE' 
  | 'STRESS' 
  | 'MOTIVATION' 
  | 'CONFIDENCE';
```

**Calculation**:
```
finalScore = baseScore × intensityMultiplier × (isNegated ? -1 : 1)
```

**Example**:
```json
{
  "word": "stressed",
  "category": "STRESS",
  "position": 3,
  "baseScore": 10,
  "isNegated": false,
  "intensityMultiplier": 1.5,
  "finalScore": 15
}
```

---

### 6. IntensityMap

**Purpose**: Maps keywords to their intensity modifiers

**Properties**:
```typescript
interface IntensityMap {
  [keyword: string]: {
    modifier: string;      // The intensity modifier word
    multiplier: number;    // Multiplier value (0.5, 1.5, 2.0)
  };
}
```

**Example**:
```json
{
  "stressed": {
    "modifier": "very",
    "multiplier": 1.5
  },
  "motivated": {
    "modifier": "extremely",
    "multiplier": 2.0
  }
}
```

---

### 7. ChartDataPoint

**Purpose**: Represents a single data point for chart visualization

**Properties**:
```typescript
interface ChartDataPoint {
  timestamp: number;      // Unix timestamp (ms)
  date: string;          // Formatted date string (YYYY-MM-DD)
  mood: number;          // Mood score (0-100)
  stress: number;        // Stress score (0-100)
  motivation: number;    // Motivation score (0-100)
  confidence: number;    // Confidence score (0-100)
  productivity: number;  // Productivity score (0-100)
  focus: number;         // Focus score (0-100)
}
```

**Transformation**:
- Created from JournalEntry array
- Aggregated by time period (daily/weekly/monthly)
- Limited to 30-90 points based on performance mode

**Example**:
```json
{
  "timestamp": 1715040000000,
  "date": "2026-05-07",
  "mood": 65,
  "stress": 72,
  "motivation": 58,
  "confidence": 45,
  "productivity": 52,
  "focus": 48
}
```

---

### 8. EmotionDistribution

**Purpose**: Represents emotion distribution for pie chart

**Properties**:
```typescript
interface EmotionDistribution {
  emotion: string;    // Emotion name
  value: number;      // Percentage value (0-100)
  color: string;      // Hex color code
}
```

**Calculation**:
- Derived from EmotionalScores
- Normalized to percentages
- Grouped into categories

**Example**:
```json
[
  {
    "emotion": "Positive",
    "value": 35,
    "color": "#00D9FF"
  },
  {
    "emotion": "Stress",
    "value": 30,
    "color": "#FF006E"
  },
  {
    "emotion": "Motivation",
    "value": 25,
    "color": "#7B2CBF"
  },
  {
    "emotion": "Focus",
    "value": 10,
    "color": "#00FF88"
  }
]
```

---

### 9. ProductivityData

**Purpose**: Represents productivity and focus data for bar chart

**Properties**:
```typescript
interface ProductivityData {
  date: string;          // Date label (e.g., "May 7")
  productivity: number;  // Productivity score (0-100)
  focus: number;         // Focus score (0-100)
}
```

**Example**:
```json
{
  "date": "May 7",
  "productivity": 52,
  "focus": 48
}
```

---

### 10. Achievement

**Purpose**: Represents a user achievement (mock data)

**Properties**:
```typescript
interface Achievement {
  id: string;            // Unique identifier
  title: string;         // Achievement title
  description: string;   // Achievement description
  icon: string;          // Icon name or emoji
  progress: number;      // Progress percentage (0-100)
  completed: boolean;    // Whether achievement is completed
}
```

**Example**:
```json
{
  "id": "first-entry",
  "title": "First Entry",
  "description": "Complete your first journal entry",
  "icon": "✍️",
  "progress": 100,
  "completed": true
}
```

---

### 11. UserProfile

**Purpose**: Represents user profile information (mock data)

**Properties**:
```typescript
interface UserProfile {
  name: string;          // User's name
  avatar: string;        // Avatar URL or emoji
  streak: number;        // Current streak (days)
  totalEntries: number;  // Total journal entries
  joinDate: string;      // Join date (ISO format)
}
```

**Example**:
```json
{
  "name": "Alex Johnson",
  "avatar": "👤",
  "streak": 7,
  "totalEntries": 42,
  "joinDate": "2026-04-01"
}
```

---

### 12. PerformanceMetrics

**Purpose**: Contains device performance measurements

**Properties**:
```typescript
interface PerformanceMetrics {
  fps: number;                  // Frames per second
  deviceMemory: number;         // Device memory in GB
  hardwareConcurrency: number;  // Number of CPU cores
  connectionType: string;       // Network connection type
  performanceScore: number;     // Calculated score (0-100)
}
```

**Example**:
```json
{
  "fps": 58,
  "deviceMemory": 8,
  "hardwareConcurrency": 4,
  "connectionType": "4g",
  "performanceScore": 85
}
```

---

### 13. ValidationResult

**Purpose**: Represents the result of input validation

**Properties**:
```typescript
interface ValidationResult {
  isValid: boolean;      // Whether input is valid
  error: string | null;  // Error message if invalid
  sanitizedText: string; // Sanitized text if valid
}
```

**Example (Valid)**:
```json
{
  "isValid": true,
  "error": null,
  "sanitizedText": "I feel stressed because of deadlines..."
}
```

**Example (Invalid)**:
```json
{
  "isValid": false,
  "error": "Input too short (minimum 3 characters)",
  "sanitizedText": ""
}
```

---

### 14. ErrorContext

**Purpose**: Provides context for error logging and handling

**Properties**:
```typescript
interface ErrorContext {
  component: string;     // Component where error occurred
  action: string;        // Action being performed
  error: Error;          // The error object
  timestamp: number;     // When error occurred
  userInput?: string;    // User input if relevant
}
```

**Example**:
```json
{
  "component": "SentimentAnalysisService",
  "action": "analyze",
  "error": { "name": "TypeError", "message": "Cannot read property..." },
  "timestamp": 1715040000000,
  "userInput": "I feel..."
}
```

---

## Entity Relationships

### Relationship Diagram

```
JournalEntry
    ├── contains → AnalysisResult
    │                 └── contains → EmotionalScores
    └── stored in → localStorage (array)

UserSettings
    └── stored in → localStorage (object)

ChartDataPoint
    └── derived from → JournalEntry[]

EmotionDistribution
    └── derived from → EmotionalScores

KeywordMatch
    └── used internally by → SentimentAnalysisService

IntensityMap
    └── used internally by → SentimentAnalysisService

PerformanceMetrics
    └── used by → PerformanceDetectionService
```

---

## Data Persistence

### localStorage Keys

```typescript
const STORAGE_KEYS = {
  ENTRIES: 'mindmirror_entries',      // JournalEntry[]
  SETTINGS: 'mindmirror_settings',    // UserSettings
  PERFORMANCE: 'mindmirror_performance' // PerformanceMetrics
};
```

### Storage Format

```json
{
  "mindmirror_entries": [
    { /* JournalEntry */ },
    { /* JournalEntry */ }
  ],
  "mindmirror_settings": {
    /* UserSettings */
  },
  "mindmirror_performance": {
    /* PerformanceMetrics */
  }
}
```

---

## Type Safety

### TypeScript Interfaces

All entities should be defined as TypeScript interfaces for type safety:

```typescript
// Export all interfaces
export type {
  AnalysisResult,
  EmotionalScores,
  JournalEntry,
  UserSettings,
  KeywordMatch,
  IntensityMap,
  ChartDataPoint,
  EmotionDistribution,
  ProductivityData,
  Achievement,
  UserProfile,
  PerformanceMetrics,
  ValidationResult,
  ErrorContext
};
```

### Runtime Validation

For data loaded from localStorage, implement runtime validation:

```typescript
function isValidJournalEntry(obj: any): obj is JournalEntry {
  return (
    typeof obj.id === 'string' &&
    typeof obj.text === 'string' &&
    typeof obj.timestamp === 'number' &&
    isValidAnalysisResult(obj.analysis)
  );
}
```

---

## Summary

**Core Entities**: 14 domain entities defined
- **Analysis**: AnalysisResult, EmotionalScores, KeywordMatch, IntensityMap
- **Storage**: JournalEntry, UserSettings
- **Visualization**: ChartDataPoint, EmotionDistribution, ProductivityData
- **Mock Data**: Achievement, UserProfile
- **System**: PerformanceMetrics, ValidationResult, ErrorContext

**Relationships**: Clear parent-child and derivation relationships
**Persistence**: localStorage with defined keys and formats
**Type Safety**: TypeScript interfaces with runtime validation
