'use server';

import { featureAssistant, FeatureAssistantInput } from '@/ai/flows/feature-assistant-flow';
import { speechToText, SpeechToTextInput } from '@/ai/flows/speech-to-text-flow';
import { z } from 'zod';

const assistantSchema = z.object({
  query: z.string().min(1, 'Query is empty.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
});

export async function getAssistantResponseAction(
  prevState: any,
  formData: FormData
) {
  const historyString = formData.get('history') as string;
  const history = historyString ? JSON.parse(historyString) : [];

  const validatedFields = assistantSchema.safeParse({
    query: formData.get('query'),
    history: history,
  });

  if (!validatedFields.success) {
    return {
      result: null,
      error: 'Invalid input.',
    };
  }

  try {
    const result = await featureAssistant(validatedFields.data as FeatureAssistantInput);
    return {
      result,
      error: null,
    };
  } catch (e: any) {
    console.error("Assistant Action Error:", e);
    return {
      result: null,
      error: e.message || 'The AI model could not be reached. Please try again.',
    };
  }
}

const speechSchema = z.object({
    audioDataUri: z.string().min(1, 'No audio data provided.'),
});

export async function speechToTextAction(prevState: any, formData: FormData) {
  const validatedFields = speechSchema.safeParse({
    audioDataUri: formData.get('audioDataUri'),
  });

  if (!validatedFields.success) {
    return { transcript: null, error: validatedFields.error.flatten().fieldErrors.audioDataUri?.[0] };
  }

  try {
    const result = await speechToText(validatedFields.data as SpeechToTextInput);
    return { transcript: result.transcript, error: null };
  } catch (e: any) {
    console.error(e);
    return {
      transcript: null,
      error: e.message || 'Could not transcribe audio.',
    };
  }
}
