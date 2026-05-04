import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authApi } from '../api/auth';
import { storiesApi } from '../api/stories';
import { Button, Card, Badge } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { formatDate, initials } from '../utils/format';
import { getEntityId, unwrapItems } from '../utils/api';

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(user);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    let mounted = true;

    authApi.me().then((data) => {
      if (mounted) {
        setProfile(data.user || data);
      }
    });

    storiesApi.listStories({ limit: 6, sort: '-createdAt' }).then((response) => {
      if (mounted) {
        setStories(unwrapItems({ data: response }));
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    { label: 'Membership', value: profile?.userType || 'USER' },
    { label: 'Favorite genres', value: profile?.favoriteGenres?.length || 0 },
    { label: 'Stories', value: stories.length },
  ];
  const recentStories = stories.slice(0, 4);

  return (
    <PageShell
      eyebrow="Your workspace"
      title={`Welcome back, ${profile?.firstName || 'reader'}`}
      subtitle="Manage your profile, write stories, and review recent activity from one place."
      action={<Link className="button primary" to="/generate">Generate story</Link>}
    >
      <div className="dashboard-grid">
        <section className="dashboard-main">
          <Card className="dashboard-hero-card">
            <div>
              <p className="eyebrow">Workspace overview</p>
              <h3>Everything you need to write, review, and publish stories.</h3>
              <p className="muted">Use the quick actions to jump straight into drafting, then track your recent stories and account status from one place.</p>
            </div>
            <div className="hero-mini-grid">
              <div>
                <span>Account</span>
                <strong>{profile?.userType || 'USER'}</strong>
              </div>
              <div>
                <span>Stories</span>
                <strong>{stories.length}</strong>
              </div>
              <div>
                <span>Genres</span>
                <strong>{profile?.favoriteGenres?.length || 0}</strong>
              </div>
            </div>
          </Card>

          <div className="stat-grid">
            {stats.map((stat) => (
              <Card key={stat.label} className="stat-card">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </Card>
            ))}
          </div>

          <Card className="profile-card">
            <div className="avatar-ring">{initials(profile?.firstName, profile?.lastName)}</div>
            <div>
              <h3>{profile?.firstName} {profile?.lastName}</h3>
              <p>{profile?.email}</p>
              <p>Last updated {formatDate(profile?.updatedAt || profile?.createdAt)}</p>
            </div>
          </Card>
        </section>

        <aside className="dashboard-side">
          <Card>
            <h3>Quick actions</h3>
            <div className="stack compact">
              <Link className="button ghost" to="/stories/new">Write a story</Link>
              <Link className="button ghost" to="/stories">Review drafts</Link>
              <Link className="button ghost" to="/profile">Update profile</Link>
              {profile?.userType === 'ADMIN' ? <Link className="button ghost" to="/admin">Open admin</Link> : null}
            </div>
          </Card>

          <Card>
            <h3>Recent stories</h3>
            <div className="stack compact">
              {recentStories.map((story) => (
                <div key={getEntityId(story) || story.title} className="mini-row dashboard-story-row">
                  <div>
                    <strong className="clamp-2">{story.title}</strong>
                    <p className="clamp-1">{story.genre}</p>
                  </div>
                  <Badge tone={story.status === 'PUBLISHED' ? 'green' : 'gold'}>{story.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}