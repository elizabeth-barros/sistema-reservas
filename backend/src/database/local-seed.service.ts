import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { Room } from '../modules/rooms/entities/room.entity';
import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class LocalSeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Room)
    private readonly rooms: Repository<Room>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
    await this.seedRooms();
  }

  private async seedAdmin() {
    const email = 'admin@hotel.com';
    const existing = await this.users.findOne({ where: { email } });

    if (existing) {
      return;
    }

    await this.users.save(
      this.users.create({
        name: 'Administrador Local',
        email,
        passwordHash: await bcrypt.hash('123456', 10),
        role: UserRole.Admin,
      }),
    );
  }

  private async seedRooms() {
    const count = await this.rooms.count();

    if (count > 0) {
      return;
    }

    await this.rooms.save([
      this.rooms.create({
        name: 'Suite Vista Mar',
        description: 'Habitacion amplia con balcon, cama king y vista exterior.',
        capacity: 2,
        pricePerNight: 180,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      }),
      this.rooms.create({
        name: 'Habitacion Familiar',
        description: 'Espacio comodo para familias con dos camas dobles y escritorio.',
        capacity: 4,
        pricePerNight: 220,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      }),
      this.rooms.create({
        name: 'Habitacion Ejecutiva',
        description: 'Habitacion silenciosa para viajes de trabajo con zona de lectura.',
        capacity: 1,
        pricePerNight: 140,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1598928636135-d146006ff4be',
      }),
    ]);
  }
}
