import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview AI Configuration for Your Medical Partner.
 * This setup uses the standard GEMINI_API_KEY from the environment.
 */

// Initialize Genkit with the Google AI plugin
// It will automatically look for GEMINI_API_KEY in your .env file
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: googleAI.model('gemini-2.5-flash'),
});

export { z };
