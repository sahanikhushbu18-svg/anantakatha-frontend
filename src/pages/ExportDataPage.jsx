import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usersApi } from '../api/users';
import { Button, Card } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { Seo } from '../components/Seo';
import { readMessage } from '../utils/api';

export default function ExportDataPage() {
  const [message, setMessage] = useState('');

  const exportMyData = async () => {
    try {
      setMessage('');
      const payload = await usersApi.exportData();
      const content = JSON.stringify(payload, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `anantakatha-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setMessage('Data export downloaded successfully.');
    } catch (error) {
      setMessage(readMessage(error, 'Unable to export data'));
    }
  };

  return (
    <>
      <Seo title="Export data | AnantaKatha" description="Download the personal data stored in your AnantaKatha account." canonicalPath="/profile/export-data" />
      <PageShell eyebrow="Account center" title="Export my data" subtitle="Download a JSON archive of the personal data connected to your account.">
        <Card className="settings-card">
          <p className="muted">Your export can include profile details, story records, moderation activity, and session-related account history depending on backend policy.</p>
          <ul className="info-list">
            <li>Profile identity and preferences.</li>
            <li>Stories, drafts, and publishing history.</li>
            <li>Session and moderation records available to your account.</li>
          </ul>
          {message ? <p className="form-message">{message}</p> : null}
          <div className="inline-actions">
            <Button type="button" onClick={exportMyData}>Export my data (JSON)</Button>
            <Link className="button ghost" to="/profile">Back to profile</Link>
          </div>
        </Card>
      </PageShell>
    </>
  );
}
