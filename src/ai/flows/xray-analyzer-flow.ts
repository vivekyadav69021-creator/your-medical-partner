'use server';
/**
 * @fileOverview Radiographic Analysis Specialist for X-ray Scanner.
 * 
 * - analyzeXray - Provides high-level preliminary insights and structural analysis of X-rays.
 * - AnalyzeXrayInput - Input including X-ray image and optional user description.
 * - AnalyzeXrayOutput - Structured clinical observations and biological reasoning.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeXrayInputSchema = z.object({
  image: z.object({
    url: z
      .string()
      .describe(
        "The X-ray image to analyze, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
    contentType: z.string().describe('The MIME type of the image (e.g., "image/jpeg").'),
  }),
  userQuery: z.string().optional().describe("User-reported symptoms or context of injury."),
  language: z.enum(['en', 'hi']).optional().default('en'),
});
export type AnalyzeXrayInput = z.infer<typeof AnalyzeXrayInputSchema>;

const AnalyzeXrayOutputSchema = z.object({
  status: z.enum(['ok', 'error']).describe('The status of the analysis.'),
  bodyPart: z.string().describe('Identified body part or bone structure.'),
  observation: z.string().describe('Precise description of radiographic findings.'),
  biologicalReasoning: z.string().describe('Clinical logic explaining the observed structural changes.'),
  suggestedActions: z.array(z.string()).describe('Non-prescription stabilizing steps.'),
  interactionPrompt: z.string().optional().describe('Follow-up question for low-quality or low-context scans.'),
  disclaimer: z.string().describe('Mandatory radiographic disclaimer.'),
  error: z.string().optional().describe('Error message if status is "error".'),
});
export type AnalyzeXrayOutput = z.infer<typeof AnalyzeXrayOutputSchema>;

export async function analyzeXray(
  input: AnalyzeXrayInput
): Promise<AnalyzeXrayOutput> {
  return analyzeXrayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeXrayPrompt',
  input: { schema: AnalyzeXrayInputSchema },
  output: { schema: AnalyzeXrayOutputSchema },
  prompt: `You are the Radiographic Analysis Specialist for the "Your Medical Partner" X-ray Scanner.

**Operational Protocols:**
- **Track 1 (Discovery):** If userQuery is missing, identify the bone structure (e.g., Clavicle, Femur) and scan for anomalies like fractures or lung densities.
- **Track 2 (Contextual):** If userQuery is provided (e.g., "fell from height"), prioritize the scan based on the mechanism of injury to find subtle stress lines or misalignment.
- **Observation:** Be precise (e.g., "Discontinuity in the distal radius cortices").
- **Biological Reasoning:** Explain the 'why' using clinical logic (e.g., "Stress concentration at the epiphysis suggests high-impact trauma").
- **Suggested Actions:** Provide non-prescription stabilizing advice (e.g., "Immobilize", "Cold pack").

**Mandatory Radiographic Disclaimer:** "This is an AI-powered preliminary scan for awareness. AI can misinterpret shadows or lighting in X-rays. Please consult a certified Radiologist or Orthopedic Surgeon for a final official diagnosis."

Language: {{language}}
Context: {{{userQuery}}}
Image: {{media url=image.url}}

Respond in structured JSON.`,
});

const analyzeXrayFlow = ai.defineFlow(
  {
    name: 'analyzeXrayFlow',
    inputSchema: AnalyzeXrayInputSchema,
    outputSchema: AnalyzeXrayOutputSchema,
  },
  async input => {
    try {
        const { output } = await prompt(input);
        if (!output) throw new Error('Radiographic analysis failed.');
        
        return {
            ...output,
            status: 'ok',
            disclaimer: "This is an AI-powered preliminary scan for awareness. AI can misinterpret shadows or lighting in X-rays. Please consult a certified Radiologist or Orthopedic Surgeon for a final official diagnosis."
        };
    } catch(e: any) {
        console.error("X-ray analysis flow error:", e);
        return { 
            status: 'error', 
            bodyPart: 'Unknown',
            observation: '',
            biologicalReasoning: '',
            suggestedActions: [],
            disclaimer: "Analysis failed.",
            error: e.message || 'An unexpected error occurred during analysis.' 
        };
    }
  }
);
