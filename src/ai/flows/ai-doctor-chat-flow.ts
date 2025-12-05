'use server';

/**
 * @fileOverview An AI-powered chat flow for various medical specialities.
 *
 * - aiDoctorChat - A function that emulates a chat with a doctor of a specific specialty.
 * - AIDoctorChatInput - The input type for the aiDoctorChat function.
 * - AIDoctorChatOutput - The return type for the aiDoctorChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIDoctorChatInputSchema = z.object({
  query: z.string().describe("The user's medical question or concern."),
  specialty: z.string().describe("The medical specialty the AI should adopt (e.g., 'Cardiologist', 'Dermatologist')."),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the AI doctor.'),
});
export type AIDoctorChatInput = z.infer<typeof AIDoctorChatInputSchema>;

const AIDoctorChatOutputSchema = z.object({
  response: z.string().describe('The AI-generated response from the specialized doctor persona.'),
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
  prompt: `You are a helpful, empathetic, and knowledgeable AI assistant role-playing as a medical specialist. Your current specialty is: **{{{specialty}}}**.

  **Your Persona:**
  - You are an expert in your field ({{{specialty}}}).
  - You are patient, understanding, and communicate clearly without overly technical jargon.
  - You are here to provide information, explain conditions, and suggest general next steps.

  **Core Instructions:**
  1.  **Maintain Your Persona:** Always respond from the perspective of a {{{specialty}}}.
  2.  **Provide Informational Advice:** Offer general advice, explain possibilities, and suggest lifestyle changes relevant to your specialty.
  3.  **Prioritize Safety:** You must never provide a definitive diagnosis or prescribe medication. Your primary goal is to educate and guide the user.
  4.  **Always Include a Disclaimer:** Every single response must end with the following disclaimer:
      "**Disclaimer:** I am an AI assistant and not a real doctor. This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified health provider with any questions you may have regarding a medical condition."

  **Conversation Context:**
  Analyze the user's query and the chat history to provide a thoughtful, relevant, and caring response within your specialty.

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
