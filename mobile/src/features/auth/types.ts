export interface AuthUser {
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

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: TokenPair;
}

export type OtpPurpose = 'email_verify' | 'login' | 'password_reset';
