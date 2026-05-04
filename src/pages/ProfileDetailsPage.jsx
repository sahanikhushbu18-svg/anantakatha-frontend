import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usersApi } from '../api/users';
import { Button, Card, Field, TextArea } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { Seo } from '../components/Seo';
import { readMessage, unwrapData } from '../utils/api';

const schema = z.object({
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  favoriteGenres: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  dataCollection: z.boolean().optional(),
});

export default function ProfileDetailsPage() {
  const [message, setMessage] = useState('');
  const form = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    usersApi.getProfile().then((response) => {
      const profile = unwrapData({ data: response });
      form.reset({
        email: profile.email || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        bio: profile.bio || '',
        favoriteGenres: (profile.favoriteGenres || []).join(', '),
        twitter: profile.socialLinks?.twitter || '',
        linkedin: profile.socialLinks?.linkedin || '',
        website: profile.socialLinks?.website || '',
        emailNotifications: profile.preferences?.emailNotifications ?? true,
        marketingEmails: profile.preferences?.marketingEmails ?? false,
        dataCollection: profile.preferences?.dataCollection ?? true,
      });
    });
  }, [form]);

  const onSubmit = async (values) => {
    try {
      setMessage('');
      await Promise.all([
        usersApi.updateConsent({
          emailNotifications: Boolean(values.emailNotifications),
          marketingEmails: Boolean(values.marketingEmails),
          dataCollection: Boolean(values.dataCollection),
        }),
        usersApi.updateProfile({
          firstName: values.firstName,
          lastName: values.lastName,
          bio: values.bio,
          favoriteGenres: values.favoriteGenres ? values.favoriteGenres.split(',').map((item) => item.trim()).filter(Boolean) : [],
          socialLinks: {
            twitter: values.twitter,
            linkedin: values.linkedin,
            website: values.website,
          },
        }),
      ]);
      setMessage('Profile updated successfully.');
    } catch (error) {
      setMessage(readMessage(error, 'Unable to update profile'));
    }
  };

  return (
    <>
      <Seo title="Profile details | AnantaKatha" description="Edit your AnantaKatha identity, bio, genres, links, and notification preferences." canonicalPath="/profile/details" />
      <PageShell eyebrow="Account center" title="Profile details" subtitle="Update identity, writing interests, and preferences in one place.">
        <Card className="settings-card">
          <form className="stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <Field label="Email" readOnly {...form.register('email')} />
            <div className="field-row">
              <Field label="First name" {...form.register('firstName')} />
              <Field label="Last name" {...form.register('lastName')} />
            </div>
            <TextArea label="Bio" rows="4" {...form.register('bio')} />
            <Field label="Favorite genres, comma separated" {...form.register('favoriteGenres')} />
            <div className="field-row">
              <Field label="Twitter" {...form.register('twitter')} />
              <Field label="LinkedIn" {...form.register('linkedin')} />
            </div>
            <Field label="Website" {...form.register('website')} />
            <div className="field-row preferences-row">
              <label className="check-row"><input type="checkbox" {...form.register('emailNotifications')} /> <span>Email notifications</span></label>
              <label className="check-row"><input type="checkbox" {...form.register('marketingEmails')} /> <span>Marketing emails</span></label>
              <label className="check-row"><input type="checkbox" {...form.register('dataCollection')} /> <span>Data collection</span></label>
            </div>
            {message ? <p className="form-message">{message}</p> : null}
            <Button type="submit">Save profile</Button>
          </form>
        </Card>
      </PageShell>
    </>
  );
}
