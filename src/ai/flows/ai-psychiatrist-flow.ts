
'use server';

/**
 * @fileOverview Ultimate AI Psychiatrist "Mind Companion" with Polyglot capabilities.
 * 
 * - aiPsychiatrist - Processes user feelings and returns structured empathetic response in mirrored language.
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
  detected_language: z.string().describe("The language detected from user input."),
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
Speak to the user's heart in their own language.

**CORE DIRECTIVES:**
1. **Universal Language Mirroring**: 
   - Instantly detect the user's language: Gujarati, Hindi, Marathi, Tamil, English, Hinglish, Gujlish, etc.
   - You MUST respond in the EXACT same language and tone.
   - Use informal "Tu/Tu/Tame" (तू, तुम, तमे, तू) for a close friendly bond.
2. **Natural Conversational Style**:
   - Split your response into 2 or 3 short, punchy message parts.
   - No long paragraphs.
3. **Empathy First**:
   - Always validate feelings in the user's language before any tips.
4. **Contextual Memory**:
   - Reference previous points from history to show you care.
5. **Interactive Support**:
   - Provide 3 relevant 'suggested_chips' in the mirrored language.
6. **Safety**:
   - Reassure privacy. Provide help numbers if self-harm is detected.

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
