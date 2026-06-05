'use server';

/**
 * @fileOverview Hyper-Personalized 3-Pillar Nutrition Engine with Micro-Nutrient Analytics.
 * 
 * - analyzeFood - Cross-references food against Medical Profiles and Fitness Goals.
 * - FoodAnalysisInput - Includes 3-pillar data and specialized scan modes.
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
  name: z.string().describe('Precise name of the food item confirmed.'),
  portion: z.string().describe('Estimated portion size (e.g., "1 bowl", "100g").'),
  calories: z.string().describe('Estimated calorie range (e.g., "250 - 300 kcal").'),
  carbs: z.string().describe('Estimated carbohydrates range in grams.'),
  protein: z.string().describe('Estimated protein range in grams.'),
  fats: z.string().describe('Estimated fats range in grams.'),
  // Micro-Nutrients
  microNutrients: z.object({
    calcium: z.string().describe('Calcium content range with units.'),
    potassium: z.string().describe('Potassium content range with units.'),
    iron: z.string().describe('Iron content range with units.'),
    sodium: z.string().describe('Sodium content range with units.'),
    vitamins: z.array(z.string()).describe('Key vitamins found (e.g., ["Vitamin C", "Vitamin B12"]).'),
  }),
  // Pillar-based logic
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
  prompt: `You are the Elite Clinical Dietitian & Precise Food Analytics Engine for "Your Medical Partner".

**GROUND TRUTH PROTOCOL:**
- The user provided label: "{{{textQuery}}}". 
- Treat this label as the primary source of truth.
- If an image is provided, use it to confirm portion size and detect extra ingredients (like butter or oil).

**NO MEDICAL JARGON POLICY (STRICT):**
- You MUST NOT use words like "hyperglycemia", "glucogenic", "cardiovascular", "electrolytes", "metabolism", etc.
- Instead, use words like "Blood sugar", "Heart health", "Body's battery", "Repair blocks".
- Use analogies like: "This is premium fuel for your body's engine" or "This acts like a sponge for fats".

**SCAN MODE:** {{{scanType}}}

**3-PILLAR DATA CONTEXT:**
1. **Medical Mirroring:** User conditions: "{{{healthMirrorProfile}}}". Cross-reference sodium, potassium, and fats against these conditions.
2. **Fitness Fulfillment:** Goal: "{{mainGoal}}", Workout: "{{workoutRegimen}}", Protocol: "{{dietaryProtocol}}".

**STRICT NUTRITIONAL MATHEMATICS:**
- You MUST return a RANGE for all values (e.g., "12g - 15g").

**LANGUAGE & CLARITY:**
- Render all Hindi fields in warm, clear, and very simple "Home-style" Hindi.
- If a user has a medical condition, explain the conflict like a family friend, not a textbook.

Current Input:
{{#if imageDataUri}} 
Image provided: {{media url=imageDataUri}} 
{{/if}}
Food Label provided by user: "{{{textQuery}}}"

Respond ONLY in the specified JSON format.`,
});

const foodAnalyzerFlow = ai.defineFlow(
  {
    name: 'foodAnalyzerFlow',
    inputSchema: FoodAnalysisInputSchema,
    outputSchema: FoodAnalysisOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) throw new Error("Could not compute nutritional data.");
    return output;
  }
);
