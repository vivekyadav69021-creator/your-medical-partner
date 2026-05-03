'use server';
/**
 * @fileOverview Specialized Onboarding & Personalization Architect for Skin/Face Scanner.
 * 
 * - analyzeSkinImage - Analyzes facial skin images with integrated user input context.
 * - SkinAnalysisInput - The input type including image, query, and user profile metadata.
 * - SkinAnalysisOutput - Structured response with biological logic and nutritional support.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ConditionSchema = z.object({
  name: z.string().describe('The identified skin condition (e.g., "Acne Vulgaris").'),
  confidence: z.number().describe('Confidence level 0.0 to 1.0.'),
  description: z.string().describe('Simple explanation of the condition.'),
  biologicalLogic: z.string().describe('Scientific explanation using medical terminology (e.g., "follicular plug formation").'),
});

const SkinAnalysisInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of the face as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
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
  comparativeAnalysis: z.string().describe('How the visual data confirms or contradicts user descriptions.'),
  nutritionalSupport: z.array(z.string()).describe('Specific vitamins (E, C, Zinc) or foods suggested for this skin state.'),
  interactionPrompt: z.string().optional().describe('Contextual question asked to the user if query was insufficient.'),
  recommendations: z.array(z.object({
    type: z.enum(['routine', 'product', 'lifestyle']),
    suggestion: z.string(),
  })),
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
- Analyze visual morphology, distribution, and texture in the provided image.
- **Workflow Track 1 (Detect):** If no userQuery is provided, describe the visual findings and ask for context in 'interactionPrompt' (e.g., "Is it itchy or painful?").
- **Workflow Track 2 (Describe):** If userQuery is provided, prioritize reported symptoms to refine visual analysis. Compare visual pustules vs dry spots against user text.
- **Biological Logic:** Explain condition causes using medical terminology (e.g., "sebaceous gland overactivity").
- **Data Linkage:** Use User Profile (Age: {{userProfile.age}}, Lifestyle: {{userProfile.lifestyle}}, Diet: {{userProfile.dietaryPreference}}) to provide personalized advice.
- **Nutritional Support:** Suggest relevant vitamins (Zinc, C, E) or antioxidants based on the biological needs identified.

**Compulsory Disclaimer:** "This analysis is for educational purposes. Consult a dermatologist for prescription-grade treatment".

**User Input:**
Context: {{{userQuery}}}
Image: {{media url=imageDataUri}}

Provide the analysis in structured JSON format.`,
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
      if (!output) throw new Error('AI analysis failed.');
      return output;
    } catch (e: any) {
      console.error("Skin Flow Error:", e);
      return {
        overallAssessment: "Analysis Failed: " + (e.message || "Unknown error"),
        identifiedConditions: [],
        comparativeAnalysis: "Could not perform comparison.",
        nutritionalSupport: [],
        recommendations: [],
        interactionPrompt: "I'm having trouble seeing the image clearly. Could you try uploading a brighter photo?",
      };
    }
  }
);
