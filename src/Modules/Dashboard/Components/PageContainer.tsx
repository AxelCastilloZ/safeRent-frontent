import type { ReactNode } from 'react';

/** Marco estándar del contenido de una pantalla del panel (ancho máximo y márgenes). */
export default function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>;
}
