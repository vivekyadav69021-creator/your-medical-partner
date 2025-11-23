'use server';

import { aiSymptomChecker } from '@/ai/flows/ai-symptom-checker';
import { z } from 'zod';

const symptomSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in more detail.'),
  medicalHistory: z.string().optional(),
});

export async function aiSymptomCheckAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = symptomSchema.safeParse({
    symptoms: formData.get('symptoms'),
    medicalHistory: formData.get('medicalHistory'),
  });

  if (!validatedFields.success) {
    return {
      possibleCauses: null,
      error: validatedFields.error.flatten().fieldErrors.symptoms?.[0] ?? 'Invalid input.',
    };
  }

  try {
    const result = await aiSymptomChecker(validatedFields.data);
    return {
      possibleCauses: result.possibleCauses,
      error: null,
    };
  } catch (e) {
    return {
      possibleCauses: null,
      error: 'The AI model could not be reached. Please try again later.',
    };
  }
}
