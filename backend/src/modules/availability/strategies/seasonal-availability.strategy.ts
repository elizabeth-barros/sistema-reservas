import { Injectable } from '@nestjs/common';
import { AvailabilityContext, AvailabilityResult } from './availability-context';
import { AvailabilityStrategy } from './availability-strategy';
import { NormalAvailabilityStrategy } from './normal-availability.strategy';

@Injectable()
export class SeasonalAvailabilityStrategy implements AvailabilityStrategy {
  readonly name = 'SEASONAL';

  constructor(private readonly normalStrategy: NormalAvailabilityStrategy) {}

  canHandle(context: AvailabilityContext): boolean {
    const month = context.checkIn.getUTCMonth() + 1;
    return month === 12 || month === 1 || month === 7;
  }

  async validate(context: AvailabilityContext): Promise<AvailabilityResult> {
    const baseResult = await this.normalStrategy.validate(context);

    if (!baseResult.available) {
      return { ...baseResult, strategy: this.name };
    }

    const nights = Math.ceil((context.checkOut.getTime() - context.checkIn.getTime()) / 86_400_000);
    if (nights < 3) {
      return {
        available: false,
        strategy: this.name,
        reason: 'En temporada alta la reserva minima es de 3 noches.',
      };
    }

    return {
      available: true,
      strategy: this.name,
      reason: 'Disponible con regla de temporada alta aplicada.',
    };
  }
}
