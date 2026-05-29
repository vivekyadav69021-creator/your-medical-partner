'use server';

/**
 * @fileOverview Hyper-Personalized 3-Pillar Nutrition Engine.
 * 
 * - analyzeFood - Cross-references food against Medical Profiles and Fitness Goals.
 * - FoodAnalysisInput - Includes 3-pillar data: medical_mirror, fitness_fulfillment, and input_bridge.
 * - FoodAnalysisOutput - Deterministic nutrition with personalized compatibility logic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FoodAnalysisInputSchema = z.object({
  imageDataUri: z.string().optional().describe("Photo of the food plate as data URI."),
  textQuery: z.string().optional().describe("Manual text entry for the meal."),
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
  name: z.string().describe('Precise name of the food item and portion.'),
  calories: z.number().describe('Total energy (4*P + 4*C + 9*F).'),
  carbs: z.number().describe('Total carbohydrates in grams.'),
  protein: z.number().describe('Total protein in grams.'),
  fats: z.number().describe('Total fats in grams.'),
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
  prompt: `You are the Elite Clinical Dietitian and Sports Nutritionist for "Your Medical Partner".

**3-PILLAR DATA CONTEXT:**
1. **Medical Mirroring:** User conditions: "{{{healthMirrorProfile}}}". Flag conflicts (e.g., sugar for diabetics, gluten for celiacs).
2. **Fitness Fulfillment:** Goal: "{{mainGoal}}", Workout: "{{workoutRegimen}}", Protocol: "{{dietaryProtocol}}". Evaluate macro-fit.
3. **Food Input:** Analysis needed for image/text provided.

**OPERATIONAL PROTOCOLS:**
- **Strict Math:** Calories MUST be (Protein * 4) + (Carbs * 4) + (Fats * 9).
- **Compatibility Tag:** Compare food macros against the Fitness Goal and Medical Profile.
- **Consumer Logic:** Use friendly analogies. No complex medical jargon.
- **Substitutions:** If the food is suboptimal for their goal or medical profile, suggest 2-3 specific alternatives.

Current Input:
{{#if imageDataUri}} Food Image provided. {{/if}}
{{#if textQuery}} Manual Entry: {{{textQuery}}} {{/if}}

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
    
    // Server-side Math check
    const calculatedCals = Math.round((output.protein * 4) + (output.carbs * 4) + (output.fats * 9));
    
    return {
        ...output,
        calories: calculatedCals
    };
  }
);
