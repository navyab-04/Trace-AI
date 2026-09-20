import './globals.css';
import React from 'react';

export const metadata = {
  title: 'TraceID AI - Digital Identity & Footprint Intelligence',
  description: 'AI-powered public digital identity intelligence system for evidence-backed candidate resolution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg">
              T
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-50 tracking-tight">TraceID AI</h1>
              <p className="text-xs text-slate-400">Discover &rarr; Correlate &rarr; Verify &rarr; Explain</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-700/50 text-cyan-300 font-mono">
              SYSTEM READY &bull; FASTAPI + SCIMITAR
            </span>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
          TraceID AI Digital Footprint Intelligence &bull; Authorized Public Information Workflow
        </footer>
      </body>
    </html>
  );
}
