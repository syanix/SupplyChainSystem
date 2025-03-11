import React from 'react';
import { Card } from '@supply-chain-system/ui';

export interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Supply Chain System</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Card className="min-h-[calc(100vh-8rem)]">{children}</Card>
      </main>
    </div>
  );
}
