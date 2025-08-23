'use server';
/**
 * @fileOverview reviews code for correctness, security, complexity, and potential fixes.
 *
 * - reviewCodeForIssues - A function that handles the code review process.
 * - ReviewCodeForIssuesInput - The input type for the reviewCodeForIssues function.
 * - ReviewCodeForIssuesOutput - The return type for the reviewCodeForIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewCodeForIssuesInputSchema = z.object({
  diff: z.string().describe('The diff of the code to review.'),
  fileName: z.string().describe('The name of the file being reviewed.'),
});
export type ReviewCodeForIssuesInput = z.infer<typeof ReviewCodeForIssuesInputSchema>;

const ReviewCodeForIssuesOutputSchema = z.object({
  issues: z.array(
    z.object({
      severity: z.string().describe('The severity of the issue (e.g., high, medium, low).'),
      file: z.string().describe('The file where the issue was found.'),
      line: z.number().optional().describe('The line number where the issue was found.'),
      issue: z.string().describe('A description of the issue.'),
      fix: z.string().describe('A suggested fix for the issue.'),
    })
  ).describe('A list of issues found in the code.'),
});
export type ReviewCodeForIssuesOutput = z.infer<typeof ReviewCodeForIssuesOutputSchema>;

export async function reviewCodeForIssues(input: ReviewCodeForIssuesInput): Promise<ReviewCodeForIssuesOutput> {
  return reviewCodeForIssuesFlow(input);
}

const reviewCodeForIssuesPrompt = ai.definePrompt({
  name: 'reviewCodeForIssuesPrompt',
  input: {schema: ReviewCodeForIssuesInputSchema},
  output: {schema: ReviewCodeForIssuesOutputSchema},
  prompt: `Review this code for correctness, security, and complexity. Output a JSON array of issues with suggested fixes.

      The code is provided as a diff:
      {{diff}}

      Each issue should include: severity, file, line (if applicable), issue, and fix. The file name is {{fileName}}.
      The JSON should conform to this schema:
      \`\`\`json
      {
        "issues": [
          {
            "severity": "string",
            "file": "string",
            "line": "number?",
            "issue": "string",
            "fix": "string"
          }
        ]
      }\`\`\`
`,
});

const reviewCodeForIssuesFlow = ai.defineFlow(
  {
    name: 'reviewCodeForIssuesFlow',
    inputSchema: ReviewCodeForIssuesInputSchema,
    outputSchema: ReviewCodeForIssuesOutputSchema,
  },
  async input => {
    const {output} = await reviewCodeForIssuesPrompt(input);
    return output!;
  }
);
