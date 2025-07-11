// /src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-10 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        PDF&nbsp;Builder
      </h1>
      <p className="max-w-md text-lg text-gray-600 mb-8">
        Diseña y descarga PDFs profesionales con tu propio branding, tablas y
        gráficos — sin plugins ni plantillas complicadas.
      </p>

      <Link
        href="/editor"
        className="rounded-lg bg-pdf-500 px-6 py-3 font-medium text-white hover:bg-pdf-700 transition"
      >
        Ir al editor →
      </Link>
    </main>
  );
}
