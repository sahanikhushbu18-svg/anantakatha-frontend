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

const schema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export default function DeleteAccountPage() {
  const [message, setMessage] = useState('');
  const form = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }) => {
    try {
      setMessage('');
      await usersApi.deleteAccount({ password });
      setMessage('Account deletion request submitted.');
      form.reset();
    } catch (error) {
      setMessage(readMessage(error, 'Unable to delete account'));
    }
  };

  return (
    <>
      <Seo title="Delete account | AnantaKatha" description="Request deletion of your AnantaKatha account." canonicalPath="/profile/delete-account" />
      <PageShell eyebrow="Account center" title="Delete account" subtitle="This request permanently removes your account data according to backend policy.">
        <Card className="settings-card warning-card">
          <p className="muted">This action is irreversible. Your account, stories, preferences, and related records may be removed or scheduled for deletion based on backend rules.</p>
          <ul className="info-list">
            <li>Confirm you want to permanently close the account.</li>
            <li>Use your current password as the final confirmation.</li>
            <li>Back up any data you want to keep before submitting.</li>
          </ul>
          <form className="stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <PasswordField label="Password" error={form.formState.errors.password?.message} {...form.register('password')} />
            {message ? <p className="form-message error">{message}</p> : null}
            <div className="inline-actions">
              <Button type="submit" variant="ghost">Request account deletion</Button>
              <Link className="button ghost" to="/profile">Back to profile</Link>
            </div>
          </form>
        </Card>
      </PageShell>
    </>
  );
}
