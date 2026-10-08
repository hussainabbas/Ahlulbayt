import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthTokenPayload } from '../auth/token.service';
import { UpdatePreferencesDto, UpdateProfileDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('v1/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthTokenPayload) {
    return this.users.getProfile(user.sub);
  }

  @Patch('me')
  updateProfile(@CurrentUser() user: AuthTokenPayload, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(user.sub, dto);
  }

  @Patch('me/preferences')
  updatePreferences(@CurrentUser() user: AuthTokenPayload, @Body() dto: UpdatePreferencesDto) {
    return this.users.updatePreferences(user.sub, dto);
  }
}
