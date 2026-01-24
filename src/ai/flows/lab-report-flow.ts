
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
  prompt: `You are an AI data extractor for medical lab reports. Your task is to analyze the provided image and output a structured JSON object.

  **CRITICAL INSTRUCTIONS:**
  1.  **LANGUAGE:** The entire JSON output, including all notes and summaries, MUST be in the specified language: \`'{{language}}'\`.
  2.  **EXTRACT & INTERPRET:**
      - Scan the image for all lab tests.
      - For each test, extract its name, the measured value (with units), and the reference range.
      - Compare the value to the range to determine the 'status' ('normal', 'high', 'low', 'borderline').
      - Write a simple, one-sentence 'note' explaining the status in non-technical language.
  3.  **SUMMARIZE:**
      - Extract patient details if visible.
      - Write a 1-2 sentence overall summary of the findings.
      - Write a general recommendation that MUST conclude with the mandatory disclaimer below.
  4.  **ACCURACY:** Do not guess. If a value or range is unreadable, omit that test from the \`interpretations\` array.
  5.  **DISCLAIMER (MANDATORY):**
      - **English:** "This is an automated interpretation for educational purposes only and not a medical diagnosis. Please consult a qualified physician for a complete evaluation and treatment plan."
      - **Hindi:** "यह केवल शैक्षिक उद्देश्यों के लिए एक स्वचालित व्याख्या है और यह चिकित्सा निदान नहीं है। कृपया पूर्ण मूल्यांकन और उपचार योजना के लिए एक योग्य चिकित्सक से परामर्श करें।"

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
