'use client';

import React, { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { getCodeReview } from './actions';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CircleAlert,
  Info,
  Lightbulb,
  Loader2,
  ShieldCheck,
  Wand2,
} from 'lucide-react';
import type { CodeIssue } from '@/lib/types';
import * as Diff from 'diff';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Review Code
        </>
      )}
    </Button>
  );
}

function SeverityBadge({ severity, isSecurityIssue }: { severity: string, isSecurityIssue?: boolean }) {
  const lowerSeverity = severity.toLowerCase();

  if(isSecurityIssue) {
    return (
      <Badge variant="destructive" className="gap-1.5 whitespace-nowrap">
        <ShieldCheck className="h-3.5 w-3.5" /> Security Risk
      </Badge>
    );
  }

  if (lowerSeverity === 'high') {
    return (
      <Badge variant="destructive" className="gap-1.5 whitespace-nowrap">
        <CircleAlert className="h-3.5 w-3.5" /> High Severity
      </Badge>
    );
  }
  if (lowerSeverity === 'medium') {
    return (
      <Badge className="bg-yellow-500 text-yellow-900 border-yellow-600/50 hover:bg-yellow-500/90 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30 dark:hover:bg-yellow-500/30 gap-1.5 whitespace-nowrap">
        <AlertTriangle className="h-3.5 w-3.5" /> Medium Severity
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1.5 whitespace-nowrap">
      <Info className="h-3.5 w-3.5" /> Low Severity
    </Badge>
  );
}

function DiffView({ oldCode, newCode }: { oldCode: string; newCode: string }) {
  const diffResult = Diff.diffLines(oldCode, newCode, { newlineIsToken: false, ignoreWhitespace: false });

  const hasChanges = diffResult.some(part => part.added || part.removed);

  if (!hasChanges) {
    return (
       <div className="space-y-4">
        <div>
            <h4 className="font-semibold mb-2 text-foreground/90">Suggested Fix</h4>
            <p className="text-muted-foreground text-sm">No code changes suggested. The fix is descriptive.</p>
        </div>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto border text-sm">
          <code>
            {newCode}
          </code>
        </pre>
      </div>
    )
  }

  const addedLines = diffResult.filter(part => part.added).length;
  const removedLines = diffResult.filter(part => part.removed).length;

  return (
    <div className="space-y-4">
        <div>
            <h4 className="font-semibold mb-2 text-foreground/90">Suggested Fix</h4>
            <div className="flex items-center gap-4 text-sm">
                 <span className="text-green-500">+{addedLines} additions</span>
                 <span className="text-red-500">-{removedLines} deletions</span>
            </div>
        </div>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto border text-sm">
          <code>
            {diffResult.map((part, index) => {
              const color = part.added
                ? 'text-green-500'
                : part.removed
                ? 'text-red-500'
                : 'text-muted-foreground opacity-70';
              
              const prefix = part.added ? '+' : part.removed ? '-' : ' ';
              
              return (
                <span key={index} className={color}>
                  {part.value.split('\n').filter(line => line).map((line, i) => (
                      <span key={i} className="block">
                        <span className="inline-block w-4 text-right pr-2 select-none">{prefix}</span>
                        <span>{line}</span>
                      </span>
                  ))}
                </span>
              );
            })}
          </code>
        </pre>
    </div>
  );
}

function ResultsDisplay({
  issues,
  error,
}: {
  issues?: CodeIssue[];
  error?: string;
}) {
  const { pending } = useFormStatus();
  const [showResults, setShowResults] = useState(false);

  React.useEffect(() => {
    if (pending || issues || error) {
      setShowResults(true);
    }
  }, [pending, issues, error]);

  if (!showResults) {
    return (
      <Card className="text-center h-full flex flex-col justify-center items-center p-8 lg:min-h-[600px]">
        <div className="mx-auto bg-secondary p-4 rounded-full w-fit mb-4">
          <Lightbulb className="h-10 w-10 text-secondary-foreground" />
        </div>
        <CardTitle className="mb-2 text-xl">Ready to Review</CardTitle>
        <p className="text-muted-foreground max-w-sm">
          Submit your code using the form to start the analysis.
        </p>
      </Card>
    );
  }

  if (pending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyzing Code...</CardTitle>
          <CardDescription>Please wait while we check your code for issues.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Analysis Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (issues && issues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Clear!</CardTitle>
          <CardDescription>No issues found in the provided code. Great job!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground p-8">
            <p>Your code looks clean!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>
          Found {issues?.length || 0} issue{issues?.length === 1 ? '' : 's'}. Here's the breakdown:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {issues && issues.map((issue, index) => (
           <div key={index} className="border-t pt-6">
             <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">{issue.issue}</h3>
                    <div className="text-sm text-muted-foreground">
                    Found in <span className="font-mono text-foreground bg-muted/80 px-1 py-0.5 rounded">{issue.file}</span>
                    {issue.line && ` on line ${issue.line}`}
                    </div>
                </div>
                <SeverityBadge severity={issue.severity} isSecurityIssue={issue.isSecurityIssue} />
             </div>
            
            <DiffView oldCode={issue.originalCode || ''} newCode={issue.fix} />

          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function CodeSherlockClient() {
  const initialState = { issues: undefined, error: undefined };
  const [state, formAction] = useActionState(getCodeReview, initialState);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card className="md:sticky top-8">
        <CardHeader>
          <CardTitle>Submit Code for Review</CardTitle>
          <CardDescription>
            Enter a filename and paste your code or diff to start.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fileName" className="text-sm font-medium">
                File Name
              </label>
              <Input
                id="fileName"
                name="fileName"
                placeholder="e.g., src/components/button.tsx"
                required
                className="bg-muted/50 border-muted-foreground/20 focus:bg-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Code
              </label>
              <Textarea
                id="code"
                name="code"
                placeholder="Paste your code or code diff here..."
                className="font-code min-h-[300px] lg:min-h-[400px] bg-muted/50 border-muted-foreground/20 focus:bg-background"
                required
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
      <div className="min-h-[600px]">
        <ResultsDisplay issues={state.issues} error={state.error} />
      </div>
    </div>
  );
}
