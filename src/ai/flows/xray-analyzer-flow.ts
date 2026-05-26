'use server';
/**
 * @fileOverview Senior Radiographic Analysis Specialist for X-ray Scanner.
 * 
 * - analyzeXray - Provides deep, systematic preliminary insights and structural analysis of X-rays.
 * - AnalyzeXrayInput - Input including X-ray image and optional user description.
 * - AnalyzeXrayOutput - Structured clinical observations, anatomical identification, and biological reasoning.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeXrayInputSchema = z.object({
  image: z.object({
    url: z
      .string()
      .describe(
        "The X-ray image to analyze, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
    contentType: z.string().describe('The MIME type of the image (e.g., "image/jpeg").'),
  }),
  userQuery: z.string().optional().describe("User-reported symptoms or context of injury."),
  language: z.enum(['en', 'hi']).optional().default('en'),
});
export type AnalyzeXrayInput = z.infer<typeof AnalyzeXrayInputSchema>;

const AnalyzeXrayOutputSchema = z.object({
  status: z.enum(['ok', 'error']).describe('The status of the analysis.'),
  bodyPart: z.string().describe('Identified body part or bone structure (e.g., Distal Radius, Lumbar Spine).'),
  observation: z.string().describe('A very detailed description of radiographic findings. Mention alignment, cortical integrity, and joint spaces.'),
  clinicalImplications: z.string().describe('What these findings suggest in medical terms (e.g., Potential hairline fracture, osteophyte formation).'),
  biologicalReasoning: z.string().describe('Clinical logic explaining why these changes might have occurred based on the mechanism of injury.'),
  suggestedActions: z.array(z.string()).describe('Non-prescription stabilizing steps like R.I.C.E protocol or immobilization.'),
  interactionPrompt: z.string().optional().describe('Follow-up question for low-quality or low-context scans.'),
  disclaimer: z.string().describe('Mandatory radiographic disclaimer.'),
  error: z.string().optional().describe('Error message if status is "error".'),
});
export type AnalyzeXrayOutput = z.infer<typeof AnalyzeXrayOutputSchema>;

export async function analyzeXray(
  input: AnalyzeXrayInput
): Promise<AnalyzeXrayOutput> {
  return analyzeXrayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeXrayPrompt',
  input: { schema: AnalyzeXrayInputSchema },
  output: { schema: AnalyzeXrayOutputSchema },
  prompt: `You are a Senior Radiographic Analysis Specialist with over 20 years of experience in Radiology.

**YOUR MISSION:**
Provide a deep, systematic review of the provided X-ray image. Do not be vague. Use professional terminology and explain it for the user.

**SCANNING PROTOCOLS (STRICT):**
1. **Anatomical Identification:** Identify the specific bone or joint structure shown (e.g., "Left Knee - Lateral View").
2. **Systematic Review:**
   - **A (Alignment):** Check for dislocations, subluxations, or abnormal angulation.
   - **B (Bone Quality):** Look for cortical breaks (fractures), lucencies (densities), or lesions.
   - **C (Cartilage/Joints):** Check if joint spaces are preserved or narrowed.
   - **S (Soft Tissue):** Identify swelling or abnormal shadows.
3. **Contextual Correlation:** Use the user's description: "{{{userQuery}}}" to focus the scan. If they mention a fall, look for subtle stress lines.
4. **Language Lock:** Respond entirely in {{language}}. If 'hi', use natural and professional Hindi.

**Mandatory Radiographic Disclaimer:** "This is an AI-powered preliminary scan for awareness. AI can misinterpret shadows or lighting in X-rays. Please consult a certified Radiologist or Orthopedic Surgeon for a final official diagnosis."

Language: {{language}}
Context: {{{userQuery}}}
Image: {{media url=image.url}}

Respond ONLY in structured JSON matching the output schema. Provide a very detailed 'observation' field.`,
});

const analyzeXrayFlow = ai.defineFlow(
  {
    name: 'analyzeXrayFlow',
    inputSchema: AnalyzeXrayInputSchema,
    outputSchema: AnalyzeXrayOutputSchema,
  },
  async input => {
    try {
        const response = await prompt(input);
        const output = response.output;
        if (!output) throw new Error('Radiographic analysis failed.');
        
        return {
            ...output,
            status: 'ok',
            disclaimer: input.language === 'hi' 
              ? "यह जागरूकता के लिए एक एआई-पावर्ड प्रारंभिक स्कैन है। एआई एक्स-रे में छाया या रोशनी को गलत समझ सकता है। अंतिम निदान के लिए कृपया प्रमाणित रेडियोलॉजिस्ट या आर्थोपेडिक सर्जन से परामर्श लें।"
              : "This is an AI-powered preliminary scan for awareness. AI can misinterpret shadows or lighting in X-rays. Please consult a certified Radiologist or Orthopedic Surgeon for a final official diagnosis."
        };
    } catch(e: any) {
        console.error("X-ray analysis flow error:", e);
        return { 
            status: 'error', 
            bodyPart: 'Unknown',
            observation: '',
            clinicalImplications: '',
            biologicalReasoning: '',
            suggestedActions: [],
            disclaimer: "Analysis failed.",
            error: e.message || 'An unexpected error occurred during analysis.' 
        };
    }
  }
);
