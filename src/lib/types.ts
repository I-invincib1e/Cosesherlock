export interface CodeIssue {
  severity: 'high' | 'medium' | 'low' | string;
  isSecurityIssue?: boolean;
  file: string;
  line?: number;
  issue: string;
  fix: string;
  originalCode?: string;
}
