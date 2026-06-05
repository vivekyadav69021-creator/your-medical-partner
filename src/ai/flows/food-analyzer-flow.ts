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
  textQuery: z.string().describe("Name or description of the food item."),
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
  carbs: z.string().describe('Estimated carbohydrates range.'),
  protein: z.string().describe('Estimated protein range.'),
  fats: z.string().describe('Estimated fats range.'),
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
  logicEn: z.string().describe('Simplified biological why using analogies.'),
  logicHi: z.string().describe('Simplified biological why in Hindi.'),
  substitutionsEn: z.array(z.string()).describe('Proactive healthy substitutions.'),
  substitutionsHi: z.array(z.string()).describe('Proactive healthy substitutions in Hindi.'),
  medicalAlertEn: z.string().optional().describe('Direct warning if item conflicts with medical profile.'),
  medicalAlertHi: z.string().optional().describe('Medical warning in Hindi.'),
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

**SCAN MODE:** {{{scanType}}}
**USER PROVIDED LABEL:** "{{{textQuery}}}"

**3-PILLAR DATA CONTEXT:**
1. **Medical Mirroring:** User conditions: "{{{healthMirrorProfile}}}". Cross-reference sodium, potassium, and fats against these conditions.
2. **Fitness Fulfillment:** Goal: "{{mainGoal}}", Workout: "{{workoutRegimen}}", Protocol: "{{dietaryProtocol}}".
3. **Visual Input:** If scanType is 'barcode', identify the product from the barcode. If 'ocr', read the nutrition table strictly.

**STRICT PROTOCOLS:**
- **RANGE BASED VALUES:** Provide realistic ranges (e.g., "12g - 15g").
- **MICRO-NUTRIENTS:** You MUST estimate Calcium, Potassium, Iron, and Sodium. 
- **MATH CHECK:** Ensure Total Calories ≈ (4 * Protein) + (4 * Carbs) + (9 * Fats).
- **MEDICAL CONFLICTS:** If a user has Hypertension, high Sodium must trigger a BOLD medical alert and a "DO NOT EAT" recommendation.
- **LANGUAGE:** Render all Hindi fields in warm, clear, conversational Hindi.

Current Input:
{{#if imageDataUri}} Image provided. {{/if}}
Food Query: {{{textQuery}}}

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
