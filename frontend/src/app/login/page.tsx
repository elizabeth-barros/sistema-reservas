'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { apiFetch, setSession } from '@/lib/api';
import { User } from '@/lib/types';

type AuthResponse = { accessToken: string; user: User };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const data = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setSession(data.accessToken, data.user);
      router.push(data.user.role === 'admin' ? '/admin' : '/rooms');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible iniciar sesion.');
    }
  }

  return (
    <main>
      <NavBar />
      <section className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
        <form onSubmit={submit} className="w-full rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Lock className="h-5 w-5 text-moss" />
            <h1 className="text-2xl font-semibold">Iniciar sesion</h1>
          </div>
          <label className="mb-3 block text-sm font-medium">
            Correo
            <input className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="mb-4 block text-sm font-medium">
            Password
            <input className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
          <button className="w-full rounded-md bg-moss px-4 py-2 font-semibold text-white">Ingresar</button>
          <p className="mt-4 text-center text-sm text-ink/70">
            No tienes cuenta? <Link className="font-semibold text-coral" href="/register">Registrate</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
