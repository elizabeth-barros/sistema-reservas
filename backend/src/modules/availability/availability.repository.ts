import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from './entities/availability.entity';

@Injectable()
export class AvailabilityRepository {
  constructor(
    @InjectRepository(Availability)
    private readonly repository: Repository<Availability>,
  ) {}

  findBlockedInRange(roomId: string, checkIn: Date, checkOut: Date): Promise<Availability[]> {
    return this.repository
      .createQueryBuilder('availability')
      .where('availability.room_id = :roomId', { roomId })
      .andWhere('availability.is_blocked = true')
      .andWhere('availability.date >= :checkIn', { checkIn })
      .andWhere('availability.date < :checkOut', { checkOut })
      .getMany();
  }

  async upsert(data: Partial<Availability>): Promise<Availability> {
    const existing = await this.repository.findOne({
      where: { room: { id: data.room?.id }, date: data.date },
      relations: { room: true },
    });

    if (existing) {
      Object.assign(existing, data);
      return this.repository.save(existing);
    }

    return this.repository.save(this.repository.create(data));
  }

  findByRoom(roomId: string): Promise<Availability[]> {
    return this.repository.find({
      where: { room: { id: roomId } },
      order: { date: 'ASC' },
    });
  }
}
