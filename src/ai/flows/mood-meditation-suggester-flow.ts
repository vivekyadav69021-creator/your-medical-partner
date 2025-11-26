'use server';

/**
 * @fileOverview An AI-powered flow to suggest meditations based on user mood.
 *
 * - suggestMeditationForMood - A function that takes a user's mood and returns a meditation suggestion.
 * - MoodInput - The input type for the suggestMeditationForMood function.
 * - MoodOutput - The return type for the suggestMeditationForMood function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { guidedMeditations } from '@/lib/meditation-data';

const MoodInputSchema = z.object({
  mood: z.string().describe("The user's current mood (e.g., 'stressed', 'anxious', 'happy', 'tired')."),
});
export type MoodInput = z.infer<typeof MoodInputSchema>;

const MoodOutputSchema = z.object({
  meditationId: z.string().describe('The ID of the suggested meditation from the available list.'),
  reasoning: z.string().describe('A short, encouraging reason why this meditation was chosen.'),
});
export type MoodOutput = z.infer<typeof MoodOutputSchema>;

export async function suggestMeditationForMood(
  input: MoodInput
): Promise<MoodOutput> {
  return moodSuggesterFlow(input);
}

// Create a simplified list of meditations for the prompt context.
const meditationContext = guidedMeditations.map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    tags: m.tags,
})).map(m => `- ID: ${m.id}, Title: ${m.title}, Description: ${m.description}, Tags: [${m.tags.join(', ')}]`).join('\n');


const prompt = ai.definePrompt({
  name: 'moodSuggesterPrompt',
  input: { schema: MoodInputSchema },
  output: { schema: MoodOutputSchema },
  prompt: `You are a kind and insightful meditation guide. A user has shared their current mood with you. Your task is to recommend the most suitable guided meditation from the list below.

  **User's Mood:** {{{mood}}}

  **Available Meditations:**
  ${meditationContext}

  **Instructions:**
  1.  Analyze the user's mood.
  2.  Select the **one** meditation from the list that best addresses their feeling. For example, if they feel stressed, a calming breath or body scan meditation is ideal. If they feel tired, maybe a shorter, gentle practice.
  3.  Provide the exact 'ID' of your chosen meditation in the 'meditationId' field.
  4.  Write a brief, one-sentence, encouraging message explaining why you chose it for the 'reasoning' field.
  
  Your response must be in the specified JSON format.
  `,
});

const moodSuggesterFlow = ai.defineFlow(
  {
    name: 'moodSuggesterFlow',
    inputSchema: MoodInputSchema,
    outputSchema: MoodOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    if (!output) {
      throw new Error('The AI model could not provide a suggestion.');
    }
    
    // Validate that the suggested ID exists in our list
    const meditationExists = guidedMeditations.some(m => m.id === output.meditationId);
    if (!meditationExists) {
      // Fallback if the AI hallucinates an ID
      console.warn(`AI suggested a non-existent meditation ID: ${output.meditationId}. Falling back to default.`);
      return {
        meditationId: 'breath_5', // A safe default
        reasoning: 'I recommend starting with some simple breath awareness to center yourself.',
      };
    }

    return output;
  }
);
