/**
 * SentimentAnalysisService
 * 
 * Implements advanced keyword-based sentiment analysis with:
 * - Keyword matching with variations
 * - Negation handling (including double negations)
 * - Intensity modifier detection
 * - Category-specific scoring with diminishing returns
 * - Priority-based mood detection
 * - Score-based suggestion generation
 */

// Emotion keyword dictionaries
const EMOTION_KEYWORDS = {
  POSITIVE: {
    base: ['happy', 'joyful', 'excited', 'grateful', 'peaceful', 'energetic', 'content', 'satisfied', 'pleased', 'delighted'],
    variations: {
      happy: ['happiness', 'happier', 'happiest'],
      joyful: ['joy', 'joyfully'],
      excited: ['excitement', 'exciting'],
      grateful: ['gratitude', 'thankful'],
      peaceful: ['peace', 'calm', 'serene'],
      energetic: ['energy', 'energized'],
    },
  },
  NEGATIVE: {
    base: ['sad', 'angry', 'frustrated', 'anxious', 'worried', 'lonely', 'depressed', 'upset', 'disappointed', 'miserable'],
    variations: {
      sad: ['sadness', 'unhappy'],
      angry: ['anger', 'mad', 'furious'],
      frustrated: ['frustration', 'annoyed'],
      anxious: ['anxiety', 'nervous'],
      worried: ['worry', 'concern', 'concerned'],
      lonely: ['alone', 'isolated'],
    },
  },
  STRESS: {
    base: ['stressed', 'overwhelmed', 'pressure', 'deadline', 'burnout', 'exhausted', 'tense', 'strained'],
    variations: {
      stressed: ['stress', 'stressful'],
      overwhelmed: ['overwhelming'],
      pressure: ['pressured'],
      deadline: ['deadlines'],
      burnout: ['burned out', 'burnt out'],
    },
  },
  MOTIVATION: {
    base: ['motivated', 'determined', 'productive', 'focused', 'disciplined', 'driven', 'ambitious', 'inspired'],
    variations: {
      motivated: ['motivation', 'motivating'],
      determined: ['determination'],
      productive: ['productivity', 'producing'],
      focused: ['focus', 'concentration'],
      disciplined: ['discipline'],
    },
  },
  CONFIDENCE: {
    base: ['confident', 'capable', 'proud', 'strong', 'assured', 'empowered', 'bold'],
    variations: {
      confident: ['confidence', 'self-assured'],
      capable: ['ability', 'able'],
      proud: ['pride'],
      strong: ['strength', 'powerful'],
    },
  },
};

// Negation words
const NEGATION_WORDS = [
  'not', 'no', 'never', "don't", "can't", "won't", "shouldn't", "couldn't",
  'hardly', 'barely', 'scarcely', 'no longer', 'neither', 'nor', "isn't", "aren't", "wasn't", "weren't"
];

// Intensity modifiers
const INTENSITY_MODIFIERS = {
  HIGH: {
    words: ['very', 'extremely', 'incredibly', 'really', 'super', 'highly'],
    multiplier: 1.5,
  },
  EXTREME: {
    words: ['absolutely', 'completely', 'totally', 'utterly'],
    multiplier: 2.0,
  },
  LOW: {
    words: ['slightly', 'somewhat', 'a bit', 'a little', 'kind of', 'sort of'],
    multiplier: 0.5,
  },
};

