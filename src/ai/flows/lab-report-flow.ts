
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

const PatientDetailsSchema = z.object({
  name: z.string().optional().describe('Patient\'s name, if visible.'),
  age: z.string().optional().describe('Patient\'s age, if visible.'),
  date: z.string().optional().describe('Date of the report, if visible.'),
});

const LabFindingSchema = z.object({
  test: z.string().describe('The name of the lab test (e.g., "Hemoglobin", "Glucose, Fasting").'),
  value: z.string().describe('The measured value of the test result, including units (e.g., "14.2 g/dL", "110 mg/dL").'),
  range: z.string().optional().describe('The standard reference range for the test, if provided on the report (e.g., "13.5-17.5 g/dL").'),
  note: z.string().describe('A brief, one-sentence interpretation of the value in simple language (e.g., "This value is within the normal range.", "This is slightly higher than the normal range.").'),
  status: z.enum(['normal', 'high', 'low', 'borderline']).describe('A machine-readable status for the finding: normal, high, low, or borderline.'),
});

const LabReportInputSchema = z.object({
  imageDataUri: z.string().describe("An image of the lab report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  language: z.enum(['en', 'hi']).optional().default('en'),
});
export type LabReportInput = z.infer<typeof LabReportInputSchema>;

const LabReportOutputSchema = z.object({
  patientDetails: PatientDetailsSchema.optional().describe("Patient's demographic details from the report."),
  summary: z.string().describe('A one or two-sentence high-level summary of the overall findings (e.g., "Lipid profile is elevated, suggesting a risk of high cholesterol. Other values are within normal limits.").'),
  interpretations: z.array(LabFindingSchema).describe('A structured list of interpretations for each identified lab value.'),
  recommendation: z.string().describe('A general recommendation based on the overall findings. MUST include a disclaimer to consult a doctor. Should be in paragraph form.'),
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
  prompt: `You are an AI assistant that extracts data from medical lab reports. Your only job is to analyze the image and populate the requested JSON fields accurately.

  **Priority 1: Extract Test Results**
  - Go through the image line by line.
  - For each lab test you find, extract the 'test' name, 'value', and 'range'.
  - Based on the value and range, set the 'status' to 'high', 'low', 'normal', or 'borderline'.
  - Write a very simple, one-sentence 'note' in the specified language ('{{language}}'). Example: "This is slightly high."
  - If you can't read a test, skip it. Do not guess.
  
  **Priority 2: Summarize**
  - After extracting all tests, write a one-sentence summary about the most important findings (e.g., "Lipid profile is high, other values are normal.").
  - Extract patient name and date if visible.
  
  **Priority 3: Recommendation (IMPORTANT)**
  - The 'recommendation' field MUST ALWAYS contain this exact text, translated to the target language ('{{language}}'): "This is an automated interpretation and not a medical diagnosis. Please consult a qualified physician for a complete evaluation."
  
  Analyze this image now. Language: {{language}}.
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
      if (!output) {
        throw new Error("The AI model did not return a valid analysis.");
      }
      return output;
    } catch (e: any) {
      console.error("Lab report analysis flow error:", e);
      throw new Error(
        'The AI model took too long to respond or could not analyze the report. This can happen with poor quality images or during high server load. Please try again with a clear image.'
      );
    }
  }
);
