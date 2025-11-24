'use server';

/**
 * @fileOverview A health assistant AI flow.
 *
 * - healthAssistant - A function that takes a user query and returns a health-related response.
 * - HealthAssistantInput - The input type for the healthAssistant function.
 * - HealthAssistantOutput - The return type for the healthAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question about health, medicine, or diseases.'),
  photoDataUri: z.string().optional().describe(
      "An optional photo of a health concern (e.g., rash, pill), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type HealthAssistantInput = z.infer<typeof HealthAssistantInputSchema>;

const HealthAssistantOutputSchema = z.object({
  response: z
    .string()
    .describe('The AI-generated response to the user\'s query.'),
});
export type HealthAssistantOutput = z.infer<
  typeof HealthAssistantOutputSchema
>;

export async function healthAssistant(
  input: HealthAssistantInput
): Promise<HealthAssistantOutput> {
  return healthAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthAssistantPrompt',
  input: {schema: HealthAssistantInputSchema},
  output: {schema: HealthAssistantOutputSchema},
  prompt: `You are a sophisticated AI Health Assistant. Your role is to provide detailed, structured, and helpful information in response to user queries about health, diseases, and medicines.

  Your response MUST follow this 12-point structure exactly, using Markdown for formatting. Use relevant emojis to make the content engaging.

  User query: {{{query}}}
  {{#if photoDataUri}}
  User has provided a photo:
  {{media url=photoDataUri}}
  {{/if}}

  **1. Title / Short Headline (1 line)**
  Provide a concise topic name for the query.

  **2. One-line Summary**
  A single sentence summarizing the main point. Include a severity flag (e.g., 🟢 Low, 🟡 Medium, 🔴 High) to indicate potential seriousness.

  **3. Key Facts / At-a-glance (3–5 bullets)**
  - Provide quick, scannable, and actionable points.
  - Mention relevant age groups, urgency, and simple initial steps.

  **4. Details / Explanation**
  Use short paragraphs with clear subheadings.
  - **What it is:** Briefly explain the condition.
  - **Common Causes:** List primary causes.
  - **Key Symptoms:** Describe the main symptoms.

  **5. Immediate Home Care / First Aid**
  Provide a numbered list of actionable steps. Clearly state what to do and what NOT to do.
  - Example: 1. **Do:** Rest in a quiet, dark room. 2. **Don't:** Consume caffeine or alcohol.

  **6. When to See a Doctor (Red Flags)**
  - Use a bulleted list with urgent language to highlight critical symptoms.
  - Example: • Sudden, severe headache unlike any you've had before.

  **7. Medicines & Treatments (General Info)**
  - Provide non-prescriptive information about common treatment approaches.
  - **Crucially, state "Consult a doctor for a diagnosis and prescription."**
  - Mention safe over-the-counter (OTC) examples if applicable (e.g., "paracetamol for fever").

  **8. Prevention & Longer-Term Advice**
  Offer simple, daily tips for prevention and long-term management.

  **9. Related Items / Quick Links**
  (This section is for future functionality, for now, use placeholders).
  - Placeholder links to: Disease Library, Medical Store, Book a Doctor, and My Planner.

  **10. Confidence / Source Tag**
  - State the source of the information (e.g., "Based on standard medical information").
  - Add a confidence level (e.g., "AI-generated summary (High confidence)").

  **11. Follow-up Prompts / Quick Replies**
  Suggest 3-4 follow-up questions the user might have.
  - Examples: "Show me nearby doctors", "Translate to Hindi", "What are the risk factors?"

  **12. Disclaimer**
  - You MUST include this exact mandatory disclaimer at the end of every response:
  "🩺 **Disclaimer:** This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or another qualified health provider with any questions you may have regarding a medical condition."
  `,
});

const healthAssistantFlow = ai.defineFlow(
  {
    name: 'healthAssistantFlow',
    inputSchema: HealthAssistantInputSchema,
    outputSchema: HealthAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
