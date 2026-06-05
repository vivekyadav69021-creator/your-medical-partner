'use server';

import { analyzeFood, FoodAnalysisInput } from '@/ai/flows/food-analyzer-flow';
import { z } from 'zod';

const foodScannerSchema = z.object({
  imageDataUri: z.string().optional(),
  textQuery: z.string().optional(),
  language: z.enum(['en', 'hi']).optional(),
  scanType: z.enum(['standard', 'barcode', 'ocr']).optional(),
  healthMirrorProfile: z.string().optional(),
  mainGoal: z.string().optional(),
  workoutRegimen: z.string().optional(),
  dietaryProtocol: z.string().optional(),
}).refine(data => data.imageDataUri || data.textQuery, {
  message: "Please provide either an image or a text description.",
});

export async function analyzeFoodAction(prevState: any, formData: FormData) {
  const imageDataUri = formData.get('imageDataUri') as string || undefined;
  const textQuery = formData.get('textQuery') as string || undefined;
  const language = (formData.get('language') as 'en' | 'hi') || 'en';
  const scanType = (formData.get('scanType') as 'standard' | 'barcode' | 'ocr') || 'standard';
  
  const healthMirrorProfile = formData.get('healthMirrorProfile') as string || undefined;
  const mainGoal = formData.get('mainGoal') as string || undefined;
  const workoutRegimen = formData.get('workoutRegimen') as string || undefined;
  const dietaryProtocol = formData.get('dietaryProtocol') as string || undefined;

  const validated = foodScannerSchema.safeParse({ 
    imageDataUri, 
    textQuery, 
    language,
    scanType,
    healthMirrorProfile,
    mainGoal,
    workoutRegimen,
    dietaryProtocol
  });

  if (!validated.success) {
    return { result: null, error: validated.error.errors[0].message, timestamp: Date.now() };
  }

  try {
    const result = await analyzeFood(validated.data as FoodAnalysisInput);
    
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