class SentimentAnalysisService {
  /**
   * Main analysis function
   * @param {string} text - User input text
   * @returns {Object} Analysis result with scores, mood, and suggestions
   */
  static analyze(text) {
    // Step 1: Validate input
    const validation = this.validateInput(text);
    if (!validation.valid) {
      return {
        error: validation.error,
        timestamp: Date.now(),
      };
    }

    // Step 2: Preprocess text
    const preprocessed = this.preprocessText(validation.sanitized);

    // Step 3: Match keywords
    const keywordMatches = this.matchKeywords(preprocessed);

    // Step 4: Handle negations
    const adjustedMatches = this.handleNegations(preprocessed, keywordMatches);

    // Step 5: Detect intensity modifiers
    const intensityMap = this.detectIntensityModifiers(preprocessed, adjustedMatches);

    // Step 6: Calculate emotional scores
    const scores = this.calculateScores(adjustedMatches, intensityMap);

    // Step 7: Detect overall mood
    const mood = this.detectMood(scores);

    // Step 8: Generate suggestions
    const suggestions = this.generateSuggestions(scores);

    // Step 9: Create analysis result
    return {
      text: validation.sanitized,
      scores,
      mood,
      suggestions,
      timestamp: Date.now(),
      keywordCount: Object.values(adjustedMatches).flat().length,
    };
  }

  /**
   * Validate and sanitize input
   */
  static validateInput(text) {
    if (!text || text.trim().length === 0) {
      return { valid: false, error: 'Please enter your thoughts' };
    }

    const trimmed = text.trim();

    if (trimmed.length < 3) {
      return { valid: false, error: 'Input too short (minimum 3 characters)' };
    }

    if (trimmed.length > 10000) {
      return { valid: false, error: 'Input too long (maximum 10,000 characters)' };
    }

    // Sanitize input (remove HTML tags, escape special characters)
    const sanitized = this.sanitizeInput(trimmed);

    return { valid: true, sanitized };
  }

  /**
   * Sanitize input to prevent XSS
   */
  static sanitizeInput(text) {
    // Remove HTML tags
    let sanitized = text.replace(/<[^>]*>/g, '');
    
    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ');
    
    return sanitized.trim();
  }

  /**
   * Preprocess text for analysis
   */
  static preprocessText(text) {
    const lowercase = text.toLowerCase();
    const words = lowercase.split(/\s+/);
    return { original: text, lowercase, words };
  }

  /**
   * Match keywords in text
   */
  static matchKeywords(preprocessed) {
    const matches = {
      POSITIVE: [],
      NEGATIVE: [],
      STRESS: [],
      MOTIVATION: [],
      CONFIDENCE: [],
    };

    const { words } = preprocessed;

    words.forEach((word, index) => {
      // Check each category
      Object.keys(EMOTION_KEYWORDS).forEach(category => {
        const { base, variations } = EMOTION_KEYWORDS[category];

        // Check base keywords
        if (base.includes(word)) {
          matches[category].push({ word, index, base: word });
          return;
        }

        // Check variations
        Object.entries(variations).forEach(([baseWord, vars]) => {
          if (vars.includes(word)) {
            matches[category].push({ word, index, base: baseWord });
          }
        });
      });
    });

    return matches;
  }

  /**
   * Handle negations (including double negations)
   */
  static handleNegations(preprocessed, keywordMatches) {
    const { words } = preprocessed;
    const adjusted = JSON.parse(JSON.stringify(keywordMatches)); // Deep clone

    Object.keys(adjusted).forEach(category => {
      adjusted[category] = adjusted[category].map(match => {
        const { index } = match;
        
        // Check 3 words before keyword for negations
        const negationCount = [index - 1, index - 2, index - 3]
          .filter(i => i >= 0)
          .filter(i => NEGATION_WORDS.includes(words[i]))
          .length;

        // Double negation cancels out
        if (negationCount === 2) {
          return { ...match, negated: false };
        }

        // Single negation inverts sentiment
        if (negationCount === 1) {
          return { ...match, negated: true };
        }

        return { ...match, negated: false };
      });
    });

    // Invert POSITIVE <-> NEGATIVE for negated keywords
    const invertedPositive = adjusted.POSITIVE.filter(m => m.negated).map(m => ({ ...m, inverted: true }));
    const invertedNegative = adjusted.NEGATIVE.filter(m => m.negated).map(m => ({ ...m, inverted: true }));

    adjusted.POSITIVE = [...adjusted.POSITIVE.filter(m => !m.negated), ...invertedNegative];
    adjusted.NEGATIVE = [...adjusted.NEGATIVE.filter(m => !m.negated), ...invertedPositive];

    // Reduce scores for negated STRESS, MOTIVATION, CONFIDENCE by 50%
    ['STRESS', 'MOTIVATION', 'CONFIDENCE'].forEach(category => {
      adjusted[category] = adjusted[category].map(m => ({
        ...m,
        scoreMultiplier: m.negated ? 0.5 : 1.0,
      }));
    });

    return adjusted;
  }

