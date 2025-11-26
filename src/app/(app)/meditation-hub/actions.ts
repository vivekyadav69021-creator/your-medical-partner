'use server';

import { suggestMeditationForMood } from '@/ai/flows/mood-meditation-suggester-flow';
import { z } from 'zod';

const moodSchema = z.object({
  mood: z.string().min(3, 'Please describe your mood in a few words.'),
});

export async function getMoodSuggestionAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = moodSchema.safeParse({
    mood: formData.get('mood'),
  });

  if (!validatedFields.success) {
    return {
      suggestion: null,
      error: validatedFields.error.flatten().fieldErrors.mood?.[0] ?? 'Invalid input.',
    };
  }

  try {
    const result = await suggestMeditationForMood(validatedFields.data);
    return {
      suggestion: result,
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    return {
      suggestion: null,
      error: e.message || 'The AI model could not be reached. Please try again later.',
    };
  }
}
