'use server';

/**
 * @fileOverview This file defines a Genkit flow for creating a personalized AI Health Plan.
 *
 * - createHealthPlan - An async function that generates a 7-day health plan.
 * - HealthPlanInput - The input type for the createHealthPlan function.
 * - HealthPlanOutput - The return type for the createHealthPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthPlanInputSchema = z.object({
  age: z.string().describe('The user\'s age (e.g., "35").'),
  gender: z.enum(['male', 'female', 'other']).describe('The user\'s gender.'),
  healthGoals: z.string().describe('The user\'s primary health goals (e.g., "lose weight", "increase energy", "reduce stress").'),
  dietaryPreferences: z.string().describe('The user\'s dietary preferences or restrictions (e.g., "vegetarian", "low-carb", "none").'),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active']).describe('The user\'s current weekly activity level.'),
});
export type HealthPlanInput = z.infer<typeof HealthPlanInputSchema>;

const DailyPlanSchema = z.object({
  day: z.string().describe('The day of the week (e.g., "Monday").'),
  diet: z.string().describe('A brief, one-sentence diet recommendation for the day.'),
  exercise: z.string().describe('A brief, one-sentence exercise suggestion for the day.'),
  wellness_tip: z.string().describe('A brief, one-sentence wellness or mindfulness tip for the day.'),
});

const HealthPlanOutputSchema = z.object({
  planTitle: z.string().describe("A catchy, encouraging title for the 7-day plan."),
  summary: z.string().describe("A one-paragraph summary of the plan's focus, tailored to the user's goals."),
  daily_plans: z.array(DailyPlanSchema).length(7).describe('A 7-day array, with a plan for each day.'),
});
export type HealthPlanOutput = z.infer<typeof HealthPlanOutputSchema>;

export async function createHealthPlan(input: HealthPlanInput): Promise<HealthPlanOutput> {
  return createHealthPlanFlow(input);
}

const healthPlanPrompt = ai.definePrompt({
  name: 'healthPlanPrompt',
  input: {schema: HealthPlanInputSchema},
  output: {schema: HealthPlanOutputSchema},
  prompt: `You are an AI Health Planner. Your task is to create a personalized, realistic, and encouraging 7-day wellness plan based on the user's details. The plan should be simple and easy to follow.

  User Details:
  - Age: {{age}}
  - Gender: {{gender}}
  - Main Goals: {{{healthGoals}}}
  - Dietary Preferences: {{{dietaryPreferences}}}
  - Current Activity Level: {{activityLevel}}

  Generate a 7-day plan with a unique, motivating title and a brief summary. For each day, provide a one-sentence tip for diet, one for exercise, and one for general wellness.
  
  **IMPORTANT**: The tips must be concise, actionable, and directly related to the user's goals. Do not use complex jargon. Keep it encouraging.
  `,
});

const createHealthPlanFlow = ai.defineFlow(
  {
    name: 'createHealthPlanFlow',
    inputSchema: HealthPlanInputSchema,
    outputSchema: HealthPlanOutputSchema,
  },
  async input => {
    const {output} = await healthPlanPrompt(input);
    return output!;
  }
);
