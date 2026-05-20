'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BedDouble, CalendarDays, LayoutDashboard, LogOut } from 'lucide-react';
import { clearSession, getSessionUser } from '@/lib/api';
import { User } from '@/lib/types';

export function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getSessionUser<User>());
  }, []);

  function logout() {
    clearSession();
    router.push('/login');
  }

  return (
    <header className="border-b border-ink/10 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <BedDouble className="h-5 w-5 text-moss" />
          Hotel Reserva
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <Link className="flex items-center gap-1 rounded-md px-3 py-2 hover:bg-skywash" href="/rooms">
            <CalendarDays className="h-4 w-4" />
            Habitaciones
          </Link>
          {user?.role === 'admin' && (
            <Link className="flex items-center gap-1 rounded-md px-3 py-2 hover:bg-skywash" href="/admin">
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          )}
          {user ? (
            <button onClick={logout} className="rounded-md p-2 hover:bg-skywash" title="Cerrar sesion">
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <Link className="rounded-md bg-moss px-3 py-2 text-white" href="/login">
              Ingresar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
