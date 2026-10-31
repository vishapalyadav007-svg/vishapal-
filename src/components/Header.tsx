import React, { useState } from 'react';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <a className="skip" href="#main">Skip to main content</a>
      <header>
        <nav className="container nav" aria-label="Main navigation">
          <a className="brand" href="#home" style={{ textDecoration: 'none' }}>
            <span className="brand-badge">RI</span>
            <div>
              ReviewInsight <span style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 500 }}>· Business Suite</span>
            </div>
          </a>

          {/* Desktop links */}
          <div className="links desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <a href="#analyzer">Review Analyzer</a>
            <a href="#dashboard">Analytics Dashboard</a>
            <a href="#features">Features</a>
            <a href="#faq">Troubleshooting &amp; FAQ</a>
            <a href="#platform">Overview</a>
            <button
              type="button"
              className="logout-nav-btn"
              onClick={onLogout}
              title="Lock website and return to login"
            >
              <span aria-hidden="true">🔒</span> Logout
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              fontSize: '1.4rem',
              cursor: 'pointer',
              color: 'var(--ink)'
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </nav>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div
            className="mobile-nav-drawer"
            style={{
              padding: '16px 24px',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <a href="#analyzer" onClick={() => setMobileMenuOpen(false)}>Review Analyzer</a>
            <a href="#dashboard" onClick={() => setMobileMenuOpen(false)}>Analytics Dashboard</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>Troubleshooting &amp; FAQ</a>
            <a href="#platform" onClick={() => setMobileMenuOpen(false)}>Platform Overview</a>
            <button
              type="button"
              className="logout-nav-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              style={{ alignSelf: 'flex-start' }}
            >
              <span aria-hidden="true">🔒</span> Logout
            </button>
          </div>
        )}
      </header>
    </>
  );
};
