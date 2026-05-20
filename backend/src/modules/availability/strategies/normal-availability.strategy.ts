import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../../reservations/reservation.repository';
import { AvailabilityRepository } from '../availability.repository';
import { AvailabilityContext, AvailabilityResult } from './availability-context';
import { AvailabilityStrategy } from './availability-strategy';

@Injectable()
export class NormalAvailabilityStrategy implements AvailabilityStrategy {
  readonly name = 'NORMAL';

  constructor(
    private readonly reservations: ReservationRepository,
    private readonly availability: AvailabilityRepository,
  ) {}

  canHandle(): boolean {
    return true;
  }

  async validate(context: AvailabilityContext): Promise<AvailabilityResult> {
    const [conflicts, blockedDates] = await Promise.all([
      this.reservations.findConflicting(context.room.id, context.checkIn, context.checkOut),
      this.availability.findBlockedInRange(context.room.id, context.checkIn, context.checkOut),
    ]);

    if (conflicts.length > 0) {
      return {
        available: false,
        strategy: this.name,
        reason: 'Ya existe una reserva activa que se cruza con las fechas solicitadas.',
      };
    }

    if (blockedDates.length > 0) {
      return {
        available: false,
        strategy: this.name,
        reason: 'La habitacion tiene fechas bloqueadas por administracion.',
      };
    }

    return {
      available: true,
      strategy: this.name,
      reason: 'La habitacion esta disponible para el rango solicitado.',
    };
  }
}
