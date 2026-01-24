
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
  prompt: `You are a specialized AI Lab Report Analyzer. Your primary function is to meticulously read the provided medical lab report image, extract all key information, and present it in a structured, clear, and easy-to-understand format for a non-medical person.

  **Critical Instructions:**
  1.  **Language:** The entire response—including summaries, notes, and recommendations—MUST be in the specified language: \`'{{language}}'\`. If \`'hi'\`, use Hindi. Otherwise, use simple English.
  2.  **Simplicity is Key:** Use simple, non-technical language. Avoid medical jargon. Explain things as you would to a patient who has no medical background.
  3.  **Analyze the Image:** Carefully scan the entire lab report. Identify patient information (name, age, date) if present. Extract every single lab test listed, its corresponding value, units, and the reference range.
  4.  **Extract Patient Details:** If patient details are visible, populate the \`patientDetails\` object. If not, leave it empty.
  5.  **Create Interpretations:** For every test result you identify, create an entry in the \`interpretations\` array.
      - **\`test\`:** The name of the test.
      - **\`value\`:** The result value with units.
      - **\`range\`:** The reference range if available.
      - **\`note\`:** A simple, one-sentence explanation of what the result means (e.g., "This value is normal.", "This is slightly high and may indicate...").
      - **\`status\`:** Based on the value and range, classify the result as one of: \`normal\`, \`high\`, \`low\`, or \`borderline\`. This is very important for the UI.
  6.  **Formulate Summary:** Write a concise, one- or two-sentence summary of the most important findings in simple language.
  7.  **Formulate Recommendation:** Based on the findings, provide a general, non-prescriptive recommendation in paragraph form.
  8.  **Mandatory Disclaimer:** Your recommendation MUST ALWAYS conclude with the following disclaimer, translated into the correct language:
      - **English:** "This is an automated interpretation for educational purposes only and not a medical diagnosis. Please consult a qualified physician for a complete evaluation and treatment plan."
      - **Hindi:** "यह केवल शैक्षिक उद्देश्यों के लिए एक स्वचालित व्याख्या है और यह चिकित्सा निदान नहीं है। कृपया पूर्ण मूल्यांकन और उपचार योजना के लिए एक योग्य चिकित्सक से परामर्श करें।"

  Now, analyze this lab report image:
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
    } catch(e: any) {
        console.error("Lab report analysis flow error:", e);
        // Ensure a valid, structured error response is always returned.
        const errorMessage = e.message || 'An unexpected error occurred during analysis.';
        return { 
            summary: 'Analysis Failed', 
            interpretations: [], 
            recommendation: `Error: ${errorMessage}. Please check the uploaded image or try again.` 
        };
    }
  }
);
