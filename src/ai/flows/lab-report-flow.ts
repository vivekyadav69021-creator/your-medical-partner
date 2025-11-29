
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
  note: z.string().describe('A brief, one-sentence interpretation of the value (e.g., "Normal", "Slightly High", "Low").'),
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
  prompt: `You are an AI Lab Report Analyzer. Your task is to meticulously read the provided image of a medical lab report, extract key information, and provide a structured, educational interpretation.

  **Instructions:**
  1.  **Analyze the Image:** Carefully scan the entire image for all lab test results. Pay attention to patient details, test names, values, units, and reference ranges.
  2.  **Extract Patient Details:** If visible, extract the patient's name, age, and the date of the report.
  3.  **Extract All Test Values:** For every test you can identify (e.g., Hemoglobin, Platelet Count, Cholesterol, Glucose), extract its name, the reported value with units, and the standard reference range if available.
  4.  **Interpret Each Value:** For each test, provide a simple, clear note (e.g., "Normal," "High," "Low," "Borderline high").
  5.  **Formulate Summary:** Write a concise, high-level summary of the most important findings.
  6.  **Formulate Recommendation:** Based on the summary, provide a general, non-prescriptive recommendation.
  7.  **Language:** Respond entirely in the language specified by the 'language' parameter ('en' for English, 'hi' for Hindi).
  8.  **Crucial Disclaimer:** ALWAYS end your recommendation with the following disclaimer in the correct language:
      - **English:** "This is an automated interpretation for educational purposes only. It is not a medical diagnosis. Please consult your physician for a complete evaluation and treatment plan."
      - **Hindi:** "यह केवल शैक्षिक उद्देश्यों के लिए एक स्वचालित व्याख्या है। यह एक चिकित्सा निदान नहीं है। कृपया पूर्ण मूल्यांकन और उपचार योजना के लिए अपने चिकित्सक से परामर्श करें।"

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
      return output || { summary: 'Analysis failed to produce output.', interpretations: [], recommendation: 'Please try again.' };
    } catch(e: any) {
        console.error("Lab report analysis flow error:", e);
        return { summary: 'An error occurred during analysis.', interpretations: [], recommendation: e.message || 'An unexpected error occurred during analysis.' };
    }
  }
);

    