'use server';

import { analyzeXray } from '@/ai/flows/xray-analyzer-flow';
import { analyzeLabReportImage } from '@/ai/flows/lab-report-flow';
import { analyzeSkinImage } from '@/ai/flows/skin-analyzer-flow';
import { analyzeInjury } from '@/ai/flows/injury-analyzer-flow';
import { z } from 'zod';

const xrayScannerSchema = z.object({
  photoDataUri: z.string().min(1, 'Please upload an image to be scanned.'),
  contentType: z.string().min(1, 'Content type is required.'),
  userQuery: z.string().optional(),
  language: z.enum(['en', 'hi']).optional(),
});

export async function analyzeXrayAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = xrayScannerSchema.safeParse({
    photoDataUri: formData.get('photoDataUri'),
    contentType: formData.get('contentType'),
    userQuery: (formData.get('userQuery') as string) || undefined,
    language: (formData.get('language') as 'en' | 'hi') || 'en',
  });

  if (!validatedFields.success) {
    return {
      result: null,
      error:
        validatedFields.error.flatten().fieldErrors.photoDataUri?.[0] ??
        validatedFields.error.flatten().fieldErrors.contentType?.[0] ??
        'Invalid input.',
    };
  }
  
  try {
    const result = await analyzeXray({ 
      image: {
        url: validatedFields.data.photoDataUri,
        contentType: validatedFields.data.contentType,
      },
      userQuery: validatedFields.data.userQuery,
      language: validatedFields.data.language,
    });
    if (result.status === 'error') {
        return { result: null, error: result.error || 'Analysis failed.' };
    }
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


const skinAnalysisSchema = z.object({
  imageDataUri: z.string().min(1, 'Please upload an image.'),
  userQuery: z.string().optional(),
  userProfile: z.object({
    age: z.string().optional(),
    lifestyle: z.string().optional(),
    dietaryPreference: z.string().optional(),
  }).optional(),
});

export async function analyzeSkinImageAction(
  prevState: any,
  formData: FormData
) {
  const profileString = formData.get('userProfile') as string;
  const userProfile = profileString ? JSON.parse(profileString) : undefined;

  const validatedFields = skinAnalysisSchema.safeParse({
    imageDataUri: formData.get('imageDataUri'),
    userQuery: (formData.get('userQuery') as string) || undefined,
    userProfile: userProfile,
  });

  if (!validatedFields.success) {
    return {
      result: null,
      error:
        validatedFields.error.flatten().fieldErrors.imageDataUri?.[0] ?? 'Invalid input.',
    };
  }

  try {
    const result = await analyzeSkinImage(validatedFields.data);
    return {
      result,
      error: null,
    };
  } catch (e: any) {
    return {
      result: null,
      error: e.message || 'The AI model could not be reached. Please try again later.',
    };
  }
}


const labReportImageSchema = z.object({
  imageDataUri: z.string().min(1, 'Please upload an image.'),
  userQuery: z.string().optional(),
  language: z.enum(['en', 'hi']).optional(),
});

export async function analyzeLabReportImageAction(
  prevState: any,
  formData: FormData
) {
    const validatedFields = labReportImageSchema.safeParse({
        imageDataUri: formData.get('imageDataUri'),
        userQuery: (formData.get('userQuery') as string) || undefined,
        language: (formData.get('language') as 'en' | 'hi') || 'en',
    });

    if (!validatedFields.success) {
        return {
            result: null,
            error: validatedFields.error.flatten().fieldErrors.imageDataUri?.[0] ?? 'Invalid input.',
        };
    }

    try {
        const result = await analyzeLabReportImage(validatedFields.data);
        return { result, error: null };
    } catch (e: any) {
        console.error("Action Error:", e);
        return {
            result: null,
            error: e.message || 'The AI model could not be reached. Please try again later.',
        };
    }
}

const injuryAnalysisSchema = z.object({
  imageDataUri: z.string().optional(),
  userQuery: z.string().min(1, 'Please describe your injury or symptom.'),
  language: z.enum(['en', 'hi']).optional(),
});

export async function analyzeInjuryAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = injuryAnalysisSchema.safeParse({
    imageDataUri: (formData.get('imageDataUri') as string) || undefined,
    userQuery: formData.get('userQuery'),
    language: (formData.get('language') as 'en' | 'hi') || 'en',
  });

  if (!validatedFields.success) {
    return {
      result: null,
      error:
        validatedFields.error.flatten().fieldErrors.userQuery?.[0] ?? 'Invalid input.',
    };
  }

  try {
    const result = await analyzeInjury(validatedFields.data);
    return {
      result,
      error: null,
    };
  } catch (e: any) {
    console.error("Injury Action Error:", e);
    return {
      result: null,
      error: e.message || 'The AI model could not be reached. Please try again later.',
    };
  }
}
