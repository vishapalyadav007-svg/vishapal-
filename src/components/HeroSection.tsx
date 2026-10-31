import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">Enterprise Feedback Intelligence &amp; Customer Support</p>
          <h1>Turn Customer Reviews Into <em>Business Growth</em>.</h1>
          <p className="hero-copy">
            Welcome to Vishapal Yadav's ReviewInsight Business Platform. Analyze customer feedback from Google, Yelp, and Zomato in real time, uncover recurring complaints, project accurate star ratings, and draft high-converting manager replies instantly.
          </p>
          <div className="actions">
            <a className="button primary" href="#analyzer">Review Analyzer ↓</a>
            <a className="button secondary" href="#dashboard">Analytics Dashboard</a>
            <a className="button secondary" href="#features">Platform Features</a>
            <a className="button secondary" href="#faq">Support &amp; FAQ</a>
          </div>
          <p className="small-note">
            Built for restaurant owners, general managers, and hospitality teams seeking actionable customer intelligence.
          </p>
        </div>

        <aside className="hero-panel" aria-label="Business Intelligence Metrics">
          <div className="panel-top">
            <span>Executive Overview</span>
            <i className="dot" aria-hidden="true" />
          </div>
          <h2>Actionable Customer Insights.</h2>
          <p>
            Zero manual guesswork. Discover exactly what diners love and what issues demand your immediate management attention.
          </p>
          <div className="mini-stats">
            <div className="mini">
              <b>100%</b>
              <span>Live Analysis</span>
            </div>
            <div className="mini">
              <b>4</b>
              <span>Business Aspects</span>
            </div>
            <div className="mini">
              <b>1-5★</b>
              <span>Star Predictor</span>
            </div>
            <div className="mini">
              <b>24/7</b>
              <span>Support Chatbot</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="container feature-grid">
        <article className="card feature">
          <div className="feature-icon">⚡</div>
          <h3>NLP Sentiment Polarity</h3>
          <p>
            Automatically classifies review sentiment as positive, neutral, or negative with granular percentage confidence.
          </p>
        </article>
        <article className="card feature">
          <div className="feature-icon">🔍</div>
          <h3>Aspect Diagnostics</h3>
          <p>
            Pinpoints exact performance scores for Food Quality, Service Hospitality, Ambiance, and Value for Money.
          </p>
        </article>
        <article className="card feature">
          <div className="feature-icon">✍️</div>
          <h3>Auto-Generated Replies</h3>
          <p>
            Generates empathetic, customer-retention responses with one-click clipboard copying for public review sites.
          </p>
        </article>
      </div>
    </section>
  );
};
