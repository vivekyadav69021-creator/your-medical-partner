'use server';

import { analyzeXray } from '@/ai/flows/xray-analyzer-flow';
import { healthAssistant } from '@/ai/flows/health-assistant-flow';
import { z } from 'zod';

const xrayScannerSchema = z.object({
  photoDataUri: z.string().min(1, 'Please upload an image to be scanned.'),
});

export async function analyzeXrayAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = xrayScannerSchema.safeParse({
    photoDataUri: formData.get('photoDataUri'),
  });

  if (!validatedFields.success) {
    return {
      result: null,
      error:
        validatedFields.error.flatten().fieldErrors.photoDataUri?.[0] ??
        'Invalid input.',
    };
  }
  
  try {
    const result = await analyzeXray(validatedFields.data);
    if (result.status === 'error') {
        return { result: null, error: result.error || 'Analysis failed.' };
    }
    return {
      result: result,
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    return {
      result: null,
      error: e.message || 'The AI model could not be reached. Please try again later.',
    };
  }
}


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
