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
      timestamp: Date.now(),
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
    
    // Ensure we return a plain object
    return {
      result: JSON.parse(JSON.stringify(result)),
      error: result.status === 'error' ? (result.error || 'Analysis failed') : null,
      timestamp: Date.now(),
    };
  } catch (e: any) {
    console.error("Xray Action Error:", e);
    return {
      result: null,
      error: 'The AI model could not be reached. Please try a smaller/clearer image.',
      timestamp: Date.now(),
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
  let userProfile = undefined;
  try {
    userProfile = profileString ? JSON.parse(profileString) : undefined;
  } catch(e) {}

  const validatedFields = skinAnalysisSchema.safeParse({
    imageDataUri: formData.get('imageDataUri'),
    userQuery: (formData.get('userQuery') as string) || undefined,
    userProfile: userProfile,
  });

  if (!validatedFields.success) {
    return {
      result: null,
      error: 'Invalid input data.',
      timestamp: Date.now(),
    };
  }

  try {
    const result = await analyzeSkinImage(validatedFields.data);
    return {
      result: JSON.parse(JSON.stringify(result)),
      error: null,
      timestamp: Date.now(),
    };
  } catch (e: any) {
    console.error("Skin Action Error:", e);
    return {
      result: null,
      error: 'Analysis failed. Please try again with a clearer photo.',
      timestamp: Date.now(),
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
            error: 'Invalid input.',
            timestamp: Date.now(),
        };
    }

    try {
        const result = await analyzeLabReportImage(validatedFields.data);
        return { 
            result: JSON.parse(JSON.stringify(result)), 
            error: null,
            timestamp: Date.now()
        };
    } catch (e: any) {
        console.error("Lab Action Error:", e);
        return {
            result: null,
            error: 'The report could not be read. Ensure the image is bright and steady.',
            timestamp: Date.now(),
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
      error: 'Please describe what happened.',
      timestamp: Date.now(),
    };
  }

  try {
    const result = await analyzeInjury(validatedFields.data);
    return {
      result: JSON.parse(JSON.stringify(result)),
      error: null,
      timestamp: Date.now(),
    };
  } catch (e: any) {
    console.error("Injury Action Error:", e);
    return {
      result: null,
      error: 'Emergency analysis failed. Please provide more details.',
      timestamp: Date.now(),
    };
  }
}
