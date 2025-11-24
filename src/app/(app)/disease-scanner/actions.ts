'use server';

import { healthAssistant } from '@/ai/flows/health-assistant-flow';
import { z } from 'zod';

const diseaseScannerSchema = z.object({
  description: z.string().optional(),
  photoDataUri: z.string().optional(),
});

export async function diseaseScannerAction(
  prevState: any,
  formData: FormData
) {

  const descriptionValue = formData.get('description');

  const validatedFields = diseaseScannerSchema.safeParse({
    description: descriptionValue || 'Analyze the attached image.',
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

  // Use a default query if the description is empty
  const query = validatedFields.data.description || 'Analyze the attached image.';

  try {
    const result = await healthAssistant({
        query: query,
        photoDataUri: validatedFields.data.photoDataUri
    });
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
