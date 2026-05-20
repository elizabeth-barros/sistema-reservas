'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { apiFetch, setSession } from '@/lib/api';
import { User } from '@/lib/types';

type AuthResponse = { accessToken: string; user: User };

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const data = await apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setSession(data.accessToken, data.user);
      router.push('/rooms');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible registrar.');
    }
  }

  return (
    <main>
      <NavBar />
      <section className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
        <form onSubmit={submit} className="w-full rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-coral" />
            <h1 className="text-2xl font-semibold">Registro</h1>
          </div>
          <label className="mb-3 block text-sm font-medium">
            Nombre
            <input className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="mb-3 block text-sm font-medium">
            Correo
            <input className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label className="mb-4 block text-sm font-medium">
            Password
            <input className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </label>
          {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
          <button className="w-full rounded-md bg-coral px-4 py-2 font-semibold text-white">Crear cuenta</button>
          <p className="mt-4 text-center text-sm text-ink/70">
            Ya tienes cuenta? <Link className="font-semibold text-moss" href="/login">Ingresa</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
