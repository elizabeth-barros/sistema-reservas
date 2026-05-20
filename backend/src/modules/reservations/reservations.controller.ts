import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { ReservationsService } from './reservations.service';

@UseGuards(AuthGuard('jwt'))
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('me')
  findMine(@CurrentUser() user: { id: string }) {
    return this.reservationsService.findByUser(user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateReservationDto) {
    return this.reservationsService.create(user.id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateReservationStatusDto) {
    return this.reservationsService.updateStatus(id, dto);
  }
}
