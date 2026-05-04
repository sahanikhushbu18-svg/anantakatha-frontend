import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storiesApi } from '../api/stories';
import { Card } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { formatDate, initials } from '../utils/format';
import { unwrapItems, getEntityId, readMessage } from '../utils/api';

export default function PublishedStoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    setMessage('');
    storiesApi
      .listPublicStories({ page: 1, limit: 24, sort: '-createdAt' })
      .then((response) => setStories(unwrapItems({ data: response })))
      .catch((error) => {
        setStories([]);
        setMessage(readMessage(error, 'Published stories are not available from the current API endpoint.'));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell eyebrow="Explore" title="Published stories" subtitle="Browse work published on AnantaKatha by our authors.">
      {loading ? <p className="muted">Loading published stories...</p> : null}

      <div className="story-grid">
        {stories.map((story) => (
          <Card key={getEntityId(story) || story.title} className="story-card">
            <div className="story-topline">
              <span>{formatDate(story.createdAt)}</span>
              <span>{story.genre}</span>
            </div>
            <h3>{story.title}</h3>
            <p>{story.description || 'No description available.'}</p>
            <div className="tag-row">
              <span className="published-meta">Words: {story.wordCount || 0}</span>
              <span className="published-meta">Views: {story.views || 0}</span>
            </div>
            <div className="detail-meta">
              <div className="avatar-ring avatar-ring-sm">
                {story.author?.profileImage ? <img src={story.author.profileImage} alt={story.author?.firstName || 'Author'} /> : initials(story.author?.firstName, story.author?.lastName)}
              </div>
              <div>
                <strong>{story.author?.firstName || 'Unknown'} {story.author?.lastName || 'Author'}</strong>
                <p className="muted">Author</p>
              </div>
            </div>
            <div className="inline-actions">
              <Link className="button ghost" to={`/stories/${getEntityId(story)}`}>Read</Link>
            </div>
          </Card>
        ))}
      </div>

      {message ? <p className="form-message error">{message}</p> : null}
      {!loading && stories.length === 0 ? <p className="muted">No published stories yet.</p> : null}
    </PageShell>
  );
}