  /**
   * Detect intensity modifiers
   */
  static detectIntensityModifiers(preprocessed, keywordMatches) {
    const { words } = preprocessed;
    const intensityMap = {};

    Object.keys(keywordMatches).forEach(category => {
      keywordMatches[category].forEach(match => {
        const { index, word } = match;
        
        // Check 2 words before keyword
        const modifiers = [index - 1, index - 2]
          .filter(i => i >= 0)
          .map(i => words[i])
          .map(w => {
            if (INTENSITY_MODIFIERS.HIGH.words.includes(w)) return INTENSITY_MODIFIERS.HIGH.multiplier;
            if (INTENSITY_MODIFIERS.EXTREME.words.includes(w)) return INTENSITY_MODIFIERS.EXTREME.multiplier;
            if (INTENSITY_MODIFIERS.LOW.words.includes(w)) return INTENSITY_MODIFIERS.LOW.multiplier;
            return 1.0;
          });

        // Use strongest modifier
        const multiplier = Math.max(...modifiers, 1.0);
        intensityMap[`${category}-${index}`] = multiplier;
      });
    });

    return intensityMap;
  }

  /**
   * Calculate emotional scores with diminishing returns
   */
  static calculateScores(keywordMatches, intensityMap) {
    const baseScore = 10;
    const diminishingReturns = [1.0, 0.7, 0.5, 0.3]; // 1st, 2nd, 3rd, 4th+ occurrences

    // Count keyword occurrences
    const keywordCounts = {};
    Object.keys(keywordMatches).forEach(category => {
      keywordMatches[category].forEach(match => {
        const key = `${category}-${match.base}`;
        keywordCounts[key] = (keywordCounts[key] || 0) + 1;
      });
    });

    // Calculate raw scores for each category
    const rawScores = {
      POSITIVE: 0,
      NEGATIVE: 0,
      STRESS: 0,
      MOTIVATION: 0,
      CONFIDENCE: 0,
    };

    Object.keys(keywordMatches).forEach(category => {
      const occurrenceTracker = {};

      keywordMatches[category].forEach(match => {
        const { base, index, scoreMultiplier = 1.0 } = match;
        const key = `${category}-${base}`;
        
        // Track occurrence for diminishing returns
        occurrenceTracker[key] = (occurrenceTracker[key] || 0) + 1;
        const occurrenceIndex = Math.min(occurrenceTracker[key] - 1, 3);
        const diminishingFactor = diminishingReturns[occurrenceIndex];

        // Get intensity multiplier
        const intensityMultiplier = intensityMap[`${category}-${index}`] || 1.0;

        // Calculate score
        const score = baseScore * diminishingFactor * intensityMultiplier * scoreMultiplier;
        rawScores[category] += score;
      });
    });

    // Calculate final scores (0-100 scale)
    const mood = this.normalizeScore((rawScores.POSITIVE - rawScores.NEGATIVE) + 50, 0, 100);
    const stress = this.normalizeScore(rawScores.STRESS + (rawScores.NEGATIVE * 0.3), 0, 100);
    const motivation = this.normalizeScore(rawScores.MOTIVATION + (rawScores.POSITIVE * 0.2), 0, 100);
    const confidence = this.normalizeScore(rawScores.CONFIDENCE + (rawScores.POSITIVE * 0.3), 0, 100);
    const productivity = this.normalizeScore((rawScores.MOTIVATION * 0.6) + (rawScores.CONFIDENCE * 0.4), 0, 100);
    const focus = this.normalizeScore((rawScores.MOTIVATION * 0.5) - (rawScores.STRESS * 0.3) + 50, 0, 100);

    return {
      mood: Math.round(mood),
      stress: Math.round(stress),
      motivation: Math.round(motivation),
      confidence: Math.round(confidence),
      productivity: Math.round(productivity),
      focus: Math.round(focus),
    };
  }

