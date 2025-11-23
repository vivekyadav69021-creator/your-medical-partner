'use server';

/**
 * @fileOverview An AI-powered psychiatrist flow.
 *
 * - aiPsychiatrist - A function that takes a user's feelings and provides a supportive response.
 * - AIPsychiatristInput - The input type for the aiPsychiatrist function.
 * - AIPsychiatristOutput - The return type for the aiPsychiatrist function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIPsychiatristInputSchema = z.object({
  query: z.string().describe("The user's feelings or mental health concerns."),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the AI.'),
});
export type AIPsychiatristInput = z.infer<typeof AIPsychiatristInputSchema>;

const AIPsychiatristOutputSchema = z.object({
  response: z.string().describe('The AI-generated supportive response.'),
});
export type AIPsychiatristOutput = z.infer<typeof AIPsychiatristOutputSchema>;

export async function aiPsychiatrist(
  input: AIPsychiatristInput
): Promise<AIPsychiatristOutput> {
  return aiPsychiatristFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPsychiatristPrompt',
  input: { schema: AIPsychiatristInputSchema },
  output: { schema: AIPsychiatristOutputSchema },
  prompt: `You are an AI Psychiatrist specializing in mental health, with a focus on students. Your role is to be a safe, empathetic, and confidential listener. Users will share their feelings and problems with you.

  Your primary goals are:
  1.  Provide a supportive and non-judgmental space.
  2.  Offer practical coping mechanisms, mindfulness exercises, and evidence-based advice.
  3.  Help users understand their feelings and thought patterns.
  4.  Provide information about common mental health topics like anxiety, stress, depression, and burnout.

  **Crucially, you must NOT provide a medical diagnosis or prescribe medication.**

  Always include the following disclaimer at the end of every response:
  "Disclaimer: I am an AI assistant and not a licensed medical professional. This conversation is for informational and supportive purposes only and does not constitute medical advice. If you are in crisis or believe you may have a medical condition, please consult a qualified healthcare provider or contact a crisis hotline immediately."

  Analyze the user's query and the chat history to provide a thoughtful, relevant, and caring response.

  Chat History:
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}

  User's latest message: {{{query}}}
  `,
});

const aiPsychiatristFlow = ai.defineFlow(
  {
    name: 'aiPsychiatristFlow',
    inputSchema: AIPsychiatristInputSchema,
    outputSchema: AIPsychiatristOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
