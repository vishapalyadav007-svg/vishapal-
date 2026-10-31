import React from 'react';

export const BusinessFeaturesSection: React.FC = () => {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="heading">
          <p className="eyebrow">Enterprise Capabilities</p>
          <h2>Why Businesses Rely on ReviewInsight</h2>
          <p>
            Purpose-built for hospitality, retail, and service businesses to convert scattered customer feedback into higher ratings and increased customer retention.
          </p>
        </div>

        <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <article className="card feature" style={{ padding: '28px' }}>
            <div className="feature-icon" style={{ background: '#dcfce7', color: '#166534' }}>⚡</div>
            <h3 style={{ fontSize: '1.18rem', margin: '14px 0 8px' }}>Instant Sentiment Scoring</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Our Natural Language Processing classifies sentiment across polarity indices in milliseconds, generating a 1-5 star prediction and percentage confidence score.
            </p>
          </article>

          <article className="card feature" style={{ padding: '28px' }}>
            <div className="feature-icon" style={{ background: '#fee2e2', color: '#991b1b' }}>🚨</div>
            <h3 style={{ fontSize: '1.18rem', margin: '14px 0 8px' }}>Critical Complaint Detection</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Identifies frequent operational bottlenecks—such as slow order preparation, rude service, or billing inaccuracies—before they damage your brand reputation.
            </p>
          </article>

          <article className="card feature" style={{ padding: '28px' }}>
            <div className="feature-icon" style={{ background: '#e0e7ff', color: '#3730a3' }}>✍️</div>
            <h3 style={{ fontSize: '1.18rem', margin: '14px 0 8px' }}>Smart Auto-Reply Generator</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Drafts professional, empathetic manager responses instantly. Easily copy to clipboard and paste directly into Google Reviews, Yelp, or TripAdvisor.
            </p>
          </article>

          <article className="card feature" style={{ padding: '28px' }}>
            <div className="feature-icon" style={{ background: '#fef3c7', color: '#92400e' }}>📊</div>
            <h3 style={{ fontSize: '1.18rem', margin: '14px 0 8px' }}>Dynamic Analytics Dashboard</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              100% connected to analyzed customer reviews. Tracks review trends over time, sentiment percentages, star distributions, and specific item performance.
            </p>
          </article>

          <article className="card feature" style={{ padding: '28px' }}>
            <div className="feature-icon" style={{ background: '#f3e8ff', color: '#6b21a8' }}>🔒</div>
            <h3 style={{ fontSize: '1.18rem', margin: '14px 0 8px' }}>Secure Server-Side Auth</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Protected with server-validated owner credentials and temporary session tokens, ensuring unauthorized public visitors cannot view internal business metrics.
            </p>
          </article>

          <article className="card feature" style={{ padding: '28px' }}>
            <div className="feature-icon" style={{ background: '#cffafe', color: '#155e75' }}>💬</div>
            <h3 style={{ fontSize: '1.18rem', margin: '14px 0 8px' }}>Floating 24/7 Support</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Instant technical and troubleshooting assistance via the bottom-right floating chatbot. Resolves errors, provides step-by-step guidance, and answers questions.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
