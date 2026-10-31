import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeReview, validateOwnerPassword, calculateDashboardAnalytics } from './sentiment';

test('validateOwnerPassword correctly matches demo password 21062006', () => {
  assert.equal(validateOwnerPassword('21062006'), true);
  assert.equal(validateOwnerPassword(' 21062006 '), true);
  assert.equal(validateOwnerPassword('wrongpass'), false);
  assert.equal(validateOwnerPassword(''), false);
});

test('analyzeReview accurately rates positive dining review', () => {
  const result = analyzeReview('The pasta was absolutely delicious, fresh and amazing! Quick friendly service.');
  assert.ok(result.overallScore >= 70, `Score was ${result.overallScore}`);
  assert.ok(result.predictedStars >= 4, `Stars were ${result.predictedStars}`);
  assert.equal(result.sentiment === 'very_positive' || result.sentiment === 'positive', true);
  assert.ok(result.highlights.positive.length > 0);
  assert.ok(result.suggestedReply.includes('Thank you'));
});

test('analyzeReview accurately rates negative complaint review', () => {
  const result = analyzeReview('Terrible experience. The soup was cold, salty and awful. Waiter was extremely rude.');
  assert.ok(result.overallScore <= 35, `Score was ${result.overallScore}`);
  assert.ok(result.predictedStars <= 2, `Stars were ${result.predictedStars}`);
  assert.equal(result.sentiment === 'negative' || result.sentiment === 'critical', true);
  assert.ok(result.highlights.critical.length > 0);
  assert.ok(result.suggestedAction.includes('Urgent'));
});

test('calculateDashboardAnalytics returns empty state when no reviews exist', () => {
  const analytics = calculateDashboardAnalytics([]);
  assert.equal(analytics.isEmpty, true);
  assert.equal(analytics.total, 0);
  assert.equal(analytics.positiveCount, 0);
  assert.equal(analytics.avgRating, 0);
});

test('calculateDashboardAnalytics accurately calculates totals, percentages, dishes and improvement areas', () => {
  const reviews = [
    analyzeReview('Delicious pizza and great friendly staff! Loved it.'),
    analyzeReview('Amazing fresh pasta, best pasta in town! Quick service.'),
    analyzeReview('Average burger, tasty meat but slow service and wait.'),
    analyzeReview('Terrible cold soup, salty and rude waiter. Overpriced waste of money!')
  ];

  const analytics = calculateDashboardAnalytics(reviews);
  assert.equal(analytics.isEmpty, false);
  assert.equal(analytics.total, 4);
  assert.equal(analytics.positiveCount + analytics.neutralCount + analytics.negativeCount, analytics.total);
  assert.equal(analytics.positivePct + analytics.neutralPct + analytics.negativePct, 100);

  // Dishes identified
  const praisedDishes = analytics.dishPerformance.praised.map(d => d.dish);
  assert.ok(praisedDishes.includes('Pizza') || praisedDishes.includes('Pasta'));

  // Improvement areas identified
  assert.ok(analytics.improvementAreas.length > 0);
  const problemNames = analytics.improvementAreas.map(i => i.problem);
  assert.ok(problemNames.includes('Slow Service') || problemNames.includes('Food Temperature'));
});
