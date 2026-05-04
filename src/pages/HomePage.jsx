import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BrandMark } from '../components/BrandMark';
import { Card } from '../components/UI';
import { Seo } from '../components/Seo';

export default function HomePage() {
  const { status, hydrated } = useSelector((state) => state.auth);

  if (hydrated && status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Seo title="AnantaKatha | AI Storytelling Platform" description="Create, publish, and manage stories with AnantaKatha's AI storytelling platform." canonicalPath="/" />
      <div className="home-layout">
        <section className="hero-panel">
          <div className="hero-copy">
            <BrandMark />
            <h1>Build, verify, and publish stories from one focused interface.</h1>
            <p>
              AnantaKatha keeps the public surface clean while supporting secure sign-in, story workflows, and account recovery behind the scenes.
            </p>
            <div className="hero-actions">
              <Link className="button primary" to="/signup">Create account</Link>
              <Link className="button ghost" to="/login">Login</Link>
            </div>
          </div>

          <Card className="hero-card platform-preview">
            <p className="eyebrow">Platform preview</p>
            <h2>Studio snapshot</h2>
            <div className="preview-metrics">
              <div>
                <span>Drafts</span>
                <strong>12</strong>
              </div>
              <div>
                <span>In review</span>
                <strong>4</strong>
              </div>
              <div>
                <span>Published</span>
                <strong>28</strong>
              </div>
            </div>
            <div className="preview-feed">
              <div className="preview-row">
                <span className="preview-dot draft" />
                <div>
                  <strong>New draft created</strong>
                  <p>Story Editor updated a fantasy draft just now.</p>
                </div>
              </div>
              <div className="preview-row">
                <span className="preview-dot review" />
                <div>
                  <strong>Pending review</strong>
                  <p>Moderation queue has 4 items waiting.</p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
