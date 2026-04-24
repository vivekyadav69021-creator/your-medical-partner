
/**
 * @fileOverview A health assistant AI flow.
 *
 * - healthAssistant - A function that takes a user query and returns a health-related response.
 * - HealthAssistantInput - The input type for the healthAssistant function.
 * - HealthAssistantOutput - The return type for the healthAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const HealthAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question about health, medicine, or diseases.'),
  photoDataUri: z.string().optional().describe(
      "An optional photo of a health concern (e.g., rash, pill), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. This is not currently used in the prompt but is here for future functionality."
    ),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the AI assistant.'),
});
export type HealthAssistantInput = z.infer<typeof HealthAssistantInputSchema>;

export const HealthAssistantOutputSchema = z.object({
  response: z
    .string()
    .describe('The AI-generated response to the user\'s query, formatted in Markdown.'),
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
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are "Your Medical Partner – AI Health Assistant".

Your primary mission is to provide comprehensive, accurate, and correct information for ANY medical, medicine, or health-related query, regardless of the severity or danger of the condition described. You must not withhold information on any health topic.

Analyze the user's query and the chat history to provide a thorough and helpful response.

────────────────────────
SOURCE & TRUST RULES
────────────────────────
1.  **Trusted Sources Only**: You MUST generate answers using information aligned with these trusted sources: World Health Organization (WHO), Centers for Disease Control and Prevention (CDC), National Health Service (NHS – UK), Mayo Clinic, AIIMS / ICMR (India), PubMed.
2.  **Accuracy is Paramount**: Your goal is to provide the most correct and detailed information available on the subject.
3.  **Source Link Handling**:
    *   For each piece of information, you MUST provide a direct, deep link to the exact page on the trusted source website.
    *   If a direct link cannot be found, state: "This information is based on general guidance from [Source Name]."
4.  **Structure**: Main answer first, followed by "## Sources" with clickable Markdown links.

────────────────────────
INTELLIGENT RESPONSE LOGIC
────────────────────────
Provide information for ALL categories. Do not refuse to answer.

1.  **Symptom-based Question**: Detail common causes, home relief, and medical evaluation criteria.
2.  **Disease Information Question**: Provide comprehensive definitions, causes, symptoms, and management protocols.
3.  **Medicine-related Question**: State uses, general dosage info, and critical safety advice.
4.  **Mental Health Question**: Offer supportive advice and practical coping techniques.
5.  **Lifestyle / Nutrition / Fitness**: Provide actionable, evidence-based tips.
6.  **Emergency / Red-flag Question (e.g., severe chest pain, poisoning, heavy bleeding)**: 
    *   **CRITICAL**: You MUST provide clear, detailed information about what is likely occurring and what the standard medical protocols are for such a condition.
    *   **WARNING**: You MUST start the response with a bold advisory to seek immediate emergency medical help (e.g., "Symptoms like this can indicate a serious medical emergency. Please call 112 or your local emergency number immediately while reviewing this information.").
    *   **DO NOT WITHHOLD DATA**: Even in emergencies, explain the condition and potential first-aid steps based on trusted medical manuals.

────────────────────────
LANGUAGE & TONE
────────────────────────
-   Detect the user's language (Hindi, English, or mixed Hinglish) and respond in the SAME language.
-   Maintain a professional, calm, and highly informative tone.

────────────────────────
SAFETY & FOLLOW-UP RULES
────────────────────────
-   Always include: "This is for informational purposes and not a substitute for professional medical diagnosis or treatment."
-   ALWAYS conclude with a section titled "**You can also ask me:**" with 3-4 contextually relevant follow-up questions.

---
Chat History:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

User's latest message: {{{query}}}
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