  /**
   * Normalize score to range
   */
  static normalizeScore(score, min, max) {
    return Math.max(min, Math.min(max, score));
  }

  /**
   * Detect overall mood based on combination rules
   */
  static detectMood(scores) {
    const { mood, stress, motivation, confidence, focus } = scores;

    // Priority 1: High Stress Override
    if (stress > 70 && motivation < 50) return 'Overwhelmed';
    if (stress > 70) return 'Stressed';

    // Priority 2: Burnout Detection
    if (stress > 60 && motivation < 30 && mood < 40) return 'Burned Out';

    // Priority 3: Productive States
    if (motivation > 70 && stress < 50) return 'Productive';
    if (motivation > 70 && focus > 60) return 'Focused';

    // Priority 4: Positive States
    if (mood > 70 && stress < 40) return 'Happy';
    if (confidence > 70 && motivation > 60) return 'Motivated';

    // Priority 5: Calm States
    if (mood > 60 && stress < 30 && motivation < 60) return 'Calm';

    // Priority 6: Default
    if (mood > 50) return 'Content';
    if (mood < 40) return 'Down';
    return 'Neutral';
  }

  /**
   * Generate suggestions based on scores
   */
  static generateSuggestions(scores) {
    const { stress, motivation, confidence, productivity } = scores;
    const suggestions = [];

    const STRESS_REDUCTION = [
      'Take short breaks every hour',
      'Practice deep breathing exercises',
      'Prioritize your most important tasks',
      'Delegate tasks when possible',
      'Set realistic deadlines',
    ];

    const MOTIVATION_BOOST = [
      'Set small, achievable goals',
      'Celebrate your progress',
      'Break large tasks into smaller steps',
      'Reward yourself for completing tasks',
      'Visualize your success',
    ];

    const CONFIDENCE_BUILDING = [
      'Reflect on past successes',
      'Practice positive self-talk',
      'Focus on your strengths',
      'Seek feedback from others',
      'Take on small challenges',
    ];

    const PRODUCTIVITY_TIPS = [
      'Use the Pomodoro technique',
      'Eliminate distractions',
      'Create a focused work environment',
      'Time-block your schedule',
      'Start with your hardest task',
    ];

    const WELLNESS_GENERAL = [
      'Get adequate sleep',
      'Stay hydrated',
      'Take a short walk',
      'Connect with friends or family',
      'Practice mindfulness',
    ];

    // Selection logic
    if (stress > 60) {
      suggestions.push(...this.randomSelect(STRESS_REDUCTION, 2));
    }

    if (motivation < 40) {
      suggestions.push(...this.randomSelect(MOTIVATION_BOOST, 2));
    }

    if (confidence < 40) {
      suggestions.push(...this.randomSelect(CONFIDENCE_BUILDING, 1));
    }

    if (productivity < 50 && motivation > 50) {
      suggestions.push(...this.randomSelect(PRODUCTIVITY_TIPS, 1));
    }

    // Fill to 3-5 suggestions
    while (suggestions.length < 3) {
      const remaining = WELLNESS_GENERAL.filter(s => !suggestions.includes(s));
      if (remaining.length === 0) break;
      suggestions.push(...this.randomSelect(remaining, 1));
    }

    // Limit to 5 suggestions
    return suggestions.slice(0, 5);
  }

  /**
   * Randomly select N items from array
   */
  static randomSelect(array, count) {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}

export default SentimentAnalysisService;
