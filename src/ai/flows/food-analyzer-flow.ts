'use server';

/**
 * @fileOverview Hyper-Personalized 3-Pillar Nutrition Engine with Range-based Analytics.
 * 
 * - analyzeFood - Cross-references food against Medical Profiles and Fitness Goals.
 * - FoodAnalysisInput - Includes 3-pillar data and user-provided label.
 * - FoodAnalysisOutput - Deterministic nutrition with personalized compatibility logic and RANGES.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FoodAnalysisInputSchema = z.object({
  imageDataUri: z.string().optional().describe("Photo of the food plate as data URI."),
  textQuery: z.string().describe("Mandatory name or description of the food item being analyzed."),
  language: z.enum(['en', 'hi']).default('en'),
  // Pillar 1: Medical Mirroring
  healthMirrorProfile: z.string().optional().describe("Custom health conditions, allergies, or complaints."),
  // Pillar 2: Fitness Fulfillment
  mainGoal: z.string().optional().describe("Muscle Gain, Weight Loss, etc."),
  workoutRegimen: z.string().optional().describe("Workout intensity/type."),
  dietaryProtocol: z.string().optional().describe("High Protein, Calorie Deficit, etc."),
});
export type FoodAnalysisInput = z.infer<typeof FoodAnalysisInputSchema>;

const FoodAnalysisOutputSchema = z.object({
  name: z.string().describe('Precise name of the food item confirmed.'),
  calories: z.string().describe('Estimated calorie range (e.g., "250 - 300 kcal").'),
  carbs: z.string().describe('Estimated carbohydrates range (e.g., "40g - 50g").'),
  protein: z.string().describe('Estimated protein range (e.g., "12g - 15g").'),
  fats: z.string().describe('Estimated fats range (e.g., "8g - 10g").'),
  // Pillar-based logic
  compatibilityTagEn: z.string().describe('Short tag: e.g., "Highly Compatible with Gym Plan".'),
  compatibilityTagHi: z.string().describe('Short tag in Hindi: e.g., "आपके फिटनेस प्लान के लिए बिल्कुल सही".'),
  logicEn: z.string().describe('Simplified biological why using analogies.'),
  logicHi: z.string().describe('Simplified biological why in Hindi.'),
  substitutionsEn: z.array(z.string()).describe('Proactive healthy substitutions based on goals/medical profile.'),
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
  prompt: `You are the Elite Clinical Dietitian for "Your Medical Partner".

**USER PROVIDED LABEL:** "{{{textQuery}}}" - Use this as the primary identification of the food.

**3-PILLAR DATA CONTEXT:**
1. **Medical Mirroring:** User conditions: "{{{healthMirrorProfile}}}". Flag conflicts.
2. **Fitness Fulfillment:** Goal: "{{mainGoal}}", Workout: "{{workoutRegimen}}", Protocol: "{{dietaryProtocol}}". Evaluate macro-fit.
3. **Visual Input:** If image is provided, check if it matches the label "{{textQuery}}".

**OPERATIONAL PROTOCOLS:**
- **RANGE BASED VALUES:** Do NOT provide fixed single numbers for nutrients. Provide a realistic range (e.g., "15g - 20g") because exact weight is unknown. This ensures user satisfaction with accuracy.
- **Strict Logic:** If the user labels a food that conflicts with their medical profile, you MUST provide a bold medical alert.
- **Consumer Logic:** Use friendly analogies. No complex medical jargon.

Current Input:
{{#if imageDataUri}} Food Image provided. {{/if}}
Food Label/Query: {{{textQuery}}}

Render all Hindi fields in warm, accessible language. Respond ONLY in the specified JSON format.`,
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
