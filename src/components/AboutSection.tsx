import React from 'react';

interface AboutSectionProps {
  onTogglePresentation: () => void;
  isPresentation: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onTogglePresentation,
  isPresentation
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="section" id="platform">
      <div className="container">
        <div className="heading">
          <p className="eyebrow">Platform Overview</p>
          <h2>Enterprise Business Review Analyzer Architecture</h2>
          <p>
            Designed and built by Vishapal Yadav to demonstrate real-time Natural Language Processing, dynamic customer sentiment analytics, and responsive SaaS web design.
          </p>
        </div>

        <div className="print-only">
          <p><b>Printable Executive Summary</b> — Vishapal Yadav | ReviewInsight Business Review Analyzer &amp; Support Platform</p>
        </div>

        <div className="about-grid">
          <article className="card about-lead">
            <h3>Project Information</h3>
            <p>
              A specialized business SaaS application that empowers hospitality and retail managers to analyze customer reviews, track satisfaction trends, detect recurring complaints, and automate professional customer responses.
            </p>
            <dl>
              <dt>Creator &amp; Engineer</dt>
              <dd>Vishapal Yadav</dd>
              <dt>Platform Role</dt>
              <dd>Full-Stack Developer</dd>
              <dt>Primary Domain</dt>
              <dd>NLP Sentiment Analysis &amp; Business Intelligence</dd>
              <dt>Owner Authentication</dt>
              <dd>Protected with Server-Side Validation (Demo: 21062006)</dd>
            </dl>
          </article>

          <div className="about-details">
            <article className="card about-item">
              <h3>Core Business Purpose</h3>
              <p>
                Eliminates the manual overhead of reading hundreds of reviews across multiple channels by providing instant sentiment scores, star predictions, and targeted operational fixes.
              </p>
            </article>

            <article className="card about-item">
              <h3>Problem Solved</h3>
              <p>
                Unaddressed negative reviews directly hurt sales. This platform identifies specific dissatisfaction drivers (e.g., cold food, slow service) and produces instant empathetic manager responses.
              </p>
            </article>

            <article className="card about-item">
              <h3>Target Users</h3>
              <p>
                Restaurant owners, general managers, guest relations specialists, franchise operators, and retail customer experience leads.
              </p>
            </article>

            <article className="card about-item">
              <h3>Main Features</h3>
              <ul>
                <li>NLP Sentiment Analyzer with 1-5 Star Predictor</li>
                <li>4-Aspect Breakdown (Food, Service, Ambiance, Value)</li>
                <li>5-Row Connected Review Analytics Dashboard</li>
                <li>Floating 24/7 Troubleshooting Support Chatbot</li>
                <li>Automated Manager Response Generation</li>
              </ul>
            </article>

            <article className="card about-item">
              <h3>Technologies</h3>
              <p>
                TypeScript, React, Node.js Express, Tailwind CSS, LocalStorage persistence, and Google Gemini API integration.
              </p>
            </article>

            <article className="card about-item">
              <h3>Deployment &amp; Hosting</h3>
              <p>
                Production-ready for Google Cloud Run, Netlify, or Vercel with HTTPS encryption, zero client password exposure, and WhatsApp shareable links.
              </p>
            </article>
          </div>
        </div>

        <div className="about-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '30px' }}>
          <button
            className="button primary"
            type="button"
            id="presentation-toggle"
            onClick={onTogglePresentation}
          >
            {isPresentation ? 'Exit Presentation Mode' : 'Enter Presentation Mode'}
          </button>
          <button className="button secondary" type="button" id="print-bottom" onClick={handlePrint}>
            Print / Save as PDF
          </button>
        </div>
      </div>
    </section>
  );
};
