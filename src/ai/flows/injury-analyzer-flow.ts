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
  classification: z.string().describe('Layman classification (e.g., A shallow scrape).'),
  severity: z.enum(['low', 'medium', 'high']).describe('Severity level.'),
  biologicalLogic: z.string().describe('Simplified explanation of body healing.'),
  firstAidSteps: z.array(z.string()).describe('Numbered first-aid steps.'),
  actionableAlert: z.string().optional().describe('Emergency alert if high severity.'),
  interactionPrompt: z.string().optional().describe('Specific follow-up question based on visible data.'),
  summary: z.string().describe('Concise Markdown summary.'),
  disclaimer: z.string().describe('Mandatory disclaimer.'),
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
Analyze the provided visual and textual data for traumatic injuries. You MUST provide a unique analysis based solely on the current input. DO NOT provide generic or repetitive responses.

**SCANNING PROTOCOLS (STRICT):**
1. **Visual Scan:** If an image is provided, examine specific morphology:
   - Identify precise colors (angry red, purple bruising, yellowish debris).
   - Look for texture (swelling, fluid, skin breaks, depth).
   - Detect location (is it on a joint, finger, or torso?).
2. **Contextual Cross-Reference:** Compare the image with the user's description: "{{{userQuery}}}".
   - If the user says "I burned it," look for blister patterns.
   - If they say "I fell," look for road rash or debris.
3. **Language Lock:** Your entire response must be in: {{language}}. If 'hi', use simple and natural Hindi.
4. **No Medical Jargon:** Use terms like "Redness" instead of "Erythema". Every technical observation MUST have a "meaning in simple words" attached.
5. **Dynamic Interaction:** If the image is unclear or the query is short, use 'interactionPrompt' to ask a highly specific question (e.g., "The area looks quite swollen, can you move the joint easily?").

**Emergency Alerts:**
- If severity is HIGH (heavy bleeding, exposed bone, 3rd-degree burn), populate 'actionableAlert' mentioning "Emergency SOS" to nearby hospitals in Vapi.

**Disclaimer (Use {{language}}):**
English: "This is an AI-generated first-aid guide for immediate awareness. If the injury is severe, seek professional medical treatment immediately."
Hindi: "यह तुरंत जागरूकता के लिए एक एआई-जनरेटेड प्राथमिक चिकित्सा (First-Aid) गाइड है। यदि चोट गंभीर है, तो तुरंत डॉक्टर या नजदीकी अस्पताल से संपर्क करें।"

Current Input:
Description: {{{userQuery}}}
{{#if imageDataUri}}
Injury Image: {{media url=imageDataUri}}
{{/if}}

Respond ONLY in the specified JSON format. Ensure every field is unique to this specific case.`,
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
      const output = response.output; // FIXED: Accessing as property
      
      if (!output) throw new Error('Analysis failed.');
      
      return output;
    } catch (e: any) {
      console.error("Injury Flow Error:", e);
      const isHindi = input.language === 'hi';
      return {
        classification: isHindi ? "स्थिति का आंकलन नहीं हो सका" : "Status unclear",
        severity: "low",
        biologicalLogic: isHindi ? "हम इस समय आपकी चोट का विश्लेषण करने में असमर्थ हैं।" : "We are unable to analyze your injury at this moment.",
        firstAidSteps: isHindi 
          ? ["चोट वाली जगह को साफ रखें", "हल्का दबाव डालें यदि रक्तस्राव हो", "जल्द से जल्द डॉक्टर से मिलें"]
          : ["Keep the area clean", "Apply light pressure if bleeding", "Consult a doctor immediately"],
        summary: isHindi ? "सिस्टम में तकनीकी समस्या है।" : "System technical issue.",
        disclaimer: isHindi
          ? "यह तुरंत जागरूकता के लिए एक एआई-जनरेटेड गाइड है। कृपया डॉक्टर से मिलें।"
          : "This is an AI guide. Please seek professional medical help.",
      };
    }
  }
);