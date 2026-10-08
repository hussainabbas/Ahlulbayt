import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import appleSignin from 'apple-signin-auth';
import { OAuth2Client } from 'google-auth-library';

export interface OAuthProfile {
  provider: 'google' | 'apple';
  providerId: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  avatarUrl: string | null;
}

@Injectable()
export class OAuthService {
  private googleClient: OAuth2Client;

  constructor(private readonly config: ConfigService) {
    this.googleClient = new OAuth2Client(config.get('GOOGLE_CLIENT_ID'));
  }

  async verifyGoogle(idToken: string): Promise<OAuthProfile> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.config.get('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      if (!payload?.sub) {
        throw new UnauthorizedException('Invalid Google token');
      }
      return {
        provider: 'google',
        providerId: payload.sub,
        email: payload.email ?? null,
        emailVerified: payload.email_verified ?? false,
        displayName: payload.name ?? null,
        avatarUrl: payload.picture ?? null,
      };
    } catch {
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async verifyApple(identityToken: string): Promise<OAuthProfile> {
    try {
      const payload = await appleSignin.verifyIdToken(identityToken, {
        audience: this.config.get('APPLE_CLIENT_ID'),
        ignoreExpiration: false,
      });
      return {
        provider: 'apple',
        providerId: payload.sub,
        email: payload.email ?? null,
        emailVerified: payload.email_verified === 'true' || payload.email_verified === true,
        displayName: null,
        avatarUrl: null,
      };
    } catch {
      throw new UnauthorizedException('Apple authentication failed');
    }
  }
}
