# MindMirror AI - Requirements Document

## Intent Analysis Summary

### User Request
Create a production-ready MindMirror AI web application - an emotional intelligence platform that analyzes user feelings in real-time and dynamically updates the entire dashboard with insights, metrics, and suggestions.

### Request Type
**New Project** - Greenfield single-page application

### Scope Estimate
**Single Component** - Self-contained React SPA with no backend dependencies

### Complexity Estimate
**Moderate** - Complex UI with real-time analysis, but simplified by client-only architecture and keyword-based sentiment analysis

---

## Functional Requirements

### FR-1: Core Sentiment Analysis Engine
**Priority**: CRITICAL

The application MUST implement a keyword-based sentiment analysis engine that:
- Analyzes user-entered text for emotional content
- Supports advanced context handling including:
  - Negations (e.g., "not happy", "don't feel good")
  - Intensity modifiers (e.g., "very stressed", "extremely motivated", "slightly anxious")
  - Repeated keyword bonus scoring
- Categorizes keywords into emotion groups:
  - **POSITIVE**: happy, joyful, excited, grateful, peaceful, energetic
  - **NEGATIVE**: sad, angry, frustrated, anxious, worried, lonely
  - **STRESS**: stressed, overwhelmed, pressure, deadline, burnout
  - **MOTIVATION**: motivated, determined, productive, focused, disciplined
  - **CONFIDENCE**: confident, capable, proud, strong

**User Answer**: Advanced with negations, intensity modifiers, and context handling (Q2: B)

### FR-2: Real-Time Emotional Metrics
**Priority**: CRITICAL

The application MUST generate and display six emotional metrics (0-100 scale):
1. Mood Score
2. Stress Score
3. Motivation Score
4. Confidence Score
5. Productivity Score
6. Focus Score

Each metric MUST:
- Display with animated progress bars
- Include neon glow effects
- Transition smoothly when updated
- Be calculated dynamically from sentiment analysis results

### FR-3: Overall Mood Detection
**Priority**: HIGH

The application MUST detect and display an overall mood state from the analysis, including but not limited to:
- Happy
- Motivated
- Overwhelmed
- Stressed
- Calm
- Focused
- Burned Out
- Productive

### FR-4: AI-Generated Suggestions
**Priority**: HIGH

The application MUST generate 3-5 contextual suggestions based on detected emotions, such as:
- Take short breaks
- Prioritize tasks
- Practice breathing exercises
- Celebrate small wins
- Reduce distractions

### FR-5: User Interaction Modes
**Priority**: CRITICAL

The application MUST support BOTH analysis trigger modes with user toggle:
- Manual trigger: User clicks "Analyze" button
- Auto-analyze: Real-time analysis while typing with debounce

**User Answer**: Both options available - user can toggle between manual and auto-analyze (Q1: C)

### FR-6: Data Visualization
**Priority**: HIGH

The application MUST display three types of animated charts using Recharts:
1. **Mood Trend Line Chart**: Shows mood progression over time
2. **Emotional Distribution Pie Chart**: Shows breakdown of emotional states
3. **Productivity/Focus Bar Chart**: Compares productivity and focus metrics

Charts MUST:
- Use real data from localStorage history to show actual trends over time
- Animate smoothly after analysis
- Update dynamically when new analysis is performed

**User Answer**: Use real data from localStorage history to show actual trends over time (Q4: C)

### FR-7: Dashboard Components
**Priority**: HIGH

The application MUST include:
- Futuristic textarea/chatbox for user input
- Animated "Analyze" button with glow effects
- Glowing metric cards displaying scores
- Responsive dashboard layout
- Sidebar navigation
- Header with branding
- Floating chatbot button (decorative)
- Toast notifications for user feedback
- Loading animations during analysis

### FR-8: Mock Data Components
**Priority**: MEDIUM

The application MUST include realistic sample data (not dynamic) for:
- User achievements
- User profile information
- Analytics history (older entries)
- Chatbot memory/conversation history
- Weekly reports
- Calendar entries

**User Answer**: Realistic sample data that looks like real user data (Q10: B)

### FR-9: Data Persistence
**Priority**: HIGH

The application MUST persist in localStorage:
- Complete history of all entries and analyses (unlimited storage)
- User preferences (theme, analysis mode toggle)
- Achievement progress

**User Answer**: Complete history of all entries and analyses (Q3: C)

