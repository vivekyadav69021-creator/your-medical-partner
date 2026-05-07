import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview AI Configuration for Your Medical Partner with Key Rotation.
 * This setup implements a failover logic to handle Rate Limits and Server errors.
 */

// Collect available keys from environment
const keys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
].filter(Boolean) as string[];

// Initialize Genkit instances for each available key
const instances = keys.map(key => genkit({
  plugins: [googleAI({ apiKey: key })],
  model: googleAI.model('gemini-2.5-flash'),
}));

// Base instance for fallback and schema definitions
const baseAi = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash'),
});

/**
 * FAILOVER PROXY
 * This logic wraps the Genkit instance to automatically rotate keys
 * when an API request fails with common transient errors.
 */
export const ai: any = new Proxy(baseAi, {
  get(target, prop, receiver) {
    // Intercept generation calls for rotation
    if (prop === 'generate') {
      return async (options: any) => {
        const pool = instances.length > 0 ? instances : [baseAi];
        let lastError: any;

        for (let i = 0; i < pool.length; i++) {
          try {
            console.log(`[AI Failover] Attempting generate with Key ${i + 1}/${pool.length}`);
            return await pool[i].generate(options);
          } catch (err: any) {
            lastError = err;
            console.error(`[AI Failover] Key ${i + 1} failed: ${err.message}`);
            // Check if we should retry with next key (Rate limit or Server busy)
            const isRetryable = err.message.includes('429') || err.message.includes('500') || err.message.includes('503');
            if (!isRetryable || i === pool.length - 1) {
              throw new Error(`All AI keys failed. Latest Error: ${err.message}. Please try again later.`);
            }
          }
        }
      };
    }

    // Intercept prompt definitions to return a failover-capable prompt function
    if (prop === 'definePrompt') {
      return (promptOptions: any) => {
        // Pre-define the prompt on all instances in the pool
        const pool = instances.length > 0 ? instances : [baseAi];
        const promptPool = pool.map(inst => inst.definePrompt(promptOptions));
        
        // Return a wrapper function that handles the rotation
        return async (...args: any[]) => {
          for (let i = 0; i < promptPool.length; i++) {
            try {
              return await promptPool[i](...args);
            } catch (err: any) {
              console.error(`[AI Failover Prompt] Key ${i + 1} failed: ${err.message}`);
              if (i === promptPool.length - 1) {
                throw new Error(`AI Service temporarily unavailable. Error: ${err.message}`);
              }
            }
          }
        };
      };
    }

    return Reflect.get(target, prop, receiver);
  }
});

export { z };
