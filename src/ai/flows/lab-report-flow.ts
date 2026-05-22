'use server';
/**
 * @fileOverview Advanced Clinical Data Analyst for Lab Report interpretation.
 *
 * - analyzeLabReportImage - Interprets lab reports into scientific and actionable insights.
 * - LabReportInput - Image and user-provided symptom context.
 * - LabReportOutput - Structured biomarkers, patient info, and clinical action plan.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PatientDetailsSchema = z.object({
  name: z.string().optional().describe('Patient\'s name as written on the report.'),
  age: z.string().optional().describe('Patient\'s age.'),
  gender: z.string().optional().describe('Patient\'s gender.'),
  date: z.string().optional().describe('Date of the report.'),
  doctorName: z.string().optional().describe('The name of the referring doctor or clinic.'),
});

const LabFindingSchema = z.object({
  category: z.string().describe('The category of the test (e.g., Blood Count, Kidney Function, Thyroid).'),
  test: z.string().describe('The name of the lab test.'),
  value: z.string().describe('The measured value including units.'),
  range: z.string().optional().describe('The reference range.'),
  status: z.enum(['normal', 'high', 'low', 'borderline']).describe('Health status of this result.'),
  significance: z.string().describe('Simple explanation of what this result means for the user.'),
});

const ClinicalActionPlanSchema = z.object({
  title: z.string().describe('Title of the recommendation.'),
  steps: z.array(z.string()).describe('Actionable steps to improve or maintain health.'),
});

const LabReportInputSchema = z.object({
  imageDataUri: z.string().describe("An image of the lab report as a data URI."),
  userQuery: z.string().optional().describe("User-reported symptoms."),
  language: z.enum(['en', 'hi']).optional().default('en'),
});
export type LabReportInput = z.infer<typeof LabReportInputSchema>;

const LabReportOutputSchema = z.object({
  patientDetails: PatientDetailsSchema,
  summary: z.string().describe('A high-level summary of the entire report.'),
  findings: z.array(LabFindingSchema).describe('List of all test results extracted line by line.'),
  biologicalLogic: z.string().describe('Clinical logic explained in very simple words.'),
  actionPlan: z.array(ClinicalActionPlanSchema).describe('Personalized cures and lifestyle adjustments based on findings.'),
  thingsToAvoid: z.array(z.string()).describe('List of activities or foods to avoid based on current reports.'),
  disclaimer: z.string().describe('Mandatory clinical disclaimer in the target language.'),
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
  prompt: `You are the Lead Clinical Data Analyst for the "Your Medical Partner" Lab Analysis Hub.

**STRICT PROTOCOL:**
1. **Language Mirroring:** If language is 'hi', EVERYTHING (all fields, labels, keys, descriptions) must be in fluent, simple Hindi. If 'en', use simple English.
2. **Line-by-Line Extraction:** Extract every single test finding visible. Do not skip data.
3. **Patient/Doctor Info:** Identify the patient name, age, date, and referring Doctor/Clinic from the headers.
4. **No Jargon:** Use layman's terms. Instead of "Erythrocytopenia", say "Low Red Blood Cell Count".
5. **Cure & Action:** In 'actionPlan', provide specific dietary and lifestyle "cures" based on the out-of-range values.

**Current Case:**
Language: {{language}}
User Context: {{{userQuery}}}
Image: {{media url=imageDataUri}}

Respond ONLY in valid JSON matching the output schema.`,
});

const labReportAnalyzerFlow = ai.defineFlow(
  {
    name: 'labReportAnalyzerFlow',
    inputSchema: LabReportInputSchema,
    outputSchema: LabReportOutputSchema,
  },
  async (input) => {
    try {
      const response = await prompt(input);
      const output = response.output;
      if (!output) throw new Error("AI failed to parse report.");
      return output;
    } catch (e: any) {
      console.error("Lab Report Analysis Error:", e);
      throw new Error('Analysis failed. Please ensure the photo is clear and well-lit.');
    }
  }
);
