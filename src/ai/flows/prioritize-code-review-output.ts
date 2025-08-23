'use server';
/**
 * @fileOverview A code review output prioritization AI agent.
 *
 * - prioritizeCodeReviewOutput - A function that prioritizes code review output based on severity.
 * - PrioritizeCodeReviewOutputInput - The input type for the prioritizeCodeReviewOutput function.
 * - PrioritizeCodeReviewOutputOutput - The return type for the prioritizeCodeReviewOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeCodeReviewOutputInputSchema = z.array(
  z.object({
    severity: z.enum(['high', 'medium', 'low']).describe('The severity of the issue.'),
    file: z.string().describe('The file where the issue was found.'),
    line: z.number().optional().describe('The line number where the issue was found.'),
    issue: z.string().describe('A description of the issue.'),
    fix: z.string().describe('A suggested fix for the issue.'),
    originalCode: z.string().optional().describe('The original code with the issue.'),
  })
).describe('An array of code review issues.');

export type PrioritizeCodeReviewOutputInput = z.infer<typeof PrioritizeCodeReviewOutputInputSchema>;

const PrioritizeCodeReviewOutputOutputSchema = z.array(
  z.object({
    severity: z.enum(['high', 'medium', 'low']).describe('The severity of the issue.'),
    file: z.string().describe('The file where the issue was found.'),
    line: z.number().optional().describe('The line number where the issue was found.'),
    issue: z.string().describe('A description of the issue.'),
    fix: z.string().describe('A suggested fix for the issue.'),
    originalCode: z.string().optional().describe('The original code with the issue.'),
  })
).describe('An array of code review issues, prioritized by severity.');

export type PrioritizeCodeReviewOutputOutput = z.infer<typeof PrioritizeCodeReviewOutputOutputSchema>;

export async function prioritizeCodeReviewOutput(input: PrioritizeCodeReviewOutputInput): Promise<PrioritizeCodeReviewOutputOutput> {
  return prioritizeCodeReviewOutputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeCodeReviewOutputPrompt',
  input: {schema: PrioritizeCodeReviewOutputInputSchema},
  output: {schema: PrioritizeCodeReviewOutputOutputSchema},
  prompt: `You are a code review prioritization expert. Given a list of code review issues, you will prioritize them based on severity, with high severity issues first, followed by medium severity, and then low severity issues. Respond with a JSON array of the same issues, but in the prioritized order.

Issues:
{{json input}}
`,
});

const prioritizeCodeReviewOutputFlow = ai.defineFlow(
  {
    name: 'prioritizeCodeReviewOutputFlow',
    inputSchema: PrioritizeCodeReviewOutputInputSchema,
    outputSchema: PrioritizeCodeReviewOutputOutputSchema,
  },
  async input => {
    const {output} = await prompt({input});
    return output!;
  }
);
