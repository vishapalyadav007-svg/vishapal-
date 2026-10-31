import React, { useState } from 'react';
import { analyzeReview, ReviewAnalysisResult } from '../utils/sentiment.ts';

interface ReviewAnalyzerProps {
  onReviewAnalyzed?: (review: ReviewAnalysisResult) => void;
  reviewHistory: ReviewAnalysisResult[];
  onClearHistory: () => void;
  onDeleteHistoryItem: (index: number) => void;
}

const PRESET_REVIEWS = [
  {
    label: '⭐ 5-Star Rave',
    text: 'The pasta was absolutely delicious, fresh and amazing! Quick friendly service and cozy ambiance. Best Italian place in town, totally worth the price.'
  },
  {
    label: '⭐ 1-Star Disaster',
    text: 'Terrible experience. The soup was cold, salty and awful. Waiter was extremely rude and dismissive. Overpriced and a complete waste of money!'
  },
  {
    label: '⭐ 3-Star Mixed',
    text: 'The burger was tasty and flavorful, but we had to wait 45 minutes for our order. Service was slow and the bill was slightly expensive.'
  },
  {
    label: '⭐ Ambiance Complaint',
    text: 'Great food and drinks, but the dining room was horribly noisy with dirty restrooms. Could not have a conversation.'
  }
];

