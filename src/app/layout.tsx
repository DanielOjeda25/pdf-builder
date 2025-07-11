// /src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const metadata = {
  title: 'PDF Builder',
  description: 'Generador de PDFs dinámicos con drag-and-drop',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={`${GeistSans.variable} ${GeistMono.variable} flex min-h-screen flex-col bg-gray-100 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
