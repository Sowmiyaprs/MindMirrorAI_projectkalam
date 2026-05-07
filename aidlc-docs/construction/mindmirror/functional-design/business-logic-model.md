# Business Logic Model - MindMirror AI

## Overview

This document defines the detailed business logic, algorithms, and workflows for the MindMirror AI sentiment analysis engine and supporting systems.

---

## 1. Sentiment Analysis Algorithm

### 1.1 Main Analysis Flow

```
Input: User text string
Output: AnalysisResult

1. Validate Input
   ├─ Check if text is empty or null → Return error
   ├─ Check if text length < 3 characters → Return error
   └─ Check if text length > 10,000 characters → Return error

2. Preprocess Text
   ├─ Convert to lowercase
   ├─ Tokenize into words
   └─ Remove special characters (keep alphanumeric and spaces)

3. Match Keywords
   ├─ For each word in text:
   │  ├─ Check exact match in emotion dictionaries
   │  └─ Check common variations (stressed → stress, stressful → stress)
   └─ Return KeywordMatches object

4. Handle Negations
   ├─ For each matched keyword:
   │  ├─ Check 3 words before keyword for negation words
   │  ├─ If negation found, invert keyword sentiment
   │  └─ Handle double negations (not unhappy → happy)
   └─ Return adjusted KeywordMatches

5. Detect Intensity Modifiers
   ├─ For each matched keyword:
   │  ├─ Check 2 words before keyword for intensity modifiers
   │  └─ Apply multiplier: very (1.5x), extremely (2x), slightly (0.5x)
   └─ Return IntensityMap

6. Calculate Emotional Scores
   ├─ For each of 6 metrics (mood, stress, motivation, confidence, productivity, focus):
   │  ├─ Sum scores from category-specific keywords
   │  ├─ Apply intensity multipliers
   │  ├─ Apply diminishing returns for repeated keywords
   │  └─ Normalize to 0-100 scale
   └─ Return EmotionalScores

7. Detect Overall Mood
   ├─ Apply combination rules based on scores
   ├─ Check threshold conditions
   └─ Return mood string (e.g., "Stressed", "Motivated", "Productive")

8. Generate Suggestions
   ├─ Analyze all 6 emotional scores
   ├─ Apply score-based rules to select 3-5 suggestions
   └─ Return suggestions array

9. Create AnalysisResult
   └─ Return complete analysis with scores, mood, suggestions, timestamp
```

---

## 2. Keyword Matching Logic

### 2.1 Keyword Dictionaries

```typescript
const EMOTION_KEYWORDS = {
  POSITIVE: {
    base: ['happy', 'joyful', 'excited', 'grateful', 'peaceful', 'energetic'],
    variations: {
      'happy': ['happiness', 'happier', 'happiest'],
      'joyful': ['joy', 'joyfully'],
      'excited': ['excitement', 'exciting'],
      'grateful': ['gratitude', 'thankful'],
      'peaceful': ['peace', 'calm', 'serene'],
      'energetic': ['energy', 'energized']
    }
  },
  NEGATIVE: {
    base: ['sad', 'angry', 'frustrated', 'anxious', 'worried', 'lonely'],
    variations: {
      'sad': ['sadness', 'unhappy', 'depressed'],
      'angry': ['anger', 'mad', 'furious'],
      'frustrated': ['frustration', 'annoyed'],
      'anxious': ['anxiety', 'nervous'],
      'worried': ['worry', 'concern', 'concerned'],
      'lonely': ['alone', 'isolated']
    }
  },
  STRESS: {
    base: ['stressed', 'overwhelmed', 'pressure', 'deadline', 'burnout'],
    variations: {
      'stressed': ['stress', 'stressful'],
      'overwhelmed': ['overwhelming'],
      'pressure': ['pressured'],
      'deadline': ['deadlines'],
      'burnout': ['burned out', 'burnt out']
    }
  },
  MOTIVATION: {
    base: ['motivated', 'determined', 'productive', 'focused', 'disciplined'],
    variations: {
      'motivated': ['motivation', 'motivating'],
      'determined': ['determination', 'driven'],
      'productive': ['productivity', 'producing'],
      'focused': ['focus', 'concentration'],
      'disciplined': ['discipline']
    }
  },
  CONFIDENCE: {
    base: ['confident', 'capable', 'proud', 'strong'],
    variations: {
      'confident': ['confidence', 'self-assured'],
      'capable': ['ability', 'able'],
      'proud': ['pride'],
      'strong': ['strength', 'powerful']
    }
  }
};
```

