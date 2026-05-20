import { IsDateString, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  roomId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;
}
