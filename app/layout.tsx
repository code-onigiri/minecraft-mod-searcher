import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Minecraft Mod Searcher',
  description: '複数のMinecraft Modプラットフォームを横断検索するツール',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" data-theme="light">
      <body className="min-h-screen bg-base-100 text-base-content">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
