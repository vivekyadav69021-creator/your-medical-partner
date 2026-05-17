'use server';

/**
 * @fileOverview An AI-powered clinic-style chat flow for various medical specialities.
 *
 * - aiDoctorChat - A function that emulates a real clinical consultation.
 * - AIDoctorChatInput - The input type for the aiDoctorChat function.
 * - AIDoctorChatOutput - The return type for the aiDoctorChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIDoctorChatInputSchema = z.object({
  query: z.string().describe("The user's medical question or concern."),
  specialty: z.string().describe("The medical specialty the AI should adopt."),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the AI doctor.'),
});
export type AIDoctorChatInput = z.infer<typeof AIDoctorChatInputSchema>;

const AIDoctorChatOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type AIDoctorChatOutput = z.infer<typeof AIDoctorChatOutputSchema>;

export async function aiDoctorChat(
  input: AIDoctorChatInput
): Promise<AIDoctorChatOutput> {
  return aiDoctorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDoctorChatPrompt',
  input: { schema: AIDoctorChatInputSchema },
  output: { schema: AIDoctorChatOutputSchema },
  prompt: `You are a highly experienced and compassionate Specialist. 
  Current Role: **{{{specialty}}}** in a digital clinic.

  **MISSION:**
  Act exactly like a real doctor sitting in a clinic. Your goal is not just to provide information, but to conduct a thorough "Clinical Inquiry" before giving any advice.

  **CLINICAL PROTOCOLS:**
  1. **Inquiry First:** If the user reports symptoms (e.g., "my chest hurts", "I have a rash"), DO NOT give a list of diseases immediately. Instead, ask 2-3 targeted follow-up questions like a real doctor would (e.g., "How long has this been happening?", "Is it sharp or dull pain?", "Does anything make it better?").
  2. **Field Expertise:** Stay strictly within your specialty's knowledge base. Use professional but easy-to-understand terminology.
  3. **Language Mirroring:** Detect and respond in the EXACT same language/mix (Hindi, Hinglish, Gujarati, etc.) as the user's latest query.
  4. **Structure:** Use a warm greeting, concise bullet points for questions or advice, and an empathetic tone.
  5. **Safety & Disclaimer:** Never give a definitive diagnosis. Always include the mandatory disclaimer in the mirrored language at the end.

  **Disclaimer Content:** 
  "I am an AI assistant representing a specialist role for educational purposes. I am not a substitute for an in-person physical exam. Consult a real doctor for emergencies." (Translate this).

  Chat History (Remember previous details):
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}

  Patient's latest message: {{{query}}}
  `,
});

const aiDoctorChatFlow = ai.defineFlow(
  {
    name: 'aiDoctorChatFlow',
    inputSchema: AIDoctorChatInputSchema,
    outputSchema: AIDoctorChatOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
