import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AvailabilityService } from './availability.service';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { UpsertAvailabilityDto } from './dto/upsert-availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  check(@Query() dto: CheckAvailabilityDto) {
    return this.availabilityService.check(dto);
  }

  @Get('room')
  findByRoom(@Query('roomId') roomId: string) {
    return this.availabilityService.findByRoom(roomId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.Admin)
  @Post()
  upsert(@Body() dto: UpsertAvailabilityDto) {
    return this.availabilityService.upsert(dto);
  }
}
