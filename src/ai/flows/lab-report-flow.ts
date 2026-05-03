
'use server';
/**
 * @fileOverview Clinical Data Analyst for Lab Report interpretation.
 *
 * - analyzeLabReportImage - Interprets lab reports into scientific and actionable insights.
 * - LabReportInput - Image and user-provided symptom context.
 * - LabReportOutput - Structured biomarkers, biological logic, and lifestyle suggestions.
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
  value: z.string().describe('The measured value of the test result, including units (e.g., "14.2 g/dL").'),
  range: z.string().optional().describe('The standard reference range provided on the report.'),
  status: z.enum(['normal', 'high', 'low', 'borderline']).describe('Status based on reference range.'),
});

const LabReportInputSchema = z.object({
  imageDataUri: z.string().describe("An image of the lab report as a data URI."),
  userQuery: z.string().optional().describe("User-reported symptoms or specific concerns (e.g., 'I feel tired')."),
  language: z.enum(['en', 'hi']).optional().default('en'),
});
export type LabReportInput = z.infer<typeof LabReportInputSchema>;

const LabReportOutputSchema = z.object({
  patientDetails: PatientDetailsSchema.optional(),
  summary: z.string().describe('A high-level summary of the overall report findings.'),
  interpretations: z.array(LabFindingSchema).describe('Structured list of biomarkers identified.'),
  biologicalLogic: z.string().describe('Scientific explanation of the findings using clinical logic.'),
  lifestyleSuggestions: z.array(z.string()).describe('Non-prescription actionable lifestyle or dietary adjustments.'),
  interactionPrompt: z.string().optional().describe('Follow-up question if symptoms are missing or context is needed.'),
  recommendation: z.string().describe('Mandatory clinical disclaimer in the target language.'),
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
  prompt: `You are the Clinical Data Analyst for the "Your Medical Partner" Report Analysis module.

**Operational Protocols:**
- **Track 1 (Full Interpretation):** Extract biomarkers, values, and reference ranges. Identify any "Out of Range" values immediately.
- **Track 2 (Targeted Query):** If userQuery is present (e.g., "{{{userQuery}}}"), correlate these symptoms with the biomarkers. If userQuery is missing, ask for context in 'interactionPrompt'.
- **Biological Logic:** Explain the physiological significance (e.g., "Low Ferritin levels indicate depleted iron stores, which is often the cause of the reported fatigue").
- **Lifestyle Suggestions:** Provide 3-4 evidence-based, non-prescription suggestions (diet, hydration, sleep).
- **Mandatory Clinical Disclaimer:** 
  - English: "This is an AI-generated interpretation of your lab data for informational purposes. AI can occasionally misread text or handwritten notes in reports. Please consult a qualified Physician for a formal diagnosis and treatment plan."
  - Hindi: "यह आपके लैब डेटा का एआई-जनरेटेड विश्लेषण है जो केवल सूचनात्मक उद्देश्यों के लिए है। एआई कभी-कभी रिपोर्ट में टेक्स्ट या हाथ से लिखे नोट्स को गलत पढ़ सकता है। औपचारिक निदान और उपचार योजना के लिए कृपया एक योग्य चिकित्सक से परामर्श लें।"

Analyze this image now. Language: {{language}}.
User Context: {{{userQuery}}}
Image: {{media url=imageDataUri}}
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
      if (!output) throw new Error("The AI model did not return a valid analysis.");
      return output;
    } catch (e: any) {
      console.error("Lab report analysis flow error:", e);
      throw new Error('Analysis failed. Please try again with a clear image.');
    }
  }
);
