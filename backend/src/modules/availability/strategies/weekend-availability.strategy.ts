import { Injectable } from '@nestjs/common';
import { AvailabilityContext, AvailabilityResult } from './availability-context';
import { AvailabilityStrategy } from './availability-strategy';
import { NormalAvailabilityStrategy } from './normal-availability.strategy';

@Injectable()
export class WeekendAvailabilityStrategy implements AvailabilityStrategy {
  readonly name = 'WEEKEND';

  constructor(private readonly normalStrategy: NormalAvailabilityStrategy) {}

  canHandle(context: AvailabilityContext): boolean {
    const day = context.checkIn.getUTCDay();
    return day === 5 || day === 6;
  }

  async validate(context: AvailabilityContext): Promise<AvailabilityResult> {
    const baseResult = await this.normalStrategy.validate(context);

    if (!baseResult.available) {
      return { ...baseResult, strategy: this.name };
    }

    const nights = Math.ceil((context.checkOut.getTime() - context.checkIn.getTime()) / 86_400_000);
    if (nights < 2) {
      return {
        available: false,
        strategy: this.name,
        reason: 'Las reservas que inician viernes o sabado requieren minimo 2 noches.',
      };
    }

    return {
      available: true,
      strategy: this.name,
      reason: 'Disponible con regla de fin de semana aplicada.',
    };
  }
}
