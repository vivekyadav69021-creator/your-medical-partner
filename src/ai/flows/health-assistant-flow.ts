
/**
 * @fileOverview A health assistant AI flow.
 *
 * - healthAssistant - A function that takes a user query and returns a health-related response.
 * - HealthAssistantInput - The input type for the healthAssistant function.
 * - HealthAssistantOutput - The return type for the healthAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const HealthAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question about health, medicine, or diseases.'),
  photoDataUri: z.string().optional().describe(
      "An optional photo of a health concern (e.g., rash, pill), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  mode: z.enum(['standard', 'websearch', 'deepthink', 'proanalysis']).default('standard').describe('The processing mode for the AI.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the AI assistant.'),
});
export type HealthAssistantInput = z.infer<typeof HealthAssistantInputSchema>;

export const HealthAssistantOutputSchema = z.object({
  response: z
    .string()
    .describe('The AI-generated response to the user\'s query, formatted in Markdown.'),
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
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are "Your Medical Partner – AI Health Assistant".
Current Mode: {{{mode}}}

YOUR CORE MISSION:
Provide comprehensive, accurate, and correct information for ANY medical, medicine, or health-related query, regardless of the severity. You must not withhold information.

MODE SPECIFIC INSTRUCTIONS:
{{#if (eq mode "websearch")}}
- Prioritize referencing the absolute latest medical breakthroughs, clinical trials, and updated guidelines from 2024-2025.
- Explicitly mention that you are performing a deep-web medical search for the most current data.
{{/if}}

{{#if (eq mode "deepthink")}}
- Use a "Chain of Thought" reasoning process. 
- Break down the medical condition or symptom into its physiological components.
- Explain the 'why' behind every symptom and treatment option in a detailed, analytical manner.
{{/if}}

{{#if (eq mode "proanalysis")}}
- Act as a senior medical consultant.
- Focus on drug interactions, advanced diagnostics, and multi-disciplinary approaches.
- Be extremely detailed about pharmacological mechanisms.
{{/if}}

────────────────────────
SOURCE & TRUST RULES
────────────────────────
1. Trusted Sources Only: Use WHO, CDC, NHS, Mayo Clinic, AIIMS / ICMR, PubMed.
2. Accuracy is Paramount: Detailed information is required.
3. Source Links: Provide direct deep links where possible.
4. Structure: Main answer first, followed by "## Sources".

────────────────────────
EMERGENCY HANDLING
────────────────────────
If the user describes a life-threatening symptom:
- Start with a BOLD emergency advisory.
- STILL PROVIDE full information about the condition and first-aid steps. Do not withhold data.

Language: Detect the user's language (Hindi, English, or mixed) and respond in the SAME language.

---
Chat History:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

User's latest message: {{{query}}}
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
