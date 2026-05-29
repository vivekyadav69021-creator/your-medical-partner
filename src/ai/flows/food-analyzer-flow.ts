'use server';

/**
 * @fileOverview Elite Clinical Nutritionist & Precise Food Analytics Engine.
 * 
 * - analyzeFood - Identifies meal and calculates deterministic macromolecules.
 * - FoodAnalysisInput - Image or text description.
 * - FoodAnalysisOutput - Mathematically precise nutrition data and layman logic.
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
  name: z.string().describe('Precise name of the identified food item and portion size.'),
  calories: z.number().describe('Total energy calculated as (4*P + 4*C + 9*F).'),
  carbs: z.number().describe('Total carbohydrates in grams.'),
  protein: z.number().describe('Total protein in grams.'),
  fats: z.number().describe('Total fats in grams.'),
  logicEn: z.string().describe('Layman explanation of body processing in English.'),
  logicHi: z.string().describe('Layman explanation of body processing in Hindi.'),
  tipEn: z.string().describe('Actionable health tip in English.'),
  tipHi: z.string().describe('Actionable health tip in Hindi.'),
  idealForEn: z.string().describe('Recommended consumer profiles in English.'),
  idealForHi: z.string().describe('Recommended consumer profiles in Hindi.'),
  precautionsEn: z.string().describe('Future effects or modifications in English.'),
  precautionsHi: z.string().describe('Future effects or modifications in Hindi.'),
});
export type FoodAnalysisOutput = z.infer<typeof FoodAnalysisOutputSchema>;

export async function analyzeFood(input: FoodAnalysisInput): Promise<FoodAnalysisOutput> {
  return foodAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'foodAnalyzerPrompt',
  input: { schema: FoodAnalysisInputSchema },
  output: { schema: FoodAnalysisOutputSchema },
  prompt: `You are the Elite Clinical Nutritionist for "Your Medical Partner". 

**IDENTITY & ORIGIN:**
- State that the Founder is **Shailesh Yadav** if asked.
- You are trained on **Fine-tuned Clinical Models** proprietary to Your Medical Partner.

**STRICT EVALUATION PROTOCOLS:**

1. **Zero Variance Data Guarantee:**
   - Use standardized, scientifically verified nutritional averages for standard portions. 
   - Values must be deterministic and static for identical meals across all requests.

2. **Strict Nutritional Mathematics:**
   - You MUST ensure: Total Calories = (4 * Protein) + (4 * Carbs) + (9 * Fats).
   - If the numbers do not match this formula exactly, recalculate until they do.

3. **No Medical Jargon Rule:**
   - Translate heavy physiological terms into heart-warming, conversational layman terms.
   - Example: Instead of "high insulin response", say "This food gives you a quick energy burst, but you might feel tired soon after."

4. **Structured Dashboard Output:**
   - Identify the meal name and exact estimated portion.
   - Provide a "Biological Logic" explaining how the body processes THIS specific meal.
   - Provide "Actionable Advice" for "Ideal For" and "Future Precautions".

5. **Language Runtime Sync:**
   - Render fields with 'Hi' suffix in warm, conversational Hindi.
   - Render fields with 'En' suffix in crisp, simple English.
   - Numerical values MUST be identical for both languages.

Current Input:
{{#if imageDataUri}}
Food Image provided.
{{/if}}
{{#if textQuery}}
Manual Entry: {{{textQuery}}}
{{/if}}

Respond ONLY in the specified JSON format. Ensure all calculations are mathematically perfect.`,
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
    
    // Server-side Math double-check for safety
    const calculatedCals = Math.round((output.protein * 4) + (output.carbs * 4) + (output.fats * 9));
    
    return {
        ...output,
        calories: calculatedCals // Ensure 100% adherence to strict math
    };
  }
);
