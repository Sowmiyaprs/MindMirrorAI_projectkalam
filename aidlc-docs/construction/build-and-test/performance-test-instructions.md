# Performance Test Instructions - MindMirror AI

## Overview

Performance tests verify the application meets NFR requirements for speed and responsiveness.

## Performance Targets

- **Analysis Time**: < 500ms
- **Chart Render Time**: < 300ms
- **Animation FPS**: 60fps (high), 30fps (low)
- **Bundle Size**: < 2 MB
- **Initial Load**: < 3 seconds

## Test Tools

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Record performance profile
4. Analyze results

### Lighthouse

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit (Performance, Accessibility, Best Practices)
4. Target scores: 90+ for all categories

## Performance Test Scenarios

### 1. Analysis Performance

**Test**: Measure sentiment analysis time

**Steps**:
1. Open browser console
2. Enter text in journal input
3. Click Analyze
4. Check console for "[PERF] Analysis: XXms"

**Expected**: < 500ms

### 2. Chart Render Performance

**Test**: Measure chart rendering time

**Steps**:
1. Create 30+ journal entries
2. Open Performance tab in DevTools
3. Start recording
4. Trigger chart re-render
5. Stop recording
6. Analyze chart render time

**Expected**: < 300ms

### 3. Animation Performance

**Test**: Measure FPS during animations

**Steps**:
1. Open Performance Monitor in DevTools
2. Trigger animations (analyze, dashboard updates)
3. Monitor FPS counter

**Expected**: 
- High performance: 55-60 FPS
- Low performance: 28-30 FPS

### 4. Bundle Size

**Test**: Verify production bundle size

**Steps**:
1. Run `npm run build`
2. Check `dist/index.html` file size
3. Verify < 2 MB

**Command**:
```bash
# Windows
dir dist\index.html

# Linux/Mac
ls -lh dist/index.html
```

**Expected**: < 2 MB (2,097,152 bytes)

### 5. Initial Load Time

**Test**: Measure time to interactive

**Steps**:
1. Open DevTools Network tab
2. Disable cache
3. Reload page
4. Check "Load" time in Network tab

**Expected**: < 3 seconds

### 6. Memory Usage

**Test**: Monitor memory consumption

**Steps**:
1. Open Performance Monitor
2. Monitor JS Heap Size
3. Create 50+ entries
4. Check for memory leaks

**Expected**: 
- Initial: < 50 MB
- After 50 entries: < 100 MB
- No continuous growth (no leaks)

## Performance Optimization Checklist

- [ ] Code splitting disabled (single bundle)
- [ ] Assets inlined
- [ ] Console.log removed in production
- [ ] Minification enabled
- [ ] Gzip compression (server-side)
- [ ] Lazy loading for heavy components
- [ ] Memoization for expensive calculations
- [ ] Debouncing for frequent operations

## Performance Report Template

```
Test: [Test Name]
Date: [Date]
Device: [Device Specs]
Browser: [Browser + Version]
Result: [Actual Time/Size]
Target: [Target Time/Size]
Status: PASS/FAIL
Notes: [Observations]
```
