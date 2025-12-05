'use server';

import { aiDoctorChat, AIDoctorChatInput } from '@/ai/flows/ai-doctor-chat-flow';
import { z } from 'zod';

const doctorChatSchema = z.object({
  query: z.string().min(1, 'Please ask a question.'),
  specialty: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
});

export async function aiDoctorChatAction(
  prevState: any,
  formData: FormData
) {
  const historyString = formData.get('history') as string;
  const history = historyString ? JSON.parse(historyString) : [];

  const validatedFields = doctorChatSchema.safeParse({
    query: formData.get('query'),
    specialty: formData.get('specialty'),
    history: history,
  });

  if (!validatedFields.success) {
    return {
      response: null,
      error:
        validatedFields.error.flatten().fieldErrors.query?.[0] ??
        'Invalid input.',
    };
  }

  try {
    const result = await aiDoctorChat(validatedFields.data);
    return {
      response: result.response,
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    return {
      response: null,
      error: e.message || 'The AI model could not be reached. Please try again later.',
    };
  }
}
