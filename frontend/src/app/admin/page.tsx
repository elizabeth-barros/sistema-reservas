'use client';

import { FormEvent, useEffect, useState } from 'react';
import { BedDouble, CalendarX, CheckCircle2, Plus } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { apiFetch } from '@/lib/api';
import { Reservation, Room } from '@/lib/types';

const initialRoom = {
  name: '',
  description: '',
  capacity: 2,
  pricePerNight: 100,
  isActive: true,
  imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
};

export default function AdminPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [roomForm, setRoomForm] = useState(initialRoom);
  const [availability, setAvailability] = useState({ roomId: '', date: '', isBlocked: true, reason: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try {
      const [roomData, reservationData] = await Promise.all([
        apiFetch<Room[]>('/rooms?includeInactive=true'),
        apiFetch<Reservation[]>('/reservations'),
      ]);
      setRooms(roomData);
      setReservations(reservationData);
      if (!availability.roomId && roomData[0]) setAvailability((current) => ({ ...current, roomId: roomData[0].id }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible cargar el panel.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createRoom(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await apiFetch('/rooms', { method: 'POST', body: JSON.stringify(roomForm) });
      setRoomForm(initialRoom);
      setMessage('Habitacion creada.');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible crear la habitacion.');
    }
  }

  async function toggleRoom(room: Room) {
    setError('');
    try {
      await apiFetch(`/rooms/${room.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !room.isActive }),
      });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible actualizar la habitacion.');
    }
  }

  async function updateReservation(id: string, status: Reservation['status']) {
    setError('');
    setMessage('');
    try {
      await apiFetch(`/reservations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setMessage('Estado de reserva actualizado.');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible cambiar el estado de la reserva.');
    }
  }

  async function blockDate(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await apiFetch('/availability', { method: 'POST', body: JSON.stringify(availability) });
      setMessage('Disponibilidad actualizada.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible actualizar la disponibilidad.');
    }
  }

  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-semibold">Panel administrador</h1>
        <p className="text-ink/70">Gestion de habitaciones, reservas y disponibilidad.</p>
        {message && <p className="mt-4 rounded-md bg-skywash px-3 py-2 text-sm">{message}</p>}
        {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <form onSubmit={createRoom} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-moss" />
              <h2 className="text-xl font-semibold">Crear habitacion</h2>
            </div>
            <input className="mb-3 w-full rounded-md border border-ink/15 px-3 py-2" placeholder="Nombre" value={roomForm.name} onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })} required />
            <textarea className="mb-3 min-h-24 w-full rounded-md border border-ink/15 px-3 py-2" placeholder="Descripcion" value={roomForm.description} onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })} required />
            <div className="grid gap-3 md:grid-cols-2">
              <input className="rounded-md border border-ink/15 px-3 py-2" type="number" min={1} value={roomForm.capacity} onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })} />
              <input className="rounded-md border border-ink/15 px-3 py-2" type="number" min={0} value={roomForm.pricePerNight} onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: Number(e.target.value) })} />
            </div>
            <input className="mt-3 w-full rounded-md border border-ink/15 px-3 py-2" placeholder="Imagen URL" value={roomForm.imageUrl} onChange={(e) => setRoomForm({ ...roomForm, imageUrl: e.target.value })} />
            <button className="mt-4 w-full rounded-md bg-moss px-4 py-2 font-semibold text-white">Guardar</button>
          </form>

          <form onSubmit={blockDate} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CalendarX className="h-5 w-5 text-coral" />
              <h2 className="text-xl font-semibold">Gestionar disponibilidad</h2>
            </div>
            <select className="mb-3 w-full rounded-md border border-ink/15 px-3 py-2" value={availability.roomId} onChange={(e) => setAvailability({ ...availability, roomId: e.target.value })}>
              {rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
            </select>
            <input className="mb-3 w-full rounded-md border border-ink/15 px-3 py-2" type="date" value={availability.date} onChange={(e) => setAvailability({ ...availability, date: e.target.value })} required />
            <select className="mb-3 w-full rounded-md border border-ink/15 px-3 py-2" value={String(availability.isBlocked)} onChange={(e) => setAvailability({ ...availability, isBlocked: e.target.value === 'true' })}>
              <option value="true">Bloqueada</option>
              <option value="false">Disponible</option>
            </select>
            <input className="w-full rounded-md border border-ink/15 px-3 py-2" placeholder="Motivo" value={availability.reason} onChange={(e) => setAvailability({ ...availability, reason: e.target.value })} />
            <button className="mt-4 w-full rounded-md bg-coral px-4 py-2 font-semibold text-white">Actualizar fecha</button>
          </form>
        </div>

        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold"><BedDouble className="h-5 w-5" /> Habitaciones</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {rooms.map((room) => (
              <div key={room.id} className="rounded-lg border border-ink/10 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{room.name}</h3>
                    <p className="text-sm text-ink/65">${Number(room.pricePerNight)} por noche</p>
                  </div>
                  <button onClick={() => toggleRoom(room)} className="rounded-md border border-ink/15 px-3 py-1 text-sm">
                    {room.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 overflow-x-auto">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold"><CheckCircle2 className="h-5 w-5" /> Reservas</h2>
          <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-sm">
            <thead className="text-left text-ink/60">
              <tr><th>Habitacion</th><th>Usuario</th><th>Fechas</th><th>Total</th><th>Estado</th><th>Accion</th></tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="bg-white">
                  <td className="rounded-l-lg p-3">{reservation.room?.name}</td>
                  <td className="p-3">{reservation.user?.email}</td>
                  <td className="p-3">{reservation.checkIn} / {reservation.checkOut}</td>
                  <td className="p-3">${Number(reservation.totalPrice)}</td>
                  <td className="p-3">{reservation.status}</td>
                  <td className="rounded-r-lg p-3">
                    <select className="rounded-md border border-ink/15 px-2 py-1" value={reservation.status} onChange={(e) => updateReservation(reservation.id, e.target.value as Reservation['status'])}>
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                      <option value="completed">completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}
