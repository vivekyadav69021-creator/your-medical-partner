import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview AI Configuration with API Key Rotation & Failover Logic.
 * This ensures high availability by automatically switching keys on failure.
 */

// Collect all 4 keys from environment variables
const apiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
].filter(Boolean) as string[];

// Initialize Genkit instances for each available key
const instances = apiKeys.map(key => genkit({
  plugins: [googleAI({ apiKey: key })],
  model: googleAI.model('gemini-2.5-flash'),
}));

// Fallback base instance using default key or the first rotation key
const baseAi = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash'),
});

/**
 * SMART FAILOVER PROXY
 * This proxy intercepts AI calls and rotates through the keys if a request fails
 * with a retryable error (like 429 - Rate Limit or 500 - Server Busy).
 */
export const ai: any = new Proxy(baseAi, {
  get(target, prop, receiver) {
    // 1. Handle direct generation calls (ai.generate)
    if (prop === 'generate') {
      return async (options: any) => {
        const pool = instances.length > 0 ? instances : [baseAi];
        let lastError: any;

        for (let i = 0; i < pool.length; i++) {
          try {
            console.log(`[AI Rotation] Attempting generation with Key ${i + 1}/${pool.length}`);
            return await pool[i].generate(options);
          } catch (err: any) {
            lastError = err;
            console.error(`[AI Rotation] Key ${i + 1} failed: ${err.message}`);
            
            // Determine if error is retryable (Rate limit or transient server error)
            const isRetryable = err.message.includes('429') || err.message.includes('500') || err.message.includes('503');
            if (!isRetryable || i === pool.length - 1) {
              throw new Error(`AI Request failed. Details: ${err.message}`);
            }
            console.log(`[AI Rotation] Rotating to Key ${i + 2}...`);
          }
        }
      };
    }

    // 2. Handle defined prompts (ai.definePrompt)
    if (prop === 'definePrompt') {
      return (promptOptions: any) => {
        // Pre-define the prompt on all instances in our pool
        const pool = instances.length > 0 ? instances : [baseAi];
        const promptFunctions = pool.map(inst => inst.definePrompt(promptOptions));
        
        // Return a wrapper function that implements the rotation logic
        return async (...args: any[]) => {
          for (let i = 0; i < promptFunctions.length; i++) {
            try {
              return await promptFunctions[i](...args);
            } catch (err: any) {
              console.error(`[AI Prompt Rotation] Key ${i + 1} failed: ${err.message}`);
              if (i === promptFunctions.length - 1) {
                throw new Error(`All AI instances failed. Latest: ${err.message}`);
              }
            }
          }
        };
      };
    }

    // Default behavior for other Genkit properties (defineFlow, defineTool, etc.)
    return Reflect.get(target, prop, receiver);
  }
});

export { z };
