'use server';

import { analyzeXray } from '@/ai/flows/xray-analyzer-flow';
import { analyzeLabReportImage } from '@/ai/flows/lab-report-flow';
import { analyzeSkinImage } from '@/ai/flows/skin-analyzer-flow';
import { analyzeInjury } from '@/ai/flows/injury-analyzer-flow';
import { z } from 'zod';

function sanitizeResult(obj: any) {
    if (!obj) return null;
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        return value === undefined ? null : value;
    }));
}

export async function analyzeXrayAction(prevState: any, formData: FormData) {
  const imagesString = formData.get('images') as string;
  const userQuery = (formData.get('userQuery') as string) || undefined;
  const language = (formData.get('language') as 'en' | 'hi') || 'en';

  try {
    const images = JSON.parse(imagesString || '[]');
    const result = await analyzeXray({ 
      images: images.map((url: string) => ({ url, contentType: 'image/jpeg' })),
      userQuery,
      language,
    });
    return { result: sanitizeResult(result), error: result.status === 'error' ? result.error : null, timestamp: Date.now() };
  } catch (e: any) {
    return { result: null, error: 'Analysis failed. Please try again.', timestamp: Date.now() };
  }
}

export async function analyzeSkinImageAction(prevState: any, formData: FormData) {
  const imagesString = formData.get('images') as string;
  const profileString = formData.get('userProfile') as string;
  const userQuery = (formData.get('userQuery') as string) || undefined;
  const language = (formData.get('language') as 'en' | 'hi') || 'en';

  try {
    const images = JSON.parse(imagesString || '[]');
    const userProfile = profileString ? JSON.parse(profileString) : undefined;
    const result = await analyzeSkinImage({ images, userQuery, userProfile, language });
    return { result: sanitizeResult(result), error: null, timestamp: Date.now() };
  } catch (e: any) {
    return { result: null, error: 'Analysis failed.', timestamp: Date.now() };
  }
}

export async function analyzeLabReportImageAction(prevState: any, formData: FormData) {
    const imagesString = formData.get('images') as string;
    const userQuery = (formData.get('userQuery') as string) || undefined;
    const language = (formData.get('language') as 'en' | 'hi') || 'en';

    try {
        const images = JSON.parse(imagesString || '[]');
        const result = await analyzeLabReportImage({ images, userQuery, language });
        return { result: sanitizeResult(result), error: null, timestamp: Date.now() };
    } catch (e: any) {
        return { result: null, error: 'Report analysis failed.', timestamp: Date.now() };
    }
}

export async function analyzeInjuryAction(prevState: any, formData: FormData) {
  const imagesString = formData.get('images') as string;
  const userQuery = formData.get('userQuery') as string;
  const language = (formData.get('language') as 'en' | 'hi') || 'en';

  try {
    const images = JSON.parse(imagesString || '[]');
    const result = await analyzeInjury({ images, userQuery, language });
    return { result: sanitizeResult(result), error: null, timestamp: Date.now() };
  } catch (e: any) {
    return { result: null, error: 'Emergency analysis failed.', timestamp: Date.now() };
  }
}
