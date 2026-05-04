import React from 'react';
import { LegalPage } from '../components/LegalPage';

const sections = [
  {
    title: 'Data rights',
    points: [
      'You can access and export your profile and activity data from the profile page.',
      'You can request profile updates, email changes, and account deletion.',
      'We store only the data needed to operate the service, keep it secure, and meet legal obligations.',
    ],
  },
  {
    title: 'Email changes',
    points: [
      'Changing your email requires verification of both the current email and the new email address.',
      'This helps protect your account from unauthorized changes.',
      'The account is updated only after both verification links are confirmed.',
    ],
  },
  {
    title: 'Contact',
    points: [
      'Email: support@anantakatha.in',
      'Phone: 7398591393',
      'Address: Sec 5, GIDA, Gorakhpur, Uttar Pradesh 273209',
    ],
  },
];

export default function DataPolicyPage() {
  return <LegalPage title="User Data Policy" subtitle="How we handle personal data, verification, and account changes on AnantaKatha." sections={sections} canonicalPath="/data-policy" />;
}