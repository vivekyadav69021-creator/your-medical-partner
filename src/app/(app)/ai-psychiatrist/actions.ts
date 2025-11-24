'use server';

import { aiPsychiatrist, AIPsychiatristInput } from '@/ai/flows/ai-psychiatrist-flow';
import { speechToText } from '@/ai/flows/speech-to-text-flow';
import { z } from 'zod';

const psychiatristSchema = z.object({
  query: z.string().min(1, 'Please share what is on your mind.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
});

export async function aiPsychiatristAction(
  prevState: any,
  formData: FormData
) {
  const historyString = formData.get('history') as string;
  const history = historyString ? JSON.parse(historyString) : [];

  const validatedFields = psychiatristSchema.safeParse({
    query: formData.get('query'),
    history: history,
  });

  if (!validatedFields.success) {
    return {
      response: null,
      error:
        validatedFields.error.flatten().fieldErrors.query?.[0] ??
        'Invalid input.',
    };
  }

  try {
    const result = await aiPsychiatrist(validatedFields.data);
    return {
      response: result.response,
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    return {
      response: null,
      error: e.message || 'The AI model could not be reached. Please try again later.',
    };
  }
}

export async function speechToTextAction(prevState: any, formData: FormData) {
  const audioDataUri = formData.get('audioDataUri');

  if (!audioDataUri) {
    return { transcript: null, error: 'No audio data provided.' };
  }

  try {
    const result = await speechToText({ audioDataUri: audioDataUri as string });
    return { transcript: result.transcript, error: null };
  } catch (e: any) {
    console.error(e);
    return {
      transcript: null,
      error: e.message || 'Could not transcribe audio.',
    };
  }
}
