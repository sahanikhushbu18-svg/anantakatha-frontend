import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { storiesApi } from '../api/stories';
import { Button, Card, Badge } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { formatDate } from '../utils/format';
import { getEntityId, unwrapItems } from '../utils/api';

export default function StoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stories, setStories] = useState([]);
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    storiesApi
      .listStories({
        status: status || undefined,
        page: 1,
        limit: 20,
        sort: '-createdAt',
      })
      .then((response) => setStories(unwrapItems({ data: response })))
      .finally(() => setLoading(false));
  }, [status]);

  const applyStatus = (nextStatus) => {
    setStatus(nextStatus);
    const params = new URLSearchParams(searchParams);
    if (nextStatus) {
      params.set('status', nextStatus);
    } else {
      params.delete('status');
    }
    setSearchParams(params);
  };

  return (
    <PageShell
      eyebrow="Story library"
      title="Stories"
      subtitle="Browse drafts, reviews, and published work from your account."
      action={<Link className="button primary" to="/stories/new">New story</Link>}
    >
      <div className="filter-row">
        {['', 'DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'REJECTED'].map((value) => (
          <Button key={value || 'ALL'} variant={status === value ? 'primary' : 'ghost'} onClick={() => applyStatus(value)}>
            {value || 'All'}
          </Button>
        ))}
      </div>

      {loading ? <p className="muted">Loading stories...</p> : null}

      <div className="story-grid">
        {stories.map((story) => (
          <Card key={getEntityId(story) || story.title} className="story-card">
            <div className="story-topline">
              <Badge tone={story.status === 'PUBLISHED' ? 'green' : story.status === 'PENDING_REVIEW' ? 'gold' : 'neutral'}>
                {story.status}
              </Badge>
              <span>{formatDate(story.createdAt)}</span>
            </div>
            <h3>{story.title}</h3>
            <p>{story.description || story.content?.slice(0, 140) || 'No description available.'}</p>
            <div className="tag-row">
              <Badge tone="rose">{story.genre}</Badge>
              {(story.tags || []).slice(0, 3).map((tag) => <Badge key={tag}>{tag}</Badge>)}
            </div>
            <div className="inline-actions">
              <Link className="button ghost" to={`/stories/${getEntityId(story)}`}>Open</Link>
              <Link className="button ghost" to={`/stories/${getEntityId(story)}/edit`}>Edit</Link>
            </div>
          </Card>
        ))}
      </div>

      {!loading && stories.length === 0 ? <p className="muted">No stories match the current filter.</p> : null}
    </PageShell>
  );
}