'use server';
/**
 * @fileOverview Emergency Response Specialist for Injury Scanner.
 * Supports multiple injury photos for better risk assessment.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InjuryAnalysisInputSchema = z.object({
  images: z.array(z.string()).optional().describe("A list of injury photos as data URIs."),
  userQuery: z.string().optional().describe("User-reported context of the accident."),
  language: z.enum(['en', 'hi']).optional().default('en'),
});
export type InjuryAnalysisInput = z.infer<typeof InjuryAnalysisInputSchema>;

const InjuryAnalysisOutputSchema = z.object({
  classification: z.string().describe('Layman classification.'),
  severity: z.enum(['low', 'medium', 'high']).describe('Severity level.'),
  biologicalLogic: z.string().describe('Simplified explanation.'),
  firstAidSteps: z.array(z.string()).describe('Numbered first-aid steps.'),
  thingsToAvoid: z.array(z.string()).describe('Actions to NOT take.'),
  actionableAlert: z.string().optional().describe('Emergency alert if high severity.'),
  interactionPrompt: z.string().optional().describe('Follow-up question.'),
  summary: z.string().describe('Concise Markdown summary.'),
  disclaimer: z.string().describe('Mandatory disclaimer.'),
});
export type InjuryAnalysisOutput = z.infer<typeof InjuryAnalysisOutputSchema>;

export async function analyzeInjury(input: InjuryAnalysisInput): Promise<InjuryAnalysisOutput> {
  return injuryAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'injuryAnalyzerPrompt',
  input: { schema: InjuryAnalysisInputSchema },
  output: { schema: InjuryAnalysisOutputSchema },
  prompt: `You are the Emergency Response Specialist. 
Analyze ALL provided images of the traumatic injury to determine severity.

**SCANNING PROTOCOLS:**
1. **Multi-View Analysis:** Look at all provided photos to identify depth, swelling, and bleeding.
2. **Language Lock:** Response in {{language}}.
3. **Emergency:** If high severity, populate 'actionableAlert'.

User Context: "{{{userQuery}}}"

Images:
{{#each images}}
- View {{@index}}: {{media url=this}}
{{/each}}

Respond ONLY in valid JSON.`,
});

const injuryAnalyzerFlow = ai.defineFlow(
  {
    name: 'injuryAnalyzerFlow',
    inputSchema: InjuryAnalysisInputSchema,
    outputSchema: InjuryAnalysisOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    if (!response.output) throw new Error('Analysis failed.');
    return response.output;
  }
);