### FR-10: Error Handling
**Priority**: MEDIUM

The application MUST handle errors gracefully:
- Display toast notifications for user-facing errors
- Handle localStorage quota exceeded scenarios
- Validate user input before analysis
- Provide fallback behavior for failed operations

**User Answer**: Toast notifications for user-facing errors (Q9: B)

---

## Non-Functional Requirements

### NFR-1: Responsive Design
**Priority**: CRITICAL

The application MUST be fully responsive across all device sizes:
- Mobile: 320px and above
- Tablet: 768px and above
- Desktop: 1024px and above

**User Answer**: Full responsive: mobile, tablet, and desktop (320px and above) (Q5: C)

### NFR-2: Browser Compatibility
**Priority**: HIGH

The application MUST support modern browsers:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**User Answer**: Modern browsers only (Q7: A)

### NFR-3: Performance - Animation Optimization
**Priority**: HIGH

The application MUST:
- Detect device performance capabilities
- Reduce animations on slower devices automatically
- Maintain smooth 60fps animations on capable devices
- Use CSS transforms and GPU acceleration where possible

**User Answer**: Detect device performance and reduce animations on slower devices (Q8: B)

### NFR-4: Accessibility
**Priority**: MEDIUM

The application MUST implement basic accessibility:
- Semantic HTML elements
- Keyboard navigation support
- ARIA labels for interactive elements
- Focus indicators
- Sufficient color contrast for text

**User Answer**: Basic accessibility (semantic HTML, keyboard navigation) (Q6: A)

### NFR-5: Offline Capability
**Priority**: CRITICAL

The application MUST:
- Work completely offline (no internet required)
- Use no external API calls
- Bundle all dependencies inline
- Store all data locally

### NFR-6: Build Output
**Priority**: CRITICAL

The application MUST:
- Generate a SINGLE `index.html` file
- Inline ALL CSS and JavaScript
- Include no external file dependencies
- Be deployable via drag-and-drop to Netlify
- Require ZERO setup or configuration

**User Answer**: A single HTML file with all CSS and JS inlined (Q11: A)

### NFR-7: Development vs Production Mode
**Priority**: MEDIUM

The application MUST support:
- Development mode with debugging tools and verbose logging
- Production mode with optimized code and no console logs
- Environment-based switching between modes

**User Answer**: Both modes with environment-based switching (Q12: C)

### NFR-8: Code Quality
**Priority**: HIGH

The application MUST:
- Produce NO build errors
- Produce NO console warnings in production mode
- Follow React best practices
- Use TypeScript or PropTypes for type safety
- Include code comments for complex logic

### NFR-9: Visual Design
**Priority**: HIGH

The application MUST implement a premium futuristic aesthetic:
- **Theme**: Dark futuristic
- **Effects**: Glassmorphism cards, neon glows, smooth animations
- **Colors**:
  - Cyan: #00D9FF
  - Purple: #7B2CBF
  - Pink: #FF006E
  - Background: #0F172A
  - Card: #1E293B
- **Typography**: Gradient headings, modern sans-serif fonts
- **UI Style**: Floating elements, premium SaaS aesthetic

---

## Technical Stack

### Core Technologies
- **React**: 18.2.0
- **Build Tool**: Vite 8.x
- **Styling**: Tailwind CSS 3.3.0
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Storage**: localStorage API

### Architecture
- **Type**: Single-page application (SPA)
- **Backend**: None (client-only)
- **State Management**: React hooks (useState, useEffect, useContext)
- **Routing**: None required (single page)
- **Data Layer**: localStorage with JSON serialization

---

## Security Requirements

### SEC-1: Input Validation (SECURITY-05)
The application MUST validate all user input:
- Enforce maximum text length for journal entries (e.g., 10,000 characters)
- Sanitize input to prevent XSS attacks
- Validate data types before localStorage operations

### SEC-2: Content Security Policy (SECURITY-04)
The application MUST implement HTTP security headers:
- Content-Security-Policy with restrictive policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin

**Note**: Since this is a static HTML file, CSP must be implemented via meta tag.

### SEC-3: Secure Data Storage (SECURITY-01)
The application MUST:
- Store only non-sensitive data in localStorage
- Never store authentication credentials (N/A - no auth system)
- Implement data validation when reading from localStorage
- Handle corrupted localStorage data gracefully

