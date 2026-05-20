import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpsertAvailabilityDto {
  @IsUUID()
  roomId: string;

  @IsDateString()
  date: string;

  @IsBoolean()
  isBlocked: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}
