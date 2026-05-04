import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { storiesApi } from '../api/stories';
import { Button, Field, TextArea } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { getEntityId, readMessage, unwrapData } from '../utils/api';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  genre: z.string().min(1, 'Genre is required'),
  subGenres: z.string().optional(),
  tags: z.string().optional(),
  coverImageUrl: z.string().optional(),
});

const splitCsv = (value = '') => value.split(',').map((item) => item.trim()).filter(Boolean);

export default function StoryEditorPage() {
  const { storyId } = useParams();
  const isEdit = Boolean(storyId && storyId !== 'new');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });
  const [toast, setToast] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    storiesApi.getStory(storyId).then((response) => {
      const story = unwrapData({ data: response });
      reset({
        title: story.title || '',
        description: story.description || '',
        content: story.content || '',
        genre: story.genre || '',
        subGenres: (story.subGenres || []).join(', '),
        tags: (story.tags || []).join(', '),
        coverImageUrl: story.coverImageUrl || '',
      });
    });
  }, [isEdit, reset, storyId]);

  const onSubmit = async (values) => {
    try {
      setMessage('');
      const payload = {
        title: values.title,
        description: values.description,
        content: values.content,
        genre: values.genre,
        subGenres: splitCsv(values.subGenres),
        tags: splitCsv(values.tags),
        coverImageUrl: values.coverImageUrl || undefined,
      };

      const response = isEdit
        ? await storiesApi.updateStory(storyId, payload)
        : await storiesApi.createStory({ ...payload, aiGenerated: false });
      const result = unwrapData({ data: response });
      const savedId = getEntityId(result);

      const title = result?.title || payload.title || 'Story saved';
      setToast(`Saved draft: ${title}`);

      // prefer returned id, but if updating an existing draft the current `storyId` is valid
      const finalId = savedId || (isEdit ? storyId : null);
      if (!finalId) {
        let debugVal = '';
        try {
          debugVal = JSON.stringify(result);
        } catch (e) {
          debugVal = String(result);
        }
        console.error('Saved story responded without id:', result);
        setMessage(`Save succeeded but no story ID was returned. Response: ${debugVal.slice(0, 1000)}`);
        return;
      }

      setTimeout(() => {
        navigate(`/stories/${finalId}`);
      }, 1200);
    } catch (error) {
      setMessage(readMessage(error, 'Unable to save story'));
    }
  };

  const handlePublish = async () => {
    if (!storyId || storyId === 'new') {
      setMessage('Save your story first before submitting for review');
      return;
    }

    try {
      setPublishing(true);
      await storiesApi.publishStory(storyId);
      const title = getValues ? getValues('title') : '';
      setToast(`Submitted for review${title ? `: ${title}` : ''}. An admin will review and publish it soon.`);
      setTimeout(() => {
        navigate(`/stories/${storyId}`);
      }, 1200);
    } catch (error) {
      setMessage(readMessage(error, 'Unable to submit story for review'));
    } finally {
      setPublishing(false);
    }
  };

  return (
      <PageShell
        eyebrow={isEdit ? 'Edit story' : 'New story'}
        title={isEdit ? 'Update your draft' : 'Create a story'}
        subtitle="Write directly or start from an AI-generated outline and then polish it here."
        action={
          isEdit ? (
            <div className="inline-actions">
              <Button variant="ghost" onClick={handlePublish} disabled={publishing} title="Submit your draft to admins for review. They will publish it if approved.">{publishing ? 'Submitting...' : 'Submit for Review'}</Button>
              <Link className="button ghost" to={`/stories/${storyId}/customize`}>Customize</Link>
            </div>
          ) : null
        }
      >
      {toast ? <div className="status-toast success">{toast}</div> : null}
      <form className="stack" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Title" error={errors.title?.message} {...register('title')} />
        <Field label="Genre" error={errors.genre?.message} {...register('genre')} />
        <Field label="Description" error={errors.description?.message} {...register('description')} />
        <TextArea label="Content" rows="10" error={errors.content?.message} {...register('content')} />
        <Field label="Sub-genres, comma separated" error={errors.subGenres?.message} {...register('subGenres')} />
        <Field label="Tags, comma separated" error={errors.tags?.message} {...register('tags')} />
        <Field label="Cover image URL" error={errors.coverImageUrl?.message} {...register('coverImageUrl')} />
        {message ? <p className="form-message error">{message}</p> : null}
        <div className="inline-actions">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save story'}</Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/stories')}>Back to stories</Button>
        </div>
      </form>
    </PageShell>
  );
}