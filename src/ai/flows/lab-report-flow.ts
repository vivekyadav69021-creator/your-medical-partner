'use server';
/**
 * @fileOverview An AI flow for analyzing lab report images.
 *
 * - analyzeLabReportImage - A function that analyzes an image of a lab report.
 * - LabReportInput - The input type for the analyzeLabReportImage function.
 * - LabReportOutput - The return type for the analyzeLabReportImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LabFindingSchema = z.object({
  test: z.string().describe('The name of the lab test (e.g., "Fasting Glucose", "HDL").'),
  value: z.string().describe('The value of the test result, including units (e.g., "110 mg/dL").'),
  note: z.string().describe('A brief, one-sentence interpretation of the value (e.g., "Slightly high", "Normal").'),
});

export const LabReportInputSchema = z.object({
  imageDataUri: z.string().describe("An image of the lab report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  language: z.enum(['en', 'hi']).optional().default('en'),
});
export type LabReportInput = z.infer<typeof LabReportInputSchema>;

export const LabReportOutputSchema = z.object({
  interpretations: z.array(LabFindingSchema).describe('A list of interpretations for each identified lab value.'),
  recommendation: z.string().describe('A general recommendation based on the overall findings. MUST include a disclaimer to consult a doctor.'),
});
export type LabReportOutput = z.infer<typeof LabReportOutputSchema>;

export async function analyzeLabReportImage(
  input: LabReportInput
): Promise<LabReportOutput> {
  return labReportAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'labReportAnalyzerPrompt',
  input: { schema: LabReportInputSchema },
  output: { schema: LabReportOutputSchema },
  prompt: `You are an AI Lab Report Analyzer. Your task is to read the provided image of a medical lab report, extract key values, and provide a simple, educational interpretation.

  **Instructions:**
  1.  **Analyze the Image:** Carefully scan the image for common lab test results. Focus on tests like Fasting Blood Sugar (FBS), HbA1c, Total Cholesterol, LDL, HDL, and Triglycerides.
  2.  **Extract Values:** For each test you identify, extract its name and the reported value with units.
  3.  **Interpret Values:** Provide a short, simple note for each value (e.g., "Normal", "High", "Low", "Borderline high").
  4.  **Formulate Recommendation:** Based on the findings, provide a general summary.
  5.  **Language:** Respond entirely in the language specified by the 'language' parameter ('en' for English, 'hi' for Hindi).
  6.  **Crucial Disclaimer:** ALWAYS end your recommendation with the following disclaimer in the correct language:
      - **English:** "This is an automated interpretation for educational purposes only. Consult your physician for a diagnosis and treatment plan."
      - **Hindi:** "यह केवल शैक्षिक उद्देश्यों के लिए एक स्वचालित व्याख्या है। निदान और उपचार योजना के लिए अपने चिकित्सक से परामर्श करें।"

  Analyze this lab report image:
  {{media url=imageDataUri}}
  `,
});


const labReportAnalyzerFlow = ai.defineFlow(
  {
    name: 'labReportAnalyzerFlow',
    inputSchema: LabReportInputSchema,
    outputSchema: LabReportOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output || { interpretations: [], recommendation: 'Analysis failed to produce output.' };
    } catch(e: any) {
        console.error("Lab report analysis flow error:", e);
        return { interpretations: [], recommendation: e.message || 'An unexpected error occurred during analysis.' };
    }
  }
);
