'use server';

import { healthAssistant } from '@/ai/flows/health-assistant-flow';
import { speechToText } from '@/ai/flows/speech-to-text-flow';
import { z } from 'zod';
import { aiDoctorChat } from '@/ai/flows/ai-doctor-chat-flow';


const healthAssistantSchema = z.object({
  query: z.string().min(1, 'Please ask a detailed question.'),
  photoDataUri: z.string().optional(),
  language: z.enum(['en', 'hi']).optional(),
});

export async function healthAssistantAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = healthAssistantSchema.safeParse({
    query: formData.get('query'),
    photoDataUri: formData.get('photoDataUri') || undefined,
    language: formData.get('language') || 'en'
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
  } catch (e: any) {
    console.error("Health Assistant Action Error:", e);
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


const doctorChatSchema = z.object({
  query: z.string().min(1, 'Please ask a question.'),
  specialty: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
});

export async function aiDoctorChatAction(
  prevState: any,
  formData: FormData
) {
  const historyString = formData.get('history') as string;
  const history = historyString ? JSON.parse(historyString) : [];

  const validatedFields = doctorChatSchema.safeParse({
    query: formData.get('query'),
    specialty: formData.get('specialty'),
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
    const result = await aiDoctorChat(validatedFields.data);
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