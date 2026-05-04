import React, { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { analyticsApi } from '../api/analytics';
import { systemApi } from '../api/system';
import { Button, Card, Field, Badge } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { formatDate } from '../utils/format';
import { readMessage, unwrapItems, getEntityId } from '../utils/api';

const tabs = ['stories', 'users', 'logs', 'analytics'];

export default function AdminPage() {
  const [tab, setTab] = useState('stories');
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [message, setMessage] = useState('');
  const [health, setHealth] = useState(null);
  const [moderation, setModeration] = useState({});

  const loadData = () => {
    if (tab === 'stories') {
      adminApi.listPendingStories({ status: 'PENDING_REVIEW', page: 1, limit: 20 }).then((response) => setStories(unwrapItems({ data: response })));
    }
    if (tab === 'users') {
      adminApi.listUsers({ page: 1, limit: 20 }).then((response) => setUsers(unwrapItems({ data: response })));
    }
    if (tab === 'logs') {
      adminApi.getLogs({ page: 1, limit: 25 }).then((response) => setLogs(unwrapItems({ data: response })));
    }
    if (tab === 'analytics') {
      analyticsApi.adminSummary(30).then((response) => setAnalytics(response));
    }
  };

  useEffect(() => {
    loadData();
    systemApi.health().then((res) => setHealth(res)).catch(() => setHealth(null));
  }, [tab]);

  const approveStory = async (storyId) => {
    if (!storyId) {
      setMessage('Invalid story id');
      return;
    }

    try {
      await adminApi.approveStory(storyId, { reviewNotes: moderation[storyId]?.reviewNotes || '' });
      setMessage('');
      // Show success via brief pause/toast effect
      alert(`Story approved and published! It's now visible to all users.`);
      loadData();
    } catch (error) {
      setMessage(readMessage(error, 'Unable to approve and publish story'));
    }
  };

  const rejectStory = async (storyId) => {
    if (!storyId) {
      setMessage('Invalid story id');
      return;
    }

    try {
      await adminApi.rejectStory(storyId, { rejectionReason: moderation[storyId]?.rejectionReason || 'Rejected by admin' });
      setMessage('');
      alert(`Story rejected. The author has been notified.`);
      loadData();
    } catch (error) {
      setMessage(readMessage(error, 'Unable to reject story'));
    }
  };

  const suspendUser = async (userId) => {
    if (!userId) {
      setMessage('Invalid user id');
      return;
    }

    try {
      await adminApi.suspendUser(userId, {
        reason: moderation[userId]?.reason || 'Policy violation',
        duration: Number(moderation[userId]?.duration || 30),
        notifyUser: true,
      });
      loadData();
    } catch (error) {
      setMessage(readMessage(error, 'Unable to suspend user'));
    }
  };

  return (
    <PageShell eyebrow="Administration" title="Admin console" subtitle="Review stories, manage users, and inspect logs. Approve stories to publish them and make them visible to all users.">
      <div className="filter-row">
        {tabs.map((value) => (
          <Button key={value} variant={tab === value ? 'primary' : 'ghost'} onClick={() => setTab(value)}>
            {value}
          </Button>
        ))}
      </div>
      {message ? <p className="form-message error">{message}</p> : null}

      {tab === 'stories' ? (
        <div className="stack">
          <p className="muted" style={{fontSize: '0.9rem'}}>📋 Stories pending review are submitted by authors. Approve to publish (visible to all) or reject with feedback.</p>
          {stories.map((story) => {
            const id = getEntityId(story);
            const key = id || story.title;
            return (
              <Card key={key} className="admin-row">
                <div>
                  <Badge tone="gold">{story.status}</Badge>
                  <h3>{story.title}</h3>
                  <p>{story.description || story.content?.slice(0, 180)}</p>
                </div>
                <div className="stack compact admin-actions">
                  <Field label="Review notes" value={moderation[id]?.reviewNotes || ''} onChange={(event) => setModeration({ ...moderation, [id]: { ...moderation[id], reviewNotes: event.target.value } })} />
                  <Field label="Rejection reason" value={moderation[id]?.rejectionReason || ''} onChange={(event) => setModeration({ ...moderation, [id]: { ...moderation[id], rejectionReason: event.target.value } })} />
                  <div className="inline-actions">
                    <Button type="button" onClick={() => approveStory(id)} title="Approve and publish this story to make it visible to all users">Approve & Publish</Button>
                    <Button type="button" variant="ghost" onClick={() => rejectStory(id)}>Reject</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}

      <Card>
        <h3>Platform status</h3>
        <div className="stack compact">
          <div>
            <strong>Health</strong>
            <p className="muted">{health ? JSON.stringify(health) : 'Unavailable'}</p>
          </div>
        </div>
      </Card>

      {tab === 'users' ? (
        <div className="stack">
          {users.map((user) => {
            const id = getEntityId(user);
            const key = id || user.email;
            return (
              <Card key={key} className="admin-row">
                <div>
                  <h3>{user.firstName} {user.lastName}</h3>
                  <p>{user.email}</p>
                  <Badge tone={user.userType === 'ADMIN' ? 'rose' : 'neutral'}>{user.userType}</Badge>
                </div>
                <div className="stack compact admin-actions">
                  <Field label="Suspension reason" value={moderation[id]?.reason || ''} onChange={(event) => setModeration({ ...moderation, [id]: { ...moderation[id], reason: event.target.value } })} />
                  <Field label="Duration days" type="number" value={moderation[id]?.duration || 30} onChange={(event) => setModeration({ ...moderation, [id]: { ...moderation[id], duration: event.target.value } })} />
                  <Button type="button" variant="ghost" onClick={() => suspendUser(id)}>Suspend user</Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}

      {tab === 'logs' ? (
        <div className="stack">
          {logs.map((log) => (
            <Card key={log._id || log.id} className="mini-row">
              <div>
                <strong>{log.actionType}</strong>
                <p>{log.details || log.notes || 'System activity'}</p>
              </div>
              <span>{formatDate(log.createdAt)}</span>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === 'analytics' ? (
        <Card>
          <h3>Platform analytics (30 days)</h3>
          <div className="stat-grid">
            <Card className="stat-card"><span>Active users</span><strong>{analytics?.activeUsers || 0}</strong></Card>
            <Card className="stat-card"><span>Active stories</span><strong>{analytics?.activeStories || 0}</strong></Card>
            <Card className="stat-card"><span>Story views</span><strong>{analytics?.totals?.STORY_VIEW || 0}</strong></Card>
            <Card className="stat-card"><span>Story comments</span><strong>{analytics?.totals?.STORY_COMMENT || 0}</strong></Card>
          </div>
        </Card>
      ) : null}
    </PageShell>
  );
}