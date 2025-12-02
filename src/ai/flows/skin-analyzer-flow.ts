
'use server';
/**
 * @fileOverview An AI flow for analyzing facial skin images.
 *
 * - analyzeSkinImage - Analyzes an image of a person's face for skin conditions.
 * - SkinAnalysisInput - The input type for the analyzeSkinImage function.
 * - SkinAnalysisOutput - The return type for the analyzeSkinImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ConditionSchema = z.object({
  name: z.string().describe('The name of the identified skin condition (e.g., "Acne Vulgaris", "Dark Circles", "Whiteheads").'),
  confidence: z.number().min(0).max(1).describe('The AI\'s confidence in this finding, from 0.0 to 1.0.'),
  description: z.string().describe('A brief, simple explanation of the condition.'),
});

const RecommendationSchema = z.object({
  type: z.enum(['routine', 'product', 'lifestyle']).describe('The type of recommendation.'),
  suggestion: z.string().describe('The specific suggestion (e.g., "Use a gentle cleanser twice daily", "Look for products with salicylic acid", "Ensure you get 7-8 hours of sleep").'),
});

const SkinAnalysisInputSchema = z.object({
  imageDataUri: z.string().describe("An image of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  userQuery: z.string().optional().describe("An optional query from the user, e.g., 'What are these spots on my cheeks?'"),
});
export type SkinAnalysisInput = z.infer<typeof SkinAnalysisInputSchema>;

const SkinAnalysisOutputSchema = z.object({
  overallAssessment: z.string().describe('A one or two-sentence high-level summary of the skin\'s condition.'),
  identifiedConditions: z.array(ConditionSchema).describe('A list of potential skin conditions identified in the image.'),
  recommendations: z.array(RecommendationSchema).describe('A list of general, non-prescriptive skincare recommendations.'),
});
export type SkinAnalysisOutput = z.infer<typeof SkinAnalysisOutputSchema>;

export async function analyzeSkinImage(
  input: SkinAnalysisInput
): Promise<SkinAnalysisOutput> {
  return skinAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skinAnalyzerPrompt',
  input: { schema: SkinAnalysisInputSchema },
  output: { schema: SkinAnalysisOutputSchema },
  prompt: `You are an expert AI dermatology assistant. Your task is to analyze the provided image of a human face and identify common, non-threatening skin concerns like pimples (acne), dark circles, whiteheads, blackheads, and general skin texture issues.

  **Critical Instructions:**
  1.  **Analyze the Image:** Carefully examine the facial image provided.
  2.  **Identify Conditions:** Look for common dermatological concerns. For each one you identify, create a structured object with its name, your confidence level, and a simple description.
  3.  **Formulate Overall Assessment:** Write a brief, high-level summary of the skin's apparent condition.
  4.  **Provide General Recommendations:** Based on your findings, offer a few actionable, non-prescription recommendations. Categorize them as 'routine' (e.g., cleansing habits), 'product' (e.g., ingredients to look for like salicylic acid, benzoyl peroxide, or hyaluronic acid), or 'lifestyle' (e.g., hydration, sleep).
  5.  **Safety First (Disclaimer):** You are NOT a doctor. Your recommendations must be general advice. You MUST NOT diagnose severe conditions or prescribe any medication. Every analysis MUST end with this disclaimer in the 'overallAssessment' or within the recommendations: "This is an AI-generated analysis for informational purposes only and is not a medical diagnosis. Please consult a qualified dermatologist for any health concerns."

  User has uploaded this image:
  {{media url=imageDataUri}}

  User's optional query: {{{userQuery}}}

  Now, provide a structured analysis in the required JSON format.
  `,
});


const skinAnalyzerFlow = ai.defineFlow(
  {
    name: 'skinAnalyzerFlow',
    inputSchema: SkinAnalysisInputSchema,
    outputSchema: SkinAnalysisOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        throw new Error("The AI model did not return a valid analysis.");
      }
      return output;
    } catch (e: any) {
        console.error("Skin analysis flow error:", e);
        // Ensure a valid, structured error response is always returned.
        return {
            overallAssessment: `Analysis Failed: ${e.message || 'An unexpected error occurred'}. Please try again.`,
            identifiedConditions: [],
            recommendations: [],
        };
    }
  }
);
