import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { NavBar } from '@/components/NavBar';

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <section className="relative min-h-[78vh] bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb')] bg-cover bg-center">
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-16 pt-48 text-white">
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight md:text-6xl">Hotel Reserva</h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">
            Consulta disponibilidad real, reserva habitaciones y administra estados desde un sistema modular.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="flex items-center gap-2 rounded-md bg-coral px-5 py-3 font-semibold" href="/rooms">
              Ver habitaciones
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className="rounded-md bg-white/15 px-5 py-3 font-semibold backdrop-blur" href="/login">
              Iniciar sesion
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 md:grid-cols-2">
        <div className="flex gap-3">
          <ShieldCheck className="mt-1 h-6 w-6 text-moss" />
          <div>
            <h2 className="font-semibold">Reservas sin solapamientos</h2>
            <p className="text-sm text-ink/70">La disponibilidad se valida contra reservas activas y fechas bloqueadas.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Sparkles className="mt-1 h-6 w-6 text-coral" />
          <div>
            <h2 className="font-semibold">Reglas dinamicas</h2>
            <p className="text-sm text-ink/70">Strategy aplica reglas normales, de fin de semana y temporada alta.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
