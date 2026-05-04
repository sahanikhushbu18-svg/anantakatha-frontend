import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';

export default function NotFoundPage() {
  return (
    <PageShell eyebrow="Lost in the archive" title="Page not found" subtitle="The page you requested does not exist.">
      <div className="center-stack">
        <Link className="button primary" to="/">Go home</Link>
      </div>
    </PageShell>
  );
}