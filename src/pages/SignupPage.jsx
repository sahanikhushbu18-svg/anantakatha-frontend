import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Badge, Button, Card, Field, PasswordField } from '../components/UI';
import { readMessage } from '../utils/api';
import { PageShell } from '../components/PageShell';
import { Seo } from '../components/Seo';

const genres = ['Fantasy', 'Science Fiction', 'Romance', 'Mystery', 'Thriller', 'Horror', 'Adventure', 'Historical'];

const schema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    contactNumber: z.string().min(6, 'Contact number is required'),
    heardAboutPlatform: z.string().min(1, 'Tell us how you heard about the platform'),
    platformUseCase: z.string().min(3, 'Describe your use case'),
    favoriteGenres: z.array(z.string()).min(1, 'Choose at least one genre'),
    agreedToTerms: z.boolean().refine((value) => value, 'Please accept the terms'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export default function SignupPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      favoriteGenres: [],
      agreedToTerms: false,
    },
  });

  const onSubmit = async (values) => {
    try {
      setMessage('');
      await authApi.register(values);
      navigate('/verify-email', { state: { email: values.email } });
    } catch (error) {
      setMessage(readMessage(error, 'Unable to create account'));
    }
  };

  return (
    <>
      <Seo title="Create account | AnantaKatha" description="Create your AnantaKatha account to generate, publish, and manage stories." canonicalPath="/signup" />
      <PageShell
        eyebrow="Join the platform"
        title="Create account"
        subtitle="Register once, then verify your email to start generating and publishing stories."
      >
      <div className="auth-split">
        <Card className="auth-visual">
          <img src="/assets/anantakatha-logo.png" alt="AnantaKatha logo" />
          <h3>Start with a verified account</h3>
          <p>Choose the genres you care about, verify your email, and set up your profile in a few minutes.</p>
          <ul className="auth-feature-list">
            <li>Email verification before publishing.</li>
            <li>Password recovery and account security built in.</li>
            <li>Story preferences captured during onboarding.</li>
          </ul>
          <div className="auth-badges">
            <Badge tone="green">Fast onboarding</Badge>
            <Badge tone="gold">Email verification</Badge>
            <Badge tone="rose">Story preferences</Badge>
          </div>
          <Link className="button ghost" to="/login">Already have an account?</Link>
        </Card>

        <form className="stack" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field-row">
            <Field label="First name" error={errors.firstName?.message} {...register('firstName')} />
            <Field label="Last name" error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Field label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <div className="field-row">
            <PasswordField label="Password" error={errors.password?.message} {...register('password')} />
            <PasswordField label="Confirm password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          </div>
          <div className="field-row">
            <Field label="Date of birth" type="date" error={errors.dateOfBirth?.message} {...register('dateOfBirth')} />
            <Field label="Contact number" error={errors.contactNumber?.message} {...register('contactNumber')} />
          </div>
          <Field label="How did you hear about us?" error={errors.heardAboutPlatform?.message} {...register('heardAboutPlatform')} />
          <Field label="How will you use AnantaKatha?" error={errors.platformUseCase?.message} {...register('platformUseCase')} />

          <div className="field-block">
            <span className="field-label">Favorite genres</span>
            <div className="checkbox-grid">
              {genres.map((genre) => (
                <label key={genre} className="check-pill">
                  <input type="checkbox" value={genre} {...register('favoriteGenres')} />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
            {errors.favoriteGenres ? <span className="field-error">{errors.favoriteGenres.message}</span> : null}
          </div>

          <label className="check-row">
            <input type="checkbox" {...register('agreedToTerms')} />
            <span>I agree to the <Link to="/terms">terms</Link> and <Link to="/privacy-policy">privacy policy</Link>.</span>
          </label>
          {errors.agreedToTerms ? <span className="field-error">{errors.agreedToTerms.message}</span> : null}
          {message ? <p className="form-message error">{message}</p> : null}
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</Button>
        </form>
      </div>
      </PageShell>
    </>
  );
}