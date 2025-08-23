import { CodeSherlockClient } from './code-sherlock-client';
import { SearchCode } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function AppPage() {
  return (
    <main className="flex flex-col min-h-screen">
       <header className="container mx-auto px-4 sm:px-6 flex justify-between items-center py-4 border-b">
        <div className="flex items-center gap-3">
          <SearchCode className="h-7 w-7 text-primary" />
          <h1 className="font-headline text-xl font-bold">
            Code Sherlock
          </h1>
        </div>
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>
      </header>
      
      <div className="flex-1 container mx-auto px-4 sm:px-6 py-8">
        <CodeSherlockClient />
      </div>
    </main>
  );
}
