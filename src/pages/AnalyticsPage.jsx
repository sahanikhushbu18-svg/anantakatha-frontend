import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { analyticsApi } from '../api/analytics';
import { Badge, Button, Card } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { formatDate } from '../utils/format';
import { readMessage } from '../utils/api';

const periods = [7, 30, 90];

const StatCard = ({ label, value }) => (
  <Card className="stat-card">
    <span>{label}</span>
    <strong>{value}</strong>
  </Card>
);

export default function AnalyticsPage() {
  const { user } = useSelector((state) => state.auth);
  const [days, setDays] = useState(30);
  const [mySummary, setMySummary] = useState(null);
  const [adminSummary, setAdminSummary] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setMessage('');
        const my = await analyticsApi.mySummary(days);
        if (mounted) {
          setMySummary(my);
        }

        if (user?.userType === 'ADMIN') {
          const admin = await analyticsApi.adminSummary(days);
          if (mounted) {
            setAdminSummary(admin);
          }
        }
      } catch (error) {
        if (mounted) {
          setMessage(readMessage(error, 'Unable to load analytics'));
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [days, user?.userType]);

  const myTotals = mySummary?.totals || {};
  const adminTotals = adminSummary?.totals || {};

  return (
    <PageShell
      eyebrow="Insights"
      title="Analytics dashboard"
      subtitle="Track writing activity, audience signals, and engagement trends."
    >
      <div className="filter-row">
        {periods.map((period) => (
          <Button key={period} variant={days === period ? 'primary' : 'ghost'} onClick={() => setDays(period)}>
            Last {period} days
          </Button>
        ))}
      </div>

      {message ? <p className="form-message error">{message}</p> : null}

      <Card>
        <h3>Your activity</h3>
        <div className="stat-grid">
          <StatCard label="Story views" value={myTotals.STORY_VIEW || 0} />
          <StatCard label="Story likes" value={myTotals.STORY_LIKE || 0} />
          <StatCard label="Comments" value={myTotals.STORY_COMMENT || 0} />
          <StatCard label="AI generations" value={myTotals.AI_GENERATION || 0} />
        </div>
      </Card>

      <Card>
        <h3>Recent events</h3>
        <div className="stack compact">
          {(mySummary?.recentEvents || []).slice(0, 15).map((event) => (
            <div key={event.eventId} className="mini-row">
              <div>
                <Badge tone="gold">{event.eventType}</Badge>
                <p>{event.storyId ? `Story: ${event.storyId}` : 'Platform event'}</p>
              </div>
              <span>{formatDate(event.createdAt)}</span>
            </div>
          ))}
          {mySummary?.recentEvents?.length === 0 ? <p className="muted">No events in this period.</p> : null}
        </div>
      </Card>

      {user?.userType === 'ADMIN' ? (
        <Card>
          <h3>Platform overview (admin)</h3>
          <div className="stat-grid">
            <StatCard label="Active users" value={adminSummary?.activeUsers || 0} />
            <StatCard label="Active stories" value={adminSummary?.activeStories || 0} />
            <StatCard label="Platform views" value={adminTotals.STORY_VIEW || 0} />
            <StatCard label="Platform comments" value={adminTotals.STORY_COMMENT || 0} />
          </div>
        </Card>
      ) : null}
    </PageShell>
  );
}
