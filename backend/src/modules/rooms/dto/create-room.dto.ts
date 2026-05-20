import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, IsUrl, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRoomDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUrl()
  imageUrl?: string;
}
