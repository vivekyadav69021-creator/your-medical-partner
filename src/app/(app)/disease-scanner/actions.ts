'use server';

import { healthAssistant } from '@/ai/flows/health-assistant-flow';
import { z } from 'zod';

const diseaseScannerSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  photoDataUri: z.string().optional(),
});

export async function diseaseScannerAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = diseaseScannerSchema.safeParse({
    description: formData.get('description'),
    photoDataUri: formData.get('photoDataUri') || undefined,
  });

  if (!validatedFields.success) {
    return {
      response: null,
      error:
        validatedFields.error.flatten().fieldErrors.description?.[0] ??
        'Invalid input.',
    };
  }

  if (!validatedFields.data.photoDataUri) {
    return {
      response: null,
      error: 'Please upload an image to be scanned.',
    };
  }

  try {
    const result = await healthAssistant(validatedFields.data);
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
