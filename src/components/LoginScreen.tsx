import React, { useState } from 'react';

interface LoginScreenProps {
  onUnlock: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'info' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleComingSoon = () => {
    setMessage({
      text: 'Online social login is coming soon. Please use Owner Login with demo password below.',
      type: 'info'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setMessage({ text: 'Please enter the owner password.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // First attempt server-side verification
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          sessionStorage.setItem('ri_token', data.token);
        }
        sessionStorage.setItem('ri_auth', 'true');
        onUnlock();
        return;
      }

      // If server responded with 401 or invalid
      if (res.status === 401) {
        setMessage({ text: 'Incorrect demo password. Please try again.', type: 'error' });
        setIsLoading(false);
        return;
      }

      // Fallback for standalone/offline static file
      if (password.trim() === '21062006') {
        sessionStorage.setItem('ri_auth', 'true');
        onUnlock();
      } else {
        setMessage({ text: 'Incorrect demo password. Please try again.', type: 'error' });
      }
    } catch {
      // Offline / standalone client check fallback
      if (password.trim() === '21062006') {
        sessionStorage.setItem('ri_auth', 'true');
        onUnlock();
      } else {
        setMessage({ text: 'Incorrect demo password. Please try again.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-screen" id="login-screen" aria-labelledby="login-title">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-mark" aria-hidden="true">RI</span>
          <div>
            <strong>ReviewInsight</strong>
            <span>Business Review Analyzer &amp; Support</span>
          </div>
        </div>

        <h1 id="login-title">Owner Portal.</h1>
        <p className="login-intro">
          Choose an option below, or use Owner Login to open the business review analyzer &amp; customer support suite.
        </p>

        <div className="login-options" aria-label="Demo sign-in options">
          <button className="login-option" type="button" onClick={handleComingSoon}>
            <span className="login-option-icon" aria-hidden="true">G</span>
            Continue with Google
          </button>
          <button className="login-option" type="button" onClick={handleComingSoon}>
            <span className="login-option-icon" aria-hidden="true">⌕</span>
            Continue with Phone
          </button>
          <button className="login-option" type="button" onClick={handleComingSoon}>
            <span className="login-option-icon" aria-hidden="true">+</span>
            Create Account
          </button>
        </div>

        <div className="login-divider">Owner access</div>

        <form className="owner-login" id="owner-login" onSubmit={handleSubmit} noValidate>
          <h2>Owner Login</h2>
          <p>Enter the demo password to unlock ReviewInsight.</p>
          <label htmlFor="owner-password" className="visually-hidden">Demo password</label>
          <div className="password-row">
            <input
              id="owner-password"
              name="owner-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              aria-describedby="login-message"
              placeholder="Enter demo password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (message) setMessage(null);
              }}
              disabled={isLoading}
            />
            <button
              className="password-toggle"
              id="password-toggle"
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>

          <button
            className="button primary unlock-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Unlock Website'}
          </button>

          {message && (
            <p className={`login-message ${message.type}`} id="login-message" aria-live="polite">
              {message.text}
            </p>
          )}
        </form>

        <p className="demo-note">
          <strong>Demo credentials:</strong> Demo Password: <code>21062006</code><br />
          Server-side password protection active.
        </p>
      </div>
    </section>
  );
};
