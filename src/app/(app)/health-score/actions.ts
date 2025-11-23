'use server';

import { calculateHealthScore } from '@/ai/flows/personalized-health-score';
import { z } from 'zod';

const healthScoreSchema = z.object({
  personalInformation: z.string().min(10, 'Please provide more personal information.'),
  diagnoses: z.string().min(1, 'Please provide your diagnoses.'),
  prescriptions: z.string().min(1, 'Please provide your prescriptions.'),
  fitnessTrackerData: z.string().min(10, 'Please provide more fitness tracker data.'),
});

export async function calculateHealthScoreAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = healthScoreSchema.safeParse({
    personalInformation: formData.get('personalInformation'),
    diagnoses: formData.get('diagnoses'),
    prescriptions: formData.get('prescriptions'),
    fitnessTrackerData: formData.get('fitnessTrackerData'),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      healthScore: null,
      insights: null,
      error: firstError ?? 'Invalid input.',
    };
  }

  try {
    const result = await calculateHealthScore(validatedFields.data);
    return {
      healthScore: result.healthScore,
      insights: result.insights,
      error: null,
    };
  } catch (e) {
    return {
      healthScore: null,
      insights: null,
      error: 'The AI model could not be reached. Please try again later.',
    };
  }
}
