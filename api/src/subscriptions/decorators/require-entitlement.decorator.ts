import { SetMetadata } from '@nestjs/common';

import type { EntitlementKey } from '../constants/products';

export const ENTITLEMENT_KEY = 'entitlement_key';

export const RequireEntitlement = (key: EntitlementKey) => SetMetadata(ENTITLEMENT_KEY, key);
