'use server';

/**
 * @fileOverview An AI flow to answer questions about application features.
 *
 * - featureAssistant - A function that takes a user query and app context to provide a helpful answer.
 * - FeatureAssistantInput - The input type for the featureAssistant function.
 * - FeatureAssistantOutput - The return type for the featureAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { features } from '@/lib/feature-data';

const FeatureAssistantInputSchema = z.object({
  query: z.string().describe("The user's question about an app feature."),
  language: z.enum(['en', 'hi']).default('en'),
});
export type FeatureAssistantInput = z.infer<typeof FeatureAssistantInputSchema>;

const FeatureAssistantOutputSchema = z.object({
  answer: z.string().describe('A helpful, concise answer to the user\'s question.'),
  path: z.string().optional().describe('An optional relevant path in the app, e.g., /dashboard.'),
  featureId: z.string().optional().describe('The ID of the most relevant feature.'),
});
export type FeatureAssistantOutput = z.infer<typeof FeatureAssistantOutputSchema>;

// Provide the AI with a summarized context of all available features.
const featureContext = features.map(f => `- ${f.title} (${f.path}): ${f.content_en}`).join('\n');

export async function featureAssistant(
  input: FeatureAssistantInput
): Promise<FeatureAssistantOutput> {
  return featureAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'featureAssistantPrompt',
  input: { schema: FeatureAssistantInputSchema },
  output: { schema: FeatureAssistantOutputSchema },
  prompt: `You are a helpful AI assistant for the "Your Medical Partner" application. Your goal is to answer user questions about the app's features based on the provided context.

  **Instructions:**
  1.  Analyze the user's query: \`{{{query}}}\`
  2.  Consult the list of available application features below to find the most relevant one.
  3.  Formulate a clear, helpful, and concise answer in the user's specified language ('{{language}}').
  4.  If you find a highly relevant feature, provide its 'path' and 'id' in the corresponding output fields.
  5.  If the query is unclear or doesn't match any feature, politely say you can't help with that and suggest they ask about one of the known features. Do not hallucinate.

  **Available Features Context:**
  ${featureContext}
  `,
});

const featureAssistantFlow = ai.defineFlow(
  {
    name: 'featureAssistantFlow',
    inputSchema: FeatureAssistantInputSchema,
    outputSchema: FeatureAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