### 2.2 Matching Algorithm

```
For each word in preprocessed text:
  1. Check exact match in base keywords (case-insensitive)
  2. If no match, check variations dictionary
  3. If match found:
     - Record keyword
     - Record category (POSITIVE, NEGATIVE, STRESS, etc.)
     - Record position in text
     - Record base score (default: 10 points per keyword)
```

---

## 3. Negation Handling Logic

### 3.1 Negation Words

```typescript
const NEGATION_WORDS = [
  // Simple negations
  'not', 'no', 'never', "don't", "can't", "won't", "shouldn't", "couldn't",
  // Extended negations
  'hardly', 'barely', 'scarcely', 'no longer', 'neither', 'nor'
];
```

### 3.2 Negation Detection Algorithm

```
For each matched keyword at position i:
  1. Check words at positions i-1, i-2, i-3 for negation words
  2. If negation found:
     a. If keyword is POSITIVE → invert to NEGATIVE
     b. If keyword is NEGATIVE → invert to POSITIVE
     c. If keyword is STRESS → reduce score by 50%
     d. If keyword is MOTIVATION → reduce score by 50%
     e. If keyword is CONFIDENCE → reduce score by 50%
  3. Handle double negations:
     - If two negation words found (e.g., "not never"), cancel negation
     - Treat as positive assertion
```

### 3.3 Double Negation Examples

- "not unhappy" → "happy" (NEGATIVE inverted to POSITIVE)
- "not stressed" → reduced stress score
- "never not motivated" → "motivated" (double negation cancels)

---

## 4. Intensity Modifier Detection

### 4.1 Intensity Modifiers

```typescript
const INTENSITY_MODIFIERS = {
  HIGH: {
    words: ['very', 'extremely', 'incredibly', 'really', 'super', 'highly'],
    multiplier: 1.5
  },
  EXTREME: {
    words: ['absolutely', 'completely', 'totally', 'utterly'],
    multiplier: 2.0
  },
  LOW: {
    words: ['slightly', 'somewhat', 'a bit', 'a little', 'kind of', 'sort of'],
    multiplier: 0.5
  }
};
```

### 4.2 Detection Algorithm

```
For each matched keyword at position i:
  1. Check words at positions i-1, i-2 for intensity modifiers
  2. If modifier found:
     - Apply corresponding multiplier to keyword score
     - Record modifier in IntensityMap
  3. If multiple modifiers found:
     - Use the strongest modifier (highest multiplier)
```

### 4.3 Examples

- "very happy" → happy score × 1.5
- "extremely stressed" → stressed score × 2.0
- "slightly anxious" → anxious score × 0.5
- "absolutely motivated" → motivated score × 2.0

---

## 5. Score Calculation Formulas

### 5.1 Category-Specific Scoring

Each of the 6 emotional metrics is calculated from its specific keyword categories:

```
MOOD Score:
  = (POSITIVE keywords score - NEGATIVE keywords score) + 50
  = Normalized to 0-100 range

STRESS Score:
  = (STRESS keywords score) + (NEGATIVE keywords score × 0.3)
  = Normalized to 0-100 range

MOTIVATION Score:
  = (MOTIVATION keywords score) + (POSITIVE keywords score × 0.2)
  = Normalized to 0-100 range

CONFIDENCE Score:
  = (CONFIDENCE keywords score) + (POSITIVE keywords score × 0.3)
  = Normalized to 0-100 range

PRODUCTIVITY Score:
  = (MOTIVATION keywords score × 0.6) + (CONFIDENCE keywords score × 0.4)
  = Normalized to 0-100 range

FOCUS Score:
  = (MOTIVATION keywords score × 0.5) + (STRESS keywords score × -0.3) + 50
  = Normalized to 0-100 range
```

### 5.2 Repeated Keyword Handling (Diminishing Returns)

```
For repeated keywords:
  1st occurrence: full score (10 points)
  2nd occurrence: 70% score (7 points)
  3rd occurrence: 50% score (5 points)
  4th+ occurrence: 30% score (3 points)

Example:
  "stressed stressed stressed" = 10 + 7 + 5 = 22 points (not 30)
```

### 5.3 Normalization Formula

```
Raw Score = Sum of all keyword scores with modifiers
Normalized Score = (Raw Score / Max Possible Score) × 100

If Normalized Score > 100: cap at 100
If Normalized Score < 0: cap at 0
```

