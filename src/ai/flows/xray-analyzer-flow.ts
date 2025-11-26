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
  image: z.object({
    url: z
      .string()
      .describe(
        "The X-ray image to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
    contentType: z.string().describe('The MIME type of the image (e.g., "image/jpeg").'),
  })
});
export type AnalyzeXrayInput = z.infer<typeof AnalyzeXrayInputSchema>;

const AnalyzeXrayOutputSchema = z.object({
  status: z.enum(['ok', 'error']).describe('The status of the analysis.'),
  report: z.object({
    findings: z.array(FindingSchema).describe('A list of potential findings identified in the image.'),
    impression: z.string().describe('A summary of the most important findings, formatted as a radiology report impression.'),
  }),
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
  prompt: `You are a specialized AI Radiology Assistant. Your primary function is to analyze medical images, specifically X-rays, and generate a structured preliminary report. Your analysis is for informational purposes and is NOT a medical diagnosis.

  Analyze the following X-ray image:
  {{media url=image.url}}

  **Instructions:**

  1.  **Examine the Image:** Carefully examine the image for any potential abnormalities. Consider areas such as the heart shadow, lungs, bones, and soft tissues. Look for findings like cardiomegaly, lung opacities, nodules, fractures, pleural effusion, pneumothorax, or signs of arthritis.

  2.  **Generate Findings:** For each potential finding, provide a clear label, a confidence score (from 0.0 to 1.0), and brief, objective notes. If no abnormalities are found, state that in the findings.

  3.  **Formulate Impression:** Synthesize the most critical findings into a concise summary paragraph. This should read like a radiologist's impression. Example: "Lungs are clear. Heart size is upper limits of normal. No acute osseous abnormalities."

  4.  **Generate Recommendation:** Based on the impression, provide a short, actionable recommendation (e.g., "Consult a radiologist for definitive interpretation," "Possible signs of pneumonia, refer to pulmonologist," "No significant acute abnormalities detected, routine follow-up suggested.").

  5.  **Format Output:** Return the analysis in the specified JSON format with a status of "ok". If the image is not a valid X-ray or is unanalyzable, return a status of "error" with an appropriate message.

  **Crucial Disclaimer:** Your analysis is for informational purposes only and is NOT a medical diagnosis. Always state that a qualified medical professional should be consulted. The final recommendation text must reinforce this.
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
        return output || { status: 'error', report: { findings: [], impression: '' }, recommendationText: '', error: 'Analysis failed to produce output.' };
    } catch(e: any) {
        console.error("X-ray analysis flow error:", e);
        return { status: 'error', report: { findings: [], impression: '' }, recommendationText: '', error: e.message || 'An unexpected error occurred during analysis.' };
    }
  }
);
