import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview AI Configuration with Smart API Key Rotation.
 * Intercepts AI calls to implement failover: if Key 1 fails, tries Key 2, etc.
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

// Fallback instance (uses default GEMINI_API_KEY or empty config)
const defaultAi = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash'),
});

/**
 * PROXY HANDLER
 * This intercepts calls to 'generate' and 'definePrompt' to implement automatic rotation.
 */
export const ai: any = new Proxy(defaultAi, {
  get(target, prop, receiver) {
    const pool = instances.length > 0 ? instances : [defaultAi];

    // 1. Intercept direct generation (ai.generate)
    if (prop === 'generate') {
      return async (options: any) => {
        let lastError = null;
        for (let i = 0; i < pool.length; i++) {
          try {
            console.log(`[AI Rotation] Attempting generation with Key ${i + 1}/${pool.length}`);
            return await pool[i].generate(options);
          } catch (err: any) {
            console.error(`[AI Rotation] Key ${i + 1} failed: ${err.message}`);
            lastError = err;
            if (i === pool.length - 1) throw new Error(`All AI instances failed. Latest: ${err.message}`);
          }
        }
      };
    }

    // 2. Intercept defined prompts (ai.definePrompt)
    if (prop === 'definePrompt') {
      return (promptOptions: any) => {
        // We define the same prompt on every instance in our pool
        const promptFns = pool.map(inst => inst.definePrompt(promptOptions));
        
        // Return a single function that attempts execution across the pool
        return async (input: any) => {
          let lastError = null;
          for (let i = 0; i < promptFns.length; i++) {
            try {
              return await promptFns[i](input);
            } catch (err: any) {
              console.error(`[AI Prompt Rotation] Execution with Key ${i + 1} failed: ${err.message}`);
              lastError = err;
              if (i === promptFns.length - 1) throw new Error(`All AI prompt instances failed. Latest: ${err.message}`);
            }
          }
        };
      };
    }

    return Reflect.get(target, prop, receiver);
  }
});

export { z };