---

## 6. Mood Detection Algorithm

### 6.1 Combination Rules

```
Priority 1: High Stress Override
  IF stress > 70 AND motivation < 50:
    mood = "Overwhelmed"
  ELSE IF stress > 70:
    mood = "Stressed"

Priority 2: Burnout Detection
  IF stress > 60 AND motivation < 30 AND mood < 40:
    mood = "Burned Out"

Priority 3: Productive States
  IF motivation > 70 AND stress < 50:
    mood = "Productive"
  ELSE IF motivation > 70 AND focus > 60:
    mood = "Focused"

Priority 4: Positive States
  IF mood > 70 AND stress < 40:
    mood = "Happy"
  ELSE IF confidence > 70 AND motivation > 60:
    mood = "Motivated"

Priority 5: Calm States
  IF mood > 60 AND stress < 30 AND motivation < 60:
    mood = "Calm"

Priority 6: Default
  IF mood > 50:
    mood = "Content"
  ELSE IF mood < 40:
    mood = "Down"
  ELSE:
    mood = "Neutral"
```

### 6.2 Mood Priority Order

1. Overwhelmed (highest priority - critical state)
2. Burned Out (critical state)
3. Stressed (high priority)
4. Productive (positive state)
5. Focused (positive state)
6. Happy (positive state)
7. Motivated (positive state)
8. Calm (neutral-positive state)
9. Content (default positive)
10. Neutral (default)
11. Down (default negative)

---

## 7. Suggestion Generation Rules

### 7.1 Score-Based Suggestion Selection

```
Suggestion Pool:
  STRESS_REDUCTION = [
    "Take short breaks every hour",
    "Practice deep breathing exercises",
    "Prioritize your most important tasks",
    "Delegate tasks when possible",
    "Set realistic deadlines"
  ]
  
  MOTIVATION_BOOST = [
    "Set small, achievable goals",
    "Celebrate your progress",
    "Break large tasks into smaller steps",
    "Reward yourself for completing tasks",
    "Visualize your success"
  ]
  
  CONFIDENCE_BUILDING = [
    "Reflect on past successes",
    "Practice positive self-talk",
    "Focus on your strengths",
    "Seek feedback from others",
    "Take on small challenges"
  ]
  
  PRODUCTIVITY_TIPS = [
    "Use the Pomodoro technique",
    "Eliminate distractions",
    "Create a focused work environment",
    "Time-block your schedule",
    "Start with your hardest task"
  ]
  
  WELLNESS_GENERAL = [
    "Get adequate sleep",
    "Stay hydrated",
    "Take a short walk",
    "Connect with friends or family",
    "Practice mindfulness"
  ]
```

### 7.2 Selection Algorithm

```
Selected Suggestions = []

1. IF stress > 60:
   Add 1-2 suggestions from STRESS_REDUCTION

2. IF motivation < 40:
   Add 1-2 suggestions from MOTIVATION_BOOST

3. IF confidence < 40:
   Add 1 suggestion from CONFIDENCE_BUILDING

4. IF productivity < 50 AND motivation > 50:
   Add 1 suggestion from PRODUCTIVITY_TIPS

5. IF total suggestions < 3:
   Add suggestions from WELLNESS_GENERAL until count = 3

6. IF total suggestions > 5:
   Keep top 5 most relevant suggestions

7. Return Selected Suggestions (3-5 items)
```

---

## 8. Data Persistence Logic

### 8.1 localStorage Structure

```typescript
// Single array structure
localStorage.setItem('mindmirror_entries', JSON.stringify(entries));

// Data format:
{
  "mindmirror_entries": [
    {
      "id": "uuid-v4",
      "text": "User input text",
      "analysis": { /* AnalysisResult */ },
      "timestamp": 1715040000000
    },
    // ... more entries
  ],
  "mindmirror_settings": {
    "analysisMode": "auto",
    "performanceMode": "high",
    "theme": "dark"
  }
}
```

### 8.2 Storage Quota Management

```
On Save Entry:
  1. Try to save entry to localStorage
  2. If QuotaExceededError:
     a. Calculate current storage size
     b. Sort entries by timestamp (oldest first)
     c. Delete oldest 10% of entries
     d. Retry save
     e. If still fails, delete another 10%
     f. Repeat until save succeeds or only 20 entries remain
  3. If save still fails after cleanup:
     - Show error toast
     - Suggest manual data export
```

---

## 9. Chart Data Transformation Logic

