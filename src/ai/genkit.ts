
import { genkit, Genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview Advanced Failover AI configuration for Your Medical Partner.
 * Implements API Key Rotation with detailed error reporting to handle 'Rate Limit',
 * 'Quota Exhausted', or 'Invalid Key' errors.
 */

// Array of 4 API keys provided for rotation logic
const myApiKeys = [
  "AIzaSyDmvBkdIs4qb_iR-zZN-ml9jdu_0NvYCAw",
  "AIzaSyClhC9rBZnCBRYOrXgwB_mUhDQBFDXwP8w",
  "AIzaSyBXrA_eF_nWnJvis9mUTxdyLuUusdJJxn4",
  "AIzaSyAayCpzEbAwl1QNyfOLD30e1ze1r7QtE6Q"
];

// Create multiple Genkit instances, each with a different API key
const instances = myApiKeys.map(key => genkit({
  plugins: [googleAI({ apiKey: key })],
  model: googleAI.model('gemini-2.5-flash'), // Using latest recommended model factory
}));

/**
 * We export a Proxy of the Genkit instance.
 * This proxy intercepts 'definePrompt' and 'generate' calls to wrap them
 * in the failover/rotation logic.
 */
export const ai = new Proxy(instances[0], {
  get(target, prop, receiver) {
    // Intercept prompt definitions to return a multi-key prompt executor
    if (prop === 'definePrompt') {
      return (config: any) => {
        // Define the prompt on all underlying instances to get per-key prompt objects
        const prompts = instances.map(inst => inst.definePrompt(config));
        
        // Return a wrapped function that tries each key sequentially on error
        const promptWrapper = async (input: any) => {
          let lastErrorMessage = "";
          for (let i = 0; i < prompts.length; i++) {
            try {
              if (process.env.NODE_ENV !== 'production') {
                console.log(`[AI-ROUTER] Attempting Prompt with Key ${i + 1}...`);
              }
              // Call the prompt defined for this specific key/instance
              return await prompts[i](input);
            } catch (error: any) {
              lastErrorMessage = error.message || "Unknown error";
              console.error(`[AI-ROUTER] Key ${i + 1} failed:`, lastErrorMessage);

              // If it's the last key, throw the final error with context
              if (i === instances.length - 1) {
                throw new Error(`All AI keys failed. Latest Error: ${lastErrorMessage}. Please try again later.`);
              }
              
              console.log("[AI-ROUTER] Rotating to the next available API key...");
              // Loop continues to next key
            }
          }
        };

        // Copy properties from the original prompt object (like name) to the wrapper
        Object.assign(promptWrapper, prompts[0]);
        return promptWrapper;
      };
    }

    // Intercept direct generate calls
    if (prop === 'generate') {
      return async (config: any) => {
        let lastErrorMessage = "";
        for (let i = 0; i < instances.length; i++) {
          try {
            if (process.env.NODE_ENV !== 'production') {
              console.log(`[AI-ROUTER] Attempting Generation with Key ${i + 1}...`);
            }
            return await instances[i].generate(config);
          } catch (error: any) {
            lastErrorMessage = error.message || "Unknown error";
            console.error(`[AI-ROUTER] Key ${i + 1} failed during generate:`, lastErrorMessage);

            if (i === instances.length - 1) {
              throw new Error(`AI generation failed after trying all keys. Reason: ${lastErrorMessage}`);
            }
            
            console.log("[AI-ROUTER] Rotating to next key for generation...");
          }
        }
      };
    }

    // Default behavior for other Genkit methods (defineFlow, defineTool, etc.)
    const value = Reflect.get(target, prop, receiver);
    return typeof value === 'function' ? value.bind(target) : value;
  },
}) as any as Genkit;

export { z };
