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

// A temporary, in-memory store for the plan data.
// In a real app, this should be a database or a more persistent cache.
let temporaryPlanStore: { [key: string]: any } = {};

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
    
    // Generate a unique ID for the plan
    planId = `plan_${Date.now()}`;

    // Store the plan result temporarily.
    // NOTE: This is a simple in-memory solution. In a production app,
    // you would use a database (like Firestore) or a caching service (like Redis/Vercel KV).
    temporaryPlanStore[planId] = result;

    // Clear old entries from the store to prevent memory leaks
    setTimeout(() => {
        delete temporaryPlanStore[planId];
    }, 1000 * 60 * 5); // Clear after 5 minutes

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
    // Retrieve the plan from our temporary store.
    const plan = temporaryPlanStore[planId];
    if (!plan) {
        return null;
    }
    // The plan is retrieved, so we can remove it from the store.
    delete temporaryPlanStore[planId];
    return plan;
}
