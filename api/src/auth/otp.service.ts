import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { and, desc, eq, gt, isNull } from 'drizzle-orm';

import { generateOtpCode, hashToken } from '../common/crypto.util';
import { DRIZZLE, DrizzleDB } from '../database/database.module';
import { otpCodes } from '../database/schema';

@Injectable()
export class OtpService {
  constructor(
    private readonly config: ConfigService,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  async sendOtp(email: string, purpose: string, userId?: string): Promise<{ message: string }> {
    const normalized = email.toLowerCase().trim();
    const expiresMinutes = Number(this.config.get('OTP_EXPIRES_MINUTES', 10));
    const maxAttempts = Number(this.config.get('OTP_MAX_ATTEMPTS', 5));

    const recent = await this.db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, normalized),
          eq(otpCodes.purpose, purpose),
          isNull(otpCodes.verifiedAt),
          gt(otpCodes.expiresAt, new Date()),
        ),
      )
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);

    if (recent[0] && recent[0].createdAt > new Date(Date.now() - 60_000)) {
      throw new HttpException('Please wait before requesting another code', HttpStatus.TOO_MANY_REQUESTS);
    }

    const code = generateOtpCode(6);
    const expiresAt = new Date(Date.now() + expiresMinutes * 60_000);

    await this.db.insert(otpCodes).values({
      userId: userId ?? null,
      email: normalized,
      codeHash: hashToken(code),
      purpose,
      expiresAt,
    });

    if (this.config.get('NODE_ENV') === 'development') {
      console.log(`[OTP] ${normalized} (${purpose}): ${code}`);
    }

    return {
      message: maxAttempts
        ? 'If an account exists, a verification code has been sent.'
        : 'Verification code sent.',
    };
  }

  async verifyOtp(email: string, code: string, purpose: string): Promise<boolean> {
    const normalized = email.toLowerCase().trim();
    const maxAttempts = Number(this.config.get('OTP_MAX_ATTEMPTS', 5));

    const [record] = await this.db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, normalized),
          eq(otpCodes.purpose, purpose),
          isNull(otpCodes.verifiedAt),
          gt(otpCodes.expiresAt, new Date()),
        ),
      )
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);

    if (!record) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    if (record.attempts >= maxAttempts) {
      throw new HttpException('Too many attempts. Request a new code.', HttpStatus.TOO_MANY_REQUESTS);
    }

    const valid = record.codeHash === hashToken(code);
    if (!valid) {
      await this.db
        .update(otpCodes)
        .set({ attempts: record.attempts + 1 })
        .where(eq(otpCodes.id, record.id));
      throw new UnauthorizedException('Invalid verification code');
    }

    await this.db
      .update(otpCodes)
      .set({ verifiedAt: new Date() })
      .where(eq(otpCodes.id, record.id));

    return true;
  }
}
