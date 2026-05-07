# Integration Test Instructions - MindMirror AI

## Overview

Integration tests verify that multiple components work together correctly.

## Test Scenarios

### 1. End-to-End User Flow

**Test**: Complete journal entry and analysis flow

**Steps**:
1. Open application
2. Enter text in journal input: "I feel stressed but motivated"
3. Click Analyze (or wait for auto-analyze)
4. Verify analysis results appear
5. Verify dashboard updates with metrics
6. Verify charts display data
7. Verify suggestions are generated

**Expected Results**:
- Analysis completes in < 500ms
- All 6 metrics display (0-100 range)
- Overall mood detected correctly
- 3-5 suggestions generated
- Charts render in < 300ms
- No console errors

### 2. Data Persistence Flow

**Test**: Save and reload entries

**Steps**:
1. Create 3 journal entries
2. Refresh browser
3. Verify entries persist
4. Verify latest analysis displays

**Expected Results**:
- All entries saved to localStorage
- Data survives page reload
- No data loss

### 3. Performance Mode Detection

**Test**: Adaptive performance

**Steps**:
1. Open application
2. Check performance mode detected
3. Verify animations adapt to mode
4. Verify chart data points adapt

**Expected Results**:
- Performance mode auto-detected
- High mode: 60fps animations, 90 data points
- Low mode: 30fps animations, 30 data points

### 4. Error Handling Flow

**Test**: Error boundaries and recovery

**Steps**:
1. Trigger validation error (empty input)
2. Verify error toast appears
3. Trigger storage quota error (fill localStorage)
4. Verify auto-cleanup occurs

**Expected Results**:
- Errors caught gracefully
- User-friendly error messages
- Auto-recovery when possible

### 5. Export Data Flow

**Test**: Data export functionality

**Steps**:
1. Create 5 journal entries
2. Click Export JSON
3. Verify file downloads
4. Click Export CSV
5. Verify file downloads

**Expected Results**:
- JSON file contains all entries
- CSV file properly formatted
- No data corruption

## Running Integration Tests

```bash
# Manual testing required
# Follow test scenarios above
# Document results in test report
```

## Test Report Template

```
Test: [Test Name]
Date: [Date]
Tester: [Name]
Browser: [Browser + Version]
Result: PASS/FAIL
Notes: [Any observations]
```