### SEC-4: Error Handling (SECURITY-15)
The application MUST:
- Catch and handle all errors gracefully
- Never expose internal error details to users
- Implement global error boundary in React
- Log errors appropriately in development mode

### SEC-5: Software Supply Chain (SECURITY-10)
The application MUST:
- Use exact dependency versions (lock file)
- Source dependencies from official npm registry only
- Include vulnerability scanning in build process
- Generate Software Bill of Materials (SBOM)

**User Answer**: Yes — enforce all SECURITY rules as blocking constraints (Q13: A)

---

## Testing Requirements

### TEST-1: Property-Based Testing (Partial Enforcement)
The application MUST implement property-based testing for:
- Pure functions in sentiment analysis engine
- Data serialization/deserialization for localStorage
- Score calculation algorithms

**User Answer**: Partial — enforce PBT rules only for pure functions and serialization round-trips (Q14: B)

### TEST-2: Unit Testing
The application SHOULD include unit tests for:
- Sentiment analysis keyword matching
- Score calculation logic
- localStorage utility functions
- React component rendering

### TEST-3: Integration Testing
The application SHOULD include integration tests for:
- End-to-end user flow (input → analyze → display results)
- localStorage persistence and retrieval
- Chart data updates

---

## Constraints

### CONSTRAINT-1: No Backend
The application MUST NOT use any backend services, APIs, or servers.

### CONSTRAINT-2: No Internet Dependency
The application MUST work completely offline after initial load.

### CONSTRAINT-3: Single File Output
The final deliverable MUST be a single `index.html` file with all assets inlined.

### CONSTRAINT-4: Deployment Simplicity
The application MUST be deployable by drag-and-drop to Netlify with zero configuration.

---

## Success Criteria

The MindMirror AI application will be considered successful when:

1. ✅ User can enter feelings/thoughts in a futuristic chatbox
2. ✅ User can toggle between manual and auto-analyze modes
3. ✅ Sentiment analysis generates accurate emotional metrics (0-100 scores)
4. ✅ Dashboard updates dynamically with metrics, mood, suggestions, and charts
5. ✅ Charts display real historical data from localStorage
6. ✅ Application works completely offline
7. ✅ Application is fully responsive (mobile, tablet, desktop)
8. ✅ Animations are smooth and performant
9. ✅ Single `index.html` file can be deployed to Netlify via drag-and-drop
10. ✅ No build errors or console warnings in production mode
11. ✅ All security baseline rules are satisfied
12. ✅ Property-based tests cover pure functions and serialization

---

## Out of Scope

The following are explicitly OUT OF SCOPE for this project:

- ❌ Real backend API integration
- ❌ User authentication/authorization
- ❌ Multi-user support
- ❌ Cloud data synchronization
- ❌ Advanced NLP or machine learning models
- ❌ Mobile native applications
- ❌ Server-side rendering
- ❌ Database integration
- ❌ Third-party API integrations
- ❌ Real-time collaboration features

---

## Extension Configuration

| Extension | Enabled | Rationale |
|---|---|---|
| Security Baseline | Yes | Production-grade application requires security best practices |
| Property-Based Testing | Partial | Pure functions and serialization need PBT; UI components use standard testing |

---

## Appendix: User Answers Summary

| Question | Answer | Choice |
|---|---|---|
| Q1: Primary User Interaction Mode | C | Both manual and auto-analyze with toggle |
| Q2: Sentiment Analysis Complexity | B | Advanced with negations, intensity modifiers, context |
| Q3: Data Persistence Strategy | C | Complete history (unlimited storage) |
| Q4: Chart Data Source | C | Real data from localStorage history |
| Q5: Responsive Design Breakpoints | C | Full responsive (320px+) |
| Q6: Accessibility Requirements | A | Basic accessibility |
| Q7: Browser Support | A | Modern browsers only |
| Q8: Animation Performance | B | Detect performance and reduce on slow devices |
| Q9: Error Handling | B | Toast notifications |
| Q10: Mock Data Realism | B | Realistic sample data |
| Q11: Build Output Format | A | Single HTML file with inlined assets |
| Q12: Development vs Production Mode | C | Both modes with environment switching |
| Q13: Security Extensions | A | Yes - enforce all security rules |
| Q14: Property-Based Testing | B | Partial - pure functions and serialization only |

---

**Document Version**: 1.0  
**Last Updated**: 2026-05-07  
**Status**: Approved
