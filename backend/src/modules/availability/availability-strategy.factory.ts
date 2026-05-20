import { Injectable } from '@nestjs/common';
import { AvailabilityContext } from './strategies/availability-context';
import { AvailabilityStrategy } from './strategies/availability-strategy';
import { NormalAvailabilityStrategy } from './strategies/normal-availability.strategy';
import { SeasonalAvailabilityStrategy } from './strategies/seasonal-availability.strategy';
import { WeekendAvailabilityStrategy } from './strategies/weekend-availability.strategy';

@Injectable()
export class AvailabilityStrategyFactory {
  private readonly strategies: AvailabilityStrategy[];

  constructor(
    seasonal: SeasonalAvailabilityStrategy,
    weekend: WeekendAvailabilityStrategy,
    normal: NormalAvailabilityStrategy,
  ) {
    this.strategies = [seasonal, weekend, normal];
  }

  resolve(context: AvailabilityContext): AvailabilityStrategy {
    return this.strategies.find((strategy) => strategy.canHandle(context)) ?? this.strategies[this.strategies.length - 1];
  }
}
