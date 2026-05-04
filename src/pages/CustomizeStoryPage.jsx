import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { storiesApi } from '../api/stories';
import { aiApi } from '../api/ai';
import { Button, Card, Field, TextArea, Select } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { readMessage, unwrapData } from '../utils/api';

const schema = z.object({
  tonePreset: z.string().optional(),
  toneCustom: z.string().optional(),
  stylePreset: z.string().optional(),
  styleCustom: z.string().optional(),
  language: z.string().optional(),
  instructions: z.string().optional(),
  aiModel: z.enum(['GEMINI', 'OPENAI']).optional(),
  length: z.enum(['SHORT', 'MEDIUM', 'LONG']).optional(),
});

export default function CustomizeStoryPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);

  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
  const tonePresets = ['Neutral', 'Formal', 'Casual', 'Humorous', 'Dark', 'Poetic'];
  const stylePresets = ['Clean', 'Atmospheric', 'High tension', 'Warm', 'Minimal', 'Lush'];
  const languageOptions = ['English', 'Hindi', 'Spanish', 'French', 'Arabic'];

  useEffect(() => {
    if (!storyId) return;
    storiesApi.getStory(storyId).then((response) => {
      const s = unwrapData({ data: response });
      setStory(s);
    }).catch(() => setMessage('Unable to load story'));
  }, [storyId]);

  const onCustomize = async (values) => {
    try {
      setMessage('');
      const toneParts = [values.tonePreset, values.toneCustom].filter(Boolean);
      const styleParts = [values.stylePreset, values.styleCustom, values.language ? `Language: ${values.language}` : '', values.instructions ? `Notes: ${values.instructions}` : ''].filter(Boolean);
      const payload = {
        customizations: {
          tone: toneParts.join(' | '),
          style: styleParts.join(' | '),
          length: values.length,
        },
      };

      const response = await aiApi.customizeStory(storyId, payload);
      const result = unwrapData({ data: response });
      setPreview(result.story || result);
    } catch (error) {
      setMessage(readMessage(error, 'Unable to customize story'));
    }
  };

  const savePreview = async () => {
    if (!preview) return;
    try {
      setMessage('');
      const payload = {
        title: preview.title || story.title,
        description: preview.description || story.description,
        content: preview.content || preview.story || story.content,
        genre: preview.genre || story.genre,
        subGenres: preview.subGenres || (story.subGenres || []),
        tags: preview.tags || (story.tags || []),
      };
      await storiesApi.updateStory(storyId, payload);
      navigate(`/stories/${storyId}`);
    } catch (error) {
      setMessage(readMessage(error, 'Unable to save customized story'));
    }
  };

  return (
    <PageShell eyebrow="AI" title="Customize story" subtitle="Apply tone, style, length, or model customizations to this draft.">
      <div className="generator-grid">
        <form className="stack" onSubmit={handleSubmit(onCustomize)} noValidate>
          <Select label="AI model" {...register('aiModel')}>
            <option value="GEMINI">Gemini</option>
            <option value="OPENAI">OpenAI</option>
          </Select>
          <Select label="Length" {...register('length')}>
            <option value="SHORT">Short</option>
            <option value="MEDIUM">Medium</option>
            <option value="LONG">Long</option>
          </Select>
          <Select label="Tone preset" {...register('tonePreset')}>
            <option value="">Select a preset</option>
            {tonePresets.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Field label="Tone (custom)" placeholder="Add a custom tone note" {...register('toneCustom')} />
          <Select label="Style preset" {...register('stylePreset')}>
            <option value="">Select a preset</option>
            {stylePresets.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </Select>
          <Field label="Style (custom)" placeholder="Add a custom style note" {...register('styleCustom')} />
          <Select label="Language" {...register('language')}>
            <option value="">Select a language</option>
            {languageOptions.map((language) => (
              <option key={language} value={language}>{language}</option>
            ))}
          </Select>
          <TextArea label="Additional instructions" rows="3" placeholder="Add a few extra directions for the story tone, pacing, or theme." {...register('instructions')} />
          {message ? <p className="form-message error">{message}</p> : null}
          <Button type="submit">Customize</Button>
        </form>

        <Card>
          <h3>Current</h3>
          {story ? (
            <>
              <h4>{story.title}</h4>
              <p className="story-body compact">{story.content}</p>
            </>
          ) : (
            <p className="muted">Loading story...</p>
          )}

          <hr />

          <h3>Preview</h3>
          {preview ? (
            <>
              <h4>{preview.title || 'Preview'}</h4>
              <p className="story-body compact">{preview.content || preview.story}</p>
              <div className="inline-actions">
                <Button type="button" onClick={savePreview}>Save preview</Button>
                <Button type="button" variant="ghost" onClick={() => setPreview(null)}>Discard</Button>
              </div>
            </>
          ) : (
            <p className="muted">No preview yet. Customize to see a preview.</p>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
