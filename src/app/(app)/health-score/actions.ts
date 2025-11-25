'use server';

import { createHealthPlan, HealthPlanInput } from '@/ai/flows/personalized-health-score';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { kv } from '@vercel/kv';

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
): Promise<{ error: string | null }> {
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
      error: firstError ?? 'Invalid input.',
    };
  }

  let planId: string;
  try {
    const result = await createHealthPlan(validatedFields.data);
    
    planId = `plan_${Date.now()}`;

    // Store the plan in Vercel KV with a 5-minute expiration
    await kv.set(planId, JSON.stringify(result), { ex: 300 });

  } catch (e: any) {
     console.error("AI Health Plan Error:", e);
    return {
      error: 'The AI model could not be reached to create your plan. Please try again later.',
    };
  }

  // Redirect to the new plan page with the ID
  redirect(`/health-score/${planId}`);
}


export async function getHealthPlan(planId: string) {
    const planJson = await kv.get(planId);
    if (!planJson) {
        return null;
    }
    // The plan is retrieved, so we can remove it from the store.
    await kv.del(planId);
    return JSON.parse(planJson as string);
}
