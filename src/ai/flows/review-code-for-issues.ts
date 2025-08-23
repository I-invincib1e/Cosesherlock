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
      isSecurityIssue: z.boolean().describe('Whether the issue is a security vulnerability.'),
      file: z.string().describe('The file where the issue was found.'),
      line: z.number().optional().describe('The line number where the issue was found.'),
      issue: z.string().describe('A description of the issue.'),
      fix: z.string().describe('A suggested fix for the issue, including comments to explain the changes.'),
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
  prompt: `You are an expert security code reviewer. Review this code for correctness, security vulnerabilities, and complexity. It is critical that you identify any security issues. Output a JSON array of issues with suggested fixes.

      The code is provided as a diff:
      {{diff}}

      For each issue, include:
      - severity: high, medium, or low
      - isSecurityIssue: true if it is a security vulnerability, false otherwise
      - file: the file name, which is {{fileName}}
      - line: the line number where the issue is found. This is very important.
      - issue: a detailed description of the issue.
      - fix: a suggested fix for the issue. IMPORTANT: The fix should be the corrected code block, and you MUST add comments within the code to explain what was changed and why.

      The JSON should conform to this schema:
      \`\`\`json
      {
        "issues": [
          {
            "severity": "string",
            "isSecurityIssue": boolean,
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
