import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { Seo } from '../components/Seo';

const sections = [
  {
    to: '/profile/details',
    title: 'Profile details',
    description: 'Update your name, bio, favorite genres, social links, and notification preferences.',
  },
  {
    to: '/profile/change-email',
    title: 'Change email',
    description: 'Move your account to a new email address with verification on both inboxes.',
  },
  {
    to: '/profile/change-password',
    title: 'Change password',
    description: 'Set a new password and keep your login secure across devices.',
  },
  {
    to: '/profile/export-data',
    title: 'Export my data',
    description: 'Download your profile, stories, sessions, and moderation history in JSON.',
  },
  {
    to: '/profile/delete-account',
    title: 'Delete account',
    description: 'Request permanent account deletion with a final password confirmation.',
  },
];

export default function ProfilePage() {
  return (
    <>
      <Seo title="Profile | AnantaKatha" description="Manage profile, email, password, data export, and account deletion settings." canonicalPath="/profile" />
      <PageShell eyebrow="Account center" title="Profile" subtitle="Choose the account setting you want to manage.">
        <div className="profile-hub">
          <Card className="profile-hub-banner">
            <p className="eyebrow">Account management</p>
            <h3>Professional controls for identity, security, and data.</h3>
            <p className="muted">Keep your profile details, recovery options, password, export rights, and deletion request in separate focused pages.</p>
          </Card>

          <div className="settings-grid">
          {sections.map((section) => (
            <Card key={section.to} className="settings-card">
              <h3 className="clamp-2">{section.title}</h3>
              <p className="clamp-3">{section.description}</p>
              <Link className="button ghost" to={section.to}>Open</Link>
            </Card>
          ))}
          </div>
        </div>
      </PageShell>
    </>
  );
}
