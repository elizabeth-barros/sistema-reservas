import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from '../modules/availability/entities/availability.entity';
import { Reservation } from '../modules/reservations/entities/reservation.entity';
import { Room } from '../modules/rooms/entities/room.entity';
import { User } from '../modules/users/entities/user.entity';
import { LocalSeedService } from './local-seed.service';

const entities = [User, Room, Reservation, Availability];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        if (config.get<string>('DATABASE_TYPE', 'sqljs') === 'postgres') {
          const databaseUrl = config.get<string>('DATABASE_URL');
          const useSsl = config.get<string>('DATABASE_SSL', databaseUrl ? 'true' : 'false') === 'true';

          return {
            type: 'postgres',
            ...(databaseUrl
              ? { url: databaseUrl }
              : {
                  host: config.get<string>('DATABASE_HOST', 'localhost'),
                  port: config.get<number>('DATABASE_PORT', 5432),
                  username: config.get<string>('DATABASE_USER', 'postgres'),
                  password: config.get<string>('DATABASE_PASSWORD', 'postgres'),
                  database: config.get<string>('DATABASE_NAME', 'hotel_reservations'),
                }),
            ssl: useSsl ? { rejectUnauthorized: false } : false,
            entities,
            synchronize: true,
          };
        }

        return {
          type: 'sqljs',
          location: config.get<string>('DATABASE_FILE', 'data/hotel-reservations.sqlite'),
          autoSave: true,
          entities,
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([User, Room]),
  ],
  providers: [LocalSeedService],
})
export class DatabaseModule {}