### 9.1 Adaptive Aggregation

```
Get Historical Entries:
  1. Load all entries from localStorage
  2. Sort by timestamp (newest first)
  3. Determine aggregation strategy:
     
     IF entries span <= 7 days:
       Use DAILY aggregation
     
     ELSE IF entries span <= 30 days:
       Use DAILY for last 7 days
       Use WEEKLY for older data
     
     ELSE:
       Use DAILY for last 7 days
       Use WEEKLY for days 8-30
       Use MONTHLY for older data
  
  4. Apply aggregation:
     - Group entries by time period
     - Calculate average scores for each period
     - Return aggregated data points
```

### 9.2 Data Point Limiting (Adaptive)

```
On High Performance Device:
  - Show up to 90 data points
  - Use finer aggregation (daily)

On Low Performance Device:
  - Show up to 30 data points
  - Use coarser aggregation (weekly)
```

### 9.3 Emotional Distribution Calculation

```
Calculate from Current Analysis Scores:
  1. Take 6 emotional scores (mood, stress, motivation, confidence, productivity, focus)
  2. Normalize to percentages:
     total = sum of all 6 scores
     mood_percent = (mood / total) × 100
     stress_percent = (stress / total) × 100
     ... (repeat for all 6)
  3. Group into emotion categories:
     - Positive: (mood + confidence) / 2
     - Stress: stress
     - Motivation: (motivation + productivity) / 2
     - Focus: focus
  4. Return distribution array for pie chart
```

---

## 10. Performance Detection Logic

### 10.1 Multi-Factor Detection

```
Detect Performance Mode:
  1. Measure FPS:
     - Run animation for 1 second
     - Count frames rendered
     - fps = frame count
  
  2. Get Device Memory:
     - Read navigator.deviceMemory (if available)
     - memory = deviceMemory in GB
  
  3. Get Hardware Concurrency:
     - Read navigator.hardwareConcurrency
     - cores = number of CPU cores
  
  4. Calculate Performance Score:
     fps_score = fps >= 50 ? 30 : (fps >= 30 ? 20 : 10)
     memory_score = memory >= 8 ? 30 : (memory >= 4 ? 20 : 10)
     cores_score = cores >= 4 ? 40 : (cores >= 2 ? 20 : 10)
     
     total_score = fps_score + memory_score + cores_score
  
  5. Determine Mode:
     IF total_score >= 70:
       performanceMode = "high"
     ELSE:
       performanceMode = "low"
  
  6. Save preference to localStorage
  7. Return performanceMode
```

### 10.2 Animation Reduction Strategy

```
On Low Performance Mode:
  - Disable complex animations:
    × Particle effects
    × 3D transforms
    × Complex SVG animations
    × Multiple simultaneous animations
  
  - Keep simple animations:
    ✓ Fade in/out
    ✓ Simple slides
    ✓ Progress bar animations
    ✓ Button hover effects
  
  - Reduce animation duration:
    300ms → 150ms (50% reduction)
```

---

## 11. Input Validation Logic

### 11.1 Validation Rules

```
Validate Journal Input:
  1. Check if text is null or undefined → Error: "Input is required"
  2. Check if text is empty string → Error: "Please enter your thoughts"
  3. Check if text length < 3 → Error: "Input too short (minimum 3 characters)"
  4. Check if text length > 10,000 → Error: "Input too long (maximum 10,000 characters)"
  5. Check if text contains only whitespace → Error: "Please enter meaningful text"
  6. Sanitize input:
     - Remove HTML tags
     - Escape special characters
     - Trim whitespace
  7. Return validated text or error
```

---

## Summary

**Core Algorithms**:
- Sentiment analysis with keyword matching + variations
- Advanced negation handling with double negation support
- Intensity modifier detection with multipliers (1.5x, 2x, 0.5x)
- Category-specific score calculation with diminishing returns
- Combination-based mood detection with priority rules
- Score-based suggestion generation (3-5 suggestions)

**Data Management**:
- Single array localStorage structure
- Automatic quota management (delete oldest 10% when full)
- Adaptive aggregation (daily for recent, weekly for older)
- Adaptive data point limiting (30-90 points based on performance)

**Performance**:
- Multi-factor performance detection (FPS + memory + cores)
- Selective animation reduction (disable complex, keep simple)
- Adaptive chart rendering based on device capabilities

**Validation**:
- Input length validation (3-10,000 characters)
- XSS prevention (sanitize input)
- Error handling with user-friendly messages
