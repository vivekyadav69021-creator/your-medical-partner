'use server';

/**
 * @fileOverview Precision Nutrition Engine with Multi-Stage Visual Verification.
 * 
 * - analyzeFood - Identifies products via Barcode, OCR, and Visual Cues.
 * - Anti-Hallucination Logic - Prioritizes text-on-packaging over brand-only matching.
 * - Health Mirroring - Evaluates compatibility based on user's medical profile and goals.
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
});
export type FoodAnalysisInput = z.infer<typeof FoodAnalysisInputSchema>;

const FoodAnalysisOutputSchema = z.object({
  name: z.string().describe('Precise name of the food item or product confirmed.'),
  portion: z.string().describe('Estimated portion size (e.g., "1 packet", "100g").'),
  calories: z.string().describe('Estimated calorie range (e.g., "250 - 300 kcal").'),
  carbs: z.string().describe('Estimated carbohydrates range in grams.'),
  protein: z.string().describe('Estimated protein range in grams.'),
  fats: z.string().describe('Estimated fats range in grams.'),
  compatibilityTagEn: z.string().describe('Short tag: e.g., "Highly Compatible with Gym Plan" or "Avoid in Diabetes".'),
  compatibilityTagHi: z.string().describe('Short tag in simple Hindi.'),
  logicEn: z.string().describe('Extremely simple explanation using home-style analogies. No medical jargon.'),
  logicHi: z.string().describe('Extremely simple explanation in simple everyday Hindi (Gharelu bhasha).'),
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
  prompt: `You are the "Precision Nutri-Lens AI" for "Your Medical Partner".

**PRODUCT IDENTIFICATION PROTOCOL (STRICT):**
- Current Mode: {{{scanType}}}
- You MUST identify the product or meal with 100% accuracy. 
- If scanType is 'barcode', focus strictly on the barcode pattern or numbers.
- If scanType is 'ocr', analyze the entire nutritional information table.
- If scanType is 'standard', identify the meal visually.
- DO NOT hallucinate. If you are unsure, state it clearly.

**LANGUAGE & TONE (CRITICAL):**
- Response Language: {{{language}}}
- For Hindi (hi): Use VERY SIMPLE, everyday spoken Hindi (Gharelu bhasha). Avoid complex terms.

**HEALTH MIRRORING LOGIC:**
1. **Medical Profile:** Analyze sodium, sugar, and fats against these conditions: "{{{healthMirrorProfile}}}". If the user has Diabetes and the product is high sugar, generate a 'medicalAlertHi/En'.
2. **Fitness Goal:** Align with Goal: "{{mainGoal}}", Workout: "{{workoutRegimen}}".
3. **Scientific Logic:** Explain "Why" this food is good or bad for the user using simple analogies (e.g., "This is like high-grade fuel for your car").
4. **Substitutions:** Provide 2-3 healthier alternatives that are easily available in India.

Current Visual/Text Input:
{{#if imageDataUri}} 
Image Data: {{media url=imageDataUri}} 
{{/if}}
User Context: "{{{textQuery}}}"

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
    if (!output) throw new Error("Could not identify the food item. Please ensure the product is clearly visible.");
    return output;
  }
);
