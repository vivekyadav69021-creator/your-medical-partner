'use server';

/**
 * @fileOverview Precision Nutrition Engine with Multi-Stage Visual Verification.
 * 
 * - analyzeFood - Identifies products via Barcode, OCR, and Visual Cues.
 * - Anti-Hallucination Logic - Prioritizes text-on-packaging over brand-only matching.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FoodAnalysisInputSchema = z.object({
  imageDataUri: z.string().optional().describe("Photo of the food, barcode, or label as data URI."),
  textQuery: z.string().describe("Name or description of the food item provided by the user."),
  language: z.enum(['en', 'hi']).default('en'),
  scanType: z.enum(['standard', 'barcode', 'ocr']).default('standard'),
  healthMirrorProfile: z.string().optional().describe("Custom health conditions or allergies."),
  mainGoal: z.string().optional().describe("Muscle Gain, Weight Loss, etc."),
  workoutRegimen: z.string().optional().describe("Workout type."),
  dietaryProtocol: z.string().optional().describe("Dietary preference."),
});
export type FoodAnalysisInput = z.infer<typeof FoodAnalysisInputSchema>;

const FoodAnalysisOutputSchema = z.object({
  name: z.string().describe('Precise name of the food item or product confirmed.'),
  portion: z.string().describe('Estimated portion size (e.g., "1 packet", "100g").'),
  calories: z.string().describe('Estimated calorie range (e.g., "250 - 300 kcal").'),
  carbs: z.string().describe('Estimated carbohydrates range in grams.'),
  protein: z.string().describe('Estimated protein range in grams.'),
  fats: z.string().describe('Estimated fats range in grams.'),
  microNutrients: z.object({
    calcium: z.string().describe('Calcium content range with units.'),
    potassium: z.string().describe('Potassium content range with units.'),
    iron: z.string().describe('Iron content range with units.'),
    sodium: z.string().describe('Sodium content range with units.'),
    vitamins: z.array(z.string()).describe('Key vitamins found (e.g., ["Vitamin C", "Vitamin B12"]).'),
  }),
  compatibilityTagEn: z.string().describe('Short tag: e.g., "Highly Compatible with Gym Plan".'),
  compatibilityTagHi: z.string().describe('Short tag in Hindi.'),
  logicEn: z.string().describe('Extremely simple explanation using home-style analogies. No medical jargon.'),
  logicHi: z.string().describe('Extremely simple explanation in Hindi using home-style analogies. No medical jargon.'),
  substitutionsEn: z.array(z.string()).describe('Simple healthy substitutions.'),
  substitutionsHi: z.array(z.string()).describe('Simple healthy substitutions in Hindi.'),
  medicalAlertEn: z.string().optional().describe('Direct warning in simple English if item conflicts with medical profile.'),
  medicalAlertHi: z.string().optional().describe('Direct warning in simple Hindi if item conflicts with medical profile.'),
});
export type FoodAnalysisOutput = z.infer<typeof FoodAnalysisOutputSchema>;

export async function analyzeFood(input: FoodAnalysisInput): Promise<FoodAnalysisOutput> {
  return foodAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'foodAnalyzerPrompt',
  input: { schema: FoodAnalysisInputSchema },
  output: { schema: FoodAnalysisOutputSchema },
  prompt: `You are the "Google Lens" of Nutrition for "Your Medical Partner".

**PRODUCT IDENTIFICATION PROTOCOL (CRITICAL):**
- Current Mode: {{{scanType}}}
- You MUST identify the product with 100% accuracy. 

**STRICT IDENTIFICATION STEPS:**
1. **OCR Text Extraction:** Read ALL visible text on the packaging. If it says "Biscuit", "Marie", "Atta Cookies", "Chocolate", or "Snack", then identify it as such.
2. **Category Consistency:** DO NOT identify a solid snack/biscuit as "Honey", "Ghee", or "Juice" just because the Brand (e.g., Patanjali, Nestle, Amul) is the same. Hallucinating a different product category is a CRITICAL FAILURE.
3. **Barcode Digits:** If a barcode is visible, extract the GTIN/EAN digits and use them to confirm the product identity.
4. **Visual Context:** If the package shows a picture of biscuits, it IS biscuits.

**GROUND TRUTH PROTOCOL:**
- Use the actual Nutritional Information table visible on the packet as the PRIMARY source for calories, carbs, proteins, and fats.
- If the table is not visible, use verified global database values for the identified product.

**3-PILLAR DATA CONTEXT:**
1. **Medical Mirroring:** Cross-reference sodium, sugar, and fats against these conditions: "{{{healthMirrorProfile}}}".
2. **Fitness Fulfillment:** Align with Goal: "{{mainGoal}}", Workout: "{{workoutRegimen}}".

**NO MEDICAL JARGON POLICY:**
- Avoid words like "metabolism", "glucogenic", etc. Use simple home-style Hindi/English.

Current Visual/Text Input:
{{#if imageDataUri}} 
Image Data: {{media url=imageDataUri}} 
{{/if}}
User Query: "{{{textQuery}}}"

Identify this item correctly and respond ONLY in the specified JSON format.`,
});

const foodAnalyzerFlow = ai.defineFlow(
  {
    name: 'foodAnalyzerFlow',
    inputSchema: FoodAnalysisInputSchema,
    outputSchema: FoodAnalysisOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) throw new Error("Could not identify the food item. Please ensure the product name or barcode is clearly visible.");
    return output;
  }
);
