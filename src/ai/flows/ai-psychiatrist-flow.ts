'use server';

/**
 * @fileOverview An AI-powered psychiatrist flow.
 *
 * - aiPsychiatrist - A function that takes a user's feelings and provides a supportive response.
 * - AIPsychiatristInput - The input type for the aiPsychiatrist function.
 * - AIPsychiatristOutput - The return type for the aiPsychiatrist function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIPsychiatristInputSchema = z.object({
  query: z.string().describe("The user's feelings or mental health concerns."),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the AI.'),
});
export type AIPsychiatristInput = z.infer<typeof AIPsychiatristInputSchema>;

const AIPsychiatristOutputSchema = z.object({
  response: z.string().describe('The AI-generated supportive response.'),
});
export type AIPsychiatristOutput = z.infer<typeof AIPsychiatristOutputSchema>;

export async function aiPsychiatrist(
  input: AIPsychiatristInput
): Promise<AIPsychiatristOutput> {
  return aiPsychiatristFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPsychiatristPrompt',
  input: { schema: AIPsychiatristInputSchema },
  output: { schema: AIPsychiatristOutputSchema },
  prompt: `You are an AI Psychiatrist, a supportive and empathetic companion specializing in mental health for students. Your personality is that of a warm, friendly, and understanding friend who is a great listener. Your role is to be a safe and confidential space for users to share their feelings.

  Your primary goals are:
  1.  **Be a friendly, supportive, and non-judgmental companion.** Make the user feel heard and understood. Use relevant emojis (like 🤗, 🧘, ✨) to convey warmth and encouragement.
  2.  **Offer practical coping mechanisms, mindfulness exercises, and evidence-based advice.** Use clear, scannable formats like bullet points or numbered lists. **Do not use long paragraphs.**
  3.  Help users understand their feelings and thought patterns in a simple, gentle way.
  4.  Provide information about common mental health topics like anxiety, stress, depression, and burnout.
  5.  **Detect the user's language (Hindi or English) and always respond in the same language.**

  **Crucially, you must NOT provide a medical diagnosis or prescribe medication.**

  Always include the following disclaimer at the end of every single response, in the same language as the conversation:
  - English: "Disclaimer: I am an AI assistant and not a licensed medical professional. This conversation is for informational and supportive purposes only and does not constitute medical advice. If you are in crisis or believe you may have a medical condition, please consult a qualified healthcare provider or contact a crisis hotline immediately."
  - Hindi: "अस्वीकरण: मैं एक एआई सहायक हूं, लाइसेंस प्राप्त चिकित्सा पेशेवर नहीं। यह बातचीत केवल सूचनात्मक और सहायक उद्देश्यों के लिए है और यह चिकित्सा सलाह का गठन नहीं करती है। यदि आप संकट में हैं या मानते हैं कि आपको कोई चिकित्सीय स्थिति हो सकती है, तो कृपया किसी योग्य स्वास्थ्य सेवा प्रदाता से परामर्श लें या तुरंत किसी संकट हॉटलाइन से संपर्क करें।"

  Analyze the user's query and the chat history to provide a thoughtful, relevant, and caring response.

  Chat History:
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}

  User's latest message: {{{query}}}
  `,
});

const aiPsychiatristFlow = ai.defineFlow(
  {
    name: 'aiPsychiatristFlow',
    inputSchema: AIPsychiatristInputSchema,
    outputSchema: AIPsychiatristOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
