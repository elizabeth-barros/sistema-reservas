'use client';

import { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { RoomCard } from '@/components/RoomCard';
import { apiFetch } from '@/lib/api';
import { Room } from '@/lib/types';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Room[]>('/rooms')
      .then(setRooms)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold">Habitaciones disponibles</h1>
            <p className="text-ink/70">Selecciona una habitacion y valida fechas antes de reservar.</p>
          </div>
        </div>
        {loading ? (
          <p>Cargando habitaciones...</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
