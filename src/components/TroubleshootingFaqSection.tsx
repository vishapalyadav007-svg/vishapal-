import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
  steps?: string[];
}

const FAQS: FaqItem[] = [
  {
    question: 'How do I analyze customer reviews from Google, Yelp, or Zomato?',
    answer: 'You can copy and paste review text directly into the Review Analyzer text area. The system processes the text in real-time, extracts keywords, calculates sentiment, and projects a predicted star rating.',
    steps: [
      'Copy the customer review from your review platform.',
      'Paste it into the text box under "Customer Review Input".',
      'Click "Analyze Review ↓".',
      'Review the predicted stars, sentiment score, and aspect breakdown (Food, Service, Ambiance, Value).',
      'Click "Copy Reply to Clipboard" to use the generated manager response template.'
    ]
  },
  {
    question: 'How do I troubleshoot login and password issues?',
    answer: 'The website is protected by an Owner Login screen requiring the demo password "21062006". Authentication is verified securely on the server via /api/auth/login.',
    steps: [
      'Enter the demo password "21062006".',
      'Click the 👁 eye icon to make sure no accidental spaces were typed.',
      'Click "Unlock Portal". A secure session token will be stored in your browser.',
      'If your session expires after closing the browser, simply log in again.',
      'To test without entering a password, append "?autostart=1" to the URL.'
    ]
  },
  {
    question: 'Why are some reviews classified as "Neutral"?',
    answer: 'A review is classified as neutral if the customer mentioned both positive and negative elements equally (e.g., "The pizza was good, but the waiting line was long"), or if the review was purely descriptive without strong sentiment adjectives.',
    steps: [
      'Review the Aspect Breakdown to see which specific categories were rated positively or negatively.',
      'Check the Sentiment Score percentage (typically between 45% and 69% for neutral reviews).',
      'Use the generated response template to address both the compliments and the complaints in a balanced tone.'
    ]
  },
  {
    question: 'How do I share the website through WhatsApp?',
    answer: 'You can share the permanent public HTTPS URL with anyone through WhatsApp, SMS, or email.',
    steps: [
      'Copy your public website link: https://ais-pre-xkb2cbnp2rxn76fg6xhhk7-627267135763.asia-east1.run.app',
      'Paste it into your WhatsApp chat with a message like: "Check out our Business Review Analyzer portal! Password to view: 21062006".',
      'When the recipient taps the link, the Owner Login screen opens.',
      'After entering 21062006, the complete platform unlocks for them.'
    ]
  },
  {
    question: 'How does the "What Should You Improve?" section work?',
    answer: 'The analytics engine scans all reviews in your active history for recurring complaint keywords (e.g., "slow service", "cold food", "noisy", "overpriced"). When a complaint is detected in multiple reviews, the system generates targeted operational recommendations.'
  }
];

export const TroubleshootingFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="section soft" id="faq">
      <div className="container">
        <div className="heading">
          <p className="eyebrow">Help &amp; Support</p>
          <h2>Troubleshooting &amp; Frequently Asked Questions</h2>
          <p>
            Quick solutions to common business questions, error diagnostics, and feature guides.
          </p>
        </div>

        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '20px 24px',
                  cursor: 'pointer',
                  border: isOpen ? '1px solid #93c5fd' : '1px solid #bfd2f0',
                  backgroundColor: isOpen ? '#ffffff' : '#fcfdff',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => toggle(idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--ink)', fontWeight: 700 }}>
                    {faq.question}
                  </h3>
                  <span
                    style={{
                      fontSize: '1.2rem',
                      color: isOpen ? 'var(--blue)' : 'var(--muted)',
                      fontWeight: 700,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    ▼
                  </span>
                </div>

                {isOpen && (
                  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #e2ebfa' }}>
                    <p style={{ margin: '0 0 10px', fontSize: '0.92rem', color: '#334e75', lineHeight: '1.6' }}>
                      {faq.answer}
                    </p>

                    {faq.steps && (
                      <div style={{ marginTop: '12px', padding: '14px', backgroundColor: '#f0f5fc', borderRadius: '10px' }}>
                        <b style={{ fontSize: '0.84rem', color: '#0f3c88', display: 'block', marginBottom: '8px' }}>
                          Step-by-Step Guidance:
                        </b>
                        <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.88rem', color: '#1e3a66', lineHeight: '1.6' }}>
                          {faq.steps.map((step, sIdx) => (
                            <li key={sIdx} style={{ marginBottom: '4px' }}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
