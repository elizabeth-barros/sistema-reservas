import { IsDateString, IsUUID } from 'class-validator';

export class CheckAvailabilityDto {
  @IsUUID()
  roomId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;
}
