import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview AI Configuration for Your Medical Partner.
 * Uses the primary GEMINI_API_KEY from environment variables.
 * To implement rotation safely, add more keys to your environment 
 * and load them here.
 */

export const ai = genkit({
  plugins: [
    googleAI({ 
      // Ensure you have GEMINI_API_KEY set in your .env.local file
      apiKey: process.env.GEMINI_API_KEY 
    }),
  ],
  model: googleAI.model('gemini-2.5-flash'),
});

export { z };
