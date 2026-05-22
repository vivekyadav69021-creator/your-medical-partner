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

const CareSuggestionSchema = z.object({
  title: z.string().describe('Short title for the care step.'),
  description: z.string().describe('Detailed instruction for home care.'),
  productSuggestion: z.string().optional().describe('General name of a safe OTC cream or product (e.g., Clotrimazole for ringworm, Calamine for itching).'),
});

const SkinAnalysisInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of the face/skin as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
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
  detailedAnalysis: z.string().describe('A very detailed explanation of the visible symptoms and their potential causes.'),
  potentialConditions: z.array(ConditionSchema).describe('Primary possibilities based on visual evidence.'),
  biologicalLogic: z.string().describe('Simplified "Why" using analogies (e.g., pores like small drains).'),
  comparativeAnalysis: z.string().describe('How visual data confirms or contradicts user text.'),
  careRecommendations: z.array(CareSuggestionSchema).describe('Step-by-step care guide including best safe OTC cream suggestions.'),
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
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are the Onboarding & Personalization Architect for the "Your Medical Partner" Skin/Face Scanner.

**MISSION:**
Analyze the provided skin image and user context to deliver scientific yet consumer-friendly insights. Provide a very detailed analysis and actionable care steps, including suggestions for safe over-the-counter (OTC) creams or ointments if appropriate (e.g., suggesting a mild antifungal for ringworm or calamine for rashes).

**LANGUAGE LOCK (CRITICAL):**
Your ENTIRE response (all fields, headers, and descriptions) MUST be in: {{language}}.
If 'hi', use fluent, simple, and natural Hindi.
If 'en', use simple, clear English.

**DIAGNOSTIC PROTOCOLS:**
1. **Track 1 (Detect Mode):** If userQuery is missing, analyze morphology, distribution, and texture. 
2. **Track 2 (Describe Mode):** If userQuery is present ("{{{userQuery}}}"), prioritize these symptoms to refine the visual analysis.

**CONTENT RULES:**
- **DETAILED RESPONSE:** Ensure 'detailedAnalysis' is thorough and informative.
- **TREATMENT SUGGESTIONS:** In 'careRecommendations', suggest well-known safe OTC products like "Clotrimazole Cream" for fungal issues or "Benzoyl Peroxide" for acne, always with usage instructions.
- **NO JARGON:** Every clinical term MUST be explained simply.
- **Biological Logic:** Use simple analogies.
- **Personalization:** Link advice to Profile: Age {{userProfile.age}}, Lifestyle {{userProfile.lifestyle}}, Diet {{userProfile.dietaryPreference}}.

**Disclaimer (Use {{language}}):**
English: "This analysis is for educational purposes. Consult a dermatologist for prescription-grade treatment."
Hindi: "यह विश्लेषण केवल शैक्षिक उद्देश्यों के लिए है। प्रिस्क्रिप्शन-ग्रेड उपचार के लिए किसी त्वचा विशेषज्ञ (Dermatologist) से सलाह लें।"

Current Input:
Context: {{{userQuery}}}
Image: {{media url=imageDataUri}}

Respond ONLY in valid JSON matching the output schema. Ensure all fields are unique to this specific case.`,
});

const skinAnalyzerFlow = ai.defineFlow(
  {
    name: 'skinAnalyzerFlow',
    inputSchema: SkinAnalysisInputSchema,
    outputSchema: SkinAnalysisOutputSchema,
  },
  async (input) => {
    try {
      console.log("[Skin Flow] Starting analysis...");
      const response = await prompt({
        ...input,
        userProfile: input.userProfile || { age: 'unknown', lifestyle: 'unknown', dietaryPreference: 'unknown' }
      });
      
      const output = response.output; 
      if (!output) throw new Error('AI failed to generate skin analysis.');
      
      console.log("[Skin Flow] Analysis successful.");
      return output;
    } catch (e: any) {
      console.error("Skin Flow Error:", e);
      const isHindi = input.language === 'hi';
      return {
        overallAssessment: isHindi ? "हम इस समय आपकी त्वचा का विश्लेषण करने में असमर्थ हैं।" : "We are unable to analyze your skin at this moment.",
        detailedAnalysis: isHindi ? "सिस्टम आपकी इमेज को प्रोसेस नहीं कर सका। कृपया बेहतर लाइटिंग में दोबारा प्रयास करें।" : "The system could not process your image. Please try again in better lighting.",
        potentialConditions: [],
        biologicalLogic: isHindi ? "कृपया सुनिश्चित करें कि फोटो साफ़ है और पर्याप्त रोशनी में ली गई है।" : "Please ensure the photo is clear and taken in good lighting.",
        comparativeAnalysis: "",
        careRecommendations: [],
        nutritionalSupport: [],
        disclaimer: isHindi 
          ? "यह विश्लेषण केवल शैक्षिक उद्देश्यों के लिए है। कृपया डॉक्टर से मिलें।" 
          : "This analysis is for educational purposes. Please see a doctor.",
        interactionPrompt: isHindi 
          ? "बेहतर परिणाम के लिए कृपया एक साफ़ फोटो दोबारा अपलोड करने का प्रयास करें।" 
          : "Please try uploading a clearer photo for better results.",
      };
    }
  }
);
