'use server';
/**
 * @fileOverview An AI flow for analyzing a prescription image.
 * - analyzePrescription: Analyzes an image to identify medicines.
 * - PrescriptionInput: Input schema for the flow.
 * - PrescriptionOutput: Output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { medicines } from '@/lib/medicine-data';

const PrescriptionInputSchema = z.object({
  imageDataUri: z.string().describe(
    "An image of the prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type PrescriptionInput = z.infer<typeof PrescriptionInputSchema>;

const PrescriptionOutputSchema = z.object({
  identifiedMedicines: z.array(z.string()).describe('A list of medicine names identified from the prescription.'),
  availableMedicines: z.array(z.string()).describe('A list of medicines that are available in the store.'),
  unidentifiedMedicines: z.array(z.string()).describe('A list of medicines that were identified but are not available in the store.'),
});
export type PrescriptionOutput = z.infer<typeof PrescriptionOutputSchema>;

// Create a simple list of available medicine names for the prompt context.
const availableMedicineNames = medicines.map(m => m.name);

const prompt = ai.definePrompt({
  name: 'prescriptionAnalyzerPrompt',
  input: { schema: PrescriptionInputSchema },
  output: { schema: PrescriptionOutputSchema },
  prompt: `You are an expert pharmacist's assistant. Your task is to analyze the provided image of a doctor's prescription and identify all the medicines listed.

  **Instructions:**
  1.  **Read the Prescription:** Carefully scan the image to identify all drug/medicine names. Ignore dosages, frequencies, and patient names. Focus only on the names of the medicines.
  2.  **List Identified Medicines:** Create a complete list of all medicine names you can identify from the image.
  3.  **Compare with Available Stock:** Here is a list of medicines available in our store: ${JSON.stringify(availableMedicineNames)}.
  4.  **Create Final Lists:**
      - Populate 'availableMedicines' with the names of medicines from your identified list that are also present in our available stock list. Match them even if there are minor spelling differences (e.g., "Paracitamol" should match "Paracetamol 500mg").
      - Populate 'unidentifiedMedicines' with names from your identified list that are NOT in our available stock list.

  Analyze this prescription image:
  {{media url=imageDataUri}}
  `,
});

const prescriptionAnalyzerFlow = ai.defineFlow(
  {
    name: 'prescriptionAnalyzerFlow',
    inputSchema: PrescriptionInputSchema,
    outputSchema: PrescriptionOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output || { identifiedMedicines: [], availableMedicines: [], unidentifiedMedicines: [] };
    } catch (e: any) {
      console.error("Prescription analysis flow error:", e);
      // Ensure a valid output structure is returned on error
      return { 
          identifiedMedicines: [], 
          availableMedicines: [], 
          unidentifiedMedicines: [e.message || 'An unexpected error occurred during analysis.'] 
      };
    }
  }
);


export async function analyzePrescription(
  input: PrescriptionInput
): Promise<PrescriptionOutput> {
  return prescriptionAnalyzerFlow(input);
}
