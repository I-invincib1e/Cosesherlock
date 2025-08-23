import { config } from 'dotenv';
config();

import '@/ai/flows/prioritize-code-review-output.ts';
import '@/ai/flows/review-code-for-issues.ts';
import '@/ai/flows/suggest-code-fixes.ts';