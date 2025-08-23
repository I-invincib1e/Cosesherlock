'use server';

import { reviewCodeForIssues } from '@/ai/flows/review-code-for-issues';
import { prioritizeCodeReviewOutput } from '@/ai/flows/prioritize-code-review-output';
import type { CodeIssue } from '@/lib/types';
import { z } from 'zod';

const ReviewSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  code: z.string().min(10, 'Please provide some code to review'),
});

interface ReviewState {
  issues?: CodeIssue[];
  error?: string;
  originalCode?: string;
}

export async function getCodeReview(prevState: any, formData: FormData): Promise<ReviewState> {
  try {
    const validatedFields = ReviewSchema.safeParse({
      fileName: formData.get('fileName'),
      code: formData.get('code'),
    });

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors.code?.[0] || validatedFields.error.flatten().fieldErrors.fileName?.[0] || 'Invalid input.',
      };
    }
    
    const { fileName, code } = validatedFields.data;

    const reviewResult = await reviewCodeForIssues({
      diff: code,
      fileName,
    });

    if (!reviewResult || !reviewResult.issues || reviewResult.issues.length === 0) {
      return { issues: [], originalCode: code };
    }
    
    const issuesWithOriginalCode = reviewResult.issues.map(issue => ({ ...issue, originalCode: code }));

    const prioritizedResult = await prioritizeCodeReviewOutput(issuesWithOriginalCode);

    return { issues: prioritizedResult, originalCode: code };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred. Please try again.' };
  }
}
