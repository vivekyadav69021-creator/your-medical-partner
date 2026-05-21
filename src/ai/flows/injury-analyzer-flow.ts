'use server';
/**
 * @fileOverview Emergency Response Specialist for Injury Scanner.
 * 
 * - analyzeInjury - Provides immediate risk assessment and first-aid guidance.
 * - InjuryAnalysisInput - The input type including image and user context.
 * - InjuryAnalysisOutput - Structured response with severity, biological logic, and SOS alerts.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InjuryAnalysisInputSchema = z.object({
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the injury as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userQuery: z.string().optional().describe("User-reported context of the accident or symptoms."),
  language: z.enum(['en', 'hi']).optional().default('en'),
});
export type InjuryAnalysisInput = z.infer<typeof InjuryAnalysisInputSchema>;

const InjuryAnalysisOutputSchema = z.object({
  classification: z.string().describe('Simplified classification of the injury in layman terms (e.g., A simple skin scrape).'),
  severity: z.enum(['low', 'medium', 'high']).describe('Severity level of the injury.'),
  biologicalLogic: z.string().describe('Very simple explanation of what the body is doing (e.g., sending blood to heal).'),
  firstAidSteps: z.array(z.string()).describe('Numbered first-aid steps in simple language.'),
  actionableAlert: z.string().optional().describe('Bold alert for high severity injuries in the selected language.'),
  interactionPrompt: z.string().optional().describe('Contextual question if only an image is provided.'),
  summary: z.string().describe('A concise Markdown summary of the analysis in simple terms.'),
  disclaimer: z.string().describe('Language-bound mandatory disclaimer.'),
});
export type InjuryAnalysisOutput = z.infer<typeof InjuryAnalysisOutputSchema>;

export async function analyzeInjury(input: InjuryAnalysisInput): Promise<InjuryAnalysisOutput> {
  return injuryAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'injuryAnalyzerPrompt',
  input: { schema: InjuryAnalysisInputSchema },
  output: { schema: InjuryAnalysisOutputSchema },
  prompt: `You are the Emergency Response Specialist for the "Your Medical Partner" Injury Scanner.

**YOUR MISSION:**
Provide immediate risk assessment and first-aid guidance for traumatic injuries using EXTREMELY CLEAR, NON-MEDICAL language.

**OPERATIONAL PROTOCOLS:**
1. **Language Lock:** Respond ENTIRELY in the selected language: {{language}}. If 'hi', use fluent, simple Hindi. If 'en', use simple English.
2. **Two-Track Workflow:**
   - **Track 1 (Detect):** If no userQuery is provided, scan the image for morphology (cuts, scrapes, burns) and signs of inflammation (redness, swelling). Populate 'interactionPrompt'.
   - **Track 2 (Assisted):** If userQuery exists (e.g., "{{{userQuery}}}"), prioritize this context to assess the situation.
3. **No Jargon Rule:** Avoid medical terms like "Erythema" or "Laceration". Use "Redness" or "Cut". Every technical observation MUST be followed by a simple explanation.
4. **Biological Logic:** Explain the body's natural response simply (e.g., "The swelling is just your body's way of protecting the area while it fixes the tissue").
5. **Emergency SOS:** If severity is HIGH, populate 'actionableAlert' suggesting "Emergency SOS" for nearby hospitals in Vapi.

**DISCLAIMER CONTENT (Match language):**
- English: "This is an AI-generated first-aid guide for immediate awareness. If the injury is severe, seek professional medical treatment immediately."
- Hindi: "यह तुरंत जागरूकता के लिए एक एआई-जनरेटेड प्राथमिक चिकित्सा (First-Aid) गाइड है। यदि चोट गंभीर है, तो तुरंत डॉक्टर या नजदीकी अस्पताल से संपर्क करें।"

**Input Data:**
User Context: {{{userQuery}}}
Image: {{#if imageDataUri}}{{media url=imageDataUri}}{{else}}No image provided.{{/if}}

Respond in structured JSON matching the output schema.`,
});

const injuryAnalyzerFlow = ai.defineFlow(
  {
    name: 'injuryAnalyzerFlow',
    inputSchema: InjuryAnalysisInputSchema,
    outputSchema: InjuryAnalysisOutputSchema,
  },
  async (input) => {
    try {
      const response = await prompt(input);
      const output = response.output();
      if (!output) throw new Error('Analysis failed.');
      return output;
    } catch (e: any) {
      console.error("Injury Flow Error:", e);
      const isHindi = input.language === 'hi';
      return {
        classification: isHindi ? "स्थिति स्पष्ट नहीं है" : "Unclear status",
        severity: "low",
        biologicalLogic: isHindi ? "हम अभी इस स्थिति का विश्लेषण नहीं कर पा रहे हैं।" : "We cannot analyze the situation at the moment.",
        firstAidSteps: isHindi 
          ? ["चोट वाली जगह को साफ पानी से धोएं", "साफ कपड़े से ढकें", "दर्द बढ़ने पर डॉक्टर से मिलें"]
          : ["Clean with water", "Cover with clean cloth", "Consult doctor if pain increases"],
        interactionPrompt: isHindi 
          ? "क्या आप बता सकते हैं कि यह चोट कैसे लगी? इससे हमें बेहतर सलाह देने में मदद मिलेगी।"
          : "Could you tell us how this happened? This will help us provide better advice.",
        summary: isHindi ? "एनालिसिस विफल रहा।" : "Analysis failed.",
        disclaimer: isHindi
          ? "यह तुरंत जागरूकता के लिए एक एआई-जनरेटेड प्राथमिक चिकित्सा (First-Aid) गाइड है। यदि चोट गंभीर है, तो तुरंत डॉक्टर या नजदीकी अस्पताल से संपर्क करें।"
          : "This is an AI-generated first-aid guide for immediate awareness. If the injury is severe, seek professional medical treatment immediately.",
      };
    }
  }
);
