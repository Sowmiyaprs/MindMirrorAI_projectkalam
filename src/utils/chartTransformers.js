/**
 * Chart Data Transformers
 * 
 * Transform journal entries into chart-ready data:
 * - Adaptive aggregation (daily/weekly/monthly)
 * - Data point limiting based on performance
 * - Emotional distribution calculation
 */

/**
 * Transform entries for mood trend chart
 */
export function transformForMoodTrend(entries, performanceMode = 'high') {
  if (!entries || entries.length === 0) return [];

  // Sort by timestamp
  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);

  // Determine aggregation strategy
  const aggregated = aggregateByTimeRange(sorted);

  // Limit data points based on performance
  const maxPoints = performanceMode === 'high' ? 90 : 30;
  const limited = limitDataPoints(aggregated, maxPoints);

  // Format for Recharts
  return limited.map(entry => ({
    date: formatDate(entry.timestamp),
    mood: entry.analysis.scores.mood,
    stress: entry.analysis.scores.stress,
    motivation: entry.analysis.scores.motivation,
  }));
}

/**
 * Transform entries for emotional distribution chart
 */
export function transformForEmotionalDistribution(currentAnalysis) {
  if (!currentAnalysis || !currentAnalysis.scores) {
    return [];
  }

  const { scores } = currentAnalysis;

  // Calculate distribution from current scores
  const total = scores.mood + scores.stress + scores.motivation + scores.confidence + scores.productivity + scores.focus;

  return [
    {
      name: 'Positive',
      value: Math.round(((scores.mood + scores.confidence) / 2 / total) * 100),
      color: '#00D9FF',
    },
    {
      name: 'Stress',
      value: Math.round((scores.stress / total) * 100),
      color: '#FF006E',
    },
    {
      name: 'Motivation',
      value: Math.round(((scores.motivation + scores.productivity) / 2 / total) * 100),
      color: '#7B2CBF',
    },
    {
      name: 'Focus',
      value: Math.round((scores.focus / total) * 100),
      color: '#00FF88',
    },
  ];
}

/**
 * Transform entries for productivity/focus chart
 */
export function transformForProductivityFocus(entries, performanceMode = 'high') {
  if (!entries || entries.length === 0) return [];

  // Sort by timestamp
  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);

  // Aggregate by time range
  const aggregated = aggregateByTimeRange(sorted);

  // Limit data points
  const maxPoints = performanceMode === 'high' ? 90 : 30;
  const limited = limitDataPoints(aggregated, maxPoints);

  // Format for Recharts
  return limited.map(entry => ({
    date: formatDate(entry.timestamp),
    productivity: entry.analysis.scores.productivity,
    focus: entry.analysis.scores.focus,
  }));
}

/**
 * Aggregate entries by time range (adaptive)
 */
function aggregateByTimeRange(entries) {
  if (entries.length === 0) return [];

  const now = Date.now();
  const oldestTimestamp = entries[0].timestamp;
  const spanDays = (now - oldestTimestamp) / (24 * 60 * 60 * 1000);

  // Determine aggregation strategy
  if (spanDays <= 7) {
    // Daily aggregation for last 7 days
    return aggregateByDay(entries);
  } else if (spanDays <= 30) {
    // Daily for last 7 days, weekly for older
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const recent = entries.filter(e => e.timestamp >= sevenDaysAgo);
    const older = entries.filter(e => e.timestamp < sevenDaysAgo);
    
    return [
      ...aggregateByWeek(older),
      ...aggregateByDay(recent),
    ];
  } else {
    // Daily for last 7 days, weekly for 8-30 days, monthly for older
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    const recent = entries.filter(e => e.timestamp >= sevenDaysAgo);
    const medium = entries.filter(e => e.timestamp >= thirtyDaysAgo && e.timestamp < sevenDaysAgo);
    const older = entries.filter(e => e.timestamp < thirtyDaysAgo);
    
    return [
      ...aggregateByMonth(older),
      ...aggregateByWeek(medium),
      ...aggregateByDay(recent),
    ];
  }
}

/**
 * Aggregate entries by day
 */
function aggregateByDay(entries) {
  const grouped = {};

  entries.forEach(entry => {
    const date = new Date(entry.timestamp);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(entry);
  });

  return Object.keys(grouped).map(key => {
    const dayEntries = grouped[key];
    return averageEntries(dayEntries);
  });
}

/**
 * Aggregate entries by week
 */
function aggregateByWeek(entries) {
  const grouped = {};

  entries.forEach(entry => {
    const date = new Date(entry.timestamp);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const key = weekStart.toISOString().split('T')[0];

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(entry);
  });

  return Object.keys(grouped).map(key => {
    const weekEntries = grouped[key];
    return averageEntries(weekEntries);
  });
}

/**
 * Aggregate entries by month
 */
function aggregateByMonth(entries) {
  const grouped = {};

  entries.forEach(entry => {
    const date = new Date(entry.timestamp);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(entry);
  });

  return Object.keys(grouped).map(key => {
    const monthEntries = grouped[key];
    return averageEntries(monthEntries);
  });
}

/**
 * Average multiple entries into one
 */
function averageEntries(entries) {
  const scores = {
    mood: 0,
    stress: 0,
    motivation: 0,
    confidence: 0,
    productivity: 0,
    focus: 0,
  };

  entries.forEach(entry => {
    Object.keys(scores).forEach(key => {
      scores[key] += entry.analysis.scores[key];
    });
  });

  Object.keys(scores).forEach(key => {
    scores[key] = Math.round(scores[key] / entries.length);
  });

  return {
    timestamp: entries[entries.length - 1].timestamp, // Use latest timestamp
    analysis: {
      scores,
      mood: entries[entries.length - 1].analysis.mood, // Use latest mood
    },
  };
}

/**
 * Limit data points to max count
 */
function limitDataPoints(entries, maxPoints) {
  if (entries.length <= maxPoints) {
    return entries;
  }

  // Sample evenly
  const step = entries.length / maxPoints;
  const limited = [];

  for (let i = 0; i < maxPoints; i++) {
    const index = Math.floor(i * step);
    limited.push(entries[index]);
  }

  return limited;
}

/**
 * Format date for display
 */
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
}

/**
 * Get date range label
 */
export function getDateRangeLabel(entries) {
  if (!entries || entries.length === 0) return 'No data';

  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  const oldest = new Date(sorted[0].timestamp);
  const newest = new Date(sorted[sorted.length - 1].timestamp);

  return `${oldest.toLocaleDateString()} - ${newest.toLocaleDateString()}`;
}
