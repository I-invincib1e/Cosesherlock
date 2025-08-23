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
  GitCompareArrows,
  FileCode,
} from 'lucide-react';
import type { CodeIssue } from '@/lib/types';
import * as Diff from 'diff';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


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

  if (isSecurityIssue) {
    return (
      <Badge variant="destructive" className="gap-1.5 whitespace-nowrap text-sm py-1 px-3">
        <ShieldCheck className="h-4 w-4" /> Security Risk
      </Badge>
    );
  }

  if (lowerSeverity === 'high') {
    return (
      <Badge variant="destructive" className="gap-1.5 whitespace-nowrap text-sm py-1 px-3">
        <CircleAlert className="h-4 w-4" /> High
      </Badge>
    );
  }
  if (lowerSeverity === 'medium') {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100/90 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800/80 gap-1.5 whitespace-nowrap text-sm py-1 px-3">
        <AlertTriangle className="h-4 w-4" /> Medium
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1.5 whitespace-nowrap text-sm py-1 px-3">
      <Info className="h-4 w-4" /> Low
    </Badge>
  );
}

function CodeBlock({ code, highlightLine, title, icon: Icon }: { code: string; highlightLine?: number; title: string, icon: React.ElementType }) {
  return (
    <div className="rounded-lg border bg-card w-full">
      <div className="flex items-center gap-2 p-3 border-b bg-muted/50">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <pre className="p-4 text-xs overflow-x-auto bg-background rounded-b-lg">
        <code>
          {code.split('\n').map((line, index) => {
            const isHighlighted = (index + 1) === highlightLine;
            return (
              <div key={index} className={cn('block -mx-4 px-4', isHighlighted && 'bg-yellow-400/20 border-l-2 border-yellow-400')}>
                <span className="text-right pr-4 inline-block w-8 text-muted-foreground select-none">{index + 1}</span>
                <span>{line}</span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}


function DiffView({ oldCode, newCode, line }: { oldCode: string; newCode: string, line?: number }) {
  const diffResult = Diff.diffLines(oldCode, newCode, { newlineIsToken: false, ignoreWhitespace: false });
  const hasChanges = diffResult.some(part => part.added || part.removed);

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CodeBlock code={oldCode} highlightLine={line} title="Original Code" icon={FileCode} />
        <CodeBlock code={newCode} title="Suggested Fix" icon={GitCompareArrows} />
      </div>
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

  if (!issues) {
    return (
      <Card className="text-center h-full flex flex-col justify-center items-center p-8 lg:min-h-[600px] border-dashed">
        <div className="mx-auto bg-muted p-4 rounded-full w-fit mb-4 border">
          <Wand2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <CardTitle className="mb-2 text-xl">Analysis Results</CardTitle>
        <p className="text-muted-foreground max-w-sm">
          Submit your code to see the analysis results here.
        </p>
      </Card>
    );
  }

  if (issues.length === 0) {
    return (
      <Card className="text-center h-full flex flex-col justify-center items-center p-8 lg:min-h-[600px]">
        <div className="mx-auto bg-green-500/10 dark:bg-green-500/20 p-4 rounded-full w-fit mb-4 border border-green-500/20">
          <ShieldCheck className="h-10 w-10 text-green-500" />
        </div>
        <CardTitle className="mb-2 text-xl">All Clear!</CardTitle>
        <CardDescription>No issues found in the provided code. Great job!</CardDescription>
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
          <div key={index} className="border-t pt-6 first:border-t-0 first:pt-0">
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

            <DiffView oldCode={issue.originalCode || ''} newCode={issue.fix} line={issue.line} />

          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function CodeSherlockClient() {
  const initialState = { issues: undefined, error: undefined };
  const [state, formAction] = useActionState(getCodeReview, initialState);
  const { pending } = useFormStatus();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="lg:sticky top-8">
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
                className="font-mono min-h-[300px] lg:min-h-[400px] bg-muted/50 border-muted-foreground/20 focus:bg-background text-sm"
                required
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <div className="min-h-[600px] lg:min-h-0">
        <ResultsDisplay issues={state.issues} error={state.error} />
      </div>
    </div>
  );
}
