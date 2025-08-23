export interface CodeIssue {
  severity: 'high' | 'medium' | 'low' | string;
  file: string;
  line?: number;
  issue: string;
  fix: string;
  originalCode?: string;
}