export const ReviewAnalyzer: React.FC<ReviewAnalyzerProps> = ({
  onReviewAnalyzed,
  reviewHistory,
  onClearHistory,
  onDeleteHistoryItem
}) => {
  const [inputText, setInputText] = useState(PRESET_REVIEWS[0].text);
  const [analysis, setAnalysis] = useState<ReviewAnalysisResult | null>(() => analyzeReview(PRESET_REVIEWS[0].text));
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      setStatusMessage('Please enter review text to analyze.');
      return;
    }
    const result = analyzeReview(inputText);
    setAnalysis(result);
    setStatusMessage('');
    if (onReviewAnalyzed) {
      onReviewAnalyzed(result);
    }
  };

  const handlePreset = (text: string) => {
    setInputText(text);
    const result = analyzeReview(text);
    setAnalysis(result);
    setStatusMessage('');
    if (onReviewAnalyzed) {
      onReviewAnalyzed(result);
    }
  };

  const handleCopyReply = () => {
    if (analysis?.suggestedReply) {
      navigator.clipboard.writeText(analysis.suggestedReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderStars = (count: number) => {
    return (
      <span className="star-rating" aria-label={`${count} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ color: i < count ? '#f59e0b' : '#cbd5e1' }}>★</span>
        ))}
      </span>
    );
  };

  return (
    <section className="section" id="analyzer">
      <div className="container">
        <div className="heading">
          <p className="eyebrow">Restaurant Review Analyzer</p>
          <h2>Real-Time Sentiment &amp; Aspect Engine</h2>
          <p>
            Powered by domain-specific NLP sentiment heuristics. Paste any customer review to inspect star prediction, multi-aspect performance, and an instant manager response template.
          </p>
        </div>

        {/* Presets */}
        <div style={{ marginBottom: '18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--muted)' }}>Try sample reviews:</span>
          {PRESET_REVIEWS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="button secondary"
              style={{ minHeight: '34px', padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => handlePreset(preset.text)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="analyzer-grid">
          {/* Input side */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '1.18rem', letterSpacing: '-0.02em' }}>
              Customer Review Input
            </h3>
            <p style={{ margin: '0 0 14px', fontSize: '0.86rem', color: 'var(--muted)' }}>
              Enter or paste dining feedback from Google Reviews, Zomato, Swiggy, TripAdvisor, or Yelp.
            </p>

            <textarea
              id="review-input"
              rows={6}
              style={{
                width: '100%',
                padding: '14px',
                border: '1px solid #bfd2f0',
                borderRadius: '12px',
                color: 'var(--ink)',
                background: '#fafcff',
                resize: 'vertical',
                lineHeight: '1.5',
                fontSize: '0.94rem'
              }}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. The pizza was fresh and delicious, but our waiter was slow..."
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                {inputText.length} characters · {inputText.split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                className="button primary"
                type="button"
                id="analyze-btn"
                onClick={handleAnalyze}
              >
                Analyze Review ↓
              </button>
            </div>

            {statusMessage && (
              <p style={{ marginTop: '12px', color: '#c93a54', fontSize: '0.86rem', fontWeight: 700 }}>
                {statusMessage}
              </p>
            )}
          </div>

          {/* Results Side */}
          {analysis && (
            <div className="card" id="analyzer-result" style={{ padding: '24px', background: '#ffffff', borderColor: '#bed4f7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span
                    className={`pill ${analysis.overallScore >= 60 ? 'badge-positive' : 'badge-negative'}`}
                    style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}
                  >
                    {analysis.sentiment.replace('_', ' ')}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    {renderStars(analysis.predictedStars)}
                    <b style={{ fontSize: '1.25rem', color: 'var(--ink)' }}>{analysis.predictedStars}.0 / 5</b>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 800 }}>
                    Sentiment Score
                  </span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: analysis.overallScore >= 60 ? 'var(--blue)' : 'var(--red)' }}>
                    {analysis.overallScore}%
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{analysis.confidence}% confidence</span>
                </div>
              </div>

              {/* Aspect Breakdown */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '0.94rem', color: '#27436b', letterSpacing: '-0.01em' }}>
                  Aspect Ratings Breakdown
                </h4>

                <div style={{ display: 'grid', gap: '10px' }}>
                  {[
                    { key: 'food', label: 'Food Taste & Quality', data: analysis.aspects.food },
                    { key: 'service', label: 'Service & Hospitality', data: analysis.aspects.service },
                    { key: 'ambiance', label: 'Ambiance & Cleanliness', data: analysis.aspects.ambiance },
                    { key: 'value', label: 'Value & Pricing', data: analysis.aspects.value }
                  ].map((aspect) => (
                    <div key={aspect.key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700 }}>{aspect.label}</span>
                        <span style={{ color: 'var(--muted)' }}>
                          {aspect.data.mentionCount > 0 ? `${aspect.data.score}% (${aspect.data.label})` : 'Neutral (Not mentioned)'}
                        </span>
                      </div>
                      <div className="track" style={{ height: '7px', margin: 0, background: '#e2ebfa' }}>
                        <div
                          className="fill"
                          style={{
                            width: `${aspect.data.score}%`,
                            background: aspect.data.score >= 60 ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #f87171, #dc2626)'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div style={{ marginTop: '18px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {analysis.highlights.positive.map((word, i) => (
                  <span key={'p' + i} className="badge-tag badge-positive">✓ {word}</span>
                ))}
                {analysis.highlights.critical.map((word, i) => (
                  <span key={'c' + i} className="badge-tag badge-negative">⚠ {word}</span>
                ))}
              </div>

              {/* Manager action & response */}
              <div style={{ marginTop: '18px', padding: '14px', borderRadius: '12px', background: '#f5f9ff', border: '1px solid #d4e3fa' }}>
                <b style={{ display: 'block', fontSize: '0.8rem', color: '#1f4882', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recommended Manager Action:
                </b>
                <p style={{ margin: '4px 0 10px', fontSize: '0.85rem', color: '#334e75' }}>
                  {analysis.suggestedAction}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <b style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    Auto-Drafted Reply:
                  </b>
                  <button
                    type="button"
                    className="button secondary"
                    style={{ minHeight: '28px', padding: '3px 9px', fontSize: '0.76rem' }}
                    onClick={handleCopyReply}
                  >
                    {copied ? '✓ Copied!' : 'Copy Reply'}
                  </button>
                </div>
                <div style={{ fontSize: '0.84rem', fontStyle: 'italic', color: '#1a2e4c', background: '#fff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e1ebfa' }}>
                  {analysis.suggestedReply}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History log */}
        {reviewHistory.length > 0 && (
          <div className="card" style={{ marginTop: '30px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.14rem' }}>
                  Recent Review Analysis Log ({reviewHistory.length})
                </h3>
                <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.83rem' }}>
                  Saved in your browser session for restaurant reputation monitoring.
                </p>
              </div>
              <button
                type="button"
                className="button secondary"
                style={{ minHeight: '34px', padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={onClearHistory}
              >
                Clear Review History
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Review Excerpt</th>
                    <th>Predicted Stars</th>
                    <th>Sentiment</th>
                    <th>Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewHistory.slice(0, 8).map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ maxWidth: '380px' }}>
                        <span style={{ fontSize: '0.86rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          "{item.text}"
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#f59e0b', fontWeight: 800 }}>★ {item.predictedStars}</span>
                      </td>
                      <td>
                        <span className={`pill ${item.overallScore >= 60 ? 'badge-positive' : 'badge-negative'}`}>
                          {item.sentiment.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <b>{item.overallScore}%</b>
                      </td>
                      <td>
                        <button
                          type="button"
                          style={{ border: 'none', background: 'transparent', color: '#c93a54', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                          onClick={() => onDeleteHistoryItem(idx)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
