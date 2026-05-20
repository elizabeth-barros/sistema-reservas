'use client';

import Link from 'next/link';
import { Users, Wifi } from 'lucide-react';
import { Room } from '@/lib/types';

export function RoomCard({ room }: { room: Room }) {
  return (
    <article className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
      <div
        className="h-44 bg-cover bg-center"
        style={{
          backgroundImage: `url(${room.imageUrl || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'})`,
        }}
      />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{room.name}</h3>
            <p className="line-clamp-2 text-sm text-ink/70">{room.description}</p>
          </div>
          <span className="rounded-md bg-skywash px-2 py-1 text-sm font-semibold">${Number(room.pricePerNight)}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-ink/65">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {room.capacity}
          </span>
          <span className="flex items-center gap-1">
            <Wifi className="h-4 w-4" />
            Incluido
          </span>
        </div>
        <Link className="block rounded-md bg-coral px-4 py-2 text-center font-medium text-white" href={`/rooms/${room.id}`}>
          Reservar
        </Link>
      </div>
    </article>
  );
}
