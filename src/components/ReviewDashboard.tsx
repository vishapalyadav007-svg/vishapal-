import React, { useState } from 'react';
import { ReviewAnalysisResult, calculateDashboardAnalytics } from '../utils/sentiment.ts';

interface ReviewDashboardProps {
  history: ReviewAnalysisResult[];
  onScrollToAnalyzer: () => void;
}

export const ReviewDashboard: React.FC<ReviewDashboardProps> = ({
  history,
  onScrollToAnalyzer
}) => {
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days'>('all');

  const analytics = calculateDashboardAnalytics(history, dateFilter);

  // If empty, display the requested empty state
  if (analytics.isEmpty) {
    return (
      <section className="section soft" id="dashboard">
        <div className="container">
          <div className="heading">
            <p className="eyebrow">Restaurant Analytics</p>
            <h2>Review Analytics Dashboard</h2>
            <p>Understand your customers' feedback at a glance.</p>
          </div>

          <div
            className="card"
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              maxWidth: '680px',
              margin: 'auto',
              background: '#ffffff'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#eaf2ff',
                color: 'var(--blue)',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1.8rem',
                margin: '0 auto 18px'
              }}
            >
              📊
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.4rem', color: 'var(--ink)' }}>
              No customer reviews available yet.
            </h3>
            <p style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '0.94rem', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
              Submit and analyze customer dining feedback in the Review Analyzer above to automatically generate real-time metrics, sentiment trends, dish ratings, and operational suggestions.
            </p>
            <button
              className="button primary"
              type="button"
              id="analyze-first-review-btn"
              onClick={onScrollToAnalyzer}
            >
              Analyze Your First Review ↓
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Max count for rating distribution bar scaling
  const maxRatingCount = Math.max(
    analytics.ratingDistribution.stars5.count,
    analytics.ratingDistribution.stars4.count,
    analytics.ratingDistribution.stars3.count,
    analytics.ratingDistribution.stars2.count,
    analytics.ratingDistribution.stars1.count,
    1
  );

  return (
    <section className="section soft" id="dashboard">
      <div className="container">
        {/* Header & Date Filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '26px' }}>
          <div className="heading" style={{ margin: 0 }}>
            <p className="eyebrow">Restaurant Analytics</p>
            <h2 style={{ marginBottom: '6px' }}>Review Analytics Dashboard</h2>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '1.02rem' }}>
              Understand your customers' feedback at a glance.
            </p>
          </div>

          {/* Date Filter Pills */}
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              borderRadius: '12px',
              background: '#e2ebfa',
              gap: '4px'
            }}
            role="group"
            aria-label="Filter reviews by date"
          >
            {(['all', '7days', '30days'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setDateFilter(filter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9px',
                  border: 'none',
                  background: dateFilter === filter ? '#ffffff' : 'transparent',
                  color: dateFilter === filter ? 'var(--blue)' : '#4a6288',
                  fontWeight: dateFilter === filter ? 800 : 650,
                  fontSize: '0.82rem',
                  boxShadow: dateFilter === filter ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.18s'
                }}
              >
                {filter === 'all' ? 'All Time' : filter === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* 1. FIRST ROW: 5 SUMMARY CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            marginBottom: '24px'
          }}
        >
          {/* Card 1: Total Reviews */}
          <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--blue)' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Reviews
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--ink)', margin: '4px 0' }}>
              {analytics.total}
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>
              Analyzed from customer submissions
            </p>
          </div>

          {/* Card 2: Positive Reviews */}
          <div className="card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0d6852', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Positive Reviews
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#10b981', margin: '4px 0' }}>
              {analytics.positiveCount}
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>
              <b>{analytics.positivePct}%</b> of all diner feedback (4★ &amp; 5★)
            </p>
          </div>

          {/* Card 3: Neutral Reviews */}
          <div className="card" style={{ padding: '20px', borderLeft: '4px solid #64748b' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Neutral Reviews
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#64748b', margin: '4px 0' }}>
              {analytics.neutralCount}
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>
              <b>{analytics.neutralPct}%</b> mixed or average (3★)
            </p>
          </div>

          {/* Card 4: Negative Reviews */}
          <div className="card" style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Negative Reviews
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ef4444', margin: '4px 0' }}>
              {analytics.negativeCount}
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>
              <b>{analytics.negativePct}%</b> critical complaints (1★ &amp; 2★)
            </p>
          </div>

          {/* Card 5: Average Customer Rating */}
          <div className="card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Average Customer Rating
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#f59e0b', margin: '4px 0' }}>
              ★ {analytics.avgRating}
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>
              Out of 5.0 stars calculated
            </p>
          </div>
        </div>

        {/* 2. SECOND ROW: REVIEW TRENDS CHART & SENTIMENT BREAKDOWN CHART */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Review Trends Over Time */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Review Trends Over Time</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.82rem' }}>
                  Review volume and average rating from actual timestamps.
                </p>
              </div>
              <span className="pill" style={{ fontSize: '0.72rem' }}>
                {analytics.trends.length} recorded {analytics.trends.length === 1 ? 'date' : 'dates'}
              </span>
            </div>

            {/* SVG Line / Bar Trend Chart */}
            <div style={{ height: '170px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '16px 8px 10px', background: '#fafcff', borderRadius: '12px', border: '1px solid #e1eaf8', overflowX: 'auto' }}>
              {analytics.trends.map((point, idx) => {
                const maxVol = Math.max(...analytics.trends.map((t) => t.count), 1);
                const heightPct = Math.max(25, Math.round((point.count / maxVol) * 85));
                return (
                  <div key={idx} style={{ flex: 1, minWidth: '45px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', marginBottom: '4px' }}>
                      ★{point.avgStars}
                    </span>
                    <div
                      style={{
                        width: '28px',
                        height: `${heightPct}%`,
                        background: 'linear-gradient(180deg, var(--blue), #0ea5e9)',
                        borderRadius: '6px 6px 2px 2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.72rem',
                        fontWeight: 800
                      }}
                      title={`${point.count} reviews on ${point.dateLabel} (avg ★${point.avgStars})`}
                    >
                      {point.count}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '6px', whiteSpace: 'nowrap' }}>
                      {point.dateLabel}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--muted)', marginTop: '8px' }}>
              <span>Blue bar: Review count</span>
              <span>Yellow label: Day's average rating</span>
            </div>
          </div>

          {/* Customer Sentiment Breakdown (Doughnut Chart) */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>Customer Sentiment Breakdown</h3>
            <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: '0.82rem' }}>
              Automatically computed percentage share of customer sentiment.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
              {/* Doughnut SVG */}
              <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e6edfa" strokeWidth="4.2" />
                  {/* Positive Arc */}
                  {analytics.positivePct > 0 && (
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="4.2"
                      strokeDasharray={`${analytics.positivePct * 0.88} 100`}
                      strokeLinecap="round"
                    />
                  )}
                  {/* Neutral Arc */}
                  {analytics.neutralPct > 0 && (
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="4.2"
                      strokeDasharray={`${analytics.neutralPct * 0.88} 100`}
                      strokeDashoffset={`-${analytics.positivePct * 0.88}`}
                    />
                  )}
                  {/* Negative Arc */}
                  {analytics.negativePct > 0 && (
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="4.2"
                      strokeDasharray={`${analytics.negativePct * 0.88} 100`}
                      strokeDashoffset={`-${(analytics.positivePct + analytics.neutralPct) * 0.88}`}
                    />
                  )}
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--ink)' }}>{analytics.positivePct}%</span>
                  <span style={{ fontSize: '0.68rem', color: '#0d6852', fontWeight: 800, textTransform: 'uppercase' }}>Positive</span>
                </div>
              </div>

              {/* Legend with exact numbers & percentages */}
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
                  <span>Positive: <b>{analytics.positiveCount}</b> ({analytics.positivePct}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#64748b' }} />
                  <span>Neutral: <b>{analytics.neutralCount}</b> ({analytics.neutralPct}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} />
                  <span>Negative: <b>{analytics.negativeCount}</b> ({analytics.negativePct}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. THIRD ROW: RATING DISTRIBUTION & COMMON CUSTOMER KEYWORDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Rating Distribution Bar Chart */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>Rating Distribution</h3>
            <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: '0.82rem' }}>
              Counts and percentages across 1 to 5 star customer ratings.
            </p>

            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                { stars: '5-Star', count: analytics.ratingDistribution.stars5.count, pct: analytics.ratingDistribution.stars5.pct, color: '#10b981' },
                { stars: '4-Star', count: analytics.ratingDistribution.stars4.count, pct: analytics.ratingDistribution.stars4.pct, color: '#3b82f6' },
                { stars: '3-Star', count: analytics.ratingDistribution.stars3.count, pct: analytics.ratingDistribution.stars3.pct, color: '#f59e0b' },
                { stars: '2-Star', count: analytics.ratingDistribution.stars2.count, pct: analytics.ratingDistribution.stars2.pct, color: '#f97316' },
                { stars: '1-Star', count: analytics.ratingDistribution.stars1.count, pct: analytics.ratingDistribution.stars1.pct, color: '#ef4444' }
              ].map((row) => (
                <div key={row.stars} style={{ display: 'grid', gridTemplateColumns: '55px 1fr 70px', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
                  <span style={{ fontWeight: 750 }}>{row.stars}</span>
                  <div style={{ height: '12px', borderRadius: '999px', background: '#e5eefc', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.round((row.count / maxRatingCount) * 100)}%`,
                        background: row.color,
                        borderRadius: 'inherit',
                        transition: 'width 0.3s'
                      }}
                    />
                  </div>
                  <span style={{ textAlign: 'right', color: 'var(--muted)', fontWeight: 700 }}>
                    {row.count} ({row.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Customer Keywords */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>Common Customer Keywords</h3>
            <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: '0.82rem' }}>
              Most frequent positive and negative terms extracted from actual reviews.
            </p>

            {/* Positive Keywords */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#0d6852', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Frequently Praised:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {analytics.commonKeywords.positive.length > 0 ? (
                  analytics.commonKeywords.positive.map((item, i) => (
                    <span key={i} className="badge-tag badge-positive">
                      ✓ {item.word} <b>({item.count})</b>
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>No positive keywords detected yet.</span>
                )}
              </div>
            </div>

            {/* Negative Keywords */}
            <div>
              <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Frequent Complaints:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {analytics.commonKeywords.negative.length > 0 ? (
                  analytics.commonKeywords.negative.map((item, i) => (
                    <span key={i} className="badge-tag badge-negative">
                      ⚠ {item.word} <b>({item.count})</b>
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>No complaints detected yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. FOURTH ROW: TOP POSITIVE FEEDBACK & TOP NEGATIVE FEEDBACK */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Top Positive Feedback */}
          <div className="card" style={{ padding: '24px', background: '#f5fdfa', borderColor: '#b6edd9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>⭐</span>
              <h3 style={{ margin: 0, fontSize: '1.08rem', color: '#0d6852' }}>Top Positive Customer Feedback</h3>
            </div>
            {analytics.topPositiveFeedback ? (
              <>
                <p style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 750, color: '#134e4a' }}>
                  {analytics.topPositiveFeedback.summary}
                </p>
                <div style={{ padding: '12px', borderRadius: '10px', background: '#ffffff', border: '1px solid #d1f4e7', fontSize: '0.84rem', fontStyle: 'italic', color: '#115e59' }}>
                  "{analytics.topPositiveFeedback.sampleReview}"
                </div>
              </>
            ) : (
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.86rem' }}>
                No positive reviews recorded in this time range yet.
              </p>
            )}
          </div>

          {/* Top Negative Feedback */}
          <div className="card" style={{ padding: '24px', background: '#fff9fa', borderColor: '#fed5db' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <h3 style={{ margin: 0, fontSize: '1.08rem', color: '#991b1b' }}>Top Negative Customer Feedback</h3>
            </div>
            {analytics.topNegativeFeedback ? (
              <>
                <p style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 750, color: '#7f1d1d' }}>
                  {analytics.topNegativeFeedback.summary}
                </p>
                <div style={{ padding: '12px', borderRadius: '10px', background: '#ffffff', border: '1px solid #fecdd3', fontSize: '0.84rem', fontStyle: 'italic', color: '#881337' }}>
                  "{analytics.topNegativeFeedback.sampleReview}"
                </div>
              </>
            ) : (
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.86rem', fontWeight: 700 }}>
                ✓ No critical complaints found in this time range!
              </p>
            )}
          </div>
        </div>

        {/* 5. FIFTH ROW: DISH PERFORMANCE & WHAT SHOULD YOU IMPROVE? */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {/* Dish Performance Overview */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>Dish Performance Overview</h3>
            <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: '0.82rem' }}>
              Specific dishes identified from actual customer reviews.
            </p>

            {analytics.dishPerformance.praised.length > 0 || analytics.dishPerformance.complained.length > 0 ? (
              <div style={{ display: 'grid', gap: '14px' }}>
                {/* Most Praised */}
                <div>
                  <b style={{ display: 'block', fontSize: '0.78rem', color: '#0d6852', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    Most Praised Dishes:
                  </b>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {analytics.dishPerformance.praised.length > 0 ? (
                      analytics.dishPerformance.praised.map((d, i) => (
                        <span key={i} className="badge-tag badge-positive">
                          {d.dish} · <b>{d.positiveCount} positive mentions</b>
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>None identified yet.</span>
                    )}
                  </div>
                </div>

                {/* Most Complained-About */}
                <div>
                  <b style={{ display: 'block', fontSize: '0.78rem', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    Dishes Receiving Complaints:
                  </b>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {analytics.dishPerformance.complained.length > 0 ? (
                      analytics.dishPerformance.complained.map((d, i) => (
                        <span key={i} className="badge-tag badge-negative">
                          {d.dish} · <b>{d.negativeCount} complaints</b>
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                        ✓ Zero dish complaints recorded.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.84rem' }}>
                Mention dish names (e.g. pasta, pizza, soup, burger) in your reviews to see dish-specific insights here.
              </p>
            )}
          </div>

          {/* What Should You Improve? (Customer Improvement Insights) */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>What Should You Improve?</h3>
            <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: '0.82rem' }}>
              Top actionable focus areas derived from repeated customer issues.
            </p>

            {analytics.improvementAreas.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                {analytics.improvementAreas.map((area, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: '#fff8f6',
                      border: '1px solid #fbdcd6'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <b style={{ color: '#c93a54', fontSize: '0.88rem' }}>
                        #{i + 1} {area.problem}
                      </b>
                      <span className="pill badge-negative" style={{ fontSize: '0.7rem' }}>
                        Detected in {area.count} {area.count === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#4a5568', fontSize: '0.82rem', lineHeight: '1.45' }}>
                      <b>Action:</b> {area.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '16px', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.86rem' }}>
                <b>Excellent operational standing!</b> No repeated customer complaints detected in current reviews.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
