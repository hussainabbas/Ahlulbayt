import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { and, eq, isNull } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { generateOpaqueToken, hashToken } from '../common/crypto.util';
import { DRIZZLE, DrizzleDB } from '../database/database.module';
import { refreshTokens, User } from '../database/schema';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthTokenPayload {
  sub: string;
  email: string | null;
  tier: string;
  role: string;
  isGuest: boolean;
  jti: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  async issueTokens(user: User): Promise<TokenPair> {
    const jti = uuidv4();
    const refreshDays = 30;

    const payload: AuthTokenPayload = {
      sub: user.id,
      email: user.email,
      tier: user.tier,
      role: user.role,
      isGuest: user.isAnonymous,
      jti,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: 900,
    });

    const refreshToken = generateOpaqueToken();
    const familyId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + refreshDays);

    await this.db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      familyId,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const tokenHash = hashToken(refreshToken);
    const [stored] = await this.db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.tokenHash, tokenHash), isNull(refreshTokens.revokedAt)))
      .limit(1);

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, stored.id));

    const { users } = await import('../database/schema');
    const [user] = await this.db.select().from(users).where(eq(users.id, stored.userId)).limit(1);
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found');
    }

    return this.issueTokens(user);
  }

  async revoke(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.tokenHash, tokenHash));
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));
  }
}
