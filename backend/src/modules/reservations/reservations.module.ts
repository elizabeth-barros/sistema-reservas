import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityModule } from '../availability/availability.module';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservation.repository';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), UsersModule, RoomsModule, forwardRef(() => AvailabilityModule)],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
  exports: [ReservationRepository, ReservationsService],
})
export class ReservationsModule {}
