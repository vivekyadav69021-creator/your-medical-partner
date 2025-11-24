'use server';

import { healthAssistant } from '@/ai/flows/health-assistant-flow';
import { speechToText } from '@/ai/flows/speech-to-text-flow';
import { z } from 'zod';

const healthAssistantSchema = z.object({
  query: z.string().min(3, 'Please ask a more detailed question.'),
  photoDataUri: z.string().optional(),
});

export async function healthAssistantAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = healthAssistantSchema.safeParse({
    query: formData.get('query'),
    photoDataUri: formData.get('photoDataUri') || undefined,
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
    const result = await healthAssistant(validatedFields.data);
    return {
      response: result.response,
      error: null,
    };
  } catch (e) {
    return {
      response: null,
      error: 'The AI model could not be reached. Please try again later.',
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
