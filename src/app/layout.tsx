// /src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'PDF Builder',
  description: 'Generador de PDFs dinámicos con drag-and-drop',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
