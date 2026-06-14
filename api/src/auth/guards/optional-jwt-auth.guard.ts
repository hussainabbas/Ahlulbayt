import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isObservable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

import { AuthTokenPayload } from '../token.service';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = super.canActivate(context);
      if (result instanceof Promise) {
        await result;
      } else if (isObservable(result)) {
        await firstValueFrom(result);
      }
    } catch {
      // No token or invalid token — allow anonymous ingest
    }
    return true;
  }

  handleRequest<TUser = AuthTokenPayload>(
    err: Error | null,
    user: TUser | false,
  ): TUser | null {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
