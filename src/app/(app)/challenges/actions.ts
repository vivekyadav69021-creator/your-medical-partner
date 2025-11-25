'use server';

import { generateChallenge } from '@/ai/flows/challenge-generator-flow';
import { z } from 'zod';

const challengeSchema = z.object({
  routineDescription: z
    .string()
    .min(20, 'Please provide a more detailed description of your routine and goals.'),
});

export async function generateChallengeAction(prevState: any, formData: FormData) {
  const validatedFields = challengeSchema.safeParse({
    routineDescription: formData.get('routine-description'),
  });

  if (!validatedFields.success) {
    return {
      challenge: null,
      error:
        validatedFields.error.flatten().fieldErrors.routineDescription?.[0] ??
        'Invalid input.',
    };
  }

  try {
    const result = await generateChallenge(validatedFields.data);
    return {
      challenge: result,
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    return {
      challenge: null,
      error: e.message || 'The AI model could not be reached. Please try again later.',
    };
  }
}
