import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { and, eq, isNull } from 'drizzle-orm';

import { generateOpaqueToken, hashToken } from '../common/crypto.util';
import { DRIZZLE, DrizzleDB } from '../database/database.module';
import {
  oauthAccounts,
  passwordResetTokens,
  User,
  users,
} from '../database/schema';

import {
  AppleAuthDto,
  GoogleAuthDto,
  GuestMergeDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { OAuthService } from './oauth.service';
import { OtpService } from './otp.service';
import { TokenPair, TokenService } from './token.service';

const BCRYPT_ROUNDS = 12;

export interface AuthResponse {
  user: PublicUser;
  tokens: TokenPair;
}

export interface PublicUser {
  id: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  avatarUrl: string | null;
  locale: string;
  tier: string;
  marja: string;
  isGuest: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly tokens: TokenService,
    private readonly oauth: OAuthService,
    private readonly otp: OtpService,
  ) {}

  toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      locale: user.locale,
      tier: user.tier,
      marja: user.marja,
      isGuest: user.isAnonymous,
    };
  }

  private async buildResponse(user: User): Promise<AuthResponse> {
    return {
      user: this.toPublicUser(user),
      tokens: await this.tokens.issueTokens(user),
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1);

    if (existing[0]) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const [user] = await this.db
      .insert(users)
      .values({
        email,
        passwordHash,
        displayName: dto.displayName ?? email.split('@')[0],
        locale: dto.locale ?? 'en',
        emailVerified: false,
      })
      .returning();

    if (!user) throw new BadRequestException('Registration failed');

    await this.otp.sendOtp(email, 'email_verify', user.id);
    return this.buildResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const email = dto.email.toLowerCase().trim();
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1);

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildResponse(user);
  }

  async createGuest(locale = 'en'): Promise<AuthResponse> {
    const [user] = await this.db
      .insert(users)
      .values({
        displayName: 'Guest',
        isAnonymous: true,
        locale,
        emailVerified: false,
      })
      .returning();

    if (!user) throw new BadRequestException('Guest creation failed');
    return this.buildResponse(user);
  }

  async googleAuth(dto: GoogleAuthDto): Promise<AuthResponse> {
    const profile = await this.oauth.verifyGoogle(dto.idToken);
    return this.oauthLoginOrRegister(profile);
  }

  async appleAuth(dto: AppleAuthDto): Promise<AuthResponse> {
    const profile = await this.oauth.verifyApple(dto.identityToken);
    if (dto.fullName && !profile.displayName) {
      profile.displayName = dto.fullName;
    }
    return this.oauthLoginOrRegister(profile);
  }

  private async oauthLoginOrRegister(profile: {
    provider: string;
    providerId: string;
    email: string | null;
    emailVerified: boolean;
    displayName: string | null;
    avatarUrl: string | null;
  }): Promise<AuthResponse> {
    const [linked] = await this.db
      .select({ user: users })
      .from(oauthAccounts)
      .innerJoin(users, eq(oauthAccounts.userId, users.id))
      .where(
        and(
          eq(oauthAccounts.provider, profile.provider),
          eq(oauthAccounts.providerId, profile.providerId),
          isNull(users.deletedAt),
        ),
      )
      .limit(1);

    if (linked?.user) {
      return this.buildResponse(linked.user);
    }

    let user: User | undefined;
    if (profile.email) {
      const [byEmail] = await this.db
        .select()
        .from(users)
        .where(and(eq(users.email, profile.email.toLowerCase()), isNull(users.deletedAt)))
        .limit(1);
      user = byEmail;
    }

    if (!user) {
      const [created] = await this.db
        .insert(users)
        .values({
          email: profile.email?.toLowerCase() ?? null,
          emailVerified: profile.emailVerified,
          displayName: profile.displayName ?? 'User',
          avatarUrl: profile.avatarUrl,
        })
        .returning();
      user = created;
    }

    if (!user) throw new BadRequestException('OAuth registration failed');

    await this.db.insert(oauthAccounts).values({
      userId: user.id,
      provider: profile.provider,
      providerId: profile.providerId,
    });

    return this.buildResponse(user);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const normalized = email.toLowerCase().trim();
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, normalized), isNull(users.deletedAt)))
      .limit(1);

    if (user) {
      const token = generateOpaqueToken();
      const expiresAt = new Date(Date.now() + 60 * 60_000);
      await this.db.insert(passwordResetTokens).values({
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt,
      });
      await this.otp.sendOtp(normalized, 'password_reset', user.id);
      if (process.env.NODE_ENV === 'development') {
        console.log(`[RESET] token for ${normalized}: ${token}`);
      }
    }

    return { message: 'If an account exists, reset instructions have been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const tokenHash = hashToken(dto.token);
    const [record] = await this.db
      .select()
      .from(passwordResetTokens)
      .where(and(eq(passwordResetTokens.tokenHash, tokenHash), isNull(passwordResetTokens.usedAt)))
      .limit(1);

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    await this.db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, record.userId));
    await this.db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, record.id));
    await this.tokens.revokeAllForUser(record.userId);

    return { message: 'Password updated successfully' };
  }

  async verifyOtpAndLogin(email: string, code: string, purpose: string): Promise<AuthResponse | { verified: true }> {
    await this.otp.verifyOtp(email, code, purpose);
    const normalized = email.toLowerCase().trim();

    if (purpose === 'email_verify') {
      await this.db
        .update(users)
        .set({ emailVerified: true, updatedAt: new Date() })
        .where(and(eq(users.email, normalized), isNull(users.deletedAt)));
      return { verified: true };
    }

    if (purpose === 'login' || purpose === 'password_reset') {
      const [user] = await this.db
        .select()
        .from(users)
        .where(and(eq(users.email, normalized), isNull(users.deletedAt)))
        .limit(1);
      if (!user) throw new UnauthorizedException('User not found');
      return this.buildResponse(user);
    }

    return { verified: true };
  }

  async getMe(userId: string): Promise<PublicUser> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.id, userId), isNull(users.deletedAt)))
      .limit(1);
    if (!user) throw new UnauthorizedException();
    return this.toPublicUser(user);
  }

  async mergeGuest(guestUserId: string, dto: GuestMergeDto): Promise<AuthResponse> {
    const [guest] = await this.db.select().from(users).where(eq(users.id, guestUserId)).limit(1);
    if (!guest?.isAnonymous) {
      throw new BadRequestException('Only guest accounts can be merged');
    }

    if (dto.googleIdToken) {
      const res = await this.googleAuth({ idToken: dto.googleIdToken });
      await this.db.update(users).set({ mergedIntoId: res.user.id, deletedAt: new Date() }).where(eq(users.id, guestUserId));
      return res;
    }
    if (dto.appleIdentityToken) {
      const res = await this.appleAuth({ identityToken: dto.appleIdentityToken });
      await this.db.update(users).set({ mergedIntoId: res.user.id, deletedAt: new Date() }).where(eq(users.id, guestUserId));
      return res;
    }
    if (dto.email && dto.password) {
      const res = await this.register({ email: dto.email, password: dto.password, displayName: guest.displayName ?? undefined });
      await this.db.update(users).set({ mergedIntoId: res.user.id, deletedAt: new Date() }).where(eq(users.id, guestUserId));
      return res;
    }

    throw new BadRequestException('Provide email/password or OAuth token to merge guest account');
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokens.revoke(refreshToken);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    return this.tokens.refresh(refreshToken);
  }

  async sendOtp(dto: { email: string; purpose: string }): Promise<{ message: string }> {
    const normalized = dto.email.toLowerCase().trim();
    let userId: string | undefined;
    if (dto.purpose !== 'email_verify') {
      const [user] = await this.db
        .select()
        .from(users)
        .where(and(eq(users.email, normalized), isNull(users.deletedAt)))
        .limit(1);
      userId = user?.id;
    }
    return this.otp.sendOtp(normalized, dto.purpose, userId);
  }
}
