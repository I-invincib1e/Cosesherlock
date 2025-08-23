import { CodeSherlockClient } from './code-sherlock-client';
import { SearchCode } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function AppPage() {
  return (
    <main className="container mx-auto p-4 sm:p-8">
       <header className="flex justify-between items-center mb-8 md:mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-full">
            <SearchCode className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="font-headline text-3xl font-bold">
              Code Sherlock
            </h1>
            <p className="text-muted-foreground">
              Your AI-powered code review assistant.
            </p>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </header>
      
      <div className="max-w-7xl mx-auto w-full">
        <CodeSherlockClient />
      </div>
    </main>
  );
}
