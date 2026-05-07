# Business Rules - MindMirror AI

## Overview

This document defines all business rules, validation logic, constraints, and decision rules for the MindMirror AI application.

---

## 1. Input Validation Rules

### Rule IV-01: Text Length Validation
**Rule**: Journal input must be between 3 and 10,000 characters

**Logic**:
```
IF text.length < 3:
  RETURN error "Input too short (minimum 3 characters)"
ELSE IF text.length > 10,000:
  RETURN error "Input too long (maximum 10,000 characters)"
ELSE:
  PROCEED to analysis
```

**Rationale**: Minimum ensures meaningful input; maximum prevents performance issues and storage bloat

---

### Rule IV-02: Empty Input Validation
**Rule**: Empty or whitespace-only input must be rejected

**Logic**:
```
IF text is null OR text is undefined:
  RETURN error "Input is required"
ELSE IF text.trim().length === 0:
  RETURN error "Please enter meaningful text"
ELSE:
  PROCEED to analysis
```

---

### Rule IV-03: Input Sanitization
**Rule**: All user input must be sanitized to prevent XSS attacks

**Logic**:
```
1. Remove HTML tags: text.replace(/<[^>]*>/g, '')
2. Escape special characters: &, <, >, ", '
3. Trim whitespace: text.trim()
4. Return sanitized text
```

**Security**: Implements SECURITY-05 (Input Validation)

---

## 2. Keyword Matching Rules

### Rule KM-01: Case-Insensitive Matching
**Rule**: Keyword matching must be case-insensitive

**Logic**:
```
Convert both text and keywords to lowercase before matching
"Happy" matches "happy", "HAPPY", "HaPpY"
```

---

### Rule KM-02: Variation Matching
**Rule**: Keywords must match common variations

**Logic**:
```
Base keyword: "stress"
Matches: "stressed", "stressful", "stressing"

Base keyword: "happy"
Matches: "happiness", "happier", "happiest"
```

**Implementation**: Use predefined variation dictionary

---

### Rule KM-03: Word Boundary Matching
**Rule**: Keywords must match complete words only

**Logic**:
```
"happy" matches "I am happy"
"happy" does NOT match "unhappy" (different word)
```

**Implementation**: Use word boundary regex: `\bhappy\b`

---

## 3. Negation Handling Rules

### Rule NH-01: Negation Scope
**Rule**: Negation words affect keywords within 3 words distance

**Logic**:
```
"I am not very happy" → "not" affects "happy" (3 words away)
"I am definitely not happy" → "not" affects "happy" (2 words away)
"I am not stressed at all today" → "not" does NOT affect "today"
```

---

### Rule NH-02: Negation Inversion
**Rule**: Negation inverts sentiment for POSITIVE and NEGATIVE keywords

**Logic**:
```
POSITIVE keyword + negation → NEGATIVE sentiment
  "not happy" → negative sentiment

NEGATIVE keyword + negation → POSITIVE sentiment
  "not sad" → positive sentiment

STRESS/MOTIVATION/CONFIDENCE + negation → 50% score reduction
  "not stressed" → stress score × 0.5
```

---

### Rule NH-03: Double Negation Cancellation
**Rule**: Two negations cancel each other out

**Logic**:
```
"not unhappy" → "happy" (two negations = positive)
"never not motivated" → "motivated" (two negations cancel)
```

**Implementation**: Count negation words in scope; if count is even, cancel negation

---

## 4. Intensity Modifier Rules

### Rule IM-01: Modifier Multipliers
**Rule**: Intensity modifiers apply specific multipliers to keyword scores

**Multipliers**:
- **HIGH** (very, really, super): 1.5x
- **EXTREME** (extremely, absolutely, completely): 2.0x
- **LOW** (slightly, somewhat, a bit): 0.5x

**Logic**:
```
"very happy" → happy score × 1.5
"extremely stressed" → stressed score × 2.0
"slightly anxious" → anxious score × 0.5
```

---

### Rule IM-02: Modifier Scope
**Rule**: Intensity modifiers affect keywords within 2 words distance

**Logic**:
```
"very happy" → "very" affects "happy" (1 word away) ✓
"very very happy" → first "very" affects "happy" (2 words away) ✓
"I am very happy" → "very" affects "happy" (1 word away) ✓
```

---

### Rule IM-03: Multiple Modifiers
**Rule**: If multiple modifiers found, use the strongest (highest multiplier)

**Logic**:
```
"very extremely happy" → use 2.0x (extremely is stronger)
"slightly very happy" → use 1.5x (very is stronger)
```

