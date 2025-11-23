'use server';

/**
 * @fileOverview This file defines a Genkit flow for calculating a personalized health score.
 *
 * - calculateHealthScore - An async function that calculates the health score.
 * - HealthScoreInput - The input type for the calculateHealthScore function.
 * - HealthScoreOutput - The return type for the calculateHealthScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthScoreInputSchema = z.object({
  personalInformation: z.string().describe('User personal information, including demographics and lifestyle factors.'),
  diagnoses: z.string().describe('List of diagnoses the user has received.'),
  prescriptions: z.string().describe('List of current prescriptions the user is taking.'),
  fitnessTrackerData: z.string().describe('Data from fitness trackers, including activity levels, sleep patterns, heart rate, etc.'),
});
export type HealthScoreInput = z.infer<typeof HealthScoreInputSchema>;

const HealthScoreOutputSchema = z.object({
  healthScore: z.number().describe('A numerical score representing the user health, from 0 to 100.'),
  insights: z.string().describe('Insights and recommendations based on the health score and input data.'),
});
export type HealthScoreOutput = z.infer<typeof HealthScoreOutputSchema>;

export async function calculateHealthScore(input: HealthScoreInput): Promise<HealthScoreOutput> {
  return calculateHealthScoreFlow(input);
}

const healthScorePrompt = ai.definePrompt({
  name: 'healthScorePrompt',
  input: {schema: HealthScoreInputSchema},
  output: {schema: HealthScoreOutputSchema},
  prompt: `You are an AI health assistant tasked with calculating a personalized health score for users based on their provided information.

  Analyze the following user data to generate a health score (0-100, higher is better) and provide relevant insights:

  Personal Information: {{{personalInformation}}}
  Diagnoses: {{{diagnoses}}}
  Prescriptions: {{{prescriptions}}}
  Fitness Tracker Data: {{{fitnessTrackerData}}}

  Consider all factors and provide a score with personalized insights, areas of improvement, and recommendations.  Be brief.
  `,
});

const calculateHealthScoreFlow = ai.defineFlow(
  {
    name: 'calculateHealthScoreFlow',
    inputSchema: HealthScoreInputSchema,
    outputSchema: HealthScoreOutputSchema,
  },
  async input => {
    const {output} = await healthScorePrompt(input);
    return output!;
  }
);
