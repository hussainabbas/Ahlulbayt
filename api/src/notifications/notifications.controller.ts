import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthTokenPayload } from '../auth/token.service';
import { RegisterDeviceDto, UpdateNotificationPrefsDto } from './dto/notifications.dto';
import { NotificationsService } from './notifications.service';

@Controller('v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Post('devices')
  registerDevice(@CurrentUser() user: AuthTokenPayload, @Body() dto: RegisterDeviceDto) {
    return this.notifications.registerDevice(user.sub, dto);
  }

  @Get('devices')
  listDevices(@CurrentUser() user: AuthTokenPayload) {
    return this.notifications.listDevices(user.sub);
  }

  @Get('preferences')
  getPreferences(@CurrentUser() user: AuthTokenPayload) {
    return this.notifications.getPreferences(user.sub);
  }

  @Put('preferences')
  updatePreferences(
    @CurrentUser() user: AuthTokenPayload,
    @Body() dto: UpdateNotificationPrefsDto,
  ) {
    return this.notifications.updatePreferences(user.sub, dto);
  }
}
