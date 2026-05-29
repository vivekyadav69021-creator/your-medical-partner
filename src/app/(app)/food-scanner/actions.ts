'use server';

import { analyzeFood, FoodAnalysisInput } from '@/ai/flows/food-analyzer-flow';
import { z } from 'zod';

const foodScannerSchema = z.object({
  imageDataUri: z.string().optional(),
  textQuery: z.string().optional(),
  language: z.enum(['en', 'hi']).optional(),
}).refine(data => data.imageDataUri || data.textQuery, {
  message: "Please provide either an image or a text description.",
});

export async function analyzeFoodAction(prevState: any, formData: FormData) {
  const imageDataUri = formData.get('imageDataUri') as string || undefined;
  const textQuery = formData.get('textQuery') as string || undefined;
  const language = (formData.get('language') as 'en' | 'hi') || 'en';

  const validated = foodScannerSchema.safeParse({ imageDataUri, textQuery, language });

  if (!validated.success) {
    return { result: null, error: validated.error.errors[0].message, timestamp: Date.now() };
  }

  try {
    const result = await analyzeFood({
        imageDataUri: validated.data.imageDataUri,
        textQuery: validated.data.textQuery,
        language: validated.data.language,
    } as FoodAnalysisInput);
    
    return {
      result: JSON.parse(JSON.stringify(result)),
      error: null,
      timestamp: Date.now(),
    };
  } catch (e: any) {
    console.error("Food Action Error:", e);
    return { result: null, error: "Analysis failed. Please try a clearer description or photo.", timestamp: Date.now() };
  }
}
