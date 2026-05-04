import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { setCredentials, setUser } from '../store/authSlice';
import { Badge, Button, Card, Field, PasswordField } from '../components/UI';
import { readMessage, unwrapData } from '../utils/api';
import { PageShell } from '../components/PageShell';
import { Seo } from '../components/Seo';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      setMessage('');
      const response = await authApi.login(values);
      const payload = unwrapData({ data: response }) || response;
      dispatch(setCredentials(payload));
      if (payload.user) {
        dispatch(setUser(payload.user));
      }
      const nextPath = location.state?.from?.pathname || '/dashboard';
      navigate(nextPath, { replace: true });
    } catch (error) {
      setMessage(readMessage(error, 'Unable to log in'));
    }
  };

  return (
    <>
      <Seo title="Login | AnantaKatha" description="Login to manage stories, moderation, and your AnantaKatha profile." canonicalPath="/login" />
      <PageShell
        eyebrow="Access your studio"
        title="Login"
        subtitle="Pick up drafting, publishing, and moderation where you left off."
      >
      <div className="auth-split">
        <Card className="auth-visual">
          <img src="/assets/anantakatha-logo-main.png" alt="AnantaKatha logo" />
          <h3>Secure access, no clutter</h3>
          <p>Sign in to continue shaping stories, manage your profile, and return to your drafts on any device.</p>
          <div className="auth-badges">
            <Badge tone="green">JWT sessions</Badge>
            <Badge tone="gold">Password recovery</Badge>
            <Badge tone="rose">Profile sync</Badge>
          </div>
          <Link className="button ghost" to="/signup">Need an account?</Link>
        </Card>

        <form className="stack" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <PasswordField label="Password" placeholder="Your password" error={errors.password?.message} {...register('password')} />
          {message ? <p className="form-message error">{message}</p> : null}
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Login'}</Button>
          <div className="form-links">
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/signup">Create account</Link>
          </div>
        </form>
      </div>
      </PageShell>
    </>
  );
}