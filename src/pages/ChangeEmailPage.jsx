import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { usersApi } from '../api/users';
import { Button, Card, Field, PasswordField } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { Seo } from '../components/Seo';
import { readMessage, unwrapData } from '../utils/api';

const schema = z.object({
  newEmail: z.string().email('Enter a valid email'),
  currentPassword: z.string().min(1, 'Current password is required'),
});

export default function ChangeEmailPage() {
  const [message, setMessage] = useState('');
  const form = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    usersApi.getProfile().then((response) => {
      const profile = unwrapData({ data: response });
      form.reset({ newEmail: profile.email || '', currentPassword: '' });
    });
  }, [form]);

  const onSubmit = async (values) => {
    try {
      setMessage('');
      await usersApi.requestEmailChange(values);
      form.reset({ newEmail: values.newEmail, currentPassword: '' });
      setMessage('Verification links have been sent to your current and new email addresses.');
    } catch (error) {
      setMessage(readMessage(error, 'Unable to change email'));
    }
  };

  return (
    <>
      <Seo title="Change email | AnantaKatha" description="Request an email change for your AnantaKatha account." canonicalPath="/profile/change-email" />
      <PageShell eyebrow="Account center" title="Change email" subtitle="Move your account to a new email address with verification on both inboxes.">
        <Card className="settings-card narrow">
          <p className="muted">Changing your email keeps the account secure by verifying the old and new inbox before the change is finalized.</p>
          <form className="stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <Field label="New email" type="email" error={form.formState.errors.newEmail?.message} {...form.register('newEmail')} />
            <PasswordField label="Current password" error={form.formState.errors.currentPassword?.message} {...form.register('currentPassword')} />
            {message ? <p className="form-message">{message}</p> : null}
            <div className="inline-actions">
              <Button type="submit">Send verification links</Button>
              <Link className="button ghost" to="/profile">Back to profile</Link>
            </div>
          </form>
        </Card>
      </PageShell>
    </>
  );
}
