'use server';
/**
 * @fileOverview Advanced Onboarding & Personalization Architect for Skin/Face Scanner.
 * 
 * - analyzeSkinImage - Provides precise, scientific, and personalized dermatological insights.
 * - Supports multiple images for better diagnostic accuracy.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ConditionSchema = z.object({
  name: z.string().describe('The name of the condition in simple terms (e.g., "Pimple/Acne" instead of "Acne Vulgaris").'),
  simpleDescription: z.string().describe('A non-medical, easy-to-understand explanation of the condition.'),
});

const NutritionalSupportSchema = z.object({
  item: z.string().describe('Common vitamin or food item (e.g., "Vitamin C", "Berries").'),
  benefit: z.string().describe('Simple explanation of how it protects the skin.'),
});

const CareSuggestionSchema = z.object({
  title: z.string().describe('Short title for the care step.'),
  description: z.string().describe('Detailed instruction for home care.'),
  productSuggestion: z.string().optional().describe('General name of a safe OTC cream or product (e.g., Clotrimazole for ringworm, Calamine for itching).'),
});

const SkinAnalysisInputSchema = z.object({
  images: z.array(z.string()).describe("A list of skin/face photos as data URIs."),
  userQuery: z.string().optional().describe("User-reported symptoms like itching, duration, or triggers."),
  language: z.enum(['en', 'hi']).optional().default('en').describe('The language for the entire output.'),
  userProfile: z.object({
    age: z.string().optional(),
    lifestyle: z.string().optional(),
    dietaryPreference: z.string().optional(),
  }).optional(),
});
export type SkinAnalysisInput = z.infer<typeof SkinAnalysisInputSchema>;

const SkinAnalysisOutputSchema = z.object({
  overallAssessment: z.string().describe('A concise summary of the skin state.'),
  detailedAnalysis: z.string().describe('A very detailed explanation of the visible symptoms and their potential causes.'),
  potentialConditions: z.array(ConditionSchema).describe('Primary possibilities based on visual evidence.'),
  biologicalLogic: z.string().describe('Simplified "Why" using analogies.'),
  careRecommendations: z.array(CareSuggestionSchema).describe('Step-by-step care guide.'),
  nutritionalSupport: z.array(NutritionalSupportSchema).describe('Vitamins or foods for skin health.'),
  thingsToAvoid: z.array(z.string()).describe('List of activities or products to avoid.'),
  interactionPrompt: z.string().optional().describe('Contextual follow-up question.'),
  disclaimer: z.string().describe('Language-bound mandatory disclaimer.'),
});
export type SkinAnalysisOutput = z.infer<typeof SkinAnalysisOutputSchema>;

export async function analyzeSkinImage(input: SkinAnalysisInput): Promise<SkinAnalysisOutput> {
  return skinAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skinAnalyzerPrompt',
  input: { schema: SkinAnalysisInputSchema },
  output: { schema: SkinAnalysisOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are the Lead Dermatological Architect. 
Analyze ALL provided images (multiple angles/views) of the skin concern.

**MISSION:**
Correlate the visual evidence from all photos with the user's query: "{{{userQuery}}}".
Language: {{language}}. If 'hi', use natural and simple Hindi.

**Rules:**
- Extract details from every photo.
- suggest safe OTC products (e.g., Calamine, Clotrimazole).
- Link to Profile: Age {{userProfile.age}}, Lifestyle {{userProfile.lifestyle}}.

Images:
{{#each images}}
- Photo {{@index}}: {{media url=this}}
{{/each}}

Respond ONLY in valid JSON.`,
});

const skinAnalyzerFlow = ai.defineFlow(
  {
    name: 'skinAnalyzerFlow',
    inputSchema: SkinAnalysisInputSchema,
    outputSchema: SkinAnalysisOutputSchema,
  },
  async (input) => {
    const response = await prompt({
      ...input,
      userProfile: input.userProfile || { age: 'unknown', lifestyle: 'unknown', dietaryPreference: 'unknown' }
    });
    if (!response.output) throw new Error('AI failed to generate skin analysis.');
    return response.output;
  }
);
