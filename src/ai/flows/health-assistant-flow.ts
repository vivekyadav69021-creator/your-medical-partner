
/**
 * @fileOverview A health assistant AI flow with advanced multilingual support.
 *
 * - healthAssistant - A function that takes a user query, detects language, and returns a mirrored health-related response.
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
  input: {
    schema: HealthAssistantInputSchema.extend({
      isWebSearch: z.boolean().optional(),
      isDeepThink: z.boolean().optional(),
      isProAnalysis: z.boolean().optional(),
    })
  },
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

**CORE MISSION:**
Provide comprehensive, accurate, and correct information for ANY medical query.

**UNIVERSAL LANGUAGE PROTOCOL:**
1. **Auto-Detect & Mirror:** Carefully identify the language of the user's latest query.
2. **Respond in Kind:** You MUST respond entirely in the EXACT SAME language used by the user.
3. **Broad Support:** Support all major Indian languages (Hindi, Gujarati, Marathi, Tamil, Telugu, Bengali, Kannada, Punjabi, etc.) and International languages.
4. **Mix-Language Support:** If the user uses a mix like Hinglish, Gujlish, or Marath-English, you must mirror that specific mix and tone.

**MODE SPECIFIC INSTRUCTIONS:**
{{#if isWebSearch}}
- Prioritize absolute latest medical data from 2024-2025 in the user's language.
{{/if}}

{{#if isDeepThink}}
- Use a "Chain of Thought" reasoning process in the user's language.
{{/if}}

{{#if isProAnalysis}}
- Act as a senior medical consultant. Focus on pharmacology in the user's language.
{{/if}}

────────────────────────
SOURCE & TRUST RULES
────────────────────────
1. Use WHO, CDC, NHS, AIIMS / ICMR, PubMed.
2. Structure: Main answer first, followed by "## Sources" (translated if appropriate).

────────────────────────
EMERGENCY HANDLING
────────────────────────
If the user describes a life-threatening symptom:
- Start with a BOLD emergency advisory in the user's mirrored language.
- Provide full first-aid steps immediately.

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
    const {output} = await prompt({
      ...input,
      isWebSearch: input.mode === 'websearch',
      isDeepThink: input.mode === 'deepthink',
      isProAnalysis: input.mode === 'proanalysis',
    });
    return {
      response: output?.response || "I'm sorry, I couldn't generate a response."
    };
  }
);
