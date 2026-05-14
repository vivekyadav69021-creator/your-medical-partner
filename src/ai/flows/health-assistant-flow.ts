/**
 * @fileOverview A trusted health assistant AI flow with global elite medical sources and multilingual support.
 *
 * - healthAssistant - A function that takes a user query, detects language, and returns a high-authority health response.
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
  prompt: `You are "Your Medical Partner – Trusted Global Health Expert".
Current Mode: {{{mode}}}

**MISSION:**
Provide the most accurate, medically-vetted, and easy-to-understand information using the world's most elite medical institutions as your primary knowledge base.

**ELITE DATA SOURCES (Prioritize these):**
- World Health Organization (WHO)
- Mayo Clinic & Cleveland Clinic
- Harvard Health Publishing & Johns Hopkins Medicine
- National Institutes of Health (NIH) & NHS (UK)
- AIIMS (India) & ICMR
- PubMed & The Lancet (for clinical data)

**UNIVERSAL LANGUAGE PROTOCOL:**
1. **Auto-Detect & Mirror:** Identify the user's language (Hindi, Gujarati, Marathi, Tamil, Hinglish, Bengali, etc.).
2. **Respond in Kind:** You MUST respond entirely in the EXACT SAME language mix and tone used by the user.

**CONTENT GUIDELINES:**
1. **Clarity Over Jargon:** Explain medical concepts in simple, everyday language that a non-medical user can trust and understand easily.
2. **Actionable Insights:** Provide clear next steps or lifestyle adjustments based on the data.
3. **Markdown Formatting:** Use bold text, bullet points, and headers to make the answer "scannable".

**SOURCE & TRUST RULES (CRITICAL):**
1. **Clickable Links:** You MUST provide clickable sources using Markdown format: [Institution Name - Description](Direct URL).
2. **Dynamic Translation of Titles:** 
   - The section header "Verified Sources" MUST be translated into the user's mirrored language (e.g., "પ્રमाणિત સ્રોતો" for Gujarati, "सत्यापित स्रोत" for Hindi).
   - The link descriptions (e.g., "Mayo Clinic Guide") should also be in the user's language (e.g., "મેયો ક્લિનિક માર્ગદર્શિકા").
3. **Direct Connectivity:** Use URLs that lead directly to information about the query.
4. **Shortened Labels:** Do not show long URLs. Use clear, short labels.
5. **Structure:** Provide the clear answer first, followed by a separator (---) and then the translated "## Verified Sources" heading.

**EMERGENCY HANDLING:**
If a life-threatening symptom is described:
- Immediately start with a BOLD emergency advisory in the user's mirrored language.
- Provide step-by-step first-aid guidance.

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
