import React from 'react';
import { LegalPage } from '../components/LegalPage';

const sections = [
  {
    title: 'What we collect',
    points: [
      'Account information such as your name, email, and profile details.',
      'Story content, preferences, and moderation history that you create on the platform.',
      'Usage and device data used to keep the platform secure and reliable.',
    ],
  },
  {
    title: 'How we use data',
    points: [
      'To provide authentication, story generation, publishing, and account services.',
      'To send verification, reset, and product support emails.',
      'To improve product quality, security, moderation, and analytics.',
    ],
  },
  {
    title: 'Your choices',
    points: [
      'You can update your profile, export your data, and request account deletion.',
      'You can change consent settings from your profile page.',
      'You may contact support@anantakatha.in for privacy questions.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" subtitle="How AnantaKatha collects, uses, protects, and shares user data." sections={sections} canonicalPath="/privacy-policy" />;
}