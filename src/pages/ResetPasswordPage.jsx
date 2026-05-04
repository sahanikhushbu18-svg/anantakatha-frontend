import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Button, PasswordField } from '../components/UI';
import { readMessage } from '../utils/api';
import { PageShell } from '../components/PageShell';
import { Seo } from '../components/Seo';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export default function ResetPasswordPage() {
  const location = useLocation();
  const token = useMemo(() => new URLSearchParams(location.search).get('token') || '', [location.search]);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password, confirmPassword }) => {
    try {
      setMessage('');
      await authApi.resetPassword({ token, password, confirmPassword });
      setMessage('Password updated successfully. You can log in now.');
    } catch (error) {
      setMessage(readMessage(error, 'Unable to reset password'));
    }
  };

  return (
    <>
      <Seo title="Reset password | AnantaKatha" description="Choose a new password for your AnantaKatha account." canonicalPath="/reset-password" />
      <PageShell eyebrow="Recovery" title="Reset password" subtitle="Choose a new password for your account.">
      <form className="stack narrow" onSubmit={handleSubmit(onSubmit)} noValidate>
        <PasswordField label="New password" error={errors.password?.message} {...register('password')} />
        <PasswordField label="Confirm password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        {!token ? <p className="form-message error">Missing reset token.</p> : null}
        {message ? <p className="form-message">{message}</p> : null}
        <Button type="submit" disabled={isSubmitting || !token}>{isSubmitting ? 'Saving...' : 'Reset password'}</Button>
        <div className="form-links">
          <Link to="/login">Back to login</Link>
          <Link to="/forgot-password">Request another link</Link>
        </div>
      </form>
      </PageShell>
    </>
  );
}