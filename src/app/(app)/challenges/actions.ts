'use server';

import { generateHealthPlan, HealthPlanInput } from '@/ai/flows/health-plan-flow';

export async function generateHealthPlanAction(prevState: any, formData: FormData) {
  const rawData: any = {};
  formData.forEach((value, key) => {
    rawData[key] = value;
  });

  try {
    const result = await generateHealthPlan(rawData as HealthPlanInput);
    return { 
      result: JSON.parse(JSON.stringify(result)), 
      error: null, 
      timestamp: Date.now() 
    };
  } catch (e: any) {
    console.error(e);
    return { 
      result: null, 
      error: "Plan generation failed. Please try again.", 
      timestamp: Date.now() 
    };
  }
}
