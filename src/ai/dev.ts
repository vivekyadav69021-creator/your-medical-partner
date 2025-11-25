'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/health-assistant-flow.ts';
import '@/ai/flows/ai-psychiatrist-flow.ts';
import '@/ai/flows/speech-to-text-flow.ts';
import '@/ai/flows/challenge-generator-flow.ts';
