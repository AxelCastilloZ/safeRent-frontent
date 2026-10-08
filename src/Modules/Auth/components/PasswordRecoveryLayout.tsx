import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import logo from '../../../assets/saferent-logo.svg';



export default function PasswordRecoveryLayout({ title, description, children }: {
  title: string; description: string; children: ReactNode;
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[#f8f9fa] px-4 py-12 font-sans">
      <img src={logo} alt="SafeRent" width={298} height={143} className="mb-8 h-auto w-[240px] sm:w-[298px]" />
      <section className="flex w-full max-w-[448px] flex-col gap-6 rounded-xl bg-white px-5 py-6 shadow-xl sm:px-6">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="text-[28px] leading-9 font-semibold tracking-tight text-[#191c1d]">{title}</h1>
          <p className="text-sm leading-6 text-[#45474c]">{description}</p>
        </header>
        {children}
        <Link to="/login" className="text-center text-sm font-semibold text-[#0a2540] hover:underline">Volver al login</Link>
      </section>
    </main>
  );
}

