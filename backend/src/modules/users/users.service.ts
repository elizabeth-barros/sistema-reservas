import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly users: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El correo ya esta registrado.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.users.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash,
    });

    return this.users.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.findByEmail(email.toLowerCase());
  }

  async findById(id: string): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return user;
  }
}
