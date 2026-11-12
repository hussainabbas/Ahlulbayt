import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, timingSafeEqual } from 'crypto';

/**
 * Store webhooks change subscription state, so they must not be callable by
 * anyone who can guess a transaction id.
 *
 * Configure the notification URL in App Store Connect / Google Pub/Sub as
 *   https://<api>/v1/webhooks/<store>?token=<WEBHOOK_TOKEN>
 *
 * This is a shared-secret gate, not a replacement for verifying Apple's signed
 * payload (JWS) or Google's Pub/Sub identity token — see docs/audit.
 */
@Injectable()
export class WebhookTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.config.get<string>('WEBHOOK_TOKEN');
    if (!expected) {
      if (this.config.get<string>('NODE_ENV') === 'production') {
        throw new ServiceUnavailableException('Webhooks are not configured');
      }
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ query?: Record<string, unknown>; headers: Record<string, unknown> }>();
    const supplied = request.query?.token ?? request.headers['x-webhook-token'];

    if (typeof supplied !== 'string' || !sameSecret(supplied, expected)) {
      throw new UnauthorizedException();
    }
    return true;
  }
}

function sameSecret(a: string, b: string): boolean {
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}
