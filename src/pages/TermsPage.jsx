import React from 'react';
import { LegalPage } from '../components/LegalPage';

const sections = [
  {
    title: 'Acceptance of terms',
    text: 'By using AnantaKatha you agree to follow the platform rules, policies, and applicable laws.',
  },
  {
    title: 'Account responsibility',
    points: [
      'You are responsible for keeping your login details secure.',
      'You must provide accurate information and keep your profile updated.',
      'You are responsible for content submitted from your account.',
    ],
  },
  {
    title: 'Content and moderation',
    points: [
      'Stories may be reviewed, edited, approved, or rejected according to moderation rules.',
      'We may suspend accounts that violate platform safety or content policies.',
      'Support is available at support@anantakatha.in.',
    ],
  },
];

export default function TermsPage() {
  return <LegalPage title="Terms & Conditions" subtitle="The rules that apply when you use AnantaKatha." sections={sections} canonicalPath="/terms" />;
}