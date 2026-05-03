'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/health-assistant-flow.ts';
import '@/ai/flows/ai-psychiatrist-flow.ts';
import '@/ai/flows/speech-to-text-flow.ts';
import '@/ai/flows/xray-analyzer-flow.ts';
import '@/ai/flows/lab-report-flow.ts';
import '@/ai/flows/mood-meditation-suggester-flow.ts';
import '@/ai/flows/prescription-analyzer-flow.ts';
import '@/ai/flows/feature-assistant-flow.ts';
import '@/ai/flows/skin-analyzer-flow.ts';
import '@/ai/flows/ai-doctor-chat-flow.ts';
import '@/ai/flows/injury-analyzer-flow.ts';
