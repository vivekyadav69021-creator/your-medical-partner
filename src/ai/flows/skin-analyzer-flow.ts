'use server';
/**
 * @fileOverview Optimized Skin/Face Scanner Flow.
 * 
 * - analyzeSkinImage - Provides fast, scientific, and personalized dermatological insights.
 * - SkinAnalysisInput - Integrated input with user context.
 * - SkinAnalysisOutput - Structured JSON response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ConditionSchema = z.object({
  name: z.string().describe('The identified skin condition (e.g., "Acne Vulgaris").'),
  confidence: z.number().describe('Confidence level 0.0 to 1.0.'),
  description: z.string().describe('Simple explanation of the condition.'),
  biologicalLogic: z.string().describe('Scientific explanation using medical terminology.'),
});

const SkinAnalysisInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of the face as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userQuery: z.string().optional().describe("User-reported symptoms or context."),
  userProfile: z.object({
    age: z.string().optional(),
    lifestyle: z.string().optional(),
    dietaryPreference: z.string().optional(),
  }).optional(),
});
export type SkinAnalysisInput = z.infer<typeof SkinAnalysisInputSchema>;

const SkinAnalysisOutputSchema = z.object({
  overallAssessment: z.string().describe('High-level summary of the skin condition.'),
  identifiedConditions: z.array(ConditionSchema).describe('List of potential conditions.'),
  comparativeAnalysis: z.string().describe('Correlation between visual data and user text.'),
  nutritionalSupport: z.array(z.string()).describe('Suggested vitamins or foods for this skin state.'),
  interactionPrompt: z.string().optional().describe('Follow-up question if details are insufficient.'),
  recommendations: z.array(z.object({
    type: z.enum(['routine', 'product', 'lifestyle']),
    suggestion: z.string(),
  })),
  disclaimer: z.string().describe('The mandatory clinical disclaimer.'),
});
export type SkinAnalysisOutput = z.infer<typeof SkinAnalysisOutputSchema>;

export async function analyzeSkinImage(input: SkinAnalysisInput): Promise<SkinAnalysisOutput> {
  return skinAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skinAnalyzerPrompt',
  input: { schema: SkinAnalysisInputSchema },
  output: { schema: SkinAnalysisOutputSchema },
  prompt: `You are the Onboarding & Personalization Architect for the "Your Medical Partner" Skin/Face Scanner.

**Operational Protocol:**
- Analyze visual morphology, pigmentation, and texture in the provided image.
- **Workflow Track 1 (Detect):** If no userQuery is provided, describe findings and ask for context in 'interactionPrompt'.
- **Workflow Track 2 (Describe):** If userQuery is provided, prioritize reported symptoms to refine visual analysis.
- **Biological Logic:** Explain the 'why' using medical terminology (e.g., "follicular plug formation").
- **Data Linkage:** Personalize advice using provided Profile (Age: {{userProfile.age}}, Lifestyle: {{userProfile.lifestyle}}, Diet: {{userProfile.dietaryPreference}}).

**Compulsory Disclaimer:** "This analysis is for educational purposes. Consult a dermatologist for prescription-grade treatment".

**User Input:**
Context: {{{userQuery}}}
User Profile Data: Age {{userProfile.age}}, Lifestyle {{userProfile.lifestyle}}, Diet {{userProfile.dietaryPreference}}
Image: {{media url=imageDataUri}}

Respond ONLY in valid JSON matching the output schema.`,
});

const skinAnalyzerFlow = ai.defineFlow(
  {
    name: 'skinAnalyzerFlow',
    inputSchema: SkinAnalysisInputSchema,
    outputSchema: SkinAnalysisOutputSchema,
  },
  async (input) => {
    try {
      const response = await prompt({
        ...input,
        userProfile: input.userProfile || { age: 'unknown', lifestyle: 'unknown', dietaryPreference: 'unknown' }
      });
      
      const output = response.output();
      if (!output) throw new Error('AI failed to generate a valid dermatological response.');
      
      return {
        ...output,
        disclaimer: output.disclaimer || "This analysis is for educational purposes. Consult a dermatologist for prescription-grade treatment."
      };
    } catch (e: any) {
      console.error("Skin Flow Error:", e);
      return {
        overallAssessment: "We encountered an issue during visual analysis. Please ensure the photo is well-lit and clear.",
        identifiedConditions: [],
        comparativeAnalysis: "Unable to cross-reference visual data with your description at this moment.",
        nutritionalSupport: ["Vitamin E", "Zinc-rich foods"],
        recommendations: [
          { type: 'lifestyle', suggestion: "Keep the area clean and avoid using harsh chemicals until a professional exam." }
        ],
        disclaimer: "Analysis system is currently under maintenance or input image was invalid.",
        interactionPrompt: "Could you try uploading a closer, clearer photo under natural light?",
      };
    }
  }
);
