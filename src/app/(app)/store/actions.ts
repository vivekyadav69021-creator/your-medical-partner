'use server';

import { analyzePrescription, PrescriptionInput } from '@/ai/flows/prescription-analyzer-flow';
import { z } from 'zod';

const prescriptionSchema = z.object({
  imageDataUri: z.string().min(1, 'Please upload an image of the prescription.'),
});

export async function analyzePrescriptionAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = prescriptionSchema.safeParse({
    imageDataUri: formData.get('imageDataUri'),
  });

  if (!validatedFields.success) {
    return {
      result: null,
      error:
        validatedFields.error.flatten().fieldErrors.imageDataUri?.[0] ??
        'Invalid input.',
    };
  }

  try {
    const result = await analyzePrescription(validatedFields.data);
    return {
      result: result,
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    return {
      result: null,
      error: e.message || 'The AI model could not be reached. Please try again later.',
    };
  }
}
