import { BadRequestException } from '@nestjs/common';

export function assertValidDateRange(checkIn: Date, checkOut: Date): void {
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    throw new BadRequestException('Las fechas no son validas.');
  }

  if (checkOut <= checkIn) {
    throw new BadRequestException('La fecha check_out debe ser posterior a check_in.');
  }
}

export function eachDateInRange(checkIn: Date, checkOut: Date): Date[] {
  const dates: Date[] = [];
  const cursor = new Date(checkIn);
  cursor.setUTCHours(0, 0, 0, 0);

  while (cursor < checkOut) {
    dates.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}
