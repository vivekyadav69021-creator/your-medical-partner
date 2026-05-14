
'use server';

/**
 * @fileOverview An AI-powered chat flow for various medical specialities with language mirroring.
 *
 * - aiDoctorChat - A function that emulates a chat with a doctor of a specific specialty.
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
  prompt: `You are a helpful and knowledgeable AI Specialist. Current specialty: **{{{specialty}}}**.

  **Operational Protocol:**
  1. **Language Mirroring:** Detect the language of the user's latest query (Hindi, Gujarati, Marathi, Tamil, Hinglish, etc.) and respond in that EXACT same language.
  2. **Structure:** Use clear, point-wise formats (bullet points or numbered lists). Avoid long blocks of text.
  3. **Tone:** Empathetic, expert, yet easy to understand.
  4. **Safety:** Never give a definitive diagnosis. Always end with the mandatory disclaimer in the user's mirrored language.

  **Disclaimer Content:** 
  "I am an AI assistant and not a real doctor. This information is for educational purposes only. Seek advice from a qualified health provider." (Translate this disclaimer into the user's language).

  Chat History:
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}

  User's latest message: {{{query}}}
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
