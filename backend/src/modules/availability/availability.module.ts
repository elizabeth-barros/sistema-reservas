import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsModule } from '../reservations/reservations.module';
import { RoomsModule } from '../rooms/rooms.module';
import { AvailabilityStrategyFactory } from './availability-strategy.factory';
import { AvailabilityRepository } from './availability.repository';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { Availability } from './entities/availability.entity';
import { NormalAvailabilityStrategy } from './strategies/normal-availability.strategy';
import { SeasonalAvailabilityStrategy } from './strategies/seasonal-availability.strategy';
import { WeekendAvailabilityStrategy } from './strategies/weekend-availability.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Availability]), RoomsModule, forwardRef(() => ReservationsModule)],
  controllers: [AvailabilityController],
  providers: [
    AvailabilityService,
    AvailabilityRepository,
    AvailabilityStrategyFactory,
    NormalAvailabilityStrategy,
    WeekendAvailabilityStrategy,
    SeasonalAvailabilityStrategy,
  ],
  exports: [AvailabilityService, AvailabilityRepository],
})
export class AvailabilityModule {}
