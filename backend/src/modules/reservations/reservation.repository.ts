import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationRepository {
  constructor(
    @InjectRepository(Reservation)
    private readonly repository: Repository<Reservation>,
  ) {}

  create(data: Partial<Reservation>): Reservation {
    return this.repository.create(data);
  }

  save(reservation: Reservation): Promise<Reservation> {
    return this.repository.save(reservation);
  }

  findAll(): Promise<Reservation[]> {
    return this.repository.find({
      relations: { room: true, user: true },
      order: { createdAt: 'DESC' },
    });
  }

  findByUser(userId: string): Promise<Reservation[]> {
    return this.repository.find({
      where: { user: { id: userId } },
      relations: { room: true },
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<Reservation | null> {
    return this.repository.findOne({ where: { id }, relations: { room: true, user: true } });
  }

  findConflicting(roomId: string, checkIn: Date, checkOut: Date): Promise<Reservation[]> {
    return this.repository
      .createQueryBuilder('reservation')
      .where('reservation.room_id = :roomId', { roomId })
      .andWhere('reservation.status != :cancelled', { cancelled: ReservationStatus.Cancelled })
      .andWhere('reservation.check_in < :checkOut', { checkOut })
      .andWhere('reservation.check_out > :checkIn', { checkIn })
      .getMany();
  }

  countActiveByRoom(roomId: string): Promise<number> {
    return this.repository.count({
      where: {
        room: { id: roomId },
        status: Not(ReservationStatus.Cancelled),
      },
    });
  }
}
