# Functional Design Plan - MindMirror AI

## Overview
This plan outlines the detailed business logic design for the MindMirror AI application. Since this is a single cohesive unit, the functional design covers the entire application's business logic, algorithms, and domain models.

---

## Functional Design Questions

Before generating the functional design artifacts, please answer the following questions to clarify business logic details:

### Question 1: Keyword Matching Algorithm
The sentiment analysis engine matches keywords against emotion dictionaries. How should keyword matching work?

A) Exact word matching only (case-insensitive)
B) Exact word matching + common variations (e.g., "stress" matches "stressed", "stressful")
C) Exact word matching + stemming (reduce words to root form: "running" → "run")
D) Fuzzy matching with similarity threshold (allow minor typos)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 2: Negation Detection Rules
The engine handles negations like "not happy" or "don't feel good". What should the negation detection rules be?

A) Simple negation words (not, no, never, don't, can't, won't) within 2 words before keyword
B) Extended negation words + phrases (hardly, barely, scarcely, no longer) within 3 words
C) Negation words within same sentence as keyword
D) Advanced: Handle double negations (e.g., "not unhappy" = positive)
E) Other (please describe after [Answer]: tag below)

[Answer]: D

### Question 3: Intensity Modifier Scoring
Intensity modifiers like "very", "extremely", "slightly" affect scores. How should they impact scoring?

A) Simple multipliers: very (1.5x), extremely (2x), slightly (0.5x)
B) Additive bonuses: very (+20), extremely (+40), slightly (-20)
C) Percentage adjustments: very (+50%), extremely (+100%), slightly (-50%)
D) Context-dependent: different multipliers for different emotions
E) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4: Score Calculation Formula
Six emotional metrics (mood, stress, motivation, confidence, productivity, focus) are calculated from keywords. What formula should be used?

A) Simple average: sum of keyword scores / count
B) Weighted average: positive keywords weighted higher than negative
C) Normalized score: (positive - negative) / total, then scale to 0-100
D) Category-specific: each metric calculated from its specific keyword categories only
E) Other (please describe after [Answer]: tag below)

[Answer]: D

### Question 5: Mood Detection Logic
Overall mood is detected from the six emotional scores. How should mood be determined?

A) Highest score wins: mood = category with highest score
B) Threshold-based: if stress > 70, mood = "Stressed" regardless of other scores
C) Combination rules: multiple conditions (e.g., high motivation + low stress = "Productive")
D) Weighted combination: consider all scores with different weights
E) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 6: Suggestion Generation Rules
3-5 suggestions are generated based on detected emotions. How should suggestions be selected?

A) Predefined mapping: each mood has fixed list of suggestions
B) Score-based rules: if stress > 60, include "take breaks"; if motivation < 40, include "set small goals"
C) Combination approach: consider multiple scores and select most relevant suggestions
D) Randomized selection: pick random suggestions from relevant category
E) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 7: Repeated Keyword Handling
If a user repeats the same keyword multiple times (e.g., "stressed stressed stressed"), how should this be handled?

A) Count each occurrence equally (more repetitions = higher score)
B) Diminishing returns: first occurrence full weight, subsequent occurrences reduced weight
C) Cap at maximum: count keyword only once regardless of repetitions
D) Bonus for repetition: add intensity bonus if keyword appears 2+ times
E) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 8: Empty or Invalid Input Handling
How should the analysis engine handle empty input or very short input (e.g., 1-2 words)?

A) Return error message, don't analyze
B) Return neutral scores (all metrics = 50)
C) Return default mood ("Neutral") with no suggestions
D) Analyze anyway, even if results may be inaccurate
E) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9: Historical Data Aggregation
Charts display historical trends. How should data be aggregated for chart display?

A) Show all entries (no aggregation, may be many data points)
B) Daily aggregation: average all entries per day
C) Weekly aggregation: average all entries per week
D) Adaptive: daily for last 7 days, weekly for older data
E) Other (please describe after [Answer]: tag below)

[Answer]: D

### Question 10: localStorage Data Structure
How should journal entries be structured in localStorage?

