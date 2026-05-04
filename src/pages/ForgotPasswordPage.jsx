import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Button, Field } from '../components/UI';
import { readMessage } from '../utils/api';
import { PageShell } from '../components/PageShell';
import { Seo } from '../components/Seo';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      setMessage('');
      await authApi.forgotPassword(email);
      setMessage('Password reset link sent to your email.');
    } catch (error) {
      setMessage(readMessage(error, 'Unable to request password reset'));
    }
  };

  return (
    <>
      <Seo title="Forgot password | AnantaKatha" description="Request a password reset link for your AnantaKatha account." canonicalPath="/forgot-password" />
      <PageShell eyebrow="Recovery" title="Forgot password" subtitle="Request a reset link and continue back into your account.">
      <form className="stack narrow" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Email" type="email" error={errors.email?.message} {...register('email')} />
        {message ? <p className="form-message">{message}</p> : null}
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send reset link'}</Button>
        <div className="form-links">
          <Link to="/login">Back to login</Link>
          <Link to="/signup">Create account</Link>
        </div>
      </form>
      </PageShell>
    </>
  );
}