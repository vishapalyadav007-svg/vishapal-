/**
 * Restaurant Review Sentiment Analysis and Business Logic Utilities
 */

export interface AspectScore {
  score: number; // 0 to 100
  label: string;
  mentionCount: number;
}

export interface ReviewAnalysisResult {
  id?: string;
  text: string;
  sentiment: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'critical';
  overallScore: number; // 0 to 100
  predictedStars: number; // 1 to 5
  confidence: number; // 0 to 100%
  aspects: {
    food: AspectScore;
    service: AspectScore;
    ambiance: AspectScore;
    value: AspectScore;
  };
  highlights: {
    positive: string[];
    critical: string[];
  };
  suggestedAction: string;
  suggestedReply: string;
  timestamp: number;
}

export interface DishPerformance {
  dish: string;
  positiveCount: number;
  negativeCount: number;
  totalMentions: number;
}

export interface ImprovementArea {
  problem: string;
  count: number;
  suggestion: string;
}

export interface TrendPoint {
  dateLabel: string;
  timestamp: number;
  count: number;
  avgStars: number;
}

export interface DashboardAnalytics {
  isEmpty: boolean;
  total: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  avgRating: number;
  trends: TrendPoint[];
  ratingDistribution: {
    stars5: { count: number; pct: number };
    stars4: { count: number; pct: number };
    stars3: { count: number; pct: number };
    stars2: { count: number; pct: number };
    stars1: { count: number; pct: number };
  };
  commonKeywords: {
    positive: Array<{ word: string; count: number }>;
    negative: Array<{ word: string; count: number }>;
  };
  topPositiveFeedback: {
    summary: string;
    sampleReview: string;
    count: number;
  } | null;
  topNegativeFeedback: {
    summary: string;
    sampleReview: string;
    count: number;
  } | null;
  dishPerformance: {
    praised: DishPerformance[];
    complained: DishPerformance[];
  };
  improvementAreas: ImprovementArea[];
}

// Lexicons for restaurant domain
const POSITIVE_WORDS = [
  'delicious', 'tasty', 'amazing', 'excellent', 'fantastic', 'superb',
  'great', 'love', 'loved', 'best', 'fresh', 'friendly', 'attentive',
  'clean', 'cozy', 'quick', 'prompt', 'worth', 'affordable', 'perfection',
  'flavourful', 'flavorful', 'succulent', 'crispy', 'wonderful', 'gem',
  'polite', 'warm', 'satisfying', 'perfect', 'exceptional'
];

const NEGATIVE_WORDS = [
  'terrible', 'awful', 'horrible', 'worst', 'bad', 'disgusting',
  'stale', 'cold', 'raw', 'undercooked', 'overcooked', 'salty',
  'slow', 'rude', 'unfriendly', 'dirty', 'greasy', 'overpriced',
  'expensive', 'waste', 'disappointed', 'disappointing', 'noisy',
  'hair', 'insect', 'smell', 'sick', 'vomit', 'burnt', 'bland',
  'late', 'delay', 'delayed', 'wait', 'unacceptable', 'poor'
];

const KNOWN_DISHES = [
  'pizza', 'pasta', 'burger', 'soup', 'steak', 'salad', 'curry',
  'dessert', 'chicken', 'fish', 'bread', 'fries', 'sushi', 'tacos',
  'noodles', 'rice', 'sandwich', 'biryani', 'cake', 'coffee', 'cocktail', 'wings'
];

const ASPECT_KEYWORDS = {
  food: ['food', 'taste', 'flavor', 'dish', 'meal', 'pasta', 'pizza', 'burger', 'steak', 'salad', 'curry', 'dessert', 'soup', 'portion', 'chicken', 'sauce', 'fish', 'meat', 'bread'],
  service: ['service', 'waiter', 'waitress', 'staff', 'manager', 'server', 'order', 'wait', 'time', 'quick', 'slow', 'polite', 'attitude', 'delivery', 'host'],
  ambiance: ['ambiance', 'ambience', 'atmosphere', 'vibe', 'decor', 'clean', 'dirty', 'music', 'noisy', 'lighting', 'restroom', 'seating', 'cozy', 'place'],
  value: ['price', 'pricing', 'expensive', 'cheap', 'worth', 'value', 'bill', 'charge', 'cost', 'portion', 'overpriced', 'affordable']
};

export function analyzeReview(text: string, timestamp = Date.now()): ReviewAnalysisResult {
  const normalized = text.toLowerCase();
  const words = normalized.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);

  let positiveHits = 0;
  let negativeHits = 0;
  const positiveFound: string[] = [];
  const criticalFound: string[] = [];

  words.forEach((word) => {
    if (POSITIVE_WORDS.includes(word)) {
      positiveHits++;
      if (!positiveFound.includes(word)) positiveFound.push(word);
    }
    if (NEGATIVE_WORDS.includes(word)) {
      negativeHits++;
      if (!criticalFound.includes(word)) criticalFound.push(word);
    }
  });

  // Calculate sentiment score from 0 to 100
  const totalHits = positiveHits + negativeHits;
  let overallScore = 65; // neutral baseline
  if (totalHits > 0) {
    overallScore = Math.round((positiveHits / (positiveHits + negativeHits * 1.3)) * 100);
    overallScore = Math.max(5, Math.min(98, overallScore));
  } else {
    if (normalized.includes('!') && !normalized.includes('not')) {
      overallScore = 70;
    }
  }

  // Derive predicted stars (1 to 5)
  let predictedStars = 3;
  if (overallScore >= 82) predictedStars = 5;
  else if (overallScore >= 65) predictedStars = 4;
  else if (overallScore >= 45) predictedStars = 3;
  else if (overallScore >= 25) predictedStars = 2;
  else predictedStars = 1;

  // Sentiment classification
  let sentiment: ReviewAnalysisResult['sentiment'] = 'neutral';
  if (predictedStars === 5) sentiment = 'very_positive';
  else if (predictedStars === 4) sentiment = 'positive';
  else if (predictedStars === 3) sentiment = 'neutral';
  else if (predictedStars === 2) sentiment = 'negative';
  else sentiment = 'critical';

  // Aspect scoring
  const calculateAspect = (keywords: string[]): AspectScore => {
    let aspectPos = 0;
    let aspectNeg = 0;
    let mentions = 0;

    keywords.forEach((kw) => {
      if (normalized.includes(kw)) {
        mentions++;
      }
    });

    if (mentions === 0) {
      return { score: overallScore, label: 'Unspecified', mentionCount: 0 };
    }

    // Nearby sentiment check
    keywords.forEach((kw) => {
      const idx = normalized.indexOf(kw);
      if (idx !== -1) {
        const snippet = normalized.slice(Math.max(0, idx - 40), Math.min(normalized.length, idx + 40));
        POSITIVE_WORDS.forEach((pw) => { if (snippet.includes(pw)) aspectPos++; });
        NEGATIVE_WORDS.forEach((nw) => { if (snippet.includes(nw)) aspectNeg++; });
      }
    });

    let score = overallScore;
    if (aspectPos + aspectNeg > 0) {
      score = Math.round((aspectPos / (aspectPos + aspectNeg * 1.2)) * 100);
      score = Math.max(10, Math.min(98, score));
    }
    return {
      score,
      label: score >= 75 ? 'Excellent' : score >= 55 ? 'Good' : score >= 35 ? 'Needs Improvement' : 'Poor',
      mentionCount: mentions
    };
  };

  const aspects = {
    food: calculateAspect(ASPECT_KEYWORDS.food),
    service: calculateAspect(ASPECT_KEYWORDS.service),
    ambiance: calculateAspect(ASPECT_KEYWORDS.ambiance),
    value: calculateAspect(ASPECT_KEYWORDS.value)
  };

  // Confidence calculation
  const confidence = Math.min(96, Math.max(68, 60 + Math.min(30, words.length * 2) + Math.min(15, totalHits * 5)));

  // Suggested Actions & Reply Templates
  let suggestedAction = '';
  let suggestedReply = '';

  if (predictedStars >= 4) {
    suggestedAction = 'Send thank-you appreciation and invite them back for a weekend special.';
    suggestedReply = `"Thank you so much for the glowing ${predictedStars}-star review! We're thrilled that you had a wonderful experience at ReviewInsight. Our team looks forward to welcoming you back soon for another delightful meal!"`;
  } else if (predictedStars === 3) {
    suggestedAction = 'Acknowledge average experience, address noted aspect deficiencies, and offer follow-up.';
    suggestedReply = `"Thank you for dining with us and sharing your honest feedback. We are always striving to deliver a 5-star experience, and we have shared your comments with our kitchen and floor team to make improvements. We hope to welcome you again soon!"`;
  } else {
    suggestedAction = 'Urgent: Flag for restaurant manager, investigate kitchen/service incident, and reach out privately to resolve.';
    suggestedReply = `"Dear Guest, we sincerely apologize that your visit did not meet the high standards we set for ourselves. We take your experience very seriously. Please reach out directly to our management team at management@restaurant.com or call us so we can make this right for you."`;
  }

  return {
    id: `rev_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
    text,
    sentiment,
    overallScore,
    predictedStars,
    confidence,
    aspects,
    highlights: {
      positive: positiveFound.slice(0, 5),
      critical: criticalFound.slice(0, 5)
    },
    suggestedAction,
    suggestedReply,
    timestamp
  };
}

export function validateOwnerPassword(candidate: string, expected = '21062006'): boolean {
  if (!candidate || typeof candidate !== 'string') return false;
  return candidate.trim() === expected.trim();
}

/**
 * Calculates connected, mathematically correct dashboard analytics from submitted reviews.
 * Does NOT generate fake data.
 */
export function calculateDashboardAnalytics(
  reviews: ReviewAnalysisResult[],
  dateFilter: 'all' | '7days' | '30days' = 'all'
): DashboardAnalytics {
  const now = Date.now();
  const filtered = reviews.filter((r) => {
    if (dateFilter === '7days') {
      return now - r.timestamp <= 7 * 24 * 60 * 60 * 1000;
    }
    if (dateFilter === '30days') {
      return now - r.timestamp <= 30 * 24 * 60 * 60 * 1000;
    }
    return true;
  });

  const total = filtered.length;
  if (total === 0) {
    return {
      isEmpty: true,
      total: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      positivePct: 0,
      neutralPct: 0,
      negativePct: 0,
      avgRating: 0,
      trends: [],
      ratingDistribution: {
        stars5: { count: 0, pct: 0 },
        stars4: { count: 0, pct: 0 },
        stars3: { count: 0, pct: 0 },
        stars2: { count: 0, pct: 0 },
        stars1: { count: 0, pct: 0 }
      },
      commonKeywords: { positive: [], negative: [] },
      topPositiveFeedback: null,
      topNegativeFeedback: null,
      dishPerformance: { praised: [], complained: [] },
      improvementAreas: []
    };
  }

  // Sentiment counts
  // Positive = 4 or 5 stars; Neutral = 3 stars; Negative = 1 or 2 stars
  let pos = 0, neu = 0, neg = 0;
  let totalStars = 0;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  // Keywords frequencies
  const posKeywordsMap: Record<string, number> = {};
  const negKeywordsMap: Record<string, number> = {};

  // Dish tracking
  const dishMap: Record<string, { positive: number; negative: number }> = {};

  // Improvement areas counter
  const issuesMap = {
    'Slow Service': { count: 0, suggestion: 'Improve order preparation time, expedite kitchen pass-offs, and brief servers on table check-backs.' },
    'Food Temperature': { count: 0, suggestion: 'Enforce warm plate warmers and prompt food runner delivery before dishes cool.' },
    'Food Quality & Salty Taste': { count: 0, suggestion: 'Standardize kitchen sauce seasoning recipes and conduct pre-shift head-chef tastings.' },
    'High Pricing / Small Portions': { count: 0, suggestion: 'Audit side dishes and portion plating so guests perceive generous meal value.' },
    'Noisy Ambiance & Cleanliness': { count: 0, suggestion: 'Check dining music volume levels and establish a 30-minute restroom cleanliness checklist.' },
    'Rude Staff Attitude': { count: 0, suggestion: 'Conduct hospitality refresher training on welcoming guests and addressing customer requests with warmth.' }
  };

  filtered.forEach((r) => {
    totalStars += r.predictedStars;
    if (r.predictedStars >= 4) pos++;
    else if (r.predictedStars === 3) neu++;
    else neg++;

    if (r.predictedStars in ratingCounts) {
      ratingCounts[r.predictedStars as 1 | 2 | 3 | 4 | 5]++;
    }

    // Tally words from highlights
    r.highlights.positive.forEach((word) => {
      posKeywordsMap[word] = (posKeywordsMap[word] || 0) + 1;
    });
    r.highlights.critical.forEach((word) => {
      negKeywordsMap[word] = (negKeywordsMap[word] || 0) + 1;
    });

    const lower = r.text.toLowerCase();

    // Check dishes
    KNOWN_DISHES.forEach((dish) => {
      if (lower.includes(dish)) {
        if (!dishMap[dish]) {
          dishMap[dish] = { positive: 0, negative: 0 };
        }
        if (r.predictedStars >= 4) {
          dishMap[dish].positive++;
        } else if (r.predictedStars <= 2) {
          dishMap[dish].negative++;
        }
      }
    });

    // Check specific improvement issues
    if (lower.includes('slow') || lower.includes('wait') || lower.includes('delay')) {
      issuesMap['Slow Service'].count++;
    }
    if (lower.includes('cold') || lower.includes('temperature')) {
      issuesMap['Food Temperature'].count++;
    }
    if (lower.includes('salty') || lower.includes('bland') || lower.includes('undercooked') || lower.includes('overcooked') || lower.includes('raw')) {
      issuesMap['Food Quality & Salty Taste'].count++;
    }
    if (lower.includes('expensive') || lower.includes('overpriced') || lower.includes('bill') || lower.includes('waste')) {
      issuesMap['High Pricing / Small Portions'].count++;
    }
    if (lower.includes('noisy') || lower.includes('dirty') || lower.includes('restroom') || lower.includes('loud')) {
      issuesMap['Noisy Ambiance & Cleanliness'].count++;
    }
    if (lower.includes('rude') || lower.includes('unfriendly') || lower.includes('attitude')) {
      issuesMap['Rude Staff Attitude'].count++;
    }
  });

  const positivePct = Math.round((pos / total) * 100);
  const neutralPct = Math.round((neu / total) * 100);
  const negativePct = Math.max(0, 100 - positivePct - neutralPct);
  const avgRating = Number((totalStars / total).toFixed(1));

  // Rating distribution with exact percentages
  const ratingDistribution = {
    stars5: { count: ratingCounts[5], pct: Math.round((ratingCounts[5] / total) * 100) },
    stars4: { count: ratingCounts[4], pct: Math.round((ratingCounts[4] / total) * 100) },
    stars3: { count: ratingCounts[3], pct: Math.round((ratingCounts[3] / total) * 100) },
    stars2: { count: ratingCounts[2], pct: Math.round((ratingCounts[2] / total) * 100) },
    stars1: { count: ratingCounts[1], pct: Math.round((ratingCounts[1] / total) * 100) }
  };

  // Keywords sorted by count
  const sortedPosKeywords = Object.entries(posKeywordsMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const sortedNegKeywords = Object.entries(negKeywordsMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Top positive feedback
  let topPositiveFeedback: DashboardAnalytics['topPositiveFeedback'] = null;
  const positiveReviews = filtered.filter((r) => r.predictedStars >= 4);
  if (positiveReviews.length > 0) {
    const topKeywords = sortedPosKeywords.slice(0, 2).map((k) => k.word).join(' and ');
    topPositiveFeedback = {
      summary: topKeywords
        ? `Customers frequently praise the ${topKeywords}.`
        : 'Customers frequently praise overall dining taste and service.',
      sampleReview: positiveReviews[0].text,
      count: positiveReviews.length
    };
  }

  // Top negative feedback
  let topNegativeFeedback: DashboardAnalytics['topNegativeFeedback'] = null;
  const negativeReviews = filtered.filter((r) => r.predictedStars <= 2);
  if (negativeReviews.length > 0) {
    const topNegKeywords = sortedNegKeywords.slice(0, 2).map((k) => k.word).join(' and ');
    topNegativeFeedback = {
      summary: topNegKeywords
        ? `Customers frequently report issues regarding ${topNegKeywords}.`
        : 'Customers frequently report concerns with wait times or food temperature.',
      sampleReview: negativeReviews[0].text,
      count: negativeReviews.length
    };
  }

  // Dish performance
  const praisedDishes: DishPerformance[] = [];
  const complainedDishes: DishPerformance[] = [];

  Object.entries(dishMap).forEach(([dish, stats]) => {
    const totalMentions = stats.positive + stats.negative;
    const capitalized = dish.charAt(0).toUpperCase() + dish.slice(1);
    if (stats.positive > 0) {
      praisedDishes.push({
        dish: capitalized,
        positiveCount: stats.positive,
        negativeCount: stats.negative,
        totalMentions
      });
    }
    if (stats.negative > 0) {
      complainedDishes.push({
        dish: capitalized,
        positiveCount: stats.positive,
        negativeCount: stats.negative,
        totalMentions
      });
    }
  });

  praisedDishes.sort((a, b) => b.positiveCount - a.positiveCount);
  complainedDishes.sort((a, b) => b.negativeCount - a.negativeCount);

  // Top 3 Improvement areas
  const improvementAreas: ImprovementArea[] = Object.entries(issuesMap)
    .filter(([_, data]) => data.count > 0)
    .map(([problem, data]) => ({
      problem,
      count: data.count,
      suggestion: data.suggestion
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Review trends over actual dates
  // Group by date (YYYY-MM-DD or readable Month Day)
  const dateBuckets: Record<string, { count: number; totalStars: number; timestamp: number }> = {};
  filtered.forEach((r) => {
    const d = new Date(r.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!dateBuckets[key]) {
      dateBuckets[key] = { count: 0, totalStars: 0, timestamp: r.timestamp };
    }
    dateBuckets[key].count++;
    dateBuckets[key].totalStars += r.predictedStars;
  });

  const trends: TrendPoint[] = Object.keys(dateBuckets)
    .sort()
    .map((key) => {
      const bucket = dateBuckets[key];
      const d = new Date(key);
      const label = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      return {
        dateLabel: label,
        timestamp: bucket.timestamp,
        count: bucket.count,
        avgStars: Number((bucket.totalStars / bucket.count).toFixed(1))
      };
    });

  return {
    isEmpty: false,
    total,
    positiveCount: pos,
    neutralCount: neu,
    negativeCount: neg,
    positivePct,
    neutralPct,
    negativePct,
    avgRating,
    trends,
    ratingDistribution,
    commonKeywords: {
      positive: sortedPosKeywords,
      negative: sortedNegKeywords
    },
    topPositiveFeedback,
    topNegativeFeedback,
    dishPerformance: {
      praised: praisedDishes,
      complained: complainedDishes
    },
    improvementAreas
  };
}
