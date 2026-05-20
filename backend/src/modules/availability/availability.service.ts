import { BadRequestException, Injectable } from '@nestjs/common';
import { assertValidDateRange } from '../../common/utils/date-range';
import { RoomsService } from '../rooms/rooms.service';
import { AvailabilityRepository } from './availability.repository';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { UpsertAvailabilityDto } from './dto/upsert-availability.dto';
import { AvailabilityStrategyFactory } from './availability-strategy.factory';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly availability: AvailabilityRepository,
    private readonly strategyFactory: AvailabilityStrategyFactory,
  ) {}

  async check(dto: CheckAvailabilityDto) {
    const room = await this.roomsService.findById(dto.roomId);
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    assertValidDateRange(checkIn, checkOut);

    if (!room.isActive) {
      throw new BadRequestException('Las habitaciones inactivas no pueden reservarse.');
    }

    const context = { room, checkIn, checkOut };
    const strategy = this.strategyFactory.resolve(context);

    return strategy.validate(context);
  }

  async upsert(dto: UpsertAvailabilityDto) {
    const room = await this.roomsService.findById(dto.roomId);

    return this.availability.upsert({
      room,
      date: new Date(dto.date),
      isBlocked: dto.isBlocked,
      reason: dto.reason,
    });
  }

  findByRoom(roomId: string) {
    return this.availability.findByRoom(roomId);
  }
}
