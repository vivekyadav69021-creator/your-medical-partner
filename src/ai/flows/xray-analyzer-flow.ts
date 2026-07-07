'use server';
/**
 * @fileOverview Senior Radiographic Analysis Specialist for X-ray Scanner.
 * Supports multiple X-ray views for a complete clinical assessment.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeXrayInputSchema = z.object({
  images: z.array(z.object({
    url: z.string(),
    contentType: z.string(),
  })).describe("A list of X-ray images."),
  userQuery: z.string().optional().describe("User-reported symptoms."),
  language: z.enum(['en', 'hi']).optional().default('en'),
});
export type AnalyzeXrayInput = z.infer<typeof AnalyzeXrayInputSchema>;

const AnalyzeXrayOutputSchema = z.object({
  status: z.enum(['ok', 'error']).describe('The status of the analysis.'),
  bodyPart: z.string().describe('Identified body part.'),
  observation: z.string().describe('Detailed radiographic findings across all views.'),
  clinicalImplications: z.string().describe('What these findings suggest.'),
  biologicalReasoning: z.string().describe('Clinical logic.'),
  suggestedActions: z.array(z.string()).describe('Non-prescription stabilizing steps.'),
  interactionPrompt: z.string().optional().describe('Follow-up question.'),
  disclaimer: z.string().describe('Mandatory radiographic disclaimer.'),
  error: z.string().optional().describe('Error message.'),
});
export type AnalyzeXrayOutput = z.infer<typeof AnalyzeXrayOutputSchema>;

export async function analyzeXray(input: AnalyzeXrayInput): Promise<AnalyzeXrayOutput> {
  return analyzeXrayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeXrayPrompt',
  input: { schema: AnalyzeXrayInputSchema },
  output: { schema: AnalyzeXrayOutputSchema },
  prompt: `You are a Senior Radiographic Analysis Specialist.
Analyze ALL provided X-ray images (e.g., AP and Lateral views) to identify fractures, misalignments, or tissue swelling.

**PROTOCOL:**
1. **Compare Views:** Use all images to confirm findings that might be hidden in a single view.
2. **Anatomy:** Identify the bone structure shown.
3. **Language:** Respond in {{language}}.

User Context: "{{{userQuery}}}"

Images:
{{#each images}}
- View {{@index}}: {{media url=url}}
{{/each}}

Respond ONLY in valid JSON.`,
});

const analyzeXrayFlow = ai.defineFlow(
  {
    name: 'analyzeXrayFlow',
    inputSchema: AnalyzeXrayInputSchema,
    outputSchema: AnalyzeXrayOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    if (!response.output) throw new Error('Radiographic analysis failed.');
    return {
        ...response.output,
        status: 'ok'
    };
  }
);
