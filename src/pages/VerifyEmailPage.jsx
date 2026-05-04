import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Button, Card } from '../components/UI';
import { readMessage } from '../utils/api';
import { PageShell } from '../components/PageShell';
import { Seo } from '../components/Seo';

export default function VerifyEmailPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(search).get('token');
    if (!token) {
      setStatus('missing');
      setMessage('Missing verification token. Use the link from your email.');
      return;
    }

    let mounted = true;

    authApi
      .verifyEmail(token)
      .then((response) => {
        if (!mounted) {
          return;
        }
        setStatus('success');
        setMessage(response?.message || 'Email verified successfully. You can log in now.');
      })
      .catch((error) => {
        if (!mounted) {
          return;
        }
        setStatus('error');
        setMessage(readMessage(error, 'Verification failed'));
      });

    return () => {
      mounted = false;
    };
  }, [search]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setResendMessage('Please enter your email address');
      return;
    }

    setResendLoading(true);
    setResendMessage('');

    try {
      await authApi.resendVerificationEmail(email);
      setResendMessage('Verification email sent! Check your inbox.');
      setEmail('');
    } catch (error) {
      setResendMessage(readMessage(error, 'Failed to resend email'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Seo title="Verify email | AnantaKatha" description="Confirm your email address to activate your AnantaKatha account." canonicalPath="/verify-email" />
      <PageShell
        eyebrow="Confirm your identity"
        title="Verify email"
        subtitle="Complete email verification to unlock login, story publishing, or email changes."
      >
      <div className="center-stack">
        <Card className="status-card verify-card">
          <p className={`status-line ${status}`}>{status === 'loading' ? 'Verifying...' : message}</p>
          {status === 'success' ? (
            <div className="inline-actions">
              <Link className="button primary" to="/login">Login</Link>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
            </div>
          ) : (status === 'missing' || status === 'error') ? (
            <form onSubmit={handleResend} className="resend-form">
              <div className="form-group">
                <input
                  className="control"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={resendLoading}
                />
              </div>
              {resendMessage && <p className={`form-message ${resendMessage.includes('sent') ? 'success' : 'error'}`}>{resendMessage}</p>}
              <Button type="submit" variant="primary" disabled={resendLoading}>
                {resendLoading ? 'Sending...' : 'Resend verification email'}
              </Button>
            </form>
          ) : null}
        </Card>
      </div>
      </PageShell>
    </>
  );
}