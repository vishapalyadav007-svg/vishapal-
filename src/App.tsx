import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen.tsx';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ReviewAnalyzer } from './components/ReviewAnalyzer.tsx';
import { ReviewDashboard } from './components/ReviewDashboard.tsx';
import { BusinessFeaturesSection } from './components/BusinessFeaturesSection.tsx';
import { TroubleshootingFaqSection } from './components/TroubleshootingFaqSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { FloatingSupportChatbot } from './components/FloatingSupportChatbot.tsx';
import { ReviewAnalysisResult, analyzeReview } from './utils/sentiment.ts';

const INITIAL_SAMPLE_REVIEWS: ReviewAnalysisResult[] = [
  analyzeReview('The pasta was absolutely delicious, fresh and amazing! Quick friendly service and cozy ambiance. Best Italian place in town.'),
  analyzeReview('Terrible experience. The soup was cold, salty and awful. Waiter was extremely rude and unhelpful. Overpriced!'),
  analyzeReview('The burger was tasty and flavorful, but we had to wait 45 minutes for our order. Service was slow.'),
  analyzeReview('Great pizza and appetizers, but the dining room was extremely noisy and dirty tables.')
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return true;
    }
    return sessionStorage.getItem('ri_auth') === 'true';
  });

  const [isPresentation, setIsPresentation] = useState<boolean>(false);

  const [reviewHistory, setReviewHistory] = useState<ReviewAnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem('ri_review_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SAMPLE_REVIEWS;
  });

  const handleReviewAnalyzed = (newReview: ReviewAnalysisResult) => {
    setReviewHistory((prev) => {
      const updated = [newReview, ...prev.slice(0, 24)];
      try {
        localStorage.setItem('ri_review_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setReviewHistory([]);
    try {
      localStorage.removeItem('ri_review_history');
    } catch {
      // ignore
    }
  };

  const handleDeleteHistoryItem = (index: number) => {
    setReviewHistory((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem('ri_review_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('ri_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      }
    } catch {
      // ignore
    }
    sessionStorage.removeItem('ri_auth');
    sessionStorage.removeItem('ri_token');
    setIsAuthenticated(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const handleTogglePresentation = () => {
    const nextState = !isPresentation;
    setIsPresentation(nextState);
    document.body.classList.toggle('presentation', nextState);
    if (nextState) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <div id="site-content">
      <Header onLogout={handleLogout} />

      <main id="main">
        <HeroSection />
        <ReviewAnalyzer
          onReviewAnalyzed={handleReviewAnalyzed}
          reviewHistory={reviewHistory}
          onClearHistory={handleClearHistory}
          onDeleteHistoryItem={handleDeleteHistoryItem}
        />
        <ReviewDashboard
          history={reviewHistory}
          onScrollToAnalyzer={() => {
            const el = document.getElementById('analyzer');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
              const input = document.getElementById('review-input');
              if (input) input.focus();
            }
          }}
        />
        <BusinessFeaturesSection />
        <TroubleshootingFaqSection />
        <AboutSection
          onTogglePresentation={handleTogglePresentation}
          isPresentation={isPresentation}
        />
      </main>

      <footer className="footer" style={{ padding: '32px 0', borderTop: '1px solid var(--line)', background: '#ffffff', textAlign: 'center' }}>
        <div className="container">
          <p style={{ margin: '0 0 6px', fontWeight: 600, color: 'var(--ink)' }}>
            © {new Date().getFullYear()} Vishapal Yadav · ReviewInsight Business Suite
          </p>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>
            Enterprise Customer Feedback Intelligence &amp; Customer Support Platform · 100% Privacy &amp; Real-Time NLP Analytics.
          </p>
        </div>
      </footer>

      {/* Floating Customer Support Chatbot fixed at bottom-right */}
      <FloatingSupportChatbot />

      {isPresentation && (
        <div className="presentation-bar" aria-label="Presentation controls">
          <span>Presentation Mode Active</span>
          <button
            className="button dark-button"
            id="presentation-exit"
            type="button"
            onClick={handleTogglePresentation}
          >
            Exit
          </button>
        </div>
      )}
    </div>
  );
}
