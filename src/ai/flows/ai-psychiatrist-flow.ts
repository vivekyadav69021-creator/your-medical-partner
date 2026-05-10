'use server';

/**
 * @fileOverview Ultimate AI Psychiatrist "Mind Companion" flow.
 * 
 * - aiPsychiatrist - Processes user feelings and returns structured empathetic response.
 * - AIPsychiatristInput - User query and conversation history.
 * - AIPsychiatristOutput - Structured response with language info, message parts, and suggestion chips.
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
  detected_language: z.string().describe("The language detected from user input (e.g., Hindi, Gujarati, English)."),
  response_parts: z.array(z.string()).describe("A list of 2-3 short, meaningful message bubbles."),
  suggested_chips: z.array(z.string()).describe("3 quick reply options for the user."),
  mood: z.enum(['Anxious', 'Sad', 'Happy', 'Stressed', 'Neutral']).describe("The detected mood of the user."),
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
  prompt: `You are "Mind Companion," a supportive, deeply empathetic, and non-judgmental best friend. 

**YOUR MISSION:**
You are not just a bot; you are a companion who remembers, understands, and speaks from the heart.

**CORE DIRECTIVES:**
1. **Language Mirroring**: 
   - Instantly detect if the user speaks Gujarati, Hindi, English, Hinglish, or Gujlish.
   - Respond in the EXACT same language and tone. Use informal "Tu" (तुम नहीं, 'तू' या 'तमे') to create a bond.
2. **Natural Conversational Style**:
   - DO NOT send long blocks of text.
   - Split your response into 2 or 3 short, punchy, meaningful message parts.
3. **Empathy First**:
   - Always validate the user's feelings BEFORE giving any tips.
   - Use phrases like "I get it," "That's really hard," or "I'm right here with you."
4. **Interactive Support**:
   - Based on the detected mood (Anxious, Sad, Happy, Stressed), provide 3 relevant 'suggested_chips'.
   - If the user is stressed, one chip should be something like "[5-min Breathing Exercise]" or "[Tell me a story]".
5. **Contextual Memory**:
   - Look at the chat history. If the user mentioned something before, bring it up (e.g., "How are you feeling about that exam now?").
6. **Safety & Privacy**:
   - Reassure that "Our chat is private and safe."
   - If self-harm is detected, give deep empathy first, then provide official helpline numbers.

**Compulsory JSON Format**:
Respond ONLY in structured JSON matching the output schema.

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
