'use server';

import { analyzeXray } from '@/ai/flows/xray-analyzer-flow';
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
