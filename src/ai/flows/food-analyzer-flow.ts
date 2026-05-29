'use server';

/**
 * @fileOverview Food Analysis AI Agent.
 *
 * - analyzeFood - Identifies food items and provides nutritional breakdown.
 * - FoodAnalysisInput - Image or text description of the meal.
 * - FoodAnalysisOutput - Calories, Macros, and consumer-friendly biological logic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FoodAnalysisInputSchema = z.object({
  imageDataUri: z.string().optional().describe("Photo of the food plate as data URI."),
  textQuery: z.string().optional().describe("Manual text entry for the meal."),
  language: z.enum(['en', 'hi']).default('en'),
});
export type FoodAnalysisInput = z.infer<typeof FoodAnalysisInputSchema>;

const FoodAnalysisOutputSchema = z.object({
  name: z.string().describe('Name of the food item.'),
  calories: z.number().describe('Total energy in kcal.'),
  carbs: z.number().describe('Total carbohydrates in grams.'),
  protein: z.number().describe('Total protein in grams.'),
  fats: z.number().describe('Total fats in grams.'),
  logicEn: z.string().describe('Simple biological explanation in English (no jargon).'),
  logicHi: z.string().describe('Simple biological explanation in Hindi (no jargon).'),
  tipEn: z.string().describe('Actionable health tip in English.'),
  tipHi: z.string().describe('Actionable health tip in Hindi.'),
});
export type FoodAnalysisOutput = z.infer<typeof FoodAnalysisOutputSchema>;

export async function analyzeFood(input: FoodAnalysisInput): Promise<FoodAnalysisOutput> {
  return foodAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'foodAnalyzerPrompt',
  input: { schema: FoodAnalysisInputSchema },
  output: { schema: FoodAnalysisOutputSchema },
  prompt: `You are the Expert Nutritionist for "Your Medical Partner".

**MISSION:**
Analyze the food input (image or text) and provide a nutritional breakdown.

**STRICT RULES:**
1. **NO MEDICAL JARGON:** Do not say "high glycemic index". Say "converts to energy quickly, making you hungry sooner".
2. **LAYMAN LOGIC:** Explain the biological impact of this specific meal in simple terms.
3. **DUAL LANGUAGE:** Provide 'logicHi' and 'tipHi' in natural, conversational Hindi, and 'logicEn' and 'tipEn' in simple English.
4. **ACCURACY:** Estimate calories and macros as accurately as possible for the identified portion size.

Current Input:
{{#if imageDataUri}}
Food Image: {{media url=imageDataUri}}
{{/if}}
{{#if textQuery}}
Manual Entry: {{{textQuery}}}
{{/if}}

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
    if (!output) throw new Error("Could not analyze food data.");
    return output;
  }
);
