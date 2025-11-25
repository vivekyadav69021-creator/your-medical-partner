'use server';
/**
 * @fileOverview An AI-powered wellness challenge generator.
 *
 * - generateChallenge - A function that takes a user's routine and goals to create a personalized challenge.
 * - GenerateChallengeInput - The input type for the generateChallenge function.
 * - GenerateChallengeOutput - The return type for the generateChallenge function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateChallengeInputSchema = z.object({
  routineDescription: z
    .string()
    .describe(
      'A description of the user\'s daily routine, diet, and health goals.'
    ),
});
export type GenerateChallengeInput = z.infer<
  typeof GenerateChallengeInputSchema
>;

const TaskSchema = z.object({
  day: z.number().describe('The day number of the task (1-5).'),
  task: z.string().describe('A specific, actionable task for that day.'),
  completed: z.boolean().default(false),
});

const GenerateChallengeOutputSchema = z.object({
  title: z.string().describe('A catchy and motivational title for the 5-day challenge.'),
  description: z
    .string()
    .describe('A brief, encouraging description of the challenge and its benefits.'),
  reward: z
    .string()
    .describe('A fun, virtual reward for completing the challenge (e.g., "300 Points & a Sensi Starter Badge").'),
  tasks: z
    .array(TaskSchema)
    .length(5)
    .describe('An array of exactly 5 daily tasks for the wellness plan.'),
});
export type GenerateChallengeOutput = z.infer<
  typeof GenerateChallengeOutputSchema
>;

export async function generateChallenge(
  input: GenerateChallengeInput
): Promise<GenerateChallengeOutput> {
  return generateChallengeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChallengePrompt',
  input: { schema: GenerateChallengeInputSchema },
  output: { schema: GenerateChallengeOutputSchema },
  prompt: `You are AI Sensi, a friendly and motivational health assistant. Your goal is to create a simple, achievable, and engaging 5-day wellness challenge based on the user's routine and goals.

The challenge should focus on small, positive changes. Make it fun and encouraging.

User's Routine and Goals:
"{{{routineDescription}}}"

Based on this, generate a 5-day wellness plan. The plan must include:
1.  A creative and inspiring title.
2.  A short description of what the user will achieve.
3.  A virtual reward (e.g., points and a badge name).
4.  Exactly FIVE daily tasks, one for each day. Each task should be a simple, concrete action.

Example for a user with a desk job who wants more energy:
- Title: "5-Day Energy Boost"
- Description: "A 5-day plan to boost your energy and focus throughout the workday."
- Reward: "300 Points & an 'Energy Explorer' Badge"
- Tasks:
  - Day 1: Drink a glass of water first thing in the morning.
  - Day 2: Go for a 15-minute walk during your lunch break.
  - Day 3: Do 5 minutes of stretching every 2 hours of sitting.
  - Day 4: Swap one sugary snack for a piece of fruit.
  - Day 5: Try a 10-minute guided meditation before bed.

Now, create a new plan for the user based on their input.
`,
});

const generateChallengeFlow = ai.defineFlow(
  {
    name: 'generateChallengeFlow',
    inputSchema: GenerateChallengeInputSchema,
    outputSchema: GenerateChallengeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
