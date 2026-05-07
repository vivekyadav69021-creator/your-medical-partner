import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview AI Configuration with Smart API Key Rotation.
 * This proxy handles Failover: if Key 1 fails, it tries Key 2, and so on.
 */

// Load keys from environment variables
const apiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
].filter(Boolean) as string[];

// Create separate Genkit instances for each key for isolated sessions
const instances = apiKeys.map((key) => genkit({
  plugins: [googleAI({ apiKey: key })],
  model: googleAI.model('gemini-2.5-flash'),
}));

// Fallback instance (uses default GEMINI_API_KEY if provided)
const fallbackAi = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash'),
});

/**
 * PROXY HANDLER
 * Intercepts calls to 'generate' and 'definePrompt' to implement failover.
 */
export const ai: any = new Proxy(fallbackAi, {
  get(target, prop, receiver) {
    const pool = instances.length > 0 ? instances : [fallbackAi];

    // 1. Intercept direct generation (ai.generate)
    if (prop === 'generate') {
      return async (options: any) => {
        for (let i = 0; i < pool.length; i++) {
          try {
            console.log(`[AI Rotation] Attempting with Key ${i + 1}/${pool.length}`);
            return await pool[i].generate(options);
          } catch (err: any) {
            console.error(`[AI Rotation] Key ${i + 1} failed: ${err.message}`);
            if (i === pool.length - 1) throw new Error(`All AI instances failed. Latest: ${err.message}`);
          }
        }
      };
    }

    // 2. Intercept defined prompts (ai.definePrompt)
    if (prop === 'definePrompt') {
      return (promptOptions: any) => {
        // Define the prompt on every instance in the pool
        const promptFns = pool.map(inst => inst.definePrompt(promptOptions));
        
        // Return a wrapper function that tries each prompt definition
        return async (input: any) => {
          for (let i = 0; i < promptFns.length; i++) {
            try {
              return await promptFns[i](input);
            } catch (err: any) {
              console.error(`[AI Prompt Rotation] Key ${i + 1} failed: ${err.message}`);
              if (i === pool.length - 1) throw new Error(`All AI instances failed. Latest: ${err.message}`);
            }
          }
        };
      };
    }

    return Reflect.get(target, prop, receiver);
  }
});

export { z };
