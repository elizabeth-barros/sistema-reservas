import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';

@Entity('availability')
@Unique('uq_availability_room_date', ['room', 'date'])
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room, (room) => room.availability, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Index()
  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'is_blocked', default: false })
  isBlocked: boolean;

  @Column({ nullable: true })
  reason?: string;
}
