import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { aiApi } from '../api/ai';
import { storiesApi } from '../api/stories';
import { Button, Card, Field, TextArea, Select } from '../components/UI';
import { PageShell } from '../components/PageShell';
import { readMessage, unwrapData } from '../utils/api';
import { getEntityId } from '../utils/api';

const schema = z.object({
  genre: z.string().min(1, 'Genre is required'),
  prompt: z.string().min(1, 'Prompt is required'),
  tonePreset: z.string().optional(),
  toneOfVoice: z.string().optional(),
  stylePreset: z.string().optional(),
  style: z.string().optional(),
  language: z.string().optional(),
  aiModel: z.enum(['GEMINI', 'OPENAI']).default('GEMINI'),
  customizationLevel: z.string().optional(),
  lengthPreference: z.enum(['Short', 'Medium', 'Long']).default('Medium'),
  includeCharacterArcs: z.boolean().optional(),
  numberOfCharacters: z.coerce.number().min(1).max(20).default(3),
  promptNotes: z.string().optional(),
});

export default function GenerateStoryPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [generatedStory, setGeneratedStory] = useState(null);
  const tonePresets = ['Neutral', 'Warm', 'Bold', 'Suspenseful', 'Playful', 'Poetic'];
  const stylePresets = ['Clean', 'Atmospheric', 'Cinematic', 'Minimal', 'Lush', 'Fast-paced'];
  const languageOptions = ['English', 'Hindi', 'Spanish', 'French', 'Arabic'];
  const customizationOptions = ['Light', 'Balanced', 'Deep', 'Experimental'];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      aiModel: 'GEMINI',
      lengthPreference: 'Medium',
      includeCharacterArcs: false,
      numberOfCharacters: 3,
    },
  });

  const onSubmit = async (values) => {
    try {
      setMessage('');
      const response = await aiApi.generateStory({
        ...values,
        prompt: [values.prompt, values.promptNotes ? `Additional notes: ${values.promptNotes}` : ''].filter(Boolean).join('\n\n'),
      });
      const payload = unwrapData({ data: response });
      setGeneratedStory(payload.story || payload);
    } catch (error) {
      setMessage(readMessage(error, 'Unable to generate story'));
    }
  };

  const saveDraft = async () => {
    if (!generatedStory) {
      return;
    }

    const payload = {
      title: generatedStory.title || 'AI Generated Story',
      description: generatedStory.description || '',
      content: generatedStory.content || generatedStory.story || '',
      genre: generatedStory.genre || 'General',
      subGenres: generatedStory.subGenres || [],
      tags: generatedStory.tags || [],
      aiGenerated: true,
      aiModel: generatedStory.aiModel || 'GEMINI',
      aiPrompt: generatedStory.aiPrompt || '',
      customizationLevel: generatedStory.customizationLevel || '',
    };

    const response = await storiesApi.createStory(payload);
    const savedStory = unwrapData({ data: response });
    navigate(`/stories/${getEntityId(savedStory)}`);
  };

  return (
    <PageShell
      eyebrow="AI workshop"
      title="Generate story"
      subtitle="Draft a story from a prompt, then save it as a draft for review or publish later."
    >
      <div className="generator-grid">
        <form className="stack" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field label="Genre" error={errors.genre?.message} {...register('genre')} />
          <TextArea label="Prompt" rows="5" error={errors.prompt?.message} {...register('prompt')} />
          <TextArea label="Prompt notes" rows="3" placeholder="Add extra directions, themes, or scene details." {...register('promptNotes')} />
          <div className="field-row">
            <Select label="Tone preset" error={errors.tonePreset?.message} {...register('tonePreset')}>
              <option value="">Select a preset</option>
              {tonePresets.map((tone) => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </Select>
            <Field label="Tone (custom)" error={errors.toneOfVoice?.message} {...register('toneOfVoice')} />
          </div>
          <div className="field-row">
            <Select label="Style preset" error={errors.stylePreset?.message} {...register('stylePreset')}>
              <option value="">Select a preset</option>
              {stylePresets.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </Select>
            <Field label="Style (custom)" error={errors.style?.message} {...register('style')} />
          </div>
          <div className="field-row">
            <Select label="Language" error={errors.language?.message} {...register('language')}>
              <option value="">Select a language</option>
              {languageOptions.map((language) => (
                <option key={language} value={language}>{language}</option>
              ))}
            </Select>
            <Select label="AI model" error={errors.aiModel?.message} {...register('aiModel')}>
              <option value="GEMINI">Gemini</option>
              <option value="OPENAI">OpenAI</option>
            </Select>
          </div>
          <div className="field-row">
            <Select label="Customization depth" error={errors.customizationLevel?.message} {...register('customizationLevel')}>
              <option value="">Select a level</option>
              {customizationOptions.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </Select>
            <Select label="Length" error={errors.lengthPreference?.message} {...register('lengthPreference')}>
              <option value="Short">Short</option>
              <option value="Medium">Medium</option>
              <option value="Long">Long</option>
            </Select>
          </div>
          <div className="field-row">
            <Field label="Number of characters" type="number" error={errors.numberOfCharacters?.message} {...register('numberOfCharacters')} />
            <label className="check-row inline-offset">
              <input type="checkbox" {...register('includeCharacterArcs')} />
              <span>Include character arcs</span>
            </label>
          </div>
          {message ? <p className="form-message error">{message}</p> : null}
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Generating...' : 'Generate story'}</Button>
        </form>

        <Card className="preview-card">
          <h3>Preview</h3>
          {generatedStory ? (
            <>
              <h4>{generatedStory.title || 'Generated story'}</h4>
              <p>{generatedStory.description}</p>
              <p className="story-body compact">{generatedStory.content || generatedStory.story}</p>
              <Button type="button" onClick={saveDraft}>Save as draft</Button>
            </>
          ) : (
            <p className="muted">Your generated story will appear here.</p>
          )}
        </Card>
      </div>
    </PageShell>
  );
}