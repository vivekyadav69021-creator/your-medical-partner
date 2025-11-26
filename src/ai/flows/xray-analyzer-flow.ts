'use server';
/**
 * @fileOverview An AI flow for analyzing X-ray images.
 *
 * - analyzeXray - A function that analyzes an X-ray image and returns findings.
 * - AnalyzeXrayInput - The input type for the analyzeXray function.
 * - AnalyzeXrayOutput - The return type for the analyzeXray function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FindingSchema = z.object({
  label: z.string().describe('A concise name for the finding (e.g., "Cardiomegaly", "Lung Opacities").'),
  confidence: z.number().min(0).max(1).describe('The model\'s confidence in this finding, from 0.0 to 1.0.'),
  notes: z.string().describe('Brief, important notes about the finding, including location or severity if applicable.'),
});

const AnalyzeXrayInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "The X-ray image to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeXrayInput = z.infer<typeof AnalyzeXrayInputSchema>;

const AnalyzeXrayOutputSchema = z.object({
  status: z.enum(['ok', 'error']).describe('The status of the analysis.'),
  findings: z.array(FindingSchema).describe('A list of potential findings identified in the image.'),
  recommendationText: z.string().describe('A summary recommendation based on the findings (e.g., "Refer to pulmonologist").'),
  error: z.string().optional().describe('An error message if the status is "error".'),
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
  prompt: `You are a specialized AI assistant for analyzing medical images, specifically X-rays. Your task is to identify potential abnormalities in the provided image and give a concise recommendation.

  Analyze the following X-ray image:
  {{media url=photoDataUri}}

  1.  **Identify Findings:** Carefully examine the image for any potential abnormalities (e.g., cardiomegaly, lung opacities, fractures, pleural effusion). For each potential finding, provide a clear label, a confidence score (0.0 to 1.0), and a brief note.
  2.  **Generate Recommendation:** Based on the most significant findings, provide a short, actionable recommendation (e.g., "Consult a radiologist for definitive interpretation," "Possible signs of pneumonia, refer to pulmonologist," "No significant abnormalities detected.").
  3.  **Format Output:** Return the analysis in the specified JSON format with a status of "ok". If the image is not a valid X-ray or is unanalyzable, return a status of "error" with an appropriate message.

  **Crucial Disclaimer:** Your analysis is for informational purposes only and is NOT a medical diagnosis. Always state that a qualified medical professional should be consulted.
  `,
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
        return output || { status: 'error', findings: [], recommendationText: '', error: 'Analysis failed to produce output.' };
    } catch(e: any) {
        console.error("X-ray analysis flow error:", e);
        return { status: 'error', findings: [], recommendationText: '', error: e.message || 'An unexpected error occurred during analysis.' };
    }
  }
);
