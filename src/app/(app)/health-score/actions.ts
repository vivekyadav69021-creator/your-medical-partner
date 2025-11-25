'use server';

import { createHealthPlan } from '@/ai/flows/personalized-health-score';
import { z } from 'zod';

const healthPlanSchema = z.object({
  age: z.string().min(1, 'Age is required.'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required.' }),
  healthGoals: z.string().min(3, 'Please describe your health goals.'),
  dietaryPreferences: z.string().min(2, 'Please state your dietary preferences.'),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active'], { required_error: 'Activity level is required.' }),
});

export async function createHealthPlanAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = healthPlanSchema.safeParse({
    age: formData.get('age'),
    gender: formData.get('gender'),
    healthGoals: formData.get('healthGoals'),
    dietaryPreferences: formData.get('dietaryPreferences'),
    activityLevel: formData.get('activityLevel'),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      plan: null,
      error: firstError ?? 'Invalid input.',
    };
  }

  try {
    const result = await createHealthPlan(validatedFields.data);
    return {
      plan: result,
      error: null,
    };
  } catch (e: any) {
     console.error("AI Health Plan Error:", e);
    return {
      plan: null,
      error: 'The AI model could not be reached to create your plan. Please try again later.',
    };
  }
}
