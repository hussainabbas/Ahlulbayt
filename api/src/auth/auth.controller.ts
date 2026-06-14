import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import {
  AppleAuthDto,
  ForgotPasswordDto,
  GoogleAuthDto,
  GuestMergeDto,
  LoginDto,
  RefreshDto,
  RegisterDto,
  ResetPasswordDto,
  SendOtpDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthTokenPayload } from './token.service';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('guest')
  createGuest() {
    return this.auth.createGuest();
  }

  @Post('google')
  @HttpCode(200)
  google(@Body() dto: GoogleAuthDto) {
    return this.auth.googleAuth(dto);
  }

  @Post('apple')
  @HttpCode(200)
  apple(@Body() dto: AppleAuthDto) {
    return this.auth.appleAuth(dto);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logout(@Body() dto: RefreshDto) {
    return this.auth.logout(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthTokenPayload) {
    return this.auth.getMe(user.sub);
  }

  @Post('password/forgot')
  @HttpCode(200)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.email);
  }

  @Post('password/reset')
  @HttpCode(200)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto);
  }

  @Post('otp/send')
  @HttpCode(200)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  sendOtp(@Body() dto: SendOtpDto) {
    return this.auth.sendOtp(dto);
  }

  @Post('otp/verify')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtpAndLogin(dto.email, dto.code, dto.purpose);
  }

  @Post('guest/merge')
  @UseGuards(JwtAuthGuard)
  mergeGuest(@CurrentUser() user: AuthTokenPayload, @Body() dto: GuestMergeDto) {
    return this.auth.mergeGuest(user.sub, dto);
  }
}
