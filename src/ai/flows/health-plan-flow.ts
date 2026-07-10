'use server';
/**
 * @fileOverview Advanced AI Health Plan Generator.
 * 
 * Generates bilingual (HI/EN) health plans for 4 user types: Patient, Gym, Diet, Normal.
 * Uses simple layman language and structures output for a daily checklist.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HealthPlanInputSchema = z.object({
  userType: z.enum(['patient', 'gym', 'diet', 'normal']),
  age: z.string(),
  gender: z.string(),
  weight: z.string(),
  height: z.string(),
  activityLevel: z.string(),
  goal: z.string(),
  // Dynamic fields
  medicalCondition: z.string().optional(),
  currentMedication: z.string().optional(),
  mobility: z.string().optional(),
  gymExperience: z.string().optional(),
  equipment: z.string().optional(),
  dietType: z.string().optional(),
  budget: z.string().optional(),
  focusArea: z.string().optional(),
  notes: z.string().optional(),
});
export type HealthPlanInput = z.infer<typeof HealthPlanInputSchema>;

const DailyTaskSchema = z.object({
  time: z.string().describe('Exact time like "09:00 AM"'),
  taskEn: z.string(),
  taskHi: z.string(),
  category: z.enum(['medication', 'workout', 'diet', 'hydration', 'sleep', 'general']),
});

const HealthPlanOutputSchema = z.object({
  summaryEn: z.string(),
  summaryHi: z.string(),
  dailySchedule: z.array(DailyTaskSchema),
  dietAdviceEn: z.string(),
  dietAdviceHi: z.string(),
  exerciseAdviceEn: z.string(),
  exerciseAdviceHi: z.string(),
  dosAndDontsEn: z.array(z.string()),
  dosAndDontsHi: z.array(z.string()),
  precautionsEn: z.string(),
  precautionsHi: z.string(),
  disclaimerEn: z.string().optional(),
  disclaimerHi: z.string().optional(),
});
export type HealthPlanOutput = z.infer<typeof HealthPlanOutputSchema>;

export async function generateHealthPlan(input: HealthPlanInput): Promise<HealthPlanOutput> {
  return healthPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthPlanPrompt',
  input: { schema: HealthPlanInputSchema },
  output: { schema: HealthPlanOutputSchema },
  prompt: `You are the Lead Health Architect for "Your Medical Partner".
Your mission is to create a 100% personalized health plan for a **{{{userType}}}** user.

**STRICT LANGUAGE RULES:**
1. Generate EVERYTHING in both English (En) and Simple Hindi (Hi).
2. For Hindi, use "Gharelu Bhasha" (everyday spoken Hindi). Avoid complex Sanskrit terms.
   - Example: Use "Paachan" instead of "Chayapachay", "Bachna chahiye" instead of "Pratibandhit".

**USER PROFILE:**
- Type: {{{userType}}}
- Age/Gender: {{{age}}} / {{{gender}}}
- BMI Context: Weight {{{weight}}}kg, Height {{{height}}}cm
- Activity: {{{activityLevel}}}
- Main Goal: {{{goal}}}
{{#if medicalCondition}}- Condition: {{{medicalCondition}}}{{/if}}
{{#if currentMedication}}- Meds: {{{currentMedication}}}{{/if}}
{{#if gymExperience}}- Gym Level: {{{gymExperience}}}{{/if}}
{{#if dietType}}- Diet: {{{dietType}}}{{/if}}
{{#if focusArea}}- Focus: {{{focusArea}}}{{/if}}
{{#if notes}}- User Notes: {{{notes}}}{{/if}}

**OUTPUT STRUCTURE:**
1. **Summary:** A warm, encouraging overview.
2. **Daily Schedule:** MUST include specific times (AM/PM) for meals, meds, and activities.
3. **Diet & Exercise:** Specific actionable advice.
4. **Do's & Don'ts:** Simple bullet points.
5. **Precautions:** Safety first.
{{#if (eq userType "patient")}}6. **Disclaimer:** Add a strong mandatory medical disclaimer.{{/if}}

Respond ONLY in the structured JSON format provided.`,
});

const healthPlanFlow = ai.defineFlow(
  {
    name: 'healthPlanFlow',
    inputSchema: HealthPlanInputSchema,
    outputSchema: HealthPlanOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) throw new Error("AI failed to architect your plan.");
    return output;
  }
);
