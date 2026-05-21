'use server';
/**
 * @fileOverview Advanced Onboarding & Personalization Architect for Skin/Face Scanner.
 * 
 * - analyzeSkinImage - Provides precise, scientific, and personalized dermatological insights.
 * - SkinAnalysisInput - Integrated input with user context and language selection.
 * - SkinAnalysisOutput - Structured JSON response in simple consumer-friendly language.
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

const SkinAnalysisInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of the face/skin as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
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
  potentialConditions: z.array(ConditionSchema).describe('Primary possibilities based on visual evidence.'),
  biologicalLogic: z.string().describe('Simplified "Why" using analogies (e.g., pores like small drains).'),
  comparativeAnalysis: z.string().describe('How visual data confirms or contradicts user text.'),
  nutritionalSupport: z.array(NutritionalSupportSchema).describe('Vitamins or foods for skin health.'),
  interactionPrompt: z.string().optional().describe('Contextual follow-up question if query is missing.'),
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
  prompt: `You are the Onboarding & Personalization Architect for the "Your Medical Partner" Skin/Face Scanner.

**MISSION:**
Analyze the provided skin image and user context to deliver scientific yet consumer-friendly insights.

**LANGUAGE LOCK (CRITICAL):**
Your ENTIRE response (all fields, headers, and descriptions) MUST be in: {{language}}.
If 'hi', use fluent, simple, and natural Hindi.
If 'en', use simple, clear English.

**DIAGNOSTIC PROTOCOLS:**
1. **Track 1 (Detect Mode):** If userQuery is missing, analyze morphology, distribution, and texture. descripcion. descriptively ask: "To provide a better analysis, can you tell us how it feels? Is it itchy, burning, or painful?" (Translate this to {{language}}).
2. **Track 2 (Describe Mode):** If userQuery is present ("{{{userQuery}}}"), prioritize these symptoms to refine the visual analysis.

**CONTENT RULES:**
- **NO JARGON:** Every clinical term MUST be explained simply (e.g., instead of "sebum", use "natural skin oil").
- **Biological Logic:** Use simple analogies (e.g., "Pores are like small drains that got clogged with dirt and oil").
- **Comparative Analysis:** State clearly if the photo confirms what the user said (e.g., "You mentioned itching, and the redness in the photo suggests irritation rather than just dryness").
- **Personalization:** Link advice to Profile: Age {{userProfile.age}}, Lifestyle {{userProfile.lifestyle}}, Diet {{userProfile.dietaryPreference}}.
- **Nutritional Support:** Suggest vitamins (E, C, Zinc) or antioxidants with simple benefits.

**Disclaimer (Use {{language}}):**
English: "This analysis is for educational purposes. Consult a dermatologist for prescription-grade treatment."
Hindi: "यह विश्लेषण केवल शैक्षिक उद्देश्यों के लिए है। प्रिस्क्रिप्शन-ग्रेड उपचार के लिए किसी त्वचा विशेषज्ञ (Dermatologist) से सलाह लें।"

Current Input:
Context: {{{userQuery}}}
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
      if (!output) throw new Error('AI failed to generate skin analysis.');
      
      return output;
    } catch (e: any) {
      console.error("Skin Flow Error:", e);
      const isHindi = input.language === 'hi';
      return {
        overallAssessment: isHindi ? "हम इस समय आपकी त्वचा का विश्लेषण करने में असमर्थ हैं।" : "We are unable to analyze your skin at this moment.",
        potentialConditions: [],
        biologicalLogic: "",
        comparativeAnalysis: "",
        nutritionalSupport: [],
        disclaimer: isHindi 
          ? "यह विश्लेषण केवल शैक्षिक उद्देश्यों के लिए है। कृपया डॉक्टर से मिलें।" 
          : "This analysis is for educational purposes. Please see a doctor.",
        interactionPrompt: isHindi 
          ? "कृपया एक साफ़ और स्पष्ट फोटो दोबारा अपलोड करने का प्रयास करें।" 
          : "Please try uploading a clear photo again.",
      };
    }
  }
);