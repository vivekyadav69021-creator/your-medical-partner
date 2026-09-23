'use server';

/**
 * @fileOverview Precision Nutrition Engine with Multi-Stage Visual Verification.
 * 
 * - analyzeFood - Identifies products via Barcode, OCR, and Visual Cues.
 * - Expiry Detection - Specifically scans for EXP, MFG, and Best Before dates.
 * - Health Mirroring - Evaluates compatibility based on user's medical profile.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FoodAnalysisInputSchema = z.object({
  imageDataUri: z.string().optional().describe("Photo of the food, barcode, or label as data URI."),
  textQuery: z.string().describe("Name or description of the food item provided by the user."),
  language: z.enum(['en', 'hi']).default('en'),
  scanType: z.enum(['standard', 'barcode', 'ocr']).default('standard'),
  healthMirrorProfile: z.string().optional().describe("Custom health conditions like Diabetes, Thyroid, or Allergies."),
  mainGoal: z.string().optional().describe("Muscle Gain, Weight Loss, General Health, etc."),
  workoutRegimen: z.string().optional().describe("Sedentary, Light, Moderate, or Intense workout."),
  dietaryProtocol: z.string().optional().describe("Veg, Non-Veg, Keto, etc."),
  currentDate: z.string().optional().describe("The today's date for expiry calculation."),
});
export type FoodAnalysisInput = z.infer<typeof FoodAnalysisInputSchema>;

const FoodAnalysisOutputSchema = z.object({
  name: z.string().describe('Precise name of the food item or product confirmed.'),
  brand: z.string().optional().describe('Confirmed brand name of the product.'),
  portion: z.string().describe('Estimated portion size (e.g., "1 packet", "100g").'),
  calories: z.string().describe('Estimated calorie range (e.g., "250 - 300 kcal").'),
  carbs: z.string().describe('Estimated carbohydrates range in grams.'),
  protein: z.string().describe('Estimated protein range in grams.'),
  fats: z.string().describe('Estimated fats range in grams.'),
  expiryDate: z.string().optional().describe('Detected Expiry Date or Best Before (e.g., "12 Oct 2025").'),
  expiryStatus: z.enum(['Safe', 'Expired', 'Near Expiry', 'Unknown']).default('Unknown').describe('Safety status based on today: {{currentDate}}.'),
  compatibilityTagEn: z.string().describe('Short tag: e.g., "Highly Compatible with Gym Plan".'),
  compatibilityTagHi: z.string().describe('Short tag in simple Hindi.'),
  ingredientSafety: z.array(z.object({
    item: z.string(),
    status: z.enum(['Safe', 'Caution', 'Danger']),
    reason: z.string()
  })).describe('Analysis of ingredients like sugar levels, additives, or allergens.'),
  logicEn: z.string().describe('Extremely simple explanation using home-style analogies.'),
  logicHi: z.string().describe('Extremely simple explanation in simple everyday Hindi.'),
  substitutionsEn: z.array(z.string()).describe('Simple healthy substitutions.'),
  substitutionsHi: z.array(z.string()).describe('Simple healthy substitutions in Hindi.'),
  medicalAlertEn: z.string().optional().describe('Direct warning in simple English.'),
  medicalAlertHi: z.string().optional().describe('Direct warning in simple Hindi.'),
});
export type FoodAnalysisOutput = z.infer<typeof FoodAnalysisOutputSchema>;

export async function analyzeFood(input: FoodAnalysisInput): Promise<FoodAnalysisOutput> {
  return foodAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'foodAnalyzerPrompt',
  input: { schema: FoodAnalysisInputSchema },
  output: { schema: FoodAnalysisOutputSchema },
  prompt: `You are the "Master Precision Nutri-Lens AI" for "Your Medical Partner".

**STRICT IDENTIFICATION PROTOCOL (DO NOT HALLUCINATE):**
- Today's Date: {{{currentDate}}}
- Current Mode: {{{scanType}}}

1. **OCR & BRAND DETECTION FIRST:**
   - Look at the provided image: {{media url=imageDataUri}}
   - You MUST extract the exact BRAND and PRODUCT name from the text visible on the packaging.
   - **MANDATORY**: If the package says "Chocolate" or has a chocolate brand logo, DO NOT identify it as "Almonds" or anything else. Be 100% literal with what is visible.

2. **INGREDIENT & ADDITIVE ANALYSIS:**
   - Scan for the "Ingredients List" and "Nutrition Table".
   - Evaluate high fructose corn syrup, palm oil, artificial colors, and sodium.
   - Set 'ingredientSafety' based on these findings.

3. **EXPIRY CHECK:**
   - Locate "EXP", "Best Before", or "MFG Date". 
   - Calculate safety based on today's date: {{{currentDate}}}.

4. **PERSONALIZED MIRRORING:**
   - Check against user conditions: "{{{healthMirrorProfile}}}". 
   - Align with Goal: "{{mainGoal}}".

Respond ONLY in valid JSON format. Be extremely precise with product names.`,
});

const foodAnalyzerFlow = ai.defineFlow(
  {
    name: 'foodAnalyzerFlow',
    inputSchema: FoodAnalysisInputSchema,
    outputSchema: FoodAnalysisOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) throw new Error("Product identification failed. Please ensure the brand label is clearly visible.");
    return output;
  }
);
