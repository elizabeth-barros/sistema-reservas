import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';
import { assertValidDateRange } from '../../common/utils/date-range';
import { AvailabilityService } from '../availability/availability.service';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservations: ReservationRepository,
    private readonly usersService: UsersService,
    private readonly roomsService: RoomsService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  findAll(): Promise<Reservation[]> {
    return this.reservations.findAll();
  }

  findByUser(userId: string): Promise<Reservation[]> {
    return this.reservations.findByUser(userId);
  }

  async create(userId: string, dto: CreateReservationDto): Promise<Reservation> {
    const user = await this.usersService.findById(userId);
    const room = await this.roomsService.findById(dto.roomId);
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    assertValidDateRange(checkIn, checkOut);

    if (!room.isActive) {
      throw new BadRequestException('Las habitaciones inactivas no pueden reservarse.');
    }

    const availability = await this.availabilityService.check(dto);
    if (!availability.available) {
      throw new BadRequestException(availability.reason);
    }

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86_400_000);
    const totalPrice = Number(room.pricePerNight) * nights;

    return this.reservations.save(
      this.reservations.create({
        user,
        room,
        checkIn,
        checkOut,
        status: ReservationStatus.Pending,
        totalPrice,
      }),
    );
  }

  async updateStatus(id: string, dto: UpdateReservationStatusDto): Promise<Reservation> {
    const reservation = await this.reservations.findById(id);
    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada.');
    }

    reservation.status = dto.status;
    return this.reservations.save(reservation);
  }
}
