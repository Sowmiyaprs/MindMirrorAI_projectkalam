# Unit Test Instructions - MindMirror AI

## Overview

Unit tests verify individual components, services, and utilities work correctly in isolation.

## Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test -- --coverage
```

## Test Structure

Tests are located in `__tests__` directories:
- `src/services/__tests__/` - Service tests
- `src/utils/__tests__/` - Utility tests
- `src/hooks/__tests__/` - Hook tests
- `src/components/__tests__/` - Component tests

## Key Test Cases

### SentimentAnalysisService
- Keyword matching accuracy
- Negation handling
- Intensity modifiers
- Score calculation
- Mood detection
- Suggestion generation

### StorageService
- Save/load entries
- Quota management
- Export functionality
- Data integrity

### HybridCache
- LRU eviction
- TTL expiration
- Cache hit/miss rates

### InputSanitizer
- XSS prevention
- HTML tag removal
- Special character escaping

## Test Coverage Goals

- Services: 80%+
- Utils: 80%+
- Hooks: 70%+
- Components: 60%+

## Manual Testing Required

- Browser compatibility
- Mobile responsiveness
- Accessibility
- Performance on low-end devices
