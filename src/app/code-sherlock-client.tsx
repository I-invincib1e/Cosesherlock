'use client';

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getCodeReview } from './actions';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CircleAlert,
  Info,
  Lightbulb,
  Loader2,
  Wand2,
} from 'lucide-react';
import type { CodeIssue } from '@/lib/types';
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

function SeverityBadge({ severity }: { severity: string }) {
  const lowerSeverity = severity.toLowerCase();
  if (lowerSeverity === 'high') {
    return (
      <Badge variant="destructive" className="gap-1.5 whitespace-nowrap">
        <CircleAlert className="h-3.5 w-3.5" /> High Severity
      </Badge>
    );
  }
  if (lowerSeverity === 'medium') {
    return (
      <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/30 gap-1.5 whitespace-nowrap">
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
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto bg-secondary p-3 rounded-full w-fit">
            <Lightbulb className="h-8 w-8 text-secondary-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="mb-2">Ready to Review</CardTitle>
          <p className="text-muted-foreground">
            Enter a filename and paste your code to start the analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (issues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Clear!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No issues found in the provided code. Great job!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {issues.map((issue, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-4 text-left w-full">
                  <SeverityBadge severity={issue.severity} />
                  <span className="flex-1 font-medium truncate">
                    {issue.issue}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4 space-y-4">
                <div className="text-sm text-muted-foreground">
                  Found in{' '}
                  <span className="font-mono text-foreground">{issue.file}</span>
                  {issue.line && ` on line ${issue.line}`}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Issue Description</h4>
                  <p className="text-muted-foreground">{issue.issue}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Suggested Fix</h4>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code className="font-code text-sm text-muted-foreground">
                      {issue.fix}
                    </code>
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export function CodeSherlockClient() {
  const initialState = { issues: undefined, error: undefined };
  const [state, formAction] = useActionState(getCodeReview, initialState);
  const { pending } = useFormStatus();
  const [activeTab, setActiveTab] = React.useState('review');

  React.useEffect(() => {
    if (pending || state.issues || state.error) {
      setActiveTab('analysis');
    }
  }, [pending, state.issues, state.error]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="flex justify-center">
        <TabsList>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!state.issues && !state.error && !pending}>Analysis</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="review">
        <Card>
          <CardHeader>
            <CardTitle>Submit Code for Review</CardTitle>
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
                  className="font-code min-h-[300px] lg:min-h-[400px]"
                  required
                />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analysis">
        <ResultsDisplay issues={state.issues} error={state.error} />
      </TabsContent>
    </Tabs>
  );
}
