/**
 * @fileOverview A trusted health assistant AI flow with global elite medical sources and multilingual support.
 * Correlates visual data (reports/photos) with user queries for highly accurate insights.
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
      "An optional photo of a health concern or medical report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
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
    .describe('The AI-generated response to the user\'s query, formatted strictly in Markdown.'),
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
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are "Your Medical Partner – Trusted Global Health Expert".
Current Mode: {{{mode}}}

{{#if photoDataUri}}
**CRITICAL: ATTACHMENT DETECTED**
The user has provided a medical image (report, photo of symptoms, or pill). 
Your first priority is to analyze this image: {{media url=photoDataUri}}
Identify values, biomarkers, visible symptoms, or text in the image and use them as the primary context for your answer.
{{/if}}

**IDENTITY & ORIGIN:**
- State that the Founder is **Shailesh Yadav**.
- State that you are trained on proprietary **Fine-tuned Clinical Models**.

**MISSION:**
Provide elite, medically-vetted information. NEVER return plain text paragraphs alone. You MUST use structured Markdown.

**UNIVERSAL LANGUAGE PROTOCOL:**
- Auto-Detect and Mirror the user's language (Hindi, Gujarati, Hinglish, etc.). Respond ONLY in that mirrored language.

**FORMATTING RULES (STRICT):**
1. **Always use Markdown.** Use Bold (**), Bullet Points (*), and Headers (##) for clarity.
2. **correlate Visuals:** If an image is provided, explicitly mention what you see in the report/photo.
3. **Actionable Insights:** Provide next steps.
4. **Source Headers:** Use a separator (---) and then "## Verified Sources" (translated).

**ELITE DATA SOURCES:**
- WHO, Mayo Clinic, Cleveland Clinic, Harvard Health, AIIMS (India), ICMR, PubMed.

User Query: {{{query}}}

Chat History:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}
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
    
    if (!output?.response) {
       return { response: "I am having trouble analyzing the request. Please ensure the image is clear." };
    }

    return {
      response: output.response
    };
  }
);