A) Single array: all entries in one localStorage key
B) Separate keys: entries by date (e.g., "entries-2026-05-07")
C) Indexed structure: metadata key + individual entry keys
D) Compressed: JSON stringified and compressed to save space
E) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 11: Storage Quota Exceeded Strategy
When localStorage quota is exceeded, what should happen?

A) Delete oldest entries automatically until space available
B) Show error toast, ask user to manually delete entries
C) Compress existing data to free up space
D) Stop saving new entries, show warning
E) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 12: Performance Detection Criteria
How should the app determine if device is "high" or "low" performance?

A) FPS-based: measure FPS, if < 30fps = low performance
B) Memory-based: if device memory < 4GB = low performance
C) Multi-factor: combine FPS, memory, hardware concurrency
D) User preference: let user manually choose performance mode
E) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 13: Animation Reduction Strategy
On low-performance devices, which animations should be reduced?

A) Disable all animations completely
B) Reduce animation duration (e.g., 300ms → 100ms)
C) Disable complex animations only (keep simple transitions)
D) Use CSS prefers-reduced-motion media query
E) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 14: Chart Data Point Limit
To prevent performance issues, should there be a limit on chart data points?

A) No limit, show all historical data
B) Limit to last 30 entries
C) Limit to last 90 days
D) Adaptive: show more points on high-performance devices
E) Other (please describe after [Answer]: tag below)

[Answer]: D

### Question 15: Emotional Distribution Calculation
For the emotional distribution pie chart, how should emotion percentages be calculated?

A) Based on keyword counts: % of positive vs negative vs stress vs motivation keywords
B) Based on scores: normalize the 6 emotional scores to percentages
C) Based on mood history: % of time in each mood state
D) Based on current analysis only: distribute current scores as percentages
E) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Functional Design Execution Plan

Once the above questions are answered, execute the following steps:

### Phase 1: Business Logic Modeling
- [ ] Define sentiment analysis algorithm flow
- [ ] Define keyword matching logic
- [ ] Define negation handling logic
- [ ] Define intensity modifier detection logic
- [ ] Define score calculation formulas
- [ ] Define mood detection algorithm
- [ ] Define suggestion generation rules

### Phase 2: Domain Entities
- [ ] Define AnalysisResult entity structure
- [ ] Define EmotionalScores entity structure
- [ ] Define JournalEntry entity structure
- [ ] Define UserSettings entity structure
- [ ] Define KeywordMatch entity structure
- [ ] Define IntensityMap entity structure
- [ ] Define ChartDataPoint entity structure

### Phase 3: Business Rule
- [ ] Define input validation rules (length, content)
- [ ] Define keyword matching rules
- [ ] Define negation detection rules
- [ ] Define intensity modifier rules
- [ ] Define score calculation rules
- [ ] Define mood detection rules
- [ ] Define suggestion selection rules
- [ ] Define storage quota rules
- [ ] Define performance detection rules

### Phase 4: Data Flow Design
- [ ] Define analysis input → output flow
- [ ] Define storage persistence flow
- [ ] Define chart data transformation flow
- [ ] Define error handling flow
- [ ] Define performance detection flow

### Phase 5: Frontend Component Logic
- [ ] Define JournalInput component behavior
- [ ] Define AnalyzeButton component behavior
- [ ] Define MetricCard component behavior
- [ ] Define Chart component data transformation
- [ ] Define Dashboard component orchestration
- [ ] Define form validation logic
- [ ] Define user interaction flows

### Phase 6: Generate Artifacts
- [ ] Generate `business-logic-model.md` with algorithms and workflows
- [ ] Generate `domain-entities.md` with entity definitions
- [ ] Generate `business-rules.md` with validation and decision rules
- [ ] Generate `frontend-components.md` with component logic and interactions

### Phase 7: Validation
- [ ] Validate completeness (all business logic covered)
- [ ] Validate consistency (no conflicting rules)
- [ ] Validate against requirements
- [ ] Validate against security requirements

---

## Instructions

1. Please answer all 15 questions above by filling in your choice (A, B, C, D, or E) after each `[Answer]:` tag
2. If you choose "Other", please provide a brief description of your preference
3. Once all questions are answered, let me know and I'll proceed with generating the functional design artifacts

---

**Status**: Awaiting user answers
