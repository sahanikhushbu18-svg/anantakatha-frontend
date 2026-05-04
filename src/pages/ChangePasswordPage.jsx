import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { usersApi } from '../api/users';
import { Button, Card, PasswordField } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { Seo } from '../components/Seo';
import { readMessage } from '../utils/api';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export default function ChangePasswordPage() {
  const [message, setMessage] = useState('');
  const form = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      setMessage('');
      await usersApi.changePassword(values);
      form.reset();
      setMessage('Password updated successfully.');
    } catch (error) {
      setMessage(readMessage(error, 'Unable to change password'));
    }
  };

  return (
    <>
      <Seo title="Change password | AnantaKatha" description="Update your AnantaKatha password securely." canonicalPath="/profile/change-password" />
      <PageShell eyebrow="Account center" title="Change password" subtitle="Choose a strong password and keep your account protected across devices.">
        <Card className="settings-card narrow">
          <p className="muted">Use a password you have not used elsewhere. You will be signed in normally after the change, depending on backend session policy.</p>
          <form className="stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <PasswordField label="Current password" error={form.formState.errors.currentPassword?.message} {...form.register('currentPassword')} />
            <PasswordField label="New password" error={form.formState.errors.newPassword?.message} {...form.register('newPassword')} />
            <PasswordField label="Confirm password" error={form.formState.errors.confirmPassword?.message} {...form.register('confirmPassword')} />
            {message ? <p className="form-message">{message}</p> : null}
            <div className="inline-actions">
              <Button type="submit">Update password</Button>
              <Link className="button ghost" to="/profile">Back to profile</Link>
            </div>
          </form>
        </Card>
      </PageShell>
    </>
  );
}
