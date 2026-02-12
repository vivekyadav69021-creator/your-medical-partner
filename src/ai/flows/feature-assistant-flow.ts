'use server';

/**
 * @fileOverview A voice-first AI assistant that acts as a smart controller for the entire application.
 * It can navigate, answer questions about features, and proxy requests to other specialized AI agents.
 *
 * - featureAssistant - The primary function that processes user queries.
 * - FeatureAssistantInput - The input type for the featureAssistant function.
 * - FeatureAssistantOutput - The return type for the featureAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { features } from '@/lib/feature-data';
import { healthAssistant, HealthAssistantInputSchema, HealthAssistantOutputSchema } from './health-assistant-flow';
import type { HealthAssistantInput, HealthAssistantOutput } from './health-assistant-flow';

const FeatureAssistantInputSchema = z.object({
  query: z.string().describe("The user's question or voice command."),
  language: z.enum(['en', 'hi']).default('en'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The ongoing conversation history.'),
});
export type FeatureAssistantInput = z.infer<typeof FeatureAssistantInputSchema>;

const FeatureAssistantOutputSchema = z.object({
  answer: z.string().describe('The AI\'s response to the user. This is what will be spoken back to the user.'),
  path: z.string().optional().describe('An optional navigation path if the user\'s command maps to a feature (e.g., /dashboard).'),
  featureId: z.string().optional().describe('The ID of the feature to navigate to.'),
});
export type FeatureAssistantOutput = z.infer<typeof FeatureAssistantOutputSchema>;

// Provide the AI with a summarized context of all available features for navigation.
const featureContext = features.map(f => `- ${f.title} (${f.path}): ${f.content_en}`).join('\n');

const healthAssistantTool = ai.defineTool(
    {
        name: 'healthAssistantTool',
        description: 'Use this tool for any medical or health-related questions. This includes inquiries about symptoms (e.g., "I have a headache"), diseases, medicines, treatments, or general health advice. Do not use this for navigation or simple feature questions.',
        inputSchema: HealthAssistantInputSchema,
        outputSchema: HealthAssistantOutputSchema,
    },
    async (input: HealthAssistantInput) => healthAssistant(input)
);

export async function featureAssistant(
  input: FeatureAssistantInput
): Promise<FeatureAssistantOutput> {
  return featureAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'featureAssistantPrompt',
  tools: [healthAssistantTool],
  input: { schema: FeatureAssistantInputSchema },
  output: { schema: FeatureAssistantOutputSchema },
  prompt: `You are a voice-first AI assistant for the "Your Medical Partner" app. Your primary role is to act as a smart controller and guide. You have three main tasks, in this order of priority:

  1.  **Handle Medical Questions**: If the user asks a health or medical question (about symptoms, diseases, what a medicine does, etc.), you MUST use the \`healthAssistantTool\`. Your final answer should be the complete response from that tool.

  2.  **Handle Navigation**: If the user asks to go to a feature or perform an action related to an app feature, identify the correct path from the "Available Features Context" below. Your answer should be a simple confirmation like "Sure, opening the medical store." and you must populate the 'path' field.

  3.  **Handle General Questions**: If the user asks about your capabilities ("what can you do?") or a general question, provide a helpful, concise answer. Do not try to answer medical questions yourself.

  **CRITICAL RULES:**
  - **You are NOT a doctor.** Never give medical advice directly. Always use the \`healthAssistantTool\` for medical queries.
  - Prioritize using the tool for health questions over navigation. For example, if a user says "I have a headache, what should I do?", use the tool, don't navigate to the health assistant page.
  - Be concise. Your answer will be spoken out loud.
  - Respond in the user's language ('{{language}}').

  **Available Features Context (for Navigation):**
  ${featureContext}

  **Conversation History:**
  {{#each history}}
  {{this.role}}: {{{this.content}}}
  {{/each}}

  **Current User Query:**
  {{{query}}}
  `,
});

const featureAssistantFlow = ai.defineFlow(
  {
    name: 'featureAssistantFlow',
    inputSchema: FeatureAssistantInputSchema,
    outputSchema: FeatureAssistantOutputSchema,
  },
  async (input) => {
    const llmResponse = await prompt(input);
    const output = llmResponse.output();

    if (!output) {
      return {
        answer: "I'm sorry, I couldn't process that request. Please try again.",
      };
    }

    if (llmResponse.hasToolCode()) {
        const toolResponse = await llmResponse.toolCode!.execute();
        
        const healthAssistantOutput = HealthAssistantOutputSchema.parse(toolResponse);

        return {
            answer: healthAssistantOutput.response,
        };
    }
    
    return output;
  }
);
