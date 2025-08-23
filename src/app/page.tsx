import { CodeSherlockClient } from './code-sherlock-client';
import { SearchCode } from 'lucide-react';

export default function Home() {
  return (
    <main className="container mx-auto p-4 sm:p-8">
      <div className="w-full">
        <header className="flex flex-col items-center text-center mb-8 md:mb-12">
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-full mb-4">
            <SearchCode className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Code Sherlock
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Paste your code, and let our AI agent analyze it for correctness, security, and complexity, providing prioritized fixes.
          </p>
        </header>

        <CodeSherlockClient />
      </div>
    </main>
  );
}
