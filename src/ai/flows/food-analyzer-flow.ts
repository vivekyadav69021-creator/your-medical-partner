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
  portion: z.string().describe('Estimated portion size (e.g., "1 packet", "100g").'),
  calories: z.string().describe('Estimated calorie range (e.g., "250 - 300 kcal").'),
  carbs: z.string().describe('Estimated carbohydrates range in grams.'),
  protein: z.string().describe('Estimated protein range in grams.'),
  fats: z.string().describe('Estimated fats range in grams.'),
  expiryDate: z.string().optional().describe('Detected Expiry Date or Best Before (e.g., "12 Oct 2025").'),
  expiryStatus: z.enum(['Safe', 'Expired', 'Near Expiry', 'Unknown']).default('Unknown').describe('Safety status based on today: {{currentDate}}.'),
  compatibilityTagEn: z.string().describe('Short tag: e.g., "Highly Compatible with Gym Plan".'),
  compatibilityTagHi: z.string().describe('Short tag in simple Hindi.'),
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
  prompt: `You are the "Precision Nutri-Lens AI" for "Your Medical Partner".

**CORE PROTOCOL (STRICT):**
- Today's Date: {{{currentDate}}}
- Current Mode: {{{scanType}}}

**1. PRODUCT IDENTIFICATION:**
- If scanType is 'barcode', identify the product using the barcode pattern or numbers. 
- If scanType is 'ocr', analyze the nutritional table.
- If scanType is 'standard', use visual features.

**2. EXPIRY DETECTION (PRIORITY):**
- Locate any text like "EXP", "Expiry", "Best Before", "Use By", or "MFG Date".
- If "MFG Date" is found with "Best before 6 months", calculate the final date.
- Compare with today: {{{currentDate}}}.
- Set 'expiryStatus' to 'Expired' if today is past the date, 'Near Expiry' if within 30 days, or 'Safe'.

**3. HEALTH MIRRORING LOGIC:**
- Analyze against conditions: "{{{healthMirrorProfile}}}". 
- Align with Goal: "{{mainGoal}}", Workout: "{{workoutRegimen}}".

Respond ONLY in the specified JSON format. Ensure name and portions are precise.`,
});

const foodAnalyzerFlow = ai.defineFlow(
  {
    name: 'foodAnalyzerFlow',
    inputSchema: FoodAnalysisInputSchema,
    outputSchema: FoodAnalysisOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) throw new Error("Could not identify the food item. Please ensure the product is clearly visible.");
    return output;
  }
);
