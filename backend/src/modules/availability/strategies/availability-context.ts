import { Room } from '../../rooms/entities/room.entity';

export interface AvailabilityContext {
  room: Room;
  checkIn: Date;
  checkOut: Date;
}

export interface AvailabilityResult {
  available: boolean;
  strategy: string;
  reason: string;
}
