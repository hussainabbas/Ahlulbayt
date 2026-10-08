export interface ApiResponse<T> {
  data: T;
  meta?: {
    cursor?: string;
    hasMore?: boolean;
  };
}

export interface ApiProblem {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
}

export interface UserProfile {
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

export interface HealthCheck {
  status: 'ok';
  version: string;
}
