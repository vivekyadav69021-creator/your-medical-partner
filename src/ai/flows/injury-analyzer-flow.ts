'use server';
/**
 * @fileOverview Emergency Response Specialist for Injury Scanner.
 * 
 * - analyzeInjury - Provides immediate risk assessment and first-aid guidance.
 * - InjuryAnalysisInput - The input type including image and user context.
 * - InjuryAnalysisOutput - Structured response with severity, biological logic, and SOS alerts.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InjuryAnalysisInputSchema = z.object({
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the injury as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userQuery: z.string().describe("User-reported context of the accident or symptoms."),
  language: z.enum(['en', 'hi']).optional().default('en'),
});
export type InjuryAnalysisInput = z.infer<typeof InjuryAnalysisInputSchema>;

const InjuryAnalysisOutputSchema = z.object({
  classification: z.string().describe('Professional classification of the injury (e.g., Superficial Cut).'),
  severity: z.enum(['low', 'medium', 'high']).describe('Severity level of the injury.'),
  biologicalLogic: z.string().describe('Physiological explanation of the observed response.'),
  firstAidSteps: z.array(z.string()).describe('Numbered first-aid steps for immediate stabilization.'),
  actionableAlert: z.string().optional().describe('Bold alert for high severity injuries.'),
  interactionPrompt: z.string().optional().describe('Contextual question if details are insufficient.'),
  summary: z.string().describe('A concise Markdown summary of the analysis.'),
});
export type InjuryAnalysisOutput = z.infer<typeof InjuryAnalysisOutputSchema>;

export async function analyzeInjury(input: InjuryAnalysisInput): Promise<InjuryAnalysisOutput> {
  return injuryAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'injuryAnalyzerPrompt',
  input: { schema: InjuryAnalysisInputSchema },
  output: { schema: InjuryAnalysisOutputSchema },
  prompt: `You are the Emergency Response Specialist for the "Your Medical Partner" Injury Scanner.

**Operational Protocol:**
- Analyze the traumatic injury based on the provided image and/or user description.
- **Workflow Track 1 (Detect):** If only an image is provided, identify morphology (Laceration, Burn, etc.), Erythema (redness), and Edema (swelling). Ask for context in 'interactionPrompt'.
- **Workflow Track 2 (Assisted):** If userQuery is provided, prioritize the accident context to assess depth and underlying damage.
- **Classification & Severity:** Assign a professional classification and severity level (Low, Medium, High).
- **Biological Logic:** Explain the physiological response (e.g., "Erythema indicates increased blood flow as part of the inflammatory repair process").
- **SOS Recommendation:** If severity is HIGH (e.g., heavy bleeding, deep tissue), trigger 'actionableAlert' suggesting use of "Emergency SOS" for nearby hospitals in Vapi.
- **First-Aid:** Provide numbered, actionable steps.

**Compulsory Disclaimer:** "This is an AI-generated first-aid guide for immediate awareness. If the injury is severe, seek professional medical treatment immediately."

**Input Data:**
Language: {{language}}
User Context: {{{userQuery}}}
Image: {{#if imageDataUri}}{{media url=imageDataUri}}{{else}}No image provided.{{/if}}

Respond in structured JSON.`,
});

const injuryAnalyzerFlow = ai.defineFlow(
  {
    name: 'injuryAnalyzerFlow',
    inputSchema: InjuryAnalysisInputSchema,
    outputSchema: InjuryAnalysisOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) throw new Error('Injury analysis failed.');
      return output;
    } catch (e: any) {
      console.error("Injury Flow Error:", e);
      return {
        classification: "Unknown",
        severity: "low",
        biologicalLogic: "Could not perform analysis.",
        firstAidSteps: ["Clean with water", "Cover with clean cloth", "Consult a doctor if pain increases"],
        interactionPrompt: "I couldn't analyze the injury clearly. Could you please describe what happened or upload a better photo?",
        summary: "Analysis failed: " + (e.message || "Unknown error"),
      };
    }
  }
);
