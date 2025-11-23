'use server';

/**
 * @fileOverview A health assistant AI flow.
 *
 * - healthAssistant - A function that takes a user query and returns a health-related response.
 * - HealthAssistantInput - The input type for the healthAssistant function.
 * - HealthAssistantOutput - The return type for the healthAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question about health, medicine, or diseases.'),
});
export type HealthAssistantInput = z.infer<typeof HealthAssistantInputSchema>;

const HealthAssistantOutputSchema = z.object({
  response: z
    .string()
    .describe('The AI-generated response to the user\'s query.'),
});
export type HealthAssistantOutput = z.infer<
  typeof HealthAssistantOutputSchema
>;

export async function healthAssistant(
  input: HealthAssistantInput
): Promise<HealthAssistantOutput> {
  return healthAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthAssistantPrompt',
  input: {schema: HealthAssistantInputSchema},
  output: {schema: HealthAssistantOutputSchema},
  prompt: `You are an AI Health Assistant. Your role is to provide informative and helpful responses to questions about health, medicines, and diseases.

  User query: {{{query}}}

  Provide a detailed and well-structured answer to the user's query. Use bullet points to break down complex information and make it easy to read. You MUST NOT provide medical advice, diagnosis, or treatment recommendations. Always include a disclaimer at the end that the information is for informational purposes only and users should consult a healthcare professional for medical advice.
  `,
});

const healthAssistantFlow = ai.defineFlow(
  {
    name: 'healthAssistantFlow',
    inputSchema: HealthAssistantInputSchema,
    outputSchema: HealthAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
