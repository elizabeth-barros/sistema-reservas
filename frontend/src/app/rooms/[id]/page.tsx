'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CalendarCheck } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { apiFetch, getToken } from '@/lib/api';
import { AvailabilityResult, Room } from '@/lib/types';

export default function RoomDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiFetch<Room>(`/rooms/${params.id}`).then(setRoom);
  }, [params.id]);

  async function checkAvailability() {
    const data = await apiFetch<AvailabilityResult>(
      `/availability?roomId=${params.id}&checkIn=${checkIn}&checkOut=${checkOut}`,
    );
    setResult(data);
    return data;
  }

  async function reserve(event: FormEvent) {
    event.preventDefault();
    setMessage('');

    if (!getToken()) {
      router.push('/login');
      return;
    }

    const availability = await checkAvailability();
    if (!availability.available) return;

    await apiFetch('/reservations', {
      method: 'POST',
      body: JSON.stringify({ roomId: params.id, checkIn, checkOut }),
    });
    setMessage('Reserva creada en estado pending.');
  }

  if (!room) return <main><NavBar /><p className="p-6">Cargando...</p></main>;

  return (
    <main>
      <NavBar />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div
            className="h-80 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${room.imageUrl || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'})` }}
          />
          <h1 className="mt-5 text-3xl font-semibold">{room.name}</h1>
          <p className="mt-2 text-ink/70">{room.description}</p>
          <p className="mt-3 font-semibold">${Number(room.pricePerNight)} por noche</p>
        </div>
        <form onSubmit={reserve} className="h-fit rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-moss" />
            <h2 className="text-xl font-semibold">Reservar</h2>
          </div>
          <label className="mb-3 block text-sm font-medium">
            Check-in
            <input className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
          </label>
          <label className="mb-4 block text-sm font-medium">
            Check-out
            <input className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
          </label>
          <button type="button" onClick={checkAvailability} className="mb-3 w-full rounded-md border border-moss px-4 py-2 font-medium text-moss">
            Consultar disponibilidad
          </button>
          {result && (
            <p className={`mb-3 rounded-md px-3 py-2 text-sm ${result.available ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {result.reason} Estrategia: {result.strategy}
            </p>
          )}
          <button className="w-full rounded-md bg-coral px-4 py-2 font-semibold text-white">Crear reserva</button>
          {message && <p className="mt-3 rounded-md bg-skywash px-3 py-2 text-sm">{message}</p>}
        </form>
      </section>
    </main>
  );
}
