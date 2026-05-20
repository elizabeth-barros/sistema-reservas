import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly rooms: RoomRepository) {}

  findAll(includeInactive = false): Promise<Room[]> {
    return this.rooms.findAll(includeInactive);
  }

  async findById(id: string): Promise<Room> {
    const room = await this.rooms.findById(id);
    if (!room) {
      throw new NotFoundException('Habitacion no encontrada.');
    }

    return room;
  }

  create(dto: CreateRoomDto): Promise<Room> {
    return this.rooms.save(this.rooms.create({ ...dto, isActive: dto.isActive ?? true }));
  }

  async update(id: string, dto: UpdateRoomDto): Promise<Room> {
    const room = await this.findById(id);
    Object.assign(room, dto);
    return this.rooms.save(room);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.rooms.delete(id);
  }
}
