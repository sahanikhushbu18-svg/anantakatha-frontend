import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { storiesApi } from '../api/stories';
import { Button, Card, Badge, TextArea } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { formatDate } from '../utils/format';
import { getEntityId, readMessage, unwrapData } from '../utils/api';

const commentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty'),
});

export default function StoryDetailPage() {
  const { storyId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [story, setStory] = useState(null);
  const [message, setMessage] = useState('');
  const invalidStoryId = !storyId || storyId === 'undefined' || storyId === 'null';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(commentSchema) });

  const loadStory = () => {
    if (invalidStoryId) {
      setMessage('Invalid story link. The selected story ID is missing.');
      setStory(null);
      return;
    }

    storiesApi.getStory(storyId).then((response) => setStory(unwrapData({ data: response })));
  };

  useEffect(() => {
    loadStory();
  }, [storyId]);

  const handleLike = async () => {
    try {
      await storiesApi.likeStory(storyId);
      loadStory();
    } catch (error) {
      setMessage(readMessage(error, 'Unable to like story'));
    }
  };

  const onComment = async ({ text }) => {
    try {
      await storiesApi.commentStory(storyId, { text });
      reset();
      loadStory();
    } catch (error) {
      setMessage(readMessage(error, 'Unable to add comment'));
    }
  };

  return (
    <PageShell
      eyebrow="Story details"
      title={story?.title || (invalidStoryId ? 'Story not found' : 'Loading story...')}
      subtitle={
        story
          ? `${story.genre} • ${formatDate(story.createdAt)}`
          : invalidStoryId
            ? 'The story link is missing a valid ID.'
            : 'Fetching the selected story.'
      }
      action={
        story && !invalidStoryId ? (
          <div className="inline-actions">
            <Link className="button ghost" to={`/stories/${getEntityId(story)}/edit`}>Edit story</Link>
            <Link className="button ghost" to={`/stories/${getEntityId(story)}/customize`}>Customize</Link>
          </div>
        ) : null
      }
    >
      {story ? (
        <div className="story-detail">
          <div className="detail-meta">
            <Badge tone={story.status === 'PUBLISHED' ? 'green' : 'gold'}>{story.status}</Badge>
            <span>By {story.author?.firstName || story.authorName || 'Unknown author'}</span>
          </div>
          <p className="story-body">{story.content}</p>
          {story.tags?.length ? (
            <div className="tag-row">
              {story.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
            </div>
          ) : null}

          <div className="inline-actions">
            <Button type="button" onClick={handleLike}>Like ({story.stats?.likes || story.likesCount || 0})</Button>
            {story.status === 'DRAFT' ? <Link className="button ghost" to="/generate">Generate more</Link> : null}
          </div>

          <Card>
            <h3>Comments</h3>
            <div className="stack compact comments-list">
              {(story.comments || []).map((comment) => (
                <div key={comment.commentId || comment._id || comment.id} className="mini-row">
                  <div>
                    <strong>{comment.author?.firstName || comment.authorName || 'Reader'}</strong>
                    <p>{comment.text}</p>
                  </div>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              ))}
            </div>
            {story.commentPagination?.pages > 1 ? <p className="muted">Showing page {story.commentPagination.page} of {story.commentPagination.pages}</p> : null}

            <form className="stack compact" onSubmit={handleSubmit(onComment)} noValidate>
              <TextArea label="Add a comment" rows="4" error={errors.text?.message} {...register('text')} />
              {message ? <p className="form-message error">{message}</p> : null}
              {user ? <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Posting...' : 'Post comment'}</Button> : null}
            </form>
          </Card>
        </div>
      ) : (
        <p className="muted">{message || 'Loading story...'}</p>
      )}
    </PageShell>
  );
}