---

## 5. Score Calculation Rules

### Rule SC-01: Category-Specific Scoring
**Rule**: Each emotional metric is calculated from its specific keyword categories

**Formulas**:
```
MOOD = (POSITIVE - NEGATIVE) + 50, normalized to [0, 100]
STRESS = STRESS + (NEGATIVE × 0.3), normalized to [0, 100]
MOTIVATION = MOTIVATION + (POSITIVE × 0.2), normalized to [0, 100]
CONFIDENCE = CONFIDENCE + (POSITIVE × 0.3), normalized to [0, 100]
PRODUCTIVITY = (MOTIVATION × 0.6) + (CONFIDENCE × 0.4), normalized to [0, 100]
FOCUS = (MOTIVATION × 0.5) - (STRESS × 0.3) + 50, normalized to [0, 100]
```

---

### Rule SC-02: Diminishing Returns for Repetition
**Rule**: Repeated keywords have reduced impact

**Multipliers**:
- 1st occurrence: 100% (1.0x)
- 2nd occurrence: 70% (0.7x)
- 3rd occurrence: 50% (0.5x)
- 4th+ occurrence: 30% (0.3x)

**Example**:
```
"stressed stressed stressed" = 10 + 7 + 5 = 22 points (not 30)
```

---

### Rule SC-03: Score Normalization
**Rule**: All scores must be normalized to [0, 100] range

**Logic**:
```
IF score > 100: score = 100
IF score < 0: score = 0
ELSE: score = Math.round(score)
```

---

## 6. Mood Detection Rules

### Rule MD-01: Priority-Based Detection
**Rule**: Mood is determined by priority-ordered combination rules

**Priority Order**:
1. Overwhelmed (stress > 70 AND motivation < 50)
2. Burned Out (stress > 60 AND motivation < 30 AND mood < 40)
3. Stressed (stress > 70)
4. Productive (motivation > 70 AND stress < 50)
5. Focused (motivation > 70 AND focus > 60)
6. Happy (mood > 70 AND stress < 40)
7. Motivated (confidence > 70 AND motivation > 60)
8. Calm (mood > 60 AND stress < 30 AND motivation < 60)
9. Content (mood > 50)
10. Down (mood < 40)
11. Neutral (default)

---

### Rule MD-02: Threshold Overrides
**Rule**: High stress overrides other positive indicators

**Logic**:
```
IF stress > 70:
  Mood cannot be "Happy", "Calm", or "Content"
  Mood must be "Stressed", "Overwhelmed", or "Burned Out"
```

---

## 7. Suggestion Generation Rules

### Rule SG-01: Minimum Suggestions
**Rule**: Always generate at least 3 suggestions

**Logic**:
```
IF selected suggestions < 3:
  Add suggestions from WELLNESS_GENERAL pool until count = 3
```

---

### Rule SG-02: Maximum Suggestions
**Rule**: Never generate more than 5 suggestions

**Logic**:
```
IF selected suggestions > 5:
  Keep top 5 most relevant suggestions
```

---

### Rule SG-03: Score-Based Selection
**Rule**: Suggestions are selected based on emotional scores

**Selection Logic**:
```
IF stress > 60:
  Add 1-2 from STRESS_REDUCTION pool

IF motivation < 40:
  Add 1-2 from MOTIVATION_BOOST pool

IF confidence < 40:
  Add 1 from CONFIDENCE_BUILDING pool

IF productivity < 50 AND motivation > 50:
  Add 1 from PRODUCTIVITY_TIPS pool

Fill remaining slots with WELLNESS_GENERAL
```

---

## 8. Storage Management Rules

### Rule SM-01: Automatic Quota Management
**Rule**: When localStorage quota exceeded, automatically delete oldest entries

**Logic**:
```
ON QuotaExceededError:
  1. Sort entries by timestamp (oldest first)
  2. Delete oldest 10% of entries
  3. Retry save operation
  4. IF still fails, delete another 10%
  5. Repeat until save succeeds OR only 20 entries remain
  6. IF still fails, show error toast
```

---

### Rule SM-02: Minimum Entry Retention
**Rule**: Always retain at least 20 most recent entries

**Logic**:
```
IF entry count <= 20:
  Do NOT delete any entries
  Show error toast instead
```

---

### Rule SM-03: Data Integrity Validation
**Rule**: Validate data structure when loading from localStorage

