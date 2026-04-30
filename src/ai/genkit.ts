import { genkit, Genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview Failover AI configuration for Your Medical Partner.
 * Implements API Key Rotation to handle 'Rate Limit' or 'Server Busy' errors.
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
  model: 'googleai/gemini-2.5-flash',
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
        // Define the prompt on all underlying instances
        const prompts = instances.map(inst => inst.definePrompt(config));
        
        // Return a wrapped function that tries each key sequentially on error
        return async (input: any) => {
          for (let i = 0; i < prompts.length; i++) {
            try {
              if (process.env.NODE_ENV !== 'production') {
                console.log(`Attempting AI Prompt with Key ${i + 1}...`);
              }
              return await prompts[i](input);
            } catch (error: any) {
              console.error(`AI Key ${i + 1} failed:`, error.message);

              // If it's the last key, throw the final error
              if (i === instances.length - 1) {
                throw new Error("All API keys are exhausted. Please try again after some time.");
              }
              
              console.log("Rotating to the next available API key...");
              // Loop continues to next key
            }
          }
        };
      };
    }

    // Intercept direct generate calls (used in some features like STT)
    if (prop === 'generate') {
      return async (config: any) => {
        for (let i = 0; i < instances.length; i++) {
          try {
            if (process.env.NODE_ENV !== 'production') {
              console.log(`Attempting direct generation with Key ${i + 1}...`);
            }
            return await instances[i].generate(config);
          } catch (error: any) {
            console.error(`AI Key ${i + 1} failed during generate:`, error.message);

            if (i === instances.length - 1) {
              throw new Error("All API keys are exhausted. Please try again after some time.");
            }
            
            console.log("Rotating to next key for generation...");
          }
        }
      };
    }

    // Default behavior for other Genkit methods (defineFlow, defineTool, etc.)
    const value = Reflect.get(target, prop, receiver);
    return typeof value === 'function' ? value.bind(target) : value;
  },
}) as any as Genkit;
