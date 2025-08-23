'use server';

/**
 * @fileOverview Provides AI-generated fix suggestions for identified code issues.
 *
 * - suggestCodeFixes - A function that suggests code fixes for identified issues.
 * - SuggestCodeFixesInput - The input type for the suggestCodeFixes function.
 * - SuggestCodeFixesOutput - The return type for the suggestCodeFixes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCodeFixesInputSchema = z.object({
  code: z.string().describe('The code to review.'),
  issue: z.string().describe('The identified issue in the code.'),
  file: z.string().describe('The file in which the code exists'),
});
export type SuggestCodeFixesInput = z.infer<typeof SuggestCodeFixesInputSchema>;

const SuggestCodeFixesOutputSchema = z.object({
  fix: z.string().describe('The AI-generated fix suggestion for the issue.'),
});
export type SuggestCodeFixesOutput = z.infer<typeof SuggestCodeFixesOutputSchema>;

export async function suggestCodeFixes(input: SuggestCodeFixesInput): Promise<SuggestCodeFixesOutput> {
  return suggestCodeFixesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCodeFixesPrompt',
  input: {schema: SuggestCodeFixesInputSchema},
  output: {schema: SuggestCodeFixesOutputSchema},
  prompt: `You are a code review assistant. You are provided with a piece of code, an identified issue in the code, and the file the code exists in. You will generate a fix suggestion for the issue.

Code:
\`\`\`{{{code}}}\`\`\`

Issue: {{{issue}}}
File: {{{file}}}

Fix Suggestion:`,
});

const suggestCodeFixesFlow = ai.defineFlow(
  {
    name: 'suggestCodeFixesFlow',
    inputSchema: SuggestCodeFixesInputSchema,
    outputSchema: SuggestCodeFixesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
