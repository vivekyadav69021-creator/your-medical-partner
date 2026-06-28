/**
 * @fileOverview A trusted health assistant AI flow with global elite medical sources and clickable links.
 * Correlates visual data (reports/photos) with user queries for highly accurate insights.
 *
 * - healthAssistant - A function that takes a user query, detects language, and returns a high-authority health response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const HealthAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question about health, medicine, or diseases.'),
  photoDataUri: z.string().optional().describe(
      "An optional photo of a health concern or medical report, as a data URI."
    ),
  mode: z.enum(['standard', 'websearch', 'deepthink', 'proanalysis']).default('standard').describe('The processing mode for the AI.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The ongoing chat history.'),
});
export type HealthAssistantInput = z.infer<typeof HealthAssistantInputSchema>;

export const HealthAssistantOutputSchema = z.object({
  response: z
    .string()
    .describe('The AI-generated response formatted in Markdown with clickable links.'),
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
  input: { schema: HealthAssistantInputSchema },
  output: { schema: HealthAssistantOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are "Your Medical Partner – Trusted Global Health Expert".
Current Engine Mode: {{{mode}}}

{{#if photoDataUri}}
**URGENT: ATTACHMENT ANALYISIS**
A medical image has been provided: {{media url=photoDataUri}}
1. Extract all text, biomarkers (like Hemoglobin, BP, sugar), or visible symptoms from this image.
2. Use this as your PRIMARY source of truth.
3. Explicitly mention what you see in the image at the start of your response.
{{/if}}

**STRICT OPERATING PROTOCOLS:**
- **Accuracy First:** Provide elite, evidence-based medical information. 
- **Directness:** If the query is simple, give a simple direct answer. DO NOT talk about your founder (Shailesh Yadav) or your technology UNLESS specifically asked "who created you?" or "how do you work?".
- **Language Lock:** Automatically detect and respond in the user's EXACT language (Hindi, Gujarati, English, Hinglish).
- **Mode Intelligence:**
  - 'websearch': Provide more external references and latest news.
  - 'deepthink': Provide a detailed step-by-step biological explanation.
  - 'proanalysis': Focus strictly on pharmacological interactions and side effects.

**FORMATTING RULES:**
1. **Use Markdown Headers (##)**, Bold (**), and Bullet points.
2. **CLICKABLE SOURCES (MANDATORY):** At the end, include a "## Verified Sources" section. Provide real, clickable Markdown links to authority sites (e.g., [Mayo Clinic - Diabetes](https://www.mayoclinic.org/diseases-conditions/diabetes/symptoms-causes/syc-20371444)).
3. **Emergency Disclaimer:** Always end with a warning that you are an AI and not a doctor.

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
    const {output} = await prompt(input);
    
    if (!output?.response) {
       return { response: "I'm sorry, I am having difficulty processing this specific request. Please ensure the message is clear or the photo is well-lit." };
    }

    return {
      response: output.response
    };
  }
);
