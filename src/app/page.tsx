import { Button } from '@/components/ui/button';
import { Github, SearchCode, Bot, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <SearchCode className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Code Sherlock</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
          <Link href="/app">
            <Button>Go to App</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 text-center py-20 md:py-32">
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-full mb-4 inline-block">
            <Bot className="h-12 w-12 text-primary" />
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Your AI-Powered Code Review Assistant
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Code Sherlock helps you ship better code, faster. Our AI agent analyzes your code for correctness, security, and complexity, providing prioritized fixes to keep you moving.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/app">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-muted/50 py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Why Code Sherlock?</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Focus on building, not fixing. Here’s how Code Sherlock helps you write your best code.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-card rounded-lg border">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Analysis</h3>
                <p className="text-muted-foreground">
                  Get immediate feedback on your code as you write it. No more waiting for manual reviews.
                </p>
              </div>
              <div className="text-center p-8 bg-card rounded-lg border">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Security Focused</h3>
                <p className="text-muted-foreground">
                  Our agent is trained to spot common security vulnerabilities before they make it to production.
                </p>
              </div>
              <div className="text-center p-8 bg-card rounded-lg border">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Suggestions</h3>
                <p className="text-muted-foreground">
                  Receive intelligent, context-aware suggestions to improve code quality and maintainability.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Code Sherlock. All rights reserved.</p>
      </footer>
    </div>
  );
}
