'use server';

import { healthAssistant } from '@/ai/flows/health-assistant-flow';
import { z } from 'zod';

const healthAssistantSchema = z.object({
  query: z.string().min(3, 'Please ask a more detailed question.'),
});

export async function healthAssistantAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = healthAssistantSchema.safeParse({
    query: formData.get('query'),
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