**Logic**:
```
ON load from localStorage:
  1. Parse JSON
  2. Validate structure matches JournalEntry interface
  3. IF invalid, discard corrupted data
  4. Log error in development mode
  5. Return empty array if all data corrupted
```

---

## 9. Chart Data Rules

### Rule CD-01: Adaptive Aggregation
**Rule**: Chart data aggregation adapts to time span

**Logic**:
```
IF data spans <= 7 days:
  Use DAILY aggregation

ELSE IF data spans <= 30 days:
  Use DAILY for last 7 days
  Use WEEKLY for older data

ELSE:
  Use DAILY for last 7 days
  Use WEEKLY for days 8-30
  Use MONTHLY for older data
```

---

### Rule CD-02: Adaptive Data Point Limiting
**Rule**: Chart data points limited based on performance mode

**Logic**:
```
IF performanceMode === 'high':
  Max data points = 90

ELSE IF performanceMode === 'low':
  Max data points = 30

ELSE: // auto
  Detect performance and apply limit
```

---

### Rule CD-03: Emotional Distribution Normalization
**Rule**: Emotional distribution must sum to 100%

**Logic**:
```
1. Sum all 6 emotional scores
2. Calculate percentage for each: (score / total) × 100
3. Round to integers
4. Adjust largest value to ensure sum = 100%
```

---

## 10. Performance Detection Rules

### Rule PD-01: Multi-Factor Scoring
**Rule**: Performance mode determined by combined score

**Scoring**:
```
FPS Score:
  >= 50 fps: 30 points
  >= 30 fps: 20 points
  < 30 fps: 10 points

Memory Score:
  >= 8 GB: 30 points
  >= 4 GB: 20 points
  < 4 GB: 10 points

CPU Cores Score:
  >= 4 cores: 40 points
  >= 2 cores: 20 points
  < 2 cores: 10 points

Total Score >= 70: HIGH performance
Total Score < 70: LOW performance
```

---

### Rule PD-02: Animation Reduction
**Rule**: On low performance, disable complex animations only

**Disabled Animations**:
- Particle effects
- 3D transforms
- Complex SVG animations
- Multiple simultaneous animations

**Kept Animations**:
- Fade in/out
- Simple slides
- Progress bar animations
- Button hover effects

---

### Rule PD-03: Duration Reduction
**Rule**: On low performance, reduce animation duration by 50%

**Logic**:
```
IF performanceMode === 'low':
  animationDuration = baseDuration × 0.5
ELSE:
  animationDuration = baseDuration
```

---

## 11. Error Handling Rules

### Rule EH-01: User-Friendly Messages
**Rule**: Never expose internal error details to users

**Logic**:
```
Internal Error: "TypeError: Cannot read property 'scores' of undefined"
User Message: "Unable to analyze your entry. Please try again."
```

---

### Rule EH-02: Error Logging
**Rule**: Log errors only in development mode

**Logic**:
```
IF isDevelopment:
  console.error('[Error]', errorContext)
ELSE:
  // Silent in production
```

---

### Rule EH-03: Graceful Degradation
**Rule**: Application must continue functioning after non-critical errors

**Examples**:
- Chart rendering fails → Show placeholder message
- localStorage unavailable → Use in-memory storage
- Performance detection fails → Default to 'auto' mode

---

## 12. Security Rules

### Rule SEC-01: XSS Prevention
**Rule**: All user input must be sanitized before display or storage

**Implementation**: Implements SECURITY-05 (Input Validation)

---

### Rule SEC-02: localStorage Validation
**Rule**: All data loaded from localStorage must be validated

**Implementation**: Implements SECURITY-01 (Secure Data Storage)

---

### Rule SEC-03: Error Information Disclosure
**Rule**: Production errors must not expose system information

**Implementation**: Implements SECURITY-15 (Exception Handling)

---

## Summary

**Total Rules**: 35+ business rules defined across 12 categories

**Categories**:
- Input Validation (3 rules)
- Keyword Matching (3 rules)
- Negation Handling (3 rules)
- Intensity Modifiers (3 rules)
- Score Calculation (3 rules)
- Mood Detection (2 rules)
- Suggestion Generation (3 rules)
- Storage Management (3 rules)
- Chart Data (3 rules)
- Performance Detection (3 rules)
- Error Handling (3 rules)
- Security (3 rules)

**Compliance**:
- All rules support functional requirements (FR-1 to FR-10)
- Security rules implement SECURITY-01, SECURITY-05, SECURITY-15
- Error handling rules ensure graceful degradation
- Performance rules optimize for device capabilities